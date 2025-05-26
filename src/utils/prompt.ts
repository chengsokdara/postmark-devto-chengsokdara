export const buildJobApplicationSystemPrompt = () =>
  `You are an expert HR assistant that extracts structured data from job application emails and resumes. Your goal is to populate a standardized job application schema with the applicant's information.`;

export const buildJobApplicationUserPrompt = (
  emailText: string,
  resumeText?: string,
) => `
EMAIL CONTENT:
---
${emailText}
---

${
  resumeText
    ? `RESUME CONTENT:
---
${resumeText}
---`
    : "No resume attached."
}
`;
