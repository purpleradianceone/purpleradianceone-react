/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ApiError from "../../../@types/error/ApiError";
import StockAgeing from "../../../@types/stock/StockAgeing";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import { DEBOUNCE_DELAY, STATUS_CODE } from "../../../constants/AppConstants";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import StockAgeingList from "../../lists/StockAgeingList";

function StockAgeingManagement() {
  const { userHasAccessToViewStockAgeing } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const [stockAgeing, setStockAgeing] = useState<StockAgeing[]>([]);
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (!userHasAccessToViewStockAgeing) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewStockAgeing]);

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
  } = useSearchFilterPaginationDateHandlers(savedFilters);

  const getWareHouseWiseStock = async (signal: AbortSignal) => {
    const offset = (currentPage - 1) * pageSize;
    const postData = {
      company_id: loginStatus.companyId,
      offset: offset,
      limit: pageSize,
      requestedby_id: loginStatus.id,
    };

    await axiosClient
      .post(POST_API.GET_STOCK_AGEING, postData, {
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

          const formattedData: StockAgeing[] = responseData.map(
            (item: any) => ({
              companyProductId: item.company_product_id,
              companyProductName: item.company_product_name,
              unitName: item.unit_name,
              zeroToThirtyDays: item["0_30_days"] ?? 0,
              thirtyToSixtyDays: item["30_60_days"] ?? 0,
              sixtyToNinetyDays: item["60_90_days"] ?? 0,
              ninetyPlusDays: item["90_plus_days"] ?? 0,
            }),
          );

          setStockAgeing(formattedData);
        }
      })
      .catch(async (error: ApiError | any) => {
        handleApiError(error);
      });
  };

  // Debounced Effect
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    //  Debounce timer
    const debounceTimer = setTimeout(() => {
      getWareHouseWiseStock(signal);
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
      LocalStorageKeys.STOCK_AGEING_FILTERS,
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
        {userHasAccessToViewStockAgeing ? (
          <>
            <StockAgeingList
              stockAgeing={stockAgeing}
              paginationData={{
                onPageSizeChange: handlePageSizeChange,
                currentPage,
                onPageChange: handlePageChange,
                pageSize,
                currentPageData,
              }}
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
}
export default StockAgeingManagement;
