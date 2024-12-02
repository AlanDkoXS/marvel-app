import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

const Search = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { data, loading, error } = useFetch(searchTerm, 1, 10);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onSearch = async () => {
    setIsSearching(true);
    handleSearch(data);
    setIsSearching(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="search">
      <div>
        <input
          type="search"
          placeholder="Search Marvel Characters"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button onClick={onSearch}>Search</button>
      </div>

      {data.length > 0 && !isSearching && (
        <div className="suggestions">
          <ul>
            {data.map((character) => (
              <li key={character.id}>{character.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
