import { create } from "zustand";

export const useStoreForm = create((set) => ({
  isFormVisible: false,
  toggleFormVisibility: () => {
    set ((state) => ({isFormVisible: !state.isFormVisible}));
  },
  closeForm: () => {
    set(() => ({isFormVisible: false}));
  },
  openForm: () => {
    set(() => ({isFormVisible: true})) ;
  },
}));