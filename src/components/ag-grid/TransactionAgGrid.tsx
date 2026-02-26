/* eslint-disable @typescript-eslint/no-explicit-any */

import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo } from "react";
import Transaction from "../../@types/stock/Transaction";
import StatusIndicator from "../ui/StatusIndicator";

const TransactionAgGrid: React.FC<{
  data: Transaction[];
}> = ({ data }) => {
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
        field: "createdOn",
        headerName: "createdOn",
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
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham}
      />
    </div>
  );
};

export default TransactionAgGrid;
