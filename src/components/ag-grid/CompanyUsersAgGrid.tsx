/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Edit, UserCheck, XCircle } from "lucide-react";
import { createPortal } from "react-dom";
import {
  INNERHTML,
  JSX_CHILDREN_NAME,
} from "../../constants/AppConstants";
import { CLASS_NAMES } from "../../constants/ClassNames";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import CompanyUserAgGridProps from "../../@types/ag-grid/CompanyUserAgGridProps";
// import "ag-grid-community/styles/ag-theme-balham.css";
function CompanyUserAgGrid({
  users,
  handleSelectedCompanyUserChange,
  handleIdIsEditModalOpen,
  handleIsAccessModalOpen,
}: CompanyUserAgGridProps) {
  const { userHasAccessToViewAccess, userHasAccessToUpdateUser } =
    useUserAccessModules();
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
        field: "createdby",
        headerName: "Created By",
        sortable: true,
        filter: true,
      },
      {
        field: "createdon",
        headerName: "Created On",
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
            <div className="flex items-center text-sm gap-1 mt-1">
              {params.value ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600">Active</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600">Inactive</span>
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
          const [isActionsDropDownOpen, setIsActionsDropDownOpen] = useState(
            false
          );
          const [position, setPosition] = useState({
            top: 0,
            left: 0,
            isUpward : false,
          });

          
          const dropdownRef = useRef<HTMLDivElement | null>(null);

          const handleActionsButtonClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            setIsActionsDropDownOpen((prev) => !prev);

            const rect = (event.currentTarget as HTMLButtonElement).getBoundingClientRect();
            const dropdownHeight = 80; // Approximate height of dropdown
            const windowHeight = window.innerHeight;
            const spaceBelow = windowHeight - rect.bottom;
            const isUpward = spaceBelow < dropdownHeight;
        
            setPosition({
              top: isUpward 
                ? rect.top + window.scrollY - dropdownHeight + 10 // Position above button
                : rect.bottom + window.scrollY - 10, // Position below button
              left: rect.left + window.scrollX - 25,
              isUpward
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
                    className="absolute bg-white border rounded-md shadow-lg w-24 ml-2 z-50"
                    style={{ top: position.top, left: position.left }}
                  >
                    {userHasAccessToViewAccess && (
                      <ActionsDropdownButton
                        onClick={() => {
                          handleSelectedCompanyUserChange(params.data);
                          handleIsAccessModalOpen(true);
                          setIsActionsDropDownOpen(false);
                        }}
                      >
                        <UserCheck
                          className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                        />{" "}
                        {JSX_CHILDREN_NAME.ACCESS}
                      </ActionsDropdownButton>
                    )}

                    {userHasAccessToUpdateUser && (
                      <ActionsDropdownButton
                        onClick={() => {
                          handleSelectedCompanyUserChange(params.data);
                          handleIdIsEditModalOpen(true);
                          setIsActionsDropDownOpen(false);
                        }}
                      >
                        <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />{" "}
                        {JSX_CHILDREN_NAME.EDIT}
                      </ActionsDropdownButton>
                    )}
                    {!userHasAccessToViewAccess && (
                      <ActionsDropdownButton disabled>
                        <UserCheck
                          className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                        />{" "}
                        {JSX_CHILDREN_NAME.ACCESS}
                      </ActionsDropdownButton>
                    )}

                    {!userHasAccessToUpdateUser && (
                      <ActionsDropdownButton disabled>
                        <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />{" "}
                        {JSX_CHILDREN_NAME.EDIT}
                      </ActionsDropdownButton>
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
      flex: 1,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);

  return (

    <div
      className="ag-theme-balham w-full"
      style={{ height: "83vh", width: "100%" }}
    >
      <AgGridReact
        rowData={users}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham} 
      />
     </div>
  );
}

export default CompanyUserAgGrid;
