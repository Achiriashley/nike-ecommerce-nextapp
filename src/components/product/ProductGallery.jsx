"use client";
import { useRef, useState } from "react";
import ProductImage from "@/components/ui/ProductImage";
import { cn } from "@/lib/utils";

export default function ProductGallery({ images, alt }) {
  const [index, setIndex] = useState(0);
  const scroller = useRef(null);
  const list = images.length ? images : [""];

  const onScroll = () => {
    const el = scroller.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="lg:grid lg:grid-cols-[76px_1fr] lg:gap-4">
      {/* Desktop thumbnails */}
      <ul className="hidden max-h-[640px] flex-col gap-2.5 overflow-y-auto scrollbar-none lg:flex" aria-label="Product images">
        {list.map((src, i) => (
          <li key={`${src}-${i}`}>
            <button
              type="button"
              onMouseEnter={() => setIndex(i)}
              onFocus={() => setIndex(i)}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={cn("relative block aspect-square w-full overflow-hidden rounded-lg bg-surface ring-offset-2 transition", i === index ? "ring-2 ring-ink" : "opacity-80 hover:opacity-100")}
            >
              <ProductImage src={src} alt="" sizes="76px" />
            </button>
          </li>
        ))}
      </ul>

      {/* Desktop main image */}
      <div className="relative hidden aspect-square overflow-hidden rounded-2xl bg-surface lg:block">
        <ProductImage key={list[index]} src={list[index]} alt={alt} priority sizes="(min-width:1280px) 640px, 55vw" className="animate-in fade-in duration-300" />
      </div>

      {/* Mobile swipe gallery */}
      <div className="-mx-4 sm:-mx-6 lg:hidden">
        <ul ref={scroller} onScroll={onScroll} className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto" aria-label="Product images">
          {list.map((src, i) => (
            <li key={`${src}-${i}`} className="relative aspect-square w-full shrink-0 snap-center bg-surface">
              <ProductImage src={src} alt={i === 0 ? alt : ""} priority={i === 0} sizes="100vw" />
            </li>
          ))}
        </ul>
        {list.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
            {list.map((_, i) => (
              <span key={i} className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-ink" : "w-1.5 bg-neutral-300")} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
