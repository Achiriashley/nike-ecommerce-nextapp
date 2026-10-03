import Link from "next/link";
import { DollarSign, Receipt, Package, Mail, ArrowRight, Star } from "lucide-react";
import StatTile from "@/components/admin/StatTile";
import BarList from "@/components/admin/BarList";
import SourceNotice from "@/components/admin/SourceNotice";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/ui/ProductImage";
import { getCatalog } from "@/lib/server/products";
import { loadOrders, loadSubscribers } from "@/lib/server/adminData";
import { ORDER_STATUSES } from "@/model/Order";
import { ORDER_STATUS_TONES, orderRef } from "@/lib/orders";
import { formatDate, formatPrice } from "@/lib/format";

const PAID = ["paid", "shipped", "delivered"];

export default async function AdminOverview() {
  const [{ source, products }, { orders, available: ordersAvailable }, { subscribers }] = await Promise.all([
    getCatalog(),
    loadOrders(),
    loadSubscribers(),
  ]);

  const revenue = orders.filter((o) => PAID.includes(o.status)).reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const categories = Object.entries(products.reduce((acc, p) => ((acc[p.category] = (acc[p.category] ?? 0) + 1), acc), {}))
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  const statusRows = ORDER_STATUSES.map((s) => ({ label: s, value: orders.filter((o) => o.status === s).length })).filter((r) => r.value);
  const lowStock = products.filter((p) => p.stock !== null && p.stock <= 5).slice(0, 5);
  const topRated = products.filter((p) => p.reviewCount > 0).sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Overview</h1>
        <p className="mt-1 text-neutral-600">How the store is doing.</p>
      </div>

      <SourceNotice source={source} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Revenue" icon={DollarSign} value={formatPrice(revenue)} hint="Paid, shipped and delivered orders" />
        <StatTile label="Orders" icon={Receipt} value={orders.length} hint={ordersAvailable ? `${pending} awaiting payment` : "Database unavailable"} />
        <StatTile label="Products" icon={Package} value={products.length} hint={source === "database" ? "In your database" : "Starter catalog"} />
        <StatTile label="Subscribers" icon={Mail} value={subscribers.length} hint="Newsletter sign-ups" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarList title="Styles by category" rows={categories} />
        <BarList title="Orders by status" rows={statusRows} empty="No orders yet" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border bg-white" aria-labelledby="recent-orders">
          <div className="flex items-center justify-between border-b p-5">
            <h2 id="recent-orders" className="font-semibold text-ink">Recent orders</h2>
            <Link href="/admin/dashboard/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-brand-dark">All orders <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
          {orders.length === 0 ? (
            <p className="p-5 text-sm text-neutral-500">No orders yet. They’ll appear here when customers check out.</p>
          ) : (
            <ul className="divide-y">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{orderRef(o.id)}</p>
                    <p className="truncate text-neutral-500">{o.delivery?.name ?? o.email ?? "Guest"} · {formatDate(o.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={ORDER_STATUS_TONES[o.status]} className="capitalize">{o.status}</Badge>
                    <span className="w-20 text-right font-semibold tabular-nums text-ink">{formatPrice(o.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border bg-white p-5" aria-labelledby="low-stock">
            <h2 id="low-stock" className="font-semibold text-ink">Low stock</h2>
            {lowStock.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">Nothing is running low.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {lowStock.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 text-sm">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface"><ProductImage src={p.image} alt="" sizes="40px" /></span>
                    <span className="min-w-0 flex-1 truncate text-ink">{p.title} <span className="text-neutral-500">{p.colorway}</span></span>
                    <Badge tone={p.stock === 0 ? "sale" : "brand"}>{p.stock === 0 ? "Sold out" : `${p.stock} left`}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="rounded-2xl border bg-white p-5" aria-labelledby="top-rated">
            <h2 id="top-rated" className="font-semibold text-ink">Top rated</h2>
            {topRated.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">No reviews yet.</p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {topRated.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                    <Link href={`/products/${p.slug}`} className="min-w-0 truncate text-ink hover:underline">{p.title} · {p.colorway}</Link>
                    <span className="flex shrink-0 items-center gap-1 font-medium text-ink"><Star className="h-3.5 w-3.5 fill-ink" aria-hidden />{p.rating.toFixed(1)} <span className="font-normal text-neutral-500">({p.reviewCount})</span></span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
