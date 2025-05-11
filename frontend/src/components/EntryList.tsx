import React, { useEffect, useState } from 'react';
import { fetchEmails } from '../clients/emailClient';
import { Email } from '../types/Email';
import EntryComponent from './EntryComponent';
import EmailCarousel from './EmailCarousel';

const EntryList: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails()
      .then((fetchedEmails) => {
        // Sort emails by date, newest first
        const sortedEmails = [...fetchedEmails].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEmails(sortedEmails);
        // Välj det senaste emailet som standard
        if (sortedEmails.length > 0) {
          setSelectedEmailId(sortedEmails[0].id);
        }
      })
      .catch(setError);
  }, []);

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmailId(emailId);
    // Scrolla till det valda emailet
    const element = document.getElementById(`email-${emailId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (error) return <p>Ett fel inträffade: {error.message}</p>;

  return (
    <div className="entry-list">
      <EmailCarousel 
        emails={emails} 
        onEmailSelect={handleEmailSelect} 
      />
      
      <div className="all-emails">
        {emails.map((email) => (
          <div 
            key={email.id} 
            id={`email-${email.id}`}
            className={`email-entry-container ${selectedEmailId === email.id ? 'selected' : ''}`}
          >
            <EntryComponent email={email} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntryList; 