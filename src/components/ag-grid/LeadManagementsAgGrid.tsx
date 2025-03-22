/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Edit, UserCheck, XCircle } from "lucide-react";
import { createPortal } from "react-dom";
import Button from "../ui/Button";
import {  JSX_CHILDREN_NAME, } from "../../constants/AppConstants";
import { CLASS_NAMES } from "../../constants/ClassNames";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import LeadManagementProps from "../../@types/lead-management/LeadManagementProps";


function LeadManagementAgGrid({
    leads,
    userHasAccessToUpdateLead,
    userHasAccessToViewLead
}  : LeadManagementProps) {

  useEffect(()=>{
    console.log(leads);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

    const columnDefs = useMemo<ColDef[]>(
        () => [
          {
            field: "id",
            headerName: "Id",
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
            field: "leadNo",
            headerName: "LeadNo",
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
            field: "name",
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
            field: "phone",
            headerName: "Mobile Number",
            sortable: true,
            filter: true,
          },
          {
            field: "status",
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
          // {
          //   field: "createdOn",
          //   headerName: "Created On",
          //   sortable: true,
          //   filter: true,
          // },
          // {
          //   field: "updatedOn",
          //   headerName: "Updated On",
          //   sortable: true,
          //   filter: true,
          // },
          {
            field: "createdBy",
            headerName: "createdBy",
            sortable: true,
            filter: true,
          },
          // {
          //   field: "updatedBy",
          //   headerName: "updatedBy",
          //   sortable: true,
          //   filter: true,
          // },
          {
            field: "assignedTo",
            headerName: "assignedTo",
            sortable: true,
            filter: true,
          },
          {
            headerName: "Actions",
            sortable: false,
            maxWidth: 100,
            pinned: "right",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any,
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
                console.log(params)
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
              // eslint-disable-next-line react-hooks/exhaustive-deps
              }, []);
    
              return (
                <>
                  <button
                    className="text-blue-600"
                    onClick={handleActionsButtonClick}
                  >
                    {JSX_CHILDREN_NAME.ACTIONS}
                  </button>
    
                  {isActionsDropDownOpen &&
                    createPortal(
                      <div
                        ref={dropdownRef}
                        className="absolute bg-white border rounded-md shadow-lg w-24 ml-2 z-50"
                        style={{ top: position.top, left: position.left }}
                      >
                        {userHasAccessToViewLead ? (
                          <>
                            {userHasAccessToUpdateLead ? (
                              <ActionsDropdownButton
                                onClick={() => {
                                  setIsActionsDropDownOpen(false);
                                }}
                              >
                                <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} /> {JSX_CHILDREN_NAME.EDIT}
                              </ActionsDropdownButton>
                            ) : (
                              <button
                                disabled
                                className={CLASS_NAMES.DISABLED_BUTTON}
                              >
                                <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} /> {JSX_CHILDREN_NAME.EDIT}
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <Button
                              disabled
                              className={CLASS_NAMES.DISABLED_BUTTON}
                            >
                              <UserCheck className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} /> {JSX_CHILDREN_NAME.ACCESS}
                            </Button>
                            {userHasAccessToUpdateLead ? (
                              <button
                                className="block w-full text-blue-600 text-sm p-2 text-left hover:bg-gray-100"
                                onClick={() => {
                                  setIsActionsDropDownOpen(false);
                                }}
                              >
                                <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} /> Edit
                              </button>
                            ) : (
                              <Button
                                disabled
                                className={CLASS_NAMES.DISABLED_BUTTON}
                              >
                                <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} /> Edit
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
                        rowData={leads}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        modules={[AllCommunityModule]}
                      />
                    </div>
    )
}

export default LeadManagementAgGrid;