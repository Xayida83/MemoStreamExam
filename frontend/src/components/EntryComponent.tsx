import React from 'react';
import { useEffect, useState } from 'react';
import { fetchEmails } from '../clients/emailClient';
import { Email } from '../types/Email';

const EmailList = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchEmails()
      .then(setEmails)
      .catch(setError);
  }, []);

  if (error) return <p>Ett fel inträffade: {error.message}</p>;

  return (
    <div>
      <h2>Mina Email</h2>
      <ul>
        {emails.map((email) => (
          <li key={email.id}>{email.subject}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmailList;
