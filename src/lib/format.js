import { CURRENCY_LABEL } from "@/config/store";

// 72000 -> "72 000 FCFA". Grouping is done by hand (with no-break spaces) so the
// server and every browser render exactly the same text.
export const formatNumber = (value) => {
  const n = Math.round(Number(value) || 0);
  return `${n < 0 ? "-" : ""}${String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")}`;
};

export const formatPrice = (value) => `${formatNumber(value)}\u00a0${CURRENCY_LABEL}`;

export const discountPercent = (price, compareAtPrice) =>
  compareAtPrice && compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

export const genderLabel = (gender) =>
  ({ men: "Men's Shoes", women: "Women's Shoes", kids: "Kids' Shoes", unisex: "Unisex Shoes" })[gender] ??
  "Shoes";

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
