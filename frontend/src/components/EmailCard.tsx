import React from 'react';
import { Email } from '../types/Email';
import './EmailCard.css';

interface EmailCardProps {
  email: Email;
}

export const EmailCard: React.FC<EmailCardProps> = ({ email }) => {
  const firstImageAttachment = email.attachments?.find(
    attachment => attachment.mimeType.startsWith('image/')
  );

  const getAttachmentUrl = (url: string) => {
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:5000${url}`;
  };

  const getDisplayName = (filename: string) => {
    return filename.replace(/^\d+/, '').split(/[.(]/)[0];
  };

  const getImageDescription = (filename: string, subject: string) => {
    const displayName = getDisplayName(filename);
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