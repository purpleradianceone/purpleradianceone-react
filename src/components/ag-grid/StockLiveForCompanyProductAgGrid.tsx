/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  ActionTypeForStockMOdule,
  INNERHTML,
  JSX_CHILDREN_NAME,
} from "../../constants/AppConstants";
import { useEffect, useMemo, useRef, useState } from "react";
import LiveStockForCompanyProduct from "../../@types/stock/LiveStockForCompanyProduct";
import { CLASS_NAMES } from "../../constants/ClassNames";
import { Edit,  Plus,  ReceiptText } from "lucide-react";
import MESSAGE from "../../constants/Messages";
import toast from "react-hot-toast";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import { createPortal } from "react-dom";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";

const StockLiveForCompanyProductAgGrid = ({
  data,
  onRowSelect,
}: {
  data: LiveStockForCompanyProduct[];
  onRowSelect: (
    data: LiveStockForCompanyProduct,
    action: ActionTypeForStockMOdule
  ) => void;
}) => {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const { userHasAccessToUpdateStock } = useUserAccessModules();
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "companyProductName",
        headerName: "Product",
        sortable: true,
        filter: true,
        flex: 1.5,
        minWidth: 150,
      },
      {
        hide: true,
        field: "companyProductId",
        headerName: "companyProductId",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
      },
      {
        field: "quantityLive",
        headerName: "Quantity Live",
        sortable: true,
        filter: true,
      },
      {
        field: "quantityInward",
        headerName: "Quantity Inward",
        sortable: true,
        filter: true,
      },
      {
        field: "quantityOutward",
        headerName: "Quantity Outward",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 180,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      // NOTE : IT IS HIDDEN , NEW ACTIONS TAB IS USED i.e WIRTTEN BELOW
      {
        hide: true, 
        headerName: "Actions",
        field: "actions",

        pinned: "right",
        cellRenderer: (params: LiveStockForCompanyProduct | any) => {
          const handleClick = (action: ActionTypeForStockMOdule) => {
            params.context.handleRowSelect(params.data, action);
          };

          return (
            <div className="flex  items-center justify-center gap-1">
              <span
                className="lead-details cursor-pointer text-blue-600  "
                onClick={() => handleClick(ActionTypeForStockMOdule.DETAILS)}
              >
                Details
              </span>
              <span
                className="lead-details cursor-pointer text-blue-600  "
                onClick={() =>
                  handleClick(ActionTypeForStockMOdule.TRANSACTIONS)
                }
              >

                Transactions
              </span>
            </div>
          );
        },
      },
      {
        headerName: "Actions",
        sortable: false,
        maxWidth: 100,
        pinned: "right",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params :LiveStockForCompanyProduct | any) => {

           const handleClick = (action: ActionTypeForStockMOdule) => {
            params.context.handleRowSelect(params.data, action);
          };

          const [isActionsDropDownOpen, setIsActionsDropDownOpen] =
            useState(false);
          const [position, setPosition] = useState({
            top: 0,
            left: 0,
            isUpward: false,
          });
          const dropdownRef = useRef<HTMLDivElement | null>(null);

          const handleActionsButtonClick = (event: React.MouseEvent) => {
            event.stopPropagation();
            setIsActionsDropDownOpen((prev) => !prev);

            const rect = (
              event.currentTarget as HTMLButtonElement
            ).getBoundingClientRect();
            const dropdownHeight = 80; // Approximate height of dropdown
            const windowHeight = window.innerHeight;
            const spaceBelow = windowHeight - rect.bottom;
            const isUpward = spaceBelow < dropdownHeight;

            setPosition({
              top: isUpward
                ? rect.top + window.scrollY - dropdownHeight + 10 // Position above button
                : rect.bottom + window.scrollY - 10, // Position below button
              left: rect.left + window.scrollX - 25,
              isUpward,
            });
          };

          // Note : handle click outside
          useEffect(() => {
            const handleClickOutsideActionsDropDown = (event: MouseEvent) => {
              if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
              ) {
                setIsActionsDropDownOpen(false);
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
                    <>
                      <ActionsDropdownButton
                        disabled={!userHasAccessToUpdateStock}
                        onClick={() => {
                          if (userHasAccessToUpdateStock) {
                            setIsActionsDropDownOpen(false);
                            handleClick(ActionTypeForStockMOdule.DETAILS)
                          } else {
                            toast.error(
                              MESSAGE.MODULE_ACCESS.PRODUCT_MANAGEMENT
                                .DENIED_UPDATE_ACCESS
                            );
                          }
                        }}
                      >
                        <div>
                          <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />{" "}
                          {JSX_CHILDREN_NAME.DETAILS}
                        </div>
                      </ActionsDropdownButton>
                    </>

                    <>
                      <ActionsDropdownButton
                        disabled={!userHasAccessToUpdateStock}
                        onClick={() => {
                          if (userHasAccessToUpdateStock) {
                            setIsActionsDropDownOpen(false);
                            handleClick(ActionTypeForStockMOdule.TRANSACTIONS)
                          } else {
                            toast.error(
                              MESSAGE.MODULE_ACCESS.STOCK.DENIED_ADD_ACCESS
                            );
                          }
                        }}
                      >
                        <div className="">
                          <ReceiptText className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />
                          {JSX_CHILDREN_NAME.TRANSACRTIONS} 
                        </div>
                      </ActionsDropdownButton>
                    </>
                    <>
                      {/* {userHasAccessToUpdateProductTeam && ( */}
                      <>
                        <ActionsDropdownButton
                          disabled={!userHasAccessToUpdateStock}
                          onClick={() => {
                            if (userHasAccessToUpdateStock) {
                              setIsActionsDropDownOpen(false);
                              handleClick(ActionTypeForStockMOdule.CREATE_STOCK)
                            } else {
                              toast.error(
                                MESSAGE.MODULE_ACCESS.PRODUCT_TEAM_MANAGEMENT
                                  .DENIED_UPDATE_ACCESS
                              );
                            }
                          }}
                        >
                          <div>

                          <Plus
                            className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                            />
                          {JSX_CHILDREN_NAME.ADD_STOCK}
                            </div>
                        </ActionsDropdownButton>
                      </>
                    </>
                  </div>,
                  document.body // Render dropdown in body to avoid clipping
                )}
            </>
          );
        },
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      filter: "agTextColumnFilter",
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
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{ handleRowSelect: onRowSelect }}
        // onRowClicked={handleRowClick}
      />
    </div>
  );
};

export default StockLiveForCompanyProductAgGrid;
