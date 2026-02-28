import { Warehouse } from "lucide-react";
import StockAgeingListProps from "../../@types/stock/StockAgeingListProps";
import COLORS from "../../constants/Colors";
import { useUserPreference } from "../../context/user/UserPreference";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import StockAgeingAgGrid from "../ag-grid/StockAgeingAgGrid";

const StockAgeingList = ({
  stockAgeing,
  paginationData,
}: StockAgeingListProps) => {
  const { userPreference } = useUserPreference();

  return (
    <div
      className={`w-full  pt-1  ${
        userPreference.isLeftMenu ? "pl-1" : "pl-1"
      } pr-1 gap-1`}
    >
      <div
        className={`sticky z-10 top-9 py-0.5 flex items-center justify-between ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm  mb-1.5 w-full`}
      >
        <div className="flex items-center pl-1 gap-5">
          <div className="flex gap-1">
            <Warehouse className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} />
            <span className="section-header-custom">Warehouse Wise Stock</span>
          </div>
        </div>
      </div>
      <div className="bg-white  overflow-y-auto rounded-lg shadow-sm ">
        <div
          className={
            userPreference.isLeftMenu
              ? `ag-theme-balham w-full h-[calc(100vh-190px)]`
              : "ag-theme-balham w-full h-[calc(100vh-192px)]"
          }
        >
          <StockAgeingAgGrid data={stockAgeing} />
        </div>
        <div className="flex items-center justify-end ">
          <PaginationWithoutCount
            pageSize={paginationData.pageSize}
            currentPage={paginationData.currentPage}
            currentPageData={paginationData.currentPageData}
            onPageChange={paginationData.onPageChange}
            onPageSizeChange={paginationData.onPageSizeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default StockAgeingList;
