/* eslint-disable react-hooks/rules-of-hooks */

import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  AllCommunityModule,
  ColDef,
  ICellRendererParams,
  themeBalham,
  GridApi,
    GridReadyEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { CheckCircle2, XCircle } from "lucide-react";
import LeadProductsManagementGridProps from "../../../../@types/ag-grid/LeadProductsManagementGridProps";
import { Product } from "../../../../@types/products/ProductsManagementProps";
import toast from "react-hot-toast";

const ProductsManagementGridLead: React.FC<LeadProductsManagementGridProps> = ({
  products,
  interestTypeData,
  handleProductCheckboxChange,
  alreadyAssignedCompanyProduct = [],
}) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [rowData, setRowData] = useState<Product[]>(products); // State for row data
  const gridRef = useRef<AgGridReact>(null);

  // Update rowData when products prop changes
  useEffect(() => {
    setRowData(products);
  }, [products]);

  
  const actionCellRenderer = useCallback(
    (params: ICellRendererParams) => {
      const currentId = params.data.id;
      const alreadyAssignedIds =
        alreadyAssignedCompanyProduct?.map((p) => p.companyProductId) || [];

      const isAlreadyAssigned = alreadyAssignedIds.includes(currentId);
      // const isInterestFilled =
      //   params.data.interest != null && params.data.interest !== "";
      const isQtyFilled =
        params.data.requiredQuantity != null &&
        params.data.requiredQuantity !== "";
      const isCostFilled =
        params.data.expectedCost != null && params.data.expectedCost !== "";

      // const allFieldsFilled = isInterestFilled && isQtyFilled && isCostFilled;
      const allFieldsFilled =   isQtyFilled && isCostFilled;

      const isBlocked = !allFieldsFilled && !isAlreadyAssigned;
      const isChecked = isAlreadyAssigned || params.data.checked;
      const title = isAlreadyAssigned
        ? "Already Assigned to Lead"
        : isBlocked
        ? "Please fill Required Quantity and Expected Cost."
        : "";
      const handleShowToaster = () =>{
        if(isBlocked){
          toast.error("Please fill Required Quantity and Expected Cost.");
        }
  }
      const handleCheckboxChangeLocal = (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        if (isBlocked || isAlreadyAssigned) {
          event.preventDefault();
          return;
        }
        if (handleProductCheckboxChange) {
          handleProductCheckboxChange(params.data, event);
        }

         if (gridApi) {
                    // Safely access params.node.id
                    const rowNodeId = params.node.id;
                    if (rowNodeId) {
                        const rowNode = params.api.getRowNode(rowNodeId);
                        if (rowNode) {
                            // Directly update the data in the grid
                            rowNode.setDataValue("checked", event.target.checked);
                            // No need to update the entire rowData state here.  Ag-Grid knows about the change.
                            params.data.checked = event.target.checked; // Keep data in cellRenderer consistent
                            params.api.refreshCells({
                                rowNodes: [rowNode],
                                columns: ["Action"],
                                force: true,
                            });
                        }
                    }
                }
      };

      return (
        <div className="flex items-center justify-center mt-1" title={title} onClick={handleShowToaster}>
          <input
            type="checkbox"
            onChange={handleCheckboxChangeLocal}
            checked={isChecked}
            disabled={isChecked && isAlreadyAssigned }
            className={`accent-blue-500 ${
              isBlocked || isAlreadyAssigned
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          />
        </div>
      );
    },
    [alreadyAssignedCompanyProduct, handleProductCheckboxChange, gridApi]
  );

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
        cellRenderer: actionCellRenderer,
      },
      {
        field: "interest",
        headerName: "Interest",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values:
            Array.isArray(interestTypeData) &&
            interestTypeData.map((item) => item.id),
        },
        flex: 1,
        
        valueGetter : (params ) =>{
          return params.data.interest  ?? 2;
        },
        valueFormatter: (params) => {
          if (params.value == null || params.value === "")
            return "Select Interest";
          const interestObj = interestTypeData.find(
            (i) => i.id === params.value
          );
          return interestObj ? interestObj.name : "Unknown Interest";
        },
        valueParser: (params) => {
          const selectedId = params.newValue;
          return selectedId;
        },
      },
      {
        field: "requiredQuantity",
        headerName: "Req. Quantity",
        flex: 1,
        cellRenderer: (params: ICellRendererParams) => {
          const [value, setValue] = useState<string | number>(
            params.value ?? ""
          );

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) {
              setValue(val);
              const numValue = val === "" ? null : Number(val);

              // Update the row data directly in the grid.
              if (gridApi) {
                const rowNodeId = params.node.id;
                if (rowNodeId) {
                  const rowNode = params.api.getRowNode(rowNodeId);
                  if (rowNode) {
                    rowNode.setDataValue("requiredQuantity", numValue);
                  }
                }
              }
              params.node.setDataValue("requiredQuantity", numValue);

              params.api.refreshCells({
                rowNodes: [params.node],
                columns: ["Action"],
                force: true,
              });
            }
          };

          return (
            <input
              type="text"
              value={value}
              onChange={handleChange}
              className="w-full h-6 border cursor-pointer border-gray-300 rounded px-1"
              inputMode="numeric"
              pattern="\d*"
            />
          );
        },
      },
      {
        field: "expectedCost",
        headerName: "Expected Cost",
        flex: 1,
        cellRenderer: (params: ICellRendererParams) => {
          const [value, setValue] = useState<string | number>(
            params.value ?? ""
          );
          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            if (/^\d*\.?\d*$/.test(val)) {
              setValue(val);
              const numValue = val === "" ? null : Number(val);

              // Update the row data directly in the grid.
              if (gridApi) {
                const rowNodeId = params.node.id;
                if (rowNodeId) {
                  const rowNode = params.api.getRowNode(rowNodeId);
                  if (rowNode) {
                    rowNode.setDataValue("expectedCost", numValue);
                  }
                }
              }
              params.node.setDataValue("expectedCost", numValue);

              params.api.refreshCells({
                rowNodes: [params.node],
                columns: ["Action"],
                force: true,
              });
            }
          };

          return (
            <input
              type="text"
              value={value}
              onChange={handleChange}
              className="w-full h-6 border cursor-pointer border-gray-300 rounded px-1"
              inputMode="decimal"
              pattern="\d*\.?\d*"
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
        hide: false,
        field: "isActive",
        headerName: "Active",
        sortable: true,
        filter: true,
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
            return "";
          }
          return params.value;
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
    [interestTypeData, alreadyAssignedCompanyProduct, actionCellRenderer]
  );

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  useEffect(() => {
    if (gridApi) {
      const initialRowData = products.map((product) => ({
        ...product,
        checked: alreadyAssignedCompanyProduct.some(
          (p) => p.companyProductId === product.id
        ),
      }));
      setRowData(initialRowData);
    }
  }, [gridApi, products, alreadyAssignedCompanyProduct]);

  return (
    <div
      className="ag-theme-balham w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        overlayNoRowsTemplate={`<span>No Products Available</span>`}
        theme={themeBalham}
        rowSelection="multiple"
        singleClickEdit={true}
        onCellValueChanged={(params) => {
          if (["interest"].includes(params.colDef.field!)) {
            params.api.refreshCells({
              rowNodes: [params.node],
              columns: ["Action"],
              force: true,
            });
          }
        }}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default ProductsManagementGridLead;
