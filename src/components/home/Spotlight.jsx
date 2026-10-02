import Link from "next/link";
import { Check } from "lucide-react";
import ProductImage from "@/components/ui/ProductImage";
import Price from "@/components/ui/Price";
import { Button } from "@/components/ui/button";

// Large editorial feature for one product family.
export default function Spotlight({ product, familyCount }) {
  const [main, second = main, third = main] = product.images;
  return (
    <section className="container mt-20" aria-labelledby="spotlight-heading">
      <div className="grid overflow-hidden rounded-[28px] bg-surface lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-2 p-2">
          <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[22px] bg-white">
            <ProductImage src={main} alt={`${product.title} in ${product.colorway}`} sizes="(min-width:1024px) 45vw, 95vw" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-[22px] bg-white">
            <ProductImage src={second} alt="" sizes="(min-width:1024px) 22vw, 47vw" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-[22px] bg-white">
            <ProductImage src={third} alt="" sizes="(min-width:1024px) 22vw, 47vw" />
          </div>
        </div>
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-brand-dark">In the spotlight</p>
          <h2 id="spotlight-heading" className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{product.title}</h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-neutral-700">{product.description}</p>
          {product.highlights?.length > 0 && (
            <ul className="mt-6 space-y-2.5">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-[15px] text-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white"><Check className="h-3 w-3" aria-hidden /></span>
                  {h}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
            {familyCount > 1 && <span className="text-sm text-neutral-600">{familyCount} colourways</span>}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href={`/products/${product.slug}`}>Shop now</Link></Button>
            {familyCount > 1 && (
              <Button asChild size="lg" variant="outline"><Link href={`/shop?q=${encodeURIComponent(product.title)}`}>See all colourways</Link></Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
