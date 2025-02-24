/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef, themeAlpine } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import companyUsersSearchProps from "../../@types/company-users/CompanyUserProps";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Edit, UserCheck, XCircle } from "lucide-react";
import { createPortal } from "react-dom";
import CompanyUser from "../../@types/company-users/CompanyUser";
import {
  BOOLEAN_VALUES,
  INNERHTML,
  JSX_CHILDREN_NAME,
  NUMBER_VALUES,
} from "../../constants/AppConstants";
import { CLASS_NAMES } from "../../constants/ClassNames";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";

function CompanyUserAgGrid({
  users,
  handleSelectedCompanyUserChange,
  handleIdIsEditModalOpen,
  handleIsAccessModalOpen,
}: {
  users: companyUsersSearchProps[];
  handleSelectedCompanyUserChange: (params: CompanyUser) => void;
  handleIdIsEditModalOpen: (params: boolean) => void;
  handleIsAccessModalOpen: (params: boolean) => void;
}) {
  const { userHasAccessToViewAccess, userHasAccessToUpdateUser } =
    useUserAccessModules();
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "fullname",
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
        field: "createdby",
        headerName: "Created By",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
      },
      {
        field: "createdon",
        headerName: "Created On",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
      },
      {
        field: "isactive",
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
          const [isActionsDropDownOpen, setIsActionsDropDownOpen] = useState(
            BOOLEAN_VALUES.FALSE
          );
          const [position, setPosition] = useState({
            top: NUMBER_VALUES.ZERO,
            left: NUMBER_VALUES.ZERO,
            isUpward : BOOLEAN_VALUES.FALSE,
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

            // const rect = event.currentTarget.getBoundingClientRect();
            // setPosition({
            //   top: rect.bottom + window.scrollY - NUMBER_VALUES.TEN, // Position below button
            //   left: rect.left + window.scrollX - NUMBER_VALUES.TWENTY_FIVE, // Align with button
            // });
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
                    {userHasAccessToViewAccess && (
                      <ActionsDropdownButton
                        onClick={() => {
                          handleSelectedCompanyUserChange(params.data);
                          handleIsAccessModalOpen(BOOLEAN_VALUES.TRUE);
                          setIsActionsDropDownOpen(BOOLEAN_VALUES.FALSE);
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
                          handleIdIsEditModalOpen(BOOLEAN_VALUES.TRUE);
                          setIsActionsDropDownOpen(BOOLEAN_VALUES.FALSE);
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
      flex: 0.8,
      suppressHeaderMenuButton: BOOLEAN_VALUES.TRUE,
      suppressHeaderContextMenu: BOOLEAN_VALUES.TRUE,
    };
  }, []);

  return (
    <div
      className="ag-theme-alpine w-full"
      style={{ height: "460px", width: "100%" }}
    >
      <AgGridReact
        rowData={users}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeAlpine}
      />
    </div>
  );
}

export default CompanyUserAgGrid;
