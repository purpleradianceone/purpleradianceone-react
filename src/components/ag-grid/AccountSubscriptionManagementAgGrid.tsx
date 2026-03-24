/* eslint-disable @typescript-eslint/no-explicit-any */

import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import AccountServiceProps from "../../@types/account/AccountServiceProps";
import StatusIndicator from "../ui/StatusIndicator";
import AccountSubscriptionManagementGridProps from "../../@types/ag-grid/AccountSubscriptionManagementAgGridProps";

function AccountSubscriptionManagementAgGrid({
  accountSubscriptions,
  onRowSelect,
  handleRowClick,

  isUsedInSupportTicketModule,
}: AccountSubscriptionManagementGridProps) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: false,
        field: "accountSubscriptionCode",
        headerName: "Code",
        minWidth: 130,
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
        field: "startDate",
        headerName: "Start Date",
        sortable: true,
        filter: true,
      },

      {
        field: "endDate",
        headerName: "End Date",
        sortable: true,
        filter: true,
      },

      {
        field: "isRenewal",
        headerName: "Is Renewal",
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
        field: "isActive",
        headerName: "Status",
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
                {isUsedInSupportTicketModule ? "Select" : "Details"}
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
      className="ag-theme-balham w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef} // Attach the ref
        rowData={accountSubscriptions}
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

export default AccountSubscriptionManagementAgGrid;
