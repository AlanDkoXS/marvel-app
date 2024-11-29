import React from 'react';

function CardsPerPage({ cardsPerPage, handleCardsPerPageChange }) {
  return (
    <div>
      <label htmlFor="cardsPerPage">Tarjetas por página:</label>
      <select
        id="cardsPerPage"
        value={cardsPerPage} // El valor se obtiene desde la referencia de cardsPerPage
        onChange={handleCardsPerPageChange} // Llamar a la función para manejar el cambio
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
}

export default CardsPerPage;
