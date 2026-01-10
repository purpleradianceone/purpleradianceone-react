/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, Plus, UserRoundCogIcon } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import { usePanel } from "../../context/panel/usePanel";
import SearchInput from "../ui/SearchInput";
import HandleSearchOptionProps from "../../@types/company-users/HandleSearchOptionProps";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import DateRangePicker from "../ui/DateRangePicker";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { useUserPreference } from "../../context/user/UserPreference";
import Pagination from "../ag-grid/Pagination";
import PaginationDataProps from "../../@types/ag-grid/PaginationDataProps";
import Account from "../../@types/account/Account";
import AccountManagementAgGrid from "../ag-grid/AccountManagementAgGrid";
import CreateAccount from "../modals/Account/CreateAccount";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import { SIZE } from "../../constants/AppConstants";
import COLORS from "../../constants/Colors";

function AccountManagementList({
  accounts,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  paginationData,
  // fetchAccounts,
  handleCreateCompanyAccountType,
  isUsedForAccountLead,
  handleRowSelectedForLead,
  isUsedForSupportTicketCreation,
}: {
  // fetchAccounts: () => Promise<void>;
  accounts: Account[];
  handleSearchOption: HandleSearchOptionProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  paginationData: PaginationDataProps;
  handleCreateCompanyAccountType: () => void;
  isUsedForAccountLead: boolean;
  handleRowSelectedForLead?: (data: Account | any) => void;
  isUsedForSupportTicketCreation?: boolean;
}) {
  const navigate = useNavigate();
  const { position } = usePanel();
  const { userPreference } = useUserPreference();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();

  const [openCreateAccountForm, setOpenAccountForm] = useState<boolean>(false);
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  // const [AccountDataToShowFullDetails, setAccountDataToShowFullDetails] =
  // useState<Account>();
  // const [showAccountDetails, setShowAccountDetails] = useState<boolean>(false);
  // Note : To open the details component of that account
  const handleRowSelectedToShowAccountDetails = (data: Account) => {
    if (!isUsedForAccountLead) {
      navigate(`${ROUTES_URL.ACCOUNT_DETAILS}/${data.id}`, {
        state: {
          accountName: data.name,
        },
      });

      // setAccountDataToShowFullDetails(data);
      // setShowAccountDetails(true);
    } else {
      handleRowSelectedForLead!(data);
    }
  };

  // Note : Click anywhere in the row
  const handleOnRowClick = (event: any) => {
    const data = event.data;
    if (!isUsedForAccountLead) {
      navigate(`${ROUTES_URL.ACCOUNT_DETAILS}/${data.id}`, {
        state: {
          accountName: data.name,
        },
        replace: false,
      });
    } else {
      handleRowSelectedForLead!(data);
    }
  };

  const { userHasAccessToAddAccount } = useUserAccessModules();
  const handleShowImportModule = () => {
    navigate(ROUTES_URL.ACCOUNT_IMPORT_CSV);
  };

  const selectedDateName =
    dateRangeDropdownOptions.find(
      (o) => o.search_date_range_id === handleSearchOption.dateRangeId
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
      className={`w-full ${position === "left" ? "pl-5" : "pl-1"} pr-1 gap-1`}
    >
      <div
        className={`sticky z-10 top-10 mt-1 p-0.5  flex items-center justify-between text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm  mb-1.5 w-full`}
      >
        <div className="flex items-center justify-center gap-5">
          <div className="flex gap-1">
          {!isSmallScreen && (
            <UserRoundCogIcon
              className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE}
            />
          )}

          {(isMediumScreen || isLargeScreen) && (
            <span className="section-header-custom mt-1">{" Accounts"} </span>
          )}
          </div>

          {/* {isLargeScreen && ( */}
          {/* <> */}
          <div className="flex gap-2  justify-center items-center">
            {/* search box flex div */}
            <div className="flex gap-1">
              {/* search box flex div */}
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value
                    );
                  }}
                  value={handleSearchOption.searchParameter}
                />
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
          {/* </> */}
        </div>

        <div className="flex gap-2">
          {!isUsedForAccountLead && (
            <div className="w-fit h-fit">
              <Button
                disabled={!userHasAccessToAddAccount}
                onClick={() => {
                  if (userHasAccessToAddAccount) {
                    handleShowImportModule();
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS
                        .DENIED_ADD_ACCOUNT_IMPORT_ACCESS
                    );
                  }
                }}
              >
                <div className="flex items-center gap-0.5">
                  <Plus size={SIZE.SIXTEEN} />
                  Import
                </div>
              </Button>
            </div>
          )}

          <div>
            {!isUsedForSupportTicketCreation && (
              <Button
                disabled={!userHasAccessToAddAccount}
                type="submit"
                onClick={(e) => {
                  if (userHasAccessToAddAccount) {
                    e.preventDefault();
                    setOpenAccountForm(!openCreateAccountForm);
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_ADD_ACCESS
                    );
                  }
                }}
              >
                <div className="flex items-center gap-0.5">
                  <Plus size={SIZE.SIXTEEN} /> Create
                </div>
              </Button>
            )}
            {openCreateAccountForm && (
              <CreateAccount
                onClose={() => setOpenAccountForm(false)}
                handleCreateAccount={handleCreateCompanyAccountType}
              />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white overflow-y-auto rounded-lg shadow-sm ">
        <div
          className={
            !isUsedForAccountLead
              ? userPreference.isLeftMenu
                ? `ag-theme-balham w-full h-[calc(100vh-115px)]`
                : "ag-theme-balham w-full h-[calc(100vh-120px)]"
              : "ag-theme-balham w-full h-[calc(100vh-270px)]"
          }
        >
          <AccountManagementAgGrid
            accounts={accounts}
            handleRowClick={handleOnRowClick}
            onRowSelect={handleRowSelectedToShowAccountDetails}
            isUsedForAccountLead={isUsedForAccountLead}
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

      {/* {showAccountDetails && (
        <div className="account-data">
          <AccountDetails
            // fetchAccounts={fetchAccounts}
            // company={AccountDataToShowFullDetails!}
            // onClose={() => setShowAccountDetails(false)}
          />
        </div>
      )} */}
    </div>
  );
}

export default AccountManagementList;
