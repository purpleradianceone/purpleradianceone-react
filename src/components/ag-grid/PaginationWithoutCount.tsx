import { ChevronLeft, ChevronRight } from "lucide-react";
import COLORS from "../../constants/Colors";
import { useMasterRowsInGrid } from "../../config/hooks/useMasterRowsInGrid";
import { useEffect, useState } from "react";

export type PageData = { currentPage: number; pageDataLength: number };

export type PaginationDataWithoutCountProps = {
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  currentPageData: PageData;
  onPageSizeChange: (size: number) => void;
  }

function PaginationWithoutCount({
  pageSize,
  currentPage,
  currentPageData,
  onPageChange,
  onPageSizeChange,
}: PaginationDataWithoutCountProps) {
  const { rowsInGridDropdownOptions } = useMasterRowsInGrid();

  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [pageSizeState,setPageSizeState] = useState<number>(pageSize);
  const [pageDataMap, setPageDataMap] = useState<Map<number, number>>(
    new Map(),
  );

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    onPageSizeChange(newSize);
    setPageSizeState(newSize);
    setPageDataMap(new Map());
    onPageChange(1); // reset to first page
  };

  const setCurrentPageDataLength = (
    currentPage: number,
    pageDataLength: number,
  ) => {
    setHasNextPage(pageDataLength >= pageSizeState);
    pageDataMap.set(currentPage, pageDataLength);
    if (currentPage == 1) {
      setPageDataMap(new Map());
    }
    let zeroCount = 0;
    for (const value of pageDataMap.values()) {
      if (value === 0) {
        zeroCount++;
        if (zeroCount === 2) {
          console.log("Resetting the current page to 1");
          onPageChange(1);
          setPageDataMap(new Map());
          zeroCount = 0;
          break;
        }
      }
    }
  };

  useEffect(() => {
    setCurrentPageDataLength(
      currentPageData.currentPage,
      currentPageData.pageDataLength,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageData]);

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

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!Number.isNaN(value) && value >= 1) {
      if(hasNextPage){
      onPageChange(value);
      }
      if(value<currentPage){
        onPageChange(value)
      }
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
            currentPage === 1 ? COLORS.WHITE_SMOKE : COLORS.WHITE,
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
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
          backgroundColor: !hasNextPage ? COLORS.WHITE_SMOKE : COLORS.WHITE,
          cursor: !hasNextPage ? "not-allowed" : "pointer",
        }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default PaginationWithoutCount;
