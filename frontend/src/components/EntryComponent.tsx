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
    <article className="email-entry" aria-labelledby={`email-subject-${email.id}`}>
      <header className="email-header">
        <div className="email-meta">
          <time dateTime={email.date}>
            Datum: {new Date(email.date).toLocaleDateString('sv-SE')}
          </time>
        </div>
        <h3 id={`email-subject-${email.id}`}>{email.subject}</h3> 
      </header>
      {email.attachments.length > 0 && (
        <section className="email-attachments" aria-label="Bilagor">
          <div className="attachments-list">
            {email.attachments.map((attachment) => (
              <AttachmentComponent 
                key={attachment.id} 
                attachment={attachment} 
              />
            ))}
          </div>
        </section>
      )}
      <div 
        className="email-content"
        tabIndex={0}
        role="article"
        aria-label={`Innehåll i e-post: ${email.subject}`}
      >
        <p>{email.content}</p>
      </div>
    </article>
  );
};

export default EntryComponent;
