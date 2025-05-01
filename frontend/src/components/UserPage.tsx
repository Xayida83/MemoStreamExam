import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Email } from '../models/Email.js';
import { AudioPlayer } from './AudioPlayer.js';
import { ImageGallery } from './ImageGallery.js';

export const UserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/emails/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch emails');
        }
        const data = await response.json();
        setEmails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userId) return <div>No user ID provided</div>;

  return (
    <div className="user-page">
      <h1>User Content</h1>
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