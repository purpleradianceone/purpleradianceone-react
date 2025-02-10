import {
  Users,
  UserPlus,
  Calendar,
  Filter,
  X,
} from "lucide-react";

import companyUsersSearchProps from "../../@types/company-users/CompanyUserProps";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import Pagination from "../ag-grid/Pagination";
import { useAccessManagementContext } from "../../context/user/AccessManagementContext";
import CompanyUserAccessManagementModal from "../modals/CompanyUserAccessManagementModal";
import axios from "axios";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import PaginationDataProps from "../../@types/ag-grid/PaginationDataProps";
import EditCompanyUserModal from "../modals/EditCompanyUserModal";
import HandleSearchOptionProps from "../../@types/company-users/HandleSearchOptionProps";
import DateRangePicker from "../ui/DateRangePicker";
import AddCompanyUserModal from "../modals/AddCompanyUserModal";
import POST_API from "../../constants/PostApi";
import SearchDropDownOptions from "../../@types/ag-grid/SearchDropDownOptions";
import CompanyUser from "../../@types/company-users/CompanyUser";
import SearchInput from "../ui/SearchInput";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import useScreenSize from "../../config/hooks/useScreenSize";
import CompanyUserAgGrid from "../ag-grid/CompanyUsersAgGrid";
import { NUMBER_VALUES } from "../../constants/AppConstants";

