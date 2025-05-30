"use client";

import {
  updateProfileSlug,
  type ProfileSlugState,
} from "@/app/(dashboard)/dashboard/actions";
import { useActionState } from "react";

const initialState: ProfileSlugState = {
  success: false,
};

export function WelcomeForm() {
  const [state, action, isPending] = useActionState(
    updateProfileSlug,
    initialState,
  );
  // const isPending = true;

  return (
    <form className="xl:min-w-xl" action={action}>
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
        {/* <label className="floating-label">
          <span>OpenAI Access Token (Optional)</span>
          <input
            className="input input-lg w-full"
            defaultValue=""
            name="openai_access_token"
            placeholder="Enter disposable OpenAI access token"
            required
            type="password"
          />
        </label> */}
        <button className="btn btn-primary" disabled={isPending}>
          {isPending && (
            <span className="loading loading-bars loading-xs"></span>
          )}
          Generate Webhook URL
        </button>
      </fieldset>
    </form>
  );
}
