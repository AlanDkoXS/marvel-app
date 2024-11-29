import React from 'react';

function CardsPerPage({ cardsPerPage, handleCardsPerPageChange }) {
  return (
    <div>
      <label htmlFor="cardsPerPage">Cards per page:</label>
      <select
        id="cardsPerPage"
        value={cardsPerPage}
        onChange={handleCardsPerPageChange}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
}

export default CardsPerPage;
