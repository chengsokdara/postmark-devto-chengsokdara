import {
  applicantSchema,
  type InboundWebhookPayloadType,
  type JobApplication,
} from "@/app/api/webhook/[slug]/schema";
import type { DecodedIdToken } from "firebase-admin/auth";
import { FieldValue as AdminFieldValue } from "firebase-admin/firestore";
import type { User } from "firebase/auth";
import { FieldValue as ClientFieldValue } from "firebase/firestore";
import { z } from "zod";

type FieldValue = AdminFieldValue | ClientFieldValue;

type CommonDataType = {
  id: string;
  owner: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export type NormalizeDataType = {
  createdAt: string;
  updatedAt: string;
};

export type WithId<T> = T & { id: string };

export type WithIndex<T> = T & { index: number };

export type WithNormalize<T> = Omit<T, keyof NormalizeDataType> &
  NormalizeDataType;

// AuthUser Data Type

export type UserDataType = (DecodedIdToken | User) & ProfileDataType;

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
} & Omit<JobApplication, "applicant"> &
  CommonDataType;

export type CreateJobApplicationDataType = Omit<JobApplicationDataType, "id">;

export type UpdateJobApplicationDataType = Partial<
  Omit<JobApplicationDataType, "id" | "createdAt">
>;

// Profile Data Type

export type ProfileDataType = {
  avatar?: string | null;
  email?: string | null;
  openaiApiKey?: string;
  slug?: string | null;
  name: string;
  uid: string;
} & CommonDataType;

export type CreateProfileDataType = Partial<
  Omit<ProfileDataType, "id" | "owner">
>;

export type UpdateProfileDataType = Partial<
  Omit<ProfileDataType, "id" | "createdAt">
>;
