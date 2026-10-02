"use client";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { useStoreFavorite } from "@/store/favorite.store";
import { useHydrated } from "@/store/hydration.store";
import { cn } from "@/lib/utils";

export default function WishlistButton({ product, variant = "floating", className }) {
  const hydrated = useHydrated();
  const saved = useStoreFavorite((s) => s.items.some((i) => i.slug === product.slug));
  const toggle = useStoreFavorite((s) => s.toggle);
  const active = hydrated && saved;

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(product);
    toast(added ? "Saved to your wishlist" : "Removed from your wishlist", { toastId: `wish-${product.slug}` });
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "inline-flex h-14 items-center justify-center gap-2 rounded-full border border-input bg-white px-6 text-base font-semibold text-ink transition hover:border-ink",
          className
        )}
      >
        <Heart className={cn("h-5 w-5", active && "fill-sale text-sale")} aria-hidden />
        {active ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white",
        className
      )}
    >
      <Heart className={cn("h-[18px] w-[18px] transition", active && "fill-sale text-sale")} aria-hidden />
    </button>
  );
}
