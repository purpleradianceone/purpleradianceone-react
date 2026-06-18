/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import {  AGGRID, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import SupportTicketProps from "../../@types/support-ticket-management/SupportTicketProps";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import CompanyProductSaleManagementAgGridProps from "../../@types/ag-grid/CompanyProductSaleManagementAgGridProps";
import { productTypeStyles } from "../../utils/colourSpecifierForNameInAggrid";
import RenderUserWithIcon from "../ui/UserAgGridCellRenderer";
import { formatQuantityWithoutDecimal, } from "../../utils/helperMethods/formatFunctions";

function CompanyProductSaleAgGrid({
  companyProductSold,
  onRowSelect,
  handleRowClick,
  isUsedInCompanyProductSaleModule,
  isDataLoading,
}: CompanyProductSaleManagementAgGridProps) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: true,
        field: "id",
        headerName: "id",
        minWidth: 90,
      },
      {
        hide: true,
        field: "accountId",
        headerName: "Account id",
        minWidth: 130,
      },

      {
        field: "accountName",
        headerName: "Sold To",
        sortable: true,
        filter: true,
         cellStyle: () => ({
          fontSize: "14px",
          fontWeight: 600,
          color: "#1f2937",
        }),
      },
      {
        hide: true,
        field: "companyProductId",
        headerName: "Company Product Id",
        minWidth: 120,
      },

      {
        field: "companyProductName",
        headerName: "Product Name",
        sortable: true,
        filter: true,
      },

      {
        field: "productTypeName",
        headerName: "Product Type",
        sortable: true,
        filter: true,
        minWidth: 130,

        cellRenderer: (params: any) => {
                  if (params.data?.__isSkeleton) {
                    return <SkeletonRowsAgGrid />;
                  }
                const type = params.value || "-";
                  return (
                  <div className="flex items-center h-full">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        productTypeStyles[type] ||
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {type}
                    </span>
                  </div>
                );
                },
      },

      {
        field: "quantity",
        headerName: "Quantity",
        sortable: true,
        filter: true,
        // maxWidth:100,
        width:90,
        minWidth:100,
      },

      {
            field: "totalCost",
            headerName: "Total Cost",
            sortable: true,
            filter: true,
            width: 100,
            minWidth: 110,
                    cellRenderer: (params: any) => {
            if (params.data?.__isSkeleton) {
              return <SkeletonRowsAgGrid />;
            }

            return `₹ ${formatQuantityWithoutDecimal(params.value)}`;
            },
      },

      {
        field: "serialNumber",
        headerName: "Serial Number",
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
        headerName: "Updated by",
        sortable: true,
        filter: true,
        minWidth: 120,
        cellRenderer: RenderUserWithIcon,
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
        filter: false,
        // minWidth:80,
        // autoHeight: true,
        // suppressSizeToFit: true,
        cellRenderer: (params: SupportTicketProps | any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          return (
            <div className="flex items-center justify-center  ">
              <span
                className="lead-details cursor-pointer text-blue-600  "
                onClick={() => {
                  params.context.handleRowSelect(params.data);
                }}
              >
                {isUsedInCompanyProductSaleModule ? "Details" : "Select"}
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        );
      },
    }),
    [],
  );

  const skeletonRows = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      __isSkeleton: true,
    }));
  }, []);

  return (
    <div
      className="w-full modern-user-grid custom-height-scrollbar"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef} // Attach the ref
        rowData={isDataLoading ? skeletonRows : companyProductSold}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        rowHeight={AGGRID.ROW_HEIGHT}
        headerHeight={AGGRID.HEADER_HEIGHT}
        // theme={themeBalham}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{ handleRowSelect: onRowSelect }}
        onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default CompanyProductSaleAgGrid;
