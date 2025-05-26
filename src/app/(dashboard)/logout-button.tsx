"use client";

import { auth } from "@/lib/firebase/client";
import { ROUTES } from "@/types/enum.type";
import { API_PATHS } from "@/types/key.type";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function LogoutButton() {
  const router = useRouter();

  const [isBusy, setIsBusy] = useState(false);

  const onLogout = useCallback(async () => {
    setIsBusy(true);
    try {
      await auth.signOut();

      const logoutResult = await fetch(API_PATHS.FIREBASE.AUTH.LOGOUT, {
        method: "POST",
      });
      console.log(onLogout.name, { logoutResult });

      setIsBusy(false);
      router.replace(ROUTES.HOME);
    } catch (error) {
      console.warn(onLogout.name, { error });
      setIsBusy(false);
    }
  }, []);

  return (
    <button
      className="tooltip tooltip-right text-xl py-6"
      data-tip="Logout"
      disabled={isBusy}
      onClick={onLogout}
    >
      {!isBusy ? (
        <ArrowLeftEndOnRectangleIcon className="size-5" />
      ) : (
        <span className="loading loading-spinner size-5"></span>
      )}
    </button>
  );
}
