export const API_PATHS = {
  FIREBASE: {
    AUTH: {
      LOGIN: "/api/firebase/auth/login",
      LOGOUT: "/api/firebase/auth/logout",
    },
  },
} as const;

/**
 * This is for better search across logs
 */
export const LOG_KEYS = {
  API: {
    POSTMARK: {
      WEBHOOK: {
        IP_CHECK: "api.postmark.webhook.ip_check",
        VALIDATE_BODY: "api.postmark.webhook.validate_body",
        PROCESSING_START: "api.postmark.webhook.processing_start",
        PROCESSING_COMPLETE: "api.postmark.webhook.processing_complete",
        PROCESSING_ERROR: "api.postmark.webhook.processing_error",
        RESUME_PARSED: "api.postmark.webhook.resume_parsed",
        RESUME_PARSE_ERROR: "api.postmark.webhook.resume_parse_error",
        LLM_EXTRACTING: "api.postmark.webhook.llm_extracting",
        LLM_SUCCESS: "api.postmark.webhook.llm_success",
        LLM_ERROR: "api.postmark.webhook.llm_error",
        FIRESTORE_SUCESS: "api.postmark.webhook.firestore_success",
        FIRESTORE_ERROR: "api.postmark.webhook.firestore_error",
      },
    },
    WEBHOOK: {
      SLUG_PARAM: "api.webhook.slug_param",
    },
  },
  RESPONSE: {
    INTERNAL_ERROR: "response.internal_error",
  },
} as const;

type ExtractValues<T> = T extends string
  ? T
  : T extends Record<string, infer V>
    ? ExtractValues<V>
    : never;

export type LogKeyType = ExtractValues<typeof LOG_KEYS>;

export const QUERY_KEYS = {
  USER: "user",
} as const;
