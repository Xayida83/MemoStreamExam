import React, { useState } from 'react';
import { Attachment } from '../types/Email';
import { getAttachmentUrl, cleanFilename, isImage, isVideo, isAudio, getFileTypeLabel } from '../utils/commonUtils';
import './AttachmentComponent.css';

interface AttachmentComponentProps {
  attachment: Attachment;
}

const AttachmentComponent: React.FC<AttachmentComponentProps> = ({ attachment }) => {
  const [audioError, setAudioError] = useState<string | null>(null);

  const renderAttachment = () => {
    const url = getAttachmentUrl(attachment.url);
    const displayName = cleanFilename(attachment.filename);
    const fileTypeLabel = getFileTypeLabel(attachment.mimeType);

    if (isImage(attachment.mimeType)) {
      return (
        <div className="attachment-image">
          <img 
            src={url} 
            alt={`Bild: ${displayName}`}
            loading="lazy"
            aria-label={`Bild: ${displayName}`}
          />
          <div className="attachment-info">
            <p>{fileTypeLabel}: {displayName}</p>
          </div>
        </div>
      );
    }

    if (isVideo(attachment.mimeType)) {
      return (
        <div className="attachment-video">
          <video controls aria-label={`Video: ${displayName}`}>
            <source src={url} type={attachment.mimeType} />
            Din webbläsare stödjer inte video-taggen.
          </video>
          <div className="attachment-info">
            <p>{fileTypeLabel}: {displayName}</p>
          </div>
        </div>
      );
    }

    if (isAudio(attachment.mimeType)) {
      return (
        <div className="attachment-audio">
          <audio 
            controls 
            aria-label={`${fileTypeLabel}: ${displayName}`}
            onError={(e) => {
              const target = e.target as HTMLAudioElement;
              setAudioError(target.error?.message || 'Ett fel uppstod vid uppspelning av ljudfilen');
            }}
          >
            <source src={url} type={attachment.mimeType} />
            Din webbläsare stödjer inte audio-taggen.
          </audio>
          {audioError && (
            <div className="audio-error" role="alert">
              {audioError}
              <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Öppna ljudfil i nytt fönster">
                Öppna fil
              </a>
            </div>
          )}
          <div className="attachment-info">
            <p className="song-name">{fileTypeLabel}: {displayName}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="attachment-file">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label={`Öppna ${fileTypeLabel}: ${displayName}`}
        >
          {fileTypeLabel}: {displayName}
        </a>
      </div>
    );
  };

  return (
    <div className="attachment-container">
      {renderAttachment()}
    </div>
  );
};

export default AttachmentComponent; 