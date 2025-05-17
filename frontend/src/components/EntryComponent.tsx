import React from 'react';
import { Email } from '../types/Email';
import AttachmentComponent from './AttachmentComponent';

interface EntryComponentProps {
  email: Email;
}

const EntryComponent: React.FC<EntryComponentProps> = ({ email }) => {
  const getAttachmentUrl = (url: string) => {
    // Om URL:en redan är en fullständig URL, returnera den som den är
    if (url.startsWith('http')) {
      return url;
    }
    // Annars lägg till backend-URL:en
    const fullUrl = `http://localhost:5000${url}`;
    console.log('Attachment URL:', fullUrl); // Debugging
    return fullUrl;
  };

  return (
    <div className="email-entry" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="email-header">
        <div className="email-meta" style={{ textAlign: 'right', padding: '0px'	 }}>
          <p>Datum: {new Date(email.date).toLocaleString('sv-SE')}</p>
        </div>
        <h3>{email.subject}</h3> 
      </div>
      
      <div className="email-content" style={{ whiteSpace: 'pre-wrap' }}>
        <p>{email.content}</p>
      </div>

      {email.attachments.length > 0 && (
        <div className="email-attachments">
          <div className="attachments-list">
            {email.attachments.map((attachment) => (
              <AttachmentComponent 
                key={attachment.id} 
                attachment={attachment} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryComponent;
