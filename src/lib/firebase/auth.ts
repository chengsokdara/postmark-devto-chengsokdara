import { auth } from "@/lib/firebase/admin";
import { normalizeData, readDocument } from "@/lib/firestore/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type { UserDataType } from "@/types/firestore.type";
import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";

export async function getAuthUser(): Promise<DecodedIdToken | null> {
  try {
    const sessionCookie = await getSessionCookie();
    if (!sessionCookie) return null;
    const authUser = await auth.verifySessionCookie(sessionCookie);
    return authUser;
  } catch (error) {
    return null;
  }
}

export async function getSessionCookie(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value ?? null;
    return sessionCookie;
  } catch (error) {
    return null;
  }
}

export async function getUserProfile(): Promise<UserDataType | null> {
  try {
    const sessionCookie = await getSessionCookie();
    if (!sessionCookie) return null;
    const authUser = await auth.verifySessionCookie(sessionCookie);
    if (!authUser) return null;
    const profile = await readDocument(COLLECTIONS.PROFILES, authUser.uid);
    const userProfile = normalizeData<UserDataType>({
      ...authUser,
      ...profile,
    });
    return userProfile;
  } catch (error) {
    return null;
  }
}
