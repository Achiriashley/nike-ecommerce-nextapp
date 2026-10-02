import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MAX_QUANTITY } from "@/config/store";
import { toSnapshot } from "./snapshot";

const lineKey = (slug, size) => `${slug}::${size ?? ""}`;
const clamp = (n) => Math.max(1, Math.min(MAX_QUANTITY, Math.floor(n) || 1));

export const useStoreCart = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      lastAddedKey: null,

      addItem: (product, size, quantity = 1) => {
        const key = lineKey(product.slug, size);
        set((state) => {
          const existing = state.items.find((i) => i.key === key);
          const items = existing
            ? state.items.map((i) => (i.key === key ? { ...i, quantity: clamp(i.quantity + quantity) } : i))
            : [...state.items, { ...toSnapshot(product), key, size, quantity: clamp(quantity) }];
          return { items, isDrawerOpen: true, lastAddedKey: key };
        });
      },

      updateQuantity: (key, quantity) =>
        set((state) => ({ items: state.items.map((i) => (i.key === key ? { ...i, quantity: clamp(quantity) } : i)) })),

      // Changing size merges into an existing line for the same size.
      updateSize: (key, size) =>
        set((state) => {
          const line = state.items.find((i) => i.key === key);
          if (!line) return state;
          const newKey = lineKey(line.slug, size);
          const target = state.items.find((i) => i.key === newKey);
          const rest = state.items.filter((i) => i.key !== key);
          return {
            items: target
              ? rest.map((i) => (i.key === newKey ? { ...i, quantity: clamp(i.quantity + line.quantity) } : i))
              : state.items.map((i) => (i.key === key ? { ...i, key: newKey, size } : i)),
          };
        }),

      removeItem: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getCount: () => get().items.reduce((n, i) => n + i.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "store-cart",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ items }) => ({ items }),
      skipHydration: true,
    }
  )
);
