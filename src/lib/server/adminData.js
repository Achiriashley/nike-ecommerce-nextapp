import "server-only";
import connectDB, { isDbConfigured } from "@/db/connectDB";
import Order from "@/model/Order";
import Subscriber from "@/model/Subscriber";

const serializeOrder = (o) => ({
  id: String(o._id),
  email: o.email ?? null,
  userId: o.userId ?? null,
  items: o.items.map((i) => ({ ...i })),
  subtotal: o.subtotal,
  shipping: o.shipping,
  total: o.total,
  currency: o.currency,
  provider: o.provider,
  status: o.status,
  paymentUrl: o.paymentUrl ?? null,
  createdAt: o.createdAt?.toISOString() ?? null,
});

// Each loader returns { available: false } instead of throwing when MongoDB is down.
export const loadOrders = async (limit = 200) => {
  if (!isDbConfigured()) return { available: false, orders: [] };
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).limit(limit).lean();
    return { available: true, orders: orders.map(serializeOrder) };
  } catch {
    return { available: false, orders: [] };
  }
};

export const loadSubscribers = async () => {
  if (!isDbConfigured()) return { available: false, subscribers: [] };
  try {
    await connectDB();
    const subs = await Subscriber.find().sort({ createdAt: -1 }).limit(500).lean();
    return {
      available: true,
      subscribers: subs.map((s) => ({ id: String(s._id), email: s.email, createdAt: s.createdAt?.toISOString() ?? null })),
    };
  } catch {
    return { available: false, subscribers: [] };
  }
};
