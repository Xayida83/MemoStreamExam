import React, { useEffect, useState } from 'react';
import { fetchCustomer } from '../clients/customerClient';
import SearchComponent from './SearchComponent';
import './Heading.css';

interface HeadingProps {
  onSearch: (query: string) => void;
}

const Heading: React.FC<HeadingProps> = ({ onSearch }) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCustomer()
      .then(customer => setCustomerName(customer.name))
      .catch(setError);
  }, []);

  if (error) {
    return <div className="heading-error">Kunde inte ladda kundinformation</div>;
  }

  return (
    <header className="heading">
      <h1>{customerName}</h1>
      <SearchComponent onSearch={onSearch} />
    </header>
  );
};

export default Heading; 