function GetCompanyUsersList({
  users,
  paginationData,
  handleSearchOption,
  onStartDateChange,
  onEndDateChange,
  handleCompanyUserChangeOnEdit,
}: {
  users: companyUsersSearchProps[];
  paginationData: PaginationDataProps;
  handleSearchOption: HandleSearchOptionProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  handleCompanyUserChangeOnEdit: (companyUser: CompanyUser) => void;
}) {
  const [isAccessModalOpen, setIsAccessModalOpen] = useState<boolean>(false);
  const [isEditAccessModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddCompanyUserModalOpen, setIsAddCompanyUserModalOpen] =
    useState<boolean>(false);
  const { accessModules } = useAccessManagementContext();
  const [isCustomDateOptionSelected, setIsCustomDateOptionSelected] =
    useState<boolean>(false);
  const [isFiltersOpenInMobileView, setIsFilterOpenInMobileView] =
    useState<boolean>(false);
  const [isFiltersOpenInTabletView, setIsFilterOpenInTabletView] =
    useState<boolean>(false);

  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();

  const userHasAccessToViewAccess = accessModules.some(
    (accessModule) => accessModule.crm_module_id === NUMBER_VALUES.TWO && accessModule.view
  );
  const userHasAccessToUpdateUser = accessModules.some(
    (accessModule) => accessModule.crm_module_id === NUMBER_VALUES.ONE && accessModule.update
  );

  const handleDateIdChange = (dateId: number) => {
    console.log(dateId);
    if (dateId === NUMBER_VALUES.ZERO) {
      handleSearchOption.handleDateIdChange(0);
      setIsCustomDateOptionSelected(false);
    }
    dropdownOptions.map((option) => {
      if (option.search_date_range_id === dateId) {
        if (dateId === NUMBER_VALUES.EIGHT) {
          setIsCustomDateOptionSelected(true);
          setIsFilterOpenInTabletView(true);
        }
        if (dateId !== 8) {
          setIsCustomDateOptionSelected(false);
        }
        handleSearchOption.handleDateIdChange(option.search_date_range_id);
      }
    });
  };

  const [dropdownOptions, setDropdownOptions] = useState<
    SearchDropDownOptions[]
  >([
    {
      id: 0,
      criteria: "",
      company_id: 0,
      search_pages_criteria_id: 0,
      search_date_range_id: 0,
      createdby: 0,
      updatedby: 0,
      createdon: "",
      updatedon: "",
      date_range: "",
    },
  ]);
  const { loginStatus } = useLoggedInUserContext();

  const fetchData = () => {
    const postData = {
      requestedby: loginStatus.id,
      company_id: loginStatus.companyId,
    };
    axios
      .post(POST_API.COMPANY_SPECIFIC_CRITERIA_DATE_RANGE, postData)
      .then((response) => {
        setDropdownOptions(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleIdIsEditModalOpen = (status : boolean) =>{ 
    setIsEditModalOpen(status);
    if(!status){
      console.log(selectedCompanyUser)
    }
  }

  const handleIsAccessModalOpen = (status : boolean) => {
    setIsAccessModalOpen(status);
  }

  return accessModules.map((accessModule) => {
    if (accessModule.crm_module_id === NUMBER_VALUES.ONE) {
      return (
        <div key={accessModule.id} className="w-full pt-2 pl-5 pr-1 gap-1">
          <div className="sticky z-10 top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
            <div className="flex  gap-2">
              {!isSmallScreen && <Users className="w-6 h-6 text-blue-600" />}

              {(isMediumScreen || isLargeScreen) && (
                <span className="text-1xl font-bold">Company Members</span>
              )}
            </div>

            {isLargeScreen && (
              <>
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

                {/* Date FIlters Dropdown */}
                <div className="flex relative  gap-2  ">
                  <div className="mt-1 flex ">
                    <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                      <Calendar />
                    </div>

                    <DateRangeFilterDropdown
                      dropdownOptions={dropdownOptions}
                      handleDateIdChange={handleDateIdChange}
                    ></DateRangeFilterDropdown>
                  </div>
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
                      dropdownOptions={dropdownOptions}
                      handleDateIdChange={handleDateIdChange}
                    ></DateRangeFilterDropdown>
                  </div>
                </div>
                {isFiltersOpenInTabletView && isCustomDateOptionSelected && (
                  <div className="fixed inset-0 bg-black bg-opacity-10 flex place-items-start mt-16 justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                      <button
                        onClick={() => {
                          setIsFilterOpenInTabletView(
                            !isFiltersOpenInTabletView
                          );
                        }}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                      >
                        <X size={20} />
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
                      setIsFilterOpenInMobileView(!isFiltersOpenInMobileView);
                    }}
                  >
                    <Filter size={8} />
                  </Button>
                </div>
                {isFiltersOpenInMobileView && (
                  <div className="fixed inset-0 bg-black bg-opacity-10 flex place-items-start mt-16 justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                      <button
                        onClick={() => {
                          setIsFilterOpenInMobileView(
                            !isFiltersOpenInMobileView
                          );
                        }}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                      >
                        <X size={8} />
                      </button>
                      {/* Date FIlters Dropdown */}

                      <div className="flex relative gap-2 items-center justify-center mt-10 mb-3">
                        <div className="mt-1 flex ">
                          <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                            <Calendar size={20} />
                          </div>

                          <DateRangeFilterDropdown
                            dropdownOptions={dropdownOptions}
                            handleDateIdChange={handleDateIdChange}
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
                                setIsFilterOpenInMobileView(
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

            {accessModule.add ? (
              <div className="flex gap-2">
                <Button onClick={() => setIsAddCompanyUserModalOpen(true)}>
                  {!isSmallScreen && <UserPlus size={20} />}
                  {isSmallScreen && <UserPlus size={8} />}
                  {isLargeScreen && "Add User"}
                </Button>
                <AddCompanyUserModal
                  isOpen={isAddCompanyUserModalOpen}
                  onClose={() => setIsAddCompanyUserModalOpen(false)}
                />
                <div>
                  <EditCompanyUserModal
                    handleCompanyUserChange={handleCompanyUserChangeOnEdit}
                    isOpen={isEditAccessModalOpen}
                    onClose={() => {
                      setIsEditModalOpen(false);
                    }}
                    user={selectedCompanyUser}
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button disabled={true}>
                  {!isSmallScreen && <UserPlus size={20} />}
                  {isSmallScreen && <UserPlus size={8} />}

                  {isLargeScreen && "Add User"}
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
            <div
              className="ag-theme-alpine w-full"
              style={{ height: "460px", width: "100%" }}
            >
            
            <CompanyUserAgGrid
              handleSelectedCompanyUserChange={handleSelectedCompanyUserChange}
              userHasAccessToUpdateUser = {userHasAccessToUpdateUser}
              userHasAccessToViewAccess = {userHasAccessToViewAccess}
              users={users}
              handleIdIsEditModalOpen={handleIdIsEditModalOpen}
              handleIsAccessModalOpen={handleIsAccessModalOpen}
            />
            </div>
            <CompanyUserAccessManagementModal
              isOpen={isAccessModalOpen}
              onClose={() => setIsAccessModalOpen(false)}
              users={selectedCompanyUser}
            />
          </div>

          <div className="flex items-center justify-end mt-1">
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
  });
}

export default GetCompanyUsersList;
