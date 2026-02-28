/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  ActionTypeForStockMOdule,
  INNERHTML,
} from "../../constants/AppConstants";
import LiveStockForCompanyProduct from "../../@types/stock/LiveStockForCompanyProduct";
import { useMemo, useRef } from "react";

const StockLiveForCompanyProductAgGrid = ({
  data,
  handleRowClick,
  onRowSelect,
}: {
  data: LiveStockForCompanyProduct[];
  handleRowClick?: (event: any) => void;
  onRowSelect?: (data: LiveStockForCompanyProduct | any) => void;
}) => {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "companyProductName",
        headerName: "Product",
        sortable: true,
        filter: true,
        flex: 1.5,
        minWidth: 150,
      },
      {
        hide: true,
        field: "companyProductId",
        headerName: "companyProductId",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
      },
      {
        field: "quantityLive",
        headerName: "Quantity Live",
        sortable: true,
        filter: true,
      },
      {
        field: "quantityInward",
        headerName: "Quantity Inward",
        sortable: true,
        filter: true,
      },
      {
        field: "quantityOutward",
        headerName: "Quantity Outward",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 180,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      {
        field: "availability",
        headerName: "Availability",
        sortable: true,
        filter: "agTextColumnFilter",
      },
      // NOTE : IT IS HIDDEN , NEW ACTIONS TAB IS USED i.e WRITTEN BELOW
      {
        hide: true,
        headerName: "Actions",
        field: "actions",

        pinned: "right",
        cellRenderer: (params: LiveStockForCompanyProduct | any) => {
          const handleClick = (action: ActionTypeForStockMOdule) => {
            params.context.handleRowSelect(params.data, action);
          };

          return (
            <div className="flex  items-center justify-center gap-1">
              <span
                className="lead-details cursor-pointer text-blue-600  "
                onClick={() => handleClick(ActionTypeForStockMOdule.DETAILS)}
              >
                Details
              </span>
              <span
                className="lead-details cursor-pointer text-blue-600  "
                onClick={() =>
                  handleClick(ActionTypeForStockMOdule.TRANSACTIONS)
                }
              >
                Transactions
              </span>
            </div>
          );
        },
      },
      {
        headerName: "Actions",
        field: "view",
        pinned: "right",
        maxWidth: 80,
        cellRenderer: (params: LiveStockForCompanyProduct | any) => {
          return (
            <div className="flex items-center justify-center">
              <span
                className="lead-details"
                onClick={() => {
                  params.context.handleRowSelect(params.data);
                }}
              >
                {"Add Stock"}
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
        ref={gridRef}
        rowData={data}
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
};

export default StockLiveForCompanyProductAgGrid;
