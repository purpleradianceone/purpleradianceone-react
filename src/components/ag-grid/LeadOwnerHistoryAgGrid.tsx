/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo } from "react";

const LeadOwnerHistoryAgGrid: React.FC<{
  leadOwnerHistoryData: any;
}> = ({ leadOwnerHistoryData }) => {
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "leadOwner",
        headerName: "Changed Lead Owner",
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
        headerName: "Reason to change", 
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
        rowData={leadOwnerHistoryData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham}
      />
    </div>
  );
};

export default LeadOwnerHistoryAgGrid;
