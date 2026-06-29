/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../ui/Button";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useCallback, useEffect, useState } from "react";
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
import CustomDropdown from "../modals/leads/CustomDropdown";
import ROUTES_URL from "../../constants/Routes";
import POST_API from "../../constants/PostApi";
import axiosClient from "../../axios-client/AxiosClient";
import { handleApiError } from "../../config/error/handleApiError";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { ComponentHeaderAndLogo } from "../ui/ComponentHeaderAndLogo";
import CustomDocumentPreviewComponent from "../custom-document-preview-component/CustomDocumentPreviewComponent";
import LoadingPopUpAnimation from "../views/card/LoadingPopUpAnimation";
import { FaRegFileAlt, FaRegFileArchive } from "react-icons/fa";
import AccountProformaInvoiceManagementListProps from "../../@types/List/AccountProformaInvoiceManagementListProps";
import AccountProformaInvoiceProps from "../../@types/account/AccountProformaInvoiceProps";
import CreateProformaInvoiceModal from "../modals/ProformaInvoice/CreateProformaInvoiceModal";
import AccountProformaInvoiceManagementAgGrid from "../ag-grid/AccountProformaInvoiceManagementAgGrid";
import CompanyProformaInvoiceSummary from "../../@types/invoice/CompanyProformaInvoiceSummary";
import { FilePenLine, FileText, IndianRupee, Receipt } from "lucide-react";
import SummaryCards from "../ui/SummaryCards";
import { formatRupee } from "../../utils/helperMethods/formatFunctions";

export const accountInvoiceDataUrlSearchParamKey: string = "accountInvoiceData";

function AccountProformaInvoiceManagementList({
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  paginationData,
  invoiceData,
  account,
  invoiceStatus,
  handleSelectedInvoiceStatus,
  handleAddProformaInvoice,
  isUsedForSidebar = false,
  gridLoading,
}: AccountProformaInvoiceManagementListProps) {
  const navigate = useNavigate();
  const { position } = usePanel();
  const { userPreference } = useUserPreference();
  const {
    userHasAccessToViewAccountProformaInvoice,
    userHasAccessToAddAccountProformaInvoice,
  } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showCompanyLogoPreview, setShowCompanyLogoPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // for invoice modal open
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] =
    useState<boolean>(false);

  const [isSummaryLoading, setIsSummaryLoading] = useState(false);


    const [proformaInvoiceSummary, setProformaInvoiceSummary] =
  useState<CompanyProformaInvoiceSummary>({
    total_company_proforma_invoice_this_month: 0,
    total_company_proforma_invoice_in_draft: 0,
    total_company_proforma_invoice_amount_this_month: 0,
    total_company_proforma_invoice_tax_this_month: 0,
  });

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({
    dateRangeDropdownOptions,
    handleSearchOption,
  });

  const navigateToInvoice = (rowData: AccountProformaInvoiceProps) => {
    console.log(rowData);

    const path = ROUTES_URL.PROFORMA_INVOICE_DETAILS.replace(
      ":invoiceId",
      String(rowData?.id),
    ).replace(":accountId", String(rowData?.accountId));

    navigate(path);
  };
  const handleRowClicked = (event: any) => {
    const rowData: AccountProformaInvoiceProps = event.data;
    navigateToInvoice(rowData);
  };

  //   const handleSaveHeader = async () => {
  //     const formPayload = {
  //       company_id: loginStatus.companyId,
  //       account_id: account?.id,
  //       createdby_id: loginStatus.id,
  //     };
  //     console.log(formPayload);
  //     // console.log(selectedAccount);
  //     setIsSubmitting(true);
  //     await axiosClient
  //       .post(POST_API.CREATE_COMPANY_INVOICE, formPayload, {
  //         withCredentials: true,
  //       })
  //       .then((response) => {
  //         if (response.data.status) {
  //           toast.success(response.data.message);
  //           console.log(response.data);

  //           const invoiceId = response?.data?.newid || 0;
  //           handleAddProformaInvoice();
  //           const path = ROUTES_URL.PROFORMA_INVOICE_DETAILS.replace(
  //             ":invoiceId",
  //             String(invoiceId),
  //           );
  //           navigate(path);
  //           // onClose();
  //         } else {
  //           toast.error(response.data.message);
  //         }
  //       })
  //       .catch(async (error) => {
  //         console.log(error);
  //         handleApiError(error);
  //       })
  //       .finally(() => {
  //         setIsSubmitting(false);
  //       });
  //   };

    const fetchProformaInvoiceSummary = useCallback(async () => {
  try {
    setIsSummaryLoading(true);

    const postData = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
    };

    const response = await axiosClient.post(
      POST_API.SUMMARY_COMPANY_PROFORMA_INVOICE,
      postData,
      {
        withCredentials: true,
      }
    );

    if (response.data?.length > 0) {
      setProformaInvoiceSummary(response.data[0]);
    }
  } catch (error) {
    console.error(error);
  }finally {
    setIsSummaryLoading(false);
  }
}, [loginStatus.companyId, loginStatus.id]);

