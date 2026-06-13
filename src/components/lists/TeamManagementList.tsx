import { Calendar, CalendarDays, Network, UserCheck, Users } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import SearchInput from "../ui/SearchInput";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import DateRangePicker from "../ui/DateRangePicker";
import { useCallback, useEffect, useState } from "react";
import { JSX_CHILDREN_NAME, SIZE } from "../../constants/AppConstants";
import Button from "../ui/Button";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import AddTeamModal from "../modals/teams/AddTeamModal";
import CompanyTeamSearchProps from "../../@types/team-management/CompanyTeamListProps";
import TeamManagementAgGrid from "../ag-grid/TeamManagementAgGrid";
import EditCompanyTeamModal from "../modals/teams/EditCompanyTeamModal";
import TeamManagementListProps from "../../@types/List/TeamManagementListProps";
import { useUserPreference } from "../../context/user/UserPreference";
import COLORS from "../../constants/Colors";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import CompanyTeamSummary from "../../@types/team-management/CompanyTeamSummary";
import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";
import SummaryCards from "../ui/SummaryCards";

function TeamManagementList({
  companyTeamList,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  paginationData,
  handleCompanyTeamChangeOnUpdate,
  handleCompanyTeamChangeOnAdd,
  isDataLoading
}: TeamManagementListProps) {
  const { userPreference } = useUserPreference();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
  const { userHasAccessToAddTeamManagement } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });


  const [teamSummary, setTeamSummary] =
  useState<CompanyTeamSummary>({
    total_company_team: 0,
    total_company_team_active: 0,
    total_company_team_company_user: 0,
    total_company_team_created_this_month: 0,
  });

  const fetchTeamSummary = useCallback(async () => {
  try {
    const response = await axiosClient.post(
      POST_API.SUMMARY_COMPANY_TEAM,
      {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
      },
      {
        withCredentials: true,
      }
    );

    if (response.data?.length > 0) {
      setTeamSummary(response.data[0]);
    }
  } catch (error) {
    console.error(error);
  }
}, [loginStatus.companyId, loginStatus.id]);

useEffect(() => {
  if (loginStatus.companyId && loginStatus.id) {
    fetchTeamSummary();
  }
}, [fetchTeamSummary]);


const refreshAllData = async () => {
  await Promise.all([
    handleCompanyTeamChangeOnAdd(),
    fetchTeamSummary(),
  ]);
};

