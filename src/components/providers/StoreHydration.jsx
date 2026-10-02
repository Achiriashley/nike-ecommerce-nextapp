"use client";
import { useEffect } from "react";
import { useStoreCart } from "@/store/cart.store";
import { useStoreFavorite } from "@/store/favorite.store";
import { useStoreRecent } from "@/store/recent.store";
import { useHydrated } from "@/store/hydration.store";

export default function StoreHydration() {
  useEffect(() => {
    Promise.all([
      useStoreCart.persist.rehydrate(),
      useStoreFavorite.persist.rehydrate(),
      useStoreRecent.persist.rehydrate(),
    ]).finally(() => useHydrated.setState(true, true));
  }, []);
  return null;
}
