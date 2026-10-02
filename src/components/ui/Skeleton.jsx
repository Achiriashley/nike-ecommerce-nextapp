import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-lg bg-surface-strong/70", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <Skeleton className="mt-3 h-4 w-1/4" />
    </div>
  );
}
