"use server";

import { getAuthUser } from "@/lib/firebase/auth";
import { updateDocument } from "@/lib/firestore/admin";
import { COLLECTIONS } from "@/types/enum.type";
import { UpdateProfileDataType } from "@/types/firestore.type";
import { revalidatePath } from "next/cache";

export type ProfileSlugState = {
  success: boolean;
  message?: string;
  error?: unknown;
  data?: {
    username: string;
    openai_access_token: string;
  };
};

export async function updateProfileSlug(
  prevState: ProfileSlugState,
  formData: FormData,
): Promise<ProfileSlugState> {
  const slug = formData.get("username") as string;
  const accessToken = formData.get("openai_access_token");
  console.log({ accessToken, slug });
  const updateData: UpdateProfileDataType = {
    slug,
  };
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return {
        success: false,
        message: "Unauthenticated",
      };
    }
    await updateDocument(COLLECTIONS.PROFILES, authUser.uid, updateData);
    revalidatePath("/dashboard");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "UnknownError",
      error,
    };
  }
}
