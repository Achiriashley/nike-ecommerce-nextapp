"use client";
import { useStoreRecent } from "@/store/recent.store";
import { useHydrated } from "@/store/hydration.store";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductRail from "./ProductRail";

export default function RecentlyViewed({ excludeSlug, className = "container mt-20" }) {
  const hydrated = useHydrated();
  const items = useStoreRecent((s) => s.items);
  const clear = useStoreRecent((s) => s.clear);
  const visible = items.filter((i) => i.slug !== excludeSlug);
  if (!hydrated || visible.length === 0) return null;
  return (
    <section className={className} aria-labelledby="recent-heading">
      <SectionHeading title={<span id="recent-heading">Recently viewed</span>}>
        <button onClick={clear} className="text-sm font-medium text-neutral-600 underline-offset-4 hover:text-ink hover:underline">
          Clear history
        </button>
      </SectionHeading>
      <ProductRail products={visible} label="Recently viewed" />
    </section>
  );
}
