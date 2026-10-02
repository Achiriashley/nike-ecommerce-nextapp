import { ProductCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container pt-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-9 w-64" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
