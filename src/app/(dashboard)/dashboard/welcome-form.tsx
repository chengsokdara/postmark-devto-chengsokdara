"use client";

import {
  generateWebhookUrl,
  type GenerateWebhookUrlStateType,
} from "@/app/(dashboard)/dashboard/actions";
import { RaAlert } from "@/ui/RaAlert";
import { useActionState, useEffect, useState } from "react";

const initialState: GenerateWebhookUrlStateType = {
  success: false,
};

export function WelcomeForm() {
  const [state, action, pending] = useActionState(
    generateWebhookUrl,
    initialState,
  );

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!state.success && state.error) {
      setShowError(true);
    }
  }, [state.success, state.error]);

  return (
    <form action={action}>
      <fieldset className="fieldset gap-y-6 py-6 xl:px-9 xl:py-6">
        <label className="floating-label">
          <span>Username</span>
          <input
            className="input input-lg w-full"
            defaultValue=""
            name="username"
            placeholder="Enter your username"
            required
            type="text"
          />
        </label>
        <fieldset className="fieldset">
          <label className="floating-label">
            <span>OpenAI Access Token</span>
            <input
              className="input input-lg w-full"
              defaultValue=""
              name="openaiApiKey"
              placeholder="Enter OpenAI access token"
              required
              type="password"
            />
          </label>
          <p className="label whitespace-break-spaces">
            Note: use a disposable OpenAI access token, this token will be use
            to securely access GPT to process incoming email.
          </p>
        </fieldset>
        <button className="btn btn-primary" disabled={pending}>
          {pending && <span className="loading loading-bars loading-xs"></span>}
          Generate Webhook URL
        </button>
        <RaAlert
          message={state.error}
          show={showError}
          title={state.message}
          type="warning"
          onClose={() => setShowError(false)}
        />
      </fieldset>
    </form>
  );
}
