/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CompanyQuotationProps from "../../../@types/company-quotation/CompanyQuotationProps";
import { Modules } from "../../../@types/List/CompanyQuotationManagementListProps";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import useInvoiceStatus from "../../../config/hooks/useInvoiceStatus";
import { customDateRangeId, useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import { STATUS_CODE } from "../../../constants/AppConstants";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import CompanyQuotationManagementList from "../../lists/CompanyQuotationManagementList";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";


function CompanyQuotationManagement({
  otherData,
  isUsedFor = Modules.QUOTATION_MODULE,
}: {
  otherData: any | null;
  isUsedFor?: Modules;
}) {
  //   console.log(account);

  const { userHasAccessToViewCompanyQuotation } = useUserAccessModules();
  const { invoiceStatus } = useInvoiceStatus();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [isLoadingForCompanyQuotation, setIsLoadingForCompanyQuotation] = useState<boolean>(false);
  const [companyQuotationData, setCompanyQuotationeData] = useState<CompanyQuotationProps[]>([]);
  const { loginStatus } = useLoggedInUserContext();

  const [companyQuotationUpdateCount, setCompanyQuotationUpdateCount] = useState<number>(0);

  // Load filters
  const savedFilters = JSON.parse(
    localStorage.getItem(LocalStorageKeys.COMPANY_QUOTATION_MANAGEMENT_FILTERS) || "{}",
  );
  const [selectedCompanyQuotationStatus, setSelectedCompanyQuotationStatus] = useState<number | undefined>(savedFilters.selectedCompanyQuotationStatus);
  const [selectedCompanyQuotationType, setSelectedCompanyQuotationType] = useState<any | undefined>(savedFilters.selectedCompanyQuotationType);

  const {
    currentPage,
    currentPageData,
    pageSize,
    dateRangeId,
    concatDate,
    startDate,
    endDate,
    searchParameter,
    handleDatePageIdChange,
    handleEndDateChange,
    setCurrentPageData,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
    handleStartDateChange,
  } = useSearchFilterPaginationDateHandlers(savedFilters);

  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const getCompanyQuotation = async (signal: AbortSignal) => {
    if (dateRangeId === customDateRangeId && concatDate.trim() === "") return;

    const offset = (currentPage - 1) * pageSize;

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      quotation_type_id: isUsedFor === Modules.LEAD_QUOTATION?1:(isUsedFor === Modules.AMC_QUOTATION?2:selectedCompanyQuotationType?selectedCompanyQuotationType.id:null ),
      other_id: otherData?otherData.id:null,
      search_company_specific_date_range_id: dateRangeId === 0 ? null : dateRangeId,
      limit: pageSize,
      offset,
      search_parameter: searchParameter.trim() || null,
      search_parameter_date: concatDate,
      requestedby_id: loginStatus.id,
    };

    try {
      if (postData.company_id === 0 || pageSize === 10) return;
      setIsLoadingForCompanyQuotation(true);
      const response = await axiosClient.post(POST_API.GET_COMPANY_QUOTATION, postData, {
        signal,
        withCredentials: true,
      });

      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;
        setCurrentPageData({
          currentPage,
          pageDataLength: responseData.length,
        });
        console.log(response.data);

        const formattedData: CompanyQuotationProps[] = responseData.map(
          (item: any) => ({
            id: item.id,
            // companyId: item.company_id,
            quotationStatusId: item.quotation_status_id,
            quotationStatusName: item.quotation_status_name,
            quotationTypeId: item.quotation_type_id,
            quotationTypeName: item.quotation_type_name,
            otherId: item.other_id,
            quotationTemplateId: item.quotation_template_id,
            quotationNumber: item.quotation_number,
            otherDetail: item.other_detail,
            quotationDate: item.quotation_date,
            validTillDate: item.valid_till_date,
           
            basicValue: item.basic_value,
            discountAmount: item.discount_amount,
            taxableValue: item.taxable_value,
            totalTax: item.total_tax,
            totalAmount: item.total_amount,
            adjustmentForRoundOff: item.adjustment_for_round_off,
            companyQuotationFileExtension: item.company_quotation_file_extension,
            companyQuotationOriginUrl: item.company_quotation_origin_url,
            companyQuotationCdnUrl: item.company_quotation_cdn_url,

            templateSnapshot: JSON.parse( item.template_snapshot) as Record<string, string | null>,

            isActive: item.isactive,
            createdBy: item.createdby,
            createdOn: item.createdon,
            updatedBy: item.updatedby,
            updatedOn: item.updatedon,
          }),
        );
        setCompanyQuotationeData(formattedData);
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsLoadingForCompanyQuotation(false);
    }
  };

  const handleAddCompanyQuotation = () => {
    setCompanyQuotationUpdateCount(companyQuotationUpdateCount + 1);
  };

  // 🔁 API TRIGGER
  useEffect(() => {
    const controller = new AbortController();
    getCompanyQuotation(controller.signal);

    return () => controller.abort();
  }, [
    companyQuotationUpdateCount,
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    selectedCompanyQuotationStatus,
    selectedCompanyQuotationType,
  ]);

  useEffect(() => {
    if (!userHasAccessToViewCompanyQuotation) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewCompanyQuotation]);

  useEffect(() => {
    const filters = {
      page: currentPage,
      size: pageSize,
      search: searchParameter,
      dateRangeId,
      concatDate,
      customStartDate: startDate,
      customEndDate: endDate,
      selectedCompanyQuotationStatus,
      selectedCompanyQuotationType,
    };

    localStorage.setItem(
      LocalStorageKeys.COMPANY_QUOTATION_MANAGEMENT_FILTERS,
      JSON.stringify(filters),
    );
  }, [
    currentPage,
    pageSize,
    searchParameter,
    dateRangeId,
    concatDate,
    startDate,
    endDate,
    selectedCompanyQuotationStatus,
    selectedCompanyQuotationType,
  ]);

  useEffect(() => {
    window.addEventListener("beforeunload", clearFilters);

    function clearFilters() {
      localStorage.removeItem(LocalStorageKeys.COMPANY_QUOTATION_MANAGEMENT_FILTERS);
    }

    return () => window.removeEventListener("beforeunload", clearFilters);
  }, []);

  return (
    <div className="w-full">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {userHasAccessToViewCompanyQuotation ? (
          <CompanyQuotationManagementList
            handleAddQuotation={handleAddCompanyQuotation}
            handleSearchOption={{
              handleSearchParameterChange,
              handleDateRangeIdChange: handleDatePageIdChange,
              dateRangeId,
              startDate,
              endDate,
              searchParameter,
              selectedCompanyQuotationStatus,
              selectedCompanyQuotationType,
            }}
            quotaionData={companyQuotationData}
            isDataLoading={isLoadingForCompanyQuotation}
            onEndDateChange={handleEndDateChange}
            onStartDateChange={handleStartDateChange}
            paginationData={{
              pageSize,
              currentPage,
              currentPageData,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
            otherData={otherData}
            quotationStatus={invoiceStatus}
            handleSelectedQuotationStatus={(selectedStatus: number | undefined) =>
              setSelectedCompanyQuotationStatus(selectedStatus)
            }
            handleSelectedQuotationType={(value)=>
              setSelectedCompanyQuotationType(value)
            }
            isUsedFor={isUsedFor}
            leadStatusId={otherData?otherData.leadStatusId:0}
          />
        ) : (
          <div className="flex-none mx-96 mt-14">
            <AccessDeniedPopup
              isOpen={accessDeniedPopUpOpen}
              onClose={() => {
                setAccessDeniedPopUpOpen(false);
                window.history.back();
              }}
            />
          </div>
        )}
      </motion.section>
    </div>
  );
}

export default CompanyQuotationManagement;
