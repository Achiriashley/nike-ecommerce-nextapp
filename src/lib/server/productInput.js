import "server-only";
import { slugify } from "@/lib/format";

const GENDERS = ["men", "women", "kids", "unisex"];
const MAX_IMAGE_LENGTH = 2_500_000; // ~1.8 MB uploaded image as a data URL

const isImageRef = (value) =>
  typeof value === "string" &&
  (value.startsWith("/") || /^https?:\/\//.test(value) || (value.startsWith("data:image/") && value.length <= MAX_IMAGE_LENGTH));

const list = (value) =>
  (Array.isArray(value) ? value : String(value ?? "").split(/[\n,]/))
    .map((v) => String(v).trim())
    .filter(Boolean);

// Validates admin product input. Returns { data } or { error }.
export const parseProductInput = (body) => {
  if (!body || typeof body !== "object") return { error: "Invalid request body" };
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const category = String(body.category ?? "").trim();
  const colorway = String(body.colorway ?? "").trim();
  const price = Number(body.price);
  const compareAtPrice = body.compareAtPrice === "" || body.compareAtPrice == null ? null : Number(body.compareAtPrice);
  const stock = body.stock === "" || body.stock == null ? null : Number(body.stock);
  const gender = String(body.gender ?? "").trim();
  const images = list(body.images);
  const image = String(body.image ?? "").trim() || images[0] || "";

  if (title.length < 2) return { error: "Title is required" };
  if (!Number.isFinite(price) || price <= 0) return { error: "Price must be a positive number" };
  if (compareAtPrice !== null && (!Number.isFinite(compareAtPrice) || compareAtPrice <= price))
    return { error: "Compare-at price must be higher than the price" };
  if (stock !== null && (!Number.isInteger(stock) || stock < 0)) return { error: "Stock must be a whole number" };
  if (!category) return { error: "Category is required" };
  if (!GENDERS.includes(gender)) return { error: "Choose who the product is for" };
  if (description.length < 10) return { error: "Description should be at least 10 characters" };
  if (!isImageRef(image)) return { error: "Add an image (upload under 1.8 MB, or a URL)" };
  if (images.some((i) => !isImageRef(i))) return { error: "One of the gallery images is not a valid URL" };

  const slug = slugify(body.slug || [title, colorway].filter(Boolean).join(" "));
  if (!slug) return { error: "Slug is required" };

  return {
    data: {
      title,
      colorway,
      price: String(price),
      compareAtPrice,
      stock,
      category,
      gender,
      description,
      image,
      images: images.length ? [image, ...images.filter((i) => i !== image)] : [image],
      sizes: list(body.sizes),
      highlights: list(body.highlights),
      featured: Boolean(body.featured),
      slug,
    },
  };
};
