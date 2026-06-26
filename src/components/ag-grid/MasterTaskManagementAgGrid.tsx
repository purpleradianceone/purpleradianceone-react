/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import MasterTaskManagementAgGridProps from "../../@types/ag-grid/MasterTaskManagementAgGridProps";
import {
  AGGRID,
  JSX_CHILDREN_NAME,
} from "../../constants/AppConstants";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import { taskPriorityStyles } from "../../utils/colourSpecifierForNameInAggrid";
import { Eye } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import RenderUserWithIcon from "../ui/UserAgGridCellRenderer";

function MasterTaskManagementAgGrid({
  MasterTaskData,
  onRowSelect,
  handleRowClick,
  isUsedInAllTasksModule,
  isDataLoading,
}: MasterTaskManagementAgGridProps) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "subject",
        headerName: "subject",
        sortable: true,
        filter: true,

        cellStyle: () => ({
          fontSize: "14px",
          fontWeight: 600,
          color: "#1f2937",
        }),
      },
      {
        field: "generalTaskTypeName",
        headerName: "Task Type",
        sortable: true,
        filter: true,
      },
      {
        field: "generalTaskPriorityName",
        headerName: "Priority",
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          const priority = params.value || "-";
          return (
            <div className="flex items-center h-full">
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  taskPriorityStyles[priority] || "bg-slate-100 text-slate-700"
                }`}
              >
                {priority}
              </span>
            </div>
          );
        },
      },
      {
        field: "description",
        headerName: "Description",
        sortable: true,
        filter: true,
      },
      {
        field: "frequencyName",
        headerName: "Frequency",
        sortable: true,
        filter: true,
      },
      {
        field: "assignedToName",
        headerName: "Assigned To",
        sortable: true,
        filter: true,
        cellRenderer: RenderUserWithIcon,
      },

      {
        field: "isActive",
        headerName: "Status",
        sortable: true,
        filter: true,
        // hide: isUsedForAccountLead,
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
        field: "startDate",
        headerName: "Start Date",
        sortable: true,
        filter: true,
      },
      {
        field: "endDate",
        headerName: "End Date",
        sortable: true,
        filter: true,
      },
      {
        field: "taskTime",
        headerName: "Time",
        sortable: true,
        filter: true,
      },

      {
        field: "createdBy",
        headerName: "Created by",
        filter: true,
        cellRenderer: RenderUserWithIcon,
      },
      {
        field: "createdOn",
        headerName: "Created on",
        sortable: true,
        filter: true,
      },
      {
        field: "updatedBy",
        headerName: "Updated by",
        sortable: true,
        filter: true,
        cellRenderer: RenderUserWithIcon,
      },
      {
        field: "updatedOn",
        headerName: "Updated on",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        headerName: "Actions",
        field: "actions",
        cellRenderer: () => JSX_CHILDREN_NAME.ACTIONS,
        sortable: false,
        maxWidth: 110,
        pinned: "right",
        cellStyle: {
          color: "#2563eb",
          cursor: "pointer",
          fontWeight: "400",
        },
      },
      {
        headerName: "Actions",
        field: "view",
        pinned: "right",
        maxWidth: 100,
        filter: false,
        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          return (
            <div className="flex items-center justify-center">
              <button
                className="lead-details flex items-center "
                onClick={() => {
                  params.context.handleRowSelect(params.data);
                }}
              >
                <Eye size={12} strokeWidth={1.5} />

                <span>{isUsedInAllTasksModule ? "Details" : "Select"}</span>
              </button>
            </div>
          );
        },
      },
      // {
      //   headerName: "Actions",
      //   sortable: false,
      //   maxWidth: 110,
      //   pinned: "right",

      //   cellRenderer: (params: any) => {
      //     const [isActionsDropDownOpen, setIsActionsDropDownOpen] =
      //       useState(false);
      //     const [position, setPosition] = useState({
      //       top: 0,
      //       left: 0,
      //       isUpward: false,
      //     });

      //     const dropdownRef = useRef<HTMLDivElement | null>(null);

      //     const handleActionsButtonClick = (event: React.MouseEvent) => {
      //       event.stopPropagation();
      //       setIsActionsDropDownOpen((prev: any) => !prev);

      //       const rect = (
      //         event.currentTarget as HTMLButtonElement
      //       ).getBoundingClientRect();

      //       const dropdownHeight = 110;
      //       const windowHeight = window.innerHeight;
      //       const spaceBelow = windowHeight - rect.bottom;
      //       const isUpward = spaceBelow < dropdownHeight;

      //       setPosition({
      //         top: isUpward
      //           ? rect.top + window.scrollY - dropdownHeight + 10
      //           : rect.bottom + window.scrollY - 10,
      //         left: rect.left + window.scrollX - 25,
      //         isUpward,
      //       });
      //     };

      //     useEffect(() => {
      //       const handleClickOutside = (event: MouseEvent) => {
      //         if (
      //           dropdownRef.current &&
      //           !dropdownRef.current.contains(event.target as Node)
      //         ) {
      //           setIsActionsDropDownOpen(false);
      //         }
      //       };

      //       document.addEventListener("mousedown", handleClickOutside);
      //       return () =>
      //         document.removeEventListener("mousedown", handleClickOutside);
      //     }, []);

      //     return (
      //       <>
      //         <button
      //           className="text-blue-600"
      //           onClick={handleActionsButtonClick}
      //         >
      //           {JSX_CHILDREN_NAME.ACTIONS}
      //         </button>

      //         {isActionsDropDownOpen &&
      //           createPortal(
      //             <div
      //               ref={dropdownRef}
      //               className="absolute bg-white border rounded-md shadow-lg w-32 ml-2 z-50"
      //               style={{ top: position.top, left: position.left }}
      //             >
      //               {/* DETAILS */}
      //               <ActionsDropdownButton
      //                 onClick={() => {
      //                   setIsActionsDropDownOpen(false);
      //                   console.log(params.data);

      //                   params.context.handleRowClick(params);
      //                   // isUpdateCompanyTeamModalOpen!(params.data);
      //                 }}
      //                 // disabled={!userHasAccessToViewTeamManagement}
      //               >
      //                 <ReceiptText
      //                   className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
      //                 />
      //                 Details
      //               </ActionsDropdownButton>

      //               {/* DOWNLOAD */}
      //               <ActionsDropdownButton
      //                 onClick={() => {
      //                   setIsActionsDropDownOpen(false);
      //                   params.context.downloadTaskDocument(params);
      //                 }}
      //                 // disabled={!params.data?.document_file_extension}
      //               >
      //                 <Download className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />
      //                 Download
      //               </ActionsDropdownButton>
      //             </div>,
      //             document.body,
      //           )}
      //       </>
      //     );
      //   },
      // },
    ],
    [handleRowClick],
  );

  const defaultColDef = useMemo(
    () => ({
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
    }),
    [],
  );

  const skeletonRows = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      __isSkeleton: true,
    }));
  }, []);

  return (
    <div
      className="w-full modern-user-grid custom-height-scrollbar"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef} // Attach the ref
        rowData={isDataLoading ? skeletonRows : MasterTaskData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        rowHeight={AGGRID.ROW_HEIGHT}
        headerHeight={AGGRID.HEADER_HEIGHT}
        // theme={themeBalham}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{
          handleRowSelect: onRowSelect,
        }}
        onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default MasterTaskManagementAgGrid;
