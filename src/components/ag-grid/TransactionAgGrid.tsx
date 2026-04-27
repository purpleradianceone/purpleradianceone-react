/* eslint-disable @typescript-eslint/no-explicit-any */

import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo } from "react";
import Transaction from "../../@types/stock/Transaction";
import StatusIndicator from "../ui/StatusIndicator";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";

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
      },
      {
        field: "transactionTypeName",
        headerName: "Transaction Type",
        hide: false,
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
              return params.value;
            },
    };
  }, []);
  return (
    <div
      className="ag-theme-balham w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        rowData={ isDataLoading  ? skeletonRows :data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham}
      />
    </div>
  );
};

export default TransactionAgGrid;
