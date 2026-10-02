"use client";
import { ChevronDown, Check } from "lucide-react";
import { PRICE_BUCKETS, applyFilters } from "./filters";
import { CATEGORIES, GENDERS } from "@/config/store";
import { ADULT_SIZES, KIDS_SIZES } from "@/data/catalog";
import { cn } from "@/lib/utils";

const Group = ({ title, children, defaultOpen = true }) => (
  <details open={defaultOpen} className="group border-b py-4 [&_summary::-webkit-details-marker]:hidden">
    <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-ink">
      {title}
      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
    </summary>
    <div className="mt-3">{children}</div>
  </details>
);

const CheckRow = ({ checked, onChange, label, count, type = "checkbox", name }) => (
  <label className={cn("flex cursor-pointer items-center gap-3 rounded-lg py-1.5 text-[15px]", count === 0 && !checked && "opacity-45")}>
    <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center border border-neutral-400 transition peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
        type === "radio" ? "rounded-full" : "rounded-md",
        checked && "border-ink bg-ink text-white"
      )}
      aria-hidden
    >
      {checked && (type === "radio" ? <span className="h-2 w-2 rounded-full bg-white" /> : <Check className="h-3.5 w-3.5" />)}
    </span>
    <span className="flex-1 text-ink">{label}</span>
    {count !== undefined && <span className="text-sm text-neutral-500">{count}</span>}
  </label>
);

export default function FilterPanel({ products, filters, onChange }) {
  const toggle = (key, value) =>
    onChange({ ...filters, [key]: filters[key].includes(value) ? filters[key].filter((v) => v !== value) : [...filters[key], value] });

  const forGender = applyFilters(products, filters, "gender");
  const forCategory = applyFilters(products, filters, "category");
  const forPrice = applyFilters(products, filters, "price");
  const forSale = applyFilters(products, filters, "sale");
  const sizes = filters.gender.length === 1 && filters.gender[0] === "kids" ? KIDS_SIZES : [...ADULT_SIZES, ...KIDS_SIZES];
  const forSize = applyFilters(products, filters, "size");

  const categories = [...new Set([...CATEGORIES.map((c) => c.slug), ...products.map((p) => p.category)])];

  return (
    <div>
      <Group title="Gender">
        {GENDERS.filter((g) => g.slug !== "unisex").map((g) => (
          <CheckRow
            key={g.slug}
            label={g.label}
            checked={filters.gender.includes(g.slug)}
            onChange={() => toggle("gender", g.slug)}
            count={applyFilters(forGender, { ...filters, gender: [g.slug] }, "none").length}
          />
        ))}
      </Group>
      <Group title="Category">
        {categories.map((c) => (
          <CheckRow
            key={c}
            label={c}
            checked={filters.category.includes(c)}
            onChange={() => toggle("category", c)}
            count={forCategory.filter((p) => p.category === c).length}
          />
        ))}
      </Group>
      <Group title="Price">
        {PRICE_BUCKETS.map((b) => (
          <CheckRow
            key={b.id}
            type="radio"
            name="price"
            label={b.label}
            checked={filters.price === b.id}
            onChange={() => onChange({ ...filters, price: filters.price === b.id ? "" : b.id })}
            count={forPrice.filter((p) => b.test(p.price)).length}
          />
        ))}
        {filters.price && (
          <button onClick={() => onChange({ ...filters, price: "" })} className="mt-1 text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-ink">
            Any price
          </button>
        )}
      </Group>
      <Group title="Size (US)">
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((s) => {
            const active = filters.size.includes(s);
            const available = forSize.some((p) => p.sizes.includes(s));
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => toggle("size", s)}
                className={cn(
                  "h-10 rounded-lg border text-sm font-medium transition",
                  active ? "border-ink bg-ink text-white" : "border-input text-ink hover:border-ink",
                  !available && !active && "opacity-40"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Group>
      <Group title="Offers">
        <CheckRow label="On sale" checked={filters.sale} onChange={() => onChange({ ...filters, sale: !filters.sale })} count={forSale.filter((p) => p.compareAtPrice > p.price).length} />
      </Group>
    </div>
  );
}
