import { Truck, CheckCircle2 } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/config/store";
import { formatPrice } from "@/lib/format";

export default function FreeShippingMeter({ subtotal }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div className="rounded-xl bg-surface p-4">
      <p className="flex items-center gap-2 text-sm text-ink">
        {remaining === 0 ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-success" aria-hidden />
            <span>You’ve unlocked <strong>free delivery</strong>.</span>
          </>
        ) : (
          <>
            <Truck className="h-4 w-4" aria-hidden />
            <span>Add <strong>{formatPrice(remaining)}</strong> more for free delivery.</span>
          </>
        )}
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Progress to free delivery">
        <div className="h-full rounded-full bg-ink transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
