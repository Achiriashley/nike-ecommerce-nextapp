import { matchesQuery } from "@/lib/search";
import { formatNumber, formatPrice } from "@/lib/format";

export const PRICE_BUCKETS = [
  { id: "under-60000", label: `Under ${formatPrice(60000)}`, test: (p) => p < 60000 },
  { id: "60000-90000", label: `${formatNumber(60000)} – ${formatPrice(90000)}`, test: (p) => p >= 60000 && p <= 90000 },
  { id: "over-90000", label: `Over ${formatPrice(90000)}`, test: (p) => p > 90000 },
];

export const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];

const list = (value) => (value ? value.split(",").filter(Boolean) : []);

export const readFilters = (params) => ({
  q: params.get("q") ?? "",
  gender: list(params.get("gender")),
  category: list(params.get("category")),
  size: list(params.get("size")),
  price: params.get("price") ?? "",
  sale: params.get("sale") === "1",
  sort: params.get("sort") ?? "featured",
});

export const toSearch = (f) => {
  const params = new URLSearchParams();
  if (f.q) params.set("q", f.q);
  if (f.gender.length) params.set("gender", f.gender.join(","));
  if (f.category.length) params.set("category", f.category.join(","));
  if (f.size.length) params.set("size", f.size.join(","));
  if (f.price) params.set("price", f.price);
  if (f.sale) params.set("sale", "1");
  if (f.sort && f.sort !== "featured") params.set("sort", f.sort);
  const s = params.toString();
  return s ? `?${s}` : "";
};

const genderMatches = (product, genders) =>
  !genders.length || genders.includes(product.gender) || (product.gender === "unisex" && genders.some((g) => g !== "kids"));

// Applies every filter except `skip`, so facet counts reflect the other active filters.
export const applyFilters = (products, f, skip) =>
  products.filter(
    (p) =>
      (skip === "q" || !f.q || matchesQuery(p, f.q)) &&
      (skip === "gender" || genderMatches(p, f.gender)) &&
      (skip === "category" || !f.category.length || f.category.includes(p.category)) &&
      (skip === "size" || !f.size.length || f.size.some((s) => p.sizes.includes(s))) &&
      (skip === "price" || !f.price || PRICE_BUCKETS.find((b) => b.id === f.price)?.test(p.price)) &&
      (skip === "sale" || !f.sale || p.compareAtPrice > p.price)
  );

export const sortProducts = (products, sort) => {
  const list = [...products];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => new Date(b.releasedAt ?? 0) - new Date(a.releasedAt ?? 0));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);
    default:
      return list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
};
