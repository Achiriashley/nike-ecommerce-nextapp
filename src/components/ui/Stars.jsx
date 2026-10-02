import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Stars({ value = 0, size = 14, className }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - n + 1));
        return (
          <span key={n} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-neutral-300" style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="text-ink" style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
