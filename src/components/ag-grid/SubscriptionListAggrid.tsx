/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { CheckCircle2, FilePen, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import SubscriptionListProps from "../../@types/subscription/SubscriptionListProps";

import { createPortal } from "react-dom";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import { CLASS_NAMES } from "../../constants/ClassNames";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";

function SubscriptionListAggrid({
  subscriptionList,
  handleUpdateSubscriptionModalOpen,
  handleSelectedSubscription,
}: {
  subscriptionList: SubscriptionListProps[];
  handleUpdateSubscriptionModalOpen: (status: boolean) => void;
  handleSelectedSubscription: (params: SubscriptionListProps) => void;
}) {
  const isCurrentDateInRange = (startDateStr: string, endDateStr: string) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const currentDate = new Date(); // Gets today's date
    if (currentDate < startDate) {
      return "Upcoming"; // Event has not started yet
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return "Ongoing"; // Event is currently happening
    } else {
      return "Expired"; // Event has ended
    }
  };

  //note : access module context
  const { userHasAccessToUpdateSubscription } = useUserAccessModules();

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "id",
        headerName: "Id",
        hide: true,
        sortable: true,
        filter: true,
      },

      {
        field: "subscriptionStatus",
        headerName: "Status",
        cellRenderer: (params: any) => {
          if (params.value === "Ongoing") {
            return (
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600">
                  Ongoing <span className="text-xs">✅</span>
                </span>
              </div>
            );
          } else if (params.value === "Upcoming") {
            return (
              <div className="flex items-center gap-1 mt-1">
                <XCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-yellow-600">
                  Upcoming <span className="text-xs">⏳</span>
                </span>
              </div>
            );
          } else {
            return (
              <div className="flex items-center gap-1 mt-1">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-600">
                  Expired <span className="text-xs">❌</span>
                </span>
              </div>
            );
          }

          return null;
        },
        sortable: true,
        filter: true,
      },
      {
        hide:true,
        field: "isActive",
        headerName: "Status",
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const [statusOfSubscription] = useState<string>(() => {
            return isCurrentDateInRange(
              params.data.startDate,
              params.data.endDate
            );
          });

          return (
            <div className="flex items-center gap-1 mt-3">
              {statusOfSubscription === "Ongoing" && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Ongoing ✅</span>
                </>
              )}
              {statusOfSubscription === "Upcoming" && (
                <>
                  <XCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600">Upcoming ⏳</span>
                </>
              )}
              {statusOfSubscription === "Expired" && (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Expired ❌</span>
                </>
              )}
            </div>
          );
        },
      },
      {
        field: "allowedUserCount",
        headerName: "Users Allowed",
        valueFormatter: (params) => ` ${params.value} `,
        sortable: true,
        filter: true,
        flex: 1.5,
        maxWidth : 140
      },
      {
        field: "totalCost",
        headerName: "Cost",
        valueFormatter: (params) => `₹ ${params.value}`,
        sortable: true,
        filter: true,
        maxWidth : 150
      },

      {
        field: "startDate",
        headerName: "Start Date",
        sortable: true,
        filter: true,
        flex: 1.5,
        maxWidth :150
      },
      {
        field: "endDate",
        headerName: "End Date",
        sortable: true,
        filter: true,
      },
      {
        field: "createdBy",
        headerName: "Transaction By",
        sortable: true,
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
        maxWidth: 100,
        pinned: "right",

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
                    className="absolute bg-white border rounded-md shadow-lg w-24 ml-2 mr-4 z-50"
                    style={{ top: position.top, left: position.left }}
                  >
                    {userHasAccessToUpdateSubscription && (
                      <ActionsDropdownButton
                        onClick={() => {
                          setIsActionsDropDownOpen(false);
                          handleUpdateSubscriptionModalOpen(true);
                          handleSelectedSubscription(params.data);

                          // handleCompanyProductTeamModalOpen(true);
                          // handleSelectedProductChange(params.data);
                        }}
                      >
                        <FilePen
                          className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                        />
                        {JSX_CHILDREN_NAME.UPDATE}
                      </ActionsDropdownButton>
                    )}
                    {!userHasAccessToUpdateSubscription && (
                      <ActionsDropdownButton
                        disabled={true}
                        onClick={() => {
                          setIsActionsDropDownOpen(false);
                          // handleUpdateSubscriptionModalOpen(true);
                          // handleSelectedSubscription(params.data);

                          // handleCompanyProductTeamModalOpen(true);
                          // handleSelectedProductChange(params.data);
                        }}
                      >
                        <FilePen
                          className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                        />
                        {JSX_CHILDREN_NAME.UPDATE}
                      </ActionsDropdownButton>
                    )}
                  </div>,
                  document.body
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
      enablePivot: true,
    };
  }, []);
  return (
    <>
      <div
        className="ag-theme-alpine w-full"
        style={{ height: 505, width: "100%" }}
      >
        <AgGridReact
          rowData={subscriptionList}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          modules={[AllCommunityModule]}
          overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
          theme={themeBalham}
        />
      </div>
      {}
    </>
  );
}
export default SubscriptionListAggrid;
