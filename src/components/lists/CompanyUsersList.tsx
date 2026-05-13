import { Users, UserPlus, Calendar } from "lucide-react";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import EditCompanyUserModal from "../modals/company-user/EditCompanyUserModal";
import DateRangePicker from "../ui/DateRangePicker";
import AddCompanyUserModal from "../modals/company-user/AddCompanyUserModal";
import CompanyUser from "../../@types/company-users/CompanyUser";
import SearchInput from "../ui/SearchInput";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import CompanyUserAgGrid from "../ag-grid/CompanyUsersAgGrid";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import GetCompanyUsersListProps from "../../@types/List/GetCompanyUsersListProps";

import CompanyUserDashboardModal from "../modals/company-user/CompanyUserDashboardModal";
import { useUserPreference } from "../../context/user/UserPreference";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";
import { SIZE, STATUS_CODE } from "../../constants/AppConstants";
import COLORS from "../../constants/Colors";
import AppTutorailManager from "../views/tutorails/AppTutorailManager";
import { CompanyUsersModuleSteps } from "../../constants/AppTutorailsSteps";
import POST_API from "../../constants/PostApi";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import { useTutorailDataContext } from "../../context/tutorail/useTutorailDataContext";
import { TutorailColumnName } from "../../constants/Tutorail";
import RefreshToken from "../../config/validations/RefreshToken";
import PaginationWithoutCount from "../ag-grid/PaginationWithoutCount";
import CompanyUserAccessManagementModalNew from "../modals/company-user/CompanyUserAccessManagementModalNew";
import { customDateRangeId } from "../../config/hooks/usePaginationHandler";
import { ComponentHeaderAndLogo } from "../ui/ComponentHeaderAndLogo";

