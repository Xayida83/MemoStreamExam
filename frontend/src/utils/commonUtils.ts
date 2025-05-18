/**
 * Common utility functions used across components
 */

/**
 * Gets the full URL for an attachment
 * @param url The attachment URL
 * @returns The full URL
 */

const FILE_BASE = import.meta.env.VITE_FILE_BASE_ADDRESS;

export const getAttachmentUrl = (url: string): string => {
  if (url.startsWith('http')) {
    return url;
  }
  return `${FILE_BASE}${url}`;
};

/**
 * Cleans a filename by removing leading numbers and text after first period or parenthesis
 * @param filename The original filename
 * @returns The cleaned filename
 */
export const cleanFilename = (filename: string): string => {
  return filename.replace(/^\d+/, '').split(/[.(]/)[0];
};

/**
 * Checks if a MIME type is an image
 * @param mimeType The MIME type to check
 * @returns True if the MIME type is an image
 */
export const isImage = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

/**
 * Checks if a MIME type is a video
 * @param mimeType The MIME type to check
 * @returns True if the MIME type is a video
 */
export const isVideo = (mimeType: string): boolean => {
  return mimeType.startsWith('video/');
};

/**
 * Checks if a MIME type is an audio file
 * @param mimeType The MIME type to check
 * @returns True if the MIME type is an audio file
 */
export const isAudio = (mimeType: string): boolean => {
  return mimeType.startsWith('audio/');
};

/**
 * Gets a human-readable label for a file type
 * @param mimeType The MIME type
 * @returns A human-readable label
 */
export const getFileTypeLabel = (mimeType: string): string => {
  if (isImage(mimeType)) return 'Bild';
  if (isVideo(mimeType)) return 'Video';
  if (isAudio(mimeType)) return 'Ljud';
  return 'Fil';
}; 