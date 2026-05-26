/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef } from "react";
import MyTaskManagementAgGridProps from "../../@types/ag-grid/MyTaskManagementAgGridProps";
import { AgGridReact } from "ag-grid-react";
import { AGGRID, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import { AllCommunityModule, ColDef } from "ag-grid-community";
import MyAllTaskProps from "../../@types/my-task-management/MyAlltaskProps";
import { Eye, Flag } from "lucide-react";

import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import {
  taskPriorityStyles,
  taskStageStyles,
} from "../../utils/colourSpecifierForNameInAggrid";
import StatusBadge from "../ui/StatusBadge";
import RenderUserWithIcon from "../ui/UserAgGridCellRenderer";

function MyTaskManagementAgGrid({
  allTaskData,
  onRowSelect,
  handleRowClick,
  isUsedInAllTasksModule,
  isDataLoading,
}: MyTaskManagementAgGridProps) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "subject",
        headerName: "Subject",
        sortable: true,
        filter: true,

        cellStyle: () => ({
          fontSize: "14px",
          fontWeight: 600,
          color: "#1f2937",
        }),
      },
      {
        hide: false,
        field: "source",
        headerName: "Source",
        minWidth: 130,
      },
      {
        field: "taskType",
        headerName: "Task Type",
        sortable: true,
        filter: true,
      },
      {
        field: "taskPriority",
        headerName: "Priority",
        sortable: true,
        filter: true,
        // cellRenderer: PriorityCellRenderer,
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
        field: "taskStage",
        headerName: "Task Stage",
        maxWidth: 180,
        sortable: true,
        filter: true,
        cellRenderer: (params: MyAllTaskProps | any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          const stage = params.value || "-";

          return (
            <div className="flex items-center h-full">
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  taskStageStyles[stage] || "bg-slate-100 text-slate-700"
                }`}
              >
                {stage}
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
        field: "remark",
        headerName: "Remark",
        sortable: true,
        filter: true,
      },

      {
        field: "dueDateTime",
        headerName: "Due Date/Time",
        sortable: true,
        filter: true,
      },
      {
        field: "completedAtDateTime",
        headerName: "Completed At Date/Time",
        sortable: true,
        filter: true,
      },
      {
        field: "isActive",
        headerName: "Status",
        sortable: true,
        filter: true,
        // hide: isUsedForAccountLead,
        cellRenderer: (params: MyAllTaskProps | any) => {
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
        hide: true,
        headerName: "Actions",
        field: "actions",
        cellRenderer: () => JSX_CHILDREN_NAME.ACTIONS,
        sortable: false,
        maxWidth: 110,
        pinned: "right",
        cellStyle: {
          color: "#2563eb", // Tailwind's blue-600
          textDecoration: "none",
          cursor: "pointer",
          fontWeight: "400",
        },
      },
      {
        field: "createdBy",
        headerName: "Created by",
        filter: true,
        cellRenderer: RenderUserWithIcon,
      },
      {
        headerName: "Actions",
        field: "view",
        pinned: "right",
        maxWidth: 100,
        filter: false,
        // minWidth:80,
        // autoHeight: true,
        // suppressSizeToFit: true,
        cellRenderer: (params: MyAllTaskProps | any) => {
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
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
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
      className=" w-full modern-user-grid custom-height-scrollbar"
      // className="ag-theme-balham w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef} // Attach the ref
        rowData={isDataLoading ? skeletonRows : allTaskData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        // theme={themeBalham}
        rowHeight={AGGRID.ROW_HEIGHT}
        headerHeight={AGGRID.HEADER_HEIGHT}
        // loading={gridLoading}
        // overlayLoadingTemplate={GRIDSKELETON.MY_TASK_GRID}
        // overlayNoRowsTemplate={INNERHTML.GRID_NO_DATE_FOUND}
        context={{ handleRowSelect: onRowSelect }}
        onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default MyTaskManagementAgGrid;

export const PriorityCellRenderer = (params: any) => {
  const rawValue = params.value;

  // ✅ Handle null / undefined / empty
  if (!rawValue || rawValue.trim?.() === "") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 500,
          color: "#6b7280",
          backgroundColor: "#f3f4f6",
        }}
      >
        <Flag size={14} />
        Not Set
      </span>
    );
  }

  const value = rawValue.toLowerCase();

  const config: any = {
    low: { color: "#16a34a", bg: "#dcfce7", label: "Low" },
    medium: { color: "#ca8a04", bg: "#fef9c3", label: "Medium" },
    high: { color: "#dc2626", bg: "#fee2e2", label: "High" },
  };

  const item = config[value];

  // ✅ Handle unexpected values
  if (!item) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 500,
          color: "#6b7280",
          backgroundColor: "#f3f4f6",
        }}
      >
        <Flag size={14} />
        {rawValue}
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 500,
        color: item.color,
        backgroundColor: item.bg,
      }}
    >
      <Flag size={14} />
      {item.label}
    </span>
  );
};
