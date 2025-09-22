import { ChevronLeft, ChevronRight } from "lucide-react";
import PaginationProps from "../../@types/List/PaginationProps";
import COLORS from "../../constants/Colors";
import { useMasterRowsInGrid } from "../../config/hooks/useMasterRowsInGrid";

function Pagination({
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
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

  // const sizeArray=[15,10,5];
  // const sizeArray = PAGINATION.DROPDOWN_OPTION_FOR_COMPANY_USER_PAGINATION;
  const {rowsInGridDropdownOptions}= useMasterRowsInGrid();
  const sizeArray=rowsInGridDropdownOptions
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <label htmlFor="pageSize" className="input-label-custom">Page Size</label>
      <select
        id="pageSize"
        value={pageSize}
        onChange={handlePageSizeChange}
        style={{
          padding: "1px 1px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          // fontSize: "0.80rem",
        }}
        className="input-label-custom"
      >
        {sizeArray.map((data) => (
          <option key={data.id} value={data.rowsInGrid}>
            {data.rowsInGrid}
          </option>
        ))}
      </select>
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        style={{
          padding: "1px 1px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: currentPage === 1 ? COLORS.WHITE_SMOKE : COLORS.WHITE,
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          // fontSize: "0.85rem",
        }}
        className="input-label-custom"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="input-label-custom">
        Page{" "}
        <input
          type="number"
          disabled
          value={currentPage}
          onChange={(e) => {
            onPageChange(Number(e.target.value));
          }}
          style={{
            width: "40px",
            textAlign: "center",
            padding: "1px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            // fontSize: "0.85rem",
          }}
          className="input-label-custom"
        />{" "}
        of {Number(totalPages)}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        style={{
          padding: "1px 1px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: currentPage === totalPages ? COLORS.WHITE_SMOKE : COLORS.WHITE,
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          // fontSize: "0.85rem",
        }}
        className="input-label-custom"
      >
        <ChevronRight size={20}/>
      </button>
    </div>
  );
  
}

export default Pagination;
