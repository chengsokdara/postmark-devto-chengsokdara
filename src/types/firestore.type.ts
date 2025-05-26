import {
  applicantSchema,
  type ExtractedJobApplication,
  type InboundWebhookPayloadType,
} from "@/app/api/postmark/webhook/schema";
import { FieldValue as AdminFieldValue } from "firebase-admin/firestore";
import { FieldValue as ClientFieldValue } from "firebase/firestore";
import { z } from "zod";

type FieldValue = AdminFieldValue | ClientFieldValue;

type CommonDataType = {
  id: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

// Candidate Data Type

export type CandidateDataType = z.infer<typeof applicantSchema> &
  CommonDataType;

export type CreateCandidateDataType = Omit<CandidateDataType, "id">;

export type UpdateCandidateDataType = Partial<
  Omit<CandidateDataType, "id" | "createdAt">
>;

// Email Data Type

export type EmailDataType = {
  hasAttachment: boolean;
  isJobApplication: boolean;
} & Omit<InboundWebhookPayloadType, "Attachments"> &
  CommonDataType;

export type CreateEmailDataType = Omit<EmailDataType, "id">;

export type UpdateEmailDataType = Partial<
  Omit<EmailDataType, "id" | "createdAt">
>;

// Job Application Data Type

export type JobApplicationStatus =
  | "submitted" // Application received
  | "in_review" // Being looked at by a recruiter
  | "shortlisted" // Selected for next steps
  | "interview_scheduled" // Interview scheduled (can add stages later)
  | "interviewed" // Interview completed
  | "offered" // Offer made
  | "accepted" // Offer accepted
  | "rejected" // Final rejection
  | "withdrawn" // Candidate withdrew
  | "hired" // Candidate officially hired
  | "archived"; // No longer active, used for cleanup/history

export type JobApplicationDataType = {
  candidateId: string; // foreign key to candidates collection
  status: JobApplicationStatus;
  notes?: string[];
} & Omit<ExtractedJobApplication, "applicant"> &
  CommonDataType;

export type CreateJobApplicationDataType = Omit<JobApplicationDataType, "id">;

export type UpdateJobApplicationDataType = Partial<
  Omit<JobApplicationDataType, "id" | "createdAt">
>;
