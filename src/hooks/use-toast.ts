"use client";

import { useContext } from "react";
import { ToastContext } from "@/providers/toast-provider";

export const useToast = () => {
  const toastStore = useContext(ToastContext);
  if (!toastStore) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return toastStore.getState().showToast;
};
