/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit, X } from "lucide-react";
import useScreenSize from "../../../config/hooks/useScreenSize";
import { NUMBER_VALUES, SIZE } from "../../../constants/AppConstants";
import SearchInput from "../../ui/SearchInput";

import AddCompanyTeamUsersAgGrid from "../../ag-grid/AddCompanyTeamUsersAgGrid";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { useEffect, useRef, useState } from "react";
import companyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import { GridApi, ViewportChangedEvent } from "ag-grid-community";
import ApiError from "../../../@types/error/ApiError";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import {  useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";
import MessageSnackBar from "../../ui/MessageSnackbar";
import { MessageSnackbarState, ShowMessageSnackbarProps } from "../../../@types/ui/MessageSnackbarProps";

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

  const [
    statusChangeOfCompanyUserCountFromAggrid,
    setStatusChangeOfCompanyUserCountFromAggrid,
  ] = useState<number>(loginStatus.activeUsersInCompany);
  const [companyUsersFetchedCount, setCompanyUsersFetchedCount] =
    useState<number>(0);

  const handleCompanyUserStatusChange = (statusChangeCount: number) => {
    setStatusChangeOfCompanyUserCountFromAggrid(
      statusChangeOfCompanyUserCountFromAggrid + statusChangeCount
    );
  };
  const [
    isCompanyUsersSearchParameterCleared,
    setIsCompanyUsersSearchParameterCleared,
  ] = useState<boolean>(true);
  const [companyUsersHasMore, setCompanyUsersHasMore] = useState<boolean>(true);
  const [isCompanyUsersLoading, setIsCompanyUsersLoading] =
    useState<boolean>(false);
  const companyUsersFetchingRef = useRef<boolean>(false);

  const companyUsersGridApiRef = useRef<GridApi | null>(null);
  const companyUserLastScrollPositionRef = useRef<number>(0);

  const companyUserSearchParameterRef = useRef<string>("");


  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
      open: false,
      message: "",
      type: "success",
    });
  
    const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
      setMessageSnackbar({ open: true, message, type });
    };
  
    const handleMessageSnackbarClose = () => {
      setMessageSnackbar((prev) => ({ ...prev, open: false }));
    };

  const fetchCompanyUsers = async (comapnyUserSearchParameter: string) => {
   
    if (isCompanyUsersLoading ||(!companyUsersHasMore && comapnyUserSearchParameter.length === 0) ||
      companyUsersFetchingRef.current
    )
      return;

    try {
      companyUserSearchParameterRef.current = comapnyUserSearchParameter;
      setIsCompanyUsersLoading(true);
      companyUsersFetchingRef.current = true;

      if (companyUsersGridApiRef.current) {
        const rowIndex =
          companyUsersGridApiRef.current.getLastDisplayedRowIndex();
        if (rowIndex !== null) {
          companyUserLastScrollPositionRef.current = rowIndex;
        }
      }

      const getCompanyUserPostData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
        limit: comapnyUserSearchParameter.length > 0 ? 0 : 50,
        offset:
          comapnyUserSearchParameter.length > 0
            ? 0
            : 50 * companyUsersFetchedCount,
        search_company_specific_date_range_id: 0,
        search_parameter: comapnyUserSearchParameter,
        search_parameter_date: "",
      };

      // alert("called from here ");
      const response = await axios.post(
        POST_API.GET_COMPANY_USERS,
        getCompanyUserPostData,
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        const newUsers = response.data;

        if (newUsers.length === 0) {
          setCompanyUsersHasMore(false);

          return;
        }
        if (comapnyUserSearchParameter.length === 0) {
          setCompanyUsersFetchedCount(companyUsersFetchedCount + 1);
        }
        newUsers.map((user: any) => {
          setCompanyUsersList((prev) => [
            ...prev,
            {
              company_id: user.company_id,
              createdby: user.createdby,
              createdon: user.createdon,
              email: user.email,
              fullname: user.fullname,
              isactive: user.isactive,
              id: user.id,
              mobilenumber: user.mobilenumber,
              password: user.password,
              updatedby: user.upadtedby,
              updatedon: user.updatedon,
              count: user.count,
            },
          ]);
        });

        if (
          companyUsersGridApiRef.current &&
          companyUserLastScrollPositionRef.current > 0
        ) {
          setTimeout(() => {
            if (companyUsersGridApiRef.current) {
              companyUsersGridApiRef.current.ensureIndexVisible(
                companyUserLastScrollPositionRef.current - 11
              );
            }
          }, 150);
        }

        if (
          newUsers[0]?.count &&
          companyUsersList.length + newUsers.length >= newUsers[0].count &&
          !isCompanyUsersSearchParameterCleared
        ) {
          setCompanyUsersHasMore(false);
        }
      }
    } catch (error: ApiError | any) {
      console.error(error);
    } finally {
      if (comapnyUserSearchParameter.length > 0) {
        setIsCompanyUsersLoading(false);
        companyUsersFetchingRef.current = false;
        setCompanyUsersHasMore(true);
        if (companyUserSearchParameterRef.current.length === 1) {
          setCompanyUsersFetchedCount(0);
          companyUsersGridApiRef.current = null;
          companyUserLastScrollPositionRef.current = 0;
        }
      } else if (comapnyUserSearchParameter.length === 0) {
        setIsCompanyUsersLoading(false);
        companyUsersFetchingRef.current = false;
      }
    }
  };

  const onCompanyUserGridReady = (params: { api: GridApi }) => {
    companyUsersGridApiRef.current = params.api;
  };

  const handleCompanyUserViewPortChange = (params: ViewportChangedEvent) => {
    if (!companyUsersHasMore && !companyUsersList.length) return;

    if (!companyUsersGridApiRef.current && params.api) {
      companyUsersGridApiRef.current = params.api;
    }

    const lastVisibleRow = params.lastRow;
    const totalRowCount = companyUsersList[0]?.count;

    if (
      totalRowCount &&
      lastVisibleRow >= companyUsersList.length - 5 &&
      companyUserSearchParameterRef.current.length === 0
    ) {
      fetchCompanyUsers("");
    }
  };

  const handleSearchParameterChange = (searchValue: string) => {
    if (searchValue.length > 0) {
      setCompanyUsersList([]);
      setIsCompanyUsersSearchParameterCleared(false);
      setCompanyUsersHasMore(true);

      companyUsersGridApiRef.current = null;
      companyUserLastScrollPositionRef.current = 0;
      companyUsersFetchingRef.current = false;
      setCompanyUsersFetchedCount(0);
      fetchCompanyUsers(searchValue);
    } else if (searchValue.length === 0) {
      setCompanyUsersList([]);
      setIsCompanyUsersSearchParameterCleared(true);
      setCompanyUsersHasMore(true);
      setIsCompanyUsersLoading(false);
      companyUsersGridApiRef.current = null;
      companyUserLastScrollPositionRef.current = 0;
      companyUsersFetchingRef.current = false;
      setCompanyUsersFetchedCount(0);
      fetchCompanyUsers("");
    }
  };

  const handleCompanyUserToggleChange =(message :string, status : boolean)=>{
    showMessageSnackbar({
      message: message,
      type : status ? 'success' : 'error',
    })
  }

  useEffect(() => {
    if (isOpen) {
      fetchCompanyUsers("");
    } else if (!isOpen) {
      setCompanyUsersList([]);
      setCompanyUsersFetchedCount(0);
      setIsCompanyUsersSearchParameterCleared(true);
      setCompanyUsersHasMore(true);
      setIsCompanyUsersLoading(false);
      companyUsersFetchingRef.current = false;
      companyUsersGridApiRef.current = null;
      companyUserLastScrollPositionRef.current = 0;
      companyUserSearchParameterRef.current = "";
    }
  }, [isOpen]);
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
          className="relative w-full max-w-6xl max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:bg-gray-400
         [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          <div className="p-7 mb-20">
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
                    localStorage.clear();
                    onRedirectToLoginPage();
                    navigate(ROUTES_URL.SIGN_IN);
                  } else {
                    onClose();
                  }
                }}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div>

            <div
              className="ag-theme-alpine"
              style={{ height: "300px", width: "100%" }}
            >
              <div className="flex gap-2 mb-2 justify-between">
                <div className="flex gap-28">
                  {/* <span className="font-semibold">Search the User</span> */}
                  <SearchInput
                    onChange={(event) => {
                      handleSearchParameterChange(event.target.value);
                    }}
                  ></SearchInput>
                </div>
              </div>
              <AddCompanyTeamUsersAgGrid
                companyUsers={companyUsersList}
                handleViewPortChanged={handleCompanyUserViewPortChange}
                onGridReady={onCompanyUserGridReady}
                isGridForUpdateCompanyUser={true}
                handleCompanyUserStatusChange={handleCompanyUserStatusChange}
                isGridForSubscription={true}
                handleCompanyUserToggleChange={handleCompanyUserToggleChange}
              />
            </div>
          </div>
        </div>
      </div>
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleMessageSnackbarClose}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </div>
  );
}
export default EditSubscriptionUsersModal;
