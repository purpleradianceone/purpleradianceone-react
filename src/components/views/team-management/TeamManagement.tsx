/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { useEffect, useState } from "react";
import { STATUS_CODE } from "../../../constants/AppConstants";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import TeamManagementList from "../../lists/TeamManagementList";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import RefreshToken from "../../../config/validations/RefreshToken";
import ApiError from "../../../@types/error/ApiError";
import CompanyTeamSearchProps from "../../../@types/team-management/CompanyTeamListProps";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

function TeamManagement() {
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

  const {
    currentPage,
    pageSize,
    dateRangeId,
    concatDate,
    searchParameter,
    totalPages,
    handleDatePageIdChange,
    handleEndDateChange,
    handleSearchParameterChange,
    handleStartDateChange,
    setTotalPages,
    handlePageChange,
    handlePageSizeChange,
  } = useSearchFilterPaginationDateHandlers();

  const effectiveDateRangeId =
    dateRangeId === 8 && !concatDate ? 0 : dateRangeId;

  const fetchCompanyTeam = async () => {
    const offset = (currentPage - 1) * pageSize;
    if (userHasAccessToViewTeamManagement) {
      setTimeout(() => {
        setCompanyTeamList([]);
      }, 100);

      const getCompanyTeamPostData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
        limit: pageSize,
        offset,
        search_company_specific_date_range_id: effectiveDateRangeId,
        search_parameter: searchParameter,
        search_parameter_date: concatDate,
      };

      await axios
        .post(POST_API.GET_COMPANY_TEAM, getCompanyTeamPostData, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data && response.status === STATUS_CODE.OK) {
            if (response.data[0]?.count) {
              setTotalPages(Math.ceil(response.data[0].count / pageSize));
            }
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
              callFunction: fetchCompanyTeam,
            });
            if (refreshTokenStatus) {
              fetchCompanyTeam();
            }
          }
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
    fetchCompanyTeam();
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
              }}
              handleCompanyTeamChangeOnAdd={handleCompanyTeamChangeOnAdd}
              handleCompanyTeamChangeOnUpdate={handleCompanyTeamChangeOnUpdate}
              onEndDateChange={handleEndDateChange}
              onStartDateChange={handleStartDateChange}
              paginationData={{
                selectedPageSize: handlePageSizeChange,
                currentPage,
                handlePageChange,
                totalPages,
                pageSize,
              }}
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
