"use client";
import Link from "next/link";
import { ClerkLoading, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Package, Heart, User } from "lucide-react";

const SignInLink = () => (
  <Link href="/auth/signin" className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-ink hover:bg-surface">
    <User className="h-5 w-5" aria-hidden />
    <span className="hidden xl:inline">Sign in</span>
    <span className="sr-only xl:hidden">Sign in</span>
  </Link>
);

export default function AccountMenu() {
  return (
    <>
      <ClerkLoading>
        <SignInLink />
      </ClerkLoading>
      <SignedOut>
        <SignInLink />
      </SignedOut>
      <SignedIn>
        <span className="flex h-10 w-10 items-center justify-center">
          <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }}>
            <UserButton.MenuItems>
              <UserButton.Link label="My orders" labelIcon={<Package className="h-4 w-4" />} href="/account" />
              <UserButton.Link label="Wishlist" labelIcon={<Heart className="h-4 w-4" />} href="/wishlist" />
            </UserButton.MenuItems>
          </UserButton>
        </span>
      </SignedIn>
    </>
  );
}
