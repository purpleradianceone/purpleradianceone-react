
// export default CompanyTeamsNotAssignedToLead;
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";
import useScreenSize from "../../../../config/hooks/useScreenSize";
import CompanyTeamSearchProps from "../../../../@types/team-management/CompanyTeamListProps";
import { GridApi, ViewportChangedEvent } from "ag-grid-community";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";

import POST_API from "../../../../constants/PostApi";
import {  STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { EditIcon, Plus } from "lucide-react";
import SearchInput from "../../../ui/SearchInput";
import Button from "../../../ui/Button";
import { CLASS_NAMES } from "../../../../constants/ClassNames";
import TeamManagementAgGrid from "../../../ag-grid/TeamManagementAgGrid";
import CompanyTeamsNotAssignedToLeadModalProps from "../../../../@types/lead-management/CompanyTeamsNotAssignedToLeadModalProps";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import toast from "react-hot-toast";
import FormHeader from "../../../ui/FormHeader";
import { createPortal } from "react-dom";
import axiosClient from "../../../../axios-client/AxiosClient";

/** simple debounce without external deps */
function useDebouncedCallback<T extends (...args: any[]) => void>(
  fn: T,
  delay = 400
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cb = useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);
  return cb;
}

function CompanyTeamsNotAssignedToLead({
  isOpen,
  onClose,
  selectedLeadData,
  getLeadAssignedCompanyteam,
}: CompanyTeamsNotAssignedToLeadModalProps) {
  const { isSmallScreen } = useScreenSize();
  const { userHasAccessToUpdateLead } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  // Data & UI state
  const [companyTeamsNotAssignedList, setCompanyTeamsNotAssignedList] =
    useState<CompanyTeamSearchProps[]>([]);
  const [isCompanyTeamsNotAssignedLoading, setIsCompanyTeamsNotAssignedLoading] =
    useState(false);
  const [companyTeamsNotAssignedHasMore, setCompanyTeamsNotAssignedHasMore] =
    useState(true);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  // Refs for flow control
  const companyTeamsNotAssignedFetchingRef = useRef(false);
  const companyTeamsNotAssignedGridApiRef = useRef<GridApi | null>(null);
  const companyTeamsNotAssignedLastScrollPositionRef = useRef<number>(0);
  const companyTeamsNotassignedSearchParameterRef = useRef<string>("");

  // Pagination counters (separate for normal vs search)
  const normalFetchedCountRef = useRef<number>(0);
  const searchFetchedCountRef = useRef<number>(0);

  // (Kept – you used these elsewhere)
  const [isCompanyTeamsNotAssignedReadyToFetch, setIsCompanyTeamsNotAssignedReadyToFetch] =
    useState<boolean>(false);

  const companyProductTeamsFetchingRef = useRef(false);
  const companyProductTeamsGridApiRef = useRef<GridApi | null>(null);
  const companyProductTeamsLastScrollPositionRef = useRef<number>(0);

  // Selection
  const [addCompanyProductTeamArray, setAddCompanyProductTeamArray] = useState<number[]>([]);
  // companyProductTeamAddCount
  const [, setCompanyProductTeamAddCount] =
    useState<number>(0);
  const handleAddCompanyProductTeamChange = () => {
    setCompanyProductTeamAddCount((prev) => prev + 1);
  };

  const handleCompanyTeamCheckboxChange = (
    params: CompanyTeamSearchProps,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setAddCompanyProductTeamArray((prev) => [...prev, params.id]);
    } else {
      setAddCompanyProductTeamArray((prev) => prev.filter((id) => id !== params.id));
    }
  };

  // ADD teams to lead
  const handleAddCompanyTeamToLead = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (addCompanyProductTeamArray.length <= 0) {
      toast.error("Please select at least one team to assign.");
      return;
    }

    if (!userHasAccessToUpdateLead) {
      toast.error("You do not have permission to assign teams to this lead.");
      return;
    }

    const createLeadCompanyTeamPostData = {
      company_id: loginStatus.companyId,
      lead_id: selectedLeadData.id,
      company_team_array: addCompanyProductTeamArray,
      createdbyid: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(
        POST_API.CREATE_LEAD_COMPANY_TEAM,
        createLeadCompanyTeamPostData,
        { withCredentials: true }
      );
      const data = response.data;
      if (data?.status) {
        toast.success(data.message || "Teams assigned successfully.");

        const updatedCompanyTeams = companyTeamsNotAssignedList.filter(
          (team) => !addCompanyProductTeamArray.includes(team.id)
        );
        setCompanyTeamsNotAssignedList(updatedCompanyTeams);

        handleAddCompanyProductTeamChange();
        getLeadAssignedCompanyteam();
        setAddCompanyProductTeamArray([]);

        setTimeout(() => onClose(), 500);
      } else {
        toast.error(data?.message || "Failed to assign teams.");
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithEvent: handleAddCompanyTeamToLead,
        });
        if (refreshTokenResponse) {
          handleAddCompanyTeamToLead(e);
        }
      } else {
        toast.error("Something went wrong while assigning teams.");
      }
    }
  };

  // Transform helper
  const transformTeams = (rows: any[]): CompanyTeamSearchProps[] =>
    rows.map((team: any) => ({
      count: team.count,
      id: team.id,
      companyId: team.company_id,
      name: team.name,
      description: team.description,
      isActive: team.isactive,
      createdBy: team.createdby,
      createdOn: team.createdon,
    }));

  // Unified fetch (supports normal + search)
  const fetchCompanyTeamsNotAssigned = async (searchParam: string) => {
    // prevent overlapping calls
    if (
      isCompanyTeamsNotAssignedLoading ||
      !companyTeamsNotAssignedHasMore ||
      companyTeamsNotAssignedFetchingRef.current
    )
      return;

    try {
      companyTeamsNotassignedSearchParameterRef.current = searchParam;
      companyTeamsNotAssignedFetchingRef.current = true;
      setIsCompanyTeamsNotAssignedLoading(true);

      const isSearch = searchParam.trim().length > 0;

      // Save current scroll position only for normal pagination
      if (!isSearch && companyTeamsNotAssignedGridApiRef.current) {
        const rowIndex =
          companyTeamsNotAssignedGridApiRef.current.getLastDisplayedRowIndex();
        if (rowIndex !== null) {
          companyTeamsNotAssignedLastScrollPositionRef.current = rowIndex;
        }
      }

      const limit = 40;
      const offset = isSearch
        ? limit * searchFetchedCountRef.current
        : limit * normalFetchedCountRef.current;

      const getCompanyTeamsPostData = {
        company_id: loginStatus.companyId,
        lead_id: selectedLeadData.id,
        requestedby: loginStatus.id,
        isactive: true,
        limit,
        offset,
        search_company_specific_date_range_id: null,
        search_parameter: searchParam,
        search_parameter_date: null,
      };
      setIsDataLoading(true)
      const response = await axiosClient.post(
        POST_API.GET_COMPANY_TEAMS_NOT_ASSIGNED_TO_LEAD,
        getCompanyTeamsPostData,
        { withCredentials: true }
      );

      const newRows: any[] = response.data || [];
      if (newRows.length === 0) {
        setCompanyTeamsNotAssignedHasMore(false);
        return;
      }

      const newTeams = transformTeams(newRows);

      // Append for both modes (so search can scroll too)
      setCompanyTeamsNotAssignedList((prev) => [...prev, ...newTeams]);

      // bump counters
      if (isSearch) {
        searchFetchedCountRef.current += 1;
      } else {
        normalFetchedCountRef.current += 1;
      }

      // Restore scroll for normal mode
      if (
        !isSearch &&
        companyTeamsNotAssignedGridApiRef.current &&
        companyTeamsNotAssignedLastScrollPositionRef.current > 0
      ) {
        setTimeout(() => {
          companyTeamsNotAssignedGridApiRef.current?.ensureIndexVisible(
            Math.max(0, companyTeamsNotAssignedLastScrollPositionRef.current - 11)
          );
        }, 150);
      }

      // hasMore check using the total count carried in each row
      const totalCount = newTeams[0]?.count;
      const currentLength = companyTeamsNotAssignedList.length + newTeams.length;
      if (totalCount && currentLength >= totalCount) {
        setCompanyTeamsNotAssignedHasMore(false);
      }
    } catch (error:  any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunctionWithParamsNotEvent: fetchCompanyTeamsNotAssigned,
        });
        if (refreshTokenResponse) {
          companyTeamsNotAssignedFetchingRef.current = false;
          fetchCompanyTeamsNotAssigned(companyTeamsNotassignedSearchParameterRef.current);
        }
      } else {
        toast.error("Failed to load teams. Please try again.");
      }
    } finally {
      setIsCompanyTeamsNotAssignedLoading(false);
      companyTeamsNotAssignedFetchingRef.current = false;
      setIsDataLoading(false);
    }
  };

  // Infinite scroll (normal + search)
  const handleCompanyTeamsNotAssignedViewPortChanged = (
    params: ViewportChangedEvent
  ) => {
    if (!companyTeamsNotAssignedList.length || !companyTeamsNotAssignedHasMore)
      return;

    if (!companyTeamsNotAssignedGridApiRef.current && params.api) {
      companyTeamsNotAssignedGridApiRef.current = params.api;
    }

    const lastVisibleRow = params.lastRow;
    const totalRowCount = companyTeamsNotAssignedList[0]?.count;
    const activeSearch = companyTeamsNotassignedSearchParameterRef.current;

    if (
      totalRowCount &&
      lastVisibleRow >= companyTeamsNotAssignedList.length - 1
    ) {
      // Continue fetching with current mode's search param ('' for normal)
      fetchCompanyTeamsNotAssigned(activeSearch);
    }
  };

  const companyTeamsNotAssignedOnGridReady = (params: { api: GridApi }) => {
    companyTeamsNotAssignedGridApiRef.current = params.api;
  };

  // Debounced search handler
  const doSearch = useCallback(
    (searchValue: string) => {
      const trimmed = searchValue.trim();

      // Reset common list and flags
      setCompanyTeamsNotAssignedList([]);
      setCompanyTeamsNotAssignedHasMore(true);
      setIsCompanyTeamsNotAssignedLoading(false);
      companyTeamsNotAssignedFetchingRef.current = false;

      // Reset grid scroll & API refs
      companyTeamsNotAssignedGridApiRef.current = null;
      companyTeamsNotAssignedLastScrollPositionRef.current = 0;

      // Reset counters based on mode
      if (trimmed.length > 0) {
        searchFetchedCountRef.current = 0;
      } else {
        normalFetchedCountRef.current = 0;
      }

      // Fire fresh fetch
      fetchCompanyTeamsNotAssigned(trimmed);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleCompanyTeamsNotAssignedSearchParameterChange =
    useDebouncedCallback((value: string) => {
      doSearch(value);
    }, 400);

  // Mount/unmount lifecycle
  useEffect(() => {
    if (isOpen) {
      // Fresh open → reset & fetch first page (normal)
      setCompanyTeamsNotAssignedList([]);
      setCompanyTeamsNotAssignedHasMore(true);
      setIsCompanyTeamsNotAssignedLoading(false);
      companyTeamsNotAssignedFetchingRef.current = false;
      companyTeamsNotAssignedGridApiRef.current = null;
      companyTeamsNotAssignedLastScrollPositionRef.current = 0;
      normalFetchedCountRef.current = 0;
      searchFetchedCountRef.current = 0;
      companyTeamsNotassignedSearchParameterRef.current = "";

      fetchCompanyTeamsNotAssigned("");
    } else {
      // Cleanup when closing
      setCompanyTeamsNotAssignedList([]);
      setAddCompanyProductTeamArray([]);
      setCompanyTeamsNotAssignedHasMore(true);
      companyTeamsNotAssignedFetchingRef.current = false;
      companyTeamsNotAssignedGridApiRef.current = null;
      companyTeamsNotAssignedLastScrollPositionRef.current = 0;
      companyProductTeamsFetchingRef.current = false;
      companyProductTeamsGridApiRef.current = null;
      companyProductTeamsLastScrollPositionRef.current = 0;

      normalFetchedCountRef.current = 0;
      searchFetchedCountRef.current = 0;

      setIsCompanyTeamsNotAssignedReadyToFetch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompanyTeamsNotAssignedReadyToFetch, isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={
        isSmallScreen
          ? "fixed inset-0 z-50 pl-20 pt-10 overflow-hidden bg-black bg-opacity-5"
          : "fixed inset-0 z-50 justify-content-center p-28 pt-2 overflow-hidden bg-black bg-opacity-5"
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
            {/* Header */}
            {/* <div className="flex items-center justify-between  mb-1 sticky  ">
              <div className="flex gap-2 items-center">
                <EditIcon className="text-blue-500" size={SIZE.TWENTY_FOUR} />
                <h2 className="text-lg font-semibold text-gray-800">
                  <span className="text-base text-gray-600">Assign Team to </span>
                  {selectedLeadData.name}
                  <span className="text-base text-gray-600">{"  "}Lead</span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className=" text-gray-400 hover:text-gray-600"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div> */}
            <FormHeader
              icon={EditIcon}
              preText="Assign team to this lead - "
              userName={selectedLeadData.name ?? selectedLeadData.email}
              description="Add a team responsible for handling and nurturing this lead."
              onClose={onClose}
            />

            {/* Body */}
            <div className="flex flex-col  justify-around  mb-7 ">
              <div className="flex items-center  w-full gap-2 mb-1  mt-2 justify-between">
                <div className=" flex-1 ">
                  <SearchInput
                    onChange={(event) => {
                      const searchValue = event.target.value;
                      handleCompanyTeamsNotAssignedSearchParameterChange(searchValue);
                    }}
                  />
                </div>
                <div className="flex-1 flex items-center justify-end">
                  <div className="">
                    <Button type="submit" onClick={handleAddCompanyTeamToLead}>
                      <div className="flex items-center justify-center text-nowrap">
                        <Plus className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />
                        <span>Assign</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              <div style={{ height: "300px", width: "100%" }}>
                <TeamManagementAgGrid
                  companyTeamList={companyTeamsNotAssignedList}
                  isGridForLeadProductTeam={true}
                  handleCompanyTeamCheckboxChange={handleCompanyTeamCheckboxChange}
                  addCompanyProductTeamArray={addCompanyProductTeamArray}
                  handleViewPortChanged={handleCompanyTeamsNotAssignedViewPortChanged}
                  onGridReady={companyTeamsNotAssignedOnGridReady}
                  isDataLoading={isDataLoading}
                />
              </div>

              {/* Optional: show small loader / end-of-list indicators
              {isCompanyTeamsNotAssignedLoading && (
                <div className="text-sm text-gray-500 mt-2">Loading…</div>
              )}
              {!companyTeamsNotAssignedHasMore && companyTeamsNotAssignedList.length > 0 && (
                <div className="text-xs text-gray-400 mt-2">No more teams to load.</div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CompanyTeamsNotAssignedToLead;
