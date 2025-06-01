import { UnauthorizedError } from "@/types/error.type";
import OpenAI from "openai";

export const createOpenAI = (apiKey?: string) => {
  if (!apiKey && process.env.APP_ENV !== "development") {
    throw new UnauthorizedError("OpenAI API key is missing");
  }
  return new OpenAI({
    apiKey:
      process.env.APP_ENV === "development"
        ? apiKey || process.env.OPENAI_API_KEY
        : apiKey,
  });
};
