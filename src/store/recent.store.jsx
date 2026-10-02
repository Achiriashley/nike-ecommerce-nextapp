import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toSnapshot } from "./snapshot";

const LIMIT = 12;

export const useStoreRecent = create(
  persist(
    (set) => ({
      items: [],
      record: (product) =>
        set((state) => ({
          items: [toSnapshot(product), ...state.items.filter((i) => i.slug !== product.slug)].slice(0, LIMIT),
        })),
      clear: () => set({ items: [] }),
    }),
    // Version 2: prices switched from USD to FCFA, so older history is discarded.
    { name: "store-recently-viewed", version: 2, storage: createJSONStorage(() => localStorage), skipHydration: true }
  )
);
