/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import MasterTaskManagementAgGridProps from "../../@types/ag-grid/MasterTaskManagementAgGridProps";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import StatusIndicator from "../ui/StatusIndicator";
import TaskPriorityChip from "../ui/TaskPriorityChip";

function MasterTaskManagementAgGrid({
  MasterTaskData,
  onRowSelect,
  handleRowClick,
  isUsedInAllTasksModule,
}: MasterTaskManagementAgGridProps) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "subject",
        headerName: "subject",
        sortable: true,
        filter: true,
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
        cellRenderer: (params: any) => (
          <div className="flex items-center">
            <TaskPriorityChip
              priorityName={params.data.generalTaskPriorityName}
            />
          </div>
        ),
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
        field: "isActive",
        headerName: "Status",
        sortable: true,
        filter: true,
        // hide: isUsedForAccountLead,
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center text-sm gap-1 mt-1">
              <StatusIndicator isActive={params.value} />
            </div>
          );
        },
      },
      {
        field: "createdBy",
        headerName: "Created by",
        filter: true,
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
        maxWidth: 80,
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center justify-center">
              <span
                className="lead-details cursor-pointer text-blue-600"
                onClick={() => {
                  params.context.handleRowSelect(params.data);
                }}
              >
                {isUsedInAllTasksModule ? "Details" : "Select"}
              </span>
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
    }),
    [],
  );

  return (
    <div
      className="ag-theme-balham w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef} // Attach the ref
        rowData={MasterTaskData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{
          handleRowSelect: onRowSelect,
        }}
        onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default MasterTaskManagementAgGrid;
