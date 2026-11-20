// eslint-disable-next-line react-refresh/only-export-components
export const PER_PAGE_OPTIONS = [10, 25, 50];

function CardsPerPage({ cardsPerPage, handleCardsPerPageChange }) {
  return (
    <div>
      <label htmlFor="cardsPerPage">Cards per page:</label>
      <select
        id="cardsPerPage"
        value={cardsPerPage}
        onChange={handleCardsPerPageChange}
      >
        {PER_PAGE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CardsPerPage;
