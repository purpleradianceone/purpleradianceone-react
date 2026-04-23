/* eslint-disable @typescript-eslint/no-explicit-any */

import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import CompanyQuotationManagementAgGridProps from "../../@types/ag-grid/CompanyQuotationManagementAgGridProps";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import QuotationStatusChip from "../ui/QuotationStatusChip";
import StatusIndicator from "../ui/StatusIndicator";
import QuotationActionsDropdown from "../views/company-quotation-management/QuotationActionsDropdown";

function CompanyQuotationManagementAgGrid({
  quotations,
  onRowSelect,
  onDeleteQuotation,
  onDownloadQuotation,
}: CompanyQuotationManagementAgGridProps) {
  const gridRef = useRef<AgGridReact>(null);
  const { userHasAccessToUpdateCompanyQuotation } = useUserAccessModules();
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "quotationNumber",
        headerName: "Quotation No",
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
        field: "quotationTypeName",
        headerName: "Type",
        sortable: true,
        filter: true,
      },
      {
        field: "quotationStatusName",
        headerName: "Status",
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center gap-2">
              <QuotationStatusChip statusId={params.data.quotationStatusId} />
            </div>
          );
        },
      },
      {
        field: "quotationDate",
        headerName: "Quotation Date",
        sortable: true,
        filter: true,
        // cellRenderer: (params: any) => {
        //   return (
        //     <div className="flex items-center font-bold gap-2">
        //       <span>{params.value || "[Auto-generated]"}</span>
        //     </div>
        //   );
        // },
      },
      {
        field: "validTillDate",
        headerName: "Valid Till Date",
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
          <QuotationActionsDropdown data={params.data} context={params.context} />
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
        rowData={quotations}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{
          handleRowSelect: onRowSelect, 
          onDelete: onDeleteQuotation,
          onDownloadQuotation: onDownloadQuotation,
          userHasAccessToUpdateCompanyQuotation,
          gridRef, 
        }}
        // onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default CompanyQuotationManagementAgGrid;
