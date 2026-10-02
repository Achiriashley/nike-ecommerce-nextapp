import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import Logo from "./Logo";
import { FREE_SHIPPING_THRESHOLD, RETURN_DAYS } from "@/config/store";
import { formatPrice } from "@/lib/format";

const PERKS = [
  "Track your orders in one place",
  "Write reviews for the pairs you own",
  `Free delivery on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`,
  `${RETURN_DAYS}-day returns`,
];

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <Image src="/products/lifestyle-1.webp" alt="" fill priority sizes="50vw" className="object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" aria-hidden />
        <div className="absolute inset-x-12 bottom-12 text-white">
          <p className="text-3xl font-semibold tracking-tight">Your pairs, your way.</p>
          <ul className="mt-6 space-y-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-[15px] text-white/85">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-ink"><Check className="h-3.5 w-3.5" aria-hidden /></span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Logo />
          <Link href="/shop" className="text-sm font-medium text-neutral-600 hover:text-ink">Continue shopping</Link>
        </div>
        <main id="main" className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
            <p className="mt-2 text-neutral-600">{subtitle}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
