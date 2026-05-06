/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  ActionTypeForStockMOdule,
} from "../../constants/AppConstants";
import LiveStockForCompanyProduct from "../../@types/stock/LiveStockForCompanyProduct";
import { useMemo, useRef } from "react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";

const StockLiveForCompanyProductAgGrid = ({
  data,
  handleRowClick,
  onRowSelect,
  isDataLoading 
}: {
  data: LiveStockForCompanyProduct[];
  handleRowClick?: (event: any) => void;
  onRowSelect?: (data: LiveStockForCompanyProduct | any) => void;
  isDataLoading : boolean
}) => {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component
  const { userHasAccessToAddStock } = useUserAccessModules();
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "companyProductName",
        headerName: "Product",
        sortable: true,
        filter: true,
        flex: 1.5,
        minWidth: 150,
        cellStyle:{
          color : "black",
          fontWeight: "bold",
        }
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
        field: "",
        pinned: "right",
        maxWidth: 80,
        cellRenderer: (params: LiveStockForCompanyProduct | any) => {
           if (params.data?.__isSkeleton) {
                return <SkeletonRowsAgGrid />;
              }
          return (
            <div className="flex items-center justify-center">
              <button
                type="button"
                disabled={!userHasAccessToAddStock}
                className={`px-2 py-1 rounded text-sm
            ${
              userHasAccessToAddStock
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
            }`}
                onClick={() => {
                  if (!userHasAccessToAddStock) return;

                  params.context.handleRowSelect(params.data);
                }}
              >
                {"Add Stock"}
              </button>
            </div>
          );
        },
      },
    ],
    [userHasAccessToAddStock],
  );


   const skeletonRows = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      __isSkeleton: true,
    }));
  }, []);

  const defaultColDef = useMemo(
    () => ({
      filter: "agTextColumnFilter",
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,

       // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cellRenderer: (params: any) => {
              if (params.data?.__isSkeleton) {
                return <SkeletonRowsAgGrid />;
              }
              return params.value;
            },
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
        rowData={isDataLoading ? skeletonRows : data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{ handleRowSelect: isDataLoading ? undefined : onRowSelect }}
        onRowClicked={ isDataLoading ? undefined : handleRowClick}
      />
    </div>
  );
};

export default StockLiveForCompanyProductAgGrid;
