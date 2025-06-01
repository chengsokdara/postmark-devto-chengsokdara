"use server";

import { getAuthUser } from "@/lib/firebase/auth";
import { updateDocument } from "@/lib/firestore/admin";
import { COLLECTIONS } from "@/types/enum.type";
import type { UpdateProfileDataType } from "@/types/firestore.type";
import { LOG_KEYS } from "@/types/key.type";
import { logWarn } from "@/utils/log";
import { stringify } from "@/utils/string";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type GenerateWebhookUrlStateType = {
  success: boolean;
  message?: string;
  error?: string;
  data?: UpdateProfileDataType;
};

const generateWebhookUrlSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),
  openaiApiKey: z
    .string()
    .regex(
      /^sk-[a-zA-Z0-9]{48}$/,
      "Invalid OpenAI token format. It must start with sk- followed by 48 alphanumeric characters",
    ),
});

export async function generateWebhookUrl(
  state: GenerateWebhookUrlStateType,
  formData: FormData,
): Promise<GenerateWebhookUrlStateType> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const trimmedData = {
      username: String(rawData.username).trim(),
      openaiApiKey: String(rawData.openaiApiKey).trim(),
    };
    const result = generateWebhookUrlSchema.safeParse(trimmedData);
    if (!result.success) {
      const errors = result.error.errors.map((err) => err.message).join("\n• ");
      return {
        success: false,
        message: "Validation Error",
        error: "• " + errors,
      };
    }

    const { username, openaiApiKey } = result.data;

    const authUser = await getAuthUser();
    if (!authUser) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const slug = username.toLowerCase();
    const updateData: UpdateProfileDataType = {
      openaiApiKey,
      slug,
    };
    await updateDocument(COLLECTIONS.PROFILES, authUser.uid, updateData);

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Webhook URL generated",
      data: updateData,
    };
  } catch (error) {
    logWarn(LOG_KEYS.ACTION.DASHBOARD.GENERATE_WEBHOOK_URL, { error });
    return {
      success: false,
      message: "Unknown Error",
      error: stringify(error),
    };
  }
}
