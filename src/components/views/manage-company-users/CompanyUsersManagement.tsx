import { useEffect, useState } from "react";
import CompanyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import GetCompanyUsersList from "../../lists/CompanyUsersList";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";
import axiosClient from "../../../axios-client/AxiosClient";

function GetCompanyUsers({
  isUsedInAccountProductForAssingingInstalledBy,
  onRowSelect,
}: {
  isUsedInAccountProductForAssingingInstalledBy?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowSelect?: (data: any) => void;
}) {

  // Restore saved filters when opening this module
    // useEffect(() => {
    //   const saved = localStorage.getItem(LocalStorageKeys.COMPANY_MANAGEMEMNT_FILTERS);
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
  const [companyUsers, setCompanyUsers] = useState<CompanyUsersSearchProps[]>(
    []
  );
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { loginStatus } = useLoggedInUserContext();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  const { userHasAccessToViewUser } = useUserAccessModules();
  const [userUpdateCount, setUserUpdateCount] = useState(0);

  // Read filters from LocalStorage (before hook initializes)
const savedFilters = JSON.parse(
  localStorage.getItem(LocalStorageKeys.COMPANY_MANAGEMEMNT_FILTERS) || "{}"
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

  const handleCompanyUserChangeOnEdit = (user: CompanyUser) => {
    const userMatches = companyUsers.some(
      (users) => users.id === user.id && users.company_id === user.company_id
    );
    if (userMatches) {
      setUserUpdateCount((prev) => prev + 1);
    }
  };

  // Fetch data function
  const fetchCompanyUsers = async (signal: AbortSignal) => {
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
      search_parameter_date: concatDate,
    };

    try {
      const response = await axiosClient.post(POST_API.GET_COMPANY_USERS, postData, {
        signal,
        withCredentials: true,
      });
      setCurrentPageData({currentPage: currentPage, pageDataLength: response.data.length});
      setCompanyUsers(response.data);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: fetchCompanyUsers,
        });
        if (refreshTokenStatus) {
          fetchCompanyUsers(signal);
        }
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const signal = controller.signal;
    // const timeoutId = setTimeout(() => {
    //   if (loginStatus.status) {
        fetchCompanyUsers(signal);
    //   }
    // }, 100); // Small delay to allow state updates to settle

    return () => {
      controller.abort();
    };
    // return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    startDate,
    endDate,
    concatDate,
    userUpdateCount,
  ]);

  useEffect(() => {
    if (!userHasAccessToViewUser) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewUser]);

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
      LocalStorageKeys.COMPANY_MANAGEMEMNT_FILTERS,
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

  // Note : On refresh button click clear the storage
  useEffect(() => {
    window.addEventListener("beforeunload", clearLeadFilters);
    function clearLeadFilters() {
      localStorage.removeItem(LocalStorageKeys.COMPANY_MANAGEMEMNT_FILTERS);
    }
    return () => window.removeEventListener("beforeunload", clearLeadFilters);
  }, []);
  return (
    <div className="w-full">
      {userHasAccessToViewUser ? (
        <>
          <div>
            <motion.section
              ref={ref}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <GetCompanyUsersList
                handleCompanyUserChangeOnEdit={handleCompanyUserChangeOnEdit}
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
                  pageSize,
                  currentPage,
                  currentPageData,
                  onPageSizeChange: handlePageSizeChange,
                  onPageChange:handlePageChange,
                }}
                users={companyUsers}
                isUsedInAccountProductForAssingingInstalledBy={
                  isUsedInAccountProductForAssingingInstalledBy
                }
                onRowSelect={onRowSelect}
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

export default GetCompanyUsers;
