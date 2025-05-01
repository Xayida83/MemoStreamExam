import React, { useState } from 'react';

interface ImageGalleryProps {
  url: string;
  alt: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ url, alt }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`image-container ${isExpanded ? 'expanded' : ''}`}>
      <img
        src={url}
        alt={alt}
        onClick={toggleExpand}
        className="gallery-image"
      />
      {isExpanded && (
        <div className="image-overlay" onClick={toggleExpand}>
          <img
            src={url}
            alt={alt}
            className="expanded-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}; 