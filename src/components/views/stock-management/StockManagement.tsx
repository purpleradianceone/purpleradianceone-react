/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import { motion } from "framer-motion";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { useInView } from "react-intersection-observer";
import StockManagementList from "../../lists/StockManagementList";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import ApiError from "../../../@types/error/ApiError";
import { DEBOUNCE_DELAY, STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import LiveStockForCompanyProduct from "../../../@types/stock/LiveStockForCompanyProduct";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";

const StockManagement = () => {
  const { userHasAccessToViewStock } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const [liveStockForCompanyProduct, setLiveStockForCompanyProduct] = useState<
    LiveStockForCompanyProduct[]
  >([]);
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (!userHasAccessToViewStock) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewStock]);

  const {
    currentPage,
    pageSize,
    dateRangeId,
    concatDate,
    searchParameter,
    totalPages,
    setTotalPages,
    handleDatePageIdChange,
    handleEndDateChange,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
    handleStartDateChange,
  } = useSearchFilterPaginationDateHandlers();
  const getStockLiveForCompanyProduct = async (signal: AbortSignal) => {
    const offset = (currentPage - 1) * pageSize;

    const effectiveDateRangeId = dateRangeId;
    const postData = {
      company_id: loginStatus.companyId,
      search_company_specific_date_range_id: effectiveDateRangeId,
      search_parameter: searchParameter,
      search_parameter_date: concatDate,
      offset: offset,
      limit: pageSize,
      requestedby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.GET_STOCK_LIVE_COMPANY_PRODUCT, postData, {
        signal: signal,
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const responseData = response.data;

          if (response.data.length > 0) {
            setTotalPages(Math.ceil(response.data[0].count / pageSize));
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedData: LiveStockForCompanyProduct[] = responseData.map(
            (item: any) => ({
              count: item.count,
              companyProductId: item.company_product_id,
              companyProductName: item.company_product_name,
              quantityInward: item.quantity_inward,
              quantityOutward: item.quantity_outward,
              quantityLive: item.quantity_live,
            })
          );

          setLiveStockForCompanyProduct(formattedData);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: getStockLiveForCompanyProduct,
          });
          if (refreshTokenResponse) {
            getStockLiveForCompanyProduct(signal);
          }
        }
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
  }, [pageSize, currentPage, dateRangeId, searchParameter, concatDate]);

  return (
    <div className="w-full">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {userHasAccessToViewStock ? (
          <>
            <StockManagementList
              liveStockForCompanyProduct={liveStockForCompanyProduct}
              paginationData={{
                selectedPageSize: handlePageSizeChange,
                currentPage,
                handlePageChange,
                totalPages,
                pageSize,
              }}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              handleSearchOption={{
                handleSearchParameterChange,
                handleDateRangeIdChange: handleDatePageIdChange,
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
};

export default StockManagement;
