/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DialogueBox } from "../../../dialogue-box/Dialogue";
import AccessDeniedPopup from "../../../views/not-found/AccessDeniedPage";
import ROUTES_URL from "../../../../constants/Routes";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";

import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import CompanyUser from "../../../../@types/company-users/CompanyUser";
import { useSearchFilterPaginationDateHandlers } from "../../../../config/hooks/usePaginationHandler";
import CompanyUsersSearchProps from "../../../../@types/company-users/CompanyUserProps";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { useNavigate } from "react-router-dom";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import GetCompanyUserListForLeadAssignment from "./GetCompanyUserListForLeadAssignment";
// import ApiError from "../../../../@types/error/ApiError";


function GetCompanyUsersForLead({
  handleSelectedCompanyUserChange,
  selectedUserId 
}:{
  handleSelectedCompanyUserChange: (params: CompanyUser | null) => void;
  selectedUserId: number | null;
}) {
  const [companyUsers, setCompanyUsers] = useState<CompanyUsersSearchProps[]>(
    []
  );
  const { loginStatus } = useLoggedInUserContext();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(
    false
  );
  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(
    false
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
    const offset = (currentPage - 1) * pageSize;

    const effectiveDateRangeId =
      dateRangeId === 8 && !concatDate
        ? 0
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
        withCredentials: true,
      });

      setCompanyUsers(response.data);
      // console.log(response.data);
      if (response.data[0]?.count) {
        setTotalPages(
          Math.ceil(response.data[0].count / pageSize)
        );
      }
      
    } catch (error:  any) {
      console.log(error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: fetchCompanyUsers,
        });
        if (refreshTokenStatus) {
          setIsDialogueOpen(false);
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
      }
    }
  };

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
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
    if (!userHasAccessToViewUser) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewUser]);

  return (
    <div className="w-full">
      {userHasAccessToViewUser ? (
        <>
          <div>
            <GetCompanyUserListForLeadAssignment
            // selectedUserId={selectedUserId}
            //note : added recently
            handleSelectedCompanyUserChange={handleSelectedCompanyUserChange}
              selectedUserId={selectedUserId}
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
            onClose={() => setIsDialogueOpen(false)}
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
              setAccessDeniedPopUpOpen(false);
              window.history.back();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default GetCompanyUsersForLead;
