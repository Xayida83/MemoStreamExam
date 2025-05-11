import React, { useRef, useState } from 'react';
import { Email } from '../types/Email';
import './EmailCarousel.css';

interface EmailCarouselProps {
  emails: Email[];
  onEmailSelect: (emailId: string) => void;
}

const EmailCarousel: React.FC<EmailCarouselProps> = ({ emails, onEmailSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Sortera emails efter datum, nyast först och ta de 4 senaste
  const carouselEmails = [...emails]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const target = e.target as HTMLElement;
    const carouselItem = target.closest('.carousel-item');
    
    // Om vi har dragit mindre än 5 pixlar, räkna det som ett klick
    if (Math.abs(e.pageX - startX) < 5 && carouselItem) {
      const emailId = carouselItem.getAttribute('data-email-id');
      if (emailId) {
        onEmailSelect(emailId);
      }
    }
    
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleClick = (emailId: string) => {
    if (!isDragging) {
      onEmailSelect(emailId);
    }
  };

  return (
    <div className="carousel-container">
      <div 
        ref={carouselRef}
        className="carousel"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {carouselEmails.map((email) => (
          <div 
            key={email.id} 
            className="carousel-item"
            data-email-id={email.id}
            onClick={() => handleClick(email.id)}
          >
            <div className="carousel-content">
              <h3>{email.subject}</h3>
              <p className="date">
                {new Date(email.date).toLocaleString('sv-SE')}
              </p>
              <p className="preview">
                {email.content.substring(0, 100)}...
              </p>
              {email.attachments.length > 0 && (
                <div className="attachment-count">
                  {email.attachments.length} bilaga{email.attachments.length !== 1 ? 'r' : ''}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailCarousel; 