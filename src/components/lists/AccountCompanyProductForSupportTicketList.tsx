/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, UserRoundCogIcon } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import { usePanel } from "../../context/panel/usePanel";
import SearchInput from "../ui/SearchInput";
import HandleSearchOptionProps from "../../@types/company-users/HandleSearchOptionProps";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import DateRangePicker from "../ui/DateRangePicker";

import COLORS from "../../constants/Colors";
import AccountCompanyProductForSupportTicket from "../../@types/support-ticket-management/AccountCompanyProductForSupportTicket";
import AccountCompanyProductForSupportTicketAgGrid from "../ag-grid/AccountCompanyProductForSupportTicketAgGrid";
import { useEffect } from "react";
import PaginationWithoutCount, {
  PaginationWithoutCountProps,
} from "../ag-grid/PaginationWithoutCount";

function AccountCompanyProductForSupportTicketList({
  accountCompanyProductsForSupportTicket,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  paginationData,
  handleRowSelect,
}: {
  accountCompanyProductsForSupportTicket: AccountCompanyProductForSupportTicket[];
  handleSearchOption: HandleSearchOptionProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  // paginationData: PaginationDataProps;
  paginationData: PaginationWithoutCountProps;
  handleRowSelect?: (data: AccountCompanyProductForSupportTicket | any) => void;
}) {
  const { position } = usePanel();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  // Note : To open the details component of that account
  const handleRowSelectedForSupportTicket = (data: any) => {
    handleRowSelect!(data);
  };

  const selectedDateName =
    dateRangeDropdownOptions.find(
      (o) => o.search_date_range_id === handleSearchOption.dateRangeId,
    )?.date_range || "Date Filter";

  useEffect(() => {
    if (handleSearchOption.dateRangeId === 8) {
      setIsCustomDateOptionSelected(true);
    }
  }, [
    handleSearchOption.searchParameter,
    handleSearchOption.dateRangeId,
    setIsCustomDateOptionSelected,
  ]);

  return (
    <div
      className={`w-full ${position === "left" ? "pl-1" : "pl-1"} pr-1 gap-1`}
    >
      <div
        className={`sticky z-10 top-12 mt-1 p-0.5  flex items-center text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm  mb-1.5 w-full`}
      >
        <div className="flex items-center justify-center gap-2">
          {!isSmallScreen && (
            <UserRoundCogIcon
              className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE}
            />
          )}

          {(isMediumScreen || isLargeScreen) && (
            <span className="section-header-custom">
              {" Account Product Selection"}{" "}
            </span>
          )}
        </div>

        {/* {isLargeScreen && ( */}
        <>
          <div className="pl-4 flex gap-2 justify-start items-start">
            {/* search box flex div */}
            <div className="flex gap-1">
              {/* search box flex div */}
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value,
                    );
                  }}
                  placeholder={"Search by Account's Email, mobilenumber"}
                  value={handleSearchOption.searchParameter}
                ></SearchInput>
              </div>

              {/* Date FIlters Dropdown */}
              <div className="flex mx-3 gap-1">
                <div className="flex">
                  <div className="flex items-center size-4 justify-center mt-1 mr-2 gap-2 input-label-custom">
                    <Calendar className="input-label-custom mt-1" />
                  </div>

                  <DateRangeFilterDropdown
                    dropdownOptions={dateRangeDropdownOptions}
                    handleDateIdChange={handleDateRangeIdChange}
                    selectedOption={selectedDateName}
                  ></DateRangeFilterDropdown>
                </div>
                {/* Custom Date Picker Div Flex Box*/}
                {isCustomDateOptionSelected && (
                  <div
                    className="flex"
                    style={
                      isCustomDateOptionSelected
                        ? { visibility: "visible" }
                        : { visibility: "hidden" }
                    }
                  >
                    <DateRangePicker
                      onStartDateChange={onStartDateChange}
                      onEndDateChange={onEndDateChange}
                      initialStartDate={handleSearchOption.startDate}
                      initialEndDate={handleSearchOption.endDate}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      </div>

      <div className="bg-white overflow-y-auto rounded-lg shadow-sm ">
        <div className="w-full h-[42vh]">
          <AccountCompanyProductForSupportTicketAgGrid
            accountCompanyProductsForSupportTickt={
              accountCompanyProductsForSupportTicket
            }
            onRowSelect={handleRowSelectedForSupportTicket}
          />
        </div>
      </div>

      <div className="flex items-center justify-end ">
        <PaginationWithoutCount
          currentPage={paginationData.currentPage}
          pageSize={paginationData.pageSize}
          hasNextPage={paginationData.hasNextPage}
          onPageChange={paginationData.onPageChange}
          onPageSizeChange={paginationData.onPageSizeChange}
        />
      </div>
    </div>
  );
}

export default AccountCompanyProductForSupportTicketList;
