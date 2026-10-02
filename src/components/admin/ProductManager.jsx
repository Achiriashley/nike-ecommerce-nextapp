"use client";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Pencil, Trash2, ExternalLink, PackageOpen } from "lucide-react";
import { toast } from "react-toastify";
import Sheet from "@/components/ui/Sheet";
import ProductImage from "@/components/ui/ProductImage";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import ProductForm from "./ProductForm";
import { matchesQuery } from "@/lib/search";
import { formatPrice, genderLabel } from "@/lib/format";

export default function ProductManager({ products, source }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | product
  const close = useCallback(() => setEditing(null), []);
  const editable = source === "database";
  const canCreate = source !== "offline";

  const list = useMemo(() => products.filter((p) => matchesQuery(p, query)), [products, query]);

  const startCreate = () => {
    if (source === "catalog" && !confirm("Your store is currently showing the starter catalog. Once you add a product, the store will only show products from your database. Continue?")) return;
    setEditing("new");
  };

  const saved = (product) => {
    toast.success(editing === "new" ? `Created ${product.title}` : `Saved ${product.title}`);
    setEditing(null);
    router.refresh();
  };

  const remove = async (product) => {
    if (!confirm(`Delete “${product.title} – ${product.colorway}”? This can’t be undone.`)) return;
    const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(data.error || "Could not delete");
    toast.success("Product deleted");
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden />
          <label htmlFor="product-search" className="sr-only">Search products</label>
          <input
            id="product-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            className="h-11 w-full rounded-full border border-input bg-white pl-10 pr-4 text-[15px] outline-none focus:border-ink"
          />
        </div>
        <Button onClick={startCreate} disabled={!canCreate}><Plus aria-hidden /> New product</Button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
        {list.length === 0 ? (
          <EmptyState className="m-5" icon={PackageOpen} title={query ? "No matching products" : "No products yet"} description={query ? "Try a different search." : "Create your first product to get started."} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b bg-surface/60 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <tr>
                  <th scope="col" className="px-4 py-3">Product</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3 text-right">Price</th>
                  <th scope="col" className="px-4 py-3 text-right">Stock</th>
                  <th scope="col" className="px-4 py-3 text-right">Rating</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {list.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface"><ProductImage src={p.image} alt="" sizes="48px" /></span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{p.title}</p>
                          <p className="truncate text-neutral-500">{p.colorway || "—"}</p>
                        </div>
                        {p.featured && <Badge tone="muted">Featured</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{p.category}<span className="block text-xs text-neutral-500">{genderLabel(p.gender)}</span></td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className={p.compareAtPrice ? "font-medium text-sale" : "font-medium text-ink"}>{formatPrice(p.price)}</span>
                      {p.compareAtPrice && <span className="block text-xs text-neutral-500 line-through">{formatPrice(p.compareAtPrice)}</span>}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {p.stock === null ? <span className="text-neutral-400">—</span> : p.stock === 0 ? <Badge tone="sale">Sold out</Badge> : p.stock <= 5 ? <Badge tone="brand">{p.stock}</Badge> : p.stock}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-neutral-700">{p.reviewCount ? `${p.rating.toFixed(1)} (${p.reviewCount})` : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link href={`/products/${p.slug}`} target="_blank" className="rounded-full p-2 text-neutral-500 hover:bg-surface hover:text-ink" aria-label={`View ${p.title} in store`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        {editable && (
                          <>
                            <button onClick={() => setEditing(p)} className="rounded-full p-2 text-neutral-500 hover:bg-surface hover:text-ink" aria-label={`Edit ${p.title}`}>
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => remove(p)} className="rounded-full p-2 text-neutral-500 hover:bg-[#fdecea] hover:text-sale" aria-label={`Delete ${p.title}`}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Sheet open={Boolean(editing)} onClose={close} title={editing === "new" ? "New product" : "Edit product"} className="max-w-[560px]">
        {editing && <ProductForm key={editing === "new" ? "new" : editing.id} product={editing === "new" ? null : editing} onSaved={saved} onCancel={close} />}
      </Sheet>
    </>
  );
}
