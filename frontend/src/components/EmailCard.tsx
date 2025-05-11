import React from 'react';
import { Email } from '../types/Email';
import AttachmentComponent from './AttachmentComponent';
import './EmailCard.css';

interface EmailCardProps {
  email: Email;
}

export const EmailCard: React.FC<EmailCardProps> = ({ email }) => {
  const firstImageAttachment = email.attachments?.find(
    attachment => attachment.mimeType.startsWith('image/')
  );

  return (
    <div className="card">
      <div className="card-image">
        {firstImageAttachment ? (
          <AttachmentComponent attachment={firstImageAttachment} />
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