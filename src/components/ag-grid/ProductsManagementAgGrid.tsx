/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef, themeAlpine } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  BOOLEAN_VALUES,
  INNERHTML,
  JSX_CHILDREN_NAME,
  NUMBER_VALUES,
} from "../../constants/AppConstants";
import { CLASS_NAMES } from "../../constants/ClassNames";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import { Product } from "../../@types/products/ProductsManagementProps";
import { CheckCircle2, ClipboardPlus, Edit, XCircle } from "lucide-react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import Button from "../ui/Button";

function ProductsManagementGrid({
  products,
  handleEditCompanyProductModalOpen,
  handleSelectedProductChange,
}: {
  products: Product[];
  handleEditCompanyProductModalOpen: (status: boolean) => void;
  handleSelectedProductChange: (product: Product) => void;
}) {
  const {
    userHasAccessToViewProductTax,
    userHasAccessToAddProductTax,
    userHasAccessToUpdateProduct,
  } = useUserAccessModules();

  useEffect(() => {
    
    console.log("Products In AGGRID")
    console.log(products);
  })

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "name",
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
        field: "code",
        headerName: "Item Code",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONE,
      },
      {
        field: "cost",
        headerName: "Basic Cost",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONE,
      },
      {
        field: "description",
        headerName: "Description",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONEANDHALF,
        tooltipValueGetter(params) {
          return params.data.description;
        },
      },
      {
        field : "isActive",
        headerName: "Active",
        sortable: BOOLEAN_VALUES.TRUE,
        filter :  BOOLEAN_VALUES.TRUE,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center gap-1 mt-3">
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
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONE,
        hide: !userHasAccessToViewProductTax,
      },
      {
        field: "sac",
        headerName: "SAC",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONE,
        hide: !userHasAccessToViewProductTax,
      },
      {
        field: "taxRate",
        headerName: "TAX Rate",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONE,
        hide: !userHasAccessToViewProductTax,
        valueFormatter: (params) => {
          if (params.value === NUMBER_VALUES.ZERO) {
            return ""; // Return an empty string if the value is 0
          }
          return params.value; // Otherwise, return the original value
        },
      },
      {
        field: "validFrom",
        headerName: "Effective From",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONE,
        hide: !userHasAccessToViewProductTax,
      },

      {
        field: "createdBy",
        headerName: "Created By",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONE,
      },
      {
        field: "createdOn",
        headerName: "Created On",
        sortable: BOOLEAN_VALUES.TRUE,
        filter: BOOLEAN_VALUES.TRUE,
        flex: NUMBER_VALUES.ONE,
      },
      {
        headerName: "Actions",
        sortable: BOOLEAN_VALUES.FALSE,
        maxWidth: NUMBER_VALUES.HUNDRED,
        pinned: "right",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
          const [isActionsDropDownOpen, setIsActionsDropDownOpen] = useState(
            BOOLEAN_VALUES.FALSE
          );
          const [position, setPosition] = useState({
            top: NUMBER_VALUES.ZERO,
            left: NUMBER_VALUES.ZERO,
            isUpward : BOOLEAN_VALUES.FALSE,
          });
          const dropdownRef = useRef<HTMLDivElement | null>(null);

          const handleActionsButtonClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            setIsActionsDropDownOpen((prev) => !prev);

            const rect = (event.currentTarget as HTMLButtonElement).getBoundingClientRect();
            const dropdownHeight = 80; // Approximate height of dropdown
            const windowHeight = window.innerHeight;
            const spaceBelow = windowHeight - rect.bottom;
            const isUpward = spaceBelow < dropdownHeight;
        
            setPosition({
              top: isUpward 
                ? rect.top + window.scrollY - dropdownHeight + 10 // Position above button
                : rect.bottom + window.scrollY - 10, // Position below button
              left: rect.left + window.scrollX - 25,
              isUpward
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
                    {userHasAccessToUpdateProduct && (
                      <ActionsDropdownButton
                        onClick={() => {
                          setIsActionsDropDownOpen(BOOLEAN_VALUES.FALSE);
                          handleEditCompanyProductModalOpen(
                            BOOLEAN_VALUES.TRUE
                          );
                          console.log("selected Product");
                          console.log(params.data)
                          handleSelectedProductChange(params.data);
                        }}
                      >
                        <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />{" "}
                        {JSX_CHILDREN_NAME.EDIT}
                      </ActionsDropdownButton>
                    )}
                    

                    {!userHasAccessToUpdateProduct && 
                    <Button
                    disabled
                    className={CLASS_NAMES.DISABLED_BUTTON}
                    >
                      <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />{" "}
                      {JSX_CHILDREN_NAME.EDIT}
                    </Button>
                    }

                    {!userHasAccessToAddProductTax && 
                    <Button
                    disabled
                    className={CLASS_NAMES.DISABLED_BUTTON}
                    >
                      <ClipboardPlus
                          className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                        />{" "}
                        {JSX_CHILDREN_NAME.TAX}
                    </Button>
                    }
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


  return (
    <div
      className="ag-theme-alpine w-full"
      style={{ height: "440px", width: "100%" }}
    >
      <AgGridReact
        rowData={products}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        overlayNoRowsTemplate = {INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeAlpine}
      />
    </div>
  );
}

export default ProductsManagementGrid;
