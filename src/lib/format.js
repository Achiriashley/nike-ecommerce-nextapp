import { CURRENCY_SYMBOL } from "@/config/store";

export const formatPrice = (value) => {
  const n = Number(value) || 0;
  return `${CURRENCY_SYMBOL}${n.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

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
