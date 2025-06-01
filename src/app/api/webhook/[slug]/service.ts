import {
  jobApplicationSchema,
  type AttachmentPayloadType,
  type JobApplication,
} from "@/app/api/webhook/[slug]/schema";
import { createOpenAI } from "@/lib/openai";
import { NoContentError, UnknownError } from "@/types/error.type";
import { LOG_KEYS } from "@/types/key.type";
import { logError, logInfo } from "@/utils/log";
import {
  buildJobApplicationSystemPrompt,
  buildJobApplicationUserPrompt,
} from "@/utils/prompt";
import { zodTextFormat } from "openai/helpers/zod";

const SUPPORTED_RESUME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
  "text/plain",
];

// Extraction

export function extractResumeAttachments(
  attachments: AttachmentPayloadType[],
): AttachmentPayloadType[] {
  return attachments.filter((att) =>
    isResumeAttachment(att.Name, att.ContentType),
  );
}

export const extractJobApplication = async (
  emailText: string,
  resumeText?: string,
  apiKey?: string, // OpenAI API key
): Promise<JobApplication> => {
  try {
    const systemPrompt = buildJobApplicationSystemPrompt();
    const userPrompt = buildJobApplicationUserPrompt(emailText, resumeText);
    const formattedSchema = zodTextFormat(
      jobApplicationSchema,
      "job_application",
    );
    logInfo(LOG_KEYS.API.POSTMARK.WEBHOOK.LLM_EXTRACTING, {
      emailLength: emailText.length,
      systemPrompt,
      userPrompt,
      resumeLength: resumeText?.length || 0,
    });

    const openai = createOpenAI(apiKey);
    const response = await openai.responses.parse({
      model: "gpt-4o-2024-08-06",
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      text: {
        format: formattedSchema,
      },
      // reasoning: {},
      // tools: [],
      // temperature: 1,
      // max_output_tokens: 2048,
      // top_p: 1,
      // store: true,
    });

    const responseContent = response.output_parsed;
    if (!responseContent) {
      throw new NoContentError("No response from LLM");
    }

    const extracted = responseContent as JobApplication;

    logInfo(LOG_KEYS.API.POSTMARK.WEBHOOK.LLM_SUCCESS, {
      confidence: extracted.confidence,
      experienceCount: extracted.resume?.parsedContent?.experience?.length || 0,
      skillsCount: extracted.resume?.parsedContent?.skills?.length || 0,
      resumeLength: resumeText?.length || 0,
    });

    return extracted;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logError(LOG_KEYS.API.POSTMARK.WEBHOOK.LLM_ERROR, {
      error: errorMessage,
      emailLength: emailText.length,
      resumeLength: resumeText?.length || 0,
    });
    throw new UnknownError(`LLM extraction failed: ${errorMessage}`);
  }
};

// Check

export function isResumeAttachment(
  fileName: string,
  contentType: string,
): boolean {
  const resumeKeywords = ["resume", "cv", "curriculum"];
  const nameContainsKeyword = resumeKeywords.some((keyword) =>
    fileName.toLowerCase().includes(keyword),
  );
  return nameContainsKeyword || SUPPORTED_RESUME_TYPES.includes(contentType);
}

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validation

export const validateExtractedResult = (result: unknown): boolean => {
  return validateStructure(result) && validateSemantics(result);
};

export const validateStructure = (
  result: unknown,
): result is JobApplication => {
  try {
    jobApplicationSchema.parse(result);
    return true;
  } catch {
    return false;
  }
};

export const validateSemantics = (result: JobApplication): boolean => {
  const emailOk =
    !!result.applicant?.email && isValidEmail(result.applicant.email);
  const hasName = !!result.applicant?.fullName?.trim();

  const hasJobIntent =
    !!result.position?.title?.trim() ||
    !!result.application?.coverLetter?.trim() ||
    !!result.application?.motivation?.trim();

  return emailOk && hasName && hasJobIntent;
};
