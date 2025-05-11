import React, { useState } from 'react';
import './SearchComponent.css';

interface SearchComponentProps {
  onSearch: (query: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <input
        type="text"
        className="search-input"
        placeholder="Sök..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" className="search-button">
        Sök
      </button>
    </form>
  );
};

export default SearchComponent; 