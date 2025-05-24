import { redirect } from "next/navigation";
import { cookies } from "next/headers";
// import { signInWithCredential, GoogleAuthProvider } from "firebase-admin/auth";
import { auth } from "@/lib/firebase/admin"; // adjust the import path to your firebase config

"use server";


export async function signInWithGoogleAction(formData: FormData) {
  try {
    const idToken = formData.get("idToken") as string;
    if (!idToken) {
      throw new Error("Missing Google ID token.");
    }

    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);

    // Optionally, set a session cookie or JWT here
    // cookies().set("session", await userCredential.user.getIdToken(), { httpOnly: true });

    redirect("/dashboard");
  } catch (error: any) {
    const message = encodeURIComponent(error.message || "Google sign-in failed.");
    redirect(`/auth?error=${message}`);
  }
}