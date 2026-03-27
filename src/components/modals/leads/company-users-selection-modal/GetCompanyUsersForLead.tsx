/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import POST_API from "../../../../constants/PostApi";
import CompanyUser from "../../../../@types/company-users/CompanyUser";
import { useSearchFilterPaginationDateHandlers } from "../../../../config/hooks/usePaginationHandler";
import CompanyUsersSearchProps from "../../../../@types/company-users/CompanyUserProps";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import GetCompanyUserListForLeadAssignment from "./GetCompanyUserListForLeadAssignment";
import axiosClient from "../../../../axios-client/AxiosClient";
import axios from "axios";
import AccessDeniedMessagePage from "../../../views/not-found/AccessDeniedMessagePage";
import MESSAGE from "../../../../constants/Messages";
// import ApiError from "../../../../@types/error/ApiError";

function GetCompanyUsersForLead({
  handleSelectedCompanyUserChange,
  selectedUserId,
  isUsedForSettings,
  handleUpdateLeadUser,
}: {
  handleSelectedCompanyUserChange: (params: CompanyUser | null) => void;
  selectedUserId: number | null;
  isUsedForSettings: boolean;
  handleUpdateLeadUser?: (params: CompanyUser | null) => boolean;
}) {
  const [companyUsers, setCompanyUsers] = useState<CompanyUsersSearchProps[]>(
    []
  );
  const { loginStatus } = useLoggedInUserContext();
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);

  const {  userHasAccessToViewLeadSettings } = useUserAccessModules();
  const [userUpdateCount, setUserUpdateCount] = useState(0);

  const {
    currentPage,
    currentPageData,
    pageSize,
    dateRangeId,
    concatDate,
    searchParameter,
    setCurrentPageData,
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
    if (loginStatus.companyId === 0) return;
    const offset = (currentPage - 1) * pageSize;

    const effectiveDateRangeId =
      dateRangeId === 8 && !concatDate ? 0 : dateRangeId;

    const postDataForLeads = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
      limit: pageSize,
      offset,
      search_company_specific_date_range_id: effectiveDateRangeId,
      search_parameter: searchParameter,
      search_parameter_date: concatDate,
      isactive: true,
    };

    const postDataForSettings = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
      limit: pageSize,
      offset,
      search_company_specific_date_range_id: effectiveDateRangeId,
      search_parameter: searchParameter,
      search_parameter_date: concatDate,
      ...(!isUsedForSettings && { isactive: true }),
      ...(isUsedForSettings && { all_leads_visible: null }),
    };

    try {
      const response = await (isUsedForSettings ? axiosClient : axios).post(
        isUsedForSettings
          ? POST_API.GET_LEAD_COMPANY_USERS
          : POST_API.GET_LOOKUP_COMPANY_USERS,
        isUsedForSettings ? postDataForSettings : postDataForLeads,
        {
          withCredentials: true,
        }
      );
      setCurrentPageData({currentPage: currentPage, pageDataLength: response.data.length});

      setCompanyUsers(response.data);
     
    } catch (error: any) {
      console.log(error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: fetchCompanyUsers,
        });
        if (refreshTokenStatus) {
          fetchCompanyUsers();
        }
      }
    }
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
    if (isUsedForSettings) {
      if (!userHasAccessToViewLeadSettings) {
        setAccessDeniedPopUpOpen(true);
      } else {
        setAccessDeniedPopUpOpen(false);
      }
    } else {
      setAccessDeniedPopUpOpen(false);
    }
  }, [userHasAccessToViewLeadSettings]);

  return (
    <div className="w-full">
      { !accessDeniedPopUpOpen ? (
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
                pageSize,
                currentPage,
                currentPageData,
                onPageSizeChange: handlePageSizeChange,
                onPageChange:handlePageChange,
              }}
              users={companyUsers}
              isUsedForSettings={isUsedForSettings}
              handleUpdateLeadUser={handleUpdateLeadUser}
            />
          </div>
        </>
      ) : (
        <div className="flex-none mx-96 mt-14 h-[40vh] justify-center items-center">
            <AccessDeniedMessagePage
            message={MESSAGE.MODULE_ACCESS.LEADS_SETTINGS.DENIED_VIEW_ACCESS}
            ></AccessDeniedMessagePage>
        </div>
      )}
    </div>
  );
}

export default GetCompanyUsersForLead;
