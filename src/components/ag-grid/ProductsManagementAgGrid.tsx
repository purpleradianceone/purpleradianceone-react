/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BOOLEAN_VALUES, JSX_CHILDREN_NAME, NUMBER_VALUES } from "../../constants/AppConstants";
import { CLASS_NAMES } from "../../constants/ClassNames";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import { Products } from "../../@types/products/ProductsManagementProps";
import { Edit } from "lucide-react";


function ProductsManagementGrid({
    products,
}  : Products) {


    const columnDefs = useMemo<ColDef[]>(
        () => [
          {
            field: "productName",
            headerName: "Product Name",
            sortable: BOOLEAN_VALUES.TRUE,
            filter: "agTextColumnFilter",
            flex: NUMBER_VALUES.ONE,

            
            comparator: (valueA, valueB) => {
              if (!valueA) return NUMBER_VALUES.MINUS_ONE;
              if (!valueB) return NUMBER_VALUES.ONE;
              return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
            },
          },
          {
            field: "itemCode",
            headerName: "Item Code",
            sortable: BOOLEAN_VALUES.TRUE,
            filter: BOOLEAN_VALUES.TRUE,
            flex: NUMBER_VALUES.ONE,
          },
          {
            field: "price",
            headerName: "price",
            sortable: BOOLEAN_VALUES.TRUE,
            filter: BOOLEAN_VALUES.TRUE,
            flex: NUMBER_VALUES.ONE,
          },
          {
            field: "description",
            headerName: "Description",
            sortable: BOOLEAN_VALUES.TRUE,
            filter: BOOLEAN_VALUES.TRUE,
            flex:NUMBER_VALUES.ONEANDHALF,
            tooltipValueGetter(params) {
              return params.data.description
            },

          },
          {
            field : "HSN" ,
            headerName : "HSN",
            sortable : BOOLEAN_VALUES.TRUE ,
            filter : BOOLEAN_VALUES.TRUE ,
            flex : NUMBER_VALUES.ONE ,
          },
          {
            field: "SAC",
            headerName: "SAC",
            sortable: BOOLEAN_VALUES.TRUE,
            filter: BOOLEAN_VALUES.TRUE,
            flex: NUMBER_VALUES.ONE,
          },
          {
            headerName: "Actions",
            sortable: BOOLEAN_VALUES.FALSE,
            maxWidth: NUMBER_VALUES.HUNDRED,
            pinned: "right",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
            cellRenderer: (params: any) => {
              const [isActionsDropDownOpen, setIsActionsDropDownOpen] =
                useState(BOOLEAN_VALUES.FALSE);
              const [position, setPosition] = useState({ top: NUMBER_VALUES.ZERO, left: NUMBER_VALUES.ZERO });
              const dropdownRef = useRef<HTMLDivElement | null>(null);
    
              const handleActionsButtonClick = (event: React.MouseEvent) => {
                event.stopPropagation();
                setIsActionsDropDownOpen((prev) => !prev);
    
                const rect = event.currentTarget.getBoundingClientRect();
                setPosition({
                  top: rect.bottom + window.scrollY - NUMBER_VALUES.TEN, // Position below button
                  left: rect.left + window.scrollX - NUMBER_VALUES.TWENTY_FIVE, // Align with button
                });
              };
    
              useEffect(() => {
                const handleClickOutsideActionsDropDown = (event: MouseEvent) => {
                  if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(event.target as Node)
                  ) {
                    setIsActionsDropDownOpen(BOOLEAN_VALUES.FALSE);
                  }
                };
    
                document.addEventListener(
                  "mousedown",
                  handleClickOutsideActionsDropDown
                );
                return () =>
                  document.removeEventListener(
                    "mousedown",
                    handleClickOutsideActionsDropDown
                  );
              }, []);
    
              return (
                <>
                  <button
                    className="text-blue-600"
                    onClick={handleActionsButtonClick}
                  >
                    {JSX_CHILDREN_NAME.ACTIONS}
                  </button>
    
                  {isActionsDropDownOpen &&
                    createPortal(
                      <div
                        ref={dropdownRef}
                        className="absolute bg-white border rounded-md shadow-lg w-24 ml-2 z-50"
                        style={{ top: position.top, left: position.left }}
                      >
                              <ActionsDropdownButton
                                onClick={() => {
                                  setIsActionsDropDownOpen(BOOLEAN_VALUES.FALSE);
                                }}
                              >
                                <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} /> {JSX_CHILDREN_NAME.EDIT}
                              </ActionsDropdownButton>
                              </div>,
                      document.body // Render dropdown in body to avoid clipping
                    )}
                </>
              );
            },
          },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
      );

      const defaultColDef = useMemo(() => {
        return {
          filter: "agTextColumnFilter",
          minWidth: 150,
          flex: 0.8,
          suppressHeaderMenuButton: BOOLEAN_VALUES.TRUE,
          suppressHeaderContextMenu: BOOLEAN_VALUES.TRUE,
        };
      }, []);

    return(
        <div
                      className="ag-theme-alpine w-full"
                      style={{ height: "460px", width: "100%" }}
                    >
                      <AgGridReact
                        rowData={products}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        modules={[AllCommunityModule]}
                      />
                    </div>
    )
}

export default ProductsManagementGrid;