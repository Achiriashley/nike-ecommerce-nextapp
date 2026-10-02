import ProductManager from "@/components/admin/ProductManager";
import SourceNotice from "@/components/admin/SourceNotice";
import { getCatalog } from "@/lib/server/products";

export const metadata = { title: "Products" };

export default async function AdminProducts() {
  const { source, products } = await getCatalog();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Products</h1>
        <p className="mt-1 text-neutral-600">{products.length} products{source === "database" ? "" : " (starter catalog, read-only)"}</p>
      </div>
      <SourceNotice source={source} />
      <ProductManager products={products} source={source} />
    </div>
  );
}
