"use client";

import type { RequestBody as FirebaseAuthLoginRequestBody } from "@/app/api/firebase/auth/login/route";
import { auth, googleProvider } from "@/lib/firebase/client";
import { ROUTES } from "@/types/enum.type";
import { API_PATHS } from "@/types/key.type";
import { getAdditionalUserInfo, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function GoogleButton() {
  const router = useRouter();

  const [error, setError] = useState<unknown>();
  const [isBusy, setIsBusy] = useState(false);

  const onLoginGoogle = useCallback(async () => {
    setIsBusy(true);
    try {
      const signInResult = await signInWithPopup(auth, googleProvider);
      const additionalUserInfo = getAdditionalUserInfo(signInResult);
      console.info(onLoginGoogle.name, { additionalUserInfo, signInResult });

      const idToken = await signInResult.user.getIdToken();
      console.info(onLoginGoogle.name, { idToken });

      const logInResult = await fetch(API_PATHS.FIREBASE.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          isNewUser: additionalUserInfo?.isNewUser,
        } as FirebaseAuthLoginRequestBody),
      });
      const sessionData = await logInResult.json();
      console.info(onLoginGoogle.name, { sessionData });

      setIsBusy(false);
      router.replace(ROUTES.DASHBOARD);
    } catch (error) {
      console.warn(onLoginGoogle.name, { error });
      setError(error);
      setIsBusy(false);
    }
  }, [router]);

  return (
    <>
      <button
        className="btn bg-white text-black border-[#e5e5e5]"
        disabled={isBusy}
        onClick={onLoginGoogle}
      >
        {!isBusy ? (
          <GoogleIcon />
        ) : (
          <span className="loading loading-spinner size-4"></span>
        )}
        Login with Google
      </button>
      {error && (
        <div className="mockup-code w-full xl:w-fit">
          <pre className="before:!content-none text-warning !px-3">
            <code className="whitespace-pre-wrap break-words">
              {JSON.stringify(error, null, 2)}
            </code>
          </pre>
        </div>
      )}
    </>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-label="Google logo"
      width="16"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <g>
        <path d="m0 0H512V512H0" fill="#fff"></path>
        <path
          fill="#34a853"
          d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
        ></path>
        <path
          fill="#4285f4"
          d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
        ></path>
        <path
          fill="#fbbc02"
          d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
        ></path>
        <path
          fill="#ea4335"
          d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
        ></path>
      </g>
    </svg>
  );
}
