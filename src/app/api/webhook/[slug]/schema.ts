import { z } from "zod";

/**
 * Postmark Webhook Payload
 */

export const attachmentSchema = z.object({
  Name: z.string(),
  ContentID: z.string().nullable(),
  Content: z.string(),
  ContentType: z.string(),
  ContentLength: z.number().optional(),
  Disposition: z.string().nullable().optional(),
});

export const headerSchema = z.object({
  Name: z.string(),
  Value: z.string(),
});

export const inboundRecipientSchema = z.object({
  Email: z.string().email(),
  Name: z.string(),
  MailboxHash: z.string(),
});

export const inboundWebhookSchema = z.object({
  From: z.string(),
  FromName: z.string(),
  FromFull: inboundRecipientSchema,
  To: z.string(),
  ToFull: z.array(inboundRecipientSchema),
  Cc: z.string(),
  CcFull: z.array(inboundRecipientSchema),
  Bcc: z.string(),
  BccFull: z.array(inboundRecipientSchema),
  ReplyTo: z.string(),
  OriginalRecipient: z.string(),
  Subject: z.string(),
  Date: z.string(),
  MailboxHash: z.string(),
  Tag: z.string().optional(),
  MessageID: z.string(),
  MessageStream: z.string(),
  RawEmail: z.string().optional(),
  TextBody: z.string(),
  HtmlBody: z.string(),
  StrippedTextReply: z.string(),
  Headers: z.array(headerSchema),
  Attachments: z.array(attachmentSchema),
});

export type AttachmentPayloadType = z.infer<typeof attachmentSchema>;
export type InboundWebhookPayloadType = z.infer<typeof inboundWebhookSchema>;

/**
 * Job Application
 *
 * ✅ High likelihood the field can be extracted from a real-world email or resume
 * ⚠️ Low or uncertain likelihood from email/resume alone (hence optional)
 * 🧠 Best practice to include even if rarely extracted (e.g., helpful in downstream analytics)
 */

// ✅ Usually extractable
export const locationSchema = z.object({
  city: z.string().nullable(), // ⚠️ Often missing
  state: z.string().nullable(), // ⚠️ Often missing
  postalCode: z.string().nullable(), // ⚠️ Rarely found
  country: z.string().nullable(), // ✅ Often included in signature/resume
});

// ✅ Core experience info from resumes
export const experienceSchema = z.object({
  company: z.string(), // ✅ High-confidence from resume
  position: z.string(), // ✅
  startDate: z.string().nullable(), // ⚠️ Often missing/ambiguous
  endDate: z.string().nullable(), // ⚠️
  current: z.boolean().nullable(), // ⚠️ Inferred from "Present" in endDate
  location: z.string().nullable(), // ⚠️
  description: z.string().nullable(), // ✅ Sometimes extractable
  achievements: z.array(z.string()).nullable(), // ⚠️ Based on phrasing
  technologies: z.array(z.string()).nullable(), // 🧠 Useful for filtering/matching
});

// ✅ Common education info from resumes
export const educationSchema = z.object({
  institution: z.string(), // ✅
  degree: z.string().nullable(), // ✅
  field: z.string().nullable(), // ⚠️
  graduationYear: z.string().nullable(), // ⚠️
  gpa: z.string().nullable(), // ⚠️ Not always included
  location: z.string().nullable(), // ⚠️ Rare
});

// ⚠️ Rare, but useful to parse if available
export const certificationSchema = z.object({
  name: z.string(), // ✅
  issuer: z.string().nullable(), // ⚠️
  date: z.string().nullable(), // ⚠️
});

export const publicationSchema = z.object({
  title: z.string(), // ⚠️
  publisher: z.string().nullable(), // ⚠️
  date: z.string().nullable(), // ⚠️
  url: z
    .string()
    .regex(/^https?:\/\/.+$/)
    .nullable(), // ⚠️
});

export const projectSchema = z.object({
  name: z.string(), // ✅
  description: z.string().nullable(), // ✅
  technologies: z.array(z.string()).nullable(), // 🧠
  url: z
    .string()
    .regex(/^https?:\/\/.+$/)
    .nullable(), // ⚠️
});

export const awardSchema = z.object({
  name: z.string(), // ⚠️
  issuer: z.string().nullable(), // ⚠️
  date: z.string().nullable(), // ⚠️
});

export const volunteerExperienceSchema = z.object({
  organization: z.string(), // ⚠️
  role: z.string().nullable(), // ⚠️
  description: z.string().nullable(), // ⚠️
  startDate: z.string().nullable(), // ⚠️
  endDate: z.string().nullable(), // ⚠️
});

