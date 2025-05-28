import {
  NoContentError,
  PreconditionError,
  UnauthorizedError,
  UnprocessableError,
  UnsupportedError,
  ValidationError,
} from "@/types/error.type";
import { LOG_KEYS } from "@/types/key.type";
import type {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
} from "@/types/response.type";
import { logError } from "@/utils/log";
import { stringify } from "@/utils/string";
import { NextResponse } from "next/server";

export function controlledError<T = unknown>(
  error: unknown,
): NextResponse<ApiResponse<T>> {
  if (
    error instanceof ValidationError ||
    error instanceof SyntaxError ||
    error instanceof TypeError
  )
    return badRequest(error.message);
  if (error instanceof NoContentError) return noContent(error.message);
  if (error instanceof PreconditionError)
    return preconditionFailed(error.message);
  if (error instanceof UnauthorizedError) return unauthorized(error.message);
  if (error instanceof UnprocessableError) return unprocessable(error.message);
  if (error instanceof UnsupportedError) return unsupported(error.message);
  return internalError(error);
}

export function controlledResult<T>(data: T, message?: string) {
  return ok<T>(data, message);
}

export function ok<T>(
  data: T,
  message = "OK",
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ data, message }, { status: 200 });
}

export function badRequest(
  message = "Bad Request",
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function internalError(
  error?: unknown,
  message = "Internal Server Error",
): NextResponse<ApiErrorResponse> {
  logError(LOG_KEYS.RESPONSE.INTERNAL_ERROR, { error: stringify(error) });
  return NextResponse.json(
    { error: `${message} ${stringify(error)}` },
    { status: 500 },
  );
}

export function noContent(
  message = "No Content",
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: message }, { status: 204 });
}

export function notFound(
  message = "Not Found",
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function preconditionFailed(
  message = "Precondition Failed",
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: message }, { status: 412 });
}

export function unauthorized(
  message = "Unauthorized",
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function unprocessable(
  message = "Unprocessable Entity",
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: message }, { status: 422 });
}

export function unsupported(
  message = "Unsupported",
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: message }, { status: 415 });
}
