import Link from "next/link";
import { Star } from "lucide-react";
import ProductImage from "@/components/ui/ProductImage";
import Price from "@/components/ui/Price";
import Badge from "@/components/ui/Badge";
import WishlistButton from "./WishlistButton";
import { discountPercent, genderLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const NEW_DAYS = 30;

export const isNew = (product) =>
  product.releasedAt && Date.now() - new Date(product.releasedAt).getTime() < NEW_DAYS * 864e5;

export default function ProductCard({ product, priority, className }) {
  const off = discountPercent(product.price, product.compareAtPrice);
  const hoverImage = product.images?.[1];
  const badge = off ? (
    <Badge tone="sale">-{off}%</Badge>
  ) : isNew(product) ? (
    <Badge tone="dark">New</Badge>
  ) : product.featured ? (
    <Badge>Bestseller</Badge>
  ) : null;

  return (
    <article className={cn("group relative", className)}>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
        <ProductImage
          src={product.image}
          alt={`${product.title}${product.colorway ? ` – ${product.colorway}` : ""}`}
          priority={priority}
          className={cn("transition duration-500 group-hover:scale-[1.03]", hoverImage && "group-hover:opacity-0")}
        />
        {hoverImage && (
          <ProductImage src={hoverImage} alt="" aria-hidden className="opacity-0 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" />
        )}
        {badge && <div className="pointer-events-none absolute left-3 top-3 z-10">{badge}</div>}
        <WishlistButton product={product} className="absolute right-3 top-3 z-20" />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-[15px] font-medium leading-snug text-ink">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 after:z-10 focus-visible:underline focus-visible:ring-0">
            {product.title}
          </Link>
        </h3>
        <p className="text-sm text-neutral-600">
          {[product.colorway, genderLabel(product.gender)].filter(Boolean).join(" · ")}
        </p>
        {product.reviewCount > 0 && (
          <p className="flex items-center gap-1 text-sm text-ink">
            <Star className="h-3.5 w-3.5 fill-ink" aria-hidden />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-neutral-500">({product.reviewCount})</span>
          </p>
        )}
        <Price price={product.price} compareAtPrice={product.compareAtPrice} className="pt-1" />
      </div>
    </article>
  );
}