function GetCompanyUsersList({
  users,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleCompanyUserChangeOnEdit,
  isUsedInAccountProductForAssingingInstalledBy,
  onRowSelect,
  isDataLoading,
}: GetCompanyUsersListProps) {
  const { userPreference } = useUserPreference();
  const [isAccessModalOpen, setIsAccessModalOpen] = useState<boolean>(false);

  const [isActionsTourEnded, setIsActionsTourEnded] = useState<boolean>(false);

  const [isDashboardModalOpen, setIsDashboardModalOpen] =
    useState<boolean>(false);

  const [isEditCompanyUserModalOpen, setIsEditModalOpen] =
    useState<boolean>(false);
  const [isAddCompanyUserModalOpen, setIsAddCompanyUserModalOpen] =
    useState<boolean>(false);
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const {
    handleDateRangeIdChange,
    isCustomDateOptionSelected,
    setIsCustomDateOptionSelected,
  } = useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });
  const [isAnimationComplete, setIsAnimationComplete] =
    useState<boolean>(false);

  const { userHasAccessToAddUser } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const { tutorailData, setTutorailData } = useTutorailDataContext();
  const [tourFinished, setTourFinished] = useState<boolean>(false);

  useEffect(() => {
    setTourFinished(tutorailData.isCompanyUserSeen);
    setIsActionsTourEnded(tutorailData.isCompanyUserActionsSeen);
  }, [tutorailData]);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimationComplete(true);
    }, 500);
  }, []);

  const [selectedCompanyUser, setSelectedCompanyUser] = useState<CompanyUser>({
    company_id: 0,
    id: 0,
    fullname: "",
    email: "",
    mobilenumber: "",
    createdby: "",
    isactive: false,
    requestedby: "",
    generate_password: "",
  });

  const handleSelectedCompanyUserChange = (params: CompanyUser) => {
    setSelectedCompanyUser({
      company_id: params.company_id,
      id: params.id,
      fullname: params.fullname,
      email: params.email,
      mobilenumber: params.mobilenumber,
      createdby: "",
      isactive: params.isactive,
      requestedby: "",
      generate_password: "",
    });
  };

  const handleIdIsEditModalOpen = (status: boolean) => {
    setIsEditModalOpen(status);
  };

  const handleIsAccessModalOpen = (status: boolean) => {
    setIsAccessModalOpen(status);
  };

  const handleIsDashboardModalOpen = (status: boolean) => {
    setIsDashboardModalOpen(status);
  };

  const handleTourModalOpen = (index: number) => {
    if (index === 2) {
      setIsAddCompanyUserModalOpen(true);

      return;
    } else if (index === 4) {
      setIsAddCompanyUserModalOpen(false);
      return;
    }
  };

  const handleActionsTourEnd = () => {
    const updateTutorailPostData = {
      company_id: loginStatus.companyId,
      id: tutorailData.id,
      column_name: TutorailColumnName.IS_COMPANY_USER_ACTIONS_SEEN,
      status: true,
      updatedby_id: loginStatus.id,
    };
    axios
      .post(POST_API.UPDATE_COMPANY_USER_TUTORAIL, updateTutorailPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          setIsActionsTourEnded(true);
          setTutorailData({
            id: tutorailData.id,
            companyUserId: tutorailData.companyUserId,
            isNavbarSeen: tutorailData.isNavbarSeen,
            isDashboardSeen: tutorailData.isDashboardSeen,
            isCrmDashboardSeen: tutorailData.isCrmDashboardSeen,
            isCompanyUserSeen: tutorailData.isCompanyUserSeen,
            isCompanyUserActionsSeen: true,
            isLeadSeen: tutorailData.isLeadSeen,
            isAccountSeen: tutorailData.isAccountSeen,
            isProductSeen: tutorailData.isProductSeen,
            isTeamSeen: tutorailData.isTeamSeen,
            isSettingCompanySeen: tutorailData.isSettingCompanySeen,
            isSettingEmailTemplateSeen: tutorailData.isSettingEmailTemplateSeen,
            isSettingIntegrationSeen: tutorailData.isSettingIntegrationSeen,
            createdBy: tutorailData.createdOn,
            updatedBy: tutorailData.updatedBy,
            createdOn: tutorailData.createdOn,
            updatedOn: tutorailData.updatedOn,
          });
        }
      })
      .catch(async (error) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: handleTourEnd,
          });
          if (refreshTokenResponse) {
            handleTourEnd();
          }
        }
      });
  };

  const handleTourEnd = async () => {
    const updateTutorailPostData = {
      company_id: loginStatus.companyId,
      id: tutorailData.id,
      column_name: TutorailColumnName.IS_COMPANY_USER_SEEN,
      status: true,
      updatedby_id: loginStatus.id,
    };
    axios
      .post(POST_API.UPDATE_COMPANY_USER_TUTORAIL, updateTutorailPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          setTourFinished(true);
          setTutorailData({
            id: tutorailData.id,
            companyUserId: tutorailData.companyUserId,
            isNavbarSeen: tutorailData.isNavbarSeen,
            isDashboardSeen: tutorailData.isDashboardSeen,
            isCrmDashboardSeen: tutorailData.isCrmDashboardSeen,
            isCompanyUserSeen: true,
            isCompanyUserActionsSeen: tutorailData.isCompanyUserActionsSeen,
            isLeadSeen: tutorailData.isLeadSeen,
            isAccountSeen: tutorailData.isAccountSeen,
            isProductSeen: tutorailData.isProductSeen,
            isTeamSeen: tutorailData.isTeamSeen,
            isSettingCompanySeen: tutorailData.isSettingCompanySeen,
            isSettingEmailTemplateSeen: tutorailData.isSettingEmailTemplateSeen,
            isSettingIntegrationSeen: tutorailData.isSettingIntegrationSeen,
            createdBy: tutorailData.createdOn,
            updatedBy: tutorailData.updatedBy,
            createdOn: tutorailData.createdOn,
            updatedOn: tutorailData.updatedOn,
          });
        }
      })
      .catch(async (error) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: handleTourEnd,
          });
          if (refreshTokenResponse) {
            handleTourEnd();
          }
        }
      });
  };
  const selectedDateName =
    dateRangeDropdownOptions.find(
      (o) => o.search_date_range_id === handleSearchOption.dateRangeId,
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
      className={`w-full   pt-1  ${
        userPreference.isLeftMenu ? "pl-5" : "pl-1"
      } pr-1 gap-1`}
    >
      {tourFinished
        ? null
        : isAnimationComplete && (
            <AppTutorailManager
              steps={CompanyUsersModuleSteps}
              handleTourEnd={handleTourEnd}
              isModalOpen={handleTourModalOpen}
              modalOpenTriggerIndices={[2, 3, 4]}
            />
          )}

      <div
        className={`sticky z-10 top-9 py-0.5 flex items-center justify-between ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-sm w-full`}
      >
        <div className="flex justify-center items-center gap-5">
          {/* <div className="flex gap-1">
            <Users className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} />
            <span className="section-header-custom">Company Users</span>
          </div> */}

          <ComponentHeaderAndLogo headerText="Company Users" logo={Users} />
          <div className="flex gap-1">
            {/* search box flex div */}

            <div className="relative flex justify-start items-start w-80">
              <SearchInput
                id="company-user-module-search-box"
                onChange={(e) => {
                  handleSearchOption.handleSearchParameterChange(
                    e.target.value,
                  );
                }}
                value={handleSearchOption.searchParameter}
              ></SearchInput>
            </div>

            {/* Date FIlters Dropdown */}
            <div
              id="company-users-module-date-range-filter"
              className="flex mx-3 gap-1"
            >
              <div className="flex">
                <div className="flex items-center size-4 justify-center mt-1 mr-2 gap-2 input-label-custom">
                  <Calendar className="input-label-custom mt-1" />
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
        </div>

        <>
          {/* {userHasAccessToAddUser ? ( */}
          {/* <> */}
          {!isUsedInAccountProductForAssingingInstalledBy && (
            <>
              <div id="company-users-module-add-button" className="flex gap-1">
                <Button
                  type="submit"
                  disabled={!userHasAccessToAddUser}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!userHasAccessToAddUser) {
                      toast.error(
                        MESSAGE.MODULE_ACCESS.COMPANY_USER
                          .DENIED_ADD_ACCESS_COMPANY_USER,
                      );
                      return;
                    } else {
                      setIsAddCompanyUserModalOpen(true);
                    }
                  }}
                  // onClick={() => setIsAddCompanyUserModalOpen(true)}
                >
                  {/* {!isSmallScreen && <UserPlus size={SIZE.TWENTY} />}
                {isSmallScreen && <UserPlus size={SIZE.EIGHT} />}
                {isLargeScreen && JSX_CHILDREN_NAME.ADD_USER} */}
                  <div className="flex items-center gap-1">
                    <UserPlus size={SIZE.SIXTEEN} />
                    Add
                  </div>
                </Button>
              </div>

              <AddCompanyUserModal
                isOpen={isAddCompanyUserModalOpen}
                onClose={() => setIsAddCompanyUserModalOpen(false)}
              />
            </>
          )}
        </>
      </div>

      <div className="bg-white overflow-y-auto  p-0">
        <div
          className={
            isUsedInAccountProductForAssingingInstalledBy
              ? ` w-full h-[calc(70vh-122px)]`
              : userPreference.isLeftMenu
                ? ` w-full h-[calc(100vh-110px)]`
                : " w-full h-[calc(100vh-120px)]"
          }
        >
          <CompanyUserAgGrid
            onRowSelect={onRowSelect}
            isUsedInAccountProductForAssingingInstalledBy={
              isUsedInAccountProductForAssingingInstalledBy
            }
            handleSelectedCompanyUserChange={handleSelectedCompanyUserChange}
            users={users}
            handleIdIsEditModalOpen={handleIdIsEditModalOpen}
            handleIsAccessModalOpen={handleIsAccessModalOpen}
            handleIsDashboardModalOpen={handleIsDashboardModalOpen}
            isActionsTourEnded={isActionsTourEnded}
            handleActionsTourEnd={handleActionsTourEnd}
            isDataLoading={isDataLoading}
          />
        </div>
        <CompanyUserAccessManagementModalNew
          isOpen={isAccessModalOpen}
          onClose={() => setIsAccessModalOpen(false)}
          users={selectedCompanyUser}
        />
        <EditCompanyUserModal
          handleCompanyUserChange={handleCompanyUserChangeOnEdit}
          isOpen={isEditCompanyUserModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          user={selectedCompanyUser}
        />

        <CompanyUserDashboardModal
          isOpen={isDashboardModalOpen}
          onClose={() => {
            setIsDashboardModalOpen(false);
          }}
          users={selectedCompanyUser}
        />
      </div>
      {/* pagination component */}
      <div className="flex items-center justify-end ">
        <PaginationWithoutCount
          pageSize={paginationData.pageSize}
          currentPage={paginationData.currentPage}
          currentPageData={paginationData.currentPageData}
          onPageChange={paginationData.onPageChange}
          onPageSizeChange={paginationData.onPageSizeChange}
        />
      </div>
    </div>
  );
}

export default GetCompanyUsersList;
