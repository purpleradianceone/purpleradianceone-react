/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { LookupAccount } from "../../../@types/lookup/LookupAccount";
import LookupCompanyProduct from "../../../@types/lookup/LookupCompanyProduct";
import CompanyProductSaleProps from "../../../@types/products/CompanyProductSaleProps";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import {
  customDateRangeId,
  useSearchFilterPaginationDateHandlers,
} from "../../../config/hooks/usePaginationHandler";
import { STATUS_CODE } from "../../../constants/AppConstants";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import CompanyProductSaleManagementList from "../../lists/CompanyProductSaleManagementList";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";

function CompanyProductSaleManagement({
  isUsedForProductSaleModule = true,
}: {
  isUsedForProductSaleModule?: boolean;
}) {
  //   console.log(account);

  const { userHasAccessToViewCompanyProductSale } = useUserAccessModules();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [isLoadingForCompanyProductSale, setIsLoadingForCompanyProductSale] =
    useState<boolean>(false);
  const [companyProductSaleData, setCompanyProdctSaleData] = useState<
    CompanyProductSaleProps[]
  >([]);
  const { loginStatus } = useLoggedInUserContext();

  //   const [companyQuotationUpdateCount, setCompanyQuotationUpdateCount] =
  //     useState<number>(0);

  // Load filters
  const savedFilters = JSON.parse(
    localStorage.getItem(
      LocalStorageKeys.COMPANY_PRODUCT_SALE_MANAGEMENT_FILTERS,
    ) || "{}",
  );

  const [companyProductSaleState, setCompanyProductSaleState] = useState<{
    selectedAccount: LookupAccount | null;
    selectedCompanyProduct: LookupCompanyProduct | null;
    selectedProductTypeId: number | undefined;
  }>(
    savedFilters.companyProductSaleState || {
      selectedAccount: null,
      selectedCompanyProduct: null,
      selectedProductTypeId: undefined,
    },
  );

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

  const getCompanyProductSale = async (signal: AbortSignal) => {
    if (dateRangeId === customDateRangeId && concatDate.trim() === "") return;

    const offset = (currentPage - 1) * pageSize;

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      account_id: companyProductSaleState.selectedAccount?.id,
      company_product_id: companyProductSaleState.selectedCompanyProduct?.id,
      product_type_id: companyProductSaleState.selectedProductTypeId,
      search_company_specific_date_range_id:
        dateRangeId === 0 ? null : dateRangeId,
      limit: pageSize,
      offset,
      search_parameter: searchParameter.trim() || null,
      search_parameter_date: concatDate,
      requestedby_id: loginStatus.id,
    };

    try {
      if (postData.company_id === 0 || pageSize === 10) return;
      setIsLoadingForCompanyProductSale(true);
      const response = await axiosClient.post(
        POST_API.GET_COMPANY_PRODUCT_SALE,
        postData,
        {
          signal,
          withCredentials: true,
        },
      );

      if (response.status === STATUS_CODE.OK) {
        const responseData = response.data;
        setCurrentPageData({
          currentPage,
          pageDataLength: responseData.length,
        });
        console.log(response.data);

        const formattedData: CompanyProductSaleProps[] = responseData.map(
          (item: any) => ({
            id: item.id,
            accountId: item.account_id,
            accountName: item.account_name,

            companyProductId: item.company_product_id,
            companyProductName: item.company_product_name,

            productTypeId: item.product_type_id,
            productTypeName: item.product_type_name,

            quantity: item.quantity,

            totalCost: item.total_cost,

            barcode: item.barcode,
            serialNumber: item.serial_number,

            isActive: item.isactive,
            createdBy: item.createdby,
            createdOn: item.createdon,
            updatedBy: item.updatedby,
            updatedOn: item.updatedon,
          }),
        );
        setCompanyProdctSaleData(formattedData);
      }
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setIsLoadingForCompanyProductSale(false);
    }
  };

  //   const handleAddCompanyQuotation = () => {
  //     setCompanyQuotationUpdateCount(companyQuotationUpdateCount + 1);
  //   };

  useEffect(() => {
    const controller = new AbortController();
    getCompanyProductSale(controller.signal);
    return () => controller.abort();
  }, [
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    companyProductSaleState,
  ]);

  useEffect(() => {
    if (!userHasAccessToViewCompanyProductSale) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewCompanyProductSale]);

  useEffect(() => {
    const filters = {
      page: currentPage,
      size: pageSize,
      search: searchParameter,
      dateRangeId,
      concatDate,
      customStartDate: startDate,
      customEndDate: endDate,
      companyProductSaleState,
    };

    localStorage.setItem(
      LocalStorageKeys.COMPANY_PRODUCT_SALE_MANAGEMENT_FILTERS,
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
    companyProductSaleState,
  ]);

  useEffect(() => {
    window.addEventListener("beforeunload", clearFilters);

    function clearFilters() {
      localStorage.removeItem(
        LocalStorageKeys.COMPANY_PRODUCT_SALE_MANAGEMENT_FILTERS,
      );
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
        {userHasAccessToViewCompanyProductSale ? (
          <CompanyProductSaleManagementList
            handleSearchOption={{
              handleSearchParameterChange,
              handleDateRangeIdChange: handleDatePageIdChange,
              dateRangeId,
              startDate,
              endDate,
              searchParameter,
              companyProductSaleState,
            }}
            handleSelectedAccountChange={(param) => {
              setCompanyProductSaleState((prev) => ({
                ...prev,
                selectedAccount: param,
              }));
            }}
            handleSelectedCompanyProductChange={(param) => {
              setCompanyProductSaleState((prev) => ({
                ...prev,
                selectedCompanyProduct: param,
              }));
            }}
            handleSelectedProductTypeChange={(param) => {
              setCompanyProductSaleState((prev) => ({
                ...prev,
                selectedProductTypeId: param,
              }));
            }}
            handleRowSelect={() => {}}
            companyProductSoldData={companyProductSaleData}
            isDataLoading={isLoadingForCompanyProductSale}
            onEndDateChange={handleEndDateChange}
            onStartDateChange={handleStartDateChange}
            paginationData={{
              pageSize,
              currentPage,
              currentPageData,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
            isUsedInProductSaleModule={isUsedForProductSaleModule}
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

export default CompanyProductSaleManagement;
