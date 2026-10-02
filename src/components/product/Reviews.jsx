"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquareText, Star, Loader2, Pencil, Trash2 } from "lucide-react";
import Stars from "@/components/ui/Stars";
import EmptyState from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/button";
import { Input, Textarea, NativeSelect } from "@/components/ui/input";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const RATING_WORDS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

function RatingInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">Your rating</legend>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer p-0.5" onMouseEnter={() => setHover(n)}>
              <input type="radio" name="rating" value={n} checked={value === n} onChange={() => onChange(n)} className="peer sr-only" />
              <Star
                className={cn("h-7 w-7 rounded transition peer-focus-visible:ring-2 peer-focus-visible:ring-ring", n <= shown ? "fill-ink text-ink" : "fill-none text-neutral-300")}
                aria-hidden
              />
              <span className="sr-only">{n} star{n > 1 ? "s" : ""}</span>
            </label>
          ))}
        </div>
        <span className="text-sm text-neutral-600">{RATING_WORDS[shown]}</span>
      </div>
    </fieldset>
  );
}

function ReviewForm({ product, existing, onDone, onCancel }) {
  const [form, setForm] = useState({
    rating: existing?.rating ?? 0,
    title: existing?.title ?? "",
    body: existing?.body ?? "",
    size: existing?.size ?? "",
  });
  const [status, setStatus] = useState({ loading: false, error: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.rating) return setStatus({ loading: false, error: "Choose a star rating." });
    setStatus({ loading: true, error: "" });
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, product: product.slug }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setStatus({ loading: false, error: data.error || "Could not save your review." });
    setStatus({ loading: false, error: "" });
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-ink">{existing ? "Edit your review" : "Write a review"}</h3>
      <RatingInput value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
      <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
        <div>
          <label htmlFor="review-title" className="text-sm font-semibold text-ink">Headline</label>
          <Input id="review-title" className="mt-2" maxLength={120} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sum it up in a few words" />
        </div>
        <div>
          <label htmlFor="review-size" className="text-sm font-semibold text-ink">Size bought</label>
          <NativeSelect id="review-size" wrapperClassName="mt-2" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
            <option value="">Prefer not to say</option>
            {product.sizes.map((s) => <option key={s} value={s}>US {s}</option>)}
          </NativeSelect>
        </div>
      </div>
      <div>
        <label htmlFor="review-body" className="text-sm font-semibold text-ink">Review</label>
        <Textarea id="review-body" className="mt-2" maxLength={2000} required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="How’s the fit, comfort and quality?" />
        <p className="mt-1 text-right text-xs text-neutral-500">{form.body.length}/2000</p>
      </div>
      {status.error && <p className="text-sm font-medium text-sale" role="alert">{status.error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={status.loading}>
          {status.loading && <Loader2 className="animate-spin" aria-hidden />} {existing ? "Save changes" : "Post review"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function Reviews({ product }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoaded, isSignedIn } = useUser();
  const [writing, setWriting] = useState(false);
  const queryKey = ["reviews", product.slug];
  const { data, isPending, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`/api/reviews?product=${encodeURIComponent(product.slug)}`);
      if (!res.ok) throw new Error("Could not load reviews");
      return res.json();
    },
  });

  const reviews = data?.reviews ?? [];
  const mine = reviews.find((r) => r.userId && r.userId === data?.viewerId);
  const count = reviews.length;
  const average = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  const distribution = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rating === n).length }));

  const refresh = () => {
    setWriting(false);
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    router.refresh();
  };

  const remove = async () => {
    if (!confirm("Delete your review?")) return;
    await fetch(`/api/reviews?product=${encodeURIComponent(product.slug)}`, { method: "DELETE" });
    refresh();
  };

  const signInHref = `/auth/signin?redirect_url=${encodeURIComponent(`/products/${product.slug}#reviews`)}`;

  return (
    <section id="reviews" className="scroll-mt-40" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-2xl font-semibold tracking-tight text-ink">Reviews {count > 0 && <span className="text-neutral-500">({count})</span>}</h2>

      {isPending ? (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isError ? (
        <p className="mt-6 text-sm text-neutral-600">Reviews couldn’t be loaded right now.</p>
      ) : !data.enabled ? (
        <p className="mt-6 text-sm text-neutral-600">Reviews are unavailable at the moment.</p>
      ) : (
        <div className="mt-6 grid gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            {count > 0 && (
              <>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-semibold tracking-tight text-ink">{average.toFixed(1)}</span>
                  <div className="pb-1.5">
                    <Stars value={average} size={16} />
                    <p className="mt-1 text-sm text-neutral-600">{count} {count === 1 ? "review" : "reviews"}</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2">
                  {distribution.map(({ n, count: c }) => (
                    <li key={n} className="flex items-center gap-3 text-sm">
                      <span className="w-12 text-neutral-600">{n} star</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                        <span className="block h-full rounded-full bg-ink" style={{ width: `${(c / count) * 100}%` }} />
                      </span>
                      <span className="w-6 text-right text-neutral-600">{c}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className={cn(count > 0 && "mt-6")}>
              {isLoaded && isSignedIn ? (
                !writing && (
                  <Button variant="outline" className="w-full" onClick={() => setWriting(true)}>
                    {mine ? <><Pencil aria-hidden /> Edit your review</> : "Write a review"}
                  </Button>
                )
              ) : (
                <Button asChild variant="outline" className="w-full"><Link href={signInHref}>Sign in to write a review</Link></Button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {writing && <ReviewForm product={product} existing={mine} onDone={refresh} onCancel={() => setWriting(false)} />}
            {count === 0 && !writing ? (
              <EmptyState icon={MessageSquareText} title="No reviews yet" description="Bought this pair? Share how it fits and feels to help other shoppers." />
            ) : (
              <ul className="divide-y">
                {reviews.map((r) => (
                  <li key={r.id} className="py-6 first:pt-0">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-sm font-semibold text-ink" aria-hidden>
                        {r.userName.charAt(0).toUpperCase()}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-ink">{r.userName}{r.userId === data.viewerId && <span className="ml-2 font-normal text-neutral-500">(you)</span>}</p>
                        <p className="text-xs text-neutral-500">{formatDate(r.createdAt)}{r.size && ` · Size ${r.size}`}</p>
                      </div>
                      {r.userId === data.viewerId && (
                        <button onClick={remove} className="rounded-full p-2 text-neutral-500 hover:bg-surface hover:text-ink" aria-label="Delete your review">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <Stars value={r.rating} className="mt-3" />
                    <p className="mt-2 font-semibold text-ink">{r.title}</p>
                    <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed text-neutral-700">{r.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
