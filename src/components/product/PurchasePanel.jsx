"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Truck, RotateCcw, ShieldCheck, Share2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import ProductImage from "@/components/ui/ProductImage";
import Price from "@/components/ui/Price";
import Stars from "@/components/ui/Stars";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import WishlistButton from "./WishlistButton";
import { useStoreCart } from "@/store/cart.store";
import { FREE_SHIPPING_THRESHOLD, RETURN_DAYS } from "@/config/store";
import { formatPrice, genderLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function PurchasePanel({ product, colourways }) {
  const [size, setSize] = useState(null);
  const [error, setError] = useState(false);
  const addItem = useStoreCart((s) => s.addItem);
  const soldOut = product.stock === 0;
  const lowStock = product.stock !== null && product.stock > 0 && product.stock <= 5;

  const add = () => {
    if (!size) {
      setError(true);
      document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    addItem(product, size, 1);
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, text: `${product.title} – ${product.colorway}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard");
      }
    } catch {
      /* share sheet dismissed */
    }
  };

  return (
    <div className="lg:sticky lg:top-[136px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-dark">{product.category}</p>
          <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-tight text-ink sm:text-[32px]">{product.title}</h1>
          <p className="mt-1 text-[15px] text-neutral-600">{[genderLabel(product.gender), product.colorway].filter(Boolean).join(" · ")}</p>
        </div>
        <button onClick={share} className="mt-1 rounded-full border p-2.5 text-ink transition hover:border-ink" aria-label="Share this product">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {product.reviewCount > 0 && (
        <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm text-ink hover:underline">
          <Stars value={product.rating} />
          <span className="font-semibold">{product.rating.toFixed(1)}</span>
          <span className="text-neutral-500">({product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"})</span>
        </a>
      )}

      <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" className="mt-5" />

      {colourways.length > 1 && (
        <div className="mt-7">
          <p className="text-sm font-semibold text-ink">
            Colour: <span className="font-normal text-neutral-600">{product.colorway}</span>
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {colourways.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products/${c.slug}`}
                  scroll={false}
                  aria-label={c.colorway}
                  aria-current={c.slug === product.slug ? "true" : undefined}
                  className={cn(
                    "relative block h-16 w-16 overflow-hidden rounded-lg bg-surface ring-offset-2 transition",
                    c.slug === product.slug ? "ring-2 ring-ink" : "hover:ring-1 hover:ring-neutral-400"
                  )}
                >
                  <ProductImage src={c.image} alt="" sizes="64px" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset id="size-picker" className="mt-7">
        <legend className="flex w-full items-center justify-between text-sm font-semibold text-ink">
          Select size (US)
        </legend>
        <div className={cn("mt-3 grid grid-cols-4 gap-2 rounded-xl sm:grid-cols-5", error && !size && "ring-2 ring-sale ring-offset-4")}>
          {product.sizes.map((s) => (
            <label key={s} className="relative">
              <input
                type="radio"
                name="size"
                value={s}
                checked={size === s}
                disabled={soldOut}
                onChange={() => {
                  setSize(s);
                  setError(false);
                }}
                className="peer sr-only"
              />
              <span className="flex h-12 cursor-pointer items-center justify-center rounded-lg border border-input text-[15px] font-medium text-ink transition hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-40">
                {s}
              </span>
            </label>
          ))}
        </div>
        {error && !size && (
          <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-sale" role="alert">
            <AlertCircle className="h-4 w-4" aria-hidden /> Please select a size.
          </p>
        )}
      </fieldset>

      {lowStock && (
        <p className="mt-4"><Badge tone="brand">Only {product.stock} left</Badge></p>
      )}

      <div className="mt-6 grid gap-3">
        <Button size="lg" onClick={add} disabled={soldOut} className="w-full">
          <ShoppingBag aria-hidden /> {soldOut ? "Sold out" : "Add to bag"}
        </Button>
        <WishlistButton product={product} variant="button" className="w-full" />
      </div>

      <ul className="mt-8 divide-y rounded-2xl border">
        <li className="flex gap-3 p-4">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-ink" aria-hidden />
          <div className="text-sm">
            <p className="font-semibold text-ink">{product.price >= FREE_SHIPPING_THRESHOLD ? "Free delivery" : `Free delivery over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`}</p>
            <p className="text-neutral-600">Delivery options are shown at checkout.</p>
          </div>
        </li>
        <li className="flex gap-3 p-4">
          <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-ink" aria-hidden />
          <div className="text-sm">
            <p className="font-semibold text-ink">{RETURN_DAYS}-day returns</p>
            <p className="text-neutral-600">Return unworn pairs within {RETURN_DAYS} days.</p>
          </div>
        </li>
        <li className="flex gap-3 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ink" aria-hidden />
          <div className="text-sm">
            <p className="font-semibold text-ink">Secure checkout</p>
            <p className="text-neutral-600">Pay with crypto or mobile money.</p>
          </div>
        </li>
      </ul>
    </div>
  );
}
