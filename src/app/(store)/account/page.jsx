import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, Heart, MessageCircle } from "lucide-react";
import ProductImage from "@/components/ui/ProductImage";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { getShopper } from "@/lib/server/shopper";
import connectDB, { isDbConfigured } from "@/db/connectDB";
import Order from "@/model/Order";
import { syncCampayPayment } from "@/lib/server/campay";
import { formatDate, formatPrice } from "@/lib/format";
import { ORDER_STATUS_TONES, orderRef } from "@/lib/orders";

export const metadata = { title: "My account" };
export const dynamic = "force-dynamic";


const loadOrders = async (userId) => {
  if (!isDbConfigured()) return { orders: [], available: false };
  try {
    await connectDB();
    // Check any Campay payments still waiting for confirmation before listing orders.
    const waiting = await Order.find({ userId, status: "pending", gateway: "campay" }, { _id: 1 }).limit(5).lean();
    await Promise.all(waiting.map((o) => syncCampayPayment({ orderId: String(o._id) })));
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(50).lean();
    return { orders, available: true };
  } catch {
    return { orders: [], available: false };
  }
};

export default async function AccountPage() {
  const shopper = await getShopper();
  if (!shopper) redirect("/auth/signin?redirect_url=/account");
  const { orders, available } = await loadOrders(shopper.userId);

  return (
    <div className="container pt-8 md:pt-10">
      <div className="flex flex-wrap items-center gap-4">
        <span className="relative h-14 w-14 overflow-hidden rounded-full bg-surface">
          {shopper.image && <ProductImage src={shopper.image} alt="" sizes="56px" />}
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Hi, {shopper.name.split(" ")[0]}</h1>
          {shopper.email && <p className="text-neutral-600">{shopper.email}</p>}
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
        <section aria-labelledby="orders-heading">
          <h2 id="orders-heading" className="text-xl font-semibold text-ink">Your orders</h2>
          {!available ? (
            <p className="mt-4 rounded-2xl bg-surface p-5 text-sm text-neutral-700">Order history is unavailable right now. Please try again later.</p>
          ) : orders.length === 0 ? (
            <EmptyState className="mt-4" icon={Package} title="No orders yet" description="When you check out while signed in, your orders will appear here.">
              <Button asChild><Link href="/shop">Start shopping</Link></Button>
            </EmptyState>
          ) : (
            <ul className="mt-4 space-y-4">
              {orders.map((order) => (
                <li key={String(order._id)} className="rounded-2xl border p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                    <div className="text-sm">
                      <p className="font-semibold text-ink">Order {orderRef(order._id)}</p>
                      <p className="text-neutral-600">{formatDate(order.createdAt)} · {order.provider === "crypto" ? "Crypto" : "Mobile money"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone={ORDER_STATUS_TONES[order.status]} className="capitalize">{order.status}</Badge>
                      <span className="font-semibold text-ink">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                          <ProductImage src={item.image} alt="" sizes="56px" />
                        </span>
                        <div className="min-w-0 flex-1 text-sm">
                          <Link href={`/products/${item.slug}`} className="font-medium text-ink hover:underline">{item.title}</Link>
                          <p className="text-neutral-600">{[item.colorway, item.size && `Size ${item.size}`, `Qty ${item.quantity}`].filter(Boolean).join(" · ")}</p>
                        </div>
                        <span className="text-sm text-ink">{formatPrice(item.unitPrice * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  {order.status === "pending" && order.paymentUrl && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-soft p-3 text-sm">
                      <span className="text-ink">Payment not confirmed yet.</span>
                      <a href={order.paymentUrl} className="font-semibold text-ink underline underline-offset-4">Complete payment</a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        <aside className="space-y-3">
          {[
            { href: "/wishlist", icon: Heart, title: "Wishlist", text: "Pairs you’ve saved" },
            { href: "/contact", icon: MessageCircle, title: "Help", text: "Questions about an order?" },
          ].map(({ href, icon: Icon, title, text }) => (
            <Link key={href} href={href} className="flex items-center gap-4 rounded-2xl border p-4 transition hover:border-ink">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface"><Icon className="h-5 w-5" aria-hidden /></span>
              <span>
                <span className="block font-semibold text-ink">{title}</span>
                <span className="block text-sm text-neutral-600">{text}</span>
              </span>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
}
