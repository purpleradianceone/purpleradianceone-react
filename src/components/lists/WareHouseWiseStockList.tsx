import { Warehouse } from "lucide-react";
import WareHouseStockListProps from "../../@types/stock/WarehouseStockListProps";
import COLORS from "../../constants/Colors";
import { useUserPreference } from "../../context/user/UserPreference";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import StockLiveAgGrid from "../ag-grid/StockLiveAgGrid";
import SearchInput from "../ui/SearchInput";
import { ComponentHeaderAndLogo } from "../ui/ComponentHeaderAndLogo";

const WareHouseWiseStockList = ({
  warehouseStock,
  paginationData,
  searchParameter,
  handleSearchParameterChange,
  isDataLoading
}: WareHouseStockListProps) => {
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
          {/* <div className="flex gap-1">
            <Warehouse className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} />
            <span className="section-header-custom">Warehouse Wise Stock</span>
          </div> */}
          <ComponentHeaderAndLogo headerText="Warehouse-wise Stock" logo={Warehouse}/>

          <div className="flex justify-center items-center  gap-1">
            {/* search box flex div */}
            <div className="flex items-start w-80">
              <SearchInput
              autoFocus={true}
                id="company-user-module-search-box"
                onChange={(e) => {
                  handleSearchParameterChange(e.target.value);
                }}
                value={searchParameter}
                placeholder="Search by warehouse name"
              ></SearchInput>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white  overflow-y-auto rounded-lg shadow-sm ">
        <div
          className={
            userPreference.isLeftMenu
              ? `w-full h-[calc(100vh-241px)]`
              : "w-full h-[calc(100vh-192px)]"
          }
        >
          <StockLiveAgGrid data={warehouseStock} isDataLoading={isDataLoading} />
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

export default WareHouseWiseStockList;
