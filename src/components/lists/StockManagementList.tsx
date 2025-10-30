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

const StockManagementList = () => {
  const { userPreference } = useUserPreference();
  const {userHasAccessToAddStock} = useUserAccessModules();
  const [isAddStockModalOpen, setIsAddStockModalOpen] =
      useState<boolean>(false);
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
            {/* <SearchInput
              id="company-user-module-search-box"
              onChange={(e) => {
                handleSearchOption.handleSearchParameterChange(e.target.value);
              }}
            ></SearchInput> */}
          </div>

          {/* Date FIlters Dropdown */}
          <div
            id="company-users-module-date-range-filter"
            className="flex mx-3"
          >
            <div className="flex">
              <div className="flex items-center size-4 justify-center mt-1 mr-2 gap-2 input-label-custom">
                <Calendar className="input-label-custom mt-1" />
              </div>

              {/* <DateRangeFilterDropdown
                dropdownOptions={dateRangeDropdownOptions}
                handleDateIdChange={handleDateRangeIdChange}
              ></DateRangeFilterDropdown> */}
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
            //   onClick={() => setIsAddCompanyUserModalOpen(true)}
            >
              {/* {!isSmallScreen && <UserPlus size={SIZE.TWENTY} />}
                {isSmallScreen && <UserPlus size={SIZE.EIGHT} />}
                {isLargeScreen && JSX_CHILDREN_NAME.ADD_USER} */}
              <div className="flex items-center gap-1">
                <Plus size={SIZE.SIXTEEN} />
                Add
              </div>
            </Button>
          </div>

          {
            isAddStockModalOpen && (
                <AddStock 
                    isOpen={isAddStockModalOpen}
                    onClose={() =>{
                        setIsAddStockModalOpen(false);
                    }}
                />
            )
          }
      </div>
    </div>
  );
};

export default StockManagementList;
