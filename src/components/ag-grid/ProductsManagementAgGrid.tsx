/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {  INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import { CLASS_NAMES } from "../../constants/ClassNames";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import { Edit, Network, Plus, UserPlus } from "lucide-react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import ProductsManagementGridProps from "../../@types/ag-grid/ProductsManagementGridProps";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";
import StatusIndicator from "../ui/StatusIndicator";
import { Product } from "../../@types/products/ProductsManagementProps";

function ProductsManagementGrid({
  products,
  handleEditCompanyProductModalOpen,
  handleSelectedProductChange,
  // isGridForProductUser,
  handleCompanyProductUserModalOpen,
  handleCompanyProductTeamModalOpen,
  isGridForAccountProduct,
  onRowSelect, //selected user for view lead details
  handleCreateStockModalOpen,
}: ProductsManagementGridProps) {
  const {
    userHasAccessToViewProduct,
    userHasAccessToViewProductTax,
    userHasAccessToUpdateProduct,
    userHasAccessToUpdateProductTeam,
  } = useUserAccessModules();

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "name",
        headerName: "Product Name",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        tooltipValueGetter(params) {
          return params.data.name;
        },

        comparator: (valueA, valueB) => {
          if (!valueA) return -1;
          if (!valueB) return 1;
          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        },
      },
      {
        field: "barcode",
        headerName: "Barcode",
        sortable: true,
        maxWidth: 130,
        filter: true,
        flex: 1,
        hide: isGridForAccountProduct
      },
      {
        field: "cost",
        headerName: "Basic Cost",
        sortable: true,
        maxWidth: 130,
        filter: true,
        flex: 1,
        hide: isGridForAccountProduct
      },

      {
        field: "productTypeName",
        headerName: "Product Type",
        sortable: true,
        maxWidth: 120,
        filter: true,
        flex: 1,
        hide: isGridForAccountProduct
      },
      {
        field: "unitName",
        headerName: "Unit Name",
        sortable: true,
        filter: true,
        flex: 1,
        hide: isGridForAccountProduct,

      },

      {
        field: "isActive",
        headerName: "Active",
        sortable: true,
        filter: true,
        maxWidth: 100,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center gap-1">
              <StatusIndicator isActive={params.value} />
            </div>
          );
        },
        hide: isGridForAccountProduct,

      },
      {
        field: "isSerialNumber",
        headerName: "Serial Number",
        sortable: true,
        // filter: true,
        minWidth: 140,
        maxWidth: 160,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center gap-1">
              <StatusIndicator
                activeLabel="Yes"
                inactiveLabel="No"
                isActive={params.value}
              />
            </div>
          );
        },
        hide: isGridForAccountProduct,

      },

      {
        field: "defaultWarrantyName",
        headerName: "Warranty",
        sortable: true,
        maxWidth: 110,
        filter: true,
        flex: 1,
        hide: !userHasAccessToViewProduct || isGridForAccountProduct,
      },
      {
        field: "defaultAmcCycleName",
        headerName: "AMC Cycle",
        sortable: true,
        maxWidth: 120,
        filter: true,
        flex: 1,
        hide: !userHasAccessToViewProduct || isGridForAccountProduct,

      },
      {
        field: "version",
        headerName: "Version",
        sortable: true,
        maxWidth: 100,
        filter: true,
        flex: 1,
        hide: !userHasAccessToViewProduct || isGridForAccountProduct,

      },
      {
        field: "url",
        headerName: "URL",
        sortable: true,
        filter: true,
        maxWidth: 120,
        flex: 1,
        hide: !userHasAccessToViewProduct || isGridForAccountProduct,
        tooltipValueGetter(params) {
          return params.data.url;
        },
        onCellClicked: (params) => {
          if (params.value) {
            window.open(params.value, "_blank", "noopener,noreferrer");
          }
        },
        cellStyle: { color: "blue", cursor: "pointer" },

      },
      {
        field: "hsn",
        headerName: "HSN",
        maxWidth: 90,
        sortable: true,
        filter: true,
        tooltipValueGetter(params) {
          return params.data.hsn;
        },
        flex: 1,
        hide: !userHasAccessToViewProductTax || isGridForAccountProduct,
      },
      {
        field: "sac",
        headerName: "SAC",
        sortable: true,
        maxWidth: 90,
        filter: true,
        tooltipValueGetter(params) {
          return params.data.sac;
        },
        flex: 1,
        hide: !userHasAccessToViewProductTax || isGridForAccountProduct,
      },
      {
        field: "taxRate",
        headerName: "TAX Rate",
        sortable: true,
        maxWidth: 100,
        filter: true,
        flex: 1,
        hide: !userHasAccessToViewProductTax || isGridForAccountProduct,
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
        hide: !userHasAccessToViewProductTax || isGridForAccountProduct,
      },

      {
        field: "description",
        headerName: "Description",
        sortable: true,
        filter: true,
        flex: 1.5,
        tooltipValueGetter(params) {
          return params.data.description;
        },
        hide: isGridForAccountProduct,
      },

      {
        hide: true,
        field: "unitId",
        headerName: "Unit Id",
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        hide: true,
        field: "unitNameInStock",
        headerName: "Base Unit in Stock",
        sortable: true,
        filter: true,
        flex: 1,
      },

      {
        field: "createdBy",
        headerName: "Created By",
        sortable: true,
        filter: true,
        flex: 1,
        hide: isGridForAccountProduct,
      },
      {
        field: "createdOn",
        headerName: "Created On",
        sortable: true,
        filter: true,
        flex: 1,
                hide: isGridForAccountProduct,

      },
      {
        headerName: "Actions",
        hide: !isGridForAccountProduct,
        sortable: false,
        maxWidth: 100,
        pinned: "right",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: Product | any) => {
          return (
            <div className="flex items-center justify-center  ">
              <span
                className="lead-details cursor-pointer text-blue-600  "
                onClick={() => {
                  params.context.handleRowSelect(params.data);
                }}
              >
                Select
              </span>
            </div>
          );
        },
      },
      {
        headerName: "Actions",
        hide: isGridForAccountProduct,
        sortable: false,
        maxWidth: 100,
        pinned: "right",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
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
                        disabled={!userHasAccessToUpdateProduct}
                        onClick={() => {
                          if (userHasAccessToUpdateProduct) {
                            setIsActionsDropDownOpen(false);
                            handleEditCompanyProductModalOpen(true);
                            handleSelectedProductChange(params.data);
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
                        {JSX_CHILDREN_NAME.EDIT}
                        </div>
                      </ActionsDropdownButton>
                    </>

                    <>
                      <ActionsDropdownButton
                        disabled={!userHasAccessToUpdateProduct}
                        onClick={() => {
                          if (userHasAccessToUpdateProduct) {
                            setIsActionsDropDownOpen(false);
                            handleCreateStockModalOpen!(true);
                            handleSelectedProductChange(params.data);
                          } else {
                            toast.error(
                              MESSAGE.MODULE_ACCESS.STOCK.DENIED_ADD_ACCESS
                            );
                          }
                        }}
                      >
                        <div className="flex text-nowrap">
                          <Plus className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />
                          Stock
                        </div>
                      </ActionsDropdownButton>
                    </>
                    <>
                      {/* {userHasAccessToUpdateProductTeam && ( */}
                      <>
                        <ActionsDropdownButton
                          disabled={!userHasAccessToUpdateProductTeam}
                          onClick={() => {
                            if (userHasAccessToUpdateProductTeam) {
                              setIsActionsDropDownOpen(false);
                              handleCompanyProductUserModalOpen(true);
                              handleSelectedProductChange(params.data);
                            } else {
                              toast.error(
                                MESSAGE.MODULE_ACCESS.PRODUCT_TEAM_MANAGEMENT
                                  .DENIED_UPDATE_ACCESS
                              );
                            }
                          }}
                        >
                          <UserPlus
                            className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                          />
                          {JSX_CHILDREN_NAME.USER}
                        </ActionsDropdownButton>
                        <ActionsDropdownButton
                          disabled={!userHasAccessToUpdateProductTeam}
                          onClick={() => {
                            if (userHasAccessToUpdateProductTeam) {
                              setIsActionsDropDownOpen(false);
                              handleCompanyProductTeamModalOpen(true);
                              handleSelectedProductChange(params.data);
                            } else {
                              toast.error(
                                MESSAGE.MODULE_ACCESS.PRODUCT_TEAM_MANAGEMENT
                                  .DENIED_UPDATE_ACCESS
                              );
                            }
                          }}
                        >
                          <Network
                            className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                          />
                          {JSX_CHILDREN_NAME.TEAM}
                          {/* <p className="text-xs">Team</p> */}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        rowData={products}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham}
        context={{ handleRowSelect: onRowSelect }}
      />
    </div>
  );
}

export default ProductsManagementGrid;
