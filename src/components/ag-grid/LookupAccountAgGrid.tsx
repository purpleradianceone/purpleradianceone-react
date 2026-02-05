
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import { INNERHTML } from "../../constants/AppConstants";
import { LookupAccountAgGridProps } from "../../@types/ag-grid/LookupAccountAgGridProps";
import { LookupAccount } from "../../@types/lookup/LookupAccount";

function LookupAccountAgGrid({
  accounts,
  onRowSelect, //selected user for view lead details
//   handleRowClick,
//   isUsedInLeadModule,
  
}: LookupAccountAgGridProps) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    () => [
      
      {
        field: "name",
        headerName: "Name",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 160,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      {
        field: "email",
        headerName: "Email",
        sortable: true,
        filter: true,
        flex: 1.5,
        minWidth: 200,
      },
      {
        field: "mobileNumber",
        headerName: "Mobile number",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Actions",
        // hide: !isUsedInLeadModule,
        field: "view",
        pinned: "right",
        maxWidth: 80,
        // minWidth:80,
        // autoHeight: true,
        // suppressSizeToFit: true,
        cellRenderer: (params: LookupAccount | any) => {
          return (
            <div className="flex items-center justify-center  ">
              <span
                className="lead-details cursor-pointer text-blue-600  "
                onClick={() => {
                  params.context.handleRowSelect(params.data);
                }}
              >Select
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      filter: "agTextColumnFilter",
      minWidth: 150,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    }),
    []
  );

  return (
    <div
      className="ag-theme-balham w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef} // Attach the ref
        rowData={accounts}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{ handleRowSelect: onRowSelect }}
        // onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default LookupAccountAgGrid;
