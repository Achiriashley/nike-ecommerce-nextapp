import "server-only";
import { getProducts } from "@/lib/server/products";
import { MAX_QUANTITY, PAYMENT_CURRENCY, shippingFor } from "@/config/store";
import connectDB, { isDbConfigured } from "@/db/connectDB";
import Order from "@/model/Order";

// Prices every line from the server-side catalog so totals can't be tampered with.
export const priceCart = async (items) => {
  if (!Array.isArray(items) || items.length === 0) return { error: "Your bag is empty" };
  const products = await getProducts();
  const lines = [];
  for (const raw of items) {
    const product = products.find((p) => p.slug === raw?.slug);
    if (!product) return { error: "An item in your bag is no longer available" };
    const quantity = Math.floor(Number(raw.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY)
      return { error: `Quantity must be between 1 and ${MAX_QUANTITY}` };
    if (raw.size && !product.sizes.includes(String(raw.size)))
      return { error: `Size ${raw.size} is not available for ${product.title}` };
    lines.push({
      slug: product.slug,
      title: product.title,
      colorway: product.colorway,
      image: product.image?.startsWith("data:") ? undefined : product.image,
      size: raw.size ? String(raw.size) : undefined,
      quantity,
      unitPrice: product.price,
    });
  }
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const shipping = shippingFor(subtotal);
  return { lines, subtotal, shipping, total: subtotal + shipping, currency: PAYMENT_CURRENCY };
};

// Records the order when a database is available. Payment still works without one.
export const createPendingOrder = async ({ priced, provider, userId, email }) => {
  if (!isDbConfigured()) return null;
  try {
    await connectDB();
    return await Order.create({
      userId: userId ?? undefined,
      email: email ?? undefined,
      items: priced.lines,
      subtotal: priced.subtotal,
      shipping: priced.shipping,
      total: priced.total,
      currency: priced.currency,
      provider,
    });
  } catch (error) {
    console.error("Could not record order:", error.message);
    return null;
  }
};

export const attachPaymentUrl = async (order, paymentUrl) => {
  if (!order) return;
  try {
    await Order.updateOne({ _id: order._id }, { paymentUrl });
  } catch (error) {
    console.error("Could not update order:", error.message);
  }
};

export const originOf = (request) => {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : new URL(request.url).origin;
};

// Removes an order whose payment link could not be created.
export const discardOrder = async (order) => {
  if (!order) return;
  try {
    await Order.deleteOne({ _id: order._id });
  } catch (error) {
    console.error("Could not discard order:", error.message);
  }
};
