"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

// Horizontally scrolling row of product cards with arrow controls.
export default function ProductRail({ products, label = "Products" }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update, products]);

  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });

  return (
    <div className="relative">
      <ul
        ref={ref}
        onScroll={update}
        aria-label={label}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {products.map((p) => (
          <li key={p.slug} className="w-[66%] shrink-0 snap-start sm:w-[40%] md:w-[31%] lg:w-[calc(25%-12px)]">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      {[-1, 1].map((dir) => (
        <button
          key={dir}
          type="button"
          onClick={() => scroll(dir)}
          aria-label={dir < 0 ? "Scroll left" : "Scroll right"}
          className={cn(
            "absolute top-[38%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border bg-white text-ink shadow-card transition hover:scale-105 lg:flex",
            dir < 0 ? "-left-5" : "-right-5",
            (dir < 0 ? edges.start : edges.end) && "pointer-events-none opacity-0"
          )}
        >
          {dir < 0 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      ))}
    </div>
  );
}
