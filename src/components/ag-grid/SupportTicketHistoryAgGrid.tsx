import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo } from "react";
import SupportTicketHistory from "../../@types/support-ticket-management/SupportTicketHistory";

const SupportTicketHistoryAgGrid: React.FC<{
  supportTicketHistoryData: SupportTicketHistory[];
}> = ({ supportTicketHistoryData }) => {
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "support_ticket_lifecycle_name",
        headerName: "Ticket Lifecycle",
        cellStyle: {
          color: "black",
          fontWeight: "bold",
        },
      },
      {
        field: "support_ticket_category_name",
        headerName: "Ticket Category Name",
        hide: true,
      },
      {
        field: "support_ticket_escalation_level_name",
        headerName: "Escalation Level",
        hide: false,
      },
      {
        field: "company_product_sla_name",
        headerName: "Product SLA",
        hide: false,
      },
      {
        field: "support_ticket_source_name",
        headerName: "Source",
        hide: false,
      },
      {
        field: "query_description",
        headerName: "Query Description",
        hide: false,
      },
      {
        field: "public_notes",
        headerName: "Public Note",
        hide: false,

      },
      {
        field: "assignedto_name",
        headerName: "Assigned To",
        hide: false,
      },

      {
        field: "resolvedby_name",
        headerName: "Resolved By",
        hide: false,
      },
      
      {
        field: "resolution_applied",
        headerName:"Resolution Applied",
        hide: false,
      },


      {
        field: "id",
        headerName: "Id",
        hide: true,
      },
      {
        field: "createdby",
        headerName: "Changed By",
      },
      {
        field: "createdon",
        headerName: "Change On",
      },
      {
        field: "updatedby",
        headerName: "Updated By",
        hide: true
      },
      {
        field: "updatedon",
        headerName: "Updated On",
        hide: true,
      }
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
        rowData={supportTicketHistoryData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham}
      />
    </div>
  );
};

export default SupportTicketHistoryAgGrid;
