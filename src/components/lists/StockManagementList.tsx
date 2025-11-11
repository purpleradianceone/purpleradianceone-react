import { Calendar, Layers, Plus } from "lucide-react";
import COLORS from "../../constants/Colors";
import { useUserPreference } from "../../context/user/UserPreference";
import Button from "../ui/Button";
import MESSAGE from "../../constants/Messages";
import toast from "react-hot-toast";
import { SIZE } from "../../constants/AppConstants";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useState } from "react";
import AddStock from "../modals/stock/AddStock";
import StockManagementListProps from "../../@types/stock/StockManagementListProps";
import StockLiveForCompanyProductAgGrid from "../ag-grid/StockLiveForCompanyProductAgGrid";
import Pagination from "../ag-grid/Pagination";
import LiveStockForCompanyProduct from "../../@types/stock/LiveStockForCompanyProduct";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import SearchInput from "../ui/SearchInput";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";

const StockManagementList = ({
  liveStockForCompanyProduct,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  
}: StockManagementListProps) => {
  const navigate = useNavigate();
  const { userPreference } = useUserPreference();
  const { userHasAccessToAddStock } = useUserAccessModules();
  const [isAddStockModalOpen, setIsAddStockModalOpen] =
    useState<boolean>(false);
  
  function handleSelectedStockLiveForCompanyProduct(data : LiveStockForCompanyProduct){
    navigate(`${ROUTES_URL.STOCK_LIVE_FOR_COMPANY_PRODUCT}${data.companyProductId}/${data.companyProductName}/${data.quantityLive}/${data.quantityInward}/${data.quantityOutward}`);
  }  
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
   const { handleDateRangeIdChange, isCustomDateOptionSelected } =
      useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });
  
  return (
    <div
      className={`w-full  pt-1  ${
        userPreference.isLeftMenu ? "pl-5" : "pl-1"
      } pr-1 gap-1`}
    >
      <div
        className={`sticky z-10 top-9 py-0.5 flex items-center justify-between ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm  mb-1.5 w-full`}
      >
        <div className="flex items-center pl-1  gap-2">
          <Layers className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} />
          <span className="section-header-custom">Stock Management</span>
        </div>

        <div className="flex gap-1">
          {/* search box flex div */}

          <div className="relative flex items-start w-80">
            <SearchInput
              id="company-user-module-search-box"
              onChange={(e) => {
                handleSearchOption.handleSearchParameterChange(e.target.value);
              }}
            ></SearchInput>
          </div>

          {/* Date FIlters Dropdown */}
                <div className={`flex flex-wrap gap-0.5 ${isCustomDateOptionSelected ? 'max-h-12' : 'max-h-8'}`}>
                <div className="flex">
                  <div className="flex ">
                    <div className="flex input-label-custom items-center size-4 justify-center mt-2 mr-2 gap-2">
                      <Calendar className="input-label-custom" />
                    </div>
                    <DateRangeFilterDropdown
                      dropdownOptions={dateRangeDropdownOptions}
                      handleDateIdChange={handleDateRangeIdChange}
                    ></DateRangeFilterDropdown>
                  </div>
                </div>
                {/* Custom Date Picker Div Flex Box*/}
                <div
                  style={
                    isCustomDateOptionSelected
                      ? { visibility: "visible" }
                      : { visibility: "hidden" }
                  }
                >
                  <DateRangePicker
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                  />
                </div>
                </div>
        </div>

        <div id="company-users-module-add-button" className="flex gap-1">
          <Button
            type="submit"
            disabled={!userHasAccessToAddStock}
            onClick={(e) => {
              e.preventDefault();
              if (!userHasAccessToAddStock) {
                toast.error(
                  MESSAGE.MODULE_ACCESS.COMPANY_USER
                    .DENIED_ADD_ACCESS_COMPANY_USER
                );
                return;
              } else {
                setIsAddStockModalOpen(true);
              }
            }}
          >
            <div className="flex items-center gap-1">
              <Plus size={SIZE.SIXTEEN} />
              Add
            </div>
          </Button>
        </div>
      </div>
      <div className="bg-white  overflow-y-auto rounded-lg shadow-sm ">
        <div
          className={
            userPreference.isLeftMenu
              ? `ag-theme-balham w-full h-[calc(100vh-120px)]`
              : "ag-theme-balham w-full h-[calc(100vh-128px)]"
          }
        >
          <StockLiveForCompanyProductAgGrid 
          data={liveStockForCompanyProduct}
          onRowSelect={handleSelectedStockLiveForCompanyProduct}
          />
        </div>
        <div className="flex items-center justify-end ">
          <Pagination
            totalPages={paginationData.totalPages}
            currentPage={paginationData.currentPage}
            pageSize={paginationData.pageSize}
            onPageChange={paginationData.handlePageChange}
            onPageSizeChange={paginationData.selectedPageSize}
          />
        </div>
      </div>
      {isAddStockModalOpen && (
        <AddStock
          isOpen={isAddStockModalOpen}
          onClose={() => {
            setIsAddStockModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default StockManagementList;
