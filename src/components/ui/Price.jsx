import { cn } from "@/lib/utils";
import { discountPercent, formatPrice } from "@/lib/format";

export default function Price({ price, compareAtPrice, className, size = "md", showDiscount = true }) {
  const off = discountPercent(price, compareAtPrice);
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-semibold text-ink", size === "lg" ? "text-2xl" : "text-[15px]", off && "text-sale")}>
        {formatPrice(price)}
      </span>
      {off > 0 && (
        <>
          <span className={cn("text-neutral-500 line-through", size === "lg" ? "text-base" : "text-sm")}>
            <span className="sr-only">Was </span>
            {formatPrice(compareAtPrice)}
          </span>
          {showDiscount && <span className={cn("font-medium text-sale", size === "lg" ? "text-sm" : "text-xs")}>{off}% off</span>}
        </>
      )}
    </div>
  );
}
