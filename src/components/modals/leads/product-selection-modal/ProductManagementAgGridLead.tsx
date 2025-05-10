/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo, useState } from "react";
import {
  AllCommunityModule,
  ColDef,
  ICellRendererParams,
  themeBalham,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { CheckCircle2, XCircle } from "lucide-react";
import { INNERHTML } from "../../../../constants/AppConstants"; // Adjust the path if needed
import LeadProductsManagementGridProps from "../../../../@types/ag-grid/LeadProductsManagementGridProps"; // Adjust the path if needed
import { Product } from "../../../../@types/products/ProductsManagementProps"; // Adjust the path if needed

export interface LeadProductsManagementGridState extends Product {
  expectedCost: number;
  requiredQuantity: number;
  interest: string;
}
const ProductsManagementGridLead: React.FC<LeadProductsManagementGridProps> = ({
  products,
  interestTypeData,
  handleProductCheckboxChange,
  preservedSelectedProductIdArray,
}) => {
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: true,
        field: "id",
        headerName: "id",
      },
      {
        field: "Action",
        headerName: "Action",
        pinned: "left",
        sortable: false,
        filter: false,
        width: 60,
        maxWidth: 60,
        cellRenderer: (params: any) => {
          const isChecked = preservedSelectedProductIdArray
            ? preservedSelectedProductIdArray.includes(params.data.id)
            : false;
          return (
            <input
              type="checkbox"
              onChange={(event) => {
                handleProductCheckboxChange!(params.data, event);
              }}
              checked={isChecked}
              className="cursor-pointer accent-blue-500"
            />
          );
        },
      },
      {
        field: "interest",
        headerName: "Interest",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values:
            Array.isArray(interestTypeData) &&
            interestTypeData.map((item) => JSON.stringify(item)), // Store full object as string
        },
        flex: 1,
        valueFormatter: (params) => {
          try {
            const interest =
              typeof params.value === "string"
                ? JSON.parse(params.value)
                : params.value;
            return interest?.name;
          } catch {
            return "Select Interest";
          }
        },
        valueParser: (params) => {
          try {
            const parsed = JSON.parse(params.newValue);
            return parsed.id; // return ID to store
          } catch {
            return null;
          }
        },
      },
      {
        field: "requiredQuantity",
        headerName: "Req. Quantity",
        flex: 1,
        cellRenderer: (params: ICellRendererParams) => {
          const [value, setValue] = useState(params.value ?? "");

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) {
              setValue(val);
              params.node.setDataValue(
                "requiredQuantity",
                val === "" ? "" : Number(val)
              );
            }
          };

          return (
            <input
              type="text"
              value={value}
              onChange={handleChange}
              className="w-full h-6 border border-gray-300 rounded px-1"
              inputMode="numeric"
              pattern="\d*"
            />
          );
        },
      },
      // {
      //   field: "requiredQuantity",
      //   headerName: "Req. Quantity",
      //   flex: 1,
      //   cellRenderer: (params: ICellRendererParams) => {
      //     return (
      //       <input
      //         type="number"
      //         value={params.value}
      //         onChange={(e) => {
      //           params.node.setDataValue(
      //             "requiredQuantity",
      //             Number(e.target.value)
      //           );
      //         }}
      //         className="w-full h-6 border border-gray-300 rounded"
      //       />
      //     );
      //   },
      // },
      // {
      //   hide:true,
      //   field: "expectedCost",
      //   headerName: "Expected Cost",
      //   flex: 1,
      //   cellRenderer: (params: ICellRendererParams) => {
      //     return (
      //       <input
      //         type="number"
      //         value={params.value}
      //         onChange={(e) => {
      //           params.node.setDataValue(
      //             "expectedCost",
      //             Number(e.target.value)
      //           );
      //         }}
      //         className="w-full h-6 border border-gray-300 rounded"
      //       />
      //     );
      //   },
      // },
      {
        field: "expectedCost",
        headerName: "Expected Cost",
        flex: 1,
        cellRenderer: (params: ICellRendererParams) => {
           const [value, setValue] = useState(params.value ?? "");
          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            // Allow only valid decimal numbers (optional leading digits, one dot, optional decimal)
            if (/^\d*\.?\d*$/.test(val)) {
              setValue(val)
              params.node.setDataValue(
                "expectedCost",
                val === "" ? "" : Number(val)
              );
            }
          };

          return (
            <input
              type="text"
              value={value}
              onChange={handleChange}
              className="w-full h-6 border border-gray-300 rounded px-1"
              inputMode="decimal"
              pattern="\d*"
            />
          );
        },
      },
      {
        field: "name",
        headerName: "Product Name",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        tooltipValueGetter: (params) => params.data?.description || "",
        comparator: (valueA, valueB) => {
          if (!valueA) return -1;
          if (!valueB) return 1;
          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        },
      },
      {
        field: "code",
        headerName: "Item Code",
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        field: "cost",
        headerName: "Basic Cost",
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        hide: true,
        field: "description",
        headerName: "Description",
        sortable: true,
        filter: true,
        flex: 1.5,
        tooltipValueGetter(params) {
          return params.data.description;
        },
      },
      {
        hide: true,
        field: "isActive",
        headerName: "Active",
        sortable: true,
        filter: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: ICellRendererParams<Product>) => {
          return (
            <div className="flex items-center gap-1 mt-1">
              {params.value ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Active</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Inactive</span>
                </>
              )}
            </div>
          );
        },
      },
      {
        field: "hsn",
        headerName: "HSN",
        sortable: true,
        filter: true,
        flex: 1,
        hide: true,
      },
      {
        field: "sac",
        headerName: "SAC",
        sortable: true,
        filter: true,
        flex: 1,
        hide: true,
      },
      {
        field: "taxRate",
        headerName: "TAX Rate",
        sortable: true,
        filter: true,
        flex: 1,
        hide: true,
        valueFormatter: (params) => {
          if (params.value === 0) {
            return ""; // Return an empty string if the value is 0
          }
          return params.value; // Otherwise, return the original value
        },
      },
      {
        field: "validFrom",
        headerName: "Effective From",
        sortable: true,
        filter: true,
        flex: 1,
        hide: true,
      },

      {
        hide: true,
        field: "createdBy",
        headerName: "Created By",
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        hide: true,
        field: "createdOn",
        headerName: "Created On",
        sortable: true,
        filter: true,
        flex: 1,
      },
    ],
    [preservedSelectedProductIdArray]
  );

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      // minWidth: 150,
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
        rowData={products}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham}
        rowSelection="multiple"
        singleClickEdit={true}
      />
    </div>
  );
};

export default ProductsManagementGridLead;
