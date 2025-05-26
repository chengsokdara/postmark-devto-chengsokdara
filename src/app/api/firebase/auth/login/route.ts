import { auth, db } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/types/enum.type";
import { CreateProfileDataType } from "@/types/profile.type";
import { stringify } from "@/utils/string";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

const API_PATH = "/api/firebase/auth/login";

export type RequestBody = {
  idToken: string;
  isNewUser?: boolean;
};

export async function POST(request: NextRequest) {
  const { idToken, isNewUser }: RequestBody = await request.json();
  console.log(API_PATH, { idToken, isNewUser });

  if (!idToken) {
    return NextResponse.json(
      { error: "Bad Request: idToken is missing!" },
      { status: 400, statusText: "Bad Request" },
    );
  }

  try {
    const decoded = await auth.verifyIdToken(idToken);
    console.log(API_PATH, { decoded: stringify(decoded) });

    const createData: CreateProfileDataType = {
      avatar: decoded.picture,
      email: decoded.email,
      name: decoded.name,
      uid: decoded.uid,
      updatedAt: FieldValue.serverTimestamp(),
      ...(isNewUser && { createdAt: FieldValue.serverTimestamp() }),
    };
    await db
      .collection(COLLECTIONS.PROFILES)
      .doc(decoded.uid)
      .set(createData, { merge: true });

    // TODO: upsert user details into profiles collection

    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: expiresIn / 1000,
    });
    return response;
  } catch {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
