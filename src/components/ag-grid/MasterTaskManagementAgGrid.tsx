/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import MasterTaskManagementAgGridProps from "../../@types/ag-grid/MasterTaskManagementAgGridProps";
import TaskPriorityChip from "../ui/TaskPriorityChip";
import StatusIndicator from "../ui/StatusIndicator";

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
          <TaskPriorityChip
            priorityName={params.data.generalTaskPriorityName}
          />
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
    ],
    [],
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
        context={{ handleRowSelect: onRowSelect }}
        onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default MasterTaskManagementAgGrid;
