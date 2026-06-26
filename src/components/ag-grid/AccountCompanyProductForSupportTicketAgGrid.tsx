/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import AccountCompanyProductForSupportTicket from "../../@types/support-ticket-management/AccountCompanyProductForSupportTicket";
import StatusIndicator from "../ui/StatusIndicator";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";

function AccountCompanyProductForSupportTicketAgGrid({
  accountCompanyProductsForSupportTickt,
  handleRowClick,
  onRowSelect,
  isDataLaoding
}: {
  accountCompanyProductsForSupportTickt: AccountCompanyProductForSupportTicket[];
  handleRowClick?: (event: any) => void;
  onRowSelect?: (data: AccountCompanyProductForSupportTicket | any) => void;
  isDataLaoding : boolean
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
        field: "serialNumber",
        headerName: "Serial Number",
        sortable: true,
        filter: true,
      },
      {
        field: "isAmc",
        headerName: "AMC",
        sortable: true,
        filter: true,
        minWidth: 100,
        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
                      return (
                        <SkeletonRowsAgGrid/>
                      );
                    }
          return (
            <div className="flex items-center text-sm gap-1 mt-1">
              <StatusIndicator isActive={params.value} />
            </div>
          );
        },
      },
      {
        field: "isWarranty",
        headerName: "Warranty",
        sortable: true,
        filter: true,
        minWidth: 130,
        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
                      return (
                        <SkeletonRowsAgGrid/>
                      );
                    }
          return (
            <div className="flex items-center text-sm gap-1 mt-1">
              <StatusIndicator
                isActive={params.value}
                inactiveLabel="Out Of Warranty"
              />
            </div>
          );
        },
      },
      {
        // field: "quantity",
        valueGetter: (params) => `${params.data?.quantity ?? ""}  ${params.data?.unitName ?? ""}`,
        headerName: "Quantity",
        sortable: true,
        filter: true,
        minWidth: 90,
      },
      {
        field: "unitName",
        headerName: "Unit",
        sortable: true,
        filter: true,
        minWidth: 90,
        hide: true,
      },
      {
        field: "barcode",
        headerName: "Barcode",
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
          if (params.data?.__isSkeleton) {
                      return (
                        <SkeletonRowsAgGrid/>
                      );
                    }
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

  const skeletonRows = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      __isSkeleton: true,
    }));
  }, []);

  const defaultColDef = useMemo(
    () => ({
      filter: "agTextColumnFilter",
      minWidth: 150,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
       cellRenderer: (params: any) => {
                    if (params.data?.__isSkeleton) {
                      return (
                        <SkeletonRowsAgGrid/>
                      );
                    }
                    return params.value;
                  },
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
        rowData={isDataLaoding ? skeletonRows : accountCompanyProductsForSupportTickt}
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
