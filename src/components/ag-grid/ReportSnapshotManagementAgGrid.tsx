/* eslint-disable @typescript-eslint/no-explicit-any */

import { AllCommunityModule, ColDef,  } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Eye, FileJson } from "lucide-react";
import { useMemo, useRef } from "react";
import ReportSnapshotManagementAgGridProps from "../../@types/ag-grid/ReportSnapshotManagementAgGridProps";
import ReportSnapshotProps from "../../@types/report/ReportSnapshotProps";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import { AGGRID } from "../../constants/AppConstants";

function ReportSnapshotManagementAgGrid({
  reports,
  onRowSelect,
  isDataLoading = false,
}: ReportSnapshotManagementAgGridProps) {
  const gridRef = useRef<AgGridReact>(null);
  const { userHasAccessToViewCompanyUserReportType } = useUserAccessModules();
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: true,
        field: "id",
        headerName: "Id",
        minWidth: 140,
        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          return (
            <div className="flex items-center font-bold gap-2">
              <span>{params.value || "[Auto-generated]"}</span>
            </div>
          );
        },
      },
      {
        field: "reportData",
        headerName: "Report Data",
        sortable: false,
        filter: false,
        minWidth:350,

        tooltipValueGetter: (params) => {
          return JSON.stringify(params.value, null, 2);
        },

        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }

          const shortText = JSON.stringify(params.value);

          return (
            <div className="flex items-center max-w-full overflow-hidden">
              <div
                className="
                        relative
                        flex
                        items-center
                        gap-1
                        mt-2
                        bg-white
                        border
                        border-gray-300
                        rounded-md
                        shadow-sm
                        hover:shadow-md
                        hover:border-blue-400
                        transition-all
                        cursor-pointer
                        overflow-hidden
                        "
              >
                {/* File Icon */}
                <div className="h-7 w-7 bg-violet-50 rounded-md flex justify-center items-center">
          <FileJson
        size={16}
        className="text-violet-600 flex-shrink-0"
      />
      </div>

                {/* File Name / JSON Preview */}
                <span
                  className="
                        truncate
                        text-xs
                        font-mono
                        text-gray-700
                        flex-1
                    "
                >
                  {shortText}
                </span>
              </div>
            </div>
          );
        },
      },
      {
  headerName: "",
  field: "spacer",
  width: 20,
  minWidth: 20,
  maxWidth: 20,
  sortable: false,
  filter: false,
  resizable: false,
  suppressHeaderMenuButton: true,
  cellRenderer: () => "",
},

      {
        field: "generatedOn",
        headerName: "Generated On",
        sortable: true,
        filter: true,
      },

      {
        field: "reportFromInclusive",
        headerName: "From Date",
        sortable: true,
        filter: true,
      },
      {
        field: "reportToInclusive",
        headerName: "Till Date",
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
        field: "updatedOn",
        headerName: "Updated On",
        sortable: true,
        filter: true,
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
              cellRenderer: (params: ReportSnapshotProps | any) => {
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
      
                      <span>{ "Details" }</span>
                    </button>
                  </div>
                );
              },
            },
    //   {
    //     headerName: "Actions",
    //     field: "actions",
    //     pinned: "right",
    //     maxWidth: 90,
    //     cellRenderer: (params: any) => {
    //       if (params.data?.__isSkeleton) {
    //         return <SkeletonRowsAgGrid />;
    //       }
    //       return (
    //         <QuotationActionsDropdown
    //           data={params.data}
    //           context={params.context}
    //         />
    //       );
    //     },
    //   },
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
      cellRenderer: (params: any) => {
        if (params.data?.__isSkeleton) {
          return <SkeletonRowsAgGrid />;
        }
        return params.value;
      },
    }),
    [],
  );
  const length = 30;
  const skeletonRows = useMemo(() => {
    return Array.from({ length: length }).map(() => ({
      __isSkeleton: true,
    }));
  }, []);

  return (
    <div
      className="modern-user-grid custom-height-scrollbar w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef}
        // rowData={quotations}
        rowData={isDataLoading ? skeletonRows : reports}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        // theme={themeBalham}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
         rowHeight={AGGRID.ROW_HEIGHT}
          headerHeight={AGGRID.HEADER_HEIGHT}
        context={{
          handleRowSelect: onRowSelect,
          userHasAccessToViewCompanyUserReportType,
          gridRef,
        }}
        onCellClicked={(params) => {
          if (params.colDef.field === "actions") return;
          params.context.handleRowSelect?.(params.data);
        }}
        enableBrowserTooltips={true}
      />
    </div>
  );
}

export default ReportSnapshotManagementAgGrid;
