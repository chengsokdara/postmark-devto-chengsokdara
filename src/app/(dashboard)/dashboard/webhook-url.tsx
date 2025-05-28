"use client";

import { useUser } from "@/hooks/firestore/useUser";
import { useCallback, useEffect, useMemo, useState } from "react";

export function WebhookUrl() {
  const [hasSlug, setHasSlug] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>("");

  const { data: user } = useUser();
  // const hasSlug = user?.slug;
  console.log({ user });

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(webhookUrl);
  }, [webhookUrl]);

  const onGenerate = useCallback(() => {
    if (!user) return;
    setHasSlug(true);
    setWebhookUrl(`${window.location.origin}/webhook/${user.slug || user.uid}`);
  }, [user]);

  return (
    <section className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Get Started!</h1>
          <p className="py-6 xl:max-w-2xl">
            {hasSlug
              ? "Your Postmark webhook URL is ready"
              : "Enter a unique username to get your free Postmark webhook URL"}
          </p>
        </div>
        <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
          <div className="card-body">
            {hasSlug ? (
              <>
                <p className="text-base-content">{webhookUrl}</p>
                <button className="btn btn-primary" onClick={onCopy}>
                  Copy
                </button>
              </>
            ) : (
              <form className="max-w-sm">
                <fieldset className="fieldset gap-y-6 xl:px-9 xl:py-6">
                  <label className="floating-label">
                    <span>Username</span>
                    <input
                      className="input input-xl w-full"
                      name="username"
                      required
                      type="text"
                    />
                  </label>
                  <label className="floating-label">
                    <span>OpenAI Access Token</span>
                    <input
                      className="input input-xl w-full"
                      name="openai-access-token"
                      required
                      type="password"
                    />
                  </label>
                  <button className="btn btn-primary" onClick={onGenerate}>
                    Generate Webhook URL
                  </button>
                </fieldset>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
