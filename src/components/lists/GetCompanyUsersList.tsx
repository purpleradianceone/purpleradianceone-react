
/* eslint-disable react-hooks/rules-of-hooks */
import {
  Users,
  CheckCircle2,
  XCircle,
  UserPlus,
  UserCheck,
  Edit,
  Calendar,
} from "lucide-react";

import companyUsersProps from "../../@types/company-users/CompanyUserProps";
import Button from "../ui/Button";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AddCompanyUserPopUp } from "../forms/AddCompanyUserPopUp";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef } from "ag-grid-community";
import Pagination from "./Pagination";
import { useAccessManagementContext } from "../../context/user/AccessManagementContext";
import CompanyUserAccessManagementModal from "../modals/CompanyUserAccessManagementModal";
import axios from "axios";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import DropDownOption from "../../@types/ag-grid/SearchDropDownOptionProps";
import PaginationDataProps from "../../@types/ag-grid/PaginationDataProps";
import { EditCompanyUserModal } from "../modals/EditCompanyUserModal";
import { createPortal } from "react-dom";
import HandleSearchOptionProps from "../../@types/HandleSearchOptionProps";
import { DateRangePicker } from "../DateRangePicker";
import User from "../../@types/company-users/User";

export function GetCompanyUsersList({
  users,
  paginationData,
  handleSearchOption,
  onStartDateChange, 
  onEndDateChange ,
  handleCompanyUserChangeOnEdit

}: {
  users: companyUsersProps[];
  paginationData: PaginationDataProps;
  handleSearchOption: HandleSearchOptionProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  handleCompanyUserChangeOnEdit:(companyUser:User)=>void
}) {
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isEditAccessModalOpen,setIsEditModalOpen]= useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { accessModules } = useAccessManagementContext();
  const [isCustomDateOptionSelected, setIsCustomDateOptionSelected] =useState<boolean>(false);

  const userHasAccessToViewAccess = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 2 && accessModule.view
  );
  const userHasAccessToUpdateUser = accessModules.some(
    (accessModule) => accessModule.crm_module_id === 1 && accessModule.update
  );
  

  const [dropdownOptions, setDropdownOptions] = useState<DropDownOption[]>([
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
        requestedby: loginStatus.userId,
        company_id: loginStatus.companyId,
      };
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + loginStatus.token;
      axios
        .post(
          `/api/main/purple-crm-api/get/companyspecificcriteria/daterange`,
          postData
        )
        .then((response) => {
          setDropdownOptions(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
  
  };

 useEffect(()=>{
  fetchData();
 },[])
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
        maxWidth:100,
        pinned: "right",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
          const [isOpen, setIsOpen] = useState(false);
          const [position, setPosition] = useState({ top: 0, left: 0 });
          const dropdownRef = useRef<HTMLDivElement | null>(null);
      
          
      
          const handleButtonClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            setIsOpen((prev) => !prev);
      
            const rect = event.currentTarget.getBoundingClientRect();
            setPosition({
              top: rect.bottom + window.scrollY -10, // Position below button
              left: rect.left + window.scrollX - 25, // Align with button
            });
          };
      
          useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
              if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
              }
            };
      
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
          }, []);
      
          return (
            <>
            
              <button
                className="text-blue-600"
                onClick={handleButtonClick}
              >
                Actions ▾
              </button>
      
              {isOpen &&
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
                            setIsOpen(false);
                          }}
                        >
                          <UserCheck className="inline mr-2 size-4" /> Access
                        </button>
                        {userHasAccessToUpdateUser ? <button
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
                            setIsOpen(false);
                          }}
                        >
                          <Edit className="inline mr-2 size-4" /> Edit
                        </button>  : <button disabled className="disabled text-sm p-2 text-left"> 
                          <Edit className="inline mr-2  size-4" /> Edit
                        </button>}
                        
                      </>
                    ) : (
                      <>
                        <Button disabled className="disabled text-sm p-2 text-lef">
                          <UserCheck className="inline mr-2 size-4" /> Access
                        </Button>
                        {userHasAccessToUpdateUser ? <button
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
                            setIsOpen(false);
                          }}
                        >
                          <Edit className="inline mr-2 size-4" /> Edit
                        </button>  : <Button disabled className="disabled text-sm p-2 text-left"> 
                          <Edit className="inline mr-2 size-4" /> Edit
                        </Button>}
                        
                      </>
                    )}
                  </div>,
                  document.body // Render dropdown in body to avoid clipping
                )}
            </>
          );
        },
      }
      
    ],
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
        <div key={accessModule.id}
        className="w-full pt-2 pl-5 pr-1 gap-1">
          <div className="sticky z-10 top-16 p-1.5 flex items-center justify-between  bg-gray-50 rounded-lg shadow-sm  mb-1.5 w-full">
            <div className="flex  gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-1xl font-bold">Company Members</span>
            </div>
            <div className="relative flex items-start w-80 ">
                <input
                  type="search"
                  className="w-full h-10 pl-2 pr-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Search..."
                  onChange={(e) => {
                    handleSearchOption.handleSearchParameterChange(
                      e.target.value
                    );
                  }}
                />
              </div>
              <div style={isCustomDateOptionSelected ? {visibility: "visible"}: {visibility:"hidden"} }>
                <DateRangePicker
                onStartDateChange={onStartDateChange}
                onEndDateChange={onEndDateChange}
              />
              </div>
            <div className="flex relative  gap-2  ">
              <div className="mt-1 flex ">
              <div className="flex items-center size-4 justify-center mt-2 mr-2 gap-2 text-gray-900">
                  <Calendar/>
                </div>
                <select
                  className="border p-1 w-auto  pb-1  rounded-md min-w-24"
                  title="Date Filter"
                  disabled={dropdownOptions.length === 0}
                  onChange={(e) => {
                    if(e.target.value==="0"){
                      handleSearchOption.handleDateIdChange(0)
                      setIsCustomDateOptionSelected(false)
                    }
                    dropdownOptions.map((option) => {
                      if (option.date_range === e.target.value) {
                        if (e.target.value === "Custom") {
                          setIsCustomDateOptionSelected(true);
                        }
                        if (e.target.value !== "Custom") {
                          setIsCustomDateOptionSelected(false);
                        }
                        handleSearchOption.handleDateIdChange(
                          option.search_date_range_id
                        );
                      }
                     
                    });
                   
                  }}
                >
                  <option value={0} 
                  onClick={()=>{
                    handleSearchOption.handleDateIdChange(0)
                  }} 
                  >Custom Date Filter</option>
                  {dropdownOptions.map((item) => (
                    <option
                      key={item.id}
                     
                      value={item.date_range}
                      className="text-gray-800"
                    >
                      
                      {item.date_range}
                    </option>
                  ))}
                </select>
               
              </div>
            </div>
            {/* new end */}

            {accessModule.add ? (
              <div>
                <Button onClick={() => setIsOpen(true)}>
                  <UserPlus size={20} />
                  Add Company User
                </Button>
                <AddCompanyUserPopUp
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                />
                <div>
          <EditCompanyUserModal
          handleCompanyUserChange={handleCompanyUserChangeOnEdit}
              isOpen={isEditAccessModalOpen}
              onClose={() => {
                setIsEditModalOpen(false)}
              }
              user={selectedUser}
            />
          </div>
              </div>
            ) : (
              <div>
                <Button disabled={true}>
                  <UserPlus size={20} />
                  Add Company User
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
