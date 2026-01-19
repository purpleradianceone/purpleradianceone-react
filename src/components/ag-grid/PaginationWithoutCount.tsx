import { ChevronLeft, ChevronRight } from "lucide-react";
import COLORS from "../../constants/Colors";
import { useMasterRowsInGrid } from "../../config/hooks/useMasterRowsInGrid";

export type PaginationWithoutCountProps = {
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

function PaginationWithoutCount({
  currentPage,
  pageSize,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
}: PaginationWithoutCountProps) {
  const { rowsInGridDropdownOptions } = useMasterRowsInGrid();

  const handlePageSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = Number(e.target.value);
    onPageSizeChange(newSize);
    onPageChange(1); // reset to first page
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);
    if (!Number.isNaN(value) && value >= 1) {
      onPageChange(value);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {/* Page Size */}
      <label htmlFor="pageSize" className="input-label-custom">
        Page Size
      </label>

      <select
        id="pageSize"
        value={pageSize}
        onChange={handlePageSizeChange}
        className="input-label-custom"
        style={{
          padding: "1px 4px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        {rowsInGridDropdownOptions.map((data) => (
          <option key={data.id} value={data.rowsInGrid}>
            {data.rowsInGrid}
          </option>
        ))}
      </select>

      {/* Previous */}
      <button
        type="button"
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="input-label-custom"
        style={{
          padding: "1px 4px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor:
            currentPage === 1
              ? COLORS.WHITE_SMOKE
              : COLORS.WHITE,
          cursor:
            currentPage === 1 ? "not-allowed" : "pointer",
        }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page Input */}
      <span className="input-label-custom">
        Page{" "}
        <input
          type="number"
          min={1}
          value={currentPage}
          onChange={handlePageInputChange}
          style={{
            width: "50px",
            textAlign: "center",
            padding: "1px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </span>

      {/* Next */}
      <button
        type="button"
        onClick={handleNextPage}
        disabled={!hasNextPage}
        className="input-label-custom"
        style={{
          padding: "1px 4px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor:
            !hasNextPage
              ? COLORS.WHITE_SMOKE
              : COLORS.WHITE,
          cursor:
            !hasNextPage ? "not-allowed" : "pointer",
        }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default PaginationWithoutCount;
