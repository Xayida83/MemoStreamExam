import React from 'react';
import './ExternalLink.css';

interface ExternalLinkProps {
  href: string;
  label: string;
  className?: string;
  children?: React.ReactNode;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({ 
  href, 
  label, 
  className = '', 
  children 
}) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      aria-label={label}
      className={`external-link ${className}`}
    >
      {children || label}
    </a>
  );
}; 