import {
  UnknownError,
  UnprocessableError,
  UnsupportedError,
} from "@/types/error.type";
import { Attachment, type ParsedAttachment } from "@/types/postmark.type";
import mammoth from "mammoth";
import PDFParser from "pdf2json";

export async function parseAttachment(
  attachment: Attachment,
): Promise<ParsedAttachment> {
  try {
    const { Content, ContentType } = attachment;
    const buffer = Buffer.from(Content, "base64");
    let text = "";

    switch (ContentType) {
      case "application/pdf":
        text = await parsePdf(buffer);
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        text = await parseDocx(buffer);
        break;
      case "application/msword":
        throw new UnsupportedError(
          "Legacy .doc files not supported. Please use .docx format.",
        );
      case "text/plain":
        text = buffer.toString("utf-8");
        break;
      default:
        throw new UnsupportedError(`Unsupported media type: ${ContentType}`);
    }

    return {
      ...attachment,
      Text: cleanText(text),
    };
  } catch (error) {
    throw new UnknownError(
      `Failed to parse resume: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

async function parsePdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);

    const onDataError = (errData: Record<"parserError", Error>) => {
      pdfParser.removeAllListeners();
      reject(new UnprocessableError(errData.parserError.message));
    };

    const onDataReady = () => {
      pdfParser.removeAllListeners();
      resolve(pdfParser.getRawTextContent());
    };

    pdfParser.on("pdfParser_dataError", onDataError);
    pdfParser.on("pdfParser_dataReady", onDataReady);

    pdfParser.parseBuffer(buffer);
  });
}

async function parseDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\n{3,}/g, "\n\n") // Remove excessive line breaks
    .replace(/\s{2,}/g, " ") // Remove excessive spaces
    .trim();
}
