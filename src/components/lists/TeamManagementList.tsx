import { Calendar, Network } from "lucide-react";
import useScreenSize from "../../config/hooks/useScreenSize";
import SearchInput from "../ui/SearchInput";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import DateRangePicker from "../ui/DateRangePicker";
import { useState } from "react";
import { JSX_CHILDREN_NAME, SIZE } from "../../constants/AppConstants";
import Button from "../ui/Button";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import AddTeamModal from "../modals/teams/AddTeamModal";
import CompanyTeamSearchProps from "../../@types/team-management/CompanyTeamListProps";
import TeamManagementAgGrid from "../ag-grid/TeamManagementAgGrid";
import Pagination from "../ag-grid/Pagination";
import EditCompanyTeamModal from "../modals/teams/EditCompanyTeamModal";
import TeamManagementListProps from "../../@types/List/TeamManagementListProps";
import { useUserPreference } from "../../context/user/UserPreference";

function TeamManagementList({
  companyTeamList,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  paginationData,
  handleCompanyTeamChangeOnUpdate,
  handleCompanyTeamChangeOnAdd,
}: TeamManagementListProps) {
  const { userPreference } = useUserPreference();
  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();
  const { userHasAccessToAddTeamManagement } = useUserAccessModules();

  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const { handleDateRangeIdChange, isCustomDateOptionSelected } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

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

  return (
    <div
      className={`w-full  ${
        userPreference.isLeftMenu ? "pl-5" : "pl-1"
      } pr-1 gap-1`}
    >
      <div className="sticky z-10 top-9 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
        <div className="flex  gap-2">
          {!isSmallScreen && <Network className="w-6 h-6 text-blue-600" />}

          {(isMediumScreen || isLargeScreen) && (
            <span className="section-header-custom">Team Management</span>
          )}
        </div>

        {isLargeScreen && (
          <>
            <div className="flex gap-1">
              {/* search box flex div */}
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value
                    );
                  }}
                ></SearchInput>
              </div>

              {/* Date FIlters Dropdown */}
              <div className="flex mx-3">
                <div className="flex">
                  <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 input-label-custom">
                    <Calendar className="mt-2" />
                  </div>

                  <DateRangeFilterDropdown
                    dropdownOptions={dateRangeDropdownOptions}
                    handleDateIdChange={handleDateRangeIdChange}
                  ></DateRangeFilterDropdown>
                </div>
              </div>
            </div>

            {/* Custom Date Picker Div Flex Box*/}
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
              />
            </div>
          </>
        )}

        {/* new end */}

        {userHasAccessToAddTeamManagement ? (
          <>
            <div className="flex gap-1">
              <Button type="submit" onClick={(e) => {
                e.preventDefault();
                setIsAddTeamModalOpen(true);
              }}>
                {/* {!isSmallScreen && <Network size={SIZE.TWENTY} />}
                {isSmallScreen && <Network size={SIZE.EIGHT} />}
                {isLargeScreen && JSX_CHILDREN_NAME.ADD_TEAM} */}
                <div className="flex items-center gap-0.5">
            <Network size={SIZE.SIXTEEN}/> {JSX_CHILDREN_NAME.ADD_TEAM}</div>
                
              </Button>
            </div>
            <AddTeamModal
              isOpen={isAddTeamModalOpen}
              onClose={() => {
                setIsAddTeamModalOpen(false);
              }}
              handleCompanyTeamChangeOnAdd={handleCompanyTeamChangeOnAdd}
            ></AddTeamModal>

            <EditCompanyTeamModal
              companyTeam={selectedTeamForUpdate}
              isOpen={isUpdateCompanyTeamModalOpen}
              handleCompanyTeamChangeOnUpdate={handleCompanyTeamChangeOnUpdate}
              onClose={() => {
                setIsUpdateCompanyTeamModalOpen(false);
              }}
            ></EditCompanyTeamModal>
          </>
        ) : (
          <div className="flex gap-1">
            <Button type="submit" onClick={(e) => e.preventDefault} disabled={true}>
              <div className="flex items-center gap-0.5">
            <Network size={SIZE.SIXTEEN}/> {JSX_CHILDREN_NAME.ADD_TEAM}</div>
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
        <div
          className={
            userPreference.isLeftMenu
              ? `ag-theme-balham w-full h-[calc(100vh-114px)]`
              : "ag-theme-balham w-full h-[calc(100vh-122px)]"
          }
        >
          <TeamManagementAgGrid
            companyTeamList={companyTeamList}
            isUpdateCompanyTeamModalOpen={handleIsUpdateCompanyTeamModalOpen}
            isGridForProductTeam={false}
          />
        </div>
      </div>
      <div className="flex items-center justify-end ">
        <Pagination
          totalPages={paginationData.totalPages}
          currentPage={paginationData.currentPage}
          pageSize={paginationData.pageSize}
          onPageChange={paginationData.handlePageChange}
          onPageSizeChange={paginationData.selectedPageSize}
        />
      </div>
    </div>
  );
}

export default TeamManagementList;
