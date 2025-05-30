"use client";

import { createToastStore, Toast } from "@/stores/toast-store";
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useStore } from "zustand";

export type ToastStoreApi = ReturnType<typeof createToastStore>;

export const ToastContext = createContext<ToastStoreApi | undefined>(undefined);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<ToastStoreApi | null>(null);
  const [mounted, setMounted] = useState(false);

  if (storeRef.current === null) {
    storeRef.current = createToastStore();
  }

  const toasts = useStore(storeRef.current, (s) => s.toasts);

  const getAlertClass = (type?: Toast["type"]) => {
    switch (type) {
      case "success":
        return "alert-success";
      case "error":
        return "alert-error";
      case "warn":
        return "alert-warning";
      default:
        return "alert-info";
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ToastContext.Provider value={storeRef.current}>
      {children}
      {mounted &&
        createPortal(
          <div className="toast toast-end toast-bottom fixed bottom-3 right-3 z-50 space-y-3">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`alert shadow-lg ${getAlertClass(toast.type)}`}
              >
                <span>{toast.message}</span>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
};
