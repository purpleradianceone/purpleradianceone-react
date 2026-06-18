import {
  Users,
  UserPlus,
  Calendar,
  Clock3,
  UserCheck,
  RotateCcw,
  Search,
} from "lucide-react";
import Button from "../ui/Button";
import { useCallback, useEffect, useState } from "react";
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

import SummaryCards from "../ui/SummaryCards";

import CompanyUserSummary from "../../@types/company-users/CompanyUserSummary";

import CompanyUserReportModal from "../modals/company-user/CompanyUserReportModal";
import CustomStatusFilterDropdown from "../ui/CustomStatusFilterDropdown";
import COLORS from "../../constants/Colors";

function GetCompanyUsersList({
  users,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  onRefreshUsers,
  isUsedInAccountProductForAssingingInstalledBy,
  onRowSelect,
  isDataLoading,
  selectedStatus,
  setSelectedStatus,
}: GetCompanyUsersListProps) {
  const { userPreference } = useUserPreference();
  const [isAccessModalOpen, setIsAccessModalOpen] = useState<boolean>(false);

  const [isActionsTourEnded, setIsActionsTourEnded] = useState<boolean>(false);

  const [isDashboardModalOpen, setIsDashboardModalOpen] =
    useState<boolean>(false);

  const [isUserReportModalOpen, setIsUserReportModalOpen] =
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

  const handleUserReportModalOpen = (status: boolean) => {
    setIsUserReportModalOpen(status);
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

  const [companyUserSummary, setCompanyUserSummary] =
    useState<CompanyUserSummary>({
      total_company_users: 0,
      total_active_users: 0,
      total_inactive_users: 0,
      total_users_created_this_month: 0,
    });

  const fetchCompanyUserSummary = useCallback(async () => {
    try {
      const postData = {
        company_id: loginStatus.companyId,
        requestedby: loginStatus.id,
        
      };
      const response = await axios.post(
        POST_API.SUMMARY_COMPANY_USER,
        postData,
        {
          withCredentials: true,
        },
      );

      if (response.data?.length > 0) {
        setCompanyUserSummary(response.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  },[loginStatus.companyId, loginStatus.id]);


  useEffect(() => {
    if (loginStatus.companyId && loginStatus.id) {
      fetchCompanyUserSummary();
    }
  }, [fetchCompanyUserSummary]);
  //all card data

  //Reset
const handleResetFilters = () => {
  handleSearchOption.handleSearchParameterChange("");
  setSelectedStatus("ALL");
  handleDateRangeIdChange(0);
  setIsCustomDateOptionSelected(false);

  setTimeout(() => {
    onRefreshUsers();
    fetchCompanyUserSummary();
  }, 0);
};


 const refreshAllData = useCallback(async () => {
  await Promise.all([
    onRefreshUsers(),
    fetchCompanyUserSummary(),
  ]);
}, [onRefreshUsers, fetchCompanyUserSummary]);

  const statusOptions = [
    {
      id: 1,
      name: "All Status",
      value: "ALL",
    },
    {
      id: 2,
      name: "Active",
      value: "ACTIVE",
    },
    {
      id: 3,
      name: "Inactive",
      value: "INACTIVE",
    },
  ];

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

      {/* ================= HEADER + STATS SECTION ================= */}

      <div className="w-full bg-white  px-2 mb-2">
        {/* Top Header */}
        <div className="flex items-start justify-between mt-1">

          {/* Header */}
            
            <div className="flex items-center gap-3 ">
              
              <div className={`p-2 rounded-lg ${COLORS.PAGE_HEADER_SECTION_BG_COLOR}`}>
              <Users className={COLORS.PAGE_HEADER_ICONS_COLOR_AND_SIZE} />
            </div>

              <div>
                <h1 className="page-header-custom tracking-tight pb-0.5">
              Company Users
            </h1>
              <p className="page-subtitle-custom ">
               Manage your organization users, permissions and activities.
            </p>
              </div>
            </div>
            
          {/* ADD USER */}
          <div className="pt-1">
            {!isUsedInAccountProductForAssingingInstalledBy && (
              <>
                <div
                  id="company-users-module-add-button"
                  className="flex gap-2"
                >
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
                      }

                      setIsAddCompanyUserModalOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <UserPlus size={SIZE.SIXTEEN} />
                      Add User
                    </div>
                  </Button>
                </div>

                <AddCompanyUserModal
                  isOpen={isAddCompanyUserModalOpen}
                  onClose={() => setIsAddCompanyUserModalOpen(false)}
                  onUserAdded={refreshAllData}
                />
              </>
            )}
            </div>
        </div>

        {/* Status Cards */}
        <SummaryCards
         cardGap={15}
         width="75%"
         loading={isDataLoading}
          cards={[
            {
              title: "Total Users",
              count: companyUserSummary.total_company_users,
              subtitle: "Organization users",
              icon: Users,
              iconBg: "bg-violet-100",
              iconColor: "text-violet-600",
            },

            {
              title: "Active Users",
              count: companyUserSummary.total_active_users,
              subtitle: "Currently active",
              icon: UserCheck,
              iconBg: "bg-green-100",
              iconColor: "text-green-600",
            },

            {
              title: "Inactive Users",
              count: companyUserSummary.total_inactive_users,
              subtitle: "Currently inactive",
              icon: Clock3,
              iconBg: "bg-orange-100",
              iconColor: "text-orange-500",
            },

            {
              title: "New This Month",
              count: `+${companyUserSummary.total_users_created_this_month}`,
              subtitle: "Recently added users",
              icon: UserPlus,
              iconBg: "bg-white/20 backdrop-blur-sm",
              iconColor: "text-white",
              isGradient: true,
            },
          ]}
        />

        {/* SEARCH + FILTER BAR */}
        <div
          className="
          w-full
          bg-white
          border border-slate-200
          rounded-xl
          py-2
          px-3
          flex items-center 
          gap-5
          flex-wrap
          shadow-sm
        "
        >
          {/* LEFT */}
          <div className="flex items-center gap-3 flex-wrap">

             
                    <span
                      className={`${
                        isCustomDateOptionSelected
                          ? "text-xs"
                          : "section-header-custom"
                      } ${userPreference.sidebarOpen?"":"mr-2"}`}
                    >
                      {userPreference.sidebarOpen?"":"Company Users"}
                    </span>
                 
            {/* SEARCH */}
            <div className=" relative w-[350px] ">
              <Search
                size={16}
                className="absolute left-3  top-1/2 -translate-y-1/2 text-gray-400 "
              />
              <div className="[&>input]:pl-10">
                <SearchInput
                  id="company-user-module-search-box"
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value,
                    );
                  }}
                  value={handleSearchOption.searchParameter}
                  placeholder="Search by name, email or mobile number"
                  height="h-9"
                />
              </div>
            </div>

            {/* DATE FILTER */}
            <div
              className="
                  h-9
                  px-2
                  border border-slate-200
                  rounded-lg
                  bg-white
                  flex items-center 
                  shadow-sm
                "
            >
              <div className="bg-violet-100 h-5 w-5 rounded-md flex justify-center items-center ">
                <Calendar className="text-violet-600 " size={14} />
              </div>
              <div className="flex items-center py-1">
                {/* <span className="text-[11px] text-slate-400">
          Date Filter
        </span> */}

                <DateRangeFilterDropdown
                  dropdownOptions={dateRangeDropdownOptions}
                  handleDateIdChange={handleDateRangeIdChange}
                  selectedOption={selectedDateName}
                  showBorder={false}
                />
              </div>
            </div>

            {/* CUSTOM DATE RANGE */}
            {isCustomDateOptionSelected && (
              <DateRangePicker
                onStartDateChange={onStartDateChange}
                onEndDateChange={onEndDateChange}
                initialStartDate={handleSearchOption.startDate}
                initialEndDate={handleSearchOption.endDate}
              />
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-5 flex-wrap">
            {/* STATUS */}

                        <CustomStatusFilterDropdown
                    options={statusOptions}
                    selectedValue={selectedStatus}
                    onChange={(value) =>
                      setSelectedStatus(
                        value as "ALL" | "ACTIVE" | "INACTIVE"
                      )
                    }
                  />


            {/* RESET */}
            <button
              className="
        h-9
        in-w-[110px]
        px-4
        rounded-lg
        border border-slate-200
        bg-white
        flex items-center gap-2
        text-sm font-medium
        text-slate-600
        hover:bg-slate-50
        transition-all duration-200
        shadow-sm
      "
              onClick={handleResetFilters}
            >
              <RotateCcw size={15} />
              Reset
            </button>

    
          </div>
        </div>
      </div>

      <div className="bg-white overflow-y-auto px-2 pt-1">
        <div
          className={
            isUsedInAccountProductForAssingingInstalledBy
              ? ` w-full h-[calc(70vh-122px)]`
              : userPreference.isLeftMenu
                ? ` w-full h-[calc(100vh-286px)]`
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
            handleUserReportModalOpen={handleUserReportModalOpen}
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
          handleCompanyUserChange={refreshAllData}
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

        <CompanyUserReportModal
          isOpen={isUserReportModalOpen}
          onClose={() => {
            setIsUserReportModalOpen(false);
          }}
          companyUser={selectedCompanyUser}
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
