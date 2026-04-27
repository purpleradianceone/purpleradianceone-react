/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Account from "../../../@types/account/Account";
import AccountManagementList from "../../lists/AccountManagementList";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import axiosClient from "../../../axios-client/AxiosClient";

function GetAccounts({
  isUsedForAccountLead,
  handleRowSelectedForLead,
  isUsedForSupportTicketCreation
} : {
  isUsedForAccountLead : boolean;
  handleRowSelectedForLead? : (data: Account | any) => void;
  isUsedForSupportTicketCreation?: boolean;
}) {

  // Restore saved filters when opening this module
      // useEffect(() => {
      //   const saved = localStorage.getItem(LocalStorageKeys.ACCOUNT_MANAGEMEMNT_FILTERS);
      //   if (!saved) return;
    
      //   const filters = JSON.parse(saved);
    
      //   // Ensure URL & hook initialize first before restoring
      //   requestAnimationFrame(() => {
      //     if (filters.page) handlePageChange(filters.page);
      //     if (filters.size) handlePageSizeChange(filters.size);
      //     if (filters.search) handleSearchParameterChange(filters.search);
      //     if (filters.dateRangeId) handleDatePageIdChange(filters.dateRangeId);
    
      //     // if (filters.leadStatus) setSelectedLeadStatus(filters.leadStatus);
      //     // if (filters.leadSource) setSelectedLeadSource(filters.leadSource);
          
      //     if(filters.customStartDate) handleStartDateChange(filters.customStartDate)
      //       if(filters.customEndDate) handleEndDateChange(filters.customEndDate)
      //     // if (filters.userId) {
      //     //   setSelectedCompanyUser((prev) => ({
      //     //     ...prev,
      //     //     id: filters.userId,
      //     //     fullname : filters.userName
      //     //   }));
      //     // }
      //   });
      // }, []);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { loginStatus } = useLoggedInUserContext();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [accountChangeCount, setAccountChangeCount] = useState<number>(0);
  const [isDataLoading , setIsDataLoading] = useState<boolean>(false);
  const handleCreateCompanyAccountType = () => {
    setAccountChangeCount(accountChangeCount + 1);
  };

  const { userHasAccessToViewAccount } = useUserAccessModules();

  // Read filters from LocalStorage (before hook initializes)
const savedFilters = JSON.parse(
  localStorage.getItem(LocalStorageKeys.ACCOUNT_MANAGEMEMNT_FILTERS) || "{}"
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
  const fetchAccounts = async () => {
    if (dateRangeId === 8 && concatDate.trim() === "") return;
    const offset = (currentPage - 1) * pageSize;

    const effectiveDateRangeId =
      dateRangeId === 8 && !concatDate ? 0 : dateRangeId;

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      requestedby: loginStatus.id,
      limit: pageSize,
      offset,
      search_company_specific_date_range_id: effectiveDateRangeId,
      search_parameter: searchParameter,
      isactive: isUsedForAccountLead ? true : null,
      search_parameter_date: concatDate,
    };

    try {
      setIsDataLoading(true)
      const response = await axiosClient.post(POST_API.GET_ACCOUNT, postData, {
        withCredentials: true,
      });

      setCurrentPageData({currentPage: currentPage, pageDataLength: response.data.length});

      const formattedData: Account[] = response.data.map((res: any) => ({
        count: res.count,
        id: res.id,
        companyId: res.company_id,
        name: res.name,
        email: res.email,
        mobileNumber: res.mobilenumber,
        industryTypeId: res.industry_type_id,
        industryTypeName: res.industry_type_name,
        businessTypeId: res.business_type_id,
        businessTypeName: res.business_type_name,
        countryId: res.country_id,
        stateId: res.state_id,
        districtId: res.district_id,
        countryName: res.country_name,
        stateName: res.state_name,
        districtName: res.district_name,
        pan: res.pan,
        gst: res.gst,
        tan: res.tan,
        billingAddress: res.billing_address,
        shippingAddress: res.shipping_address,
        registeredOfficeAddress: res.registered_office_address,
        businessResgistrationNumber: res.business_registration_number,
        website: res.website,
        isActive: res.isactive,
        createdBy: res.createdby,
        createdOn: res.createdon,
      }));
      setAccounts(formattedData);
      
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: fetchAccounts,
        });
        if (refreshTokenStatus) {
          fetchAccounts();
        }
      }
    }finally{
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    accountChangeCount,
  ]);

  useEffect(() => {
    if (!userHasAccessToViewAccount) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewAccount]);

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
      LocalStorageKeys.ACCOUNT_MANAGEMEMNT_FILTERS,
      JSON.stringify(filters)
    );
  }, [
    currentPage,
    pageSize,
    searchParameter,
    dateRangeId,
    startDate,
    endDate,
    concatDate
  ]);

  // Note : On refresh button click clear the storage
  useEffect(() => {
    window.addEventListener("beforeunload", clearLeadFilters);
    function clearLeadFilters() {
      localStorage.removeItem(LocalStorageKeys.ACCOUNT_MANAGEMEMNT_FILTERS);
    }
    return () => window.removeEventListener("beforeunload", clearLeadFilters);
  }, []);
  return (
    <div className="w-full">
      {userHasAccessToViewAccount ? (
        <>
          <div>
            <motion.section
              ref={ref}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <AccountManagementList
                // fetchAccounts={fetchAccounts}
                accounts={accounts}
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
                  pageSize,
                  currentPage,
                  currentPageData,
                  onPageSizeChange: handlePageSizeChange,
                  onPageChange:handlePageChange,
                }}
                handleCreateCompanyAccountType={handleCreateCompanyAccountType}
                isUsedForAccountLead={isUsedForAccountLead}
                handleRowSelectedForLead={handleRowSelectedForLead}
                isUsedForSupportTicketCreation = {isUsedForSupportTicketCreation}
                isDataLoading ={isDataLoading}
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

export default GetAccounts;
