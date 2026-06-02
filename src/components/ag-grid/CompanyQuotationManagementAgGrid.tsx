/* eslint-disable @typescript-eslint/no-explicit-any */

import { AllCommunityModule, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import CompanyQuotationManagementAgGridProps from "../../@types/ag-grid/CompanyQuotationManagementAgGridProps";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import QuotationStatusChip from "../ui/QuotationStatusChip";
import QuotationActionsDropdown from "../views/company-quotation-management/QuotationActionsDropdown";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import { AGGRID } from "../../constants/AppConstants";
import RenderUserWithIcon from "../ui/UserAgGridCellRenderer";
import StatusBadge from "../ui/StatusBadge";

function CompanyQuotationManagementAgGrid({
  quotations,
  onRowSelect,
  onDeleteQuotation,
  onDownloadQuotation,
  isDataLoading = false,
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
           if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          return (
            <div className="flex items-center font-bold text-[#1f2937] gap-2">
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
           if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
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
        headerName: "Actions",
        field: "actions",
        pinned: "right",
        maxWidth: 90,
        filter: false,
        cellRenderer: (params: any) => {
           if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          return <QuotationActionsDropdown data={params.data} context={params.context} />
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
          return params.value;
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
        // rowData={quotations}
        rowData={isDataLoading ? skeletonRows : quotations}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        rowHeight={AGGRID.ROW_HEIGHT}
        headerHeight={AGGRID.HEADER_HEIGHT}
        // theme={themeBalham}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{
          handleRowSelect: onRowSelect, 
          onDelete: onDeleteQuotation,
          onDownloadQuotation: onDownloadQuotation,
          userHasAccessToUpdateCompanyQuotation,
          gridRef, 
        }}
         onCellClicked={(params) => {
          //Ignore clicks on Actions column
          if (params.colDef.field === "actions") return;
          //Call row select handler
          params.context.handleRowSelect?.(params.data);
        }}

        // onRowClicked={handleRowClick}

      />
    </div>
  );
}

export default CompanyQuotationManagementAgGrid;
