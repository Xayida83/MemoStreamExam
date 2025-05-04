import React from 'react';

export const Footer = () => (
  <footer className="mt-8 text-center">
    <div className="mb-2">Få notis när nytt läggs upp</div>
    <input
      type="email"
      placeholder="E-post"
      className="border rounded p-2 w-full mb-2"
    />
    <button className="border rounded px-4 py-2 bg-gray-100 hover:bg-gray-200">Kontakta Mats</button>
    {/* Här kan du lägga in Fillout-formulär eller annan kontaktlösning */}
  </footer>
); 