const handleUpdateAndRefresh = async (teamId: number) => {
  handleCompanyTeamChangeOnUpdate(teamId);
  await fetchTeamSummary();
};

  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState<boolean>(false);
  const [isUpdateCompanyTeamModalOpen, setIsUpdateCompanyTeamModalOpen] =
    useState<boolean>(false);
  const [selectedTeamForUpdate, setSelectedTeamForUpdate] =
    useState<CompanyTeamSearchProps>({
      id: 0,
      companyId: 0,
      count: 0,
      createdBy: "",
      createdOn: "",
      description: "",
      isActive: false,
      name: "",
    });

  const handleIsUpdateCompanyTeamModalOpen = (
    params: CompanyTeamSearchProps
  ) => {
    if (params) {
      setSelectedTeamForUpdate(params);
      setIsUpdateCompanyTeamModalOpen(true);
    }
  };

  const selectedDateName =
    dateRangeDropdownOptions.find(
      (o) => o.search_date_range_id === handleSearchOption.dateRangeId
    )?.date_range || "Date Filter";

  useEffect(() => {
    if (handleSearchOption.dateRangeId === customDateRangeId) {
      setIsCustomDateOptionSelected(true);
    }
  }, [
    handleSearchOption.searchParameter,
    handleSearchOption.dateRangeId,
    setIsCustomDateOptionSelected,
  ]);

  return (
    <div
      className={`w-full  ${
        userPreference.isLeftMenu ? "pl-7 pr-2" : "pl-1"
      } pr-1 gap-1 pt-2`}
    >

      <div className="flex items-start justify-between ">
          <div>
           <h1 className="page-header-custom tracking-tight pb-0.5">
              Teams
            </h1>

            <p className="page-subtitle-custom">
              Organize teams and manage members across your company.
            </p>
            </div>

             <div className="pt-1">
             <Button
              type="submit"
              disabled={!userHasAccessToAddTeamManagement}
              onClick={(e) => {
                e.preventDefault();

                if (!userHasAccessToAddTeamManagement) {
                  return;
                }

                setIsAddTeamModalOpen(true);
              }}
            >

              {/* {!isSmallScreen && <Network size={SIZE.TWENTY} />}
                {isSmallScreen && <Network size={SIZE.EIGHT} />}
                {isLargeScreen && JSX_CHILDREN_NAME.ADD_TEAM} */}
             <div className="flex items-center gap-0.5">
                  <Network size={SIZE.SIXTEEN} /> {JSX_CHILDREN_NAME.ADD_TEAM}
                </div>
            </Button>
          </div>

        </div>

        <SummaryCards
          cardGap={20}
          width="75%"
          gridCols={4}
          loading={isDataLoading}
          cards={[
            {
              title: "Total Teams",
              count: teamSummary.total_company_team,
              subtitle: "All Teams in workspace",
              icon: Network,
              iconBg: "bg-blue-100",
              iconColor: "text-blue-600",
            },

            {
              title: "Active Teams",
              count: teamSummary.total_company_team_active,
              subtitle: "Currently Active teams",
              icon: UserCheck,
              iconBg: "bg-green-100",
              iconColor: "text-green-600",
            },

            {
              title: "Total Members",
              count: teamSummary.total_company_team_company_user,
              subtitle: "Across all Teams",
              icon: Users,
              iconBg: "bg-violet-100",
              iconColor: "text-violet-600",
            },

            {
              title: "New Teams",
              count: teamSummary.total_company_team_created_this_month,
              subtitle: "This Month Created ",
              icon: CalendarDays,
              iconBg: "bg-orange-100",
              iconColor: "text-orange-600",
            },
          ]}
        />


      <div
        className={`sticky z-10 top-9 mt-1 py-1.5 px-3 mb-3 flex items-center justify-between ${COLORS.GRID_HEADER_SECTION_BG_COLOR} border border-slate-200 rounded-lg mb-1.5 w-full`}
      >
        <div className="flex justify-center items-center gap-5">
          <div className="flex gap-1">
            {!isSmallScreen && (
              <Network
                className={`${COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE}`}
              />
            )}

            {(isMediumScreen || isLargeScreen) && (
              <span className="section-header-custom">Teams</span>
            )}
          </div>

          {isLargeScreen && (
            <div className="flex gap-1">
              {/* search box flex div */}
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value,
                    );
                  }}
                  value={handleSearchOption.searchParameter}
                  placeholder="Search by team name and description"
                ></SearchInput>
              </div>

              {/* Date FIlters Dropdown */}
              <div className="flex mx-3">
                <div className="flex">
                  <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 input-label-custom">
                    <Calendar className="input-label-custom" />
                  </div>

                  <DateRangeFilterDropdown
                    dropdownOptions={dateRangeDropdownOptions}
                    handleDateIdChange={handleDateRangeIdChange}
                    selectedOption={selectedDateName}
                  ></DateRangeFilterDropdown>
                </div>
                {/* Custom Date Picker Div Flex Box*/}
                {isCustomDateOptionSelected && (
                  <div
                    style={
                      isCustomDateOptionSelected
                        ? { visibility: "visible" }
                        : { visibility: "hidden" }
                    }
                  >
                    <DateRangePicker
                      onStartDateChange={onStartDateChange}
                      onEndDateChange={onEndDateChange}
                      initialStartDate={handleSearchOption.startDate}
                      initialEndDate={handleSearchOption.endDate}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* new end */}

        {userHasAccessToAddTeamManagement ? (
          <>
            <AddTeamModal
              isOpen={isAddTeamModalOpen}
              onClose={() => {
                setIsAddTeamModalOpen(false);
              }}
              handleCompanyTeamChangeOnAdd={refreshAllData}
            ></AddTeamModal>

            <EditCompanyTeamModal
              companyTeam={selectedTeamForUpdate}
              isOpen={isUpdateCompanyTeamModalOpen}
               handleCompanyTeamChangeOnUpdate={handleUpdateAndRefresh}
              onClose={() => {
                setIsUpdateCompanyTeamModalOpen(false);
              }}
            ></EditCompanyTeamModal>
          </>
        ) : (
          <div className="flex gap-1">
            <Button
              type="submit"
              onClick={(e) => e.preventDefault}
              disabled={true}
            >
              <div className="flex items-center gap-0.5">
                <Network size={SIZE.SIXTEEN} /> {JSX_CHILDREN_NAME.ADD_TEAM}
              </div>
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
        <div
          className={
            userPreference.isLeftMenu
              ? `w-full h-[calc(100vh-277px)]`
              : "w-full h-[calc(100vh-122px)]"
          }
        >
          <TeamManagementAgGrid
            companyTeamList={companyTeamList}
            isUpdateCompanyTeamModalOpen={handleIsUpdateCompanyTeamModalOpen}
            isGridForProductTeam={false}
            isDataLoading={isDataLoading}
          />
        </div>
      </div>
      <div className="flex items-center justify-end ">
        <PaginationWithoutCount
          currentPage={paginationData.currentPage}
          currentPageData={paginationData.currentPageData}
          pageSize={paginationData.pageSize}
          onPageChange={paginationData.onPageChange}
          onPageSizeChange={paginationData.onPageSizeChange}
        />
      </div>
    </div>
  );
}

export default TeamManagementList;
