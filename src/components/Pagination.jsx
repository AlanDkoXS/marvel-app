const Pagination = ({ page, totalPages, handlePageChange }) => {
  const goToNextPage = () => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const currentPage = Math.max(1, page);
  const totalPageCount = totalPages > 0 ? totalPages : 1;

  return (
    <div>
      <button onClick={goToPreviousPage} disabled={currentPage <= 1}>
        Previous
      </button>

      <span>
        Page {currentPage} of {totalPageCount}
      </span>

      <button onClick={goToNextPage} disabled={currentPage >= totalPageCount}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
