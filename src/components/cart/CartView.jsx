"use client";
import { useState } from "react";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";
import { ShoppingBag, Heart, Trash2, Loader2, Smartphone, Bitcoin, Lock, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import ProductImage from "@/components/ui/ProductImage";
import EmptyState from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/input";
import ProductRail from "@/components/product/ProductRail";
import SectionHeading from "@/components/ui/SectionHeading";
import FreeShippingMeter from "./FreeShippingMeter";
import { useStoreCart } from "@/store/cart.store";
import { useStoreFavorite } from "@/store/favorite.store";
import { useHydrated } from "@/store/hydration.store";
import { useCartLines } from "@/hooks/useCartLines";
import { useCatalog } from "@/hooks/useCatalog";
import { MAX_QUANTITY } from "@/config/store";
import { formatPrice } from "@/lib/format";

function Summary({ cart }) {
  const [pending, setPending] = useState(null);
  const [error, setError] = useState("");

  const checkout = async (provider) => {
    setPending(provider);
    setError("");
    try {
      const res = await fetch(provider === "crypto" ? "/api/payment" : "/api/payment/mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.purchasable.map(({ slug, size, quantity }) => ({ slug, size, quantity })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout. Please try again.");
      window.location.assign(data.url);
    } catch (err) {
      // fetch() rejects with a TypeError when the app's own server can't be reached.
      setError(err instanceof TypeError ? "Couldn’t reach the store’s server. Check that it’s running, then try again." : err.message);
      setPending(null);
    }
  };

  const rows = [
    ["Subtotal", formatPrice(cart.subtotal)],
    cart.savings > 0 && ["You save", `−${formatPrice(cart.savings)}`, "text-sale"],
    ["Delivery", cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)],
  ].filter(Boolean);

  return (
    <aside id="checkout" className="scroll-mt-40 lg:sticky lg:top-[136px]" aria-labelledby="summary-heading">
      <div className="rounded-2xl border p-5 sm:p-6">
        <h2 id="summary-heading" className="text-xl font-semibold text-ink">Order summary</h2>
        <div className="mt-4"><FreeShippingMeter subtotal={cart.subtotal} /></div>
        <dl className="mt-5 space-y-3 text-[15px]">
          {rows.map(([k, v, cls]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-neutral-600">{k}</dt>
              <dd className={cls ?? "font-medium text-ink"}>{v}</dd>
            </div>
          ))}
          <div className="flex justify-between border-t pt-4 text-lg">
            <dt className="font-semibold text-ink">Total</dt>
            <dd className="font-semibold text-ink">{formatPrice(cart.total)}</dd>
          </div>
        </dl>
        <div className="mt-6 grid gap-3">
          <Button size="lg" onClick={() => checkout("mobile")} disabled={Boolean(pending) || !cart.purchasable.length}>
            {pending === "mobile" ? <Loader2 className="animate-spin" aria-hidden /> : <Smartphone aria-hidden />}
            Pay with mobile money
          </Button>
          <Button size="lg" variant="outline" onClick={() => checkout("crypto")} disabled={Boolean(pending) || !cart.purchasable.length}>
            {pending === "crypto" ? <Loader2 className="animate-spin" aria-hidden /> : <Bitcoin aria-hidden />}
            Pay with crypto
          </Button>
        </div>
        {error && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-[#fdecea] p-3 text-sm text-sale" role="alert">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {error}
          </p>
        )}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-neutral-500">
          <Lock className="h-3.5 w-3.5" aria-hidden /> You’ll finish paying securely on the provider’s page.
        </p>
      </div>
      <SignedOut>
        <p className="mt-4 rounded-2xl bg-surface p-4 text-sm text-neutral-700">
          <Link href="/auth/signin?redirect_url=/cart" className="font-semibold text-ink underline underline-offset-4">Sign in</Link> to save this order to your account and track it later.
        </p>
      </SignedOut>
    </aside>
  );
}

