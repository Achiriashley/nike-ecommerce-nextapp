import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

export default function ProductGrid({ products, className, priorityCount = 0 }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4", className)}>
      {products.map((p, i) => (
        <li key={p.slug}>
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
