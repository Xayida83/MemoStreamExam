import React, { useEffect } from 'react';

const ContactFormComponent: React.FC = () => {
  useEffect(() => {
    // Ladda Fillout script när komponenten mountas
    const script = document.createElement('script');
    script.src = 'https://server.fillout.com/embed/v1/';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup när komponenten unmountas
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div 
      data-fillout-id="stSsCwtWDJus"
      data-fillout-embed-type="popup"
      data-fillout-button-text="Kontakta Matts"
      data-fillout-dynamic-resize
      data-fillout-button-color="#668FCF"
      data-fillout-button-float="bottom-right"
      data-fillout-inherit-parameters
      data-fillout-popup-size="medium"
    />
  );
};

export default ContactFormComponent; 

