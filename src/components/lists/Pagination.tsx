import PaginationProps from "../../@types/List/PaginationProps";

const Pagination: React.FC<PaginationProps> = ({
    totalPages,
    currentPage,
    pageSize,
    onPageChange,
    onPageSizeChange,
  }) => {
    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSize = Number(e.target.value);
      onPageSizeChange(newSize);
    };
  
    const handlePreviousPage = () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    };
  
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    };
  
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label htmlFor="pageSize">Page Size</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
          style={{
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          {[20,50,100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{
            padding: "5px 10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: currentPage === 1 ? "#f5f5f5" : "white",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          {"<"}
        </button>
        <span>
          Page{" "}
          <input
            type="number"
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
            style={{
              width: "50px",
              textAlign: "center",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />{" "}
          of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            // background:"none",
            padding: "5px 10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: currentPage === totalPages ? "#f5f5f5" : "white",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          {">"}
        </button>
      </div>
    );
  };

  export default Pagination;