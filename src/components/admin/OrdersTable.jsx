"use client";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Receipt } from "lucide-react";
import { toast } from "react-toastify";
import EmptyState from "@/components/ui/EmptyState";
import { NativeSelect } from "@/components/ui/input";
import { ORDER_STATUS_TONES, orderRef } from "@/lib/orders";
import Badge from "@/components/ui/Badge";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function OrdersTable({ orders }) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const [saving, setSaving] = useState(null);

  const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const setStatus = async (order, status) => {
    setSaving(order.id);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(null);
    if (!res.ok) return toast.error("Could not update the order");
    toast.success(`${orderRef(order.id)} marked ${status}`);
    router.refresh();
  };

  return (
    <>
      <div className="scrollbar-none flex gap-2 overflow-x-auto" role="tablist" aria-label="Filter by status">
        {["all", ...STATUSES].map((s) => {
          const count = s === "all" ? orders.length : orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              role="tab"
              aria-selected={filter === s}
              onClick={() => setFilter(s)}
              className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize transition", filter === s ? "bg-ink text-white" : "bg-white text-neutral-700 hover:text-ink")}
            >
              {s} <span className={filter === s ? "text-white/70" : "text-neutral-400"}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
        {list.length === 0 ? (
          <EmptyState className="m-5" icon={Receipt} title="No orders here" description="Orders appear when customers start a checkout." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b bg-surface/60 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <tr>
                  <th scope="col" className="px-4 py-3">Order</th>
                  <th scope="col" className="px-4 py-3">Customer</th>
                  <th scope="col" className="px-4 py-3">Payment</th>
                  <th scope="col" className="px-4 py-3 text-right">Total</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Details</span></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {list.map((o) => (
                  <Fragment key={o.id}>
                    <tr className="hover:bg-surface/40">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{orderRef(o.id)}</p>
                        <p className="text-neutral-500">{formatDate(o.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3 text-neutral-700">{o.email ?? <span className="text-neutral-400">Guest</span>}</td>
                      <td className="px-4 py-3 text-neutral-700">
                        {o.provider === "crypto" ? "Crypto" : "Mobile money"}
                        {o.gateway && <span className="block text-xs capitalize text-neutral-500">{o.gateway}</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink">{formatPrice(o.total)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Badge tone={ORDER_STATUS_TONES[o.status]} className="hidden capitalize sm:inline-flex">{o.status}</Badge>
                          <label htmlFor={`status-${o.id}`} className="sr-only">Change status of {orderRef(o.id)}</label>
                          <NativeSelect id={`status-${o.id}`} value={o.status} disabled={saving === o.id} onChange={(e) => setStatus(o, e.target.value)} wrapperClassName="w-[130px]" className="h-9 text-sm capitalize">
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </NativeSelect>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setOpen(open === o.id ? null : o.id)} aria-expanded={open === o.id} className="rounded-full p-2 text-neutral-500 hover:bg-surface hover:text-ink" aria-label={`Show items in ${orderRef(o.id)}`}>
                          <ChevronDown className={cn("h-4 w-4 transition", open === o.id && "rotate-180")} />
                        </button>
                      </td>
                    </tr>
                    {open === o.id && (
                      <tr className="bg-surface/40">
                        <td colSpan={6} className="px-4 py-4">
                          <ul className="space-y-1.5">
                            {o.items.map((item, i) => (
                              <li key={i} className="flex justify-between gap-4">
                                <span className="text-ink">{item.quantity} × {item.title} <span className="text-neutral-500">{[item.colorway, item.size && `size ${item.size}`].filter(Boolean).join(", ")}</span></span>
                                <span className="tabular-nums text-ink">{formatPrice(item.unitPrice * item.quantity)}</span>
                              </li>
                            ))}
                            <li className="flex justify-between gap-4 border-t pt-1.5 text-neutral-600"><span>Delivery</span><span className="tabular-nums">{o.shipping ? formatPrice(o.shipping) : "Free"}</span></li>
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
