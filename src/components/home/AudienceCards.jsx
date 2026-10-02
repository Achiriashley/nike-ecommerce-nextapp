import Link from "next/link";
import ProductImage from "@/components/ui/ProductImage";

export default function AudienceCards({ cards }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <li key={card.label}>
          <Link href={card.href} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-surface md:aspect-[3/4]">
            <ProductImage src={card.image} alt="" sizes="(min-width:768px) 33vw, 100vw" className="transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" aria-hidden />
            <span className="absolute inset-x-6 bottom-6 flex items-end justify-between text-white">
              <span>
                <span className="block text-2xl font-semibold">{card.label}</span>
                <span className="block text-sm text-white/80">{card.count} styles</span>
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition group-hover:bg-brand">Shop</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
