/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { Warehouse } from "../../config/hooks/useCompanyWarehouse";
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { INNERHTML } from "../../constants/AppConstants";

const CompanyWarehouseAgGrid = ({
  data,
  onRowSelect,
}: {
  data: Warehouse[];
  onRowSelect: (data: Warehouse | any) => void;
}) => {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    // id: number,
    // companyId: number,
    // warehouseTypeId: number,
    // warehouseTypeName: string
    // name: string,
    // description: string,
    // location: string,
    // isactive: boolean
    () => [
      {
        hide: true,

        field: "id",
        headerName: "id",
      },

      {
        hide: true,
        field: "warehouseTypeId",
        headerName: "warehouseTypeId",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 160,
        // comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      {
        hide: false,
        field: "name",
        headerName: "name",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 160,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      {
        field: "warehouseTypeName",
        headerName: "warehouseTypeName",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 160,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      
      {
        hide: false,
        field: "location",
        headerName: "location",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 160,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
       {
        hide: false,
        field: "description",
        headerName: "Description",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 160,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
       {
        hide: true,
        field: "isactive",
        headerName: "Active",
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
        cellRenderer: (params: Warehouse | any) => {
          return (
            <div className="flex items-center justify-center  ">
              <span
                className="lead-details cursor-pointer text-blue-600  "
                onClick={() => {
                  params.context.handleRowSelect(params.data);
                }}
              >
                Select
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
    <div className="ag-theme-balham " style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        ref={gridRef} // Attach the ref
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{ handleRowSelect: onRowSelect }}
      />
    </div>
  );
};

export default CompanyWarehouseAgGrid;
