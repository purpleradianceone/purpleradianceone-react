import { sanitizeToXhtml } from "../../utils/dom-purifier/sanitizeToXhtml";
import Button from "../ui/Button";
import axiosClient from "../../axios-client/AxiosClient";
import { handleApiError } from "../../config/error/handleApiError";
import { useUserPreference } from "../../context/user/UserPreference";
import { useNavigate } from "react-router-dom";
import { LucideConstruction, Quote } from "lucide-react";
import { SIZE } from "../../constants/AppConstants";
import MESSAGE from "../../constants/Messages";
import toast from "react-hot-toast";
import COLORS from "../../constants/Colors";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import SearchInput from "../ui/SearchInput";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import { useEffect, useState } from "react";
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

export const QuotationPage: React.FC = () => {
  const { userPreference } = useUserPreference();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
  const {
    userHasAccessToViewQuotationTemplate,
    userHasAccessToAddQuotationTemplate,
  } = useUserAccessModules();

  const navigate = useNavigate();

  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  const {
    dateRangeId,
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

  const handleQuotationPdf = async () => {
    try {
      const payload = {
        quotationId: "QT-2026-0001",
        currency: "INR",
        pages: [
          {
            pageNo: 1,
            pageType: "QUOTATION",
            includeHeader: true,
            includeFooter: false,
            headerTemplate: "base_template_quotation/headers/quotation-header",
            footerTemplate: "base_template_quotation/footers/quotation-footer",
            contentHtml: sanitizeToXhtml(
              "<div>" +
                "<h2 style='text-align:center;'>Quotation</h2>" +
                "<p>Quotation introduction content.</p>" +
                "</div>",
            ),
            companyName: "ABC Pvt Ltd",
            companyAddress: "Pune, India",
            companyGstin: "27ABCDE1234F1Z5",
            companyLogoUrl:
              "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
            signatureImageUrl:
              "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
          },

          {
            pageNo: 2,
            pageType: "QUOTATION_ITEMS",
            includeHeader: false,
            includeFooter: false,
            headerTemplate: "base_template_quotation/headers/quotation-header",
            footerTemplate: "base_template_quotation/footers/quotation-footer",
            contentHtml: sanitizeToXhtml(
              "<div>" +
                "<h3>Items</h3>" +
                "<table style='width:100%; border-collapse:collapse;' cellpadding='0' cellspacing='0'>" +
                "<thead>" +
                "<tr>" +
                "<th style='border:1px solid #000; padding:6px;'>Sr. No.</th>" +
                "<th style='border:1px solid #000; padding:6px;'>Name</th>" +
                "<th style='border:1px solid #000; padding:6px;'>Qty</th>" +
                "<th style='border:1px solid #000; padding:6px;'>Price</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr>" +
                "<td style='border:1px solid #000; padding:6px;'>1</td>" +
                "<td style='border:1px solid #000; padding:6px;'>CRM License</td>" +
                "<td style='border:1px solid #000; padding:6px;'>2</td>" +
                "<td style='border:1px solid #000; padding:6px;'>&#8377;10,000</td>" +
                "</tr>" +
                "</tbody>" +
                "</table>" +
                "</div>",
            ),
            companyName: "ABC Pvt Ltd",
            companyAddress: "Pune, India",
            companyGstin: "27ABCDE1234F1Z5",
            companyLogoUrl:
              "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
            signatureImageUrl:
              "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
          },

          {
            pageNo: 3,
            pageType: "TERMS",
            includeHeader: false,
            includeFooter: true,
            headerTemplate: "base_template_quotation/headers/quotation-header",
            footerTemplate: "base_template_quotation/footers/quotation-footer",
            contentHtml: sanitizeToXhtml(
              "<div>" +
                "<h3>Terms &amp; Conditions</h3>" +
                "<ol>" +
                "<li>Valid for 30 days</li>" +
                "<li>GST applicable</li>" +
                "</ol>" +
                "</div>",
            ),
            companyName: "ABC Pvt Ltd",
            companyAddress: "Pune, India",
            companyGstin: "27ABCDE1234F1Z5",
            companyLogoUrl:
              "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
            signatureImageUrl:
              "https://purpleradiance.com/wp-content/uploads/2016/09/logo-1.png",
          },
        ],
      };

      const response = await axiosClient.post(
        POST_API.DEMO_QUOTATION_PDF,
        payload,
        {
          responseType: "blob",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${payload.quotationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to generate quotation PDF", error);
      handleApiError(error);
    }
  };

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
            <Quote className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} />
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

        <div className="flex max-w-60 min-h-7 h-8">
          <Button
            type="submit"
            disabled={!userHasAccessToAddQuotationTemplate}
            onClick={(e) => {
              e.preventDefault();
              if (userHasAccessToAddQuotationTemplate) {
                navigate(ROUTES_URL.QUOTATION_SETTINGS_CREATE_Template);
              } else {
                toast.error(MESSAGE.ERROR.NOT_ATHORISED);
              }
            }}
          >
            <div className="flex items-center justify-center gap-1">
              <Quote size={SIZE.SIXTEEN} />
              <span>Create Quotation Template</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Popup in development */}
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full border">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 text-yellow-600 p-4 rounded-full">
              <LucideConstruction />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Under Development
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-6">
            This feature is currently under development. You can generate a demo
            quotation template PDF for preview purposes.
          </p>

          {/* Button */}
          <Button onClick={handleQuotationPdf} className="w-full">
            Generate Demo Quotation
          </Button>

          {/* Footer Note */}
          <p className="text-xs text-gray-400 mt-4">
            🚧 Feature is in development phase
          </p>
        </div>
      </div>
    </div>
  );
};
