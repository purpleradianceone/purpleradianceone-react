/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { Product } from "../../../../@types/products/ProductsManagementProps";
import { useSearchFilterPaginationDateHandlers } from "../../../../config/hooks/usePaginationHandler";
import POST_API from "../../../../constants/PostApi";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import AccessDeniedPopup from "../../../views/not-found/AccessDeniedPage";
import ProductsManagementListLead from "./ProductManagementListLead";
import InterestType from "../../../../@types/lead-management/InterestType";
import LeadAssignedCompanyProduct from "../../../../@types/lead-management/LeadAssignedCompanyProduct";
import axiosClient from "../../../../axios-client/AxiosClient";
import { handleApiError } from "../../../../config/error/handleApiError";

function ProductManagementLead({
  // handleSelectedProductChange,
  AssignLeadId,
  interestTypeData,
  handleProductCheckboxChange,

  alreadyAssignedCompanyProduct, // these are already assigned products
}: {
  // handleSelectedProductChange : (product: number[]) =>void
  interestTypeData: InterestType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleProductCheckboxChange: (
    params: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  alreadyAssignedCompanyProduct: LeadAssignedCompanyProduct[];
  AssignLeadId: number;
}) {
  // getting the access rights of logged in user
  const { userHasAccessToViewProduct } = useUserAccessModules();
  // getting the logged in user credentials
  const { loginStatus } = useLoggedInUserContext();

  // boolean state to show the access denied pop up
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState<boolean>(false);

  // state to store the products
  const [productsData, setProductsData] = useState<Product[]>([]);
  
  // hook to handle pagination and search filters
  const {
    currentPage,
    currentPageData,
    pageSize,
    dateRangeId,
    concatDate,
    searchParameter,
    setCurrentPageData,
    handleDatePageIdChange,
    handleEndDateChange,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
    handleStartDateChange,
  } = useSearchFilterPaginationDateHandlers();

  const [leadId, setLeadId] = useState<number>(AssignLeadId);
  useEffect(() => {
    setLeadId(AssignLeadId);
  }, [AssignLeadId]);
  // const fetchCompanyProducts = async (signal : AbortSignal) => {
  //   if (userHasAccessToViewProduct) {
  //     const offset = (currentPage - 1) * pageSize;

  //     const effectiveDateRangeId =
  //       dateRangeId === 8 && !concatDate
  //         ? 0
  //         : dateRangeId;

  //     setAccessDeniedPopUpOpen(false);
  //     const getProductPostData = {
  //       company_id: loginStatus.companyId,
  //       lead_id : leadId,
  //       requestedby: loginStatus.id,
  //       limit: pageSize,
  //       offset: offset,
  //       isactive : true,
  //       search_company_specific_date_range_id: effectiveDateRangeId,
  //       search_parameter: searchParameter,
  //       search_parameter_date: concatDate,
  //     };

  //     try {
  //       const response = await axiosClient.post(
  //         POST_API.GET_COMPANY_PRODUCT_NOT_ASSIGNED_TO_LEAD,
  //         getProductPostData,
  //         {
  //           signal,
  //           withCredentials: true,
  //         }
  //       );

  //       if (response.data && response.status === STATUS_CODE.OK) {
  //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //         response.data.map((res : any) => {
  //           setProductsData((prev) => [
  //             ...prev,
  //             {
  //                count: res.count,
  //           id: res.id,
  //           companyId: res.company_id,
  //           productTypeId:res.product_type_id,
  //           productTypeName:res.product_type_name,
  //           defaultWarrantyIntervalTypeId:res.default_warranty_interval_type_id,
  //           defaultWarranty:res.default_warranty,
  //           defaultWarrantyName:res.default_warranty_name,
  //           defaultAmcCycleIntervalTypeId:res.default_amc_cycle_interval_type_id,
  //           defaultAmcCycle:res.default_amc_cycle,
  //           defaultAmcCycleName:res.default_amc_cycle_name,
  //           name: res.name,
  //           barcode: res.barcode,
  //           cost: res.cost,
  //           description: res.description,
  //           version:res.version,
  //           url:res.url,
  //           isActive: res.isactive,
  //           hsn: res.hsn,
  //           sac: res.sac,
  //           taxRate: res.tax_rate,
  //           validFrom: res.valid_from,
  //           createdBy: res.createdby,
  //           createdOn: res.createdon,
  //           unitId : res.unit_id,
  //           unitName : res.unit_name,
  //           unitNameInStock: res.unit_name_in_stock
  //             },
  //           ]);
  //         });

  //         if (response.data[0]?.count) {
  //           setTotalPages(
  //             Math.ceil(response.data[0].count / pageSize)
  //           );
  //         }
  //       }
  //     } catch (error) {
  //       handleApiError(error)
  //     }
  //   }
  // };


  /**
 * Fetches company products that are NOT assigned to a lead.
 *
 * This function:
 * - Applies pagination using `limit` and `offset`
 * - Handles date-range logic for custom date filters
 * - Updates product list and total pages state
 * - Supports request cancellation via AbortController
 *
 * @param signal AbortSignal used to cancel the API request
 *
 * @returns Promise<void>
 */
  const fetchCompanyProducts = async (signal: AbortSignal) => {
      // Guard clause: prevent API call if user lacks permission
    if (!userHasAccessToViewProduct) return;

    /**
   * Calculate pagination offset
   * Example: page 2 with pageSize 10 → offset = 10
   */
    const offset = (currentPage - 1) * pageSize;

     /**
   * Effective date range handling:
   * - When dateRangeId is `8` (custom range) and no date is selected,
   *   send `0` to backend to avoid invalid filtering
   */
    const effectiveDateRangeId =
      dateRangeId === 8 && !concatDate ? 0 : dateRangeId;

      // Reset access-denied popup before API call
    setAccessDeniedPopUpOpen(false);

     /**
   * Request payload for fetching company products
   */
    const getProductPostData = {
      company_id: loginStatus.companyId,
      lead_id: leadId,
      requestedby: loginStatus.id,
      limit: pageSize,
      offset,
      isactive: true,
      search_company_specific_date_range_id: effectiveDateRangeId,
      search_parameter: searchParameter,
      search_parameter_date: concatDate,
    };

    try {
       /**
     * API call to fetch products not assigned to the lead
     */
      const response = await axiosClient.post(
        POST_API.GET_COMPANY_PRODUCT_NOT_ASSIGNED_TO_LEAD,
        getProductPostData,
        {
          signal,
          withCredentials: true,
        }
      );

      /**
     * Validate response before processing
     */
      if (response.status === STATUS_CODE.OK && Array.isArray(response.data)) {
        setCurrentPageData({currentPage: currentPage, pageDataLength: response.data.length});

         /**
       * Map API response into UI-friendly product structure
       */
        const mappedProducts = response.data.map((res: any) => ({
          id: res.id,
          companyId: res.company_id,
          productTypeId: res.product_type_id,
          productTypeName: res.product_type_name,
          defaultWarrantyIntervalTypeId: res.default_warranty_interval_type_id,
          defaultWarranty: res.default_warranty,
          defaultWarrantyName: res.default_warranty_name,
          defaultAmcCycleIntervalTypeId: res.default_amc_cycle_interval_type_id,
          defaultAmcCycle: res.default_amc_cycle,
          defaultAmcCycleName: res.default_amc_cycle_name,
          name: res.name,
          barcode: res.barcode,
          cost: res.cost,
          description: res.description,
          version: res.version,
          url: res.url,
          isActive: res.isactive,
          hsn: res.hsn,
          sac: res.sac,
          taxRate: res.tax_rate,
          validFrom: res.valid_from,
          createdBy: res.createdby,
          createdOn: res.createdon,
          unitId: res.unit_id,
          unitName: res.unit_name,
          unitNameInStock: res.unit_name_in_stock,
        }));

        // Update products list state
        setProductsData(mappedProducts);
        
      }
    } catch (error) {
      /**
       * Centralized API error handling
       * Handles network errors, permission issues, and cancellations
       */
      handleApiError(error);
    }
  };

  /**
   * Effect to fetch company products whenever:
   * - Page size changes
   * - Current page changes
   * - Date range or search filters change
   *
   * Uses AbortController to:
   * - Cancel in-flight requests on dependency change
   * - Prevent memory leaks and stale updates
   */
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    // Trigger API call
    fetchCompanyProducts(signal);

    // Cleanup: abort request on unmount or dependency change
    return () => {
      controller.abort();
    };
  }, [pageSize, currentPage, dateRangeId, searchParameter, concatDate]);

  useEffect(() => {
    if (!userHasAccessToViewProduct) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewProduct]);

  return (
    <div className="w-full">
      {userHasAccessToViewProduct ? (
        <>
          <div>
            <ProductsManagementListLead
              handleProductCheckboxChange={handleProductCheckboxChange}
              onEndDateChange={handleEndDateChange}
              onStartDateChange={handleStartDateChange}
              handleSearchOption={{
                handleSearchParameterChange,
                handleDateRangeIdChange: handleDatePageIdChange,
              }}
              paginationData={{
                pageSize,
                currentPage,
                currentPageData,
                onPageSizeChange: handlePageSizeChange,
                onPageChange:handlePageChange,
              }}
              products={productsData}
              // handleSelectedProductChange={handleSelectedProductChange}
              interestTypeData={interestTypeData}
              alreadyAssignedCompanyProduct={alreadyAssignedCompanyProduct}
            />
          </div>
        </>
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
    </div>
  );
}

export default ProductManagementLead;