useEffect(() => {
  if (loginStatus.companyId && loginStatus.id) {
    fetchProformaInvoiceSummary();
  }
}, [fetchProformaInvoiceSummary]);

const refreshAllData = useCallback(async () => {
  await Promise.all([
    handleAddProformaInvoice(),
    fetchProformaInvoiceSummary(),
  ]);
}, [
  handleAddProformaInvoice,
  fetchProformaInvoiceSummary,
]);


  const onDeleteInvoice = async (rowData: AccountProformaInvoiceProps) => {
    if(loginStatus.companyId === 0)return;
    console.log("Delete Invoice:", rowData);
    const postData = {
      id: rowData.id,
      company_id: loginStatus.companyId,
      updatedby_id: loginStatus.id,
      isactive: false,
    };
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.UPDATE_COMPANY_PROFORMA_INVOICE,
        postData,
        {
          withCredentials: true,
        },
      );
      console.log(res.data);

      if (res.data.status) {
        toast.success(res.data.message);
        handleAddProformaInvoice();
        fetchProformaInvoiceSummary();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvoiceDownload = async (
    rowData: AccountProformaInvoiceProps,
  ) => {
    if(loginStatus.companyId === 0)return;
    setIsSubmitting(true);

    try {
      const response = await axiosClient.post(
        POST_API.COMPANY_PROFORMA_INVOICE_DOWNLOAD,
        {
          company_id: loginStatus.companyId,
          company_proforma_invoice_id: Number(rowData?.id),
          requestedby_id: loginStatus.id,
        },
        {
          responseType: "blob", // ✅ IMPORTANT
          withCredentials: true,
        },
      );

      const blob = new Blob([response.data], {
        type: "application/pdf", // fixed for invoice
      });

      console.log(response.data);

      const fileUrl = URL.createObjectURL(blob);

      // ✅ Same as your task document logic
      setLogoPreview(fileUrl); // you can rename this later (e.g. setInvoicePreview)
      setShowCompanyLogoPreview(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowSelected = (rowData: AccountProformaInvoiceProps) => {
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

  if (userHasAccessToViewAccountProformaInvoice) {
    const selectedDateName =
      dateRangeDropdownOptions.find(
        (o) => o.search_date_range_id === handleSearchOption.dateRangeId,
      )?.date_range || "Date Filter";

    return (
      <div
        className={`w-full ${position === "left"} ${isUsedForSidebar ? (userPreference.isLeftMenu ? "pl-7 pr-2" : "pl-1") : ""} gap-1 pt-2`}
      >
        {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
        {/* 🔹 Header */}
        {isUsedForSidebar ? (
          <div>
          <div className="flex items-start justify-between ">
          <div className="flex items-center gap-3 ">
              <div className={`p-2 rounded-lg ${COLORS.PAGE_HEADER_SECTION_BG_COLOR}`}>
              <FaRegFileArchive className={`${COLORS.PAGE_HEADER_ICONS_COLOR_AND_SIZE} w-6 h-6`} />
            </div>

              <div>
                <h1 className="page-header-custom tracking-tight pb-0.5">
               Proforma Invoices
            </h1>
              <p className="page-subtitle-custom ">
               Manage and track all your Proforma invoices efficiently.

            </p>
              </div>
            </div>
            

           {/* RIGHT */}
           <div className="pt-1">
              <Button
                disabled={!userHasAccessToAddAccountProformaInvoice}
                onClick={() => {
                  if (!userHasAccessToAddAccountProformaInvoice) {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.ACCOUNT_PROFORMA_INVOICE
                        .DENIED_ADD_ACCESS,
                    );
                    return;
                  }
                  //   handleSaveHeader();
                  setIsCreateInvoiceModalOpen(true);
                }}
                // className={COLORS.ADD_BUTTON}
              >
                + Add Proforma Invoice
              </Button>
            </div>
          </div>

          <SummaryCards
            cardGap={20}
            width="80%"
            gridCols={4}
            loading={isSummaryLoading}
            cards={[
              {
                title: "Total Proforma Invoices",
                count:
                  proformaInvoiceSummary.total_company_proforma_invoice_this_month,
                subtitle: "Created This Month",
                icon: FileText,
                iconBg: COLORS.LIGHT_PURPLE_BACKGROUND,
                iconColor: COLORS.PRIMARY_PURPLE,
              },

              {
                title: "Draft Proforma Invoices",
                count:
                  proformaInvoiceSummary.total_company_proforma_invoice_in_draft,
                subtitle: "All Draft Invoices",
                icon: FilePenLine,
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
              },

              {
                title: "Total Tax",
                count: `₹ ${formatRupee(
                 proformaInvoiceSummary?.total_company_proforma_invoice_tax_this_month ?? 0
              )}`,
                subtitle: "GST Amount This Month",
                icon: Receipt,
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
              },

              {
                title: "Proforma Amount",
                count: `₹ ${formatRupee(
                  proformaInvoiceSummary.total_company_proforma_invoice_amount_this_month ?? 0
                )}`,
                subtitle: "This Month",
                icon: IndianRupee,
                iconBg: "bg-green-100",
                iconColor: "text-green-600",
              },
            ]}
          />
             
          <div
            className={`sticky z-10 top-12 mt-1 py-1.5 px-3 mb-3 flex items-center justify-between gap-3 text-sm 
              ${COLORS.GRID_HEADER_SECTION_BG_COLOR} border border-slate-200 rounded-lg mb-1.5 w-full`}
          >
            {/* LEFT */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* 🔹 Title */}
              <ComponentHeaderAndLogo
                logo={FaRegFileAlt}
                headerText=" Proforma Invoices"
              />
              {/* 🔹 Search */}
              <div className="w-fit min-w-[120px]">
                <SearchInput
                  value={handleSearchOption.searchParameter}
                  placeholder="Search by invoice no, account name"
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
              <div className="flex  items-center gap-2">
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
          </div>
          </div>
        ) : (
          <div
            className={`z-10 top-12 mt-1 p-1 flex items-center justify-between gap-3 text-sm 
          ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm mb-1.5 w-full`}
          >
            <div className="flex gap-1 items-center w-fit">
              <h3 className="table-header-custom rounded-t-md px-1">
                Proforma Invoices
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
                    disabled={!userHasAccessToAddAccountProformaInvoice}
                    onClick={() => {
                      if (!userHasAccessToAddAccountProformaInvoice) {
                        toast.error(
                          MESSAGE.MODULE_ACCESS.ACCOUNT_PROFORMA_INVOICE
                            .DENIED_ADD_ACCESS,
                        );
                        return;
                      }
                      //   handleSaveHeader();
                      setIsCreateInvoiceModalOpen(true);
                    }}
                    className={COLORS.ADD_BUTTON}
                  >
                    + Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showCompanyLogoPreview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setShowCompanyLogoPreview(false)}
          >
            <CustomDocumentPreviewComponent
              fileUrl={logoPreview!}
              fileExtension={"application/pdf"}
              width={"50%"}
              height={"85%"}
              enableDownload={true}
            />
          </div>
        )}
        {/* 🔹 Grid */}
        <div className="bg-white overflow-y-auto rounded-lg shadow-sm">
          <div
            className={
              userPreference.isLeftMenu
                ? `w-full ${
                    isUsedForSidebar
                      ? "h-[calc(100vh-278px)]"
                      : isUsedForSidebar
                        ? "h-[calc(40vh-100px)]"
                        : "h-[calc(50vh-120px)]"
                  }`
                : `w-full ${
                    isUsedForSidebar
                      ? "h-[calc(100vh-122px)]"
                      : isUsedForSidebar
                        ? "h-[calc(40vh-100px)]"
                        : "h-[calc(50vh-122px)]"
                  }`
            }
          >
            <AccountProformaInvoiceManagementAgGrid
              handleRowClick={handleRowClicked}
              onRowSelect={handleRowSelected}
              onDeleteInvoice={onDeleteInvoice}
              onDownloadInvoice={handleInvoiceDownload}
              proformaInvoices={invoiceData}
              isUsedInInvoiceModule={false}
              gridLoading={gridLoading}
            />
          </div>

          <CreateProformaInvoiceModal
            isOpen={isCreateInvoiceModalOpen}
            onClose={() => setIsCreateInvoiceModalOpen(false)}
            account={account} // 👉 pass account if page is account-specific
             handleAddInvoice={refreshAllData}
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

export default AccountProformaInvoiceManagementList;