// ✅ Most parseable parts of resumes
export const resumeParsedContentSchema = z.object({
  summary: z.string().nullable(), // ✅
  skills: z.array(z.string()).nullable(), // ✅
  experience: z.array(experienceSchema).nullable(), // ✅
  education: z.array(educationSchema).nullable(), // ✅
  certifications: z.array(certificationSchema).nullable(), // ⚠️
  languages: z.array(z.string()).nullable(), // ⚠️
  publications: z.array(publicationSchema).nullable(), // ⚠️
  projects: z.array(projectSchema).nullable(), // ⚠️
  awards: z.array(awardSchema).nullable(), // ⚠️
  volunteerExperience: z.array(volunteerExperienceSchema).nullable(), // ⚠️
  interests: z.array(z.string()).nullable(), // ⚠️
  summaryKeywords: z.array(z.string()).nullable(), // 🧠 NLP-generated
});

// ✅ File-level info about the resume
export const resumeSchema = z.object({
  fileName: z.string().nullable(), // ✅
  fileType: z.string().nullable(), // ✅
  fileUrl: z
    .string()
    .regex(/^https?:\/\/.+$/)
    .nullable(), // ✅ if stored/uploaded
  originalText: z.string().nullable(), // ✅ from OCR/PDF parsing
  parsedContent: resumeParsedContentSchema.nullable(), // ✅
  matchScores: z
    .object({
      skillMatch: z.number().nullable(), // 🧠 from AI model
      experienceMatch: z.number().nullable(), // 🧠
      educationMatch: z.number().nullable(), // 🧠
    })

    .nullable(),
  parsingConfidence: z.number().nullable(), // 🧠 NLP pipeline score
});

// 🧠 Confidence scores per section (optional, useful for debug/analytics)
export const confidenceSchema = z.object({
  overall: z.number().nullable(),
  contactInfo: z.number().nullable(),
  experience: z.number().nullable(),
  skills: z.number().nullable(),
  education: z.number().nullable(),
  links: z.number().nullable(),
});

// ✅ Extracted or inferred from sender, signature, or resume
export const applicantSchema = z.object({
  email: z.string().email(), // ✅ From sender
  firstName: z.string().nullable(), // ⚠️ NLP required
  lastName: z.string().nullable(), // ⚠️ NLP required
  fullName: z.string(), // ✅ Can extract reliably
  phone: z.string().nullable(), // ✅ Often present
  linkedinUrl: z
    .string()
    .regex(/^https?:\/\/(www\.)?linkedin\.com\/.+$/)
    .nullable(), // ✅ Often in sig/resume
  portfolioUrl: z
    .string()
    .regex(/^https?:\/\/.+$/)
    .nullable(), // ⚠️
  githubUrl: z
    .string()
    .regex(/^https?:\/\/(www\.)?github\.com\/.+$/)
    .nullable(), // ⚠️
  personalWebsiteUrl: z
    .string()
    .regex(/^https?:\/\/.+$/)
    .nullable(), // ⚠️
  location: locationSchema.nullable(), // ⚠️ Often vague
  currentCompany: z.string().nullable(), // ⚠️ May require inference
  currentJobTitle: z.string().nullable(), // ⚠️
});

// ⚠️ Often vague unless form-submitted or tracked
export const positionSchema = z.object({
  title: z.string().nullable(), // ✅ Sometimes inferred from subject or resume
  referenceNumber: z.string().nullable(), // ⚠️ Rare
  location: z.string().nullable(), // ⚠️
});

// ✅ Usually NLP can produce a short list
export const applicationSchema = z.object({
  coverLetter: z.string().nullable(), // ✅ Can extract if separate
  motivation: z.string().nullable(), // ⚠️ Often part of cover letter
  keyHighlights: z.array(z.string()).nullable(), // 🧠 From NLP summarization
  relevantExperience: z.array(z.string()).nullable(), // 🧠 Extracted or generated
  submittedAt: z.string().datetime().nullable(), // ✅ From email metadata
  source: z.string().nullable(), // ⚠️ Email, LinkedIn, referral
  referredBy: z.string().nullable(), // ⚠️ Rare
});

// ✅ Internal system tracking (not from applicant)
export const metadataSchema = z.object({
  receivedAt: z.string().datetime(), // ✅ Email header
  parsedAt: z.string().datetime().nullable(), // 🧠 When processed
  sourceEmailId: z.string().nullable(), // ✅ Internal ref
  processingNotes: z.array(z.string()).nullable(), // 🧠 Debug logs
});

export const jobApplicationSchema = z.object({
  applicant: applicantSchema,
  position: positionSchema,
  application: applicationSchema,
  resume: resumeSchema.nullable(),
  confidence: confidenceSchema,
  metadata: metadataSchema.nullable(),
});

export type JobApplication = z.infer<typeof jobApplicationSchema>;
