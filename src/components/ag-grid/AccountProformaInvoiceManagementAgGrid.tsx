/* eslint-disable @typescript-eslint/no-explicit-any */

import { AllCommunityModule, ColDef, } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import { AGGRID, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import InvoiceActionsDropdown from "../views/invoice/InvoiceActionsDropdown";
import InvoiceStatusChip from "../ui/InvoiceStatusChip";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import AccountProformaInvoiceManagementGridProps from "../../@types/ag-grid/AccountProformaInvoiceManagementGridProps";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import RenderUserWithIcon from "../ui/UserAgGridCellRenderer";
import StatusBadge from "../ui/StatusBadge";
import { formatRupee } from "../../utils/helperMethods/formatFunctions";

function AccountProformaInvoiceManagementAgGrid({
  proformaInvoices,
  onRowSelect,
  onDeleteInvoice,
  onDownloadInvoice,
  gridLoading,
}: AccountProformaInvoiceManagementGridProps) {
  const gridRef = useRef<AgGridReact>(null);
  const { userHasAccessToUpdateAccountProformaInvoice } =
    useUserAccessModules();
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "invoiceNumber",
        headerName: "Invoice No",
        minWidth: 140,
        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          return (
            <div className="flex items-center font-semibold gap-2">
              <span>{params.value || "[Auto-generated]"}</span>
            </div>
          );
          
        },cellStyle: () => ({
          fontSize: "13px",
          fontWeight: 500,
          color: "#1f2937",
        }),
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
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
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
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          return (
            <div className="flex items-center gap-2">
              <InvoiceStatusChip statusId={params.data.statusId} />
            </div>
          );
        },
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
         cellRenderer: (params: any) => {
                    if (params.data?.__isSkeleton) {
                      return <SkeletonRowsAgGrid />;
                    }
                
                    return `₹ ${formatRupee(params.value)}`;
                  },
      },

      {
        field: "discountAmount",
        headerName: "Discount Amount",
        sortable: true,
        filter: true,
         cellRenderer: (params: any) => {
            if (params.data?.__isSkeleton) {
              return <SkeletonRowsAgGrid />;
            }
        
            return `₹ ${formatRupee(params.value)}`;
          },
      },

      {
        field: "taxableValue",
        headerName: "Taxable Value",
        sortable: true,
        filter: true,
         cellRenderer: (params: any) => {
            if (params.data?.__isSkeleton) {
              return <SkeletonRowsAgGrid />;
            }
        
            return `₹ ${formatRupee(params.value)}`;
          },
      },
      {
        field: "totalTax",
        headerName: "Total Tax",
        sortable: true,
        filter: true,
         cellRenderer: (params: any) => {
            if (params.data?.__isSkeleton) {
              return <SkeletonRowsAgGrid />;
            }
        
            return `₹ ${formatRupee(params.value)}`;
          },
      },
      {
        field: "totalAmount",
        headerName: "Total Amount",
        sortable: true,
        filter: true,
         cellRenderer: (params: any) => {
            if (params.data?.__isSkeleton) {
              return <SkeletonRowsAgGrid />;
            }
        
            return `₹ ${formatRupee(params.value)}`;
          },
      },

      {
        field: "isActive",
        headerName: "Active",
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          return (
                <div className="h-full flex items-center">
                  <StatusBadge isActive={params.value} />
                </div>
              );
        },
      },

      {
        field: "createdBy",
        headerName: "Created By",
        filter: true,
        cellRenderer: RenderUserWithIcon,
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
        cellRenderer: RenderUserWithIcon,
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
        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          return (
            <InvoiceActionsDropdown
              data={params.data}
              context={params.context}
            />
          );
        },
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
        )
      },
    }),
    [],
  );

  const length = 30;
  const skeletonRows = useMemo(() => {
    return Array.from({ length: length }).map(() => ({
      __isSkeleton: true,
    }));
  }, []);

  return (
    <div
      className="modern-user-grid custom-height-scrollbar w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={gridLoading ? skeletonRows : proformaInvoices}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        // theme={themeBalham}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        rowHeight={AGGRID.ROW_HEIGHT}
        headerHeight={AGGRID.HEADER_HEIGHT}
        context={{
          handleRowSelect: onRowSelect, // ✅ correct
          onDelete: onDeleteInvoice,
          onDownloadInvoice,
          access: userHasAccessToUpdateAccountProformaInvoice,
          gridRef, // ✅ correct
        }}
        onCellClicked={(params) => {
          //Ignore clicks on Actions column
          if (params.colDef.field === "view") return;
          //Call row select handler
          params.context.handleRowSelect?.(params.data);
        }}
        // onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default AccountProformaInvoiceManagementAgGrid;
