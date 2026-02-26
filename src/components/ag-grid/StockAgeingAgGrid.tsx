import { useMemo } from "react";
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import StockAgeing from "../../@types/stock/StockAgeing";
import { AgGridReact } from "ag-grid-react";
import { INNERHTML } from "../../constants/AppConstants";

const StockAgeingAgGrid = ({ data }: { data: StockAgeing[] }) => {
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: false,
        field: "companyProductName",
        headerName: " Product",
        cellStyle: {
          color: "black",
          // fontWeight: "bold",
        },
      },
      {
        field: "unitName",
        headerName: "unit",
        hide: false,
        cellStyle: {
          color: "black",
          // fontWeight: "bold",
        },
      },
      {
        field: "zeroToThirtyDays",
        headerName: "0 - 30 Days",
      },
      {
        field: "thirtyToSixtyDays",
        headerName: "31 - 60 Days",
      },
      {
        field: "sixtyToNinetyDays",
        headerName: "61 - 90 Days",
      },
      {
        field: "ninetyPlusDays",
        headerName: "90+ Days",
      },
    ],
    [],
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
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham}
      />
    </div>
  );
};

export default StockAgeingAgGrid;
