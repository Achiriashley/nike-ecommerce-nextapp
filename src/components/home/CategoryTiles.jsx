import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductImage from "@/components/ui/ProductImage";

export default function CategoryTiles({ tiles }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {tiles.map((tile) => (
        <li key={tile.label}>
          <Link href={tile.href} className="group flex h-full flex-col rounded-2xl border bg-white p-3 transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-card">
            <span className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface">
              <ProductImage src={tile.image} alt="" sizes="(min-width:1024px) 16vw, 45vw" className="transition duration-500 group-hover:scale-105" />
            </span>
            <span className="mt-3 flex items-center justify-between gap-2 px-1">
              <span>
                <span className="block text-[15px] font-semibold text-ink">{tile.label}</span>
                <span className="block text-xs text-neutral-500">{tile.count} {tile.count === 1 ? "style" : "styles"}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 text-neutral-400 transition group-hover:text-ink" aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
