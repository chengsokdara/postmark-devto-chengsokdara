"use client";

import { ToastProvider } from "@/providers/toast-provider";
import { type PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return <ToastProvider>{children}</ToastProvider>;
}
