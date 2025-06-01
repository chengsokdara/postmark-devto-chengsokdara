# Postmark x Dev.to Challenge by Cheng Sokdara

## What I Built

I built a web application that automates the initial stages of the hiring process by leveraging Next.js and Postmark's inbound email parsing feature. The application receives job application emails, uses an LLM (OpenAI GPT) to intelligently extract relevant information from the email body and any attached resumes (PDF or DOCX), and then stores this structured data in Firebase Firestore. This data, including candidate details, job application specifics, and the original parsed email, is then accessible via a dashboard for easy viewing and management.

## Demo

You can try out the live demo here:

[https://postmark-devto-chengsokdara.vercel.app](https://postmark-devto-chengsokdara.vercel.app)

**Testing Instructions:**

1.  Navigate to the demo application and log in using a Google account.
2.  Once on the dashboard, you'll need to provide a username and a disposable OpenAI API key. This key is used securely on the server-side to process the parsed emails with the LLM.
3.  After submitting the form, a unique webhook URL will be generated for you.
4.  Copy this webhook URL.
5.  Go to your Postmark account, navigate to your inbound email settings, and paste this webhook URL. Save the changes.
6.  Now, using any email client, compose a job application email (you can attach a resume in PDF or DOCX format) and send it to your Postmark inbound email address.
7.  Wait a few seconds for the processing to complete.
8.  Refresh the dashboard in the web app or navigate to the "Applications," "Candidates," or "Emails" pages to see the parsed data.

## Code Repository

The complete source code is available on GitHub:

[https://github.com/chengsokdara/postmark-devto-chengsokdara](https://github.com/chengsokdara/postmark-devto-chengsokdara)

## How I Built It

I developed this project from scratch with the help of ChatGPT and Grok. This involved writing original utility functions and a few custom UI components.

The core process flow is as follows:

1.  Postmark receives an inbound job application email and parses it, providing a JSON representation.
2.  My application ingests this JSON. If a resume (PDF or DOCX) is attached, it's parsed using `pdf2json` for PDFs or `mammoth` for DOCX files.
3.  The combined data (parsed email content and parsed resume text) is then sent to the OpenAI GPT LLM.
4.  The LLM processes this information, extracting key details and structuring them.
5.  This structured data, which includes candidate information, job application details, and the original parsed email, is then saved to Firebase Firestore.

My experience with Postmark's inbound parsing was straightforward; the JSON output was easy to work with and integrate into the application flow.

**Tech Stack:**

- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** Tailwind CSS & Daisy UI
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **State Management (Global Toast):** Zustand
- **File Parsing:** `pdf2json` (for PDFs), `mammoth` (for DOCX)
- **Validation:** Zod
- **LLM:** OpenAI GPT-3.5 (or your preferred model)
- **Icons:** Heroicons
- **Email Parsing Service:** Postmark

## Team Submissions

[@chengsokdara](https://dev.to/chengsokdara)

---

Contact me for web or mobile app development using React or React Native
https://chengsokdara.github.io
