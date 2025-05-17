import React from 'react';
import { Email } from '../types/Email';
import { getAttachmentUrl, cleanFilename, isImage } from '../utils/commonUtils';
import './EmailCard.css';

interface EmailCardProps {
  email: Email;
}

export const EmailCard: React.FC<EmailCardProps> = ({ email }) => {
  const firstImageAttachment = email.attachments?.find(
    attachment => isImage(attachment.mimeType)
  );

  const getImageDescription = (filename: string, subject: string) => {
    const displayName = cleanFilename(filename);
    return `Bild från e-post med ämne "${subject}". Bilden är en ${displayName}.`;
  };

  return (
    <div className="card">
      <div className="card-image">
        {firstImageAttachment ? (
          <img 
            src={getAttachmentUrl(firstImageAttachment.url)} 
            alt={getImageDescription(firstImageAttachment.filename, email.subject)}
            loading="lazy"
            aria-label={getImageDescription(firstImageAttachment.filename, email.subject)}
          />
        ) : (
          <div className="no-image">
            <p>Finns ingen bild att visa</p>
          </div>
        )}
      </div>
      <div className="card-content">
        <h3>{email.subject}</h3>
        <p>{email.firstParagraph}</p>
      </div>
    </div>
  );
}; 