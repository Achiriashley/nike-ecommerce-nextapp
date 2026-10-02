"use client";
import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import ProductImage from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { Input, Textarea, NativeSelect } from "@/components/ui/input";
import { CATEGORIES, GENDERS } from "@/config/store";
import { ADULT_SIZES, KIDS_SIZES } from "@/data/catalog";
import { slugify } from "@/lib/format";

const MAX_UPLOAD = 1.8 * 1024 * 1024;

const toForm = (p) => ({
  title: p?.title ?? "",
  colorway: p?.colorway ?? "",
  price: p?.price ?? "",
  compareAtPrice: p?.compareAtPrice ?? "",
  stock: p?.stock ?? "",
  category: p?.category ?? "Lifestyle",
  gender: p?.gender ?? "men",
  description: p?.description ?? "",
  highlights: (p?.highlights ?? []).join("\n"),
  sizes: (p?.sizes ?? ADULT_SIZES).join(", "),
  image: p?.image ?? "",
  images: (p?.images ?? []).filter((i) => i !== p?.image).join("\n"),
  featured: p?.featured ?? false,
  slug: p?.slug ?? "",
});

const Field = ({ label, htmlFor, hint, children, className }) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">{label}</label>
    <div className="mt-1.5">{children}</div>
    {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
  </div>
);

export default function ProductForm({ product, onSaved, onCancel }) {
  const [form, setForm] = useState(() => toForm(product));
  const [slugEdited, setSlugEdited] = useState(Boolean(product));
  const [state, setState] = useState({ saving: false, error: "" });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const autoSlug = slugify([form.title, form.colorway].filter(Boolean).join(" "));

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD) {
      setState({ saving: false, error: "Images must be under 1.8 MB. Use an image URL for larger files." });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const onGender = (e) => {
    const gender = e.target.value;
    setForm((f) => {
      const usingDefault = [ADULT_SIZES.join(", "), KIDS_SIZES.join(", ")].includes(f.sizes);
      return { ...f, gender, sizes: usingDefault ? (gender === "kids" ? KIDS_SIZES : ADULT_SIZES).join(", ") : f.sizes };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setState({ saving: true, error: "" });
    const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug: slugEdited ? form.slug : autoSlug }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setState({ saving: false, error: data.error || "Could not save the product" });
    setState({ saving: false, error: "" });
    onSaved(data);
  };

  return (
    <form onSubmit={submit} className="space-y-5 p-5">
      <div>
        <p className="text-sm font-semibold text-ink">Main image</p>
        <div className="mt-1.5 flex items-start gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border bg-surface">
            <ProductImage src={form.image} alt="Product image preview" sizes="96px" />
            {form.image && (
              <button type="button" onClick={() => setForm((f) => ({ ...f, image: "" }))} className="absolute right-1 top-1 rounded-full bg-white p-1 shadow" aria-label="Remove image">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-input px-4 py-2 text-sm font-semibold text-ink hover:border-ink">
              <Upload className="h-4 w-4" aria-hidden /> Upload
              <input type="file" accept="image/*" onChange={onFile} className="sr-only" />
            </label>
            <Input
              aria-label="Image URL"
              placeholder="…or paste an image URL"
              value={form.image.startsWith("data:") ? "" : form.image}
              onChange={set("image")}
              className="h-10 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="pf-title"><Input id="pf-title" required value={form.title} onChange={set("title")} placeholder="Air Force 1 '07" /></Field>
        <Field label="Colourway" htmlFor="pf-colorway"><Input id="pf-colorway" value={form.colorway} onChange={set("colorway")} placeholder="Triple White" /></Field>
        <Field label="Price (FCFA)" htmlFor="pf-price"><Input id="pf-price" required type="number" min="1" step="1" value={form.price} onChange={set("price")} /></Field>
        <Field label="Compare-at price (FCFA)" htmlFor="pf-compare" hint="Set higher than price to show a sale."><Input id="pf-compare" type="number" min="0" step="1" value={form.compareAtPrice ?? ""} onChange={set("compareAtPrice")} /></Field>
        <Field label="Category" htmlFor="pf-category">
          <Input id="pf-category" list="pf-categories" required value={form.category} onChange={set("category")} />
          <datalist id="pf-categories">{CATEGORIES.map((c) => <option key={c.slug} value={c.slug} />)}</datalist>
        </Field>
        <Field label="For" htmlFor="pf-gender">
          <NativeSelect id="pf-gender" value={form.gender} onChange={onGender}>
            {GENDERS.map((g) => <option key={g.slug} value={g.slug}>{g.label}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Stock" htmlFor="pf-stock" hint="Leave empty to not track stock."><Input id="pf-stock" type="number" min="0" step="1" value={form.stock ?? ""} onChange={set("stock")} /></Field>
        <Field label="Sizes" htmlFor="pf-sizes" hint="Comma separated."><Input id="pf-sizes" value={form.sizes} onChange={set("sizes")} /></Field>
      </div>

      <Field label="Description" htmlFor="pf-description"><Textarea id="pf-description" required rows={4} value={form.description} onChange={set("description")} /></Field>
      <Field label="Highlights" htmlFor="pf-highlights" hint="One per line, shown as bullet points."><Textarea id="pf-highlights" rows={3} className="min-h-0" value={form.highlights} onChange={set("highlights")} /></Field>
      <Field label="More images" htmlFor="pf-images" hint="Optional. One image URL per line."><Textarea id="pf-images" rows={2} className="min-h-0" value={form.images} onChange={set("images")} /></Field>
      <Field label="URL slug" htmlFor="pf-slug" hint={`/products/${slugEdited ? form.slug : autoSlug || "…"}`}>
        <Input id="pf-slug" value={slugEdited ? form.slug : autoSlug} onChange={(e) => { setSlugEdited(true); setForm((f) => ({ ...f, slug: e.target.value })); }} />
      </Field>

      <label className="flex items-center gap-3 rounded-xl border p-3 text-sm">
        <input type="checkbox" checked={form.featured} onChange={set("featured")} className="h-4 w-4 accent-ink" />
        <span><span className="font-semibold text-ink">Featured</span> <span className="text-neutral-600">— show in “Popular right now”</span></span>
      </label>

      {state.error && <p className="rounded-xl bg-[#fdecea] p-3 text-sm font-medium text-sale" role="alert">{state.error}</p>}

      <div className="sticky bottom-0 -mx-5 flex gap-3 border-t bg-white px-5 py-4">
        <Button type="submit" disabled={state.saving} className="flex-1">
          {state.saving && <Loader2 className="animate-spin" aria-hidden />} {product ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
