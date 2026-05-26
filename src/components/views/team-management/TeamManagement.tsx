/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { useEffect, useState } from "react";
import { STATUS_CODE } from "../../../constants/AppConstants";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import TeamManagementList from "../../lists/TeamManagementList";
import { customDateRangeId, useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import RefreshToken from "../../../config/validations/RefreshToken";
import ApiError from "../../../@types/error/ApiError";
import CompanyTeamSearchProps from "../../../@types/team-management/CompanyTeamListProps";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { LocalStorageKeys } from "../../../enums/LocalStorageKeys";

function TeamManagement() {
  
    // Restore saved filters when opening this module
        // useEffect(() => {
        //   const saved = localStorage.getItem(LocalStorageKeys.TEAMS_MANAGEMEMNT_FILTERS);
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
  const { userHasAccessToViewTeamManagement } = useUserAccessModules();
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const [companyTeamUpdateCount, setCompanyTeamUpdateCount] =
    useState<number>(0);
  const [companyTeamAddCount, setCompanyTeamAddCount] = useState<number>(0);
  const { loginStatus } = useLoggedInUserContext();

  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  const [companyTeamList, setCompanyTeamList] = useState<
    CompanyTeamSearchProps[]
  >([]);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  // Read filters from LocalStorage (before hook initializes)
const savedFilters = JSON.parse(
  localStorage.getItem(LocalStorageKeys.TEAMS_MANAGEMEMNT_FILTERS) || "{}"
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
    handleSearchParameterChange,
    handleStartDateChange,
    handlePageChange,
    handlePageSizeChange,
  } = useSearchFilterPaginationDateHandlers(savedFilters);

  const effectiveDateRangeId =
    dateRangeId === customDateRangeId && !concatDate ? 0 : dateRangeId;

  const fetchCompanyTeam = async (signal : AbortSignal) => {
    if (dateRangeId === customDateRangeId && concatDate.trim() === "") return;
    const offset = (currentPage - 1) * pageSize;
    if (userHasAccessToViewTeamManagement) {

      const getCompanyTeamPostData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
        limit: pageSize,
        offset,
        search_company_specific_date_range_id: effectiveDateRangeId,
        search_parameter: searchParameter,
        search_parameter_date: concatDate,
      };

      setIsDataLoading(true)
      await axios
        .post(POST_API.GET_COMPANY_TEAM, getCompanyTeamPostData, {
          signal,
          withCredentials: true,
        })
        .then((response) => {
          if (response.data && response.status === STATUS_CODE.OK) {
            setCurrentPageData({currentPage:currentPage, pageDataLength: response.data.length});
            const formattedData: CompanyTeamSearchProps[] = response.data.map(
              (res: any) => ({
                companyId: res.company_id,
                count: res.count,
                createdBy: res.createdby, 
                createdOn: res.createdon,
                description: res.description,
                id: res.id,
                isActive: res.isactive,
                name: res.name,
              })
            );
            setCompanyTeamList(formattedData);
          }
        })
        .catch(async (error: ApiError | any) => {
          console.log(error);
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus = await RefreshToken({
              callFunctionWithEvent: fetchCompanyTeam,
            });
            if (refreshTokenStatus) {
              fetchCompanyTeam(signal);
            }
          }
        }).finally(()=>{
          setIsDataLoading(false)
        });
    }
  };
  const handleCompanyTeamChangeOnUpdate = (teamID: number) => {
    const companyTeamMatches = companyTeamList.some(
      (companyTeam) => companyTeam.id === teamID
    );
    if (companyTeamMatches) {
      setCompanyTeamUpdateCount(companyTeamUpdateCount + 1);
    }
  };

  const handleCompanyTeamChangeOnAdd = () => {
    setCompanyTeamAddCount(companyTeamAddCount + 1);
  };

  useEffect(() => {
     const controller = new AbortController();
    const {signal} = controller;
    fetchCompanyTeam(signal);

     return ()=>{
      controller.abort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    companyTeamUpdateCount,
    companyTeamAddCount,
  ]);

  useEffect(() => {
    if (!userHasAccessToViewTeamManagement) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewTeamManagement]);
  
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
      LocalStorageKeys.TEAMS_MANAGEMEMNT_FILTERS,
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
      localStorage.removeItem(LocalStorageKeys.TEAMS_MANAGEMEMNT_FILTERS);
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
      {userHasAccessToViewTeamManagement ? (
        <>
          <div>
            <TeamManagementList
              companyTeamList={companyTeamList}
              handleSearchOption={{
                handleSearchParameterChange,
                handleDateRangeIdChange: handleDatePageIdChange,
                dateRangeId,
                startDate,
                endDate,
                searchParameter
              }}
              handleCompanyTeamChangeOnAdd={handleCompanyTeamChangeOnAdd}
              handleCompanyTeamChangeOnUpdate={handleCompanyTeamChangeOnUpdate}
              onEndDateChange={handleEndDateChange}
              onStartDateChange={handleStartDateChange}
              paginationData={{
                onPageSizeChange: handlePageSizeChange,
                currentPage,
                currentPageData,
                onPageChange: handlePageChange,
                pageSize,
              }}
              isDataLoading={isDataLoading}
            ></TeamManagementList>
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

export default TeamManagement;
