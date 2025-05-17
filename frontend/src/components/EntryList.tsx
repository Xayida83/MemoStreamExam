import React, { useEffect, useState } from 'react';
import { fetchEmails } from '../clients/emailClient';
import { Email } from '../types/Email';
import EntryComponent from './EntryComponent';
import { EmailCarousel } from './EmailCarousel';
import './EntryList.css';

interface EntryListProps {
  searchQuery?: string;
}

const EntryList: React.FC<EntryListProps> = ({ searchQuery = '' }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
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
        setFilteredEmails(sortedEmails);
        // Välj det senaste emailet som standard
        if (sortedEmails.length > 0) {
          setSelectedEmailId(sortedEmails[0].id);
        }
      })
      .catch(setError);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEmails(emails);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = emails.filter(email => 
      email.subject.toLowerCase().includes(query) ||
      email.content.toLowerCase().includes(query)
    );
    setFilteredEmails(filtered);
  }, [searchQuery, emails]);

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
        {filteredEmails.length === 0 ? (
          <div className="no-results">
            {searchQuery ? 'Inga resultat hittades' : 'Inga e-postmeddelanden tillgängliga'}
          </div>
        ) : (
          filteredEmails.map((email) => (
            <div 
              key={email.id} 
              id={`email-${email.id}`}
              className={`email-entry-container ${selectedEmailId === email.id ? 'selected' : ''}`}
            >
              <EntryComponent email={email} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EntryList; 