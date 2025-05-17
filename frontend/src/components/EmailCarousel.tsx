import React, { useRef, useState } from 'react';
import { Email } from '../types/Email';
import { EmailCard } from './EmailCard';
import './EmailCarousel.css';

interface EmailCarouselProps {
  emails: Email[];
  onEmailSelect: (emailId: string) => void;
}

export const EmailCarousel: React.FC<EmailCarouselProps> = ({ emails, onEmailSelect }) => {
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="carousel-container">
      <div 
        ref={carouselRef}
        className="carousel"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        {carouselEmails.map((email) => (
          <div 
            key={email.id}
            className="carousel-item"
            onClick={() => onEmailSelect(email.id)}
          >
            <EmailCard email={email} />
          </div>
        ))}
      </div>
    </div>
  );
}; 