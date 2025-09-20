/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditIcon, Network, X } from "lucide-react";
import useScreenSize from "../../../config/hooks/useScreenSize";
import { SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import CompanyProductTeamsAgGrid from "../../ag-grid/CompanyProductTeamsAgGrid";
import TeamManagementAgGrid from "../../ag-grid/TeamManagementAgGrid";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import CompanyProductTeam from "../../../@types/product-teams-management/CompanyProductTeam";
import { useEffect, useRef, useState } from "react";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import CompanyTeamSearchProps from "../../../@types/team-management/CompanyTeamListProps";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { GridApi, ViewportChangedEvent } from "ag-grid-community";
// import {
//   MessageSnackbarState,
//   ShowMessageSnackbarProps,
// } from "../../../@types/ui/MessageSnackbarProps";
// import MessageSnackBar from "../../ui/MessageSnackbar";
import Button from "../../ui/Button";
import { CLASS_NAMES } from "../../../constants/ClassNames";
import CompanyProductTeamsModalProps from "../../../@types/modal/CompanyProductTeamsModalProps";
import SearchInput from "../../ui/SearchInput";
import toast from "react-hot-toast";
function CompanyProductTeamsModal({
  isOpen,
  onClose,
  companyProduct,
}: CompanyProductTeamsModalProps) {
  const { isSmallScreen } = useScreenSize();
  const {
    userHasAccessToViewProductTeam,
    userHasAccessToViewTeamManagement,
    userHasAccessToAddProductTeam,
  } = useUserAccessModules();

  const [companyProductTeamsList, setCompanyProductsTeamsList] = useState<
    CompanyProductTeam[]
  >([]);

  const [companyTeamsNotAssignedList, setCompanyTeamsNotAssignedList] =
    useState<CompanyTeamSearchProps[]>([]);
  const [
    isCompanyTeamsNotAssignedReadyToFetch,
    setIsCompanyTeamsNotAssignedReadyToFetch,
  ] = useState<boolean>(false);
  const [
    isCompanyTeamsNotAssignedLoading,
    setIsCompanyTeamsNotAssignedLoading,
  ] = useState(false);
  const [companyTeamsNotAssignedHasMore, setCompanyTeamsNotAssignedHasMore] =
    useState(true);
  const companyTeamsNotAssignedFetchingRef = useRef(false);
  const companyTeamsNotAssignedGridApiRef = useRef<GridApi | null>(null);
  const companyTeamsNotAssignedLastScrollPositionRef = useRef<number>(0);
  const companyTeamsNotassignedSearchParameterRef = useRef<string>("");

  const [
    isCompanyProductTeamsFetchedForFirstTime,
    setIsCompanyProductTeamsFetchedForFirstTime,
  ] = useState<boolean>(true);

  const [
    companyTeamsNotAssignedFetchedCount,
    setCompanyTeamsNotAssignedFetchedCount,
  ] = useState<number>(0);
  const [companyProductTeamsFetchedCount, setCompanyProductTeamsFetchedCount] =
    useState<number>(0);

  const [isCompanyProductTeamsLoading, setIsCompanyProductTeamsLoading] =
    useState<boolean>(false);
  const [companyProductTeamsHasMore, setCompanyProductTeamsHasMore] =
    useState<boolean>(true);
  const companyProductTeamsFetchingRef = useRef(false);
  const companyProductTeamsGridApiRef = useRef<GridApi | null>(null);
  const companyProductTeamsLastScrollPositionRef = useRef<number>(0);
  const companyProductTeamsSearchParamterRef = useRef<string>("");

  const { loginStatus } = useLoggedInUserContext();

  const [addCompanyProductTeamArray, setAddCompanyProductTeamArray] = useState<
    number[]
  >([]);
  const [companyProductTeamAddCount, setCompanyProductTeamAddCount] =
    useState<number>(0);

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
  const handleCompanyProductTeamUpdate = (message: string) => {
    // showMessageSnackbar({ message: message, type: "success" });
    toast.success(message);
  };

  const handleAddCompanyProductTeamChange = () => {
    setCompanyProductTeamAddCount(companyProductTeamAddCount + 1);
    setCompanyProductTeamsFetchedCount(0);
    setCompanyProductTeamsHasMore(true);
    setCompanyProductsTeamsList([]);
  };

  const handleCompanyTeamCheckboxChange = (
    params: CompanyTeamSearchProps,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      // alert("added : " + params.id);
      setAddCompanyProductTeamArray((prev) => [...prev, params.id]);
    } else if (!event.target.checked) {
      // alert("removed : " + params.id);
      setAddCompanyProductTeamArray((prev) =>
        prev.filter((id) => id !== params.id)
      );
    }
  };

  const handleAddCompanyProductTeam = async () => {
    if (userHasAccessToAddProductTeam) {
      const createCompanyProductTeamPostData = {
        company_id: loginStatus.companyId,
        company_product_id: companyProduct.id,
        company_team_array: addCompanyProductTeamArray,
        createdby: loginStatus.id,
      };
      await axios
        .post(
          POST_API.CREATE_COMPANY_PRODUCT_TEAM,
          createCompanyProductTeamPostData,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.data.status && response.data) {
            // showMessageSnackbar({
            //   message: response.data.message,
            //   type: "success",
            // });
            toast.success(response.data.message);
            const updatedCompanyTeams = companyTeamsNotAssignedList.filter(
              (team) => !addCompanyProductTeamArray.includes(team.id)
            );
            setCompanyTeamsNotAssignedList(updatedCompanyTeams);
            setCompanyProductsTeamsList([]);
            handleAddCompanyProductTeamChange();
            setCompanyProductTeamsFetchedCount(0);
            setIsCompanyProductTeamsLoading(false);
            setAddCompanyProductTeamArray([]);
          } else if (!response.data.status) {
            // showMessageSnackbar({
            //   message: response.data.message,
            //   type: "error",
            // });
            toast.error(response.data.message);
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunction: handleAddCompanyProductTeam,
            });

            if (refreshTokenResponse) {
              handleAddCompanyProductTeam();
            }
          }
        });
    }
  };

  const fetchCompanyProductTeams = async (
    companyProductTeamsSearchParameter: string
  ) => {
    if (
      !userHasAccessToViewProductTeam ||
      isCompanyProductTeamsLoading ||
      (!companyProductTeamsHasMore &&
        companyProductTeamsSearchParameter.length === 0) ||
      companyProductTeamsFetchingRef.current
    )
      return;

    try {
      companyProductTeamsSearchParamterRef.current =
        companyProductTeamsSearchParameter;
      companyProductTeamsFetchingRef.current = true;
      setIsCompanyProductTeamsLoading(true);

      // Save current scroll position before fetching
      if (companyProductTeamsGridApiRef.current) {
        const rowIndex =
          companyProductTeamsGridApiRef.current.getLastDisplayedRowIndex();
        if (rowIndex !== null) {
          companyProductTeamsLastScrollPositionRef.current = rowIndex;
        }
      }

      const getCompanyProductTeamsPostData = {
        company_id: loginStatus.companyId,
        company_product_id: companyProduct.id,
        company_team_id: 0,
        isactive: null,
        search_company_specific_date_range_id: 0,
        search_parameter: companyProductTeamsSearchParameter,
        search_parameter_date: "",
        offset:
          companyProductTeamsSearchParameter.length > 0
            ? 0
            : 40 * companyProductTeamsFetchedCount,
        limit: companyProductTeamsSearchParameter.length > 0 ? 0 : 40,
        requestedby: loginStatus.id,
      };
      const response = await axios.post(
        POST_API.GET_COMPANY_PRODUCT_TEAMS,
        getCompanyProductTeamsPostData,
        {
          withCredentials: true,
        }
      );
      if (response.status === STATUS_CODE.OK) {
        const newCompanyProductTeams = response.data;
        if (isCompanyProductTeamsFetchedForFirstTime) {
          setIsCompanyTeamsNotAssignedReadyToFetch(true);
        }
        if (companyProductTeamsSearchParameter.length === 0) {
          setCompanyProductTeamsFetchedCount(
            companyProductTeamsFetchedCount + 1
          );
        }
        setIsCompanyProductTeamsFetchedForFirstTime(false);

        if (newCompanyProductTeams.length === 0) {
          setCompanyProductTeamsHasMore(false);
        }
        if (companyProductTeamsSearchParameter.length === 0) {
          newCompanyProductTeams.map((res: any) => {
            setCompanyProductsTeamsList((prev) => [
              ...prev,
              {
                count: res.count,
                id: res.id,
                companyProductId: res.company_product_id,
                productName: res["Product Name"],
                productCode: res["Product Code"],
                companyTeamId: res.company_team_id,
                teamName: res["Team Name"],
                isActive: res.isactive,
                createdBy: res.createdby,
                createdOn: res.createdon,
              },
            ]);
          });
        } else if (companyProductTeamsSearchParameter.length > 0) {
          const transformedData = newCompanyProductTeams.map((res: any) => ({
            count: res.count,
            id: res.id,
            companyProductId: res.company_product_id,
            productName: res["Product Name"],
            productCode: res["Product Code"],
            companyTeamId: res.company_team_id,
            teamName: res["Team Name"],
            isActive: res.isactive,
            createdBy: res.createdby,
            createdOn: res.createdon,
          }));
          setCompanyProductsTeamsList(transformedData);
        }

        if (
          companyProductTeamsGridApiRef.current &&
          companyProductTeamsLastScrollPositionRef.current > 0
        ) {
          setTimeout(() => {
            if (companyProductTeamsGridApiRef.current) {
              companyProductTeamsGridApiRef.current.ensureIndexVisible(
                companyProductTeamsLastScrollPositionRef.current - 11
              );
            }
          }, 150);
        }

        if (
          newCompanyProductTeams[0]?.count &&
          companyProductTeamsList.length + newCompanyProductTeams.length >=
            newCompanyProductTeams[0].count
        ) {
          setCompanyProductTeamsHasMore(false);
        }
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithParamsNotEvent: fetchCompanyProductTeams,
        });
        if (refreshTokenResponse) {
          companyProductTeamsFetchingRef.current = false;
          fetchCompanyProductTeams(companyProductTeamsSearchParameter);
        }
      }
    } finally {
      if (companyProductTeamsSearchParameter.length > 0) {
        setCompanyProductTeamsHasMore(true);
        setIsCompanyProductTeamsLoading(false);
        companyProductTeamsFetchingRef.current = false;
        if (companyProductTeamsSearchParamterRef.current.length === 1) {
          companyProductTeamsGridApiRef.current = null;
          companyProductTeamsLastScrollPositionRef.current = 0;
          setCompanyProductTeamsFetchedCount(0);
        }
      } else if (companyProductTeamsSearchParameter.length === 0) {
        setIsCompanyProductTeamsLoading(false);
        companyProductTeamsFetchingRef.current = false;
      }
    }
  };

  const fetchCompanyTeamsNotAssigned = async (
    companyTeamsNotAssignedSearchParameter: string
  ) => {
    if (
      !userHasAccessToViewTeamManagement ||
      isCompanyTeamsNotAssignedLoading ||
      !companyTeamsNotAssignedHasMore ||
      companyTeamsNotAssignedFetchingRef.current
    )
      return;

    try {
      companyTeamsNotassignedSearchParameterRef.current =
        companyTeamsNotAssignedSearchParameter;
      companyTeamsNotAssignedFetchingRef.current = true;
      setIsCompanyTeamsNotAssignedLoading(true);

      // Save current scroll position before fetching
      if (companyTeamsNotAssignedGridApiRef.current) {
        const rowIndex =
          companyTeamsNotAssignedGridApiRef.current.getLastDisplayedRowIndex();
        if (rowIndex !== null) {
          companyTeamsNotAssignedLastScrollPositionRef.current = rowIndex;
        }
      }

      const getCompanyTeamsPostData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
        company_product_id: companyProduct.id,
        isactive: true,
        limit: companyTeamsNotAssignedSearchParameter.length > 0 ? 0 : 40,
        offset:
          companyTeamsNotAssignedSearchParameter.length > 0
            ? 0
            : 40 * companyTeamsNotAssignedFetchedCount,
        searcsearch_company_specific_date_range_id: 0,
        search_parameter: companyTeamsNotAssignedSearchParameter,
        search_parameter_date: "",
      };
      const response = await axios.post(
        POST_API.GET_COMPANY_PRODUCT_TEAMS_NOT_ASSIGNED,
        getCompanyTeamsPostData,
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        if (companyTeamsNotAssignedSearchParameter.length === 0) {
          setCompanyTeamsNotAssignedFetchedCount(
            companyTeamsNotAssignedFetchedCount + 1
          );
        }

        const newcompanyTeams = response.data;

        if (newcompanyTeams.length === 0) {
          setCompanyTeamsNotAssignedHasMore(false);
          return;
        }
        if (companyTeamsNotAssignedSearchParameter.length === 0) {
          newcompanyTeams.map((team: any) => {
            setCompanyTeamsNotAssignedList((prev) => [
              ...prev,
              {
                count: team.count,
                id: team.id,
                companyId: team.company_id,
                name: team.name,
                description: team.description,
                isActive: team.isactive,
                createdBy: team.createdby,
                createdOn: team.createdon,
              },
            ]);
          });
        } else if (companyTeamsNotAssignedSearchParameter.length > 0) {
          const transformedData: CompanyTeamSearchProps[] = newcompanyTeams.map(
            (team: any) => ({
              count: team.count,
              id: team.id,
              companyId: team.company_id,
              name: team.name,
              description: team.description,
              isActive: team.isactive,
              createdBy: team.createdby,
              createdOn: team.createdon,
            })
          );

          setCompanyTeamsNotAssignedList(transformedData);
        }

        // Restore scroll position after data update
        if (
          companyTeamsNotAssignedGridApiRef.current &&
          companyTeamsNotAssignedLastScrollPositionRef.current > 0
        ) {
          setTimeout(() => {
            if (companyTeamsNotAssignedGridApiRef.current) {
              companyTeamsNotAssignedGridApiRef.current.ensureIndexVisible(
                companyTeamsNotAssignedLastScrollPositionRef.current - 11
              );
            }
          }, 150);
        }
        if (
          newcompanyTeams[0]?.count &&
          companyTeamsNotAssignedList.length + newcompanyTeams.length >=
            newcompanyTeams[0].count
        ) {
          setCompanyTeamsNotAssignedHasMore(false);
        }
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithParamsNotEvent: fetchCompanyTeamsNotAssigned,
        });

        if (refreshTokenResponse) {
          companyTeamsNotAssignedFetchingRef.current = false;
          fetchCompanyTeamsNotAssigned(companyTeamsNotAssignedSearchParameter);
        }
      }
    } finally {
      if (companyTeamsNotAssignedSearchParameter.length > 0) {
        setIsCompanyTeamsNotAssignedLoading(false);
        companyTeamsNotAssignedFetchingRef.current = false;
        setCompanyTeamsNotAssignedHasMore(true);
        if (companyTeamsNotassignedSearchParameterRef.current.length === 1) {
          setCompanyTeamsNotAssignedFetchedCount(0);
          companyProductTeamsGridApiRef.current = null;
          companyProductTeamsLastScrollPositionRef.current = 0;
        }
      } else if (companyTeamsNotAssignedSearchParameter.length === 0) {
        setIsCompanyTeamsNotAssignedLoading(false);
        companyTeamsNotAssignedFetchingRef.current = false;
      }
    }
  };

  const handleCompanyTeamsNotAssignedViewPortChanged = (
    params: ViewportChangedEvent
  ) => {
    if (!companyTeamsNotAssignedList.length || !companyTeamsNotAssignedHasMore)
      return;

    // Store the grid API reference
    if (!companyTeamsNotAssignedGridApiRef.current && params.api) {
      companyTeamsNotAssignedGridApiRef.current = params.api;
    }

    const lastVisibleRow = params.lastRow;
    const totalRowCount = companyTeamsNotAssignedList[0]?.count;

    if (
      totalRowCount &&
      lastVisibleRow >= companyTeamsNotAssignedList.length - 1 &&
      companyTeamsNotassignedSearchParameterRef.current.length === 0
    ) {
      fetchCompanyTeamsNotAssigned("");
    }
  };
  const companyTeamsNotAssignedOnGridReady = (params: { api: GridApi }) => {
    companyTeamsNotAssignedGridApiRef.current = params.api;
  };

  const handleCompanyProductTeamsViewPortChanged = (
    params: ViewportChangedEvent
  ) => {
    if (!companyProductTeamsList.length || !companyProductTeamsHasMore) return;

    if (!companyProductTeamsGridApiRef.current && params.api) {
      companyProductTeamsGridApiRef.current = params.api;
    }

    const lastVisibleRow = params.lastRow;
    const totalRowCount =
      companyProductTeamsList[companyProductTeamsList.length - 1]?.count;

    if (
      totalRowCount &&
      lastVisibleRow >= companyProductTeamsList.length - 5 &&
      companyProductTeamsSearchParamterRef.current.length === 0
    ) {
      fetchCompanyProductTeams("");
    }
  };

  const companyProductTeamsOnGridReady = (params: { api: GridApi }) => {
    companyProductTeamsGridApiRef.current = params.api;
  };
  const handleCompanyProductTeamsSearchParameterChange = (
    searchValue: string
  ) => {
    if (searchValue.length % 2 === 0) {
      setCompanyProductsTeamsList([]);
      setCompanyProductTeamsHasMore(true);
      setCompanyProductTeamsFetchedCount(0);
      setIsCompanyProductTeamsLoading(false);
      companyProductTeamsFetchingRef.current = false;
      companyProductTeamsGridApiRef.current = null;
      companyProductTeamsLastScrollPositionRef.current = 0;
      fetchCompanyProductTeams(searchValue);
    }
  };

  const handleCompanyTeamsNotAssignedSearchParameterCgange = (
    searchValue: string
  ) => {
    if (searchValue.length % 2 === 0) {
      setCompanyTeamsNotAssignedList([]);
      setCompanyTeamsNotAssignedHasMore(true);
      setCompanyTeamsNotAssignedFetchedCount(0);
      setIsCompanyTeamsNotAssignedLoading(false);
      companyTeamsNotAssignedFetchingRef.current = false;
      companyTeamsNotAssignedGridApiRef.current = null;
      companyTeamsNotAssignedLastScrollPositionRef.current = 0;
      fetchCompanyTeamsNotAssigned(searchValue);
    }
  };

  useEffect(() => {
    if (isOpen && !isCompanyProductTeamsLoading) {
      fetchCompanyProductTeams("");
    }
  }, [isOpen, companyProductTeamAddCount]);

  useEffect(() => {
    if (isOpen && isCompanyTeamsNotAssignedReadyToFetch) {
      fetchCompanyTeamsNotAssigned("");
    } else if (!isOpen) {
      setCompanyTeamsNotAssignedList([]);
      setAddCompanyProductTeamArray([]);
      setCompanyProductsTeamsList([]);

      setCompanyTeamsNotAssignedHasMore(true);
      setIsCompanyProductTeamsLoading(false);
      companyTeamsNotAssignedFetchingRef.current = false;
      companyTeamsNotAssignedGridApiRef.current = null;
      companyTeamsNotAssignedLastScrollPositionRef.current = 0;

      setCompanyProductTeamsHasMore(true);
      setIsCompanyProductTeamsLoading(false);
      companyProductTeamsFetchingRef.current = false;
      companyProductTeamsGridApiRef.current = null;
      companyProductTeamsLastScrollPositionRef.current = 0;

      setCompanyTeamsNotAssignedFetchedCount(0);
      setCompanyProductTeamsFetchedCount(0);
      setIsCompanyProductTeamsFetchedForFirstTime(true);
      setIsCompanyTeamsNotAssignedReadyToFetch(false);
      // handleMessageSnackbarClose();
      // setIsCompanyTeamsNotAssignedLoading(false);
    }
  }, [isCompanyTeamsNotAssignedReadyToFetch, isOpen]);

  if (!isOpen) return null;
  return (
    <div
      className={
        isSmallScreen
          ? "fixed inset-0 z-50 pl-20 pt-10 overflow-hidden bg-black bg-opacity-5"
          : "fixed inset-0 z-50 justify-content-center pl-28 p-16 pt-2 overflow-hidden bg-black bg-opacity-5"
      }
    >
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="relative w-full max-w-6xl min-w-full max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          <div className="p-4">
            <div className="flex border-b items-center gap-2 mb-6  sticky bg-white py-1">
              <EditIcon className="text-blue-500" size={SIZE.TWENTY} />
              <h2 className="text-lg font-semibold text-gray-800">
                Edit product {companyProduct.name} Teams
              </h2>
              <button
                onClick={() => {
                  onClose();
                }}
                className="absolute right-1 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div>
            {/*Aggrid logic here */}
            <div className="flex justify-around gap-3 mb-16 pb-4">
              <div
                // className="ag-theme-balham"
                style={{ height: "300px", width: "45%" }}
              >
                <div className="flex w-full gap-2 mb-1 mt-2 justify-between">
                  <div className="w-[60%]">
                    <SearchInput
                      // readonly = {isCompanyProductTeamsLoading}
                      // inputMode="numeric"
                      onChange={(event) => {
                        const searchValue = event.target.value;
                        handleCompanyProductTeamsSearchParameterChange(
                          searchValue
                        );
                      }}
                    ></SearchInput>
                  </div>
                  <div className="table-header-custom mt-2">
                    Assigned Teams
                  </div>
                </div>
                <div className="ag-theme-balham w-full h-full mt-2">
                  <CompanyProductTeamsAgGrid
                    companyProductTeams={companyProductTeamsList}
                    handleCompanyProductTeamUpdate={
                      handleCompanyProductTeamUpdate
                    }
                    handleViewPortChanged={
                      handleCompanyProductTeamsViewPortChanged
                    }
                    onGridReady={companyProductTeamsOnGridReady}
                  ></CompanyProductTeamsAgGrid>
                </div>
              </div>

              <div
                className="ag-theme-alpine"
                style={{ height: "300px", width: "45%" }}
              >
                <div className="flex gap-2 mb-1 mt-2 justify-between">
                  <div className="w-[60%]">
                    <SearchInput
                      // readonly = {isCompanyProductTeamsLoading}
                      // inputMode="numeric"
                      onChange={(event) => {
                        const searchValue = event.target.value;
                        handleCompanyTeamsNotAssignedSearchParameterCgange(
                          searchValue
                        );
                      }}
                    ></SearchInput>
                  </div>
                  <div>
                    {" "}
                    <Button onClick={handleAddCompanyProductTeam}>
                      <Network
                        className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                      ></Network>
                      Assign Teams
                    </Button>
                  </div>
                </div>

                <TeamManagementAgGrid
                  companyTeamList={companyTeamsNotAssignedList}
                  isGridForProductTeam={true}
                  handleCompanyTeamCheckboxChange={
                    handleCompanyTeamCheckboxChange
                  }
                  addCompanyProductTeamArray={addCompanyProductTeamArray}
                  handleViewPortChanged={
                    handleCompanyTeamsNotAssignedViewPortChanged
                  }
                  onGridReady={companyTeamsNotAssignedOnGridReady}
                />
              </div>
            </div>
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

export default CompanyProductTeamsModal;
