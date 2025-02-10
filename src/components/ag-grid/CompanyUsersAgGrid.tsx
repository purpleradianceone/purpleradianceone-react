/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import companyUsersSearchProps from "../../@types/company-users/CompanyUserProps";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Edit, UserCheck, XCircle } from "lucide-react";
import { createPortal } from "react-dom";
import Button from "../ui/Button";
import CompanyUser from "../../@types/company-users/CompanyUser";


function CompanyUserAgGrid({
    users,
    userHasAccessToViewAccess,
    userHasAccessToUpdateUser,
    handleSelectedCompanyUserChange,
    handleIdIsEditModalOpen,
    handleIsAccessModalOpen
}  : {
    users: companyUsersSearchProps[],
    userHasAccessToViewAccess : boolean,
    userHasAccessToUpdateUser : boolean,
    handleSelectedCompanyUserChange : (params : CompanyUser)=> void ,
    handleIdIsEditModalOpen : (params : boolean)=> void ,
    handleIsAccessModalOpen : (params : boolean)=> void ,
}) {


    const columnDefs = useMemo<ColDef[]>(
        () => [
          {
            field: "fullname",
            headerName: "Name",
            sortable: true,
            filter: "agTextColumnFilter",
            flex: 1,
            
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
                                handleSelectedCompanyUserChange(params.data);
                                handleIsAccessModalOpen(true)
                                setIsActionsDropDownOpen(false);
                              }}
                            >
                              <UserCheck className="inline mr-2 size-4" /> Access
                            </button>
                            {userHasAccessToUpdateUser ? (
                              <button
                                className="block w-full text-blue-600 text-sm p-2 text-left hover:bg-gray-100"
                                onClick={() => {
                                handleSelectedCompanyUserChange(params.data);
                                handleIdIsEditModalOpen(true);
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
                                handleSelectedCompanyUserChange(params.data)
                                handleIdIsEditModalOpen(true);
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

    return(
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
    )
}

export default CompanyUserAgGrid;