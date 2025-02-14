/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Edit, UserCheck, XCircle } from "lucide-react";
import { createPortal } from "react-dom";
import Button from "../ui/Button";
import { BOOLEAN_VALUES, JSX_CHILDREN_NAME, NUMBER_VALUES } from "../../constants/AppConstants";
import { CLASS_NAMES } from "../../constants/ClassNames";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import LeadManagementProps from "../../@types/lead-management/LeadManagementProps";


function LeadManagementAgGrid({
    leads,
    userHasAccessToUpdateLead,
    userHasAccessToViewLead
}  : LeadManagementProps) {


    const columnDefs = useMemo<ColDef[]>(
        () => [
          {
            field: "customerName",
            headerName: "Name",
            sortable: BOOLEAN_VALUES.TRUE,
            filter: "agTextColumnFilter",
            flex: NUMBER_VALUES.ONE,
            
            comparator: (valueA, valueB) => {
              if (!valueA) return NUMBER_VALUES.MINUS_ONE;
              if (!valueB) return NUMBER_VALUES.ONE;
              return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
            },
          },
          {
            field: "email",
            headerName: "Email",
            sortable: BOOLEAN_VALUES.TRUE,
            filter: BOOLEAN_VALUES.TRUE,
            flex: NUMBER_VALUES.ONEANDHALF,
          },
          {
            field: "mobilenumber",
            headerName: "Mobile Number",
            sortable: BOOLEAN_VALUES.TRUE,
            filter: BOOLEAN_VALUES.TRUE,
          },
          {
            field: "status",
            headerName: "Status",
            sortable: BOOLEAN_VALUES.TRUE,
            filter: BOOLEAN_VALUES.TRUE,
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
            sortable: BOOLEAN_VALUES.FALSE,
            maxWidth: NUMBER_VALUES.HUNDRED,
            pinned: "right",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
            cellRenderer: (params: any) => {
              const [isActionsDropDownOpen, setIsActionsDropDownOpen] =
                useState(BOOLEAN_VALUES.FALSE);
              const [position, setPosition] = useState({ top: NUMBER_VALUES.ZERO, left: NUMBER_VALUES.ZERO });
              const dropdownRef = useRef<HTMLDivElement | null>(null);
    
              const handleActionsButtonClick = (event: React.MouseEvent) => {
                event.stopPropagation();
                setIsActionsDropDownOpen((prev) => !prev);
    
                const rect = event.currentTarget.getBoundingClientRect();
                setPosition({
                  top: rect.bottom + window.scrollY - NUMBER_VALUES.TEN, // Position below button
                  left: rect.left + window.scrollX - NUMBER_VALUES.TWENTY_FIVE, // Align with button
                });
              };
    
              useEffect(() => {
                const handleClickOutsideActionsDropDown = (event: MouseEvent) => {
                  if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(event.target as Node)
                  ) {
                    setIsActionsDropDownOpen(BOOLEAN_VALUES.FALSE);
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
                                  setIsActionsDropDownOpen(BOOLEAN_VALUES.FALSE);
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
                                  setIsActionsDropDownOpen(BOOLEAN_VALUES.FALSE);
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
          suppressHeaderMenuButton: BOOLEAN_VALUES.TRUE,
          suppressHeaderContextMenu: BOOLEAN_VALUES.TRUE,
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