export function getHeaderValue(headers: any[], name: string): string {
  const header = headers.find(h => h.name === name);
  return header ? header.value : '';
}

export function cleanEmailAddress(email: string): string {
  const emailMatch = email.match(/<(.+)>/);
  return emailMatch ? emailMatch[1] : email;
}

export function getFileExtension(contentType: string): string {
  const extensions: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/webm': 'webm',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg'
  };
  return extensions[contentType] || 'bin';
}

// Lista över tekniska headers som ska filtreras bort
const TECHNICAL_HEADERS = [
  'ARC-Message-Signature',
  'ARC-Authentication-Results',
  'ARC-Seal',
  'Return-Path',
  'Received',
  'Received-SPF',
  'Authentication-Results',
  'DKIM-Signature',
  'X-Google-DKIM-Signature',
  'X-Gm-Message-State',
  'X-Gm-Gg',
  'X-Google-Smtp-Source',
  'MIME-Version',
  'X-Received',
  'X-Forwarded-For',
  'X-Forwarded-Proto',
  'X-Forwarded-Host',
  'X-Forwarded-Port',
  'X-Original-To',
  'X-Original-From',
  'X-Original-Subject',
  'X-Original-Date',
  'X-Original-Message-ID',
  'X-Original-References',
  'X-Original-In-Reply-To',
  'X-Original-Thread-Index',
  'X-Original-Thread-Topic',
  'X-Original-Thread-Id',
  'X-Original-Thread-Parent',
  'X-Original-Thread-References',
  'X-Original-Thread-In-Reply-To',
  'X-MS-Exchange-MessageSentRepresentingType',
  'X-MS-Has-Attach',
  'X-MS-Exchange-Organization-SCL',
  'X-MS-TNEF-Correlator',
  'X-MS-Exchange-Organization-RecordReviewCfmType',
  'msip_labels',
  'Thread-Topic',
  'Thread-Index',
  'Accept-Language',
  'Content-Language'
];

export function extractEmailContent(payload: any): { subject: string; from: string; to: string; date: string; content: string } {
  // Filtrera bort tekniska headers
  const cleanHeaders = payload.headers.filter((header: any) => 
    !TECHNICAL_HEADERS.includes(header.name)
  );

  const subject = getHeaderValue(cleanHeaders, 'Subject');
  const from = cleanEmailAddress(getHeaderValue(cleanHeaders, 'From'));
  const to = cleanEmailAddress(getHeaderValue(cleanHeaders, 'To'));
  const date = new Date(getHeaderValue(cleanHeaders, 'Date')).toISOString();

  let content = '';

  // Rekursiv funktion för att hitta textinnehåll
  const findTextContent = (part: any): string => {
    if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
      if (part.body && part.body.data) {
        return Buffer.from(part.body.data, 'base64').toString();
      }
    } else if (part.parts) {
      // Gå igenom alla delar rekursivt
      for (const subPart of part.parts) {
        const foundContent = findTextContent(subPart);
        if (foundContent) {
          return foundContent;
        }
      }
    }
    return '';
  };

  if (payload.parts) {
    content = findTextContent(payload);
  } else if (payload.body && payload.body.data) {
    content = Buffer.from(payload.body.data, 'base64').toString();
  }

  return { subject, from, to, date, content };
} 