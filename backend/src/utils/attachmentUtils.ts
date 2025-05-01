import { Attachment } from '../models/Email.js';
import { StorageService } from '../services/StorageService.js';
import { getFileExtension } from './emailUtils.js';

export async function processAttachmentData(
  storageService: StorageService,
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<Attachment> {
  // Process and optimize the attachment
  const processedBuffer = await storageService.processMedia(buffer, mimeType);
  console.log(`Processed attachment: ${filename}`);
  
  // Upload to storage
  const url = await storageService.uploadMedia(processedBuffer, filename, mimeType);
  console.log(`Uploaded attachment: ${filename} to ${url}`);

  return {
    id: filename,
    filename,
    mimeType,
    size: buffer.length,
    url
  };
}

export function generateEmbeddedFilename(mimeType: string): string {
  return `embedded-${Date.now()}.${getFileExtension(mimeType)}`;
}

export function isAttachmentPart(part: any): boolean {
  return (
    (part.filename && part.filename.length > 0 && part.body && part.body.attachmentId) ||
    (part.body && part.body.data && part.mimeType && 
     !part.mimeType.startsWith('text/') && 
     !part.mimeType.startsWith('multipart/'))
  );
}

export function isEmbeddedAttachment(part: any): boolean {
  return (
    part.body && 
    part.body.data && 
    part.mimeType && 
    !part.mimeType.startsWith('text/') && 
    !part.mimeType.startsWith('multipart/')
  );
} 