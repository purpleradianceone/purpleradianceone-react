/* eslint-disable @typescript-eslint/no-explicit-any */

import Button from "../ui/Button";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useEffect, useState } from "react";
import SearchInput from "../ui/SearchInput";
import DateRangePicker from "../ui/DateRangePicker";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import CustomDropdown from "../modals/leads/CustomDropdown";
import { useNavigate } from "react-router-dom";
// import qs from "query-string";
import ROUTES_URL from "../../constants/Routes";
import { usePanel } from "../../context/panel/usePanel";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";
import { useUserPreference } from "../../context/user/UserPreference";
import COLORS from "../../constants/Colors";
// import SupportTicketProps from "../../@types/support-ticket-management/SupportTicketProps";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import AccountServiceManagementListProps from "../../@types/List/AccountServiceManagementListProps";
// import AccountServiceManagementAgGrid from "../ag-grid/AccountServiceManagementAggrid";
import AccountServiceProps from "../../@types/account/AccountServiceProps";
import { useServiceStatus } from "../../config/hooks/useServiceStatus";
import AccountServiceManagementAgGrid from "../ag-grid/AccountServiceManagementAgGrid";
import CreateAccountService from "../modals/Account/account-service/CreateAccountService";
import LookupCompanyProductDropdown from "../ui/LookupCompanyProductDropdown";

export const supportTicketDataUrlSearchParamKey: string = "supportTicketData";

