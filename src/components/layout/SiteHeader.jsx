"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Menu, ShoppingBag, Truck } from "lucide-react";
import Logo from "./Logo";
import SearchBox from "./SearchBox";
import CategoryBar from "./CategoryBar";
import MobileMenu from "./MobileMenu";
import AccountMenu from "./AccountMenu";
import { useStoreCart } from "@/store/cart.store";
import { useStoreFavorite } from "@/store/favorite.store";
import { useHydrated } from "@/store/hydration.store";
import { FREE_SHIPPING_THRESHOLD, RETURN_DAYS } from "@/config/store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const CountBadge = ({ count }) =>
  count > 0 ? (
    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold leading-none text-ink">
      {count > 99 ? "99+" : count}
    </span>
  ) : null;

const iconButton = "relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-surface";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const [scrolled, setScrolled] = useState(false);
  const hydrated = useHydrated();
  const cartCount = useStoreCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openDrawer = useStoreCart((s) => s.openDrawer);
  const wishCount = useStoreFavorite((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="bg-ink text-white">
        <p className="container flex h-9 items-center justify-center gap-2 text-center text-[13px]">
          <Truck className="hidden h-4 w-4 sm:block" aria-hidden />
          Free delivery on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
          <span className="hidden text-white/50 sm:inline">·</span>
          <span className="hidden sm:inline">{RETURN_DAYS}-day free returns</span>
        </p>
      </div>
      <header className={cn("sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow", scrolled && "shadow-[0_1px_0_rgba(0,0,0,.06),0_8px_24px_-16px_rgba(0,0,0,.25)]")}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <div className="container flex h-16 items-center gap-3 lg:gap-8">
          <button type="button" className={cn(iconButton, "-ml-2 lg:hidden")} onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="h-[22px] w-[22px]" />
          </button>
          <Logo />
          <SearchBox className="hidden max-w-xl flex-1 md:block" />
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <AccountMenu />
            <Link href="/wishlist" className={cn(iconButton, "hidden sm:flex")} aria-label={`Wishlist${hydrated && wishCount ? `, ${wishCount} items` : ""}`}>
              <Heart className="h-[22px] w-[22px]" aria-hidden />
              {hydrated && <CountBadge count={wishCount} />}
            </Link>
            <button type="button" onClick={openDrawer} className={iconButton} aria-label={`Bag${hydrated && cartCount ? `, ${cartCount} items` : ""}`}>
              <ShoppingBag className="h-[22px] w-[22px]" aria-hidden />
              {hydrated && <CountBadge count={cartCount} />}
            </button>
          </div>
        </div>
        <div className="container pb-3 md:hidden">
          <SearchBox />
        </div>
        {/* On phones the category row tucks away while scrolling to keep the sticky header short. */}
        <div className={cn(scrolled && "hidden md:block")}>
        <Suspense fallback={<div className="h-11 border-t" />}>
          <CategoryBar />
        </Suspense>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
