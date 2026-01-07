import { Calendar, Filter, X } from "lucide-react";
import { useState } from "react";
import { useComapanySpecificSearchDateRange } from "../../../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../../../config/hooks/useDateRangeIdChange";
import useScreenSize from "../../../../config/hooks/useScreenSize";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import SearchInput from "../../../ui/SearchInput";
import DateRangeFilterDropdown from "../../../ui/DateRangeFilterDropdown";
import DateRangePicker from "../../../ui/DateRangePicker";
import Button from "../../../ui/Button";

import Pagination from "../../../ag-grid/Pagination";
import { SIZE } from "../../../../constants/AppConstants";
import CompanyUserAgGridForLead from "./CompanyUserAgGridForLead";
import CompanyUsersSearchProps from "../../../../@types/company-users/CompanyUserProps";
import PaginationDataProps from "../../../../@types/ag-grid/PaginationDataProps";
import HandleSearchOptionProps from "../../../../@types/company-users/HandleSearchOptionProps";
import CompanyUser from "../../../../@types/company-users/CompanyUser";

type GetCompanyUsersListForLeadProps = {
  users: CompanyUsersSearchProps[];
  paginationData: PaginationDataProps;
  handleSearchOption: HandleSearchOptionProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  handleCompanyUserChangeOnEdit: (companyUser: CompanyUser) => void;
  handleSelectedCompanyUserChange: (params: CompanyUser | null) => void;
  isUsedForSettings: boolean;
  //added
  selectedUserId: number | null;
  handleUpdateLeadUser?: (params: CompanyUser | null) => boolean;
};

function GetCompanyUserListForLeadAssignment({
  users,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  selectedUserId,
  handleSelectedCompanyUserChange,
  isUsedForSettings,
  handleUpdateLeadUser,
}: GetCompanyUsersListForLeadProps) {
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const [isFiltersOpenInMobileView, setIsFiltersOpenInMobileView] =
    useState<boolean>(false);
  const [isFilterOpenInTabletView, setIsFilterOpenInTabletView] =
    useState(false);

  const { handleDateRangeIdChange, isCustomDateOptionSelected } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();

  const { userHasAccessToViewUser } = useUserAccessModules();

  return (
    userHasAccessToViewUser || !isUsedForSettings && (
      <div className="w-full">
        <div className=" z-10  mt-1  mb-2 flex items-center justify-between p-0.5  bg-gray-50 rounded-lg shadow-sm   w-full">
          {isLargeScreen && (
            <>
              <div className="flex  justify-between items-center gap-1">
                {/* search box flex div */}
                <div className="relative flex items-start w-80 ">
                  <SearchInput
                    onChange={(e) => {
                      handleSearchOption.handleSearchParameterChange(
                        e.target.value
                      );
                    }}
                  ></SearchInput>
                </div>

                {/* Date FIlters Dropdown */}
                {isUsedForSettings && <div className="flex mx-3">
                  <div className="flex">
                    <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                      <Calendar className="mt-2" />
                    </div>

                    <DateRangeFilterDropdown
                      dropdownOptions={dateRangeDropdownOptions}
                      handleDateIdChange={handleDateRangeIdChange}
                    ></DateRangeFilterDropdown>
                  </div>
                </div>}
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
            </>
          )}

          {isMediumScreen && (
            <>
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value
                    );
                  }}
                ></SearchInput>
              </div>
              <div className="flex relative  gap-2  ">
                <div className="mt-1 flex ">
                  <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                    <Calendar />
                  </div>

                  <DateRangeFilterDropdown
                    dropdownOptions={dateRangeDropdownOptions}
                    handleDateIdChange={handleDateRangeIdChange}
                  ></DateRangeFilterDropdown>
                </div>
              </div>
              {isFilterOpenInTabletView && isCustomDateOptionSelected && (
                <div className="fixed inset-0 bg-black bg-opacity-5 flex place-items-start mt-16 justify-center p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                    <button
                      onClick={() => {
                        setIsFilterOpenInTabletView(!isFilterOpenInTabletView);
                      }}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                      <X size={SIZE.TWENTY} />
                    </button>

                    <div className="my-10 justify-items-center mb-5">
                      <div className="mb-5">
                        <DateRangePicker
                          onStartDateChange={onStartDateChange}
                          onEndDateChange={onEndDateChange}
                        />
                      </div>
                      <div className="w-full justify-items-center">
                        <div className="w-24">
                          <Button>Done</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {isSmallScreen && (
            <>
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value
                    );
                  }}
                ></SearchInput>
              </div>
              <div className="flex relative gap-2">
                <Button
                  onClick={() => {
                    setIsFiltersOpenInMobileView(!isFiltersOpenInMobileView);
                  }}
                >
                  <Filter size={SIZE.EIGHT} />
                </Button>
              </div>
              {isFiltersOpenInMobileView && (
                <div className="fixed inset-0 bg-black bg-opacity-5 flex place-items-start mt-16 justify-center p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                    <button
                      onClick={() => {
                        setIsFiltersOpenInMobileView(
                          !isFiltersOpenInMobileView
                        );
                      }}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                      <X size={SIZE.EIGHT} />
                    </button>
                    {/* Date FIlters Dropdown */}

                    <div className="flex relative gap-2 items-center justify-center mt-10 mb-3">
                      <div className="mt-1 flex ">
                        <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                          <Calendar size={SIZE.TWENTY} />
                        </div>

                        <DateRangeFilterDropdown
                          dropdownOptions={dateRangeDropdownOptions}
                          handleDateIdChange={handleDateRangeIdChange}
                        ></DateRangeFilterDropdown>
                      </div>
                    </div>

                    {/* Custom Date Picker Div Flex Box*/}
                    <div
                      className="mb-10 justify-items-center"
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

                    {
                      <div className="flex w-full justify-center items-center mb-5">
                        <div className="w-28">
                          <Button
                            onClick={() => {
                              setIsFiltersOpenInMobileView(
                                !isFiltersOpenInMobileView
                              );
                            }}
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              )}
            </>
          )}

          {/* new end */}
        </div>

        <div
          className={`ag-theme-balham w-full ${
            isUsedForSettings ? "h-[60vh]" : "h-[35vh]"
          } `}
        >
          {/* NOTE : STATE MANAGEMENT NEED TO DO */}
          <CompanyUserAgGridForLead
            selectedUserId={selectedUserId}
            handleSelectedCompanyUserChange={handleSelectedCompanyUserChange}
            users={users}
            isUsedForSettings={isUsedForSettings}
            handleUpdateLeadUser={handleUpdateLeadUser}
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
    )
  );
}

export default GetCompanyUserListForLeadAssignment;
