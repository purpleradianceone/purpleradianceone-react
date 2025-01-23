// import {Users,CheckCircle2,XCircle,Search,UserPlus,} from "lucide-react";
// import companyUsersProps from "../../@types/company-users/CompanyUserProps";
// import Button from "../ui/Button";
// import { useState } from "react";
// import { ModalAccessCompanyUser } from "../moduleaccessrights/ModalAccessCompanyUser";
// import { AddCompanyUserPopUp } from "../forms/AddCompanyUserPopUp";

// export function GetCompanyUsersList({ users }: { users: companyUsersProps[] }) {

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="w-full pt-2 px-6">
//       <div className="sticky z-10  top-16 p-2 flex items-center bg-gray-50 rounded-lg justify-between mb-4 w-full">
//         <div className="flex items-center gap-2">
//           <Users className="w-6 h-6 text-blue-600" />
//           <h1 className="text-2xl font-bold">Company Members</h1>
//         </div>

//         <div className="relative w-80 -z-10">
//           <input
//             type="search"
//             className="w-full h-10 pl-10 pr-12 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//             placeholder="Search members..."
//           />
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3">
//             <Search className="w-4 h-4 text-gray-400" />
//           </div>
//           <button
//             type="button"
//             className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none"
//           >
//             Search
//           </button>
//         </div>
//         <div >

//           <Button
//            onClick={() => setIsOpen(true)}
//           >
//             <UserPlus size={20} />  Add Company User
//           </Button>
//           {/* Component for adding a new company user ,  it will open in pop up     */}
//           <AddCompanyUserPopUp
//             isOpen={isOpen}
//             onClose={() => setIsOpen(false)}
//           />
//           </div>
//       </div>

