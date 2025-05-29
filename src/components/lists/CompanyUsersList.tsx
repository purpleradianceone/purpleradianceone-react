import { Users, UserPlus, Calendar, Filter, X } from "lucide-react";
import Button from "../ui/Button";
import { useState } from "react";
import Pagination from "../ag-grid/Pagination";
import CompanyUserAccessManagementModal from "../modals/company-user/CompanyUserAccessManagementModal";
import EditCompanyUserModal from "../modals/company-user/EditCompanyUserModal";
import DateRangePicker from "../ui/DateRangePicker";
import AddCompanyUserModal from "../modals/company-user/AddCompanyUserModal";
import CompanyUser from "../../@types/company-users/CompanyUser";
import SearchInput from "../ui/SearchInput";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import useScreenSize from "../../config/hooks/useScreenSize";
import CompanyUserAgGrid from "../ag-grid/CompanyUsersAgGrid";
import {
  JSX_CHILDREN_NAME,
  SIZE,
} from "../../constants/AppConstants";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useComapanySpecificSearchDateRange } from "../../config/hooks/useCompanySpecificDateRange";
import { useDateRangeIdChange } from "../../config/hooks/useDateRangeIdChange";
import GetCompanyUsersListProps from "../../@types/List/GetCompanyUsersListProps";

function GetCompanyUsersList({
  users,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleCompanyUserChangeOnEdit,
}: GetCompanyUsersListProps) {
  const [isAccessModalOpen, setIsAccessModalOpen] = useState<boolean>(
    false
  );
  const [isEditCompanyUserModalOpen, setIsEditModalOpen] = useState<boolean>(
    false
  );
  const [isAddCompanyUserModalOpen, setIsAddCompanyUserModalOpen] =
    useState<boolean>(false);
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();

  const [isFiltersOpenInMobileView, setIsFiltersOpenInMobileView] =
    useState<boolean>(false);
  const [isFilterOpenInTabletView, setIsFilterOpenInTabletView] = useState(
    false
  );

  const { handleDateRangeIdChange, isCustomDateOptionSelected } =
    useDateRangeIdChange({ dateRangeDropdownOptions, handleSearchOption });

  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();

  const {
    userHasAccessToAddUser,
    userHasAccessToViewUser,
  } = useUserAccessModules();

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

  return (
    userHasAccessToViewUser && (
      <div className="w-full h-screen pt-1 pl-5 pr-1 gap-1">
        <div className="sticky z-10 top-9 p-0.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
          <div className="flex  gap-2">
            {!isSmallScreen && <Users className="w-6 h-6 text-blue-600" />}

            {(isMediumScreen || isLargeScreen) && (
              <span className="text-1xl font-bold">Company Members</span>
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
                    <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
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

          {isMediumScreen && (
            <>
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value
                    );
                  }}
                ></SearchInput>
              </div>
              <div className="flex relative  gap-2  ">
                <div className="mt-1 flex ">
                  <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                    <Calendar />
                  </div>

                  <DateRangeFilterDropdown
                    dropdownOptions={dateRangeDropdownOptions}
                    handleDateIdChange={handleDateRangeIdChange}
                  ></DateRangeFilterDropdown>
                </div>
              </div>
              {isFilterOpenInTabletView && isCustomDateOptionSelected && (
                <div className="fixed inset-0 bg-black bg-opacity-45 flex place-items-start mt-16 justify-center p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                    <button
                      onClick={() => {
                        setIsFilterOpenInTabletView(!isFilterOpenInTabletView);
                      }}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                      <X size={SIZE.TWENTY} />
                    </button>

                    <div className="my-10 justify-items-center mb-5">
                      <div className="mb-5">
                        <DateRangePicker
                          onStartDateChange={onStartDateChange}
                          onEndDateChange={onEndDateChange}
                        />
                      </div>
                      <div className="w-full justify-items-center">
                        <div className="w-24">
                          <Button>Done</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {isSmallScreen && (
            <>
              <div className="relative flex items-start w-80 ">
                <SearchInput
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value
                    );
                  }}
                ></SearchInput>
              </div>
              <div className="flex relative gap-2">
                <Button
                  onClick={() => {
                    setIsFiltersOpenInMobileView(!isFiltersOpenInMobileView);
                  }}
                >
                  <Filter size={SIZE.EIGHT} />
                </Button>
              </div>
              {isFiltersOpenInMobileView && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex place-items-start mt-16 justify-center p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                    <button
                      onClick={() => {
                        setIsFiltersOpenInMobileView(
                          !isFiltersOpenInMobileView
                        );
                      }}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                      <X size={SIZE.EIGHT} />
                    </button>
                    {/* Date FIlters Dropdown */}

                    <div className="flex relative gap-2 items-center justify-center mt-10 mb-3">
                      <div className="mt-1 flex ">
                        <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                          <Calendar size={SIZE.TWENTY} />
                        </div>

                        <DateRangeFilterDropdown
                          dropdownOptions={dateRangeDropdownOptions}
                          handleDateIdChange={handleDateRangeIdChange}
                        ></DateRangeFilterDropdown>
                      </div>
                    </div>

                    {/* Custom Date Picker Div Flex Box*/}
                    <div
                      className="mb-10 justify-items-center"
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

                    {
                      <div className="flex w-full justify-center items-center mb-5">
                        <div className="w-28">
                          <Button
                            onClick={() => {
                              setIsFiltersOpenInMobileView(
                                !isFiltersOpenInMobileView
                              );
                            }}
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              )}
            </>
          )}

          {/* new end */}

          {userHasAccessToAddUser ? (
            <>
              <div className="flex gap-1">
                <Button
                  onClick={() =>
                    setIsAddCompanyUserModalOpen(true)
                  }
                >
                  {!isSmallScreen && <UserPlus size={SIZE.TWENTY} />}
                  {isSmallScreen && <UserPlus size={SIZE.EIGHT} />}
                  {isLargeScreen && JSX_CHILDREN_NAME.ADD_USER}
                </Button>
              </div>
              <AddCompanyUserModal
                isOpen={isAddCompanyUserModalOpen}
                onClose={() =>
                  setIsAddCompanyUserModalOpen(false)
                }
              />
              <EditCompanyUserModal
                handleCompanyUserChange={handleCompanyUserChangeOnEdit}
                isOpen={isEditCompanyUserModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false);
                }}
                user={selectedCompanyUser}
              />
            </>
          ) : (
            <div className="flex gap-1">
              <Button disabled={true}>
                {!isSmallScreen && <UserPlus size={SIZE.TWENTY} />}
                {isSmallScreen && <UserPlus size={SIZE.EIGHT} />}

                {isLargeScreen && JSX_CHILDREN_NAME.ADD_USER}
              </Button>
            </div>
          )}
        </div>


        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
          {/* <div
            className="ag-theme-alpine w-full"
            style={{ height: "80%", width: "100%" }}
          > */}

            <CompanyUserAgGrid
              handleSelectedCompanyUserChange={handleSelectedCompanyUserChange}
              users={users}
              handleIdIsEditModalOpen={handleIdIsEditModalOpen}
              handleIsAccessModalOpen={handleIsAccessModalOpen}
            />
          {/* </div> */}
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
    )
  );
}

export default GetCompanyUsersList;
