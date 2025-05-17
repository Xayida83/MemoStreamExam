import React from 'react';
import { Attachment } from '../types/Email';
import './AttachmentComponent.css';

interface AttachmentComponentProps {
  attachment: Attachment;
}

const AttachmentComponent: React.FC<AttachmentComponentProps> = ({ attachment }) => {
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

  const renderAttachment = () => {
    const url = getAttachmentUrl(attachment.url);

    if (isImage(attachment.mimeType)) {
      return (
        <div className="attachment-image">
          <img 
            src={url} 
            alt={attachment.filename}
            style={{ maxWidth: '100%', maxHeight: '300px' }}
          />
          {/*<div className="attachment-info">
            <a href={url} target="_blank" rel="noopener noreferrer">
              {attachment.filename}
            </a>
            <span>({Math.round(attachment.size / 1024)} KB)</span>
          </div> */}
        </div>
      );
    }

    if (isVideo(attachment.mimeType)) {
      return (
        <div className="attachment-video">
          <video 
            controls 
            style={{ maxWidth: '100%', maxHeight: '300px' }}
          >
            <source src={url} type={attachment.mimeType} />
            Din webbläsare stödjer inte video-taggen.
          </video>
          {/* <div className="attachment-info">
            <a href={url} target="_blank" rel="noopener noreferrer">
              {attachment.filename}
            </a>
            <span>({Math.round(attachment.size / 1024)} KB)</span>
          </div> */}
        </div>
      );
    }

    if (isAudio(attachment.mimeType)) {
      return (
        <div className="attachment-audio">
          <audio controls>
            <source src={url} type={attachment.mimeType} />
            Din webbläsare stödjer inte audio-taggen.
          </audio>
          {/* <div className="attachment-info">
            <a href={url} target="_blank" rel="noopener noreferrer">
              {attachment.filename}
            </a>
            <span>({Math.round(attachment.size / 1024)} KB)</span>
          </div> */}
        </div>
      );
    }

    // För andra filtyper, visa bara en länk
    return (
      <div className="attachment-file">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {attachment.filename}
        </a>
        {/*<span className="attachment-info">
          ({Math.round(attachment.size / 1024)} KB)
        </span> */}
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