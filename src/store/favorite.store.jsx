import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware";
import { toSnapshot } from "./snapshot";

export const useStoreFavorite = create(
  persist(
    (set, get) => ({
      items: [],
      has: (slug) => get().items.some((i) => i.slug === slug),
      // Returns true when the product was added.
      toggle: (product) => {
        const exists = get().has(product.slug);
        set((state) => ({
          items: exists ? state.items.filter((i) => i.slug !== product.slug) : [toSnapshot(product), ...state.items],
        }));
        return !exists;
      },
      remove: (slug) => set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),
      clearFavorites: () => set({ items: [] }),
    }),
    { name: "store-wishlist", version: 2, storage: createJSONStorage(() => localStorage), skipHydration: true }
  )
);
