import {
  Users,
  CheckCircle2,
  XCircle,
  Search,
  UserPlus,
  
} from "lucide-react";
import companyUsersProps from "../../@types/company-users/CompanyUserProps";
import Button from "../ui/Button";
import { useEffect, useMemo, useState } from "react";
import { AddCompanyUserPopUp } from "../forms/AddCompanyUserPopUp";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef } from "ag-grid-community";
import Pagination from "./Pagination";
import { useAccessManagementContext } from "../../context/user/AccessManagementContext";
import CompanyUserAccessManagementModal from "../modals/CompanyUserAccessManagementModal";
import axios from "axios";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import DropDownOption from "../../@types/DropDownOptionProps";
import PaginationDataProps from "../../@types/PaginationDataProps";

// type DropDownOption = {
//   id?:number,
//   criteria?: string;
//   company_id?: number;
//   search_pages_criteria_id?: number;
//   search_date_range_id?: number;
//   createdby?: number;
//   updatedby?: number;
//   createdon?: string;
//   updatedon?: string;
//   date_range?: string;
// };

export function GetCompanyUsersList({
  users,
  paginationData,
}: {
  users: companyUsersProps[];
  paginationData: PaginationDataProps;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { accessModules } = useAccessManagementContext();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [dropdownOptions, setDropdownOptions] = useState<DropDownOption[]>([
    {
      id:0,
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

  useEffect(() => {
    if (selectedOption) {
      fetchData(selectedOption);
    }
  }, [selectedOption]);

  const fetchData = (value: string) => {
    if (value === "Column") {
      const postData = {
        requestedby: loginStatus.userId,
        company_id: loginStatus.companyId,
        search_pages_id: 1,
      };
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + loginStatus.token;
      axios
        .post(
          `/api/main/purple-crm-api/get/companyspecificcriteria/pages`,
          postData
        )
        .then((response) => {
          setDropdownOptions(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    if (value === "Date") {
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
    }
  };
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
        field: "company_id",
        headerName: "Created By",
        sortable: true,
        filter: "agNumberColumnFilter",
        flex: 0.5,
      },
      {
        field: "id",
        headerName: "User ID",
        sortable: true,
        filter: "agNumberColumnFilter",
        flex: 1,
      },
      {
        field: "fullname",
        headerName: "Name",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
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
        flex: 0.8,
      },
      {
        field: "isactive",
        headerName: "Status",
        sortable: true,
        filter: true,
        flex: 0.8,

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
        headerName: "Access",
        sortable: false,
        flex: 0.6,
        // pinned:'right',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
          return accessModules.map((accessModule) => {
            if (accessModule.crm_module_id === 2) {
              if (accessModule.view) {
                return (
                  <Button
                    className="w-24 mt-0.5 flex justify-center py-1.5 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                      setSelectedUser({
                        company_id: params.data.company_id,
                        id: params.data.id,
                        fullname: params.data.fullname,
                        email: params.email,
                        mobilenumber: params.data.mobilenumber,
                        createdby: "",
                        isactive: params.data.isactive,
                        requestedby: "",
                        generate_password: "",
                      });

                      setIsModalOpen(true);
                    }}
                  >
                    Access
                  </Button>
                );
              } else {
                return (
                  <div>
                    <Button disabled={true}>Access</Button>
                  </div>
                );
              }
            }
          });
        },
      },
    ],
    []
  );

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      // floatingFilter:true,
      // resizable: true,
      // suppressSizeToFit: true
      minWidth: 150,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);

  return accessModules.map((accessModule) => {
    if (accessModule.crm_module_id === 1) {
      return (
        <div className="w-full pt-2 px-6 gap-1">
          <div className="sticky z-10 top-16 p-4 flex items-center  bg-gray-50 rounded-lg shadow-sm justify-between mb-4 w-full">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-1xl font-bold">Company Members</span>
            </div>
            {/*  */}
            {/* 
             <div className="flex-1 flex items-center gap-2 ml-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 whitespace-nowrap">Search By :</span>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={searchBy === 'column'}
                    onChange={() => setSearchBy('column')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Column</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={searchBy === 'date'}
                    onChange={() => setSearchBy('date')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Date</span>
                </label>
              </div>

              <div className="flex-1 relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-auto flex items-center justify-between px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <span className="text-gray-700">
                    {selectedOption || `Select ${searchBy === 'column' ? 'a column' : 'a date'}`}
                  </span>
                  <ChevronDown size={20} className="text-gray-400" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-40 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {dropdownOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedOption(option.label);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full  text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div> */}

            {/*  */}

            {/* new code */}
            <div className="flex-1 flex items-center gap-2 ml-4 w-auto">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 whitespace-nowrap">Search By :</span>
                <label>
                  <input
                    type="radio"
                    name="Column"
                    value="Column"
                    checked={selectedOption === "Column"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  Column
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="Date"
                    value="Date"
                    checked={selectedOption === "Date"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  Date
                </label>
              </div>

              <div className="mt-1">
                <select
                  className="border p-1 pl-3 pb-1 rounded-md w-full min-w-24"
                  disabled={dropdownOptions.length === 0}
                >
                  {dropdownOptions.map((item) => (
                    <option key={item.id} value={item.criteria} className="text-gray-800">
                      {item.criteria}
                      {item.date_range}
                    </option>
                  ))}
                 
                </select>
              </div>
            </div>
            {/* new end */}


            {/* search bar main div */}
            <div className="relative w-60 mr-4">
              <input
                type="search"
                className="w-full h-10 pl-10 pr-12 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Search..."
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              {/* <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-1 text-sm text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none"
              >
                Search
              </button> */}
            </div>

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
              style={{ height: "400px", width: "100%" }}
            >
              <AgGridReact
                rowData={users}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                modules={[AllCommunityModule]}
              />
              <div></div>
            </div>
            <CompanyUserAccessManagementModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
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
