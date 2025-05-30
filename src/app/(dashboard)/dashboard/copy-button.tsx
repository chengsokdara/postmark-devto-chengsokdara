"use client";

import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

type CopyButtonPropType = {
  slug?: string | null;
};

export function CopyButton({ slug }: CopyButtonPropType) {
  const showToast = useToast();

  const onCopy = useCallback(() => {
    showToast("Copied webhook URL to clipboard.", "success", 5000);
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_ORIGIN}/webhook/${slug}`;
    navigator.clipboard.writeText(webhookUrl);
  }, [slug]);

  return (
    <button className="btn btn-primary w-full" onClick={onCopy}>
      Copy
    </button>
  );
}
