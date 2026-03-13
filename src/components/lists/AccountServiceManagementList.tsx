/* eslint-disable @typescript-eslint/no-explicit-any */
import { Headset, ShoppingBag, TicketPlus, X } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import { JSX_CHILDREN_NAME, SIZE } from "../../constants/AppConstants";
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
import LookupCompanyProductSelection from "../views/lookups/lookup-company-product/LookupCompanyProductSelection";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import AccountServiceManagementListProps from "../../@types/List/AccountServiceManagementListProps";
// import AccountServiceManagementAgGrid from "../ag-grid/AccountServiceManagementAggrid";
import AccountServiceProps from "../../@types/account/AccountServiceProps";
import { useServiceStatus } from "../../config/hooks/useServiceStatus";
import AccountServiceManagementAgGrid from "../ag-grid/AccountServiceManagementAgGrid";
import CreateAccountService from "../modals/Account/account-service/CreateAccountService";

export const supportTicketDataUrlSearchParamKey: string = "supportTicketData";

function AccountServiceManagementList({
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleAddAccountService,
  paginationData,
  handleSelectedCompanyProductCheckBoxChange,
  accountServiceData,
  handleServiceStatusId,
  selectedCompanyProduct,
  handleRowSelectedForShowAccountService,
  accountId,
}: AccountServiceManagementListProps) {
  // const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { position } = usePanel();
  const { userPreference } = useUserPreference();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
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

  const [openPopUpOfCompanyProductModal, setOpenPopUpOfCompanyProductModal] =
    useState(false);

  const handleCompanyProductPopUp = () => {
    setOpenPopUpOfCompanyProductModal(true);
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
    navigate(`${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}/account-service-details/${rowData.id}`);
  };

  const handleRowSelected = (rowData: AccountServiceProps | any) => {
    handleRowSelectedForShowAccountService!(rowData);
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
            {/* LEFT SECTION - Support Label */}

            <div className="flex gap-1 items-center w-fit">
              {!isSmallScreen && (
                <Headset
                  className={`${isCustomDateOptionSelected
                    ? "w-4 h-4 text-blue-600"
                    : COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE
                    } `}
                />
              )}

              {(isMediumScreen || isLargeScreen) && (
                <span
                  className={`${isCustomDateOptionSelected
                    ? "text-xs"
                    : "section-header-custom"
                    } `}
                >
                  Account Service
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-fit">
              {/* Search Box */}
              <div
                className={`relative flex items-start ${isCustomDateOptionSelected ? "w-44 " : "w-44"
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
                        labelName="category"
                        options={serviceStatus!}
                        onSelect={handleServiceStatusId}
                      />
                    )}
                  </div>

                  {/* Product */}
                  <div className="relative flex items-center justify-center">
                    <div className="grid">
                      {selectedCompanyProduct.id === 0 ? (
                        <Button
                          type="button"
                          onClick={handleCompanyProductPopUp}
                          className="flex items-center gap-2 px-2 py-1 caption-custom border border-gray-300 
                  rounded-md bg-white hover:bg-gray-50 shadow-sm"
                        >
                          <ShoppingBag size={14} />
                          <span>Product</span>
                        </Button>
                      ) : (
                        <div className="border rounded-md border-gray-400 p-0.5 max-w-[150px]">
                          <div
                            title={selectedCompanyProduct.name}
                            className="relative rounded flex justify-between gap-x-0.5 bg-blue-600 caption-custom white-text p-0.5"
                          >
                            <span onClick={handleCompanyProductPopUp}>
                              {selectedCompanyProduct.name.length > 14
                                ? selectedCompanyProduct.name.slice(0, 14) +
                                "..."
                                : selectedCompanyProduct.name}
                            </span>

                            <button
                              title="Clear"
                              onClick={() =>
                                handleSelectedCompanyProductCheckBoxChange(null)
                              }
                              className="border-transparent"
                            >
                              <X size={14} className="self-center" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 justify-end w-fit">
                  <Button
                    type="submit"
                    disabled={!userHasAccessToAddAccountService}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('------------------');
                      console.log(userHasAccessToAddAccountService);
                      console.log('------------------');
                      if (!userHasAccessToAddAccountService) {
                        toast.error(
                          MESSAGE.MODULE_ACCESS.ACCOUNT_SERVICE
                            .DENIED_ADD_ACCESS,
                        );
                        return;
                      }
                      setIsCreateAccountServiceModalOpen(true);
                    }}
                  >
                    <span className="flex items-center gap-1">
                      {!isSmallScreen && <TicketPlus size={SIZE.SIXTEEN} />}
                      {isSmallScreen && <TicketPlus size={SIZE.EIGHT} />}
                      {isLargeScreen && JSX_CHILDREN_NAME.CREATE_SUPPORT_TICKET}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }

        <div className="bg-white  overflow-y-auto rounded-lg shadow-sm ">
          <div
            className={
              userPreference.isLeftMenu
                ? `ag-theme-balham w-full h-[calc(50vh-120px)]`
                : "ag-theme-balham w-full h-[calc(50vh-122px)]"
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

        {openPopUpOfCompanyProductModal && (
          <LookupCompanyProductSelection
            isOpen={openPopUpOfCompanyProductModal}
            onClose={() => setOpenPopUpOfCompanyProductModal(false)}
            preText="Select Company Product"
            description="Select company product to view its support tickets"
            selectedProductId={
              selectedCompanyProduct && selectedCompanyProduct.id !== 0
                ? selectedCompanyProduct.id!
                : null
            }
            handleSelectedCompanyProductChange={(params) => {
              handleSelectedCompanyProductCheckBoxChange(params);
              setOpenPopUpOfCompanyProductModal(false);
            }}
          />
        )}
      </div>
    );
  }
}

export default AccountServiceManagementList;
