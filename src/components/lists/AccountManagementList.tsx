/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, Filter, UserRoundCogIcon, X } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import { usePanel } from "../../context/panel/usePanel";
import SearchInput from "../ui/SearchInput";
import HandleSearchOptionProps from "../../@types/company-users/HandleSearchOptionProps";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import DateRangePicker from "../ui/DateRangePicker";
import {  useState } from "react";
import { SIZE } from "../../constants/AppConstants";
import Button from "../ui/Button";
import { useUserPreference } from "../../context/user/UserPreference";
import Pagination from "../ag-grid/Pagination";
import PaginationDataProps from "../../@types/ag-grid/PaginationDataProps";
import Account from "../../@types/account/Account";
import AccountManagementAgGrid from "../ag-grid/AccountManagementAgGrid";
import CreateAccount from "../modals/Account/CreateAccount";
import AccountDetails from "../modals/Account/AccountDetails";
import { useIndustryTypeData } from "../../context/Account/IndustryTypeData";
import { useBusinessTypeData } from "../../context/Account/BusinessTypeData";

function AccountManagementList({
  accounts,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  paginationData,
  fetchAccounts,
}: {
  fetchAccounts : () => Promise<void>;
  accounts: Account[];
  handleSearchOption: HandleSearchOptionProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  paginationData: PaginationDataProps;
}) {
  const { position } = usePanel();
  const { userPreference } = useUserPreference();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();

  const [openCreateAccountForm, setOpenAccountForm] = useState<boolean>(false);
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const { handleDateRangeIdChange, isCustomDateOptionSelected } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  const [isFilterOpenInTabletView, setIsFilterOpenInTabletView] =
    useState(false);

  const [isFiltersOpenInMobileView, setIsFiltersOpenInMobileView] =
    useState<boolean>(false);

  const [AccountDataToShowFullDetails, setAccountDataToShowFullDetails] =
    useState<Account>();
  const [showAccountDetails, setShowAccountDetails] = useState<boolean>(false);
  // Note : To open the details component of that account
  const handleRowSelectedToShowAccountDetails = (data: any) => {
    setAccountDataToShowFullDetails(data);
      setShowAccountDetails(true);
  };

  const {industryTypeData } = useIndustryTypeData();
  const {businessTypeData} = useBusinessTypeData();
  return (
    <div
      className={`w-full ${position === "left" ? "pl-5" : "pl-1"} pr-1 gap-1`}
    >
      <div className="sticky z-10 top-12 mt-1 p-0.5  flex items-center justify-between text-sm bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
        <div className="flex">
          {!isSmallScreen && (
            <UserRoundCogIcon className="w-6= h-6 text-blue-600" />
          )}

          {(isMediumScreen || isLargeScreen) && (
            <span className="text-1xl mt-1 font-bold">{" Accounts"} </span>
          )}
        </div>

        {isLargeScreen && (
          <>
            <div className="flex gap-2 justify-center items-center">
              {/* search box flex div */}
              <div className="relative flex items-center justify-center w-auto">
                <div className="grid w-56">
                  <SearchInput
                    onChange={(e) => {
                      handleSearchOption.handleSearchParameterChange(
                        e.target.value
                      );
                    }}
                  ></SearchInput>
                </div>
              </div>

              {/* Date FIlters Dropdown */}
              <div className="flex ">
                <div className="flex">
                  <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                    <Calendar />
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
              <Button
                onClick={() => {
                  setOpenAccountForm(!openCreateAccountForm);
                }}
              >
                + Create account
              </Button>
              {openCreateAccountForm && (
                <CreateAccount onClose={() => setOpenAccountForm(false)} />
              )}
              {/* <div className="ml-0.5 min-w-[120px] max-h-[40px]">
                <CustomDropdown
                  labelName="source"
                  options={leadSource!}
                  onSelect={handleLeadSelectedSource}
                />
              </div>
              <div className="ml-0.5 min-w-[120px]">
                <CustomDropdown
                  labelName="status"
                  options={leadStatus!}
                  onSelect={handleLeadSelectedStatus}
                />
              </div> */}

              {/* <div className="relative flex items-center justify-center w-auto ">
                <div className="grid ">
                  {selectedLeadOwner.id === 0 && (
                    <Button
                      type="button"
                      onClick={handleCompanyUserPopUp}
                      className="flex items-center gap-2 h-7 px-2 py-1 text-xs border border-gray-300 
                      rounded-md bg-white text-gray-700 hover:bg-gray-50 
                      focus:outline-none shadow-sm"
                    >
                      <span>Owner</span>
                      <User size={14} />
                    </Button>
                  )}

                  {selectedLeadOwner.id !== 0 && (
                    <div className="border rounded-md border-gray-400 p-0.5">
                      <span className=" flex text-xs items-center gap-1 bg-white text-gray-600">
                        {" "}
                        <User size={11} />
                        Selected Owner:
                      </span>
                      <div
                        title={selectedLeadOwner.fullname}
                        className={
                          selectedLeadOwner.id === 0
                            ? "bg-transparent"
                            : "relative rounded flex items-center justify-between gap-x-0.5 bg-blue-600 text-white  text-xs p-0.5 "
                        }
                      >
                        <span>
                          {selectedLeadOwner.fullname.length > 14
                            ? selectedLeadOwner.fullname.slice(0, 14) + "..."
                            : selectedLeadOwner.fullname}
                        </span>

                        <button
                          title="Select another owner to view assigned leads"
                          onClick={() => {
                            handleSelectedCompanyUserCheckBoxChange(null);
                          }}
                          className="border-transparent  float-end"
                        >
                          <X size={14} className="self-center"></X>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div> */}
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
              <div className="fixed inset-0 bg-black bg-opacity-45 flex place-items-start mt-16 justify-center p-4">
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
              <div className="fixed inset-0 bg-black bg-opacity-10 flex place-items-start mt-16 justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                  <button
                    onClick={() => {
                      setIsFiltersOpenInMobileView(!isFiltersOpenInMobileView);
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
      </div>

      <div className="bg-white overflow-y-auto rounded-lg shadow-sm ">
        <div
          className={
            userPreference.isLeftMenu
              ? `ag-theme-alpine w-full h-[calc(100vh-120px)]`
              : "ag-theme-alpine w-full h-[calc(100vh-128px)]"
          }
        >
          <AccountManagementAgGrid
            accounts={accounts}
            // handleRowClick={(e) => {handleRowClick}}
            onRowSelect={handleRowSelectedToShowAccountDetails}
          />
        </div>
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

      {showAccountDetails && (
          <div className="account-data">
          <AccountDetails
          fetchAccounts ={fetchAccounts}
          indutryTypeData={industryTypeData!}
          businessTypeData = {businessTypeData!}
           company={AccountDataToShowFullDetails!}
           onClose={() => setShowAccountDetails(false)}
           />
           </div>
      )}
    </div>
  );
}

export default AccountManagementList;
