/* eslint-disable react-hooks/rules-of-hooks */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import { CLASS_NAMES } from "../../constants/ClassNames";
import ActionsDropdownButton from "../ui/ActionsDropdownButton";
import { CheckCircle2, Edit, Network, UserPlus, XCircle } from "lucide-react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import ProductsManagementGridProps from "../../@types/ag-grid/ProductsManagementGridProps";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";

function ProductsManagementGrid({
  products,
  handleEditCompanyProductModalOpen,
  handleSelectedProductChange,
  isGridForProductUser,
  handleCompanyProductUserModalOpen,
  handleCompanyProductTeamModalOpen,
}: ProductsManagementGridProps) {
  const {
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
        field: "isActive",
        headerName: "Active",
        sortable: true,
        filter: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
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
        hide: !userHasAccessToViewProductTax || isGridForProductUser,
      },
      {
        field: "sac",
        headerName: "SAC",
        sortable: true,
        filter: true,
        flex: 1,
        hide: !userHasAccessToViewProductTax || isGridForProductUser,
      },
      {
        field: "taxRate",
        headerName: "TAX Rate",
        sortable: true,
        filter: true,
        flex: 1,
        hide: !userHasAccessToViewProductTax || isGridForProductUser,
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
        hide: !userHasAccessToViewProductTax || isGridForProductUser,
      },

      {
        field: "createdBy",
        headerName: "Created By",
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        field: "createdOn",
        headerName: "Created On",
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: "Actions",
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
                    {!isGridForProductUser && (
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
                          <Edit className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR} />{" "}
                          {JSX_CHILDREN_NAME.EDIT}
                        </ActionsDropdownButton>
                      </>
                    )}

                    {isGridForProductUser && (
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
                                toast.error(MESSAGE.MODULE_ACCESS.PRODUCT_TEAM_MANAGEMENT.DENIED_UPDATE_ACCESS);
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
                               }else{
                                toast.error(MESSAGE.MODULE_ACCESS.PRODUCT_TEAM_MANAGEMENT.DENIED_UPDATE_ACCESS);
                               }
                            }}
                          >
                            <Network
                              className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                            />
                            {JSX_CHILDREN_NAME.TEAM}
                          </ActionsDropdownButton>
                        </>
                        {/* // )} */}

                        {/* {!userHasAccessToUpdateProductTeam && (
                          <>
                            <Button
                             disabled
                             className={CLASS_NAMES.DISABLED_BUTTON}>
                              <UserPlus
                                className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                              />
                              {JSX_CHILDREN_NAME.USER}
                            </Button>
                            <Button
                             disabled
                             className={CLASS_NAMES.DISABLED_BUTTON}>
                              <Network
                                className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
                              />
                              {JSX_CHILDREN_NAME.TEAM}
                            </Button>
                          </>
                        )} */}
                      </>
                    )}
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
      />
    </div>
  );
}

export default ProductsManagementGrid;
