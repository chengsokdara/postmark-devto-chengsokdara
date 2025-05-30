import { createStore } from "zustand";

export type Toast = {
  id: number;
  message: string;
  type?: "info" | "success" | "warn" | "error";
};

export type ToastStore = {
  toasts: Toast[];
  showToast: (message: string, type?: Toast["type"], timeout?: number) => void;
};

let toastId = 0;

export const createToastStore = () => {
  return createStore<ToastStore>((set) => ({
    toasts: [],
    showToast: (message, type = "info", timeout = 3000) => {
      const id = toastId++;
      const newToast: Toast = { id, message, type };
      set((state) => {
        const isDuplicate = state.toasts.some((t) => t.message === message);
        if (isDuplicate) return state;
        const updated = [...state.toasts, newToast];
        return {
          toasts:
            updated.length > 5 ? updated.slice(updated.length - 5) : updated,
        };
      });
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, timeout);
    },
  }));
};
