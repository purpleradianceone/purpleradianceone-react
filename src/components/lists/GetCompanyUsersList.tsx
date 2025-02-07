/* eslint-disable react-hooks/rules-of-hooks */
import {
  Users,
  CheckCircle2,
  XCircle,
  UserPlus,
  UserCheck,
  Edit,
  Calendar,
  Filter,
  X,
} from "lucide-react";

import companyUsersSearchProps from "../../@types/company-users/CompanyUserProps";
import Button from "../ui/Button";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef } from "ag-grid-community";
import Pagination from "../ag-grid/Pagination";
import { useAccessManagementContext } from "../../context/user/AccessManagementContext";
import CompanyUserAccessManagementModal from "../modals/CompanyUserAccessManagementModal";
import axios from "axios";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import PaginationDataProps from "../../@types/ag-grid/PaginationDataProps";
import { EditCompanyUserModal } from "../modals/EditCompanyUserModal";
import { createPortal } from "react-dom";
import HandleSearchOptionProps from "../../@types/company-users/HandleSearchOptionProps";
import { DateRangePicker } from "../ui/DateRangePicker";
import AddCompanyUserModal from "../modals/AddCompanyUserModal";
import POST_API from "../../constants/PostApi";
import SearchDropDownOptions from "../../@types/ag-grid/SearchDropDownOptions";
import CompanyUser from "../../@types/company-users/CompanyUser";
import SearchInput from "../ui/SearchInput";
import DateRangeFilterDropdown from "../ui/DateRangeFilterDropdown";
import useScreenSize from "../../config/hooks/useScreenSize";

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
    (accessModule) => accessModule.crm_module_id === 2 && accessModule.view
  );
  const userHasAccessToUpdateUser = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 1 && accessModule.update
  );

  const handleDateIdChange = (dateId: number) => {
    console.log(dateId);
    if (dateId === 0) {
      handleSearchOption.handleDateIdChange(0);
      setIsCustomDateOptionSelected(false);
    }
    dropdownOptions.map((option) => {
      if (option.search_date_range_id === dateId) {
        if (dateId === 8) {
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
  }, []);

  const [selectedUser, setSelectedUser] = useState({
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

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "fullname",
        headerName: "Name",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        //
        comparator: (valueA, valueB) => {
          if (!valueA) return -1;
          if (!valueB) return 1;
          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        },
      },
      {
        field: "email",
        headerName: "Email",
        sortable: true,
        filter: true,
        flex: 1.5,
      },
      {
        field: "mobilenumber",
        headerName: "Mobile Number",
        sortable: true,
        filter: true,
      },
      {
        field: "isactive",
        headerName: "Status",
        sortable: true,
        filter: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center gap-1 mt-3">
              {params.value ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Active</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Inactive</span>
                </>
              )}
            </div>
          );
        },
      },
      {
        headerName: "Actions",
        sortable: false,
        maxWidth: 100,
        pinned: "right",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
          const [isActionsDropDownOpen, setIsActionsDropDownOpen] =
            useState(false);
          const [position, setPosition] = useState({ top: 0, left: 0 });
          const dropdownRef = useRef<HTMLDivElement | null>(null);

          const handleActionsButtonClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            setIsActionsDropDownOpen((prev) => !prev);

            const rect = event.currentTarget.getBoundingClientRect();
            setPosition({
              top: rect.bottom + window.scrollY - 10, // Position below button
              left: rect.left + window.scrollX - 25, // Align with button
            });
          };

          useEffect(() => {
            const handleClickOutsideActionsDropDown = (event: MouseEvent) => {
              if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
              ) {
                setIsActionsDropDownOpen(false);
              }
            };

            document.addEventListener(
              "mousedown",
              handleClickOutsideActionsDropDown
            );
            return () =>
              document.removeEventListener(
                "mousedown",
                handleClickOutsideActionsDropDown
              );
          }, []);

          return (
            <>
              <button
                className="text-blue-600"
                onClick={handleActionsButtonClick}
              >
                Actions ▾
              </button>

              {isActionsDropDownOpen &&
                createPortal(
                  <div
                    ref={dropdownRef}
                    className="absolute bg-white border rounded-md shadow-lg w-24 ml-2 z-50"
                    style={{ top: position.top, left: position.left }}
                  >
                    {userHasAccessToViewAccess ? (
                      <>
                        <button
                          className="block w-full text-blue-600 p-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => {
                            setSelectedUser({
                              company_id: params.data.company_id,
                              id: params.data.id,
                              fullname: params.data.fullname,
                              email: params.data.email,
                              mobilenumber: params.data.mobilenumber,
                              createdby: "",
                              isactive: params.data.isactive,
                              requestedby: "",
                              generate_password: "",
                            });
                            setIsAccessModalOpen(true);
                            setIsActionsDropDownOpen(false);
                          }}
                        >
                          <UserCheck className="inline mr-2 size-4" /> Access
                        </button>
                        {userHasAccessToUpdateUser ? (
                          <button
                            className="block w-full text-blue-600 text-sm p-2 text-left hover:bg-gray-100"
                            onClick={() => {
                              setSelectedUser({
                                company_id: params.data.company_id,
                                id: params.data.id,
                                fullname: params.data.fullname,
                                email: params.data.email,
                                mobilenumber: params.data.mobilenumber,
                                createdby: "",
                                isactive: params.data.isactive,
                                requestedby: "",
                                generate_password: "",
                              });
                              setIsEditModalOpen(true);
                              setIsActionsDropDownOpen(false);
                            }}
                          >
                            <Edit className="inline mr-2 size-4" /> Edit
                          </button>
                        ) : (
                          <button
                            disabled
                            className="disabled text-sm p-2 text-left"
                          >
                            <Edit className="inline mr-2  size-4" /> Edit
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button
                          disabled
                          className="disabled text-sm p-2 text-lef"
                        >
                          <UserCheck className="inline mr-2 size-4" /> Access
                        </Button>
                        {userHasAccessToUpdateUser ? (
                          <button
                            className="block w-full text-blue-600 text-sm p-2 text-left hover:bg-gray-100"
                            onClick={() => {
                              setSelectedUser({
                                company_id: params.data.company_id,
                                id: params.data.id,
                                fullname: params.data.fullname,
                                email: params.data.email,
                                mobilenumber: params.data.mobilenumber,
                                createdby: "",
                                isactive: params.data.isactive,
                                requestedby: "",
                                generate_password: "",
                              });
                              setIsEditModalOpen(true);
                              setIsActionsDropDownOpen(false);
                            }}
                          >
                            <Edit className="inline mr-2 size-4" /> Edit
                          </button>
                        ) : (
                          <Button
                            disabled
                            className="disabled text-sm p-2 text-left"
                          >
                            <Edit className="inline mr-2 size-4" /> Edit
                          </Button>
                        )}
                      </>
                    )}
                  </div>,
                  document.body // Render dropdown in body to avoid clipping
                )}
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      minWidth: 150,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);

  return accessModules.map((accessModule) => {
    if (accessModule.crm_module_id === 1) {
      return (
        <div key={accessModule.id} className="w-full pt-2 pl-5 pr-1 gap-1">
          <div className="sticky z-10 top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
            <div className="flex  gap-2">
              {!isSmallScreen && (
                <Users className="w-6 h-6 text-blue-600" />
              )}
              
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
                    user={selectedUser}
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
              <AgGridReact
                rowData={users}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                modules={[AllCommunityModule]}
              />
            </div>
            <CompanyUserAccessManagementModal
              isOpen={isAccessModalOpen}
              onClose={() => setIsAccessModalOpen(false)}
              users={selectedUser}
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
