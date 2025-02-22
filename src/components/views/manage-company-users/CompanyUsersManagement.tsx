import { useEffect, useState } from "react";
import companyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import GetCompanyUsersList from "../../lists/CompanyUsersList";
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";
import POST_API from "../../../constants/PostApi";
import {
  BOOLEAN_VALUES,
  NUMBER_VALUES,
  STATUS_CODE,
} from "../../../constants/AppConstants";
import { useNavigate } from "react-router-dom";
import { DialogueBox } from "../../dialogue-box/Dialogue";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import ROUTES_URL from "../../../constants/Routes";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import CompanyUser from "../../../@types/company-users/CompanyUser";

function GetCompanyUsers() {
  const [companyUsers, setCompanyUsers] = useState<companyUsersSearchProps[]>(
    []
  );
  const { loginStatus } = useLoggedInUserContext();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(
    BOOLEAN_VALUES.FALSE
  );
  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(
    BOOLEAN_VALUES.FALSE
  );

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
  const fetchCompanyUsers = async () => {
    const offset = (currentPage - NUMBER_VALUES.ONE) * pageSize;

    const effectiveDateRangeId =
      dateRangeId === NUMBER_VALUES.EIGHT && !concatDate
        ? NUMBER_VALUES.ZERO
        : dateRangeId;

    const postData = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
      limit: pageSize,
      offset,
      search_company_specific_date_range_id: effectiveDateRangeId,
      search_parameter: searchParameter,
      search_parameter_date: concatDate,
    };

    try {
      const response = await axios.post(POST_API.GET_COMPANY_USERS, postData, {
        withCredentials: BOOLEAN_VALUES.TRUE,
      });

      setCompanyUsers(response.data);
      if (response.data[NUMBER_VALUES.ZERO]?.count) {
        setTotalPages(
          Math.ceil(response.data[NUMBER_VALUES.ZERO].count / pageSize)
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: ApiError | any) {
      console.log(error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: fetchCompanyUsers,
        });
        if (refreshTokenStatus) {
          setIsDialogueOpen(BOOLEAN_VALUES.FALSE);
        } else {
          setIsDialogueOpen(BOOLEAN_VALUES.TRUE);
        }
      }
    }
  };

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(BOOLEAN_VALUES.FALSE);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCompanyUsers();
    }, 100); // Small delay to allow state updates to settle

    return () => clearTimeout(timeoutId);
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
    if (userHasAccessToViewUser === BOOLEAN_VALUES.FALSE) {
      setAccessDeniedPopUpOpen(BOOLEAN_VALUES.TRUE);
    }
  }, [userHasAccessToViewUser]);

  return (
    <div className="w-full">
      {userHasAccessToViewUser ? (
        <>
          <div>
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
            />
          </div>
          <DialogueBox
            isOpen={isDialogueOpen}
            onClose={() => setIsDialogueOpen(BOOLEAN_VALUES.FALSE)}
            onConfirm={handleDialogueConfirm}
            title="Session Expired !"
            message="Session Expired. Please login again."
          />
        </>
      ) : (
        <div className="flex-none mx-96 mt-14">
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpOpen}
            onClose={() => {
              setAccessDeniedPopUpOpen(BOOLEAN_VALUES.FALSE);
              window.history.back();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default GetCompanyUsers;
