/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  themeAlpine,
  ViewportChangedEvent,
} from "ag-grid-community";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  INNERHTML,
  // NUMBER_VALUES,
  STATUS_CODE,
} from "../../constants/AppConstants";
import { UserPlus2 } from "lucide-react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import { AgGridReact } from "ag-grid-react";
import CompanyUsersSearchProps from "../../@types/company-users/CompanyUserProps";
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../../config/validations/RefreshToken";
import Button from "../ui/Button";
import { CLASS_NAMES } from "../../constants/ClassNames";
import SearchInput from "../ui/SearchInput";
import AddCompanyTeamUsersAgGrid from "./AddCompanyTeamUsersAgGrid";
// import MessageSnackBar from "../ui/MessageSnackbar";
// import {
//   MessageSnackbarState,
//   ShowMessageSnackbarProps,
// } from "../../@types/ui/MessageSnackbarProps";
import CompanyTeamUsersAgGridProps from "../../@types/ag-grid/CompanyTeamUsersAgGridProps";
import toast from "react-hot-toast";

function CompanyTeamUsersAgGrid({
  companyTeam,
  isOpen,
  companyProduct,
  isGridForProductUser,
  companyTeamUsersList,
  handleViewPortChanged,
  onGridReady,
  handleAddCompanyTeamUsers,
  handleCompanyUserCheckBoxChange,
  isCompanyUserNotAssignedReadyToFetch,
  addCompanyTeamAndProductUserArray,
  companyProductUsersList,
  handleSearchParameterChange,
  isAddUsersCompleted,
  usersUpdateCount,
}: CompanyTeamUsersAgGridProps) {
  const {
    userHasAccessToViewUser,
    userHasAccessToUpdateTeamManagement,
    userHasAccessToUpdateProductTeam,
  } = useUserAccessModules();

  const [companyUsersNotAssigned, setCompanyUsersNotAssigned] = useState<
    CompanyUsersSearchProps[]
  >([]);

  const [isCompanyUsersFetchedCount, setIsCompanyUsersFetched] =
    useState<number>(0);
  const { loginStatus } = useLoggedInUserContext();

  //states for infinite scroll AG grid
  const [isCompanyUsersLoading, setIsCompanyUsersLoading] =
    useState<boolean>(false);
  const [companyUserHasMore, setCompanyUserHasMore] = useState<boolean>(true);
  const companyUserFetchingRef = useRef<boolean>(false);
  const companyUserGridApiRef = useRef<GridApi | null>(null);
  const companyUserLastScrollPositionRef = useRef<number>(0);
  const companyUsersNotAssignedSearchParameterRef = useRef<string>("");

  const [
    companyUsersToAddToTeamsOrProduct,
    setCompanyUsersToAddToTeamsOrProduct,
  ] = useState<number[]>([]);

  const companyUserNotAssignedOnGridReady = (params: { api: GridApi }) => {
    companyUserGridApiRef.current = params.api;
  };

  // const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
  //   open: false,
  //   message: "",
  //   type: "success",
  // });

  // const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
  //   setMessageSnackbar({ open: true, message, type });
  // };

  // const handleMessageSnackbarClose = () => {
  //   setMessageSnackbar((prev) => ({ ...prev, open: false }));
  // };
  const [isCompanyUserSearchCleared, setIsCompanyUserSearchCleared] =
    useState<boolean>(true);

  const fetchCompanyUsersNotAssigned = async (
    companyUserNotAssignedSearchParameter: string
  ) => {
    if (
      !userHasAccessToViewUser ||
      isCompanyUsersLoading ||
      (!companyUserHasMore &&
        companyUserNotAssignedSearchParameter.length === 0) ||
      companyUserFetchingRef.current
    )
      return;
    try {
      companyUsersNotAssignedSearchParameterRef.current =
        companyUserNotAssignedSearchParameter;
      companyUserFetchingRef.current = true;
      setIsCompanyUsersLoading(true);

      // Save current scroll position before fetching
      if (companyUserGridApiRef.current) {
        const rowIndex =
          companyUserGridApiRef.current.getLastDisplayedRowIndex();
        if (rowIndex !== null) {
          companyUserLastScrollPositionRef.current = rowIndex;
        }
      }

      const getCompanyProductUserNotAssignedPostData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
        company_product_id: companyProduct?.id,
        limit: companyUserNotAssignedSearchParameter.length > 0 ? 0 : 50,
        offset:
          companyUserNotAssignedSearchParameter.length > 0
            ? 0
            : 50 * isCompanyUsersFetchedCount,
        isactive: true,
        search_company_specific_date_range_id: 0,
        search_parameter: companyUserNotAssignedSearchParameter,
        search_parameter_date: "",
      };
      const getCompanyTeamUserNotAssignedPostData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
        company_team_id: companyTeam?.id,
        limit: companyUserNotAssignedSearchParameter.length > 0 ? 0 : 50,
        offset:
          companyUserNotAssignedSearchParameter.length > 0
            ? 0
            : 50 * isCompanyUsersFetchedCount,
        search_company_specific_date_range_id: 0,
        isactive: true,
        search_parameter: companyUserNotAssignedSearchParameter,
        search_parameter_date: "",
      };

      const response = isGridForProductUser
        ? await axios.post(
            POST_API.GET_COMPANY_PRODUCT_USERS_NOT_ASSIGNED,
            getCompanyProductUserNotAssignedPostData,
            {
              withCredentials: true,
            }
          )
        : await axios.post(
            POST_API.GET_COMPANY_TEAM_USERS_NOT_ASSIGNED,
            getCompanyTeamUserNotAssignedPostData,
            {
              withCredentials: true,
            }
          );

      if (response.data) {
        const newUsers = response.data;
        if (newUsers.length === 0) {
          setCompanyUserHasMore(false);

          return;
        }
        if (
          newUsers.length > 0 &&
          newUsers?.count > companyUsersNotAssigned.length + newUsers.length
        ) {
          setCompanyUserHasMore(true); // Explicitly set to true after clearing search
        }
        if (companyUserNotAssignedSearchParameter.length === 0) {
          setIsCompanyUsersFetched(isCompanyUsersFetchedCount + 1);
        }
        if (companyUserNotAssignedSearchParameter.length === 0) {
          newUsers.map((user: any) => {
            setCompanyUsersNotAssigned((prev) => [
              ...prev,
              {
                company_id: user.company_id,
                count: user.count,
                createdby: user.createdby,
                createdon: user.createdon,
                email: user.email,
                fullname: user.fullname,
                isactive: user.isactive,
                mobilenumber: user.mobilenumber,
                id: user.id,
              },
            ]);
          });
        } else if (
          companyUserNotAssignedSearchParameter.length > 0 ||
          isCompanyUsersFetchedCount === 0
        ) {
          const transformedData = newUsers.map((user: any) => ({
            company_id: user.company_id,
            count: user.count,
            createdby: user.createdby,
            createdon: user.createdon,
            email: user.email,
            fullname: user.fullname,
            isactive: user.isactive,
            mobilenumber: user.mobilenumber,
            id: user.id,
          }));
          setCompanyUsersNotAssigned(transformedData);
        }

        // Restore scroll position after data update
        if (
          companyUserGridApiRef.current &&
          companyUserLastScrollPositionRef.current > 0
        ) {
          setTimeout(() => {
            if (companyUserGridApiRef.current) {
              companyUserGridApiRef.current.ensureIndexVisible(
                companyUserLastScrollPositionRef.current - 11
              );
            }
          }, 150);
        }

        if (companyUserNotAssignedSearchParameter.length === 0) {
          if (
            newUsers[0]?.count &&
            companyUsersNotAssigned.length + newUsers.length >=
              newUsers[0]?.count &&
            isCompanyUserSearchCleared
          ) {
            setCompanyUserHasMore(false);
          }
        }
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithParamsNotEvent: fetchCompanyUsersNotAssigned,
        });

        if (!refreshTokenResponse) {
          // setIsDialogueOpen(true);
        } else {
          // setIsDialogueOpen(false);
          companyUserFetchingRef.current = false;
          fetchCompanyUsersNotAssigned(companyUserNotAssignedSearchParameter);
        }
      }
    } finally {
      if (companyUserNotAssignedSearchParameter.length > 0) {
        setIsCompanyUsersLoading(false);
        companyUserFetchingRef.current = false;
        if (companyUsersNotAssignedSearchParameterRef.current.length === 1) {
          setCompanyUserHasMore(true);
          companyUserGridApiRef.current = null;
          companyUserLastScrollPositionRef.current = 0;
          setIsCompanyUsersFetched(0);
        }
      } else if (companyUserNotAssignedSearchParameter.length === 0) {
        setIsCompanyUsersLoading(false);
        companyUserFetchingRef.current = false;
      }
    }
  };

  const handleCompanyUserNotAssignedViewPortChanged = (
    params: ViewportChangedEvent
  ) => {
    if (!companyUsersNotAssigned.length || !companyUserHasMore) return;

    // Store the grid API reference
    if (!companyUserGridApiRef.current && params.api) {
      companyUserGridApiRef.current = params.api;
    }
    const lastVisibleRow = params.lastRow;
    const totalRowCount =
      companyUsersNotAssigned[companyUsersNotAssigned.length - 1]?.count;
    if (
      totalRowCount &&
      lastVisibleRow >= companyUsersNotAssigned.length - 5 &&
      companyUsersNotAssignedSearchParameterRef.current.length === 0
    ) {
      fetchCompanyUsersNotAssigned("");
    }
  };
  const handleCompanyUserSearchParameterChange = async (
    searchValue: string
  ) => {
    if (searchValue.length === 0) {
      setCompanyUsersNotAssigned([]);
      setIsCompanyUsersFetched(0);
      setIsCompanyUsersLoading(false);
      setCompanyUserHasMore(true);
      companyUserFetchingRef.current = false;
      companyUserGridApiRef.current = null;
      companyUserLastScrollPositionRef.current = 0;
      fetchCompanyUsersNotAssigned("");
      setIsCompanyUserSearchCleared(true);
    } else if (searchValue.length > 0) {
      setCompanyUsersNotAssigned([]);
      setIsCompanyUsersFetched(0);
      // setIsCompanyUsersLoading(false);
      setCompanyUserHasMore(true);
      // companyUserFetchingRef.current = false;
      companyUserGridApiRef.current = null;
      companyUserLastScrollPositionRef.current = 0;
      setIsCompanyUserSearchCleared(false);
      fetchCompanyUsersNotAssigned(searchValue);
    }
  };
  const handleAddCompanyUserCheckBoxChange = (
    params: CompanyUsersSearchProps,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setCompanyUsersToAddToTeamsOrProduct((prev) => [...prev, params.id]);
    } else if (!event.target.checked) {
      setCompanyUsersToAddToTeamsOrProduct((prev) =>
        prev.filter((id) => id !== params.id)
      );
    }
    handleCompanyUserCheckBoxChange(params, event);
  };

  useEffect(() => {
    if (!isOpen) {
      setCompanyUsersNotAssigned([]);
      setIsCompanyUsersFetched(0);
      setIsCompanyUsersLoading(false);
      setCompanyUserHasMore(true);
      companyUserFetchingRef.current = false;
      companyUserGridApiRef.current = null;
      companyUserLastScrollPositionRef.current = 0;
      companyUsersNotAssignedSearchParameterRef.current = "";
      setCompanyUsersToAddToTeamsOrProduct([]);
      // handleMessageSnackbarClose();
      setIsCompanyUserSearchCleared(true);
    } else if (
      isOpen &&
      isCompanyUserNotAssignedReadyToFetch &&
      companyUsersNotAssignedSearchParameterRef.current.length === 0
    ) {
      fetchCompanyUsersNotAssigned("");
    }
  }, [isOpen, isCompanyUserNotAssignedReadyToFetch]);

  const companyTeamColumnDefs = useMemo<ColDef[]>(
    () => [
      {
        filed: "id",
        sortable: true,
        hide: true,
      },
      {
        headerName: "name",
        field: "userName",
        flex: 1,
        sortable: true,
        filter: true,
      },
      {
        headerName: "Action",
        sortable: true,
        filter: true,
        pinned: "right",
        width: 100,
        cellRenderer: (params: any) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [isActive, setIsActive] = useState<boolean>(
            params.data.isActive
          );

          const handleCompanyTeamUsersToggle = async (
            event: React.FormEvent<HTMLButtonElement>
          ) => {
            setIsActive(params.data.isActive);
            if (userHasAccessToUpdateTeamManagement) {
              const updateCompanyTeamUserPostData = {
                company_id: loginStatus.companyId,
                id: parseInt(event.currentTarget.id),
                isactive: !isActive,
                updatedby: loginStatus.id,
              };
              await axios
                .post(
                  POST_API.UPDATE_COMPANY_TEAM_USERS,
                  updateCompanyTeamUserPostData,
                  {
                    withCredentials: true,
                  }
                )
                .then((response) => {
                  if (response.data.status) {
                    setIsActive(!isActive);
                    // showMessageSnackbar({
                    //   message: response.data.message,
                    //   type: "success",
                    // });
                    toast.success(response.data.message);
                    params.data.isActive = !isActive;
                  } else {
                    toast.error(response.data.message);
                  }
                })
                .catch(async (error: ApiError | any) => {
                  if (error.status === STATUS_CODE.UNATHORISED) {
                    const refreshTokenResponse = await RefreshToken({
                      callFunctionWithEvent: handleCompanyTeamUsersToggle,
                    });
                    if (refreshTokenResponse) {
                      handleCompanyTeamUsersToggle(event);
                    }
                  }
                });
            }
          };

          const handleCompanyProductUsersToggle = async (
            event: React.FormEvent<HTMLButtonElement>
          ) => {
            setIsActive(params.data.isActive);
            if (userHasAccessToUpdateProductTeam) {
              const updateCompanyProductUserPostData = {
                company_id: loginStatus.companyId,
                id: parseInt(event.currentTarget.id),
                isactive: !isActive,
                updatedby: loginStatus.id,
              };

              axios
                .post(
                  POST_API.UPDATE_COMPANY_PRODUCT_USERS,
                  updateCompanyProductUserPostData,
                  {
                    withCredentials: true,
                  }
                )
                .then((response) => {
                  if (response.data.status) {
                    setIsActive(!isActive);
                    // showMessageSnackbar({
                    //   message: response.data.message,
                    //   type: "success",
                    // });
                    toast.success(response.data.message);
                    params.data.isActive = !isActive;
                  } else {
                    toast.error(response.data.message);
                  }
                })
                .catch(async (error: ApiError | any) => {
                  if (error.status === STATUS_CODE.UNATHORISED) {
                    const refreshTokenResponse = await RefreshToken({
                      callFunctionWithEvent: handleCompanyProductUsersToggle,
                    });
                    if (refreshTokenResponse) {
                      handleCompanyProductUsersToggle(event);
                    }
                  }
                });
            }
          };
          return (
            <div className="flex flex-col items-center mt-3">
              <button
                id={params.data.id.toString()}
                className={`w-6 h-3 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-500"
                } text-white font-semibold`}
                onClick={(event) => {
                  if (!isGridForProductUser) {
                    handleCompanyTeamUsersToggle(event);
                  } else if (isGridForProductUser) {
                    handleCompanyProductUsersToggle(event);
                  }
                }}
              >
                <div
                  className={`bg-gray-200 h-2 w-2 transition-opacity rounded-full ${
                    isActive ? "float-end" : "float-start"
                  }`}
                ></div>
              </button>
            </div>
          );
        },
      },
    ],
    [usersUpdateCount, companyTeamUsersList, companyProductUsersList]
  );
  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      minWidth: 30,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);

  useEffect(() => {
    if (isAddUsersCompleted) {
      const updatedCompanyUsers = companyUsersNotAssigned.filter(
        (user) => !companyUsersToAddToTeamsOrProduct.includes(user.id)
      );
      setCompanyUsersNotAssigned(updatedCompanyUsers);
    }
  }, [isAddUsersCompleted]);

  return (
    <div className="flex justify-around gap-2 mb-9 py-10 ">
      <div
        className="ag-theme-balham"
        style={{ height: "300px", width: "45%" }}
      >
        <div className="flex w-full  gap-4 mb-2 justify-between">
          <div className="w-[60%]">
            <SearchInput
              onChange={(event) => {
                const searchValue = event.target.value;
                handleSearchParameterChange(searchValue);
              }}
            ></SearchInput>
          </div>
          <div className="text-base font-semibold mt-2 text-gray-700">
            Team Members
          </div>
        </div>

        <AgGridReact
          rowData={
            isGridForProductUser
              ? companyProductUsersList!
              : companyTeamUsersList!
          }
          columnDefs={companyTeamColumnDefs}
          defaultColDef={defaultColDef}
          modules={[AllCommunityModule]}
          overlayNoRowsTemplate={
            isGridForProductUser
              ? companyProductUsersList!.length === 0
                ? "No users assigned to this product"
                : INNERHTML.OVERLAY_NO_ROWS_TEMPLATE
              : companyTeamUsersList!.length === 0
              ? "No users assigned to this product"
              : INNERHTML.OVERLAY_NO_ROWS_TEMPLATE
          }
          theme={themeAlpine}
          onViewportChanged={handleViewPortChanged}
          onGridReady={onGridReady}
        />
      </div>
      <div
        className="ag-theme-balham"
        style={{ height: "300px", width: "49%" }}
      >
        <div className="flex w-full gap-2 mb-2 justify-between">
            <div className="w-[60%]">
            <SearchInput
              onChange={(event) => {
                const searchValue = event.target.value;
                handleCompanyUserSearchParameterChange(searchValue);
              }}
            ></SearchInput>
          </div>
          <div className="justify-self-end">
            {!isGridForProductUser && (
              <Button onClick={handleAddCompanyTeamUsers}>
                <UserPlus2
                  className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                ></UserPlus2>{" "}
                Add To Team
              </Button>
            )}

            {isGridForProductUser && (
              <Button   onClick={handleAddCompanyTeamUsers}>
                {" "}
                <UserPlus2
                  className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                ></UserPlus2>{" "}
                Assign Users
              </Button>
            )}
          </div>
        </div>
        <AddCompanyTeamUsersAgGrid
          companyUsers={companyUsersNotAssigned}
          handleViewPortChanged={handleCompanyUserNotAssignedViewPortChanged}
          onGridReady={companyUserNotAssignedOnGridReady}
          addCompanyTeamUserArray={addCompanyTeamAndProductUserArray}
          handleCompanyUserCheckBoxChange={handleAddCompanyUserCheckBoxChange}
          isGridForSubscription={false}
        />
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

export default CompanyTeamUsersAgGrid;
