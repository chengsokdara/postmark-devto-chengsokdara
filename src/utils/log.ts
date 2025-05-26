import type { LogKeyType } from "@/types/key.type";

const isBrowser = typeof window !== "undefined";

const appEnv = isBrowser
  ? process.env.NEXT_PUBLIC_APP_ENV
  : process.env.APP_ENV;

const isProduction = appEnv === "production";

const logLevel =
  (isBrowser
    ? process.env.NEXT_PUBLIC_APP_LOG_LEVEL
    : process.env.APP_LOG_LEVEL) || "info";

function shouldLog(level: "info" | "warn" | "error") {
  if (logLevel === "silent") return false;
  if (logLevel === "error" && level !== "error") return false;
  if (logLevel === "warn" && level === "info") return false;
  return true;
}

function formatPrefix(level: string, key: string) {
  const scope = isBrowser ? "[CLIENT]" : "[SERVER]";
  return `${scope} [${level.toUpperCase()}] ${key}`;
}

export function logInfo(key: LogKeyType, data?: unknown) {
  if (!isProduction && shouldLog("info")) {
    console.log(formatPrefix("info", key), data ?? "");
  }
}

export function logWarn(key: LogKeyType, data?: unknown) {
  if (!isProduction && shouldLog("warn")) {
    console.warn(formatPrefix("warn", key), data ?? "");
  }
}

export function logError(key: LogKeyType, data?: unknown) {
  if (shouldLog("error")) {
    console.error(formatPrefix("error", key), data ?? "");
  }
}
