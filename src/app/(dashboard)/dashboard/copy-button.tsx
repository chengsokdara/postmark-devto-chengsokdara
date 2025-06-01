"use client";

import { useToast } from "@/hooks/use-toast";
import { useCallback, useMemo } from "react";

type CopyButtonPropType = {
  slug?: string | null;
};

export function CopyButton({ slug }: CopyButtonPropType) {
  const showToast = useToast();

  const webhookUrl = useMemo(
    () => `${process.env.NEXT_PUBLIC_APP_ORIGIN}/api/webhook/${slug}`,
    [slug],
  );

  const onCopy = useCallback(() => {
    showToast("Copied webhook URL to clipboard.", "success", 5000);
    navigator.clipboard.writeText(webhookUrl);
  }, [showToast, webhookUrl]);

  return (
    <button
      className="btn btn-lg w-full font-normal text-center"
      title={webhookUrl}
      onClick={onCopy}
    >
      <span className="inline-block overflow-hidden text-ellipsis whitespace-nowrap">
        {webhookUrl}
      </span>
    </button>
  );
}
