import { Suspense } from "react";
import ShopView from "@/components/shop/ShopView";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { getProducts } from "@/lib/server/products";

export const revalidate = 60;

export const metadata = {
  title: "Shop all shoes",
  description: "Browse lifestyle, training, basketball and golf shoes. Filter by gender, size, price and offers.",
};

const Fallback = () => (
  <div className="container pt-16">
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  </div>
);

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <Suspense fallback={<Fallback />}>
      <ShopView products={products} />
    </Suspense>
  );
}
