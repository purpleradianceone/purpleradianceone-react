/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import AccountCompanyProductForSupportTicket from "../../@types/support-ticket-management/AccountCompanyProductForSupportTicket";

function AccountCompanyProductForSupportTicketAgGrid({
  accountCompanyProductsForSupportTickt,
  handleRowClick,
  onRowSelect,
}: {
  accountCompanyProductsForSupportTickt: AccountCompanyProductForSupportTicket[];
  handleRowClick?: (event: any) => void;
  onRowSelect?: (data: AccountCompanyProductForSupportTicket | any) => void;
}) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "id",
        headerName: "Id",
        hide: true,
      },
      {
        field: "accountId",
        headerName: "Account Id",
        hide: true,
      },
      {
        field: "accountName",
        headerName: "Account Name",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 140,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
          {
        field: "accountEmail",
        headerName: "Email",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 160,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
          {
        field: "accountMobileNumber",
        headerName: "Mobile Number",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 140,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      {
        field: "companyProductId",
        headerName: "companyProductId",
        hide: true,
      },
      {
        field: "companyProductName",
        headerName: "Product Name",
        sortable: true,
        filter: true,
        flex: 1.5,
        minWidth: 200,
      },
      {
        field: "quantity",
        headerName: "Quantity",
        sortable: true,
        filter: true,
      },
      {
        field: "barcode",
        headerName: "Barcode",
        sortable: true,
        filter: true,
      },
      {
        field: "serialNumber",
        headerName: "Serial Number",
        sortable: true,
        filter: true,
      },
      {
        field: "unitName",
        headerName: "Unit",
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
        hide: true,
        headerName: "Actions",
        field: "actions",
        cellRenderer: () => JSX_CHILDREN_NAME.ACTIONS,
        sortable: false,
        maxWidth: 110,
        pinned: "right",
        cellStyle: {
          color: "#2563eb", // Tailwind's blue-600
          textDecoration: "none",
          cursor: "pointer",
          fontWeight: "400",
        },
      },
      {
        headerName: "Actions",
        field: "view",
        pinned: "right",
        maxWidth: 80,
        cellRenderer: (params: AccountCompanyProductForSupportTicket | any) => {
          return (
            <div className="flex items-center justify-center">
              <span
                className="lead-details"
                onClick={() => {
                  params.context.handleRowSelect(params.data);
                }}
              >
                {"Select"}
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
        rowData={accountCompanyProductsForSupportTickt}
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
}

export default AccountCompanyProductForSupportTicketAgGrid;
