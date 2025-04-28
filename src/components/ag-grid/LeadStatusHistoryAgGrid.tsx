/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo } from "react";

const LeadStatusHistoryAgGrid: React.FC<{
  leadStatusHistoryData: any;
}> = ({ leadStatusHistoryData }) => {
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "leadStatus",
        headerName: "Lead Status",
        cellStyle: {
          color: "black",
          fontWeight: "bold",
        },
      },
      {
        field: "id",
        headerName: "id",
        hide: true,
        
      },
      {
        field: "reason",
        headerName: "Reason", 
      },
      {
        field: "createdBy",
        headerName: "Changed By",
      },
      {
        field: "createdOn",
        headerName: "Change Date",
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
    };
  }, []);
  return (
    <div
      className="ag-theme-balham w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        rowData={leadStatusHistoryData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham}
      />
    </div>
  );
};

export default LeadStatusHistoryAgGrid;
