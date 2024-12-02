import React, { useState } from 'react';


const Search = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSearch(searchTerm.trim()); // Enviar el término de búsqueda al componente padre
    }
  };

  return (
    <div className="search">
      <form onSubmit={onSearch}>
        <input
          type="search"
          placeholder="Search Marvel Characters"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default Search;
