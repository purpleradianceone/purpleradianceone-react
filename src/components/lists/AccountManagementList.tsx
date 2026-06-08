/* eslint-disable @typescript-eslint/no-explicit-any */
import { Building2, Calendar, CalendarDays, CalendarRange, Plus, UserRoundCogIcon } from "lucide-react";
import { usePanel } from "../../context/panel/usePanel";
import SearchInput from "../ui/SearchInput";
import HandleSearchOptionProps from "../../@types/company-users/HandleSearchOptionProps";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import DateRangePicker from "../ui/DateRangePicker";
import { useCallback, useEffect, useState } from "react";
import Button from "../ui/Button";
import { useUserPreference } from "../../context/user/UserPreference";
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
import PaginationWithoutCount, { PaginationDataWithoutCountProps } from "../ag-grid/PaginationWithoutCount";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import { ComponentHeaderAndLogo } from "../ui/ComponentHeaderAndLogo";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import AccountSummary from "../../@types/account/AccountSummary";
import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";
import SummaryCards from "../ui/SummaryCards";

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
  isDataLoading
}: {
  // fetchAccounts: () => Promise<void>;
  accounts: Account[];
  handleSearchOption: HandleSearchOptionProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  paginationData: PaginationDataWithoutCountProps;
  handleCreateCompanyAccountType: () => void;
  isUsedForAccountLead: boolean;
  handleRowSelectedForLead?: (data: Account | any) => void;
  isUsedForSupportTicketCreation?: boolean;
  isDataLoading : boolean
}) {
  const navigate = useNavigate();
  const { position } = usePanel();
  const { userPreference } = useUserPreference();
  // const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();

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

  const { loginStatus } = useLoggedInUserContext();

const [accountSummary, setAccountSummary] =
  useState<AccountSummary>({
    total_account: 0,
    total_account_created_this_month: 0,
    total_account_created_last_month: 0,
  });

  const fetchAccountSummary = useCallback(async () => {
  try {
    const postData = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
    };

    const response = await axiosClient.post(
      POST_API.SUMMARY_ACCOUNT,
      postData,
      {
        withCredentials: true,
      }
    );

    if (response.data?.length > 0) {
      setAccountSummary(response.data[0]);
    }
  } catch (error) {
    console.error(error);
  }
}, [loginStatus.companyId, loginStatus.id]);

useEffect(() => {
  if (loginStatus.companyId && loginStatus.id) {
    fetchAccountSummary();
  }
}, [fetchAccountSummary]);

const refreshAllData = useCallback(async () => {
  await Promise.all([
    handleCreateCompanyAccountType(),
    fetchAccountSummary(),
  ]);
}, [handleCreateCompanyAccountType, fetchAccountSummary]);

  const selectedDateName =
    dateRangeDropdownOptions.find(
      (o) => o.search_date_range_id === handleSearchOption.dateRangeId
    )?.date_range || "Date Filter";

  useEffect(() => {
    if (handleSearchOption.dateRangeId === customDateRangeId) {
      setIsCustomDateOptionSelected(true);
    }
  }, [
    handleSearchOption.searchParameter,
    handleSearchOption.dateRangeId,
    setIsCustomDateOptionSelected,
  ]);

  return (
    <div
      className={`w-full ${position === "left" ? "pl-7 pr-2" : "pl-1"} pr-1 gap-1 pt-2`}
    >

       {/* Top Header */}
        <div className="flex items-start justify-between ">
          <div>
            <h1 className="page-header-custom tracking-tight pb-0.5">
              Accounts
            </h1>

            <p className="page-subtitle-custom ">
              Manage all your accounts and organization in one place.
            </p>
          </div>

          <div className="flex gap-2 pt-1">
          {!isUsedForAccountLead && (
            <div className="w-fit h-fit">
              <Button
                disabled={!userHasAccessToAddAccount}
                type="button"
                className="button-import"
                onClick={() => {
                  if (userHasAccessToAddAccount) {
                    handleShowImportModule();
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS
                        .DENIED_ADD_ACCOUNT_IMPORT_ACCESS,
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
                      MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_ADD_ACCESS,
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
                handleCreateAccount={refreshAllData}
              />
            )}
          </div>
        </div>

        </div>

      <SummaryCards
        cardGap={12}
        width="55%"
        gridCols={3}
        loading={isDataLoading}
        cards={[
          {
            title: "Total Accounts",
            count: accountSummary.total_account,
            subtitle: "All Accounts",
            icon: Building2,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
          },

          {
            title: "New This Month",
            count: accountSummary.total_account_created_this_month,
            subtitle: "Recently added Account",
            icon: CalendarDays,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
          },

          {
            title: "Added Last Month",
            count: accountSummary.total_account_created_last_month,
            subtitle: "Previous Month Activity",
            icon: CalendarRange,
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600",
          },
        ]}
      />
      <div
        className={`sticky z-10 top-10 mt-1 py-1.5 px-3 mb-3 flex items-center justify-between text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} border border-slate-200 rounded-lg  mb-0.5 w-full`}
      >
        <div className="flex items-center justify-center gap-5">
          
          <ComponentHeaderAndLogo
          headerText="Account"
          logo={UserRoundCogIcon}
          />

          <div className="flex gap-2  justify-center items-center">
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
                  value={handleSearchOption.searchParameter}
                  placeholder="Search by name, email, mobile number, country, state, district and address"
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

        
      </div>

      <div className="bg-white overflow-y-auto  ">
        <div
          className={
            !isUsedForAccountLead
              ? userPreference.isLeftMenu
                ? `w-full h-[calc(100vh-278px)]`
                : "w-full h-[calc(100vh-140px)]"
              : "w-full h-[calc(100vh-270px)]"
          }
        >
          <AccountManagementAgGrid
            accounts={accounts}
            handleRowClick={handleOnRowClick}
            onRowSelect={handleRowSelectedToShowAccountDetails}
            isUsedForAccountLead={isUsedForAccountLead}
            isDataLoading={isDataLoading}
          />
        </div>
      </div>

      <div className="flex items-center justify-end ">
        <PaginationWithoutCount
          currentPage={paginationData.currentPage}
          currentPageData={paginationData.currentPageData}
          pageSize={paginationData.pageSize}
          onPageChange={paginationData.onPageChange}
          onPageSizeChange={paginationData.onPageSizeChange}
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
