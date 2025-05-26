import { handlePostmarkWebhook } from "@/app/api/postmark/webhook/handler";
import { inboundWebhookSchema } from "@/app/api/postmark/webhook/schema";
import { UnauthorizedError, ValidationError } from "@/types/error.type";
import { LOG_KEYS } from "@/types/key.type";
import type { ApiResponse } from "@/types/response.type";
import { logInfo, logWarn } from "@/utils/log";
import { controlledError, controlledResult } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";

export async function controlPostmarkWebhook(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<Record<string, any>>>> {
  try {
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
    const isDevelopment = process.env.APP_ENV === "development";
    if (!isDevelopment && !authorizedIps.includes(clientIp)) {
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

    const result = await handlePostmarkWebhook(validation.data);
    return controlledResult(
      result,
      "Postmark Webhook: Inbound email processed.",
    );
  } catch (error) {
    return controlledError(error);
  }
}
