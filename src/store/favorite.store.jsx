import { create } from "zustand"

export const useStoreFavorite = create((set)  => ({
 selectedHeartIds: [],
 toggleHeartIconId: (id) => {
    set((state) => {
        const isAlreadySelected = state.selectedHeartIds.includes(id);
        return {
            ...state, // update array statement
            selectedHeartIds: isAlreadySelected
            ? state.selectedHeartIds.filter((item) => item !== id)// remove if exists
             : [...state.selectedHeartIds, id],// add if not exist
        };
    });
 },
 clearFavorites: () => {
    set(() => ({selectedHeartIds: [] }));
    
 },
}));

