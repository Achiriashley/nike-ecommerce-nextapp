import "server-only";
import { cache } from "react";
import connectDB, { isDbConfigured } from "@/db/connectDB";
import Product from "@/model/Product";
import Review from "@/model/Review";
import { catalog, ADULT_SIZES, KIDS_SIZES } from "@/data/catalog";

export const toNumber = (value) => {
  if (typeof value === "number") return value;
  const n = parseFloat(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const inferGender = (doc) => {
  if (doc.gender) return doc.gender;
  const text = `${doc.category ?? ""} ${doc.title ?? ""}`.toLowerCase();
  if (/kid|junior|jr\b|child/.test(text)) return "kids";
  if (/women|woman|female|ladies/.test(text)) return "women";
  if (/\bmen|\bman|male/.test(text)) return "men";
  return "unisex";
};

const inferCategory = (category) => {
  // Older products used free-text categories such as "men's Shoe".
  if (!category || /shoe/i.test(category)) return "Lifestyle";
  return category;
};

const toIso = (value) => (value ? new Date(value).toISOString() : null);

// Turns a Mongo document or catalog entry into the plain shape the UI uses.
export const normalizeProduct = (doc, ratings = {}) => {
  const gender = inferGender(doc);
  const images = doc.images?.length ? doc.images : [doc.image].filter(Boolean);
  const rating = ratings[doc.slug];
  return {
    id: doc._id ? String(doc._id) : doc.slug,
    slug: doc.slug,
    title: doc.title,
    colorway: doc.colorway ?? "",
    price: toNumber(doc.price),
    compareAtPrice: doc.compareAtPrice ? toNumber(doc.compareAtPrice) : null,
    category: inferCategory(doc.category),
    gender,
    image: doc.image || images[0] || "",
    images,
    sizes: doc.sizes?.length ? doc.sizes : gender === "kids" ? KIDS_SIZES : ADULT_SIZES,
    highlights: doc.highlights ?? [],
    description: doc.description ?? "",
    stock: typeof doc.stock === "number" ? doc.stock : null,
    featured: Boolean(doc.featured),
    releasedAt: toIso(doc.releasedAt ?? doc.createdAt),
    rating: rating ? Math.round(rating.avg * 10) / 10 : null,
    reviewCount: rating?.count ?? 0,
  };
};

const loadRatings = async () => {
  const rows = await Review.aggregate([
    { $group: { _id: "$productSlug", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(rows.map((r) => [r._id, { avg: r.avg, count: r.count }]));
};

const byNewest = (a, b) => new Date(b.releasedAt ?? 0) - new Date(a.releasedAt ?? 0);

/**
 * Returns every product plus where it came from:
 *  - "database": products stored in MongoDB
 *  - "catalog":  MongoDB is reachable but empty, so the starter catalog is shown
 *  - "offline":  MongoDB is not configured or unreachable
 */
export const getCatalog = cache(async () => {
  if (isDbConfigured()) {
    try {
      await connectDB();
      const [docs, ratings] = await Promise.all([Product.find().lean(), loadRatings()]);
      if (docs.length) {
        return { source: "database", products: docs.map((d) => normalizeProduct(d, ratings)).sort(byNewest) };
      }
      return { source: "catalog", products: catalog.map((d) => normalizeProduct(d, ratings)).sort(byNewest) };
    } catch (error) {
      console.error("Falling back to the starter catalog:", error.message);
    }
  }
  return { source: "offline", products: catalog.map((d) => normalizeProduct(d)).sort(byNewest) };
});

export const getProducts = async () => (await getCatalog()).products;

export const getProductBySlug = async (slug) =>
  (await getProducts()).find((p) => p.slug === slug) ?? null;

export const getRelatedProducts = async (product, limit = 8) => {
  const all = await getProducts();
  const score = (p) =>
    (p.title === product.title ? 3 : 0) + (p.category === product.category ? 2 : 0) + (p.gender === product.gender ? 1 : 0);
  return all
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
};
