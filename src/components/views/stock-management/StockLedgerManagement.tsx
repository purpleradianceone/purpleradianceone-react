/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ApiError from "../../../@types/error/ApiError";
import Transaction from "../../../@types/stock/Transaction";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import useTransactionType from "../../../config/hooks/useTransactionType";
import { DEBOUNCE_DELAY, STATUS_CODE } from "../../../constants/AppConstants";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import StockLedgerList from "../../lists/StockLedgerList";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";

const StockLedgerManagement = () => {
  const { userHasAccessToViewStockLedger } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const [stockLedger, setStockLedger] = useState<Transaction[]>([]);
  const { loading: transactionTypeDataLoading, transactionType } =
    useTransactionType();
  console.log(transactionTypeDataLoading);

  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [companyProductId, setCompanyProductId] = useState<number | null>(null);
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<any>(null);
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] =
    useState<boolean>(false);
  useEffect(() => {
    if (!userHasAccessToViewStockLedger) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewStockLedger]);

  const handleSelectedTransactionType = useCallback(
    (transactionType: number | undefined) => {
      setSelectedTransactionType(transactionType);
    },
    [],
  );

  function handleDateChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setTransactionDate(e.target.value);
  }

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

  const getStockLedger = useCallback(
    async (signal: AbortSignal) => {
      const offset = (currentPage - 1) * pageSize;
      const postData = {
        company_id: loginStatus.companyId,
        id: null,
        company_product_id: companyProductId,
        transaction_type_id: selectedTransactionType?.id,
        transaction_date: transactionDate,
        offset: offset,
        limit: pageSize,
        requestedby_id: loginStatus.id,
      };

      await axiosClient
        .post(POST_API.GET_STOCK, postData, {
          signal: signal,
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            setCurrentPageData({
              currentPage: currentPage,
              pageDataLength: response.data.length,
            });
            const data = response.data;
            const formattedData: Transaction[] = data.map((item: any) => ({
              count: item.count,
              id: item.id,
              companyProductId: item.company_product_id,
              companyProductName: item.company_product_name,
              transactionTypeId: item.transaction_type_id,
              transactionTypeName: item.transaction_type_name,
              quantity: item.quantity,
              isInward: item.is_inward,
              otherDetails: item.other_details,
              description: item.description,
              transactionDate: item.transaction_date,
              createdBy: item.createdby,
              createdOn: item.createdon,
            }));

            setStockLedger(formattedData);
          }
        })
        .catch(async (error: ApiError | any) => {
          handleApiError(error);
        });
    },
    [
      transactionDate,
      currentPage,
      pageSize,
      selectedTransactionType,
      companyProductId,
    ],
  );
  // Debounced Effect
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    //  Debounce timer
    const debounceTimer = setTimeout(() => {
      getStockLedger(signal);
    }, DEBOUNCE_DELAY);

    // Cleanup
    return () => {
      clearTimeout(debounceTimer); // clear debounce if deps change quickly
      controller.abort(); // cancel ongoing API request
    };
  }, [
    pageSize,
    currentPage,
    searchParameter,
    transactionDate,
    selectedTransactionType,
    companyProductId,
  ]);

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
        {userHasAccessToViewStockLedger ? (
          <>
            <StockLedgerList
              stockLedger={stockLedger}
              paginationData={{
                onPageSizeChange: handlePageSizeChange,
                currentPage,
                onPageChange: handlePageChange,
                pageSize,
                currentPageData,
              }}
              trasactionType={transactionType}
              handleSelectedTransactionType={handleSelectedTransactionType}
              selectedTransactionType={selectedTransactionType}
              handleDateChange={handleDateChange}
              transactionDate={transactionDate}
              setCompanyProductId={setCompanyProductId}
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

export default StockLedgerManagement;
