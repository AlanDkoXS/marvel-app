const Pagination = ({ page, totalPages, handlePageChange }) => {
    // Función para ir a la siguiente página
    const goToNextPage = () => {
      if (page < totalPages) {
        handlePageChange(page + 1);
      }
    };

    // Función para ir a la página anterior
    const goToPreviousPage = () => {
      if (page > 1) {
        handlePageChange(page - 1);
      }
    };

    // Asegurarnos de que page no sea menor a 1 y que totalPages no sea 0 o negativo
    const currentPage = Math.max(1, page); // Asegura que la página actual no sea menor a 1
    const totalPageCount = totalPages > 0 ? totalPages : 1; // Evita que totalPages sea 0 o negativo

    return (
      <div>
        {/* Botón de página anterior */}
        <button onClick={goToPreviousPage} disabled={currentPage <= 1}>
          Anterior
        </button>

        {/* Indicador de la página actual y total de páginas */}
        <span>
          Página {currentPage} de {totalPageCount}
        </span>

        {/* Botón de página siguiente */}
        <button onClick={goToNextPage} disabled={currentPage >= totalPageCount}>
          Siguiente
        </button>
      </div>
    );
  };

  export default Pagination;
