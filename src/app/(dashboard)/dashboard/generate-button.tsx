"use client";

import { useActionState } from "react";
import { type ProfileSlugState, updateProfileSlug } from "./actions";

const initialState: ProfileSlugState = {
  success: false,
};

export function GenerateButton() {
  const [state, action, isPending] = useActionState(
    updateProfileSlug,
    initialState,
  );
  return (
    <button className="btn btn-primary" disabled={isPending}>
      {isPending && <span className="loading loading-spinner"></span>}
      Generate Webhook URL
    </button>
  );
}
