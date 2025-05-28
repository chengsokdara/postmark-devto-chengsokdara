import { auth } from "@/lib/firebase/admin";
import type { DecodedIdToken } from "firebase-admin/auth";

export async function getAuthUser(
  sessionCookie: string,
): Promise<DecodedIdToken | null> {
  try {
    const user = await auth.verifySessionCookie(sessionCookie);
    return user;
  } catch (error) {
    return null;
  }
}
