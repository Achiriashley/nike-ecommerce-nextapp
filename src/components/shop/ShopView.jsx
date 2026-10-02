"use client";
import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, SearchX, ChevronRight } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import Sheet from "@/components/ui/Sheet";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/input";
import FilterPanel from "./FilterPanel";
import { PRICE_BUCKETS, SORTS, applyFilters, readFilters, sortProducts, toSearch } from "./filters";
import { GENDERS } from "@/config/store";
import { POPULAR_SEARCHES } from "@/components/layout/nav";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

const headingFor = (f) => {
  if (f.q) return `Results for “${f.q}”`;
  const gender = f.gender.length === 1 ? GENDERS.find((g) => g.slug === f.gender[0])?.label : null;
  const category = f.category.length === 1 ? f.category[0] : null;
  if (f.sale) return [gender, "Sale"].filter(Boolean).join(" ");
  if (gender && category) return `${gender}'s ${category} Shoes`;
  if (gender) return gender === "Kids" ? "Kids' Shoes" : `${gender}'s Shoes`;
  if (category) return `${category} Shoes`;
  if (f.sort === "newest") return "New & Featured";
  return "All Shoes";
};

export default function ShopView({ products }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);

  const filters = useMemo(() => readFilters(params), [params]);
  const results = useMemo(() => sortProducts(applyFilters(products, filters), filters.sort), [products, filters]);

  const update = (next) => {
    setLimit(PAGE_SIZE);
    startTransition(() => router.replace(`${pathname}${toSearch(next)}`, { scroll: false }));
  };

  const chips = [
    filters.q && { label: `“${filters.q}”`, clear: { q: "" } },
    ...filters.gender.map((g) => ({ label: GENDERS.find((x) => x.slug === g)?.label ?? g, clear: { gender: filters.gender.filter((x) => x !== g) } })),
    ...filters.category.map((c) => ({ label: c, clear: { category: filters.category.filter((x) => x !== c) } })),
    ...filters.size.map((s) => ({ label: `Size ${s}`, clear: { size: filters.size.filter((x) => x !== s) } })),
    filters.price && { label: PRICE_BUCKETS.find((b) => b.id === filters.price)?.label, clear: { price: "" } },
    filters.sale && { label: "On sale", clear: { sale: false } },
  ].filter(Boolean);

  const clearAll = () => update({ q: "", gender: [], category: [], size: [], price: "", sale: false, sort: filters.sort });
  const activeCount = chips.length - (filters.q ? 1 : 0);

  return (
    <div className="container pt-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-neutral-500">
        <Link href="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href="/shop" className="hover:text-ink">Shop</Link>
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {headingFor(filters)} <span className="text-lg font-normal text-neutral-500 md:text-xl">({results.length})</span>
        </h1>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none lg:hidden" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal aria-hidden /> Filters{activeCount ? ` (${activeCount})` : ""}
          </Button>
          <label className="sr-only" htmlFor="sort">Sort by</label>
          <NativeSelect id="sort" value={filters.sort} onChange={(e) => update({ ...filters, sort: e.target.value })} wrapperClassName="flex-1 sm:w-56 sm:flex-none" className="rounded-full">
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </NativeSelect>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => update({ ...filters, ...chip.clear })}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface py-1.5 pl-3.5 pr-2.5 text-sm font-medium text-ink transition hover:bg-surface-strong"
            >
              {chip.label}
              <X className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">Remove filter</span>
            </button>
          ))}
          <button onClick={clearAll} className="ml-1 text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-ink">
            Clear all
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-[132px] max-h-[calc(100vh-150px)] overflow-y-auto pr-2 scrollbar-none">
            <FilterPanel products={products} filters={filters} onChange={update} />
          </div>
        </aside>

        <div aria-live="polite">
          {results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No shoes match those filters"
              description="Try removing a filter or searching for something else."
            >
              <Button onClick={clearAll}>Clear filters</Button>
              {POPULAR_SEARCHES.slice(0, 3).map((term) => (
                <Button key={term} variant="outline" onClick={() => update({ ...readFilters(new URLSearchParams()), q: term })}>
                  {term}
                </Button>
              ))}
            </EmptyState>
          ) : (
            <>
              <ProductGrid products={results.slice(0, limit)} priorityCount={4} className="lg:grid-cols-3 xl:grid-cols-4" />
              {results.length > limit && (
                <div className="mt-12 flex flex-col items-center gap-3">
                  <p className="text-sm text-neutral-600">Showing {limit} of {results.length}</p>
                  <div className="h-1 w-48 overflow-hidden rounded-full bg-surface">
                    <div className="h-full bg-ink" style={{ width: `${(limit / results.length) * 100}%` }} />
                  </div>
                  <Button variant="outline" onClick={() => setLimit((n) => n + PAGE_SIZE)}>Load more</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Sheet
        open={filtersOpen}
        onClose={closeFilters}
        side="left"
        title="Filters"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={clearAll} disabled={!activeCount}>Clear</Button>
            <Button onClick={closeFilters}>Show {results.length} results</Button>
          </div>
        }
      >
        <div className={cn("px-5")}>
          <FilterPanel products={products} filters={filters} onChange={update} />
        </div>
      </Sheet>
    </div>
  );
}
