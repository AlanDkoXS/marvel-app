// eslint-disable-next-line react-refresh/only-export-components
export const PER_PAGE_OPTIONS = [12, 24, 48];

function CardsPerPage({ cardsPerPage, handleCardsPerPageChange }) {
  return (
    <div className="wiki__toolbar">
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
