"use client";

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import type { ReactNode } from "react";

type RaAlertType = "warning" | "error" | "success" | "info";

type RaAlertMessageProps = {
  type?: RaAlertType;
  title?: string;
  message?: string;
  onClose?: () => void;
  show?: boolean;
};

const iconMap: Record<RaAlertType, ReactNode> = {
  warning: <ExclamationTriangleIcon className="size-5 mt-0.5 shrink-0" />,
  error: <XCircleIcon className="size-5 mt-0.5 shrink-0" />,
  success: <CheckCircleIcon className="size-5 mt-0.5 shrink-0" />,
  info: <InformationCircleIcon className="size-5 mt-0.5 shrink-0" />,
};

export function RaAlert({
  type = "warning",
  title,
  message,
  onClose,
  show = true,
}: RaAlertMessageProps) {
  if (!show) return null;

  return (
    <div
      role="alert"
      className={`alert relative items-start alert-${type}`}
      onClick={onClose}
    >
      {iconMap[type]}
      <div className="w-full">
        {title && <strong>{title}</strong>}
        {message && <p className="whitespace-pre-line text-sm">{message}</p>}
      </div>
      {onClose && (
        <button
          className="btn btn-circle btn-xs btn-ghost absolute top-1 end-1"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <XMarkIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
