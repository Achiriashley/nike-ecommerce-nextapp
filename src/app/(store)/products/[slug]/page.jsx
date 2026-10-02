import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Check } from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import PurchasePanel from "@/components/product/PurchasePanel";
import Reviews from "@/components/product/Reviews";
import RecordView from "@/components/product/RecordView";
import ProductRail from "@/components/product/ProductRail";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import SectionHeading from "@/components/ui/SectionHeading";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/server/products";
import { formatDate, genderLabel } from "@/lib/format";

export const revalidate = 60;

// Pages render on first request, then are cached and revalidated.
export const generateStaticParams = async () => [];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const title = [product.title, product.colorway].filter(Boolean).join(" – ");
  return {
    title,
    description: product.description.slice(0, 160),
    openGraph: { title, images: product.image && !product.image.startsWith("data:") ? [product.image] : [] },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [all, related] = await Promise.all([getProducts(), getRelatedProducts(product)]);
  const colourways = all.filter((p) => p.title === product.title);

  const details = [
    ["Style", product.colorway || "—"],
    ["Category", product.category],
    ["For", genderLabel(product.gender)],
    ["Sizes", `US ${product.sizes[0]} – ${product.sizes[product.sizes.length - 1]}`],
    product.releasedAt && ["Released", formatDate(product.releasedAt)],
    ["Product code", product.slug.toUpperCase()],
  ].filter(Boolean);

  return (
    <>
      <RecordView product={product} />
      <div className="container pt-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-500">
          <Link href="/" className="hover:text-ink">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-ink">{product.category}</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="text-ink" aria-current="page">{product.title}</span>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
          <ProductGallery images={product.images} alt={`${product.title} in ${product.colorway || "its colourway"}`} />
          <PurchasePanel product={product} colourways={colourways} />
        </div>

        <div className="mt-16 grid gap-12 border-t pt-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-2xl font-semibold tracking-tight text-ink">About this shoe</h2>
            <p className="mt-4 whitespace-pre-line text-[16px] leading-relaxed text-neutral-700">{product.description}</p>
            {product.highlights.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 text-[15px] text-ink">
                    <Check className="h-4 w-4 shrink-0" aria-hidden /> {h}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section aria-labelledby="details-heading">
            <h2 id="details-heading" className="text-2xl font-semibold tracking-tight text-ink">Details</h2>
            <dl className="mt-4 divide-y rounded-2xl border">
              {details.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-3 text-[15px]">
                  <dt className="text-neutral-600">{k}</dt>
                  <dd className="text-right font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="mt-16 border-t pt-12">
          <Reviews product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="container mt-20" aria-labelledby="related-heading">
          <SectionHeading title={<span id="related-heading">You might also like</span>} />
          <ProductRail products={related} label="You might also like" />
        </section>
      )}

      <RecentlyViewed excludeSlug={product.slug} />
    </>
  );
}
