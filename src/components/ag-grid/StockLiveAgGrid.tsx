import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import LiveStock from "../../@types/stock/LiveStock";

const StockLiveAgGrid = ({ data }: { data: LiveStock[] }) => {
  // count : number,
  // companyProductId: number,
  // companyProductName : string,
  // companyWarehouseId: number,
  // companyWarehouseName : string,
  // quantityInward: number,
  // quantityOutward: number,
  // quantityLive : number

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: true,
        field: "companyProductName",
        headerName: " Product",
        cellStyle: {
          color: "black",
          fontWeight: "bold",
        },
      },
      {
        field: "companyWarehouseName",
        headerName: "Warehouse",
        hide: false,
        cellStyle: {
          color: "black",
          fontWeight: "bold",
        },
      },
      {
        field: "quantityLive",
        headerName: "Current Quantity",
      },
      {
        field: "quantityInward",
        headerName: "Inward",
      },
      {
        field: "quantityOutward",
        headerName: "Outward",
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
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham}
      />
    </div>
  );
};

export default StockLiveAgGrid;
