import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EMPTY_DELIVERY } from "@/lib/delivery";

// Delivery details from the last checkout, kept in this browser so returning
// shoppers (guests included) don't have to type them again.
export const useStoreDelivery = create(
  persist(
    (set) => ({
      details: EMPTY_DELIVERY,
      update: (field, value) => set((state) => ({ details: { ...state.details, [field]: value } })),
      fill: (values) =>
        set((state) => ({
          details: Object.fromEntries(
            Object.entries(state.details).map(([k, v]) => [k, v || values[k] || ""])
          ),
        })),
    }),
    {
      name: "store-delivery",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      merge: (persisted, current) => ({ ...current, details: { ...EMPTY_DELIVERY, ...persisted?.details } }),
    }
  )
);
