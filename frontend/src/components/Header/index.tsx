import React from 'react';

export const Header = ({ name }: { name: string }) => (
  <header className="text-center my-4">
    <h1 className="text-3xl font-bold tracking-wide">{name}</h1>
    <input
      className="w-full mt-2 p-2 border rounded text-base"
      placeholder="Sök (kommer snart)"
      disabled
    />
  </header>
); 