/* eslint-disable @typescript-eslint/no-explicit-any */

import Button from "../ui/Button";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useEffect, useState } from "react";
import SearchInput from "../ui/SearchInput";
import DateRangePicker from "../ui/DateRangePicker";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import { usePanel } from "../../context/panel/usePanel";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";
import { useUserPreference } from "../../context/user/UserPreference";
import COLORS from "../../constants/Colors";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import AccountSubscriptionManagementListProps from "../../@types/List/AccountSubscriptionManagementListProps";
import AccountSubscriptionProps from "../../@types/account/AccountSubscriptionProps";
import AccountSubscriptionManagementAgGrid from "../ag-grid/AccountSubscriptionManagementAgGrid";
import CreateAccountSubscription from "../modals/Account/account-subscription/CreateAccountSubscription";
import LookupCompanyProductDropdown from "../ui/LookupCompanyProductDropdown";

export const accountSubscriptionDataUrlSearchParamKey: string =
  "accountSubscriptionData";

function AccountSubscriptionManagementList({
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleAddAccountSubscritption,
  paginationData,
  handleSelectedCompanyProductChange,
  accountSubscriptionData,
  handleAddToInvoice,
  // handleRowSelectedForShowAccountSubscription,

  accountId,
}: AccountSubscriptionManagementListProps) {
  const navigate = useNavigate();
  const { position } = usePanel();
  const { userPreference } = useUserPreference();

  const {
    userHasAccessToViewAccountSubscription,
    userHasAccessToAddAccountSubscription,
  } = useUserAccessModules();

  const [
    isCreateAccountSubscriptionModalOpen,
    setIsCreateAccountSubscriptionModalOpen,
  ] = useState<boolean>(false);

  const [
    selectedAccountSubscriptionForEdit,
    setSelectedAccountSubscriptionForEdit,
  ] = useState<AccountSubscriptionProps>({
    id: 0,
    companyId: 0,
    accountSubscriptionCode: 0,
    accountId: 0,
    accountName: "",
    companyProductId: 0,
    companyProductName: "",
    startDate: "",
    endDate: "",
    packageDetail: "",
    isRenewal: false,
    isAddedToInvoiceDraft: false,
    isActive: false,
    createdBy: "",
    createdOn: "",
  });

  const handleAccountSubscriptionDataFormChange = (
    data: AccountSubscriptionProps,
  ) => {
    setSelectedAccountSubscriptionForEdit(data);
    console.log(data);
    console.log(selectedAccountSubscriptionForEdit);
  };

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  const handleRowClicked = (event: any) => {
    const rowData: AccountSubscriptionProps = event.data;

    navigate(
      `${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}/account-subscription-details/${rowData.id}`,
    );
  };

  const handleRowSelected = (rowData: AccountSubscriptionProps | any) => {
    // handleRowSelectedForShowAccountSubscription!(rowData);
    navigate(
      `${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}/account-subscription-details/${rowData.id}`,
    );
  };

  if (userHasAccessToViewAccountSubscription) {
    const handleCreateAccountSubscriptionModalClose = () => {
      setIsCreateAccountSubscriptionModalOpen(false);
    };

    const selectedDateName =
      dateRangeDropdownOptions.find(
        (o) => o.search_date_range_id === handleSearchOption.dateRangeId,
      )?.date_range || "Date Filter";

    // eslint-disable-next-line react-hooks/rules-of-hooks
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
      <div className={`w-full ${position === "left"} pr-1 gap-1`}>
        <div
          className={`z-10 top-12 mt-1 p-1 flex items-center justify-between gap-3 text-sm 
          ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm mb-1.5 w-full`}
        >
          <div className="flex gap-1 items-center w-fit">
            <h3 className="table-header-custom rounded-t-md px-1 ">
              Subscriptions
            </h3>
          </div>

          <div className="flex items-center gap-2 w-fit">
            <div className="relative flex items-start w-44">
              <SearchInput
                value={handleSearchOption.searchParameter}
                onChange={(e) => {
                  handleSearchOption.handleSearchParameterChange(
                    e.target.value,
                  );
                }}
              />
            </div>

            <div className="min-w-[250px]">
              <LookupCompanyProductDropdown
                onProductSelected={(product) => {
                  console.log(product);
                  handleSelectedCompanyProductChange(product);
                }}
                productTypeId={[4]}
              />
            </div>

            <div className="flex items-center gap-2 w-fit">
              <DateRangeFilterDropdown
                dropdownOptions={dateRangeDropdownOptions}
                handleDateIdChange={handleDateRangeIdChange}
                selectedOption={selectedDateName}
              />

              {isCustomDateOptionSelected && (
                <DateRangePicker
                  onStartDateChange={onStartDateChange}
                  onEndDateChange={onEndDateChange}
                  initialStartDate={handleSearchOption.startDate}
                  initialEndDate={handleSearchOption.endDate}
                />
              )}

              <div className="flex gap-1 justify-end w-fit">
                <Button
                  type="button"
                  disabled={!userHasAccessToAddAccountSubscription}
                  onClick={() => {
                    if (!userHasAccessToAddAccountSubscription) {
                      toast.error(
                        MESSAGE.MODULE_ACCESS.ACCOUNT_SUBSCRIPTION
                          .DENIED_ADD_ACCESS,
                      );
                      return;
                    }
                    setIsCreateAccountSubscriptionModalOpen(true);
                  }}
                  className={COLORS.ADD_BUTTON}
                >
                  +Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-y-auto rounded-lg shadow-sm">
          <div
            className={
              userPreference.isLeftMenu
                ? `ag-theme-balham w-full h-[calc(50vh-120px)]`
                : "ag-theme-balham w-full h-[calc(50vh-122px)]"
            }
          >
            <AccountSubscriptionManagementAgGrid
              handleAddToInvoice={handleAddToInvoice}
              handleRowClick={handleRowClicked}
              handleAccountSubscriptionDataFormChange={
                handleAccountSubscriptionDataFormChange
              }
              onRowSelect={handleRowSelected}
              accountSubscriptions={accountSubscriptionData}
              isUsedInAccountSubscriptionModule={false}
            />
          </div>

          <CreateAccountSubscription
            isOpen={isCreateAccountSubscriptionModalOpen}
            onClose={handleCreateAccountSubscriptionModalClose}
            accountId={Number(accountId)}
            handleAddAccountSubscritption={handleAddAccountSubscritption}
          />
        </div>

        <div className="flex items-center justify-end col-span-1">
          <PaginationWithoutCount
            pageSize={paginationData.pageSize}
            currentPage={paginationData.currentPage}
            currentPageData={paginationData.currentPageData}
            onPageSizeChange={paginationData.onPageSizeChange}
            onPageChange={paginationData.onPageChange}
          />
        </div>
      </div>
    );
  }
}

export default AccountSubscriptionManagementList;
