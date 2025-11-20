import { useMemo, useRef } from "react";
import { INNERHTML } from "../../constants/AppConstants";
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import AccountProduct from "../../@types/account/AccountProduct";

const AccountCompanyProductAgGrid = ({
     accountProductData,
  onRowSelect, //selected user for view lead details
//   handleRowClick,
} :{
    accountProductData : AccountProduct [];
    onRowSelect : (data : AccountProduct)=> void;
}) => {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    () => [
         {
        field: "companyProductName",
        headerName: "Product",
        sortable: true,
        filter: true,
      },
      {
        hide:true,
        field: "accountId",
        headerName: "Account ID",
        sortable: true,
        filter: true,
      },
      {
        hide:true,
        field: "companyProductId",
        headerName: "Company Product ID",
        sortable: true,
        filter: true,
      },
      {
        field: "quantity",
        headerName: "Quantity",
        sortable: true,
        filter: true,
      },
      {
        field: "quantityReturn",
        headerName: "Quantity Return",
        sortable: true,
        filter: true,
      },
      {
        field: "barcode",
        headerName: "barcode",
        sortable: true,
        filter: true,
      },
      {
        field: "serial_number",
        headerName: "Serial Number",
        sortable: true,
        filter: true,
      },
      {
        hide:true,
        field: "unitName",
        headerName: "Unit",
        sortable: true,
        filter: true,
      },
      {
         hide:true,
        field: "unitNameInStock",
        headerName: "Unit In Stock",
        sortable: true,
        filter: true,
      },
      {
        field: "purchaseDate",
        headerName: "Purchase Date",
        sortable: true,
        filter: true,
      },
      {
        field: "installedByName",
        headerName: "Installed By",
        sortable: true,
        filter: true,
      },
       {
        field: "installationDate",
        headerName: "Installation Date",
        sortable: true,
        filter: true,
      },
      {
        field: "deliveryDate",
        headerName: "Delivery Date",
        sortable: true,
        filter: true,
      },
      {
        field: "deliveryAddress",
        headerName: "Delivery Address",
        sortable: true,
        filter: true,
      },
      {
        field: "billingAddress",
        headerName: "Billing Address",
        sortable: true,
        filter: true,
      },
     
      {
        hide: true,
        field: "installedBy",
        headerName: "Installed By",
        sortable: true,
        filter: true,
      },
      {
         hide:true,
        field: "warrantyIntervalTypeId",
        headerName: "Warranty Interval Type ID",
        sortable: true,
        filter: true,
      },
      {
         hide:true,
        field: "warranty",
        headerName: "Warranty",
        sortable: true,
        filter: true,
      },
      {
        field: "warrantyIntervalName",
        headerName: "Warranty",
        sortable: true,
        filter: true,
      },
      {
        field: "warrantyStartDate",
        headerName: "Warranty Start Date",
        sortable: true,
        filter: true,
      },
      {
        field: "warrantyEndDate",
        headerName: "Warranty End Date",
        sortable: true,
        filter: true,
      },
      {
        field: "warrantyTerms",
        headerName: "Warranty Terms",
        sortable: true,
        filter: true,
      },
       
      {
        field: "amcIntervalName",
        headerName: "AMC",
        sortable: true,
        filter: true,
      },
      {
         hide:true,
        field: "amcCycleIntervalTypeId",
        headerName: "AMC Cycle Interval Type ID",
        sortable: true,
        filter: true,
      },
      {
         hide:true,
        field: "amcCycle",
        headerName: "AMC Cycle",
        sortable: true,
        filter: true,
      },
      {
        field: "amcCycleStartDate",
        headerName: "AMC Cycle Start Date",
        sortable: true,
        filter: true,
      },
      {
        field: "amcCycleEndDate",
        headerName: "AMC Cycle End Date",
        sortable: true,
        filter: true,
      },
      { field: "id",hide:true, headerName: "ID", sortable: true, filter: true },
      {
        hide:true,
        field: "accountName",
        headerName: "Account Name",
        sortable: true,
        filter: true,
      },
     
     
      {
        field: "updatedBy",
        headerName: "Updated By",
        sortable: true,
        filter: true,
      },
      {

        field: "createdOn",
        headerName: "Created On",
        sortable: true,
        filter: true,
      },
      {
        field: "updatedOn",
        headerName: "Updated On",
        sortable: true,
        filter: true,
      },
      {
        field: "createdBy",
        headerName: "Created By",
        sortable: true,
        filter: true,
      },

      {
        headerName: "Actions",
        field: "view",
        pinned: "right",
        maxWidth: 80,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: AccountProduct | any) => {
          return (
            <div className="flex items-center justify-center  ">
              <span
                className="lead-details cursor-pointer text-blue-600  "
                onClick={() => {
                  params.context.handleRowSelect(params.data);
                }}
              >
                Details
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
        rowData={accountProductData}
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
};

export default AccountCompanyProductAgGrid;
