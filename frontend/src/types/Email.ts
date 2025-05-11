export interface Email {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  content: string;
  attachments: Attachment[];
  processedAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}