/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ApiError from "../../../@types/error/ApiError";
import LiveStockForCompanyProduct from "../../../@types/stock/LiveStockForCompanyProduct";
import { handleApiError } from "../../../config/error/handleApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import { DEBOUNCE_DELAY, STATUS_CODE } from "../../../constants/AppConstants";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import StockManagementList from "../../lists/StockManagementList";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";

const StockManagement = () => {
  const { userHasAccessToViewProductWiseStock } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const [isDataLoading , setIsDataLoading] = useState<boolean>(false);
  const [liveStockForCompanyProduct, setLiveStockForCompanyProduct] = useState<
    LiveStockForCompanyProduct[]
  >([]);
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (!userHasAccessToViewProductWiseStock) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewProductWiseStock]);

  // Read filters from LocalStorage (before hook initializes)
  const savedFilters = JSON.parse(
    localStorage.getItem(LocalStorageKeys.STOCK_MANAGEMEMNT_FILTERS) || "{}",
  );
  const {
    currentPage,
    currentPageData,
    pageSize,
    searchParameter,
    setCurrentPageData,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
  } = useSearchFilterPaginationDateHandlers(savedFilters);

  const getStockLiveForCompanyProduct = async (signal: AbortSignal) => {
    const offset = (currentPage - 1) * pageSize;
    const postData = {
      company_id: loginStatus.companyId,
      search_parameter: searchParameter,
      offset: offset,
      limit: pageSize,
      requestedby_id: loginStatus.id,
    };

    setIsDataLoading(true)
    await axios
      .post(POST_API.GET_STOCK_LIVE_COMPANY_PRODUCT, postData, {
        signal: signal,
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setCurrentPageData({
            currentPage: currentPage,
            pageDataLength: response.data.length,
          });
          const responseData = response.data;
          console.log(responseData);

          const formattedData: LiveStockForCompanyProduct[] = responseData.map(
            (item: any) => ({
              count: item.count,
              companyProductId: item.company_product_id,
              companyProductName: item.company_product_name,
              quantityInward: item.quantity_inward,
              quantityOutward: item.quantity_outward,
              quantityLive: item.quantity_live,
              availability: item.availability,
            }),
          );

          setLiveStockForCompanyProduct(formattedData);
        }
      })
      .catch(async (error: ApiError | any) => {
        handleApiError(error);
      })
      .finally(()=>{

        setIsDataLoading(false)
      });
  };

  // Debounced Effect
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    //  Debounce timer
    const debounceTimer = setTimeout(() => {
      getStockLiveForCompanyProduct(signal);
    }, DEBOUNCE_DELAY);

    // Cleanup
    return () => {
      clearTimeout(debounceTimer); // clear debounce if deps change quickly
      controller.abort(); // cancel ongoing API request
    };
  }, [pageSize, currentPage, searchParameter]);

  // Save all filters to localStorage whenever they change
  useEffect(() => {
    const filters = {
      page: currentPage,
      size: pageSize,
      search: searchParameter,
    };

    localStorage.setItem(
      LocalStorageKeys.STOCK_MANAGEMEMNT_FILTERS,
      JSON.stringify(filters),
    );
  }, [currentPage, pageSize, searchParameter]);

  // Note : On refresh button click clear the storage
  useEffect(() => {
    window.addEventListener("beforeunload", clearLeadFilters);
    function clearLeadFilters() {
      localStorage.removeItem(LocalStorageKeys.STOCK_MANAGEMEMNT_FILTERS);
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
        {userHasAccessToViewProductWiseStock ? (
          <>
            <StockManagementList
              liveStockForCompanyProduct={liveStockForCompanyProduct}
              paginationData={{
                onPageSizeChange: handlePageSizeChange,
                currentPage,
                onPageChange: handlePageChange,
                pageSize,
                currentPageData,
              }}
              handleSearchParameterChange={handleSearchParameterChange}
              searchParameter={searchParameter}
              isDataLoading ={isDataLoading}
            />
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
};

export default StockManagement;