export default function CartView() {
  const hydrated = useHydrated();
  const cart = useCartLines();
  const { updateQuantity, updateSize, removeItem } = useStoreCart();
  const toggleFavorite = useStoreFavorite((s) => s.toggle);
  const isSaved = useStoreFavorite((s) => s.has);
  const { data: products = [] } = useCatalog();

  const moveToWishlist = (line) => {
    if (!isSaved(line.slug)) toggleFavorite(line);
    removeItem(line.key);
    toast("Moved to your wishlist");
  };

  const suggestions = products.filter((p) => p.featured && !cart.lines.some((l) => l.slug === p.slug)).slice(0, 10);

  if (!hydrated) {
    return (
      <div className="container grid gap-10 pt-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="container pt-8 md:pt-10">
      {cart.lines.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="Your bag is empty" description="Find something you love and it’ll be waiting here when you’re ready.">
          <Button asChild><Link href="/shop">Shop all shoes</Link></Button>
          <Button asChild variant="outline"><Link href="/wishlist">View wishlist</Link></Button>
        </EmptyState>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <section aria-labelledby="bag-heading">
            <h1 id="bag-heading" className="text-3xl font-semibold tracking-tight text-ink">
              Bag <span className="text-xl font-normal text-neutral-500">({cart.count} {cart.count === 1 ? "item" : "items"})</span>
            </h1>
            <ul className="mt-6 divide-y border-y">
              {cart.lines.map((line) => (
                <li key={line.key} className="flex gap-4 py-6 sm:gap-6">
                  <Link href={`/products/${line.slug}`} className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-36 sm:w-36">
                    <ProductImage src={line.image} alt={line.title} sizes="144px" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link href={`/products/${line.slug}`} className="font-semibold text-ink hover:underline">{line.title}</Link>
                        <p className="text-sm text-neutral-600">{line.colorway}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-ink">{formatPrice(line.price * line.quantity)}</p>
                        {line.quantity > 1 && <p className="text-xs text-neutral-500">{formatPrice(line.price)} each</p>}
                      </div>
                    </div>
                    {line.available ? (
                      <div className="mt-3 flex flex-wrap gap-3">
                        <div>
                          <label htmlFor={`size-${line.key}`} className="sr-only">Size</label>
                          <NativeSelect id={`size-${line.key}`} value={line.size ?? ""} onChange={(e) => updateSize(line.key, e.target.value)} wrapperClassName="w-32" className="h-10 text-sm">
                            {(line.sizes.length ? line.sizes : [line.size]).map((s) => <option key={s} value={s}>Size {s}</option>)}
                          </NativeSelect>
                        </div>
                        <div>
                          <label htmlFor={`qty-${line.key}`} className="sr-only">Quantity</label>
                          <NativeSelect id={`qty-${line.key}`} value={line.quantity} onChange={(e) => updateQuantity(line.key, Number(e.target.value))} wrapperClassName="w-28" className="h-10 text-sm">
                            {Array.from({ length: MAX_QUANTITY }, (_, i) => i + 1).map((n) => <option key={n} value={n}>Qty {n}</option>)}
                          </NativeSelect>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-sale"><AlertTriangle className="h-4 w-4" aria-hidden /> This item is no longer available and won’t be included at checkout.</p>
                    )}
                    <div className="mt-auto flex gap-5 pt-4 text-sm">
                      {line.available && (
                        <button onClick={() => moveToWishlist(line)} className="inline-flex items-center gap-1.5 font-medium text-neutral-600 hover:text-ink">
                          <Heart className="h-4 w-4" aria-hidden /> Move to wishlist
                        </button>
                      )}
                      <button onClick={() => removeItem(line.key)} className="inline-flex items-center gap-1.5 font-medium text-neutral-600 hover:text-ink">
                        <Trash2 className="h-4 w-4" aria-hidden /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <Summary cart={cart} />
        </div>
      )}

      {suggestions.length > 0 && (
        <section className="mt-20" aria-labelledby="suggest-heading">
          <SectionHeading title={<span id="suggest-heading">{cart.lines.length ? "Complete your rotation" : "Popular right now"}</span>} />
          <ProductRail products={suggestions} label="Suggestions" />
        </section>
      )}
    </div>
  );
}
