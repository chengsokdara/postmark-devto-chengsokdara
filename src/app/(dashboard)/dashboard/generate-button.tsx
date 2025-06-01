"use client";

import { generateWebhookUrl } from "@/app/(dashboard)/dashboard/actions";
import { useFormStatus } from "react-dom";

export function GenerateButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="btn btn-primary"
      disabled={pending}
      // formAction={generateWebhookUrl}
    >
      {pending && <span className="loading loading-bars loading-xs"></span>}
      Generate Webhook URL
    </button>
  );
}
