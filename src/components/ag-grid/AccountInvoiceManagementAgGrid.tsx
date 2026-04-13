/* eslint-disable @typescript-eslint/no-explicit-any */

import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import StatusIndicator from "../ui/StatusIndicator";
import AccountInvoiceManagementGridProps from "../../@types/ag-grid/AccountInvoiceManagementGridProps";
import InvoiceActionsDropdown from "../views/invoice/InvoiceActionsDropdown";
import InvoiceStatusChip from "../ui/InvoiceStatusChip";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";

function AccountInvoiceManagementAgGrid({
  invoices,
  onRowSelect,
  onDeleteInvoice,
  onDownloadInvoice,
}: AccountInvoiceManagementGridProps) {
  const gridRef = useRef<AgGridReact>(null);
  const { userHasAccessToUpdateCompanyInvoiceDraft } = useUserAccessModules();
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "invoiceNumber",
        headerName: "Invoice No",
        minWidth: 140,
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center font-bold gap-2">
              <span>{params.value || "[Auto-generated]"}</span>
            </div>
          );
        },
      },

      {
        field: "accountName",
        headerName: "Account Name",
        sortable: true,
        filter: true,
      },

      {
        field: "invoiceDate",
        headerName: "Invoice Date",
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center font-bold gap-2">
              <span>{params.value || "[Auto-generated]"}</span>
            </div>
          );
        },
      },
      {
        field: "Status",
        headerName: "Status",
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center gap-2">
              <InvoiceStatusChip statusId={params.data.statusId} />
            </div>
          );
        },
      },
      {
        field: "dueDate",
        headerName: "Due Date",
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
        field: "shippingAddress",
        headerName: "Shipping Address",
        sortable: true,
        filter: true,
      },

      {
        field: "basicValue",
        headerName: "Basic Amount",
        sortable: true,
        filter: true,
      },

      {
        field: "discountAmount",
        headerName: "Discount Amount",
        sortable: true,
        filter: true,
      },

      {
        field: "taxableValue",
        headerName: "Taxable Value",
        sortable: true,
        filter: true,
      },
      {
        field: "totalTax",
        headerName: "Total Tax",
        sortable: true,
        filter: true,
      },
      {
        field: "totalAmount",
        headerName: "Total Amount",
        sortable: true,
        filter: true,
      },

      {
        field: "isActive",
        headerName: "Active",
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center text-sm gap-1 mt-1">
              <StatusIndicator isActive={params.value} />
            </div>
          );
        },
      },

      {
        field: "createdBy",
        headerName: "Created By",
        filter: true,
      },

      {
        field: "createdOn",
        headerName: "Created On",
        sortable: true,
        filter: true,
      },
      {
        field: "updatedBy",
        headerName: "Updated By",
        filter: true,
      },

      {
        field: "updatedOn",
        headerName: "Updated On",
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
          color: "#2563eb",
          cursor: "pointer",
          fontWeight: "400",
        },
      },
      {
        headerName: "Actions",
        field: "view",
        pinned: "right",
        maxWidth: 90,
        cellRenderer: (params: any) => (
          <InvoiceActionsDropdown data={params.data} context={params.context} />
        ),
      },
    ],
    [],
  );

  const defaultColDef = useMemo(
    () => ({
      filter: "agTextColumnFilter",
      minWidth: 150,
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
        rowData={invoices}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{
          handleRowSelect: onRowSelect, // ✅ correct
          onDelete: onDeleteInvoice,
          onDownloadInvoice,
          userHasAccessToUpdateCompanyInvoiceDraft,
          gridRef, // ✅ correct
        }}
        // onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default AccountInvoiceManagementAgGrid;
