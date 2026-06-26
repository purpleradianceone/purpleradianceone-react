/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit, X } from "lucide-react";
import useScreenSize from "../../../config/hooks/useScreenSize";
import { SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import SearchInput from "../../ui/SearchInput";

import AddCompanyTeamUsersAgGrid from "../../ag-grid/AddCompanyTeamUsersAgGrid";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { useEffect, useRef, useState } from "react";
import companyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import { GridApi, } from "ag-grid-community";
import ApiError from "../../../@types/error/ApiError";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";
import RefreshToken from "../../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import LOCALSTORAGE_KEYS from "../../../constants/LocalStorage";
import PaginationWithoutCount from "../../ag-grid/PaginationWithoutCount";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import AccessDeniedMessagePage from "../../views/not-found/AccessDeniedMessagePage";
import MESSAGE from "../../../constants/Messages";

function EditSubscriptionUsersModal({
  isOpen,
  onClose,
  onRedirectToLoginPage,
}: // handleCompanyUserStatusChange,
{
  isOpen: boolean;
  onClose: () => void;
  onRedirectToLoginPage: () => void;
  // handleCompanyUserStatusChange: (status: boolean) => void;
  // handleCompanyUserStatusChange : (statusChangeCount: number) => void;
}) {
  const { isSmallScreen } = useScreenSize();
  const { loginStatus } = useLoggedInUserContext();
  const navigate = useNavigate();

  const [companyUsersList, setCompanyUsersList] = useState<
    companyUsersSearchProps[]
  >([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);


  const [
    statusChangeOfCompanyUserCountFromAggrid,
    setStatusChangeOfCompanyUserCountFromAggrid,
  ] = useState<number>(loginStatus.activeUsersInCompany);

  const [statusChangeCount, setStatusChangeCount] = useState<number>(0);

  const handleCompanyUserStatusChange = (statusChangeCount: number) => {
    setStatusChangeOfCompanyUserCountFromAggrid(
      statusChangeOfCompanyUserCountFromAggrid + statusChangeCount,
    );
    setStatusChangeCount(statusChangeCount);
  };

  const [isCompanyUsersLoading, setIsCompanyUsersLoading] =
    useState<boolean>(false);
  const companyUsersFetchingRef = useRef<boolean>(false);

  const companyUsersGridApiRef = useRef<GridApi | null>(null);
  const companyUserLastScrollPositionRef = useRef<number>(0);

  const companyUserSearchParameterRef = useRef<string>("");

  const { userHasAccessToUpdateUser } = useUserAccessModules();

  const {
    searchParameter,
    handleSearchParameterChange,
    pageSize,
    currentPage,
    currentPageData,
    setCurrentPageData,
    handlePageSizeChange,
    handlePageChange,
  } = useSearchFilterPaginationDateHandlers({size:25});

  const fetchCompanyUsers = async (comapnyUserSearchParameter: string) => {
    const offset = (currentPage - 1) * pageSize;

    try {
      setIsCompanyUsersLoading(true);
      companyUsersFetchingRef.current = true;

      if (companyUsersGridApiRef.current) {
        const rowIndex =
          companyUsersGridApiRef.current.getLastDisplayedRowIndex();
        if (rowIndex !== null) {
          companyUserLastScrollPositionRef.current = rowIndex;
        }
      }
      setIsDataLoading(true)
      const getCompanyUserPostData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
        isactive: true,
        limit: pageSize,
        offset: offset,
        search_company_specific_date_range_id: 0,
        search_parameter: searchParameter,
        search_parameter_date: "",
      };

      // alert("called from here ");
      const response = await axios.post(
        POST_API.GET_LOOKUP_COMPANY_USERS,
        getCompanyUserPostData,
        {
          withCredentials: true,
        },
      );
      if (response.data) {
        const newUsers = response.data;
        setCurrentPageData({
          currentPage: currentPage,
          pageDataLength: response.data.length,
        });
        setCompanyUsersList(newUsers);

        if (
          companyUsersGridApiRef.current &&
          companyUserLastScrollPositionRef.current > 0
        ) {
          setTimeout(() => {
            if (companyUsersGridApiRef.current) {
              companyUsersGridApiRef.current.ensureIndexVisible(
                companyUserLastScrollPositionRef.current - 11,
              );
            }
          }, 150);
        }
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithParamsNotEvent: fetchCompanyUsers,
        });
        if (refreshTokenResponse) {
          fetchCompanyUsers(comapnyUserSearchParameter);
        }
      }
    } finally {
      if (comapnyUserSearchParameter.length > 0) {
        setIsCompanyUsersLoading(false);
        companyUsersFetchingRef.current = false;
        if (companyUserSearchParameterRef.current.length === 1) {
          companyUsersGridApiRef.current = null;
          companyUserLastScrollPositionRef.current = 0;
        }
      } else if (comapnyUserSearchParameter.length === 0) {
        setIsCompanyUsersLoading(false);
        companyUsersFetchingRef.current = false;
      }
      setIsDataLoading(false)
    }
  };

  const onCompanyUserGridReady = (params: { api: GridApi }) => {
    companyUsersGridApiRef.current = params.api;
  };

  const handleCompanyUserViewPortChange = () => {};

  const handleCompanyUserToggleChange = (message: string, status: boolean) => {
    if (status) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCompanyUsers(searchParameter);
    } else if (!isOpen) {
      setCompanyUsersList([]);
      setIsCompanyUsersLoading(false);
      companyUsersFetchingRef.current = false;
      companyUsersGridApiRef.current = null;
      companyUserLastScrollPositionRef.current = 0;
      companyUserSearchParameterRef.current = "";
    }
  }, [isOpen, pageSize, currentPage, searchParameter]);
  if (!isOpen) return null;
  return (
    <div
      className={
        isSmallScreen
          ? "fixed inset-0 z-50 pt-10 pl-20 pr-2 overflow-hidden bg-black bg-opacity-45"
          : "fixed inset-0 z-50 p-2 overflow-hidden bg-black bg-opacity-45"
      }
    >
      <div className="flex min-h-screen mb-5 items-center justify-center">
        <div
          className="relative w-full max-w-6xl max-h-[95vh] bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:bg-gray-400
         [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-6">
              <Edit className="text-blue-500" size={SIZE.TWENTY_FOUR} />
              <h2 className="text-xl font-semibold text-gray-800">
                Disable Users
              </h2>
              <span className="text-sm font-semibold text-gray-800">
                Disable Users :{" "}
                {loginStatus.activeUsersInCompany -
                  loginStatus.subscriptionAllowedUsers >
                0 ? (
                  <span className="text-sm font-normal text-gray-800">
                    {" "}
                    {loginStatus.activeUsersInCompany -
                      loginStatus.subscriptionAllowedUsers}
                  </span>
                ) : (
                  <span className="text-sm font-normal text-gray-600">
                    No need to disable
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold text-gray-800">
                Subscription Allowed Users:{" "}
                <span className="text-sm font-normal text-gray-600">
                  {loginStatus.subscriptionAllowedUsers}
                </span>
              </span>
              <span className="text-sm font-semibold text-gray-800">
                Active users in company :{" "}
                <span className="text-sm font-normal text-gray-600">
                  {/* {loginStatus.activeUsersInCompany} */}
                  {statusChangeOfCompanyUserCountFromAggrid}
                </span>
              </span>
              <button
                onClick={() => {
                  //NOTE : WHEN X IS CLICKED IT WILL CHECK , ACTIVE USER CONDITION SATISFIES THEN , IT WILL NAVIGATE TO LOGIN PAGE
                  if (
                    loginStatus.activeUsersInCompany >=
                    statusChangeOfCompanyUserCountFromAggrid
                  ) {
                    localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
                    localStorage.removeItem(
                      LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT,
                    );
                    localStorage.removeItem(
                      LOCALSTORAGE_KEYS.GOOGLE_MEET_STATUS,
                    );
                    localStorage.removeItem(
                      LOCALSTORAGE_KEYS.ZOOM_MEETING_STATUS,
                    );
                    localStorage.removeItem(LOCALSTORAGE_KEYS.USER_PREFERENCE);
                    localStorage.removeItem(
                      LOCALSTORAGE_KEYS.NOTIFICATION_COUNT,
                    );
                    onRedirectToLoginPage();
                    navigate(ROUTES_URL.SIGN_IN);
                  } else {
                    onClose();
                  }
                }}
                className="absolute right-4 top-5 text-gray-400 hover:text-gray-600"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div>

            {userHasAccessToUpdateUser ? (
              <div className=" ">
                <div
                  className="ag-theme-balham"
                  style={{ height: "450px", width: "100%" }}
                >
                  <div className="flex gap-2 justify-between">
                    <div className=" w-full gap-28 translate-x-1">
                      <div className="flex w-full justify-center items-center ">
                        <span className="font-semibold">
                          Net Status Change Count:{" "}
                        </span>
                        <span>{statusChangeCount}</span>
                      </div>
                      {/* <span className="font-semibold">Search the User</span> */}
                      <div className="mb-1">
                        <SearchInput
                          placeholder="Search user by name, email, mobile number."
                          value={searchParameter}
                          onChange={(e) => {
                            handleSearchParameterChange(e.target.value);
                          }}
                        ></SearchInput>
                      </div>
                      {isCompanyUsersLoading && (
                        <div>
                          <LoadingPopUpAnimation show={isCompanyUsersLoading} />
                        </div>
                      )}
                    </div>
                  </div>
                  <AddCompanyTeamUsersAgGrid
                    companyUsers={companyUsersList}
                    handleViewPortChanged={handleCompanyUserViewPortChange}
                    onGridReady={onCompanyUserGridReady}
                    isGridForUpdateCompanyUser={true}
                    handleCompanyUserStatusChange={
                      handleCompanyUserStatusChange
                    }
                    isGridForSubscription={true}
                    handleCompanyUserToggleChange={
                      handleCompanyUserToggleChange
                    }
                    isDataLoading={isDataLoading}
                  />
                </div>
                <div className="flex items-center justify-end col-span-1 mt-1">
                  <PaginationWithoutCount
                    pageSize={pageSize}
                    currentPage={currentPage}
                    currentPageData={currentPageData}
                    onPageSizeChange={handlePageSizeChange}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            ) : (
              <div>
                <AccessDeniedMessagePage 
                message={`${MESSAGE.MODULE_ACCESS.COMPANY_USER.DENIED_UPDATE_ACCESS_COMPANY_USER}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleMessageSnackbarClose}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      /> */}
    </div>
  );
}
export default EditSubscriptionUsersModal;
