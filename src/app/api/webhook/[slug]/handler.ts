import {
  AttachmentPayloadType,
  InboundWebhookPayloadType,
} from "@/app/api/webhook/[slug]/schema";
import {
  extractJobApplication,
  extractResumeAttachments,
  validateExtractedResult,
} from "@/app/api/webhook/[slug]/service";
import { db } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/types/enum.type";
import { ValidationError } from "@/types/error.type";
import type {
  CreateCandidateDataType,
  CreateEmailDataType,
  CreateJobApplicationDataType,
  ProfileDataType,
  UpdateEmailDataType,
} from "@/types/firestore.type";
import { LOG_KEYS } from "@/types/key.type";
import type { ParsedAttachment } from "@/types/postmark.type";
import { logError, logInfo } from "@/utils/log";
import { parseAttachment } from "@/utils/parser";
import { normalizeEmail } from "@/utils/string";
import { FieldValue } from "firebase-admin/firestore";

export async function handleWebhook(
  payload: InboundWebhookPayloadType,
  user: ProfileDataType,
): Promise<Record<string, any>> {
  const { Attachments, ...emailPayload } = payload;
  try {
    const emailRef = db
      .collection(COLLECTIONS.EMAILS)
      .doc(emailPayload.MessageID);
    const emailData: CreateEmailDataType = {
      ...emailPayload,
      hasAttachment: Attachments.length > 0,
      isJobApplication: true,
      owner: user.id,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    await emailRef.set(emailData, { merge: true });

    logInfo(LOG_KEYS.API.POSTMARK.WEBHOOK.PROCESSING_START, {
      from: emailPayload.From,
      subject: emailPayload.Subject,
      messageId: emailPayload.MessageID,
      attachmentLength: Attachments.length,
    });

    // Step 1: Prepare email content for processing
    const emailText = [
      `Subject: ${emailPayload.Subject}`,
      `From: ${emailPayload.From} ${emailPayload.FromName ? `(${emailPayload.FromName})` : ""}`,
      `Date: ${emailPayload.Date}`,
      "",
      emailPayload.TextBody || emailPayload.HtmlBody || "",
    ].join("\n");

    // Step 2: Process attachments to find and parse resumes
    let resumeData: ParsedAttachment | undefined;
    let resumeText: string | undefined;
    if (Attachments.length) {
      const attachmentsResult = await handleAttachments(Attachments);
      resumeData = attachmentsResult.resumeData;
      resumeText = attachmentsResult.resumeText;
    }

    // Step 3: Process with LLM
    const extracted = await extractJobApplication(
      emailText,
      resumeText,
      user.openaiApiKey,
    );
    logInfo(LOG_KEYS.API.POSTMARK.WEBHOOK.PROCESSING_COMPLETE, {
      applicantEmail: extracted.applicant.email,
      applicantName: extracted.applicant.fullName,
      positionTitle: extracted.position.title,
      confidenceScore: extracted.confidence.overall,
      extracted,
      resumeLength: resumeText?.length || 0,
    });

    // Step 4: Validate processing result
    const isValid = validateExtractedResult(extracted);
    if (!isValid) {
      await emailRef.update({
        isJobApplication: false,
        updatedAt: FieldValue.serverTimestamp(),
      } as UpdateEmailDataType);

      throw new ValidationError("LLM processing result failed validation");
    }

    // Step 5: Prepare input for Firestore
    const { applicant: extractedApplicant, ...extractedJobApplication } =
      extracted;

    const candidateRef = db.collection(COLLECTIONS.CANDIDATES).doc();
    const candidateData: CreateCandidateDataType = {
      ...extractedApplicant,
      email: normalizeEmail(extracted.applicant.email),
      owner: user.id,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const jobApplicationRef = db.collection(COLLECTIONS.JOB_APPLICATIONS).doc();
    const jobApplicationData: CreateJobApplicationDataType = {
      ...extractedJobApplication,
      candidateId: candidateRef.id,
      status: "submitted",
      owner: user.id,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Step 6: Save to Firestore
    const batch = db.batch();
    batch.create(candidateRef, candidateData);
    batch.create(jobApplicationRef, jobApplicationData);
    await batch.commit();

    logInfo(LOG_KEYS.API.POSTMARK.WEBHOOK.FIRESTORE_SUCESS, {
      jobApplicationId: jobApplicationRef.id,
      candidateId: candidateRef.id,
    });

    return {
      message: "Postmark Webhook: Inbound email processed.",
      data: {
        success: true,
        applicationId: jobApplicationRef.id,
        candidateId: candidateRef.id,
        applicant: {
          email: extracted.applicant.email,
          name: extracted.applicant.fullName,
        },
        position: extracted.position.title,
        confidence: extracted.confidence.overall,
        hasResume: !!resumeData,
      },
    };
  } catch (error) {
    logError(LOG_KEYS.API.POSTMARK.WEBHOOK.PROCESSING_ERROR, {
      error,
      from: emailPayload.From,
      subject: emailPayload.Subject,
      messageId: emailPayload.MessageID,
    });
    throw error;
  }
}

type HandleAttachmentsResult = {
  resumeData?: ParsedAttachment;
  resumeText?: string;
};

async function handleAttachments(
  attachments: AttachmentPayloadType[],
): Promise<HandleAttachmentsResult> {
  const resumeAttachments = extractResumeAttachments(attachments);
  if (!resumeAttachments.length) return {};

  const firstResume = resumeAttachments[0];
  try {
    const parsedAttachment = await parseAttachment(firstResume);
    const resumeText = parsedAttachment.Text;

    logInfo(LOG_KEYS.API.POSTMARK.WEBHOOK.RESUME_PARSED, {
      fileName: firstResume.Name,
      contentType: firstResume.ContentType,
      textLength: resumeText.length,
      resumeText,
    });

    return {
      resumeData: parsedAttachment,
      resumeText,
    };
  } catch (error) {
    logError(LOG_KEYS.API.POSTMARK.WEBHOOK.RESUME_PARSE_ERROR, {
      fileName: firstResume.Name,
      error: error instanceof Error ? error.message : "Unknown Error",
    });
    return {};
  }
}
