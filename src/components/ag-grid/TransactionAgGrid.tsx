
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo } from "react";
import Transaction from "../../@types/stock/Transaction";

const TransactionAgGrid: React.FC<{
  data : Transaction[]
}> = ({
     data
    
    }) => {

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
        headerName: "Changed Lead Owner",
        cellStyle: {
          color: "black",
          fontWeight: "bold",
        },
      },
      {
        field: "transactionTypeName",
        headerName: "transactionTypeName",
        hide: false,
        
      },
      {
        field: "quantity",
        headerName: "quantity", 
      },
      {
        field: "isInward",
        headerName: "isInward",
      },
       {
        field: "otherDetails",
        headerName: "otherDetails",
      },
       {
        field: "description",
        headerName: "description",
      },
       {
        field: "transactionDate",
        headerName: "transactionDate",
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

export default TransactionAgGrid ;
