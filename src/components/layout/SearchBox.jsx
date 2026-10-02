"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, ArrowUpRight } from "lucide-react";
import ProductImage from "@/components/ui/ProductImage";
import { useCatalog } from "@/hooks/useCatalog";
import { formatPrice } from "@/lib/format";
import { matchesQuery } from "@/lib/search";
import { POPULAR_SEARCHES } from "./nav";
import { cn } from "@/lib/utils";

export default function SearchBox({ className, onNavigate, autoFocus }) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef(null);
  const { data: products = [] } = useCatalog();

  const q = query.trim();
  const results = useMemo(
    () => (q ? products.filter((p) => matchesQuery(p, q)).slice(0, 6) : []),
    [products, q]
  );
  // Options: product results when typing, popular searches otherwise.
  const options = q ? results.map((p) => ({ type: "product", product: p })) : POPULAR_SEARCHES.map((term) => ({ type: "term", term }));

  useEffect(() => {
    const onDown = (e) => wrapRef.current && !wrapRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const go = (href) => {
    setOpen(false);
    setActive(-1);
    onNavigate?.();
    router.push(href);
  };

  const submit = (term = q) => go(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");

  const choose = (option) =>
    option.type === "product" ? go(`/products/${option.product.slug}`) : (setQuery(option.term), submit(option.term));

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" && active >= 0 && open) {
      e.preventDefault();
      choose(options[active]);
    }
  };

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex h-11 items-center rounded-full border border-input bg-white pl-4 pr-1 transition focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgba(17,17,17,.06)]"
      >
        <label htmlFor={`${listId}-input`} className="sr-only">Search shoes</label>
        <input
          id={`${listId}-input`}
          type="search"
          value={query}
          autoFocus={autoFocus}
          autoComplete="off"
          placeholder="Search shoes, styles, colours…"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-search-cancel-button]:hidden"
        />
        <button type="submit" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition hover:bg-ink-soft" aria-label="Search">
          <Search className="h-4 w-4" />
        </button>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border bg-white shadow-pop animate-in fade-in slide-in-from-top-1">
          <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {q ? (results.length ? "Products" : `No matches for “${q}”`) : "Popular searches"}
          </p>
          <ul id={listId} role="listbox" className="pb-2">
            {options.map((option, i) => (
              <li
                key={option.type === "product" ? option.product.slug : option.term}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={active === i}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(option)}
                className={cn("flex cursor-pointer items-center gap-3 px-4 py-2", active === i && "bg-surface")}
              >
                {option.type === "product" ? (
                  <>
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface">
                      <ProductImage src={option.product.image} alt="" sizes="44px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{option.product.title}</span>
                      <span className="block truncate text-xs text-neutral-500">{option.product.colorway}</span>
                    </span>
                    <span className="text-sm font-medium text-ink">{formatPrice(option.product.price)}</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 text-neutral-500" aria-hidden />
                    <span className="flex-1 text-sm text-ink">{option.term}</span>
                    <ArrowUpRight className="h-4 w-4 text-neutral-400" aria-hidden />
                  </>
                )}
              </li>
            ))}
          </ul>
          {q && (
            <button
              type="button"
              onClick={() => submit()}
              className="flex w-full items-center justify-between border-t px-4 py-3 text-left text-sm font-semibold text-ink hover:bg-surface"
            >
              See all results for “{q}”
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
