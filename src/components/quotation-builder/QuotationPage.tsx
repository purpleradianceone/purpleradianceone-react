/* eslint-disable react-hooks/exhaustive-deps */
import Button from "../ui/Button";
import axiosClient from "../../axios-client/AxiosClient";
import { handleApiError } from "../../config/error/handleApiError";
import { useUserPreference } from "../../context/user/UserPreference";
import { useNavigate } from "react-router-dom";
import { STATUS_CODE } from "../../constants/AppConstants";
import MESSAGE from "../../constants/Messages";
import toast from "react-hot-toast";
import COLORS from "../../constants/Colors";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import SearchInput from "../ui/SearchInput";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  customDateRangeId,
  useSearchFilterPaginationDateHandlers,
} from "../../config/hooks/usePaginationHandler";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import DateRangePicker from "../ui/DateRangePicker";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import ROUTES_URL from "../../constants/Routes";
import AccessDeniedPopup from "../views/not-found/AccessDeniedPage";
import POST_API from "../../constants/PostApi";
import { QuotationTemplateList } from "./quotation-template-list/QuotationTemplateList";
import QuotationTemplate from "./quotation-template-types/QuotationTemplate";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import RefreshToken from "../../config/validations/RefreshToken";
import QuotationIconSvg from "./svg/QuotationIconSvg";
import {
  FOOTER_STORAGE_KEY_UPDATE,
  HEADER_STORAGE_KEY_UPDATE,
  PAGE_BLOCK_LAYOUT_UPDATE,
  STORAGE_KEY_UPDATE,
} from "./local-storage/LocalStorageKeys";

