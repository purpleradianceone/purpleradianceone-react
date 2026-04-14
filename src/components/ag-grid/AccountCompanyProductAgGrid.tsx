/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useRef } from "react";
import { INNERHTML } from "../../constants/AppConstants";
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import AccountProduct from "../../@types/account/AccountProduct";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";

import COLORS from "../../constants/Colors";
import Button from "../ui/Button";
const AccountCompanyProductAgGrid = ({
  accountProductData,
  onRowSelect, //selected user for view lead details
  // handleRowClick,
  handleAddToInvoice,
  isUsedForSelection,
}: {
  accountProductData: AccountProduct[];
  onRowSelect: (data: AccountProduct) => void;
  isUsedForSelection?: boolean;
  handleAddToInvoice?: (data: AccountProduct) => void;
  handleRowClick?: (event: any) => void;
}) => {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const { userHasAccessToViewAccountProducts } = useUserAccessModules();
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "companyProductName",
        headerName: "Product",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "accountId",
        headerName: "Account ID",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "companyProductId",
        headerName: "Company Product ID",
        sortable: true,
        filter: true,
      },
      {
        field: "quantity",
        headerName: "Quantity",
        sortable: true,
        filter: true,
      },
      {
        field: "quantityReturn",
        headerName: "Quantity Return",
        sortable: true,
        filter: true,
      },
      {
        field: "barcode",
        headerName: "barcode",
        sortable: true,
        filter: true,
      },
      {
        field: "serialNumber",
        headerName: "Serial Number",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "unitName",
        headerName: "Unit",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "unitNameInStock",
        headerName: "Unit In Stock",
        sortable: true,
        filter: true,
      },
      {
        field: "purchaseDate",
        headerName: "Purchase Date",
        sortable: true,
        filter: true,
      },
      {
        field: "isAddedToInvoiceDraft",
        headerName: "InvoiceStatus",
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const isAdded = params.value;

          return (
            <div className="flex ">
              {isAdded ? (
                <span className="text-green-600 font-medium">
                  Added to Invoice
                </span>
              ) : (
                <Button
                  type="button"
                  className={COLORS.ADD_BUTTON}
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ prevent row click
                    params.context.handleAddToInvoice(params.data);
                  }}
                >
                  Add to Invoice
                </Button>
              )}
            </div>
          );
        },
      },
      {
        field: "installedByName",
        headerName: "Installed By",
        sortable: true,
        filter: true,
      },
      {
        field: "installationDate",
        headerName: "Installation Date",
        sortable: true,
        filter: true,
      },
      {
        field: "deliveryDate",
        headerName: "Delivery Date",
        sortable: true,
        filter: true,
      },
      {
        field: "deliveryAddress",
        headerName: "Delivery Address",
        sortable: true,
        filter: true,
      },
      {
        field: "billingAddress",
        headerName: "Billing Address",
        sortable: true,
        filter: true,
      },

      {
        hide: true,
        field: "installedBy",
        headerName: "Installed By",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "warrantyIntervalTypeId",
        headerName: "Warranty Interval Type ID",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "warranty",
        headerName: "Warranty",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "warrantyIntervalName",
        headerName: "Warranty",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "warrantyStartDate",
        headerName: "Warranty Start Date",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "warrantyEndDate",
        headerName: "Warranty End Date",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "warrantyTerms",
        headerName: "Warranty Terms",
        sortable: true,
        filter: true,
      },

      {
        hide: true,
        field: "amcIntervalName",
        headerName: "AMC",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "amcCycleIntervalTypeId",
        headerName: "AMC Cycle Interval Type ID",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "amcCycle",
        headerName: "AMC Cycle",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "amcCycleStartDate",
        headerName: "AMC Cycle Start Date",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "amcCycleEndDate",
        headerName: "AMC Cycle End Date",
        sortable: true,
        filter: true,
      },
      {
        field: "id",
        hide: true,
        headerName: "ID",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        field: "accountName",
        headerName: "Account Name",
        sortable: true,
        filter: true,
      },

      {
        field: "updatedBy",
        headerName: "Updated By",
        sortable: true,
        filter: true,
      },
      {
        field: "createdOn",
        headerName: "Created On",
        sortable: true,
        filter: true,
      },
      {
        field: "updatedOn",
        headerName: "Updated On",
        sortable: true,
        filter: true,
      },
      {
        field: "createdBy",
        headerName: "Created By",
        sortable: true,
        filter: true,
      },

      // {
      //   headerName: "Actions",
      //   field: "view",
      //   pinned: "right",
      //   maxWidth: 80,
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   cellRenderer: (params: AccountProduct | any) => {
      //     return (
      //       <div className="flex items-center justify-center  ">
      //         <button
      //           className="lead-details cursor-pointer text-blue-600  "
      //           onClick={(e) => {
      //             e.preventDefault();
      //             e.stopPropagation()
      //             params.context.handleRowSelect(params.data);
      //           }}
      //         >
      //           {isUsedForSelection ? "Select" : "Details"}{" "}
      //         </button>
      //       </div>
      //     );
      //   },
      // },

      {
        headerName: "Actions",
        field: "view",
        pinned: "right",
        maxWidth: 80,
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center justify-center">
              <button
                disabled={
                  !isUsedForSelection && !userHasAccessToViewAccountProducts
                }
                className="lead-details cursor-pointer text-blue-600"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); //  THIS IS THE FIX
                  params.context.handleRowSelect(params.data);
                }}
              >
                {isUsedForSelection ? "Select" : "Details"}
              </button>
            </div>
          );
        },
      },

      // {
      //   headerName: "Actions",
      //   sortable: false,
      //   maxWidth: 100,
      //   pinned: "right",
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   cellRenderer: (params: any) => {
      //     const [isActionsDropDownOpen, setIsActionsDropDownOpen] =
      //       useState(false);
      //     const [position, setPosition] = useState({
      //       top: 0,
      //       left: 0,
      //       isUpward: false,
      //     });
      //     const dropdownRef = useRef<HTMLDivElement | null>(null);

      //     const handleActionsButtonClick = (event: React.MouseEvent) => {
      //       event.stopPropagation();
      //       setIsActionsDropDownOpen((prev) => !prev);

      //       const rect = (
      //         event.currentTarget as HTMLButtonElement
      //       ).getBoundingClientRect();
      //       const dropdownHeight = 80; // Approximate height of dropdown
      //       const windowHeight = window.innerHeight;
      //       const spaceBelow = windowHeight - rect.bottom;
      //       const isUpward = spaceBelow < dropdownHeight;

      //       setPosition({
      //         top: isUpward
      //           ? rect.top + window.scrollY - dropdownHeight + 10 // Position above button
      //           : rect.bottom + window.scrollY - 10, // Position below button
      //         left: rect.left + window.scrollX - 25,
      //         isUpward,
      //       });
      //     };

      //     useEffect(() => {
      //       const handleClickOutsideActionsDropDown = (event: MouseEvent) => {
      //         if (
      //           dropdownRef.current &&
      //           !dropdownRef.current.contains(event.target as Node)
      //         ) {
      //           setIsActionsDropDownOpen(false);
      //         }
      //       };

      //       document.addEventListener(
      //         "mousedown",
      //         handleClickOutsideActionsDropDown
      //       );
      //       return () =>
      //         document.removeEventListener(
      //           "mousedown",
      //           handleClickOutsideActionsDropDown
      //         );
      //     }, []);

      //     return (
      //       <>
      //         <button
      //           className="text-blue-600"
      //           onClick={handleActionsButtonClick}
      //         >
      //           {JSX_CHILDREN_NAME.ACTIONS}
      //         </button>

      //         {isActionsDropDownOpen &&
      //           createPortal(
      //             <div
      //               ref={dropdownRef}
      //               className="absolute bg-white border rounded-md shadow-lg w-24 ml-2 z-50"
      //               style={{ top: position.top, left: position.left }}
      //             >
      //               <ActionsDropdownButton
      //                 disabled={!userHasAccessToUpdateProduct}
      //                 onClick={() => {
      //                   if (userHasAccessToUpdateProduct) {
      //                     setIsActionsDropDownOpen(false);
      //                     handleViewAccountCompanyProductDetailsModalOpen(
      //                       params.data,
      //                       true
      //                     );
      //                   } else {
      //                     toast.error(
      //                       MESSAGE.MODULE_ACCESS.PRODUCT_MANAGEMENT
      //                         .DENIED_UPDATE_ACCESS
      //                     );
      //                   }
      //                 }}
      //               >
      //                 <div>
      //                   <ReceiptText
      //                     className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
      //                   />{" "}
      //                   Details
      //                 </div>
      //               </ActionsDropdownButton>
      //               <ActionsDropdownButton
      //                 disabled={!userHasAccessToUpdateProduct}
      //                 onClick={() => {
      //                   if (userHasAccessToUpdateProduct) {
      //                     setIsActionsDropDownOpen(false);
      //                     handleViewAccountCompanyProductAMC(
      //                       params.data,
      //                       true
      //                     );
      //                   } else {
      //                     toast.error(
      //                       MESSAGE.MODULE_ACCESS.PRODUCT_MANAGEMENT
      //                         .DENIED_UPDATE_ACCESS
      //                     );
      //                   }
      //                 }}
      //               >
      //                 <div>
      //                   <ReceiptText
      //                     className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
      //                   />{" "}
      //                   AMC
      //                 </div>
      //               </ActionsDropdownButton>
      //             </div>,
      //             document.body // Render dropdown in body to avoid clipping
      //           )}
      //       </>
      //     );
      //   },
      // },
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
        ref={gridRef} // Attach the ref
        rowData={accountProductData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{
          handleRowSelect: onRowSelect,
          handleAddToInvoice: handleAddToInvoice,
        }}
        // onRowClicked={handleRowClick}
      />
    </div>
  );
};

export default AccountCompanyProductAgGrid;
