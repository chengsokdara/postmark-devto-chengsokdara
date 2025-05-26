/**
 * Attachment content
 *
 * @param Name - name of the attachment, for example book.pdf
 * @param Content - Base64 encoded content, for example: fs.readFileSync('/Folder/book.pdf').toString('base64')
 * @param ContentID - id of the attachment, in case we are referencing it, for example: cid:123book.pdf
 * @param ContentType - content type (json, image, etc)
 * @param ContentLength - length of the message
 */
export class Attachment {
  public Name: string;
  public ContentID: string | null;
  public Content: string;
  public ContentType: string;
  public ContentLength?: number;
  public Disposition?: string | null;
  constructor(
    Name: string,
    Content: string,
    ContentType: string,
    ContentID: string | null = null,
    ContentLength?: number,
    Disposition?: string,
  ) {
    this.Name = Name;
    this.Content = Content;
    this.ContentType = ContentType;
    this.ContentID = ContentID;
    this.ContentLength = ContentLength;
    this.Disposition = Disposition;
  }
}

export type ParsedAttachment = {
  Text: string;
} & Attachment;

export class Header {
  public Name: string;
  public Value: string;
  constructor(Name: string, Value: string) {
    this.Name = Name;
    this.Value = Value;
  }
}

export interface InboundRecipient {
  Email: string;
  Name: string;
  MailboxHash: string;
}

export interface InboundWebhook {
  From: string;
  FromName: string;
  FromFull: InboundRecipient;
  To: string;
  ToFull: InboundRecipient[];
  Cc: string;
  CcFull: InboundRecipient[];
  Bcc: string;
  BccFull: InboundRecipient[];
  ReplyTo: string;
  OriginalRecipient: string;
  Subject: string;
  Date: string;
  MailboxHash: string;
  Tag?: string;
  MessageID: string;
  MessageStream: string;
  RawEmail?: string;
  TextBody: string;
  HtmlBody: string;
  StrippedTextReply: string;
  Headers: Header[];
  Attachments: Attachment[];
}
