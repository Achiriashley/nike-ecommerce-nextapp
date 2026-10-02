"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import ProductGrid from "./ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/button";
import { useStoreFavorite } from "@/store/favorite.store";
import { useHydrated } from "@/store/hydration.store";
import { useCatalog } from "@/hooks/useCatalog";

export default function WishlistView() {
  const hydrated = useHydrated();
  const items = useStoreFavorite((s) => s.items);
  const clear = useStoreFavorite((s) => s.clearFavorites);
  const { data: products, isSuccess } = useCatalog();

  // Show live product data where available (prices, images, ratings, sale state).
  const list = items.map((item) => (isSuccess && products.find((p) => p.slug === item.slug)) || { images: [], reviewCount: 0, ...item });

  return (
    <div className="container pt-8 md:pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Wishlist</h1>
          {hydrated && items.length > 0 && <p className="mt-1 text-neutral-600">{items.length} saved {items.length === 1 ? "item" : "items"}</p>}
        </div>
        {hydrated && items.length > 0 && (
          <button onClick={() => confirm("Remove everything from your wishlist?") && clear()} className="text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-ink">
            Clear wishlist
          </button>
        )}
      </div>
      <div className="mt-8">
        {!hydrated ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={Heart} title="Nothing saved yet" description="Tap the heart on any shoe to save it here for later.">
            <Button asChild><Link href="/shop">Discover shoes</Link></Button>
          </EmptyState>
        ) : (
          <ProductGrid products={list} />
        )}
      </div>
    </div>
  );
}
