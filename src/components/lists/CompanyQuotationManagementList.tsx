/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CompanyQuotationProps from "../../@types/company-quotation/CompanyQuotationProps";
import CompanyQuotationManagementListProps, {
  Modules,
} from "../../@types/List/CompanyQuotationManagementListProps";
import axiosClient from "../../axios-client/AxiosClient";
import { handleApiError } from "../../config/error/handleApiError";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import COLORS from "../../constants/Colors";
import MESSAGE from "../../constants/Messages";
import POST_API from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { useUserPreference } from "../../context/user/UserPreference";
import CompanyQuotationManagementAgGrid from "../ag-grid/CompanyQuotationManagementAgGrid";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import CustomDocumentPreviewComponent from "../custom-document-preview-component/CustomDocumentPreviewComponent";
import CustomDropdown from "../modals/leads/CustomDropdown";
import Button from "../ui/Button";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import DateRangePicker from "../ui/DateRangePicker";
import SearchInput from "../ui/SearchInput";
import LoadingPopUpAnimation from "../views/card/LoadingPopUpAnimation";
import QuotationIconSvg from "../quotation-builder/svg/QuotationIconSvg";

export const companyQuotationDataUrlSearchParamKey: string =
  "companyQuotationData";

function CompanyQuotationManagementList({
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  paginationData,
  quotaionData,
  isDataLoading = false,
  otherData,
  quotationStatus,
  handleSelectedQuotationStatus,
  handleAddQuotation,
  isUsedFor = Modules.QUOTATION_MODULE,
  leadStatusId,
}: CompanyQuotationManagementListProps) {
  const navigate = useNavigate();
  const { userPreference } = useUserPreference();
  const {
    userHasAccessToViewCompanyQuotation,
    userHasAccessToAddCompanyQuotation,
    userHasAccessToAddLeadQuotation,
    userHasAccessToAddAccountQuotation,
  } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showCompanyLogoPreview, setShowCompanyLogoPreview] = useState(false);
  const [quotationFileName, setQuotationFileName] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // for invoice modal open
  //   const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] =
  //     useState<boolean>(false);

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({
    dateRangeDropdownOptions,
    handleSearchOption,
  });

  const navigateToCompanyQuotation = (rowData: CompanyQuotationProps) => {
    // console.log(rowData);

    const path = ROUTES_URL.QUOTATION_CREATE_AND_DETAILS.replace(
      ":quotationId",
      String(rowData?.id)
      +`?other_id=${otherData?otherData.id:0}&quotation_type_id=${0}&isUsedFor=${isUsedFor}`,
    );

    navigate(path);
  };
  const handleRowClicked = (event: any) => {
    const rowData: CompanyQuotationProps = event.data;
    navigateToCompanyQuotation(rowData);
  };

  const handleSaveHeader = async () => {
    const quotationSearchParam= isUsedFor === Modules.LEAD_QUOTATION?`?other_id=${otherData.id}&quotation_type_id=${1}&isUsedFor=${isUsedFor}`: (isUsedFor === Modules.AMC_QUOTATION?`?other_id=${otherData.id}&quotation_type_id=${2}&isUsedFor=${isUsedFor}`:`other_id=${0}&quotation_type_id=${0}&isUsedFor=${isUsedFor}`);

    //demo part need to remove
    const path = ROUTES_URL.QUOTATION_CREATE_AND_DETAILS.replace(
            ":quotationId",
            String(0),
          )+quotationSearchParam;
          navigate(path);
  };

  const onDeleteQuotation = async (rowData: CompanyQuotationProps) => {
    console.log("Delete Quotation:", rowData);
    const postData = {
      company_id: loginStatus.companyId,
      id: rowData.id,
    //   quotation_date_string: rowData.quotationDate,
    //   valid_till_date_string: rowData.validTillDate,
      isactive: false,
      updatedby_id: loginStatus.id,
    };
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.UPDATE_COMPANY_QUOTATION,
        postData,
        {
          withCredentials: true,
        },
      );
      console.log(res.data);

      if (res.data.status) {
        toast.success(res.data.message);
        handleAddQuotation();
        // 🔄 Refresh latest data
        // getInvoices(new AbortController().signal);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuotationDownload = async (rowData: CompanyQuotationProps) => {
    setIsSubmitting(true);
    setQuotationFileName(rowData.quotationNumber);

    try {
      const response = await axiosClient.post(
        POST_API.PREVIEW_DOWNLOAD_COMPANY_QUOTATION_DOWNLOAD,
        {
          company_id: loginStatus.companyId,
          id:Number(rowData?.id),
          company_quotation_id: Number(rowData?.id),
          quotation_status_id: Number(rowData?.quotationStatusId),
          // company_quotation_type_id: 1,
          company_quotation_type_id: Number(rowData?.quotationTypeId),
          requestedby_id: loginStatus.id,
        },
        {
          responseType: "blob",
          withCredentials: true,
        },
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      console.log(response.data);

      const fileUrl = URL.createObjectURL(blob);

      setLogoPreview(fileUrl);
      setShowCompanyLogoPreview(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowSelected = (rowData: CompanyQuotationProps) => {
    navigateToCompanyQuotation(rowData);
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

  if (userHasAccessToViewCompanyQuotation) {
    const selectedDateName =
      dateRangeDropdownOptions.find(
        (o) => o.search_date_range_id === handleSearchOption.dateRangeId,
      )?.date_range || "Date Filter";

    return (
      <div
        className={`w-full  ${isUsedFor == Modules.QUOTATION_MODULE ? (userPreference.isLeftMenu?"pl-5":"pl-1" ): ""} gap-1`}
      >
        {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
        {/* 🔹 Header */}
        {isUsedFor == Modules.QUOTATION_MODULE ? (
          <div
            className={`sticky z-10 top-12 mt-1 p-1 flex items-center justify-between gap-3 text-sm 
              ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm mb-1.5 w-full`}
          >
            {/* LEFT */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* 🔹 Title */}
              {/* <ComponentHeaderAndLogo logo={File} headerText="Quotation" /> */}
              <div className="flex justify-center items-center gap-1 pr-3">
                {/* <Quote className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} /> */}
                <QuotationIconSvg
                  strokeWidth={2}
                  size={24}
                  className="text-blue-600"
                  showCurrency={true}
                />
                <span className="section-header-custom">Quotation</span>
              </div>
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
                  options={quotationStatus!}
                  onSelect={handleSelectedQuotationStatus}
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
                disabled={!userHasAccessToAddCompanyQuotation}
                onClick={() => {
                  if (!userHasAccessToAddCompanyQuotation) {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.COMPANY_QUOTATION.DENIED_ADD_ACCESS,
                    );
                    return;
                  }

                  const path = ROUTES_URL.QUOTATION_CREATE_AND_DETAILS.replace(
                    ":quotationId",
                    String(0),
                  );
                  navigate(path);
                }}
                // className={COLORS.ADD_BUTTON}
              >
                + Create Quotation
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`z-10 top-12 mt-1 flex items-center justify-between gap-3 text-sm 
          ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm mb-1.5 w-full`}
          >
            <div className="flex gap-1 items-center w-fit">
              <h3 className="table-header-custom rounded-t-md px-1 ">
                {`${isUsedFor === Modules.LEAD_QUOTATION ? "Lead Quotations" : isUsedFor === Modules.AMC_QUOTATION ? "AMC Quotations" : "Quotations"}`}
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
                  options={quotationStatus!}
                  onSelect={handleSelectedQuotationStatus}
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

                {/* Add Quotation */}
                <div className="flex gap-1 justify-end w-fit">
                  <Button
                    type="button"
                    disabled={!(isUsedFor === Modules.LEAD_QUOTATION?(userHasAccessToAddLeadQuotation ? leadStatusId !== 9 : false ):(isUsedFor === Modules.AMC_QUOTATION? userHasAccessToAddAccountQuotation :userHasAccessToAddCompanyQuotation))
                    }
                    onClick={() => {
                      if (!(isUsedFor === Modules.LEAD_QUOTATION?(userHasAccessToAddLeadQuotation ? leadStatusId !== 9 : false ):(isUsedFor === Modules.AMC_QUOTATION? userHasAccessToAddAccountQuotation :userHasAccessToAddCompanyQuotation))) {
                        toast.error(
                          isUsedFor === Modules.LEAD_QUOTATION?(leadStatusId !==9 ?
                          MESSAGE.MODULE_ACCESS.LEAD_QUOTATION
                            .DENIED_ADD_ACCESS:"Can't generate quotation for converted lead."):(isUsedFor === Modules.AMC_QUOTATION? MESSAGE.MODULE_ACCESS.ACCOUNT_QUOTATION.DENIED_ADD_ACCESS: MESSAGE.MODULE_ACCESS.COMPANY_QUOTATION.DENIED_ADD_ACCESS)
                        );
                        return;
                      }
                      handleSaveHeader();
                      // setIsCreateInvoiceModalOpen(true);
                    }}
                    className={COLORS.ADD_BUTTON}
                  >
                    +Generate Quotation
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
              fileName={quotationFileName}
              width={"60%"}
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
                ? `ag-theme-balham w-full ${
                    isUsedFor === Modules.QUOTATION_MODULE
                      ? "h-[calc(100vh-120px)]"
                      : isUsedFor === Modules.LEAD_QUOTATION
                        ? "h-[calc(40vh-100px)]"
                        : "h-[calc(50vh-120px)]"
                  }`
                : `ag-theme-balham w-full ${
                    isUsedFor === Modules.QUOTATION_MODULE
                      ? "h-[calc(100vh-120px)]"
                      : isUsedFor === Modules.LEAD_QUOTATION
                        ? "h-[calc(40vh-100px)]"
                        : "h-[calc(50vh-122px)]"
                  }`
            }
          >
            <CompanyQuotationManagementAgGrid
              handleRowClick={handleRowClicked}
              onRowSelect={handleRowSelected}
              onDeleteQuotation={onDeleteQuotation}
              onDownloadQuotation={handleQuotationDownload}
              quotations={quotaionData}
              isUsedInQuotationModule={false}
              isDataLoading={isDataLoading}
            />
          </div>

          {/* 🔹 Create Modal
          <GenerateInvoiceModal
            isOpen={isCreateInvoiceModalOpen}
            onClose={() => setIsCreateInvoiceModalOpen(false)}
            account={otherData}
            handleAddInvoice={handleAddQuotation}
          /> */}
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

export default CompanyQuotationManagementList;
