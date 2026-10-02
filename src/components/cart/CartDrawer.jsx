"use client";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, Trash2 } from "lucide-react";
import Sheet from "@/components/ui/Sheet";
import ProductImage from "@/components/ui/ProductImage";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import FreeShippingMeter from "./FreeShippingMeter";
import { useStoreCart } from "@/store/cart.store";
import { useCartLines } from "@/hooks/useCartLines";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const open = useStoreCart((s) => s.isDrawerOpen);
  const close = useStoreCart((s) => s.closeDrawer);
  const lastAddedKey = useStoreCart((s) => s.lastAddedKey);
  const removeItem = useStoreCart((s) => s.removeItem);
  const { lines, count, subtotal } = useCartLines();

  return (
    <Sheet
      open={open}
      onClose={close}
      title={count ? `Your bag (${count})` : "Your bag"}
      footer={
        lines.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-base">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" onClick={close}><Link href="/cart">View bag</Link></Button>
              <Button asChild onClick={close}><Link href="/cart#checkout">Checkout</Link></Button>
            </div>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <div className="p-5">
          <EmptyState icon={ShoppingBag} title="Your bag is empty" description="When you add shoes to your bag, they’ll show up here.">
            <Button asChild onClick={close}><Link href="/shop">Start shopping</Link></Button>
          </EmptyState>
        </div>
      ) : (
        <div className="space-y-5 p-5">
          <FreeShippingMeter subtotal={subtotal} />
          <ul className="space-y-4">
            {lines.map((line) => (
              <li key={line.key} className={cn("flex gap-4 rounded-xl p-2 transition-colors", line.key === lastAddedKey && "bg-brand-soft/60")}>
                <Link href={`/products/${line.slug}`} onClick={close} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface">
                  <ProductImage src={line.image} alt={line.title} sizes="96px" />
                </Link>
                <div className="min-w-0 flex-1">
                  {line.key === lastAddedKey && (
                    <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Added to bag
                    </p>
                  )}
                  <p className="truncate font-medium text-ink">{line.title}</p>
                  <p className="truncate text-sm text-neutral-600">{line.colorway}</p>
                  <p className="text-sm text-neutral-600">
                    Size {line.size ?? "—"} · Qty {line.quantity}
                  </p>
                  {!line.available && <p className="text-sm font-medium text-sale">No longer available</p>}
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="text-sm font-semibold text-ink">{formatPrice(line.price * line.quantity)}</span>
                  <button onClick={() => removeItem(line.key)} className="rounded-full p-1.5 text-neutral-500 hover:bg-surface hover:text-ink" aria-label={`Remove ${line.title} from bag`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Sheet>
  );
}
