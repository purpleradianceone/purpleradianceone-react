import { useEffect, useState } from "react";
import CompanyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import GetCompanyUsersList from "../../lists/CompanyUsersList";
import axios from "axios";
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

function GetCompanyUsers({
  isUsedInAccountProductForAssingingInstalledBy,
  onRowSelect,
}: {
  isUsedInAccountProductForAssingingInstalledBy?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowSelect?: (data: any) => void;
}) {
  const [companyUsers, setCompanyUsers] = useState<CompanyUsersSearchProps[]>(
    []
  );
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const { loginStatus } = useLoggedInUserContext();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  const { userHasAccessToViewUser } = useUserAccessModules();
  const [userUpdateCount, setUserUpdateCount] = useState(0);

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
      const response = await axios.post(POST_API.GET_COMPANY_USERS, postData, {
        signal,
        withCredentials: true,
      });

      setCompanyUsers(response.data);
      // console.log(response.data);
      if (response.data[0]?.count) {
        setTotalPages(Math.ceil(response.data[0].count / pageSize));
      }
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
    concatDate,
    userUpdateCount,
  ]);

  useEffect(() => {
    if (!userHasAccessToViewUser) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewUser]);

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
                }}
                paginationData={{
                  selectedPageSize: handlePageSizeChange,
                  currentPage,
                  handlePageChange,
                  totalPages,
                  pageSize,
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