export const QuotationPage: React.FC = () => {
  const { userPreference } = useUserPreference();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
  const {
    userHasAccessToViewQuotationTemplate,
    userHasAccessToAddQuotationTemplate,
  } = useUserAccessModules();

  const navigate = useNavigate();

  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  const [
    loadingTemplatePage,
    // setLoadingTemplatesPage
  ] = useState<boolean>(false);

  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false);
  const [templates, setTemplates] = useState<QuotationTemplate[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [hasMoreTemplates, setHasMoreTemplates] = useState(true);
  const { loginStatus } = useLoggedInUserContext();
  const limit: number = 10;
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    dateRangeId,
    concatDate,
    startDate,
    endDate,
    searchParameter,
    handleDatePageIdChange,
    handleEndDateChange,
    handleSearchParameterChange,
    handleStartDateChange,
  } = useSearchFilterPaginationDateHandlers();

  const selectedDateName =
    dateRangeDropdownOptions.find((o) => o.search_date_range_id === dateRangeId)
      ?.date_range || "Date Filter";

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({
    dateRangeDropdownOptions,
    handleSearchOption: {
      handleDateRangeIdChange: handleDatePageIdChange,
    },
  });

  useEffect(() => {
    if (!userHasAccessToViewQuotationTemplate) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewQuotationTemplate]);

  useEffect(() => {
    if (dateRangeId === customDateRangeId) {
      setIsCustomDateOptionSelected(true);
    }
  }, [searchParameter, dateRangeId, setIsCustomDateOptionSelected]);

  useEffect(() => {
    if (loginStatus.companyId !== 0) {
      setTemplates([]);
      setOffset(0);
      setHasMoreTemplates(true);
      getTemplatesOfCompany({ reset: true });
    }
  }, [dateRangeId, concatDate, searchParameter]);

  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY_UPDATE + loginStatus.id);
    localStorage.removeItem(PAGE_BLOCK_LAYOUT_UPDATE + loginStatus.id);
    localStorage.removeItem(HEADER_STORAGE_KEY_UPDATE + loginStatus.id);
    localStorage.removeItem(FOOTER_STORAGE_KEY_UPDATE + loginStatus.id);
  }, []);

  // const handleDemoQuotationPdf = async () => {
  //   try {
  //     const payload = {
  //       quotationId: "QT-2026-0001",
  //       currency: "INR",
  //       pages: [
  //         {
  //           pageNo: 1,
  //           pageType: "QUOTATION",
  //           includeHeader: true,
  //           includeFooter: false,
  //           headerTemplate: "base_template_quotation/headers/quotation-header",
  //           // headerTemplate: "<div> <div>Demo header </div> <hr/></div>",
  //           footerTemplate: "base_template_quotation/footers/quotation-footer",
  //           contentHtml: sanitizeToXhtml(
  //             "<div>" +
  //               "<h2 style='text-align:center;'>Quotation</h2>" +
  //               "<p>Quotation introduction content.</p>" +
  //               "</div>",
  //           ),
  //           companyName: "ABC Pvt Ltd",
  //           companyAddress: "Pune, India",
  //           companyGstin: "27ABCDE1234F1Z5",
  //           companyLogoUrl:
  //             "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
  //           signatureImageUrl:
  //             "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
  //         },

  //         {
  //           pageNo: 2,
  //           pageType: "QUOTATION_ITEMS",
  //           includeHeader: false,
  //           includeFooter: false,
  //           headerTemplate: "base_template_quotation/headers/quotation-header",
  //           footerTemplate: "base_template_quotation/footers/quotation-footer",
  //           contentHtml: sanitizeToXhtml(
  //             "<div>" +
  //               "<h3>Items</h3>" +
  //               "<table style='width:100%; border-collapse:collapse;' cellpadding='0' cellspacing='0'>" +
  //               "<thead>" +
  //               "<tr>" +
  //               "<th style='border:1px solid #000; padding:6px;'>Sr. No.</th>" +
  //               "<th style='border:1px solid #000; padding:6px;'>Name</th>" +
  //               "<th style='border:1px solid #000; padding:6px;'>Qty</th>" +
  //               "<th style='border:1px solid #000; padding:6px;'>Price</th>" +
  //               "</tr>" +
  //               "</thead>" +
  //               "<tbody>" +
  //               "<tr>" +
  //               "<td style='border:1px solid #000; padding:6px;'>1</td>" +
  //               "<td style='border:1px solid #000; padding:6px;'>CRM License</td>" +
  //               "<td style='border:1px solid #000; padding:6px;'>2</td>" +
  //               "<td style='border:1px solid #000; padding:6px;'>&#8377;10,000</td>" +
  //               "</tr>" +
  //               "</tbody>" +
  //               "</table>" +
  //               "</div>",
  //           ),
  //           companyName: "ABC Pvt Ltd",
  //           companyAddress: "Pune, India",
  //           companyGstin: "27ABCDE1234F1Z5",
  //           companyLogoUrl:
  //             "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
  //           signatureImageUrl:
  //             "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
  //         },

  //         {
  //           pageNo: 3,
  //           pageType: "TERMS",
  //           includeHeader: false,
  //           includeFooter: true,
  //           headerTemplate: "base_template_quotation/headers/quotation-header",
  //           footerTemplate: "base_template_quotation/footers/quotation-footer",
  //           contentHtml: sanitizeToXhtml(
  //             "<div>" +
  //               "<h3>Terms &amp; Conditions</h3>" +
  //               "<ol>" +
  //               "<li>Valid for 30 days</li>" +
  //               "<li>GST applicable</li>" +
  //               "</ol>" +
  //               "</div>",
  //           ),
  //           companyName: "ABC Pvt Ltd",
  //           companyAddress: "Pune, India",
  //           companyGstin: "27ABCDE1234F1Z5",
  //           companyLogoUrl:
  //             "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
  //           signatureImageUrl:
  //             "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
  //         },
  //       ],
  //     };

  //     const response = await axiosClient.post(
  //       POST_API.DEMO_QUOTATION_PDF,
  //       payload,
  //       {
  //         responseType: "blob",
  //         headers: { "Content-Type": "application/json" },
  //         withCredentials: true,
  //       },
  //     );

  //     const pdfBlob = new Blob([response.data], {
  //       type: "application/pdf",
  //     });

  //     const url = window.URL.createObjectURL(pdfBlob);
  //     window.open(url);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `${payload.quotationId}.pdf`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   } catch (error) {
  //     console.error("Failed to generate quotation PDF", error);
  //     handleApiError(error);
  //   }
  // };



  // const handleQuotationPdfGeneration = async () => {
  //   try {
  //     const payload = {
  //       quotationId: "QT-2026-0001",
  //       quotation_template_id: 3,
  //       company_id: loginStatus.companyId,
  //       generatedby_id: loginStatus.id,
  //       quotation_account: {
  //         id: 101,
  //         company_id: 1,
  //         name: "TechNova Solutions Pvt Ltd",
  //         email: "contact@technova.com",
  //         mobilenumber: "9876543210",
  //         industry_type_id: 3,
  //         industry_type_name: "Information Technology",
  //         business_type_id: 2,
  //         business_type_name: "Private Limited",
  //         country_id: 101,
  //         state_id: 27,
  //         district_id: 501,
  //         country_name: "India",
  //         state_name: "Maharashtra",
  //         district_name: "Pune",
  //         pan: "ABCDE1234F",
  //         gst: "27ABCDE1234F1Z5",
  //         tan: "PNEA12345B",
  //         billing_address: "Office No. 12, Hinjewadi Phase 1, Pune - 411057",
  //         shipping_address: "Warehouse 5, MIDC, Pune - 411018",
  //         registered_office_address: "TechNova HQ, Baner Road, Pune - 411045",
  //         business_registration_number: "U12345MH2020PTC123456",
  //         website: "https://www.technova.com",
  //         isactive: true,
  //         createdby: "admin@technova.com",
  //         createdon: "2026-03-23T10:30:00",
  //         requestedby: 45,
  //         lead_id: 789,
  //         company_account_type_id_array: [1, 2, 4],
  //         createdby_id: 10,
  //         updatedby_id: 12,
  //       },
  //       quotation_items: [
  //         {
  //           productName: "Laptop Dell Inspiron 15",
  //           quantity: 2,
  //           unitPrice: 55000.0,
  //           discountPercent: 10.0,
  //           gstPercent: 18.0,
  //           cgstPercent: 9.0,
  //           lineSubTotal: 99000.0,
  //         },
  //         {
  //           productName: "Wireless Mouse Logitech M235",
  //           quantity: 5,
  //           unitPrice: 800.0,
  //           discountPercent: 5.0,
  //           gstPercent: 18.0,
  //           cgstPercent: 9.0,
  //           lineSubTotal: 3800.0,
  //         },
  //         {
  //           productName: "Office Chair Ergonomic",
  //           quantity: 3,
  //           unitPrice: 7000.0,
  //           discountPercent: 15.0,
  //           gstPercent: 18.0,
  //           cgstPercent: 9.0,
  //           lineSubTotal: 17850.0,
  //         },
  //       ],
  //     };

  //     const response = await axiosClient.post(
  //       POST_API.QUOTATION_PDF_GENERATION,
  //       payload,
  //       {
  //         responseType: "blob",
  //         headers: { "Content-Type": "application/json" },
  //         withCredentials: true,
  //       },
  //     );

  //     const pdfBlob = new Blob([response.data], {
  //       type: "application/pdf",
  //     });

  //     const url = window.URL.createObjectURL(pdfBlob);
  //     window.open(url);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `${payload.quotationId}.pdf`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //   } catch (error) {
  //     console.error("Failed to generate quotation PDF", error);
  //     handleApiError(error);
  //   }
  // };

  function refresh() {
    getTemplatesOfCompany({ reset: true });
  }

  const getTemplatesOfCompany = useCallback(
    async ({ reset = false }: { reset?: boolean }) => {
      if (loginStatus.companyId === 0) return;
      if (dateRangeId === customDateRangeId && concatDate.trim() === "") return;
      // We use a functional update for setOffset to get the latest value
      // and avoid including 'offset' in useCallback dependencies.
      setLoadingTemplates(true); // Set loading state for templates

      try {
        setOffset(reset ? 0 : offset);
        // Get the current offset using a ref or state that's not in useCallback deps
        // For this case, it's okay to read `offset` from state as it's only modified after fetch
        // or set to 0 by the calling useEffect for reset.
        const currentOffset = reset ? 0 : offset;

        const response = await axiosClient.post(
          POST_API.GET_QUOTATION_TEMPLATE,
          {
            company_id: loginStatus.companyId,
            requestedby_id: loginStatus.id,
            id: null,
            search_company_specific_date_range_id:
              dateRangeId === 0 ? null : dateRangeId,
            search_parameter: searchParameter,
            search_parameter_date: concatDate,
            offset: currentOffset,
            limit,
          },
          { withCredentials: true },
        );

        if (response.status === STATUS_CODE.OK) {
          const newTemplates = response.data;
          setHasMoreTemplates(newTemplates.length === limit);
          const newOffset: number = currentOffset + limit;
          setOffset(newOffset);
          setTemplates((prev) =>
            reset ? newTemplates : [...prev, ...newTemplates],
          );
        } else {
          setHasMoreTemplates(false);
        }
        if (response.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithTwoParamsNotEvent: getTemplatesOfCompany,
          });
          if (refreshTokenResponse) {
            getTemplatesOfCompany({ reset });
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setHasMoreTemplates(false);
        handleApiError(error);
      } finally {
        setLoadingTemplates(false);
      }
    },
    [
      offset,
      hasMoreTemplates,
      loginStatus.companyId,
      loginStatus.id,
      dateRangeId,
      searchParameter,
      concatDate,
      limit,
    ],
  );

  if (!userHasAccessToViewQuotationTemplate)
    return (
      <div className="flex-none mx-96 mt-14">
        <AccessDeniedPopup
          isOpen={accessDeniedPopUpOpen}
          onClose={() => {
            setAccessDeniedPopUpOpen(false);
            window.history.back();
          }}
        />
      </div>
    );

  return (
    <div
      className={`w-full pt-1 ${
        userPreference.isLeftMenu ? "pl-5" : "px-1"
      }  gap-1 h-screen flex flex-col `}
    >
      {/* Header */}
      <div
        className={`sticky z-10 top-12 mt-1 p-1 flex items-center justify-between gap-2 text-sm ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm mb-1.5 
                      w-full
                    `}
      >
        <div className="flex justify-start items-center w-fit gap-5">
          <div className="flex justify-center items-center gap-1">
            {/* <Quote className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} /> */}
            <QuotationIconSvg
              strokeWidth={2}
              size={24}
              className="text-blue-600"
              showCurrency={true}
            />
            <span className="section-header-custom">Quotation Template</span>
          </div>

          <div className="flex gap-2">
            {/* search box flex div */}
            <div
              className={`flex ${
                isCustomDateOptionSelected ? "w-48 h-5" : "w-64 h-5"
              } `}
            >
              <SearchInput
                onChange={(e) => {
                  handleSearchParameterChange(e.target.value);
                }}
              ></SearchInput>
            </div>
            {/* Date FIlters Dropdown */}
            <div className="flex w-fit gap-2">
              <div className="flex">
                <DateRangeFilterDropdown
                  dropdownOptions={dateRangeDropdownOptions}
                  handleDateIdChange={handleDateRangeIdChange}
                  selectedOption={selectedDateName}
                ></DateRangeFilterDropdown>
              </div>

              {/* Custom Date Picker Div Flex Box*/}
              {isCustomDateOptionSelected && (
                <div
                  style={
                    isCustomDateOptionSelected
                      ? { visibility: "visible" }
                      : { visibility: "hidden" }
                  }
                >
                  <DateRangePicker
                    onStartDateChange={handleStartDateChange}
                    onEndDateChange={handleEndDateChange}
                    initialStartDate={startDate}
                    initialEndDate={endDate}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex max-w-fit min-h-7 h-8">
          <div>
            <Button
              type="submit"
              disabled={!userHasAccessToAddQuotationTemplate}
              onClick={(e) => {
                e.preventDefault();
                if (userHasAccessToAddQuotationTemplate) {
                  navigate(ROUTES_URL.QUOTATION_SETTINGS_CREATE_TEMPLATE);
                } else {
                  toast.error(MESSAGE.ERROR.NOT_ATHORISED);
                }
              }}
            >
              <div className="flex items-center justify-center gap-1">
                {/* <Quote size={SIZE.SIXTEEN} /> */}
                <QuotationIconSvg
                  strokeWidth={2}
                  size={16}
                  className="text-white"
                  showCurrency={true}
                />
                <span>Create Quotation Template</span>
              </div>
            </Button>
          </div>
          {/* <div>
            <Button type="button" onClick={handleDemoQuotationPdf}>
              Demo Quotation Preview
            </Button>
          </div> */}
          {/* <div>
            <Button type="button" onClick={handleQuotationPdfGeneration}>
              Quotation Generation
            </Button>
          </div> */}
        </div>
      </div>

      {/* Popup in development */}
      <div className="flex items-center justify-center">
        {/* Main Content Area */}
        {loadingTemplatePage ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="flex w-full justify-start">
            <div className="flex-1 overflow-x-auto" ref={containerRef}>
              <QuotationTemplateList
                templates={templates}
                loading={loadingTemplates}
                hasmore={hasMoreTemplates}
                reset={refresh}
              />
            </div>
          </div>
        )}

        {/* <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full border">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 text-yellow-600 p-4 rounded-full">
              <LucideConstruction />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Under Development
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            This feature is currently under development. You can generate a demo
            quotation template PDF for preview purposes.
          </p>

          <Button onClick={handleQuotationPdf} className="w-full">
            Generate Demo Quotation
          </Button>

          <p className="text-xs text-gray-400 mt-4">
            🚧 Feature is in development phase
          </p>
        </div> */}
      </div>
    </div>
  );
};
