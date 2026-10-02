import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import SearchBox from "@/components/layout/SearchBox";
import ProductImage from "@/components/ui/ProductImage";
import { POPULAR_SEARCHES } from "@/components/layout/nav";
import { formatPrice } from "@/lib/format";

export default function Hero({ spotlight, styleCount }) {
  return (
    <section className="container pt-4 md:pt-6">
      <div className="relative overflow-hidden rounded-[28px] bg-ink text-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-48 left-1/3 h-[420px] w-[420px] rounded-full bg-brand/10 blur-3xl" aria-hidden />
        <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:px-14 lg:py-20">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.14em] text-white/85">
              <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden /> New season, new pairs
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[64px]">
              Find the pair that <span className="text-brand">moves</span> with you.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/70">
              {styleCount} styles across lifestyle, training, basketball and golf, with sizes for the whole family.
            </p>
            <SearchBox className="mt-8 max-w-xl text-ink" />
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-white/60">Popular:</span>
              {POPULAR_SEARCHES.slice(0, 4).map((term) => (
                <Link
                  key={term}
                  href={`/shop?q=${encodeURIComponent(term)}`}
                  className="rounded-full border border-white/25 px-3 py-1 text-white/90 transition hover:border-white hover:bg-white hover:text-ink"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[460px] sm:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#e9e4dd]">
              <Image src="/products/lifestyle-1.webp" alt="Person sitting on a chair wearing a plaid jacket, jeans and sneakers" fill priority sizes="460px" className="object-cover" />
            </div>
            {spotlight && (
              <Link
                href={`/products/${spotlight.slug}`}
                className="absolute -left-6 bottom-8 flex w-64 items-center gap-3 rounded-2xl bg-white p-3 text-ink shadow-pop transition hover:-translate-y-0.5 lg:-left-12"
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
                  <ProductImage src={spotlight.image} alt="" sizes="64px" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-brand-dark">Trending now</span>
                  <span className="block truncate text-sm font-semibold">{spotlight.title}</span>
                  <span className="block text-sm text-neutral-600">{formatPrice(spotlight.price)}</span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
