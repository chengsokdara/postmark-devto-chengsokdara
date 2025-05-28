import { queryDocuments } from "@/app/api/firebase/firestore/service";
import { inboundWebhookSchema } from "@/app/api/webhook/[slug]/schema";
import { COLLECTIONS } from "@/types/enum.type";
import { UnauthorizedError, ValidationError } from "@/types/error.type";
import type { ProfileDataType } from "@/types/firestore.type";
import { LOG_KEYS } from "@/types/key.type";
import { logInfo, logWarn } from "@/utils/log";
import { controlledError, controlledResult } from "@/utils/response";
import { NextRequest } from "next/server";
import { handleWebhook } from "./handler";

export async function controlWebhook(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const isDevelopment = process.env.APP_ENV === "development";

    const { slug } = await params;
    logInfo(LOG_KEYS.API.WEBHOOK.SLUG_PARAM, { slug });

    const profiles = await queryDocuments<ProfileDataType>(
      COLLECTIONS.PROFILES,
      {
        select: ["slug"],
        where: [["slug", "==", slug]],
        limit: 1,
      },
    );
    if (!profiles.length && !isDevelopment) {
      throw new UnauthorizedError("Invalid username or ID");
    }

    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0].trim();
    logInfo(LOG_KEYS.API.POSTMARK.WEBHOOK.IP_CHECK, { clientIp, forwardedFor });

    const authorizedIps = [
      "3.134.147.250",
      "50.31.156.6",
      "50.31.156.77",
      "18.217.206.57",
      "127.0.0.1",
    ];
    if (!authorizedIps.includes(clientIp) && !isDevelopment) {
      throw new UnauthorizedError(`Unauthorized POST from ${clientIp}!`);
    }

    const body = await request.json();
    const validation = inboundWebhookSchema.safeParse(body);
    if (!validation.success) {
      logWarn(LOG_KEYS.API.POSTMARK.WEBHOOK.VALIDATE_BODY, {
        validationError: validation.error,
      });
      throw new ValidationError("Invalid Postmark payload");
    }

    const result = handleWebhook(validation.data, profiles[0]);
    return controlledResult(result, "Webhook inbound email processed.");
  } catch (error) {
    return controlledError(error);
  }
}
