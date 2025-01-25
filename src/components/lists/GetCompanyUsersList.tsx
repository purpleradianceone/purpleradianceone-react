
import {Users,CheckCircle2,XCircle,Search,UserPlus,} from "lucide-react";
import companyUsersProps from "../../@types/company-users/CompanyUserProps";
import Button from "../ui/Button";
import { useMemo, useState } from "react";
import { ModalAccessCompanyUser } from "../moduleaccessrights/ModalAccessCompanyUser";
import { AddCompanyUserPopUp } from "../forms/AddCompanyUserPopUp";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef } from "ag-grid-community";
import Pagination from "./Pagination";



export function GetCompanyUsersList({ users }: { users: companyUsersProps[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    company_id: 0,
    id: 0,
    fullname: "",
    email: "",
    mobilenumber: "",
    createdby: "",
    isactive: false,
    requestedby: "",
    generate_password:""
  });
  const pagination =true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector=[10,50,100];

  // const rowSelection: RowSelectionOptions = {
    // mode: "singleRow",
    // headerCheckbox: false,
  // };

  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: 'company_id',
      headerName: 'Created By',
      sortable: true,
      filter: true,
      flex: 0.5,
      // editable:true,
      // cellEditor:"agSelectCellEditor"
    },
    {
      field: 'id',
      headerName: 'User ID',
      sortable: true,
      filter: true,
      flex:1
    },
    { 
      field: 'fullname',
      headerName: 'Name',
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
    },
    { 
      field: 'email',
      headerName: 'Email',
      sortable: true,
      filter: true,
      flex: 1.5
    },
    { 
      field: 'mobilenumber',
      headerName: 'Mobile Number',
      sortable: true,
      filter: true,
      flex: 0.8
    },
    { 
      field: 'isactive',
      headerName: 'Status',
      sortable: true,
      filter: true,
      flex:0.8,
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center gap-1">
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
      }
    },
    {
      headerName: 'Access',
      sortable: false,
      filter: false,
      flex: 0.6,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => {
        return (
          <Button
          className="w-24 mt-0.5 flex justify-center py-1.5 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              setSelectedUser({
                company_id: params.data.company_id,
                id:  params.data.id,
                fullname:  params.data.fullname,
                email: params.email,
                mobilenumber: params.data.mobilenumber,
                createdby: "",
                isactive: params.data.isactive,
                requestedby: "",
                generate_password:""

              });
              
              setIsModalOpen(true);
            }}
          >
            Access
          </Button>
        );
      }
    }
  ], []);

  const defaultColDef = useMemo(() => {
    return{
      filter:"agTextColumnFilter",
      floatingFilter:true,
      // resizable: true,
      // suppressSizeToFit: true
    };
  }, []);

/////////////////////////////////////////////////////
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const totalPages = 10; // Replace with dynamic total pages

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to page 1 when page size changes
  };
 
  //////////////////////////////////////////// 
  return (
    <div className="w-full pt-2 px-6">
      <div className="sticky z-10 top-16 p-4 flex items-center  bg-gray-50 rounded-lg shadow-sm justify-between mb-4 w-full">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Company Members</h1>
        </div>
        
        <div className="relative w-80">
          <input
            type="search"
            className="w-full h-10 pl-10 pr-12 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Search members..."
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none"
          >
            Search
          </button>
        </div>

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
      </div>

      <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
        <div 
          className="ag-theme-alpine w-full" 
          style={{ height: '400px', width: '100%' }}
        >
          <AgGridReact
            rowData={users}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            // animateRows={true}
            // rowSelection={rowSelection}
            // pagination={pagination}
            // paginationPageSize={paginationPageSize} 
            // paginationPageSizeSelector={paginationPageSizeSelector} 
           modules={[AllCommunityModule]}
          />
           <div>
      
    </div>
        </div>
        <ModalAccessCompanyUser
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={selectedUser}
      />
      </div>
      <div className="flex items-center justify-center">
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      </div>
    </div>
  );
}