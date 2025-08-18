/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { useEffect, useMemo, useRef, useState } from "react";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import {  CheckCircle2, Edit, XCircle } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { createPortal } from "react-dom";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import { CLASS_NAMES } from "../../constants/ClassNames";
import TeamManagementAgGridProps from "../../@types/ag-grid/TeamManagementAgGridProps";

function TeamManagementAgGrid({
  companyTeamList,
  isUpdateCompanyTeamModalOpen,
  isGridForProductTeam,
  isGridForLeadProductTeam,
  addCompanyProductTeamArray,
  handleCompanyTeamCheckboxChange,
  handleViewPortChanged,
  onGridReady,
}: TeamManagementAgGridProps) {
  const { userHasAccessToUpdateTeamManagement } = useUserAccessModules();

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "Team Name",
        field: "name",
        sortable: true,
        filter: true,
        flex: 1,
        cellClass: "font-bold text-gray-800  px-2 py-1 rounded"
      },
      {
        headerName: "Team Description",
        field: "description",
        minWidth: 300,
        sortable: true,
        filter: true,
        hide: isGridForProductTeam || isGridForLeadProductTeam,
      },
      {
        field: "isActive",
        headerName: "Status",
        sortable: true,
        filter: true,
        hide: isGridForProductTeam || isGridForLeadProductTeam,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center gap-1 mt-1">
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
        field: "createdBy",
        headerName: "Created By",
        sortable: true,
        filter: true,
        hide: isGridForProductTeam || isGridForLeadProductTeam,
      },
      {
        field: "createdOn",
        headerName: "Created On",
        sortable: true,
        filter: true,
        hide: isGridForProductTeam || isGridForLeadProductTeam,
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
          const [position, setPosition] = useState({
            top: 0,
            left: 0,
            isUpward: false,
          });

          const dropdownRef = useRef<HTMLDivElement | null>(null);

          const handleActionsButtonClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            setIsActionsDropDownOpen((prev) => !prev);

            const rect = (
              event.currentTarget as HTMLButtonElement
            ).getBoundingClientRect();
            const dropdownHeight = 80; // Approximate height of dropdown
            const windowHeight = window.innerHeight;
            const spaceBelow = windowHeight - rect.bottom;
            const isUpward = spaceBelow < dropdownHeight;

            setPosition({
              top: isUpward
                ? rect.top + window.scrollY - dropdownHeight + 10 // Position above button
                : rect.bottom + window.scrollY - 10, // Position below button
              left: rect.left + window.scrollX - 25,
              isUpward,
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

          if (
            (isGridForProductTeam !== undefined
              ? !isGridForProductTeam
              : false) || isGridForLeadProductTeam !== undefined
              ? !isGridForLeadProductTeam
              : false
          ) {
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
                      className="absolute bg-white  border rounded-md shadow-lg w-24 ml-2 z-50"
                      style={{ top: position.top, left: position.left }}
                    >
                      {userHasAccessToUpdateTeamManagement && (
                        <ActionsDropdownButton
                          onClick={() => {
                            setIsActionsDropDownOpen(false);
                            isUpdateCompanyTeamModalOpen!(params.data);
                          }}
                        >
                          <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />{" "}
                          Edit
                        </ActionsDropdownButton>
                      )}

                      {!userHasAccessToUpdateTeamManagement && (
                        <ActionsDropdownButton disabled>
                          <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />{" "}
                          Edit
                        </ActionsDropdownButton>
                      )}
                    </div>,
                    document.body // Render dropdown in body to avoid clipping
                  )}
              </>
            );
          } else if (isGridForProductTeam || isGridForLeadProductTeam) {
            const isChecked = addCompanyProductTeamArray!.includes(
              params.data.id
            );
            return (
              <div className="flex justify-center mt-1 items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  onChange={(event) => {
                    handleCompanyTeamCheckboxChange!(params.data, event);
                  }}
                />
              </div>
            );
          }
        },
      },
    ],
    [addCompanyProductTeamArray, companyTeamList]
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

  return (
    <div
      className="ag-theme-alpine w-full"
      style={
        isGridForProductTeam || isGridForLeadProductTeam
          ? { height: "300px", width: "100%" }
          : { height: "90vh", width: "100%" }
      }
    >
      <AgGridReact
        rowData={companyTeamList}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham}
        onViewportChanged={handleViewPortChanged!}
        onGridReady={onGridReady!}
      />
    </div>
  );
}

export default TeamManagementAgGrid;
