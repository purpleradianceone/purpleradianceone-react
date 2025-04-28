import { ChevronLeft, ChevronRight } from "lucide-react";
import PaginationProps from "../../@types/List/PaginationProps";
import COLORS from "../../constants/Colors";
import PAGINATION from "../../constants/Pagination";

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
  const sizeArray = PAGINATION.DROPDOWN_OPTION_FOR_COMPANY_USER_PAGINATION;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <label htmlFor="pageSize" className="text-sm">Page Size</label>
      <select
        id="pageSize"
        value={pageSize}
        onChange={handlePageSizeChange}
        style={{
          padding: "3px 6px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "0.85rem",
        }}
      >
        {sizeArray.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        style={{
          padding: "2px 2px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: currentPage === 1 ? COLORS.WHITE_SMOKE : COLORS.WHITE,
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          fontSize: "0.85rem",
        }}
      >
        <ChevronLeft />
      </button>
      <span style={{ fontSize: "0.85rem" }}>
        Page{" "}
        <input
          type="number"
          value={currentPage}
          onChange={(e) => {
            onPageChange(Number(e.target.value));
          }}
          style={{
            width: "40px",
            textAlign: "center",
            padding: "3px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "0.85rem",
          }}
        />{" "}
        of {Number(totalPages)}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        style={{
          padding: "2px 2px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: currentPage === totalPages ? COLORS.WHITE_SMOKE : COLORS.WHITE,
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          fontSize: "0.85rem",
        }}
      >
        <ChevronRight />
      </button>
    </div>
  );
  
  // return (
  //   <div  style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  //     <label htmlFor="pageSize" className="text-sm">Page Size</label>
  //     <select
  //       id="pageSize"
  //       value={pageSize}
  //       onChange={handlePageSizeChange}
  //       style={{
  //         padding: "5px",
  //         border: "1px solid #ccc",
  //         borderRadius: "5px",
  //       }}
  //     >
  //       {sizeArray.map((size) => (
  //         <option key={size} value={size}>
  //           {size}
  //         </option>
  //       ))}
  //     </select>
  //     <button
  //       onClick={handlePreviousPage}
  //       disabled={currentPage === 1}
  //       style={{
  //         padding: "5px 10px",
  //         border: "1px solid #ccc",
  //         borderRadius: "5px",
  //         backgroundColor: currentPage === 1? COLORS.WHITE_SMOKE : COLORS.WHITE,
  //         cursor: currentPage === 1 ? "not-allowed" : "pointer",
  //       }}
  //     >
  //       <ChevronLeft/>
  //     </button>
  //     <span>
  //       Page{" "}
  //       <input
  //         type="number"
  //         value={currentPage}
  //         onChange={(e) => {
  //           onPageChange(Number(e.target.value));
  //         }}
  //         style={{
  //           width: "50px",
  //           textAlign: "center",
  //           padding: "5px",
  //           border: "1px solid #ccc",
  //           borderRadius: "5px",
  //         }}
  //       />{" "}
  //       of {Number(totalPages)}
  //     </span>
  //     <button
  //       onClick={handleNextPage}
  //       disabled={currentPage === totalPages}
  //       style={{
  //         // background:"none",
  //         padding: "5px 10px",
  //         border: "1px solid #ccc",
  //         borderRadius: "5px",
  //         backgroundColor: currentPage === totalPages ? COLORS.WHITE_SMOKE: COLORS.WHITE,
  //         cursor: currentPage === totalPages ? "not-allowed" : "pointer",
  //       }}
  //     >
  //       <ChevronRight/>
  //     </button>
  //   </div>
  // );
}

export default Pagination;
