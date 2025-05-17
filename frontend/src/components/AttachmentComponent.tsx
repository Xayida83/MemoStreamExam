import React, { useState } from 'react';
import { Attachment } from '../types/Email';
import './AttachmentComponent.css';

interface AttachmentComponentProps {
  attachment: Attachment;
}

const AttachmentComponent: React.FC<AttachmentComponentProps> = ({ attachment }) => {
  const [audioError, setAudioError] = useState(false);

  const getAttachmentUrl = (url: string) => {
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:5000${url}`;
  };

  const isImage = (mimeType: string) => {
    return mimeType.startsWith('image/');
  };

  const isVideo = (mimeType: string) => {
    return mimeType.startsWith('video/');
  };

  const isAudio = (mimeType: string) => {
    return mimeType.startsWith('audio/');
  };

  const getFileTypeLabel = (mimeType: string) => {
    if (isImage(mimeType)) return 'Bild';
    if (isVideo(mimeType)) return 'Video';
    if (isAudio(mimeType)) return 'Ljud';
    return 'Fil';
  };

  const renderAttachment = () => {
    const url = getAttachmentUrl(attachment.url);
    const fileType = getFileTypeLabel(attachment.mimeType);
    const displayName = attachment.filename.replace(/^\d+/, '').split(/[.(]/)[0];

    if (isImage(attachment.mimeType)) {
      return (
        <div className="attachment-image">
          <img 
            src={url} 
            alt={`${fileType}: ${displayName}`}
            loading="lazy"
          />
          <div className="attachment-info">
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Öppna ${fileType}: ${displayName}`}>
              {displayName}
            </a>
            {/*<span>({Math.round(attachment.size / 1024)} KB)</span>*/}
          </div>
        </div>
      );
    }

    if (isVideo(attachment.mimeType)) {
      return (
        <div className="attachment-video">
          <video 
            controls
            aria-label={`${fileType}: ${displayName}`}
          >
            <source src={url} type={attachment.mimeType} />
            Din webbläsare stödjer inte video-taggen.
          </video>
          <div className="attachment-info">
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Öppna ${fileType}: ${displayName}`}>
              {displayName}
            </a>
            <span>({Math.round(attachment.size / 1024)} KB)</span>
          </div>
        </div>
      );
    }

    if (isAudio(attachment.mimeType)) {
      return (
        <div className="attachment-audio">
          {!audioError ? (
            <audio 
              controls 
              onError={() => setAudioError(true)}
              aria-label={`${fileType}: ${displayName}`}
            >
              <source src={url} type={attachment.mimeType} />
              Din webbläsare stödjer inte audio-taggen.
            </audio>
          ) : (
            <div className="audio-error" role="alert">
              Ljudfilen kunde inte spelas upp. 
              <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Ladda ner ${fileType}: ${displayName}`}>
                Klicka här för att ladda ner
              </a>
            </div>
          )}
          <div className="attachment-info">
            <p className='song-name'> {fileType}:
              {displayName}
            </p>
          </div> 
        </div>
      );
    }

    // För andra filtyper, visa bara en länk
    return (
      <div className="attachment-file">
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Öppna ${fileType}: ${displayName}`}>
          {displayName}
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