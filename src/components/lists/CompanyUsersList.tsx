import { Users, UserPlus, Calendar } from "lucide-react";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import Pagination from "../ag-grid/Pagination";
import CompanyUserAccessManagementModal from "../modals/company-user/CompanyUserAccessManagementModal";
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
import { SIZE } from "../../constants/AppConstants";
import COLORS from "../../constants/Colors";
import AppTutorailManager from "../views/tutorails/AppTutorailManager";
import { CompanyUsersModuleSteps } from "../../constants/AppTutorailsSteps";


function GetCompanyUsersList({
  users,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleCompanyUserChangeOnEdit,
}: GetCompanyUsersListProps) {
  const { userPreference } = useUserPreference();
  const [isAccessModalOpen, setIsAccessModalOpen] = useState<boolean>(false);

  const [isDashboardModalOpen, setIsDashboardModalOpen] =
    useState<boolean>(false);

  const [isEditCompanyUserModalOpen, setIsEditModalOpen] =
    useState<boolean>(false);
  const [isAddCompanyUserModalOpen, setIsAddCompanyUserModalOpen] =
    useState<boolean>(false);
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();


  const { handleDateRangeIdChange, isCustomDateOptionSelected } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });
      const [isAnimationComplete,setIsAnimationComplete] = useState<boolean>(false);



  const { userHasAccessToAddUser } =
    useUserAccessModules();

     useEffect(() => {
        setTimeout(() => {
          setIsAnimationComplete(true);
        },500)
      },[])

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

  const handleTourModalOpen = (index : number) => {
    if(index === 2){
      setIsAddCompanyUserModalOpen(true);
      return;
    }
    else if(index === 5){
      setIsAddCompanyUserModalOpen(false);
      return;
    }
  
  }
  return (
      
      <div
        className={`w-full  pt-1  ${
          userPreference.isLeftMenu ? "pl-5" : "pl-1"
        } pr-1 gap-1`}
      >
              {isAnimationComplete && <AppTutorailManager  steps={CompanyUsersModuleSteps} handleTourEnd={()=>{}} isModalOpen={handleTourModalOpen} modalTriggerIndices={[2,4]}/>}

        <div className={`sticky z-10 top-9 py-0.5 flex items-center justify-between ${COLORS.GRID_HEADER_SECTION_BG_COLOR} rounded-lg shadow-sm  mb-1.5 w-full`}>
          <div className="flex  gap-2">
             <Users className={COLORS.GRID_HEADER_ICONS_COLOR_AND_SIZE} />
              <span className="section-header-custom">Company Users</span>
          </div>
          
            
              <div className="flex gap-1">
                {/* search box flex div */}
                
                <div  className="relative flex items-start w-80">
                  <SearchInput
                  id="company-user-module-search-box"
                    onChange={(e) => {
                      handleSearchOption.handleSearchParameterChange(
                        e.target.value
                      );
                    }}
                  ></SearchInput>
                </div>

                {/* Date FIlters Dropdown */}
                <div id="company-users-module-date-range-filter" className="flex mx-3">
                  <div className="flex">
                    <div className="flex items-center size-4 justify-center mt-1 mr-2 gap-2 input-label-custom">
                      <Calendar className="input-label-custom mt-1" />
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


          

          {/* new end */}

          <>
            {/* {userHasAccessToAddUser ? ( */}
            {/* <> */}
            <div id="company-users-module-add-button" className="flex gap-1">
              <Button
              type="submit"
                disabled={!userHasAccessToAddUser}
                onClick={(e) => {
                  e.preventDefault();
                  if (!userHasAccessToAddUser) {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.COMPANY_USER
                        .DENIED_ADD_ACCESS_COMPANY_USER
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
                  
                  <UserPlus size={SIZE.SIXTEEN}/>
                  Add
                </div>
              </Button>
            </div>
            <AddCompanyUserModal
              isOpen={isAddCompanyUserModalOpen}
              onClose={() => setIsAddCompanyUserModalOpen(false)}
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
          </>
        </div>

        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
          <div
            className={
              userPreference.isLeftMenu
                ? `ag-theme-balham w-full h-[calc(100vh-122px)]`
                : "ag-theme-balham w-full h-[calc(100vh-130px)]"
            }
          >
            <CompanyUserAgGrid
              handleSelectedCompanyUserChange={handleSelectedCompanyUserChange}
              users={users}
              handleIdIsEditModalOpen={handleIdIsEditModalOpen}
              handleIsAccessModalOpen={handleIsAccessModalOpen}
              handleIsDashboardModalOpen={handleIsDashboardModalOpen}
            />
          </div>
          <CompanyUserAccessManagementModal
            isOpen={isAccessModalOpen}
            onClose={() => setIsAccessModalOpen(false)}
            users={selectedCompanyUser}
          />
        </div>
        {/* pagination component */}
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

export default GetCompanyUsersList;
