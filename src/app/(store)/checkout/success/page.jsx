import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import ClearCart from "@/components/cart/ClearCart";
import { Button } from "@/components/ui/button";
import { orderRef } from "@/lib/orders";
import { syncCampayPayment } from "@/lib/server/campay";

export const metadata = { title: "Thank you" };
export const dynamic = "force-dynamic";

const STATES = {
  paid: {
    icon: CheckCircle2,
    tone: "bg-success-soft text-success",
    title: "Payment confirmed!",
    text: "Thanks for your order. We’ll get it ready for delivery.",
  },
  pending: {
    icon: Clock,
    tone: "bg-brand-soft text-brand-dark",
    title: "Thanks for your order!",
    text: "Your payment is being confirmed. If you haven’t approved it on your phone yet, do that now. This can take a minute.",
  },
  cancelled: {
    icon: XCircle,
    tone: "bg-[#fdecea] text-sale",
    title: "Payment didn’t go through",
    text: "Your mobile money payment failed or was cancelled. Your bag is still saved, so you can try again.",
  },
};

export default async function CheckoutSuccess({ searchParams }) {
  const { order, reference } = await searchParams;
  // For Campay orders, ask Campay for the real result before showing it.
  const synced = order ? await syncCampayPayment({ orderId: order, reference }) : null;
  const state = STATES[synced] ?? STATES.pending;
  const failed = synced === "cancelled";
  const Icon = state.icon;

  return (
    <div className="container flex flex-col items-center pt-16 text-center md:pt-24">
      {!failed && <ClearCart />}
      <span className={`flex h-16 w-16 items-center justify-center rounded-full ${state.tone}`}>
        <Icon className="h-8 w-8" aria-hidden />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink md:text-4xl">{state.title}</h1>
      <p className="mt-3 max-w-md text-neutral-600">
        {state.text}
        {order && <> Your order reference is <strong className="text-ink">{orderRef(order)}</strong>.</>}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {failed ? (
          <Button asChild><Link href="/cart">Back to bag</Link></Button>
        ) : (
          <Button asChild><Link href="/account">View my orders</Link></Button>
        )}
        <Button asChild variant="outline"><Link href="/shop">Keep shopping</Link></Button>
      </div>
    </div>
  );
}
