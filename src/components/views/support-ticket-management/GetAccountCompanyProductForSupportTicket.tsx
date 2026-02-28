/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import RefreshToken from "../../../config/validations/RefreshToken";
import { customDateRangeId, useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import AccountCompanyProductForSupportTicket from "../../../@types/support-ticket-management/AccountCompanyProductForSupportTicket";
import AccountCompanyProductForSupportTicketList from "../../lists/AccountCompanyProductForSupportTicketList";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import axios from "axios";

function GetAccountCompanyProductForSupportTicket({
  handleRowSelect,
}: {
  handleRowSelect?: (data: AccountCompanyProductForSupportTicket | any) => void;
}) {
  const [accountsCompanyProductForSupportTicke, setAccountsCompanyProductForSupportTicke] = useState<
    AccountCompanyProductForSupportTicket[]
  >([]);
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { loginStatus } = useLoggedInUserContext();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const { userHasAccessToViewSupportTicket } = useUserAccessModules();


  // Read filters from LocalStorage (before hook initializes)
  const savedFilters = JSON.parse(
    localStorage.getItem(
      LocalStorageKeys.ACCOUNT_COMPANY_PRODUCT_FOR_SUPPORT_TICKET
    ) || "{}"
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
    setCurrentPageData,
    handleDatePageIdChange,
    handleEndDateChange,
    handlePageChange,
    handlePageSizeChange,
    handleSearchParameterChange,
    handleStartDateChange,
  } = useSearchFilterPaginationDateHandlers(savedFilters);



  // Fetch data function
  const fetchAccountCompanyProductForSupportTicket = async () => {
    if(loginStatus.companyId === 0) return;
    if (dateRangeId === customDateRangeId && concatDate.trim() === "") return;
    const offset = (currentPage - 1) * pageSize;

    const effectiveDateRangeId =
      dateRangeId === customDateRangeId && !concatDate ? 0 : dateRangeId;

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      requestedby: loginStatus.id,
      limit: pageSize,
      offset,
      search_company_specific_date_range_id: effectiveDateRangeId,
      search_parameter: searchParameter,
      isactive: null,
      search_parameter_date: concatDate,
    };

    try {
      const response = await axios.post(
        POST_API.GET_ACCOUNT_COMPANY_PRODUCT_FOR_SUPPORT_TICKET,
        postData,
        {
          withCredentials: true,
        }
      );
      // setCurrentPageDataLength(currentPage, response.data.length);
      setCurrentPageData({currentPage:currentPage, pageDataLength: response.data.length});
      const formattedData: AccountCompanyProductForSupportTicket[] =
        response.data.map((res: any) => ({
          count: res.count,
          id: res.id,
          accountId: res.account_id,
          accountName: res.account_name,
          accountEmail: res.account_email,
          accountMobileNumber: res.account_mobilenumber,
          companyProductId: res.company_product_id,
          companyProductName: res.company_product_name,
          isAmc: res.is_amc,
          isWarranty: res.is_warranty,
          quantity: res.quantity,
          barcode: res.barcode,
          serialNumber: res.serial_number,
          unitName: res.unit_name,
          purchaseDate: res.purchase_date,
          isActive: res.isactive,
          createdBy: res.createdby,
          updatedBy: res.updatedby,
          createdOn: res.createdon,
          updatedOn: res.updatedon,
        }));
      setAccountsCompanyProductForSupportTicke(formattedData);

      // if (response.data[0]?.count) {
      //   setTotalPages(Math.ceil(response.data[0].count / pageSize));
      // }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: fetchAccountCompanyProductForSupportTicket,
        });
        if (refreshTokenStatus) {
          fetchAccountCompanyProductForSupportTicket();
        }
      }
    }
  };

  useEffect(() => {
    fetchAccountCompanyProductForSupportTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, currentPage, dateRangeId, searchParameter, concatDate]);

  useEffect(() => {
    if (!userHasAccessToViewSupportTicket) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewSupportTicket]);

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
      LocalStorageKeys.ACCOUNT_COMPANY_PRODUCT_FOR_SUPPORT_TICKET,
      JSON.stringify(filters)
    );
  }, [
    currentPage,
    pageSize,
    searchParameter,
    dateRangeId,
    concatDate,
    startDate,
    endDate,
  ]);

  function clearAccountCompanyProductForSupportTicketFilters() {
    localStorage.removeItem(
      LocalStorageKeys.ACCOUNT_COMPANY_PRODUCT_FOR_SUPPORT_TICKET
    );
  }
  // Note : On refresh button click clear the storage
  useEffect(() => {
    window.addEventListener(
      "beforeunload",
      clearAccountCompanyProductForSupportTicketFilters
    );
    window.addEventListener(
      "close",
      clearAccountCompanyProductForSupportTicketFilters
    );
    return () =>
      window.removeEventListener(
        "beforeunload",
        clearAccountCompanyProductForSupportTicketFilters
      );
  }, []);
  return (
    <div className="w-full">
      {userHasAccessToViewSupportTicket ? (
        <>
          <div>
            <motion.section
              ref={ref}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <AccountCompanyProductForSupportTicketList
                accountCompanyProductsForSupportTicket={accountsCompanyProductForSupportTicke}
                handleSearchOption={{
                  handleSearchParameterChange,
                  handleDateRangeIdChange: handleDatePageIdChange,
                  dateRangeId,
                  startDate,
                  endDate,
                  searchParameter,
                }}
                onEndDateChange={handleEndDateChange}
                onStartDateChange={handleStartDateChange}
                paginationData={{
                  currentPage,
                  currentPageData,
                  pageSize,
                  onPageChange: handlePageChange,
                  onPageSizeChange: handlePageSizeChange,
                  
                }}
                handleRowSelect={handleRowSelect}
              />
            </motion.section>
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

export default GetAccountCompanyProductForSupportTicket;
