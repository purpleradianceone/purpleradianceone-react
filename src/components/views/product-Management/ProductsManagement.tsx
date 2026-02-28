/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { STATUS_CODE } from "../../../constants/AppConstants";
import ProductsManagementList from "../../lists/ProductsManagementsList";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import POST_API from "../../../constants/PostApi";
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { Product } from "../../../@types/products/ProductsManagementProps";
import RefreshToken from "../../../config/validations/RefreshToken";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import { customDateRangeId, useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";

function ProductManagement({
  isGridForAccountProduct,
  onRowSelect
}: {
  isGridForAccountProduct? : boolean;
   onRowSelect? : (data : any ) =>void,
}) {

   // Read filters from LocalStorage (before hook initializes)
const savedFilters = JSON.parse(
  localStorage.getItem(LocalStorageKeys.PRODUCT_MANAGEMEMNT_FILTERS) || "{}"
);
  // Restore saved filters when opening this module
      // useEffect(() => {
      //   const saved = localStorage.getItem(LocalStorageKeys.PRODUCT_MANAGEMEMNT_FILTERS);
      //   if (!saved) return;
    
      //   const filters = JSON.parse(saved);
    
      //   // Ensure URL & hook initialize first before restoring
      //   requestAnimationFrame(() => {
      //     if (filters.page) handlePageChange(filters.page);
      //     if (filters.size) handlePageSizeChange(filters.size);
      //     if (filters.search) handleSearchParameterChange(filters.search);
      //     if (filters.dateRangeId) handleDatePageIdChange(filters.dateRangeId);
      //     if(filters.customStartDate) handleStartDateChange(filters.customStartDate)
      //       if(filters.customEndDate) handleEndDateChange(filters.customEndDate)
         
      //   });
      // }, []);
  const { userHasAccessToViewProduct } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  const [productsData, setProductsData] = useState<Product[]>([]);
  const [productUpdateCount, setProductUpdateCount] = useState<number>(0);

  const {
    currentPage,
    currentPageData,
    pageSize,
    dateRangeId,
    concatDate,
    startDate,
    endDate,
    searchParameter,
    setCurrentPageData,
    handleDatePageIdChange,
    handleEndDateChange,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
    handleStartDateChange,
  } = useSearchFilterPaginationDateHandlers(savedFilters);

  const handleProductChangeOnAdd = () => {
      setProductUpdateCount((prev) => prev + 1);    
  };

  const handleEditProductChange = () => {
      setProductUpdateCount((prev) => prev + 1);

  };

  const handleCreateCompanyProductTax = () => {
      setProductUpdateCount((prev) => prev + 1);
  };

  const fetchCompanyProducts = async (signal : AbortSignal) => {
    if (dateRangeId === customDateRangeId && concatDate.trim() === "") return;
    if (userHasAccessToViewProduct || isGridForAccountProduct) {
      const offset = (currentPage - 1) * pageSize;

      const effectiveDateRangeId =
        dateRangeId === customDateRangeId && !concatDate ? 0 : dateRangeId;

      setProductsData([]);
      setAccessDeniedPopUpOpen(false);
      const getProductPostData = {
        company_id: loginStatus.companyId,
        id: null,
        limit: pageSize,
        offset: offset,
        search_company_specific_date_range_id: effectiveDateRangeId,
        search_parameter: searchParameter,
        search_parameter_date: concatDate,
        requestedby_id: loginStatus.id,
        requestedby: loginStatus.id,
      };

      try {
        const response = await axios.post(
          isGridForAccountProduct?POST_API.GET_LOOKUP_COMPANY_PRODUCT:POST_API.GET_PRODUCTS,
          getProductPostData,
          {
            signal,
            withCredentials: true,
          }
        );

        if (response.data && response.status === STATUS_CODE.OK) {
          setCurrentPageData({currentPage: currentPage, pageDataLength: response.data.length});
          const formattedData: Product[] = response.data.map((res: any) => ({
            count: res.count,
            id: res.id,
            companyId: res.company_id,
            productTypeId:res.product_type_id,
            productTypeName:res.product_type_name,
            unitName: res.unit_name,
            unitId : res.unit_id,
            unitNameInStock : res.unit_name_in_stock,
            defaultWarrantyIntervalTypeId:res.default_warranty_interval_type_id,
            defaultWarranty:res.default_warranty,
            defaultWarrantyName:res.default_warranty_name,
            defaultAmcCycleIntervalTypeId:res.default_amc_cycle_interval_type_id,
            defaultAmcCycle:res.default_amc_cycle,
            defaultAmcCycleName:res.default_amc_cycle_name,
            name: res.name,
            barcode: res.barcode,
            parentUnitId : res.parent_unit_id,
            isSerialNumber: res.is_serial_number,
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
            minimumStock: res.minimum_stock

          }));
          setProductsData(formattedData);
        }
      } catch (error: ApiError | any) {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithEvent: fetchCompanyProducts,
          });

          if (refreshTokenStatus) {
            fetchCompanyProducts(signal);
          }
        }else{
          // toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG_TRY_AGAIN)
        }
      }
    }
  };

  useEffect(() => {

    const controller = new AbortController();
    const {signal} = controller;
    setTimeout(() => {
      setProductsData([]);
      // console.log("Product Data is cleared");
      // console.log(productsData);
      fetchCompanyProducts(signal);
    }, 200);


    return () =>{
      controller.abort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productUpdateCount,
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
  ]);

  useEffect(() => {
    if (!userHasAccessToViewProduct && !isGridForAccountProduct) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewProduct]);

  
  // Save all filters to localStorage whenever they change
  useEffect(() => {
    const filters = {
      page: currentPage,
      size: pageSize,
      search: searchParameter,
      dateRangeId,
      concatDate,
      customStartDate: startDate,
      customEndDate: endDate,
    };

    localStorage.setItem(
      LocalStorageKeys.PRODUCT_MANAGEMEMNT_FILTERS,
      JSON.stringify(filters)
    );
  }, [
    currentPage,
    pageSize,
    searchParameter,
    dateRangeId,
    concatDate,
    startDate,
    endDate
  ]);

  // Note : On refresh button click clear the storage
  useEffect(() => {
    window.addEventListener("beforeunload", clearLeadFilters);
    function clearLeadFilters() {
      localStorage.removeItem(LocalStorageKeys.PRODUCT_MANAGEMEMNT_FILTERS);
    }
    return () => window.removeEventListener("beforeunload", clearLeadFilters);
  }, []);

  return (
    <div className="w-full">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {userHasAccessToViewProduct || isGridForAccountProduct ? (
          <>
            <div>
              <ProductsManagementList
                handleCreateCompanyProductTax={handleCreateCompanyProductTax}
                handleEditProductChange={handleEditProductChange}
                handleProductChangeOnAdd={handleProductChangeOnAdd}
                onEndDateChange={handleEndDateChange}
                onStartDateChange={handleStartDateChange}
                handleSearchOption={{
                  handleSearchParameterChange,
                  handleDateRangeIdChange: handleDatePageIdChange,
                  dateRangeId,
                  startDate,
                  endDate,
                  searchParameter
                }}
                paginationData={{
                  currentPage,
                  currentPageData,
                  onPageChange: handlePageChange,
                  pageSize,
                  onPageSizeChange: handlePageSizeChange,
                }}
                products={productsData}
                isGridForAccountProduct ={isGridForAccountProduct}
                onRowSelect={onRowSelect}
                // isListForProductUser={false}
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
      </motion.section>
    </div>
  );
}

export default ProductManagement;
