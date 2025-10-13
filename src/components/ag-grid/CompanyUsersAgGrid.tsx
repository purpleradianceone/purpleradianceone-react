/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Edit, LucideLayoutDashboard, UserCheck } from "lucide-react";
import { createPortal } from "react-dom";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import { CLASS_NAMES } from "../../constants/ClassNames";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import CompanyUserAgGridProps from "../../@types/ag-grid/CompanyUserAgGridProps";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";
import StatusIndicator from "../ui/StatusIndicator";
import AppTutorailManager from "../views/tutorails/AppTutorailManager";
import { CompanyUsersGridActionsButtonStep } from "../../constants/AppTutorailsSteps";
// import "ag-grid-community/styles/ag-theme-balham.css";
function CompanyUserAgGrid({
  users,
  handleSelectedCompanyUserChange,
  handleIdIsEditModalOpen,
  handleIsAccessModalOpen,
  handleIsDashboardModalOpen,
  handleActionsTourEnd,
  isActionsTourEnded,
}: CompanyUserAgGridProps) {
  const {
    userHasAccessToViewAccess,
    userHasAccessToUpdateUser,
    userHasAccessToViewDashboard,
  } = useUserAccessModules();

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
              <StatusIndicator isActive={params.value} />
            </div>
          );
        },
      },
      {
        headerName: "Actions",
        sortable: false,
        maxWidth: 100,
        pinned: "right",
        headerClass: "company-users-actions-column",
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
              left: rect.left + window.scrollX - 50,
              isUpward,
            });
          };

          useEffect(() => {
            const handleClickOutsideActionsDropDown = (event: MouseEvent) => {
              if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                isActionsTourEnded
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
                id="actions-button"
                className="text-blue-600"
                onClick={handleActionsButtonClick}
              >
                {JSX_CHILDREN_NAME.ACTIONS}
              </button>

              {isActionsDropDownOpen &&
                createPortal(
                  <div
                    ref={dropdownRef}
                    className="absolute bg-white border rounded-md shadow-lg w-32 ml-1 z-50"
                    style={{ top: position.top, left: position.left }}
                  >
                    {!isActionsTourEnded && (
                      <AppTutorailManager
                        steps={CompanyUsersGridActionsButtonStep}
                        handleTourEnd={() => {
                          setIsActionsDropDownOpen(false);
                          handleActionsTourEnd!();
                          handleIsAccessModalOpen(false);
                           handleIdIsEditModalOpen(false);
                            handleIsDashboardModalOpen(false);
                        }}
                        modalOpenTriggerIndices={[0, 2, 4, 5]}
                        isModalOpen={(index) => {
                          if (index === 0) {
                            handleSelectedCompanyUserChange(params.data)
                            handleIsAccessModalOpen(true);
                            
                          }
                          if (index === 2) {
                            handleSelectedCompanyUserChange(params.data)
                            handleIsAccessModalOpen(false);
                            handleIdIsEditModalOpen(true);
                          }
                           if (index === 4) {
                            handleSelectedCompanyUserChange(params.data)
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
                              .DENIED_VIEW_ACCESS_MODULE_ACCESS
                          );
                        }
                      }}
                    >
                      <UserCheck
                        className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                      />{" "}
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
                              .DENIED_UPDATE_ACCESS_COMPANY_USER
                          );
                        }
                      }}
                    >
                      <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />{" "}
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
                              .DENIED_VIEW_ACCESS_DASHBOARD
                          );
                        }
                      }}
                    >
                      <span className="flex gap-1">
                        <LucideLayoutDashboard
                          className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                        />{" "}
                        {JSX_CHILDREN_NAME.DASHBOARD}
                      </span>
                    </ActionsDropdownButton>

                    {/* {!userHasAccessToViewAccess && (
                      <ActionsDropdownButton disabled>
                        <UserCheck
                          className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                        />{" "}
                        {JSX_CHILDREN_NAME.ACCESS}
                      </ActionsDropdownButton>
                    )} */}

                    {/* {!userHasAccessToUpdateUser && (
                      <ActionsDropdownButton disabled>
                        <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />{" "}
                        {JSX_CHILDREN_NAME.EDIT}
                      </ActionsDropdownButton>
                    )} */}
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

  return (
    <div
      className="ag-theme-balham w-full "
      style={{ height: "100%", width: "100%" }}
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