function AccountServiceManagementList({
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleAddAccountService,
  paginationData,
  handleSelectedCompanyProductChange,
  accountServiceData,
  handleServiceStatusId,
  handleAddToInvoice,
  // handleRowSelectedForShowAccountService,
  accountId,
}: AccountServiceManagementListProps) {
  // const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { position } = usePanel();
  const { userPreference } = useUserPreference();

  const {
    userHasAccessToViewAccountService,
    userHasAccessToAddAccountService,
  } = useUserAccessModules();

  const [isCreateAccountServiceModalOpen, setIsCreateAccountServiceModalOpen] =
    useState<boolean>(false);

  const { isLoading, serviceStatus } = useServiceStatus();

  const [selectedSupportTicketForEdit, setSelectedSupportTicketForEdit] =
    useState<AccountServiceProps>({
      id: 0,
      companyId: 0,
      accountServiceCode: 0,
      accountId: 0,
      accountName: "",
      companyProductId: 0,
      companyProductName: "",
      serviceDateTime: "",
      serviceStatusId: 0,
      serviceStatus: "",
      isAddedToInvoiceDraft: false,
      isActive: false,
      createdBy: "",
      createdOn: "",
    });

  //note : this is new
  const handleSupportTicketDataFormChange = (data: AccountServiceProps) => {
    setSelectedSupportTicketForEdit(data);
    console.log(data);
    console.log(selectedSupportTicketForEdit);
  };

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  //NOTE : BELOW BOTH FUNCTION DO THE SAME THING
  // const handleRowClicked = (event: any) => {
  //   const rowData: SupportTicketProps = event.data;
  //   const queryParams = qs.stringify({
  //     [supportTicketDataUrlSearchParamKey]: JSON.stringify(rowData),
  //   });
  //   navigate(ROUTES_URL.SUPPORT_TICKET_DETAILS + `?${queryParams}`);
  // };

  const handleRowClicked = (event: any) => {
    const rowData: AccountServiceProps = event.data;
    // const queryParams = qs.stringify({
    //   [supportTicketDataUrlSearchParamKey]: JSON.stringify(rowData),
    // });
    // navigate(ROUTES_URL.ACCOUNT_SERVICE + `?${queryParams}`);
    navigate(
      `${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}/account-service-details/${rowData.id}`,
    );
  };

  const handleRowSelected = (rowData: AccountServiceProps | any) => {
    // handleRowSelectedForShowAccountService!(rowData);
    navigate(
      `${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}/account-service-details/${rowData.id}`,
    );
  };

  if (userHasAccessToViewAccountService) {
    const handleCreateAccountServiceModalClose = () => {
      setIsCreateAccountServiceModalOpen(false);
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
        {/* sticky */}
        {
          <div
            className={` z-10 top-12 mt-1 p-1 flex flex-wrap items-center justify-between gap-3 text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm mb-1.5 
                      w-full
                    `}
          >
            {/* LEFT SECTION - Account Service Label */}

            <div className="flex gap-1 items-center w-fit">
              <h3 className="table-header-custom rounded-t-md px-1">
                Services
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-fit">
              {/* Search Box */}
              <div
                className={`relative flex items-start ${
                  isCustomDateOptionSelected ? "w-44 " : "w-44"
                }`}
              >
                <SearchInput
                  value={handleSearchOption.searchParameter}
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value,
                    );
                  }}
                ></SearchInput>
              </div>

              <div className="min-w-[250px]">
                <LookupCompanyProductDropdown
                  onProductSelected={(product) => {
                    console.log(product);
                    if (product) {
                      handleSelectedCompanyProductChange(product);
                    } else {
                      handleSelectedCompanyProductChange({ id: 0, name: "" });
                    }
                  }}
                  productTypeId={[3]}
                />
              </div>

              {/* DATE FILTERS */}
              <div className="flex flex-wrap items-center gap-2 w-fit">
                <div>
                  <div className="grid grid-cols-1 justify-center gap-1 w-full">
                    {/* Shared width wrapper */}
                    <div className="relative w-fit flex justify-center gap-1">
                      <div className="flex col-span-2 w-fit">
                        <DateRangeFilterDropdown
                          dropdownOptions={dateRangeDropdownOptions}
                          handleDateIdChange={handleDateRangeIdChange}
                          selectedOption={selectedDateName}
                        />
                        {isCustomDateOptionSelected && (
                          <div className="mt-1 ml-1 w-fit">
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
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {/* Category */}
                  <div className="min-w-[110px]">
                    {!isLoading && (
                      <CustomDropdown
                        preselectedOption={
                          // savedFilters.selectedSupportTicketCategory || null
                          handleSearchOption.selectedSupportTicketCategory
                        }
                        labelName="status"
                        options={serviceStatus!}
                        onSelect={handleServiceStatusId}
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-1 justify-end w-fit">
                  <Button
                    type="button"
                    disabled={!userHasAccessToAddAccountService}
                    onClick={() => {
                      if (!userHasAccessToAddAccountService) {
                        toast.error(
                          MESSAGE.MODULE_ACCESS.ACCOUNT_SERVICE
                            .DENIED_ADD_ACCESS,
                        );
                        return;
                      }
                      setIsCreateAccountServiceModalOpen(true);
                    }}
                    className={COLORS.ADD_BUTTON}
                  >
                    +Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }

        <div className="bg-white overflow-y-auto rounded-lg shadow-sm ">
          <div
            className={
              userPreference.isLeftMenu
                ? `w-full h-[calc(50vh-120px)]`
                : "w-full h-[calc(50vh-122px)]"
            }
          >
            {/* <SupportTicketManagementAgGrid
              isUsedInSupportTicketModule={true}
              handleRowClick={handleRowClicked}
              onRowSelect={handleRowSelected}
              handleSupportTicketDataFormChange={
                handleSupportTicketDataFormChange
              }
              supportTickets={accountServiceData}
            /> */}

            <AccountServiceManagementAgGrid
              handleAddToInvoice={handleAddToInvoice}
              handleRowClick={handleRowClicked}
              handleAccountServiceDataFormChange={
                handleSupportTicketDataFormChange
              }
              onRowSelect={handleRowSelected}
              accountServices={accountServiceData}
              isUsedInAccountServiceModule={false}
            ></AccountServiceManagementAgGrid>
          </div>
          {/* <CreateSupportTicketModal
            isOpen={isCreateSupportTicketModalOpen}
            onClose={handleCreateAccountServiceModalClose}
            handleSupportTicketCreated={handleAddAccountService}
          ></CreateSupportTicketModal> */}

          <CreateAccountService
            isOpen={isCreateAccountServiceModalOpen}
            onClose={handleCreateAccountServiceModalClose}
            accountId={Number(accountId)}
            handleAddAccountService={handleAddAccountService}
          ></CreateAccountService>
        </div>

        <div className="flex items-center justify-end col-span-1 ">
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

export default AccountServiceManagementList;
