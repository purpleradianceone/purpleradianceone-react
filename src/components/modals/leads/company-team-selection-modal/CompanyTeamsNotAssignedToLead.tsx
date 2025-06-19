/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import useScreenSize from "../../../../config/hooks/useScreenSize";
import CompanyTeamSearchProps from "../../../../@types/team-management/CompanyTeamListProps";
import { GridApi, ViewportChangedEvent } from "ag-grid-community";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../../@types/ui/MessageSnackbarProps";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import {
  NUMBER_VALUES,
  SIZE,
  STATUS_CODE,
} from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { EditIcon,  Plus, X } from "lucide-react";
import SearchInput from "../../../ui/SearchInput";
import Button from "../../../ui/Button";
import { CLASS_NAMES } from "../../../../constants/ClassNames";
import MessageSnackBar from "../../../ui/MessageSnackbar";
import TeamManagementAgGrid from "../../../ag-grid/TeamManagementAgGrid";
import CompanyTeamsNotAssignedToLeadModalProps from "../../../../@types/lead-management/CompanyTeamsNotAssignedToLeadModalProps";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";

function CompanyTeamsNotAssignedToLead({
  isOpen,
  onClose,
  selectedLeadData,
  getLeadAssignedCompanyteam 
}: CompanyTeamsNotAssignedToLeadModalProps) {
  const { isSmallScreen } = useScreenSize();
  const {
  userHasAccessToUpdateLead
  } = useUserAccessModules();


  //   note : state
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

  // const [
  //   isCompanyProductTeamsFetchedForFirstTime,
  //   setIsCompanyProductTeamsFetchedForFirstTime,
  // ] = useState<boolean>(true);

  const [
    companyTeamsNotAssignedFetchedCount,
    setCompanyTeamsNotAssignedFetchedCount,
  ] = useState<number>(0);
  // const [companyProductTeamsFetchedCount, setCompanyProductTeamsFetchedCount] =useState<number>(0);

  // const [isCompanyProductTeamsLoading, setIsCompanyProductTeamsLoading] =useState<boolean>(false);
  // const [companyProductTeamsHasMore, setCompanyProductTeamsHasMore] =
  // useState<boolean>(true);
  const companyProductTeamsFetchingRef = useRef(false);
  const companyProductTeamsGridApiRef = useRef<GridApi | null>(null);
  const companyProductTeamsLastScrollPositionRef = useRef<number>(0);
  // const companyProductTeamsSearchParamterRef = useRef<string>("");

  const { loginStatus } = useLoggedInUserContext();

  const [addCompanyProductTeamArray, setAddCompanyProductTeamArray] = useState<
    number[]
  >([]);
  const [companyProductTeamAddCount, setCompanyProductTeamAddCount] =
    useState<number>(0);

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

  const handleAddCompanyProductTeamChange = () => {
    setCompanyProductTeamAddCount(companyProductTeamAddCount + 1);
    // setCompanyProductTeamsFetchedCount(0);
    // setCompanyProductTeamsHasMore(true);
    // setCompanyProductsTeamsList([]);
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

  // Note : API TO CREATE
  // make changes
  const handleAddCompanyTeamToLead = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if(addCompanyProductTeamArray.length<=0){
      showMessageSnackbar({
        message : "Select company to assign",
        type : "error"
      })
      return;
    }
    
    if (userHasAccessToUpdateLead) {
    const createLeadCompanyTeamPostData = {
      company_id: loginStatus.companyId,
      lead_id: selectedLeadData.id,
      company_team_array: addCompanyProductTeamArray,
      createdbyid: loginStatus.id,
    };
    console.log(createLeadCompanyTeamPostData);

    await axios
      .post(POST_API.CREATE_LEAD_COMPANY_TEAM, createLeadCompanyTeamPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status && response.data) {
          showMessageSnackbar({
            message: response.data.message,
            type: "success",
          });
          const updatedCompanyTeams = companyTeamsNotAssignedList.filter(
            (team) => !addCompanyProductTeamArray.includes(team.id)
          );
          setCompanyTeamsNotAssignedList(updatedCompanyTeams);
          // setCompanyProductsTeamsList([]);
          handleAddCompanyProductTeamChange();
          // NOTE : CALL TO CALL BACK FUNCTION
          getLeadAssignedCompanyteam();
          // setCompanyProductTeamsFetchedCount(0);
          // setIsCompanyProductTeamsLoading(false);
          setAddCompanyProductTeamArray([]);
        } else if (!response.data.status) {
          showMessageSnackbar({
            message: response.data.message,
            type: "error",
          });
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: handleAddCompanyTeamToLead,
          });
          // need to get suggeastions for here
          if (refreshTokenResponse) {
            handleAddCompanyTeamToLead(e);
          }
        }
      });
    }
  };
  //   NOTE : API CALL TO GET TEAMS WHICH ARE NOT ASSIGNED TO COMPANY LEADS
  const fetchCompanyTeamsNotAssigned = async (
    companyTeamsNotAssignedSearchParameter: string
  ) => {
    if (
      // !userHasAccessToViewTeamManagement ||
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

      //need to make changes here.
      const getCompanyTeamsPostData = {
        company_id: loginStatus.companyId,
        lead_id: selectedLeadData.id,
        requestedby: loginStatus.id,
        isactive: true,
        limit: companyTeamsNotAssignedSearchParameter.length > 0 ? null : 40,
        offset:
          companyTeamsNotAssignedSearchParameter.length > 0
            ? 0
            : 40 * companyTeamsNotAssignedFetchedCount,
        search_company_specific_date_range_id: null,
        search_parameter: companyTeamsNotAssignedSearchParameter,

        search_parameter_date: null,
      };
      const response = await axios.post(
        POST_API.GET_COMPANY_TEAMS_NOT_ASSIGNED_TO_LEAD,
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
          fetchCompanyTeamsNotAssigned("");
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
    if (isOpen) {
      fetchCompanyTeamsNotAssigned("");
    } else if (!isOpen) {
      setCompanyTeamsNotAssignedList([]);
      setAddCompanyProductTeamArray([]);
      setCompanyTeamsNotAssignedHasMore(true);
      companyTeamsNotAssignedFetchingRef.current = false;
      companyTeamsNotAssignedGridApiRef.current = null;
      companyTeamsNotAssignedLastScrollPositionRef.current = 0;
      companyProductTeamsFetchingRef.current = false;
      companyProductTeamsGridApiRef.current = null;
      companyProductTeamsLastScrollPositionRef.current = 0;

      setCompanyTeamsNotAssignedFetchedCount(0);

      setIsCompanyTeamsNotAssignedReadyToFetch(false);
      handleMessageSnackbarClose();
    }
  }, [isCompanyTeamsNotAssignedReadyToFetch, isOpen]);

  if (!isOpen) return null;
  return (
    <div
      className={
        isSmallScreen
          ? "fixed inset-0 z-50 pl-20 pt-10 overflow-hidden  bg-opacity-5"
          : "fixed inset-0 z-50 justify-content-center pl-28 p-16 pt-2 overflow-hidden  bg-opacity-5"
      }
    >
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="relative w-full max-w-6xl min-w-full max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          <div className="p-5">
            {/* Note : Header */}
            <div className="flex items-center justify-between  mb-1 sticky  ">
              <div className="flex gap-2 items-center">
                <EditIcon className="text-blue-500" size={SIZE.TWENTY_FOUR} />
                <h2 className="text-lg font-semibold text-gray-800">
                  <span className="text-base text-gray-600">
                    Assign Team to{" "}
                  </span>
                  {selectedLeadData.name}
                  <span className="text-base text-gray-600">{"  "}Lead</span>
                </h2>
              </div>
              <button
                onClick={() => {
                  onClose();
                }}
                className=" text-gray-400 hover:text-gray-600"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div>
            {/*Aggrid logic here */}
            <div className="flex flex-col  justify-around  mb-7 ">
              <div className="flex items-center  w-full gap-2 mb-1  mt-2 justify-between">
                <div className=" flex-1 ">
                  <SearchInput
                    onChange={(event) => {
                      const searchValue = event.target.value;
                      handleCompanyTeamsNotAssignedSearchParameterCgange(
                        searchValue
                      );
                    }}
                  ></SearchInput>
                </div>
                <div className="flex-1  flex items-end justify-end">
                  <div  className="w-36">
                    <Button type="submit" onClick={handleAddCompanyTeamToLead}>
                      <div className="flex items-center justify-center">
                        <Plus
                          className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                        ></Plus>
                        <span> Assign Teams</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
              <div
                className="ag-theme-alpine"
                style={{ height: "300px", width: "100%" }}
              >
                <TeamManagementAgGrid
                  companyTeamList={companyTeamsNotAssignedList}
                  // isGridForProductTeam={false} 
                  // NOTE : CREATED NEW PROP FOR IS GRID FOR LEAD TEAM AND REPLACED ABOVE PROP USING THIS PROP
                  isGridForLeadProductTeam={true}
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

export default CompanyTeamsNotAssignedToLead;
