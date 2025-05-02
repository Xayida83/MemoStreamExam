import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Email } from '../types/Email';
import { AudioPlayer } from './AudioPlayer';
import { ImageGallery } from './ImageGallery';

export const UserPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      if (!customerId) {
        setError('No customer ID provided');
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/emails/${customerId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch emails');
        }
        const data = await response.json();
        setEmails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching emails');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [customerId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!customerId) return <div className="error">No customer ID provided</div>;

  return (
    <div className="user-page">
      <h1>Customer Content</h1>
      <div className="emails-container">
        {emails.map((email) => (
          <div key={email.id} className="email-card">
            <h2>{email.subject}</h2>
            <p className="email-meta">
              From: {email.from} | Date: {new Date(email.date).toLocaleDateString()}
            </p>
            <div className="email-content">
              <p>{email.content}</p>
            </div>
            
            {/* Display attachments */}
            {email.attachments && email.attachments.length > 0 && (
              <div className="attachments">
                <h3>Attachments</h3>
                <div className="attachments-grid">
                  {email.attachments.map((attachment) => {
                    if (attachment.mimeType.startsWith('audio/')) {
                      return (
                        <AudioPlayer
                          key={attachment.id}
                          url={attachment.url}
                          title={attachment.filename}
                        />
                      );
                    } else if (attachment.mimeType.startsWith('image/')) {
                      return (
                        <ImageGallery
                          key={attachment.id}
                          url={attachment.url}
                          alt={attachment.filename}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 