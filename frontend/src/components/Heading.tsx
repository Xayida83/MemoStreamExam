import React, { useEffect, useState } from 'react';
import { fetchCustomer } from '../clients/customerClient';
import SearchComponent from './SearchComponent';
import './Heading.css';

const Heading: React.FC = () => {
  const [customerName, setCustomerName] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCustomer()
      .then(customer => setCustomerName(customer.name))
      .catch(setError);
  }, []);

  const handleSearch = (query: string) => {
    // TODO: Implementera sökfunktionalitet
    console.log('Söker efter:', query);
  };

  if (error) {
    return <div className="heading-error">Kunde inte ladda kundinformation</div>;
  }

  return (
    <header className="heading">
      <h1>{customerName}</h1>
      <SearchComponent onSearch={handleSearch} />
    </header>
  );
};

export default Heading; 