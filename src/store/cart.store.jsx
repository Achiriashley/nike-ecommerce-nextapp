import { create } from "zustand";

export const useStoreCart = create((set, get) => ({
  selectedIds: [],

  // Toggle an item's selection state
  toggleId: (id) => {
    set((state) => {
      const isAlreadySelected = state.selectedIds.includes(id);
      return {
        ...state,
        selectedIds: isAlreadySelected
          ? state.selectedIds.filter((item) => item !== id) // Remove if exists
          : [...state.selectedIds, id], // Add if not exists
      };
    });
  },

  // Remove a specific item from the cart
  removeFromCart: (id) => {
    set((state) => ({
      ...state,
      selectedIds: state.selectedIds.filter((item) => item !== id),
    }));
  },

  // Clear all items from the cart
  clearCart: () => {
    set(() => ({ selectedIds: [] }));
  },

  // Calculate subtotal dynamically
  getSubtotal: () => {
    const { selectedIds } = get();
    const { products } = require("@/utils/data"); // Dynamically import product data
    return selectedIds
      .map((id) => products.find((product) => product.id === id)?.price || 0)
      .reduce((total, price) => total + price, 0);
  },
}));