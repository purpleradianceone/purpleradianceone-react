/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import SupportTicketManagementAgGridProps from "../../@types/ag-grid/SupportTicketManagementAgGridProps";
import SupportTicketProps from "../../@types/support-ticket-management/SupportTicketProps";

function SupportTicketManagementAgGrid({
  supportTickets,
  onRowSelect, //selected user for view lead details
  handleRowClick,
  isUsedInSupportTicketModule,
  
}: SupportTicketManagementAgGridProps) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: false,
        field: "ticketNumber",
        headerName: "Ticket Number",
        minWidth: 130,
      },
      {
        field: "createdOn",
        headerName: "Created On",
        sortable: true,
        filter: true,
      },
      {
        field: "accountName",
        headerName: "Account Name",
        sortable: true,
        filter: true,
      },
      {
        field: "accountEmail",
        headerName: "Email",
        sortable: true,
        filter: true,
      },
      {
        field: "accountMobileNumber",
        headerName: "Mobile Number",
        maxWidth: 140,
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
        field: "queryDescription",
        hide: !isUsedInSupportTicketModule,
        headerName: "Query Description",
        sortable: true,
        filter: true,
      },

       {
        field: "publicNotes",
        headerName: "Public Notes",
        sortable: true,
        filter: true,
      },
      {
        field: "createdBy",
        headerName: "Created By",
        filter: true,
      },
      {
        field: "assignedToName",
        headerName: "Assigned To",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 180,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      {
        field: "resolvedByName",
        headerName: "Resolved By",
        sortable: true,
        filter: true,
      },
      {
        field: "resolutionApplied",
        headerName: "Resolution Applied",
        sortable: true,
        filter: true,
      },
      
      {
        field: "dueDateTime",
        headerName: "Due Date/Time",
        sortable: true,
        filter: true,
      },
      {
        field: "completedAtDateTime",
        headerName: "Completed At Date/Time",
        sortable: true,
        filter: true,
      },
      
      {
        field: "supportTicketCategoryName",
        headerName: "Category",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 160,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      {
        field: "supportTicketEscalationLevelName",
        headerName: "Escalation Level",
        sortable: true,
        filter: true,
        flex: 1.5,
        minWidth: 150,
      },
      {
        field: "supportTicketLifecycleName",
        headerName: "Lifecycle",
        sortable: true,
        filter: true,
        minWidth: 100
      },
      {
        field: "companyProductSlaName",
        headerName: "Product SLA",
        sortable: true,
        filter: true,
        minWidth: 120,
      },
      
      {
        field: "supportTicketSourceName",
        headerName: "Source",
        sortable: true,
        filter: true,
        minWidth: 100,
      },
      {
        field: "updatedBy",
        headerName: "Updated by",
        sortable: true,
        filter: true,
        minWidth: 120,
      },
      {
        field: "updatedOn",
        headerName: "Updated on",
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
        cellRenderer: (params: SupportTicketProps | any) => {
          return (
            <div className="flex items-center justify-center  ">
              <span
                className="lead-details cursor-pointer text-blue-600  "
                onClick={() => {
                  params.context.handleRowSelect(params.data);
                }}
              >
                {
                  isUsedInSupportTicketModule ? "Details": "Select"
                }
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
        rowData={supportTickets}
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

export default SupportTicketManagementAgGrid;
