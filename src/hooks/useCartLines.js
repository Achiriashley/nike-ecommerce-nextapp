"use client";
import { useMemo } from "react";
import { useStoreCart } from "@/store/cart.store";
import { useCatalog } from "./useCatalog";
import { shippingFor } from "@/config/store";

// Cart lines joined with the live catalog so prices and availability stay current.
export const useCartLines = () => {
  const items = useStoreCart((s) => s.items);
  const { data: products, isSuccess } = useCatalog();

  return useMemo(() => {
    const lines = items.map((item) => {
      const live = isSuccess ? products.find((p) => p.slug === item.slug) : null;
      const available = !isSuccess || Boolean(live);
      return {
        ...item,
        price: live?.price ?? item.price,
        compareAtPrice: live ? live.compareAtPrice : item.compareAtPrice,
        image: live?.image ?? item.image,
        sizes: live?.sizes ?? [],
        available,
      };
    });
    const purchasable = lines.filter((l) => l.available);
    const subtotal = purchasable.reduce((sum, l) => sum + l.price * l.quantity, 0);
    const savings = purchasable.reduce(
      (sum, l) => sum + (l.compareAtPrice > l.price ? (l.compareAtPrice - l.price) * l.quantity : 0),
      0
    );
    const shipping = shippingFor(subtotal);
    return {
      lines,
      purchasable,
      count: purchasable.reduce((n, l) => n + l.quantity, 0),
      subtotal,
      savings,
      shipping,
      total: subtotal + shipping,
      catalogReady: isSuccess,
    };
  }, [items, products, isSuccess]);
};
