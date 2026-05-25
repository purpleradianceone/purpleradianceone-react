/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AllCommunityModule, ColDef } from "ag-grid-community";

import { AgGridReact } from "ag-grid-react";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  Edit,
  FileBarChart,
  LucideLayoutDashboard,
  
  UserCheck,
} from "lucide-react";

import { createPortal } from "react-dom";

import { AGGRID, JSX_CHILDREN_NAME } from "../../constants/AppConstants";

import { CLASS_NAMES } from "../../constants/ClassNames";

import ActionsDropdownButton from "../ui/ActionsDropdownButton";

import { useUserAccessModules } from "../../config/hooks/useAccessModules";

import CompanyUserAgGridProps from "../../@types/ag-grid/CompanyUserAgGridProps";

import toast from "react-hot-toast";

import MESSAGE from "../../constants/Messages";

import AppTutorailManager from "../views/tutorails/AppTutorailManager";

import { CompanyUsersGridActionsButtonStep } from "../../constants/AppTutorailsSteps";

import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import { avatarColors } from "../../utils/colourSpecifierForNameInAggrid";
import GridActionButton from "../ui/GridActionButton";
import StatusBadge from "../ui/StatusBadge";
import RenderUserWithIcon from "../ui/UserAgGridCellRenderer";

function CompanyUserAgGrid({
  users,
  handleSelectedCompanyUserChange,
  handleIdIsEditModalOpen,
  handleIsAccessModalOpen,
  handleIsDashboardModalOpen,
  handleUserReportModalOpen,
  handleActionsTourEnd,
  isActionsTourEnded,
  isUsedInAccountProductForAssingingInstalledBy,
  onRowSelect,
  isDataLoading,
}: CompanyUserAgGridProps) {
  const {
    userHasAccessToViewAccess,
    userHasAccessToUpdateUser,
    userHasAccessToViewDashboard,
    userHasAccessToViewCompanyUserReportType,
  } = useUserAccessModules();

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: true,
        headerName: "",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 60,
        maxWidth: 60,
        pinned: "left",
        sortable: false,
        filter: false,
        suppressMenu: true,

        cellStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
      {
        field: "fullname",
        headerName: "Name",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1.8,

        comparator: (valueA, valueB) => {
          if (!valueA) return -1;
          if (!valueB) return 1;

          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        },

        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          const name =
            params.data?.fullname?.trim() ||
            params.data?.email?.trim() ||
            "User";

          const initials =
            name
              .trim()
              .split(/\s+/)
              .filter(Boolean)
              .map((word: string) => word.charAt(0))
              .join("")
              .substring(0, 2)
              .toUpperCase() || "U";

          const colorIndex = name.length % avatarColors.length;

          return (
            <div className="flex items-center  gap-3 h-full overflow-visible  px-2">
              <div
                className={`w-7 h-7  rounded-full text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 overflow-hidden ${avatarColors[colorIndex]}`}
              >
                {initials}
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-sm font-semibold text-gray-800">
                  {params.data?.fullname}
                </span>

                <span className="text-xs text-gray-500">
                  {params.data?.email}
                </span>
              </div>
            </div>
          );
        },
      },

      {
        hide: true,
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
        flex: 1,
      },
      {
        field: "isactive",
        headerName: "Status",
        sortable: true,
        filter: false,
        flex: 1,

        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }

          return (
            <div className="h-full flex items-center">
              <StatusBadge isActive={params.value} />
            </div>
          );
        },
      },

      {
        field: "createdby",
        cellRenderer: RenderUserWithIcon,
        headerName: "Created By",
        sortable: true,
        filter: true,
        flex: 1,
      },

      {
        field: "createdon",
        headerName: "Created On",
        sortable: true,
        filter: true,
        flex: 1,
      },

      {
        hide: !isUsedInAccountProductForAssingingInstalledBy,
        headerName: "ACTIONS",
        field: "view",
        pinned: "right",
        maxWidth: 100,
        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }

          return (
            <div className="flex items-center justify-center h-full">
              <span
                className="cursor-pointer text-blue-600  text-sm font-medium hover:underline"
                onClick={(e) => {
                  e.preventDefault();

                  params.context.handleRowSelect(params.data);
                }}
              >
                Select
              </span>
            </div>
          );
        },
      },

      {
        hide: isUsedInAccountProductForAssingingInstalledBy,
        headerName: "Actions",
        sortable: false,
        maxWidth: 100,
        pinned: "right",
        headerClass: "company-users-actions-column",
        filter: false,

        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }

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

            const dropdownHeight = 80;

            const windowHeight = window.innerHeight;

            const spaceBelow = windowHeight - rect.bottom;

            const isUpward = spaceBelow < dropdownHeight;

            setPosition({
              top: isUpward
                ? rect.top + window.scrollY - dropdownHeight + 10
                : rect.bottom + window.scrollY - 10,

              left: rect.left + window.scrollX - 50,

              isUpward,
            });
          };

          useEffect(() => {
            const handleClickOutsideActionsDropDown = (event: MouseEvent) => {
              if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !isActionsTourEnded
              ) {
                setIsActionsDropDownOpen(false);
              }
            };

            document.addEventListener(
              "mousedown",
              handleClickOutsideActionsDropDown,
            );

            return () =>
              document.removeEventListener(
                "mousedown",
                handleClickOutsideActionsDropDown,
              );
          }, []);

          return (
            <>
              <div>
                <GridActionButton
                  id="actions-button"
                  onClick={handleActionsButtonClick}
                />
              </div>

              {isActionsDropDownOpen &&
                createPortal(
                  <div
                    ref={dropdownRef}
                    className="absolute bg-white border rounded-xl shadow-xl w-32 ml-1 z-50"
                    style={{
                      top: position.top,
                      left: position.left,
                    }}
                  >
                    {isActionsTourEnded && (
                      <AppTutorailManager
                        steps={CompanyUsersGridActionsButtonStep}
                        handleTourEnd={() => {
                          setIsActionsDropDownOpen(false);

                          handleActionsTourEnd!();

                          handleIsAccessModalOpen(false);

                          handleIdIsEditModalOpen(false);

                          handleIsDashboardModalOpen(false);

                          handleUserReportModalOpen(false);
                        }}
                        modalOpenTriggerIndices={[0, 2, 4, 5]}
                        isModalOpen={(index) => {
                          if (index === 0) {
                            handleSelectedCompanyUserChange(params.data);

                            handleIsAccessModalOpen(true);
                          }

                          if (index === 2) {
                            handleSelectedCompanyUserChange(params.data);

                            handleIsAccessModalOpen(false);

                            handleIdIsEditModalOpen(true);
                          }

                          if (index === 4) {
                            handleSelectedCompanyUserChange(params.data);

                            handleIsAccessModalOpen(false);

                            handleIdIsEditModalOpen(false);

                            handleIsDashboardModalOpen(true);
                          }
                        }}
                      />
                    )}

                    <ActionsDropdownButton
                      id="company-user-access-management-action-btn"
                      disabled={!userHasAccessToViewAccess}
                      onClick={() => {
                        if (userHasAccessToViewAccess) {
                          handleSelectedCompanyUserChange(params.data);

                          handleIsAccessModalOpen(true);

                          setIsActionsDropDownOpen(false);
                        } else {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.MODULE_ACCESS
                              .DENIED_VIEW_ACCESS_MODULE_ACCESS,
                          );
                        }
                      }}
                    >
                      <UserCheck
                        className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                      />

                      {JSX_CHILDREN_NAME.ACCESS}
                    </ActionsDropdownButton>

                    <ActionsDropdownButton
                      id="company-user-edit-action-btn"
                      disabled={!userHasAccessToUpdateUser}
                      onClick={() => {
                        if (userHasAccessToUpdateUser) {
                          handleSelectedCompanyUserChange(params.data);

                          handleIdIsEditModalOpen(true);

                          setIsActionsDropDownOpen(false);
                        } else {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.COMPANY_USER
                              .DENIED_UPDATE_ACCESS_COMPANY_USER,
                          );
                        }
                      }}
                    >
                      <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />

                      {JSX_CHILDREN_NAME.EDIT}
                    </ActionsDropdownButton>

                    <ActionsDropdownButton
                      id="company-user-dashboard-action-btn"
                      disabled={!userHasAccessToViewDashboard}
                      onClick={() => {
                        if (userHasAccessToViewDashboard) {
                          handleSelectedCompanyUserChange(params.data);

                          handleIsDashboardModalOpen(true);

                          setIsActionsDropDownOpen(false);
                        } else {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.DASHBOARD
                              .DENIED_VIEW_ACCESS_DASHBOARD,
                          );
                        }
                      }}
                    >
                      <span className="flex gap-1">
                        <LucideLayoutDashboard
                          className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                        />

                        {JSX_CHILDREN_NAME.DASHBOARD}
                      </span>
                    </ActionsDropdownButton>

                    <ActionsDropdownButton
                      id="company-user-edit-action-btn"
                      disabled={!userHasAccessToViewCompanyUserReportType}
                      onClick={() => {
                        if (userHasAccessToViewCompanyUserReportType) {
                          handleSelectedCompanyUserChange(params.data);

                          handleIdIsEditModalOpen(false);

                          setIsActionsDropDownOpen(false);

                          handleUserReportModalOpen(true);
                        } else {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.REPORT.USER_REPORT.DENIED_VIEW_ACCESS
                          );
                        }
                      }}
                    >
                      <FileBarChart className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />

                      {JSX_CHILDREN_NAME.REPORT}
                    </ActionsDropdownButton>

                  </div>,
                  document.body,
                )}
            </>
          );
        },
      },
    ],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const skeletonRows = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      __isSkeleton: true,
    }));
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      minWidth: 150,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,

      cellRenderer: (params: any) => {
        if (params.data?.__isSkeleton) {
          return <SkeletonRowsAgGrid />;
        }

        return params.value;
      },
    };
  }, []);

  return (
    <div
      className="modern-user-grid custom-height-scrollbar w-full"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <AgGridReact
        rowData={isDataLoading ? skeletonRows : users}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        // theme={themeBalham}
        // rowHeight={AGGRID.ROW_HEIGHT}
        headerHeight={AGGRID.HEADER_HEIGHT}
        suppressCellFocus={true}
        rowSelection="multiple"
        suppressRowClickSelection={true}
        context={{
          handleRowSelect: isDataLoading ? undefined : onRowSelect,
        }}
      />
    </div>
  );
}

export default CompanyUserAgGrid;