//       <div className="overflow-x-auto overflow-y-auto  rounded-lg border border-gray-200 bg-white">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               {[
//                 { key: "createdby", label: "Created By" },
//                 // { key: "id", label: "User Id" },
//                 { key: "fullname", label: "Name" },
//                 { key: "email", label: "Email" },
//                 { key: "mobileNumber", label: "Mobile Number" },
//                 { key: "isactive", label: "Status" },
//                 { key: "Access", label: "Access" },
//               ].map(({ key, label }) => (
//                 <th
//                   key={key}
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   {key !== "status" ? (
//                     <button className="flex items-center gap-1 hover:text-gray-700">
//                       {label}
//                       {/* <ArrowUpDown className="w-4 h-4" /> */}
//                     </button>
//                   ) : (
//                     label
//                   )}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.map((user, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="px-4 py-2 whitespace-nowrap">
//                   <div className="text-sm text-gray-600">{user.company_id}</div>
//                 </td>
//                 {/* <td className="px-4 py-2 whitespace-nowrap">
//                   <div className="text-sm text-gray-600">{user.id}</div>
//                 </td> */}
//                 <td className="px-4 py-2 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">
//                     {user.fullname}
//                   </div>
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap">
//                   <div className="text-sm text-gray-600">{user.email}</div>
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap">
//                   <div className="text-sm text-gray-600">
//                     {user.mobilenumber}
//                   </div>
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap">
//                   <div className="flex items-center gap-1">
//                     {user.isactive ? (
//                       <>
//                         <CheckCircle2 className="w-4 h-4 text-green-500" />
//                         <span className="text-sm text-green-600">Active</span>
//                       </>
//                     ) : (
//                       <>
//                         <XCircle className="w-4 h-4 text-red-500" />
//                         <span className="text-sm text-red-600">Inactive</span>
//                       </>
//                     )}
//                   </div>
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap">
//                   <div className="text-sm text-gray-600">
//                     <Button
//                       onClick={() => setIsModalOpen(true)}
//                       className="w-full flex justify-center py-1.5 px-2 border border-transparent rounded-md shadow-sm text-sm font-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     >
//                       Access
//                     </Button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <ModalAccessCompanyUser
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         userName="[Company User Name]"
//         />
//       </div>

//     </div>
//   );
// }




//==========================================================================

// import React, { useState, useMemo, useCallback } from "react";
// import { AgGridReact } from "ag-grid-react";

// import {
//   ICellRendererParams,
//   ClientSideRowModelModule,
// } from "ag-grid-community";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { Users, CheckCircle2, XCircle, Search, UserPlus } from "lucide-react";
// import companyUsersProps from "../../@types/company-users/CompanyUserProps";
// import Button from "../ui/Button";
// import { ModalAccessCompanyUser } from "../moduleaccessrights/ModalAccessCompanyUser";
// import { AddCompanyUserPopUp } from "../forms/AddCompanyUserPopUp";

// interface StatusRendererProps extends ICellRendererParams {
//   value: boolean;
// }

// interface AccessButtonRendererProps extends ICellRendererParams {
//   context: {
//     setIsModalOpen: (isOpen: boolean) => void;
//   };

// }

// const StatusRenderer: React.FC<StatusRendererProps> = ({ value: isActive }) => {
//   return (
//     <div className="flex items-center gap-1">
//       {isActive ? (
//         <>
//           <CheckCircle2 className="w-4 h-4 text-green-500" />
//           <span className="text-sm text-green-600">Active</span>
//         </>
//       ) : (
//         <>
//           <XCircle className="w-4 h-4 text-red-500" />
//           <span className="text-sm text-red-600">Inactive</span>
//         </>
//       )}
//     </div>
//   );
// };

// const [selectedUser, setSelectedUser] = useState<string>("");
// const AccessButtonRenderer: React.FC<AccessButtonRendererProps> = ({
//   context,
//   params,
// }) => {
//   return (
//     <Button
//       onClick={
//         () =>{ context.setIsModalOpen(true);
//         setSelectedUser(params.data.fullname)}
//       }
//       className="w-full flex justify-center py-1.5 px-2 border border-transparent rounded-md shadow-sm text-sm font-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//     >
//       Access
//     </Button>
//   );
// };

// export function GetCompanyUsersList({ users }: { users: companyUsersProps[] }) {
//   // ModuleRegistry.registerModules([ClientSideRowModelModule]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchText, setSearchText] = useState("");

 
//   const columnDefs = useMemo(
//     () => [
//       { field: "company_id", headerName: "Created By", filter: true, flex: 0.5 },
//       { field: "fullname", headerName: "Name", filter: true  , flex: 1},
//       { field: "email", headerName: "Email", filter: true , flex: 1.5},
//       { field: "mobilenumber", headerName: "Mobile Number", filter: true , flex: 1},
//       {
//         field: "isactive",
//         headerName: "Status",
//         cellRenderer: StatusRenderer,
//         filter: true,
//         flex: 0.5,
        
//       },
//       {
//         headerName: "Access",
//         cellRenderer: AccessButtonRenderer,
//         // width: 120,
//         sortable: false,
//         filter: false,
//       },
//     ],
//     []
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       sortable: true,
//       resizable: true,
//       suppressSizeToFit: true,
//     }),
//     []
//   );

//   const onFilterTextBoxChanged = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setSearchText(e.target.value);
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (gridRef.current?.api as any)?.setQuickFilter(e.target.value);
//     },
//     []
//   );

//   const gridRef = React.useRef<AgGridReact>(null);

//   return (
//     <div className="w-full pt-2 px-6">
//       <div className="sticky z-10 top-16 p-2 flex items-center bg-gray-50 rounded-lg justify-between mb-4 w-full">
//         <div className="flex items-center gap-2">
//           <Users className="w-6 h-6 text-blue-600" />
//           <h1 className="text-2xl font-bold">Company Members</h1>
//         </div>

//         <div className="relative w-80">
//           <input
//             type="search"
//             className="w-full h-10 pl-10 pr-12 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//             placeholder="Search members..."
//             value={searchText}
//             onChange={onFilterTextBoxChanged}
//           />
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3">
//             <Search className="w-4 h-4 text-gray-400" />
//           </div>
//         </div>

//         <div>
//           <Button onClick={() => setIsOpen(true)}>
//             <UserPlus size={20} /> Add Company User
//           </Button>
//           <AddCompanyUserPopUp
//             isOpen={isOpen}
//             onClose={() => setIsOpen(false)}
//           />
//         </div>
//       </div>

//       <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-4">
//         <div
//           className="ag-theme-alpine w-full "
//           style={{ height: "400px", width: "100%" }}
//         >
//           <AgGridReact
//             ref={gridRef}
//             rowData={users}
//             columnDefs={columnDefs}
//             defaultColDef={defaultColDef}
//             animateRows={true}
//             rowSelection="single"
//             context={{ setIsModalOpen }}
//             pagination={true}
//             paginationPageSize={10}
//             modules={[ClientSideRowModelModule]}
//           />
//         </div>
//       </div>

//       <ModalAccessCompanyUser
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         userName=
//       />
//     </div>
//   );
// }
import {Users,CheckCircle2,XCircle,Search,UserPlus,} from "lucide-react";
import companyUsersProps from "../../@types/company-users/CompanyUserProps";
import Button from "../ui/Button";
import { useMemo, useState } from "react";
import { ModalAccessCompanyUser } from "../moduleaccessrights/ModalAccessCompanyUser";
import { AddCompanyUserPopUp } from "../forms/AddCompanyUserPopUp";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, ColDef } from "ag-grid-community";



export function GetCompanyUsersList({ users }: { users: companyUsersProps[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");



  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: 'company_id',
      headerName: 'Created By',
      sortable: true,
      filter: true,
      flex: 1
    },
    { 
      field: 'fullname',
      headerName: 'Name',
      sortable: true,
      filter: true,
      flex: 1
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
      flex: 1
    },
    { 
      field: 'isactive',
      headerName: 'Status',
      sortable: true,
      filter: true,
      flex: 1,
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
      flex: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => {
        return (
          <Button
            onClick={() => {
              setSelectedUser(params.data.fullname);
              setIsModalOpen(true);
            }}
          >
            Access
          </Button>
        );
      }
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    suppressSizeToFit: true
  }), []);
 
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
            animateRows={true}
            rowSelection="single"
            pagination={true}
            paginationPageSize={10}
            
            
        modules={[ClientSideRowModelModule]}
          />
        </div>
        <ModalAccessCompanyUser
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userName={selectedUser}
      />

      
      </div>
      
      

     
    </div>
  );
}