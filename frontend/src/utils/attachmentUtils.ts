export const getAttachmentUrl = (url: string): string => {
  // Om URL:en redan är en fullständig URL, returnera den som den är
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Annars, lägg till bas-URL:en från miljövariabeln
  return `${import.meta.env.VITE_BASE_ADDRESS}${url}`;
};

export const isImage = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
}; 