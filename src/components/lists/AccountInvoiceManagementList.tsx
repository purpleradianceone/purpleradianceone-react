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
import { usePanel } from "../../context/panel/usePanel";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";
import { useUserPreference } from "../../context/user/UserPreference";
import COLORS from "../../constants/Colors";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import AccountInvoiceProps from "../../@types/account/AccountInvoiceProps";
import AccountInvoiceManagementAgGrid from "../ag-grid/AccountInvoiceManagementAgGrid";
import AccountInvoiceManagementListProps from "../../@types/List/AccountInvoiceManagementListProps";
import GenerateInvoiceModal from "../modals/Invoice/GenerateInvoiceModal";
import { File } from "lucide-react";
import CustomDropdown from "../modals/leads/CustomDropdown";
import ROUTES_URL from "../../constants/Routes";
import POST_API from "../../constants/PostApi";
import axiosClient from "../../axios-client/AxiosClient";
import { handleApiError } from "../../config/error/handleApiError";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { ComponentHeaderAndLogo } from "../ui/ComponentHeaderAndLogo";

export const accountInvoiceDataUrlSearchParamKey: string = "accountInvoiceData";

function AccountInvoiceManagementList({
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  paginationData,
  invoiceData,
  account,
  invoiceStatus,
  handleSelectedInvoiceStatus,
  handleAddInvoice,
  isUsedForSidebar = false,
}: AccountInvoiceManagementListProps) {
  const navigate = useNavigate();
  const { position } = usePanel();
  const { userPreference } = useUserPreference();
  const {
    userHasAccessToViewCompanyInvoice,
    userHasAccessToAddCompanyInvoice,
  } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  // for invoice modal open
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] =
    useState<boolean>(false);

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({
    dateRangeDropdownOptions,
    handleSearchOption,
  });

  const navigateToInvoice = (rowData: AccountInvoiceProps) => {
    console.log(rowData);

    const path = ROUTES_URL.INVOICE_DETAILS.replace(
      ":invoiceId",
      String(rowData?.id),
    );

    navigate(path);
  };
  const handleRowClicked = (event: any) => {
    const rowData: AccountInvoiceProps = event.data;
    navigateToInvoice(rowData);
  };

  const onDeleteInvoice = async (rowData: AccountInvoiceProps) => {
    console.log("Delete Invoice:", rowData);
    const postData = {
      id: rowData.id,
      company_id: loginStatus.companyId,
      updatedby_id: loginStatus.id,
      isactive: false,
    };
    try {
      const res = await axiosClient.post(
        POST_API.UPDATE_COMPANY_INVOICE,
        postData,
        {
          withCredentials: true,
        },
      );
      console.log(res.data);

      if (res.data.status) {
        toast.success(res.data.message);
        handleAddInvoice();
        // 🔄 Refresh latest data
        // getInvoices(new AbortController().signal);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRowSelected = (rowData: AccountInvoiceProps) => {
    navigateToInvoice(rowData);
  };
  useEffect(() => {
    if (handleSearchOption.dateRangeId === customDateRangeId) {
      setIsCustomDateOptionSelected(true);
    }
  }, [
    handleSearchOption.searchParameter,
    handleSearchOption.dateRangeId,
    setIsCustomDateOptionSelected,
  ]);

  if (userHasAccessToViewCompanyInvoice) {
    const selectedDateName =
      dateRangeDropdownOptions.find(
        (o) => o.search_date_range_id === handleSearchOption.dateRangeId,
      )?.date_range || "Date Filter";

    return (
      <div
        className={`w-full ${position === "left"} ${isUsedForSidebar ? "pl-5" : ""} gap-1`}
      >
        {/* 🔹 Header */}
        {isUsedForSidebar ? (
          <div
            className={`sticky z-10 top-12 mt-1 p-1 flex items-center justify-between gap-3 text-sm 
              ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm mb-1.5 w-full`}
          >
            {/* LEFT */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* 🔹 Title */}
              <ComponentHeaderAndLogo logo={File} headerText="Invoices" />
              {/* 🔹 Search */}
              <div className="w-fit min-w-[120px]">
                <SearchInput
                  value={handleSearchOption.searchParameter}
                  onChange={(e) =>
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value,
                    )
                  }
                />
              </div>

              <div className="min-w-[150px]">
                <CustomDropdown
                  preselectedOption={handleSearchOption.selectedInvoiceStatus}
                  labelName="status"
                  options={invoiceStatus!}
                  onSelect={handleSelectedInvoiceStatus}
                />
              </div>
              {/* 🔹 Date Filter + Picker (Grouped) */}
              <div className="flex   items-center gap-2">
                <DateRangeFilterDropdown
                  dropdownOptions={dateRangeDropdownOptions}
                  handleDateIdChange={handleDateRangeIdChange}
                  selectedOption={selectedDateName}
                />

                {isCustomDateOptionSelected && (
                  <div className="flex items-center">
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

            {/* RIGHT */}
            <div>
              <Button
                disabled={!userHasAccessToAddCompanyInvoice}
                onClick={() => {
                  if (!userHasAccessToAddCompanyInvoice) {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.COMPANY_INVOICE.DENIED_ADD_ACCESS,
                    );
                    return;
                  }
                  setIsCreateInvoiceModalOpen(true);
                }}
                // className={COLORS.ADD_BUTTON}
              >
                + Add Invoice
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`z-10 top-12 mt-1 p-1 flex items-center justify-between gap-3 text-sm 
          ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm mb-1.5 w-full`}
          >
            <div className="flex gap-1 items-center w-fit">
              <h3 className="table-header-custom rounded-t-md px-1 ">
                Invoices
              </h3>
            </div>

            <div className="flex items-center gap-2 w-fit">
              {/* 🔍 Search */}
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
              <div className="min-w-[150px]">
                <CustomDropdown
                  preselectedOption={handleSearchOption.selectedPriority}
                  labelName="status"
                  options={invoiceStatus!}
                  onSelect={handleSelectedInvoiceStatus}
                />
              </div>

              {/* 📅 Date Filters */}
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

                {/* ➕ Add Invoice */}
                <div className="flex gap-1 justify-end w-fit">
                  <Button
                    type="button"
                    disabled={!userHasAccessToAddCompanyInvoice}
                    onClick={() => {
                      if (!userHasAccessToAddCompanyInvoice) {
                        toast.error(
                          MESSAGE.MODULE_ACCESS.COMPANY_INVOICE
                            .DENIED_ADD_ACCESS,
                        );
                        return;
                      }
                      setIsCreateInvoiceModalOpen(true);
                    }}
                    className={COLORS.ADD_BUTTON}
                  >
                    +Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 🔹 Grid */}
        <div className="bg-white overflow-y-auto rounded-lg shadow-sm">
          <div
            className={
              userPreference.isLeftMenu
                ? `ag-theme-balham w-full ${
                    isUsedForSidebar
                      ? "h-[calc(100vh-120px)]"
                      : isUsedForSidebar
                        ? "h-[calc(40vh-100px)]"
                        : "h-[calc(50vh-120px)]"
                  }`
                : `ag-theme-balham w-full ${
                    isUsedForSidebar
                      ? "h-[calc(100vh-192px)]"
                      : isUsedForSidebar
                        ? "h-[calc(40vh-100px)]"
                        : "h-[calc(50vh-122px)]"
                  }`
            }
          >
            <AccountInvoiceManagementAgGrid
              handleRowClick={handleRowClicked}
              onRowSelect={handleRowSelected}
              onDeleteInvoice={onDeleteInvoice}
              invoices={invoiceData}
              isUsedInInvoiceModule={false}
            />
          </div>

          {/* 🔹 Create Modal */}
          <GenerateInvoiceModal
            isOpen={isCreateInvoiceModalOpen}
            onClose={() => setIsCreateInvoiceModalOpen(false)}
            account={account}
            handleAddInvoice={handleAddInvoice}
          />
        </div>

        {/* 🔹 Pagination */}
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

export default AccountInvoiceManagementList;
