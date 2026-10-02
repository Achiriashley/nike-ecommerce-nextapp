"use client";
import Link from "next/link";
import { ChevronRight, Heart, Package, HelpCircle, ShoppingBag } from "lucide-react";
import { SignedIn, SignedOut, ClerkLoading } from "@clerk/nextjs";
import Sheet from "@/components/ui/Sheet";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "./nav";
import { STORE_NAME } from "@/config/store";

export default function MobileMenu({ open, onClose }) {
  const secondary = [
    { label: "Bag", href: "/cart", icon: ShoppingBag },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Orders", href: "/account", icon: Package },
    { label: "Help & contact", href: "/contact", icon: HelpCircle },
  ];
  const authButtons = (
    <div className="grid grid-cols-2 gap-3">
      <Button asChild variant="outline"><Link href="/auth/signin" onClick={onClose}>Sign in</Link></Button>
      <Button asChild><Link href="/auth/signup" onClick={onClose}>Join us</Link></Button>
    </div>
  );
  return (
    <Sheet open={open} onClose={onClose} side="left" title={STORE_NAME} footer={
      <>
        <ClerkLoading>{authButtons}</ClerkLoading>
        <SignedOut>{authButtons}</SignedOut>
        <SignedIn>
          <Button asChild variant="outline" className="w-full"><Link href="/account" onClick={onClose}>My account</Link></Button>
        </SignedIn>
      </>
    }>
      <nav aria-label="Mobile">
        <ul className="py-2">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} onClick={onClose} className={`flex items-center justify-between px-5 py-3.5 text-lg font-medium ${link.highlight ? "text-sale" : "text-ink"} hover:bg-surface`}>
                {link.label}
                <ChevronRight className="h-5 w-5 text-neutral-400" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <ul className="border-t px-2 py-3">
          {secondary.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <Link href={href} onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-neutral-700 hover:bg-surface hover:text-ink">
                <Icon className="h-5 w-5" aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Sheet>
  );
}
