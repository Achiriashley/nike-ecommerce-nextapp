"use client";
import { useEffect } from "react";
import { useStoreCart } from "@/store/cart.store";
import { useHydrated } from "@/store/hydration.store";

export default function ClearCart() {
  const hydrated = useHydrated();
  const clearCart = useStoreCart((s) => s.clearCart);
  useEffect(() => {
    if (hydrated) clearCart();
  }, [hydrated, clearCart]);
  return null;
}
