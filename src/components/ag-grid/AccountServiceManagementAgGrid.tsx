/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import { AGGRID,  JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import AccountServiceManagementGridProps from "../../@types/ag-grid/AccountServiceManagementAgGridProps";
import AccountServiceProps from "../../@types/account/AccountServiceProps";

import COLORS from "../../constants/Colors";
import Button from "../ui/Button";
import { Eye } from "lucide-react";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import StatusBadge from "../ui/StatusBadge";
import RenderUserWithIcon from "../ui/UserAgGridCellRenderer";

function AccountServiceManagementAgGrid({
  accountServices,
  onRowSelect,
  handleAddToInvoice,
  // handleRowClick,

  isUsedInSupportTicketModule,
}: AccountServiceManagementGridProps) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: false,
        field: "accountServiceCode",
        headerName: "Code",
        minWidth: 130,

        cellStyle: () => ({
          fontSize: "14px",
          fontWeight: 600,
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
        field: "companyProductName",
        headerName: "Product Name",
        sortable: true,
        filter: true,
      },

      {
        field: "serviceDateTime",
        headerName: "Date Time",
        sortable: true,
        filter: true,
      },
      {
        field: "serviceStatus",
        headerName: "Service Status",
        sortable: true,
        filter: true,
        minWidth: 100,
      },
      {
        field: "isActive",
        headerName: "Status",
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
        field: "isAddedToInvoiceDraft",
        headerName: "InvoiceStatus",
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const isAdded = params.value;

          return (
            <div className="flex items-center justify-center">
              {isAdded ? (
                <span className="text-green-600 font-medium">
                  Added to Invoice
                </span>
              ) : (
                <Button
                  type="button"
                  className={COLORS.ADD_BUTTON}
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ prevent row click
                    params.context.handleAddToInvoice(params.data);
                  }}
                >
                  + Add to Invoice
                </Button>
              )}
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
        maxWidth: 90,
        filter: false,
        // minWidth:80,
        // autoHeight: true,
        // suppressSizeToFit: true,
        cellRenderer: (params: AccountServiceProps | any) => {
          return (
            <div className="flex items-center justify-center  ">
              <span
                className="lead-details cursor-pointer text-blue-600  "
                onClick={() => {
                  params.context.handleRowSelect(params.data);
                }}
              >
                <Eye size={12} strokeWidth={1.5} />
                 <span>
                {isUsedInSupportTicketModule ? "Select" : "Details"}
                </span>
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
      minWidth: 150,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    }),
    [],
  );

  return (
    <div
      className="w-full modern-user-grid custom-height-scrollbar"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef} // Attach the ref
        rowData={accountServices}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        rowHeight={AGGRID.ROW_HEIGHT}
        headerHeight={AGGRID.HEADER_HEIGHT}
        // theme={themeBalham}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{
          handleRowSelect: onRowSelect,
          handleAddToInvoice: handleAddToInvoice,
        }}
        // onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default AccountServiceManagementAgGrid;
