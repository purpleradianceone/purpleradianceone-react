import { Users, UserPlus, Calendar, Filter, X } from "lucide-react";

import companyUsersSearchProps from "../../@types/company-users/CompanyUserProps";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import Pagination from "../ag-grid/Pagination";
import { useAccessManagementContext } from "../../context/user/AccessManagementContext";
import CompanyUserAccessManagementModal from "../modals/company-user/CompanyUserAccessManagementModal";
import axios from "axios";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import PaginationDataProps from "../../@types/ag-grid/PaginationDataProps";
import EditCompanyUserModal from "../modals/company-user/EditCompanyUserModal";
import HandleSearchOptionProps from "../../@types/company-users/HandleSearchOptionProps";
import DateRangePicker from "../ui/DateRangePicker";
import AddCompanyUserModal from "../modals/company-user/AddCompanyUserModal";
import POST_API from "../../constants/PostApi";
import SearchDropDownOptions from "../../@types/ag-grid/SearchDropDownOptions";
import CompanyUser from "../../@types/company-users/CompanyUser";
import SearchInput from "../ui/SearchInput";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import useScreenSize from "../../config/hooks/useScreenSize";
import CompanyUserAgGrid from "../ag-grid/CompanyUsersAgGrid";
import {
  BOOLEAN_VALUES,
  JSX_CHILDREN_NAME,
  NUMBER_VALUES,
  SIZE,
  STRING_VALUES,
} from "../../constants/AppConstants";
import MESSAGE from "../../constants/Messages";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../ui/MessageSnackbar";

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
  const [isAccessModalOpen, setIsAccessModalOpen] = useState<boolean>(
    BOOLEAN_VALUES.FALSE
  );
  const [isEditAccessModalOpen, setIsEditModalOpen] = useState<boolean>(
    BOOLEAN_VALUES.FALSE
  );
  const [isAddCompanyUserModalOpen, setIsAddCompanyUserModalOpen] =
    useState<boolean>(BOOLEAN_VALUES.FALSE);
  const { accessModules } = useAccessManagementContext();
  const [isCustomDateOptionSelected, setIsCustomDateOptionSelected] =
    useState<boolean>(BOOLEAN_VALUES.FALSE);
  const [isFiltersOpenInMobileView, setIsFilterOpenInMobileView] =
    useState<boolean>(BOOLEAN_VALUES.FALSE);
  const [isFiltersOpenInTabletView, setIsFilterOpenInTabletView] =
    useState<boolean>(BOOLEAN_VALUES.FALSE);

  const { isLargeScreen, isMediumScreen, isSmallScreen } = useScreenSize();

  const userHasAccessToViewAccess = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === NUMBER_VALUES.TWO && accessModule.view
  );
  const userHasAccessToUpdateUser = accessModules.some(
    (accessModule) =>
      accessModule.crm_module_id === NUMBER_VALUES.ONE && accessModule.update
  );

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: BOOLEAN_VALUES.FALSE,
    message: STRING_VALUES.EMPTY_STRING,
    type: "success",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: BOOLEAN_VALUES.TRUE, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: BOOLEAN_VALUES.FALSE }));
  };

  const handleDateIdChange = (dateId: number) => {
    console.log(dateId);
    if (dateId === NUMBER_VALUES.ZERO) {
      handleSearchOption.handleDateIdChange(NUMBER_VALUES.ZERO);
      setIsCustomDateOptionSelected(BOOLEAN_VALUES.FALSE);
    }
    dropdownOptions.map((option) => {
      if (option.search_date_range_id === dateId) {
        if (dateId === NUMBER_VALUES.EIGHT) {
          setIsCustomDateOptionSelected(BOOLEAN_VALUES.TRUE);
          setIsFilterOpenInTabletView(BOOLEAN_VALUES.TRUE);
        }
        if (dateId !== NUMBER_VALUES.EIGHT) {
          setIsCustomDateOptionSelected(BOOLEAN_VALUES.FALSE);
        }
        handleSearchOption.handleDateIdChange(option.search_date_range_id);
      }
    });
  };

  const [dropdownOptions, setDropdownOptions] = useState<
    SearchDropDownOptions[]
  >([
    {
      id: NUMBER_VALUES.ZERO,
      criteria: STRING_VALUES.EMPTY_STRING,
      company_id: NUMBER_VALUES.ZERO,
      search_pages_criteria_id: NUMBER_VALUES.ZERO,
      search_date_range_id: NUMBER_VALUES.ZERO,
      createdby: NUMBER_VALUES.ZERO,
      updatedby: NUMBER_VALUES.ZERO,
      createdon: STRING_VALUES.EMPTY_STRING,
      updatedon: STRING_VALUES.EMPTY_STRING,
      date_range: STRING_VALUES.EMPTY_STRING,
    },
  ]);
  const { loginStatus } = useLoggedInUserContext();

  const fetchData = () => {
    const postData = {
      requestedby: loginStatus.id,
      company_id: loginStatus.companyId,
    };
    axios
      .post(POST_API.COMPANY_SPECIFIC_CRITERIA_DATE_RANGE, postData, {
        withCredentials: BOOLEAN_VALUES.TRUE,
      })
      .then((response) => {
        if (response.data) {
          setDropdownOptions(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
        showMessageSnackbar({
          message: MESSAGE.ERROR.SOMETHING_WENT_WRONG,
          type: "error",
        });
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedCompanyUser, setSelectedCompanyUser] = useState<CompanyUser>({
    company_id: NUMBER_VALUES.ZERO,
    id: NUMBER_VALUES.ZERO,
    fullname: STRING_VALUES.EMPTY_STRING,
    email: STRING_VALUES.EMPTY_STRING,
    mobilenumber: STRING_VALUES.EMPTY_STRING,
    createdby: STRING_VALUES.EMPTY_STRING,
    isactive: BOOLEAN_VALUES.FALSE,
    requestedby: STRING_VALUES.EMPTY_STRING,
    generate_password: STRING_VALUES.EMPTY_STRING,
  });

  const handleSelectedCompanyUserChange = (params: CompanyUser) => {
    setSelectedCompanyUser({
      company_id: params.company_id,
      id: params.id,
      fullname: params.fullname,
      email: params.email,
      mobilenumber: params.mobilenumber,
      createdby: STRING_VALUES.EMPTY_STRING,
      isactive: params.isactive,
      requestedby: STRING_VALUES.EMPTY_STRING,
      generate_password: STRING_VALUES.EMPTY_STRING,
    });
  };

  const handleIdIsEditModalOpen = (status: boolean) => {
    setIsEditModalOpen(status);
  };

  const handleIsAccessModalOpen = (status: boolean) => {
    setIsAccessModalOpen(status);
  };

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
                        dropdownOptions={dropdownOptions}
                        handleDateIdChange={handleDateIdChange}
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

                {/* space for future elements to be added */}
                <div style={{width:"250px"}}></div>
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
                  <div className="fixed inset-0 bg-black bg-opacity-45 flex place-items-start mt-16 justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
                      <button
                        onClick={() => {
                          setIsFilterOpenInTabletView(
                            !isFiltersOpenInTabletView
                          );
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
                      setIsFilterOpenInMobileView(!isFiltersOpenInMobileView);
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
                          setIsFilterOpenInMobileView(
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
              <>
                <div className="flex gap-1">
                  <Button
                    onClick={() =>
                      setIsAddCompanyUserModalOpen(BOOLEAN_VALUES.TRUE)
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
                      setIsAddCompanyUserModalOpen(BOOLEAN_VALUES.FALSE)
                    }
                  />
                <EditCompanyUserModal
                  handleCompanyUserChange={handleCompanyUserChangeOnEdit}
                  isOpen={isEditAccessModalOpen}
                  onClose={() => {
                    setIsEditModalOpen(BOOLEAN_VALUES.FALSE);
                  }}
                  user={selectedCompanyUser}
                />
              </>
            ) : (
              <div className="flex gap-1">
                <Button disabled={BOOLEAN_VALUES.TRUE}>
                  {!isSmallScreen && <UserPlus size={SIZE.TWENTY} />}
                  {isSmallScreen && <UserPlus size={SIZE.EIGHT} />}

                  {isLargeScreen && JSX_CHILDREN_NAME.ADD_USER}
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
                handleSelectedCompanyUserChange={
                  handleSelectedCompanyUserChange
                }
                userHasAccessToUpdateUser={userHasAccessToUpdateUser}
                userHasAccessToViewAccess={userHasAccessToViewAccess}
                users={users}
                handleIdIsEditModalOpen={handleIdIsEditModalOpen}
                handleIsAccessModalOpen={handleIsAccessModalOpen}
              />
            </div>
            <CompanyUserAccessManagementModal
              isOpen={isAccessModalOpen}
              onClose={() => setIsAccessModalOpen(BOOLEAN_VALUES.FALSE)}
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
  });
}

export default GetCompanyUsersList;
