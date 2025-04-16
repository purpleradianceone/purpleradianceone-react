/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {  Edit, Headset } from "lucide-react";
import { createPortal } from "react-dom";
import {  JSX_CHILDREN_NAME, } from "../../constants/AppConstants";
import { CLASS_NAMES } from "../../constants/ClassNames";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import LeadManagementAgGridProps from "../../@types/ag-grid/LeadManagementAgGridProps";


function LeadManagementAgGrid({
    leads,
    handleIdIsMeetingsModalOpen,
}  : LeadManagementAgGridProps) {

    const columnDefs  = useMemo<ColDef[]>(
        () => [
          {
            field: "id",
            headerName: "Lead No",
            sortable: true,
            filter: "agTextColumnFilter",
            flex: 1,
            maxWidth:120,
          },
          {
            field: "leadOwner",
            headerName: "Lead Owner",
            sortable: true,
            filter: "agTextColumnFilter",
            flex: 1,
            minWidth : 180,
            comparator: (valueA, valueB) => {
              if (!valueA) return -1;
              if (!valueB) return 1;
              return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
            },
          },
          {
            field: "name",
            headerName: "Lead Name",
            sortable: true,
            filter: "agTextColumnFilter",
            flex: 1,
            minWidth: 160,
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
            minWidth: 200,
          },
          {
            field: "mobileNumber",
            headerName: "Mobile Number",
            sortable: true,
            filter: true,
          },
          {
            field : "leadStatus",
            headerName : "Lead Status",
            sortable : true,
            filter : true,
          },
          {
            field : "leadSource",
            headerName : "Lead Source",
            sortable : true,
            filter : true,
          },
          {
            field: "createdBy",
            headerName: "Created By",
            filter: true,
          },
          {
            field: "createdOn",
            headerName: "Created On",
            sortable: true,
            filter: true,
          },
          {
            headerName: "Actions",
            sortable: false,
            maxWidth: 110,
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
                    {JSX_CHILDREN_NAME.ACTIONS}
                  </button>
    
                  {isActionsDropDownOpen &&
                    createPortal(
                      <div
                        ref={dropdownRef}
                        className="absolute bg-white border rounded-md shadow-lg w-28 ml-2 z-50"
                        style={{ top: position.top, left: position.left }}
                      >
                              <ActionsDropdownButton
                                onClick={() => {
                                  setIsActionsDropDownOpen(false);
                                  handleIdIsMeetingsModalOpen(true);
                                }}
                              >
                                <Headset className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR_MARGIN_RIGHT} /> {JSX_CHILDREN_NAME.MEETINGS}
                              </ActionsDropdownButton>
                      </div>,
                      document.body // Render dropdown in body to avoid clipping
                    )}
                </>
              );
            },
          },
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