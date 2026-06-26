/* eslint-disable @typescript-eslint/no-explicit-any */

import { AllCommunityModule, ColDef,  } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo } from "react";
import Transaction from "../../@types/stock/Transaction";
import StatusIndicator from "../ui/StatusIndicator";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import { AGGRID } from "../../constants/AppConstants";
import RenderUserWithIcon from "../ui/UserAgGridCellRenderer";
import { stockLedgerTransactionTypeStyles } from "../../utils/colourSpecifierForNameInAggrid";
import AgGridProfileCell from "../ui/AgGridProfileCell";
import { Package } from "lucide-react";

const TransactionAgGrid: React.FC<{
  data: Transaction[];
  isDataLoading : boolean
}> = ({ data  , isDataLoading}) => {
  //     count : number,
  // id : number,
  // companyProductId : number,
  // companyProductName : string ,
  // transactionTypeId: number,
  // transactionTypeName : string ,
  // quantity : number,
  // isInward : boolean,
  // otherDetails: string | null,
  // description: string | null,
  // transactionDate : string ,
  // createdBy: string ,
  // createdOn : string
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "companyProductName",
        headerName: "Product",
        cellStyle: {
          color: "black",
          fontWeight: "bold",
        },

        cellRenderer: (params: any) => (
      <AgGridProfileCell
        primaryText={params.value}
        icon={<Package size={16} />}
      />
    ),
      },
      {
        field: "transactionTypeName",
        headerName: "Transaction Type",
        hide: false,
        cellRenderer : (params : any)=>{
          if (params.data?.__isSkeleton) {
                return <SkeletonRowsAgGrid />;
              }
          const type = params.value || "-";

            return (
              <div className="flex items-center h-full">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    stockLedgerTransactionTypeStyles[type] ||
                    "bg-slate-100 text-slate-700"
                  }`}
                >
                  {type}
                </span>
              </div>
            );
        }
      },
      {
        field: "quantity",
        headerName: "quantity",
      },
      {
        field: "transactionDate",
        headerName: "Transaction Date",
      },
      {
        hide:true,
        field: "isInward",
        headerName: "Inward ",
        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
                return <SkeletonRowsAgGrid />;
              }
              
          return (
            <div className="flex items-center gap-1">
              <StatusIndicator
                isActive={params.value}
                activeLabel="Yes"
                inactiveLabel="No"
              />
            </div>
          );
        },
      },
      {
        field: "otherDetails",
        headerName: "Other Details",
      },
      {
        field: "description",
        headerName: "description",
      },

      {
        field: "createdBy",
        headerName: "createdBy",
        cellRenderer: RenderUserWithIcon,
      },
      {
        hide: true,
        field: "createdOn",
        headerName: "createdOn",
      },
    ],
    [],
  );

  const skeletonRows = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      __isSkeleton: true,
    }));
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      minWidth: 150,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cellRenderer: (params: any) => {
              if (params.data?.__isSkeleton) {
                return <SkeletonRowsAgGrid />;
              }
              return (
          <span className="">
            {params.value !== null &&
            params.value !== undefined &&
            params.value !== ""
              ? params.value
              : "-"}
          </span>
        );
            },
    };
  }, []);
  return (
    <div
      className="modern-user-grid custom-height-scrollbar w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        rowData={ isDataLoading  ? skeletonRows :data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        rowHeight={AGGRID.ROW_HEIGHT}
        headerHeight={AGGRID.HEADER_HEIGHT}
      />
    </div>
  );
};

export default TransactionAgGrid;
