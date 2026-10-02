import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import ClearCart from "@/components/cart/ClearCart";
import { Button } from "@/components/ui/button";
import { orderRef } from "@/lib/orders";

export const metadata = { title: "Thank you" };

export default async function CheckoutSuccess({ searchParams }) {
  const { order } = await searchParams;
  return (
    <div className="container flex flex-col items-center pt-16 text-center md:pt-24">
      <ClearCart />
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft">
        <CheckCircle2 className="h-8 w-8 text-success" aria-hidden />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink md:text-4xl">Thanks for your order!</h1>
      <p className="mt-3 max-w-md text-neutral-600">
        Your payment is being confirmed by the provider.
        {order && <> Your order reference is <strong className="text-ink">{orderRef(order)}</strong>.</>}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild><Link href="/account">View my orders</Link></Button>
        <Button asChild variant="outline"><Link href="/shop">Keep shopping</Link></Button>
      </div>
    </div>
  );
}
