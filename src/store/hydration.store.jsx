import { create } from "zustand";

// Flips to true once the persisted stores have loaded from localStorage.
// Persisted stores skip automatic hydration so server and first client render match.
export const useHydrated = create(() => false);
