import React from 'react';
import { Email } from '../types/Email';
import AttachmentComponent from './AttachmentComponent';
import { getAttachmentUrl } from '../utils/commonUtils';

interface EntryComponentProps {
  email: Email;
}

const EntryComponent: React.FC<EntryComponentProps> = ({ email }) => {
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
                attachment={{ ...attachment, url: getAttachmentUrl(attachment.url) }} 
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
