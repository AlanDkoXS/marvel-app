import React from 'react';

function Search({
  searchTerm,
  handleSearch,
  suggestions,
  errors,
  handleSearchChange,
  handleSuggestionClick,
  handleCardsPerPageChange,
  cardsPerPage,
}) {
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Busca un personaje..."
        />
        <button type="submit">Buscar</button>
      </form>

      {errors?.searchTerm && <p>{errors.searchTerm}</p>}

      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search;
