/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AgGridReact as AgGridReactType } from "ag-grid-react";
import { INNERHTML } from "../../../constants/AppConstants";
import LookupCompanyProduct from "../../../@types/lookup/LookupCompanyProduct";

type LookupCompanyProductAgGridProps = {
  companyProducts: LookupCompanyProduct[];
  handleSelectedCompanyProductChange: (params: LookupCompanyProduct | null) => void;
  selectedProductId: number | null; 
};

function LookupCompanyUserAgGrid({
  companyProducts,
  handleSelectedCompanyProductChange,
  selectedProductId,
}: LookupCompanyProductAgGridProps) {
  const [localSelectedUserId, setLocalSelectedUserId] = useState<number | null>(
    selectedProductId
  );
  const gridRef = useRef<AgGridReactType<any>>(null);

  useEffect(() => {
    setLocalSelectedUserId(selectedProductId);
    if (gridRef.current?.api) {
      gridRef.current.api.refreshCells({
        force: true,
        columns: ["Action"], 
      });
    }
  }, [selectedProductId]);

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
        field: "Action",
        headerName: "Action",
        pinned: "right",
        lockPosition: true,
        suppressMenu: true,
        sortable: false,
        filter: false,
        width: 100,
        cellRenderer: (params: any) => {
          const user: LookupCompanyProduct = params.data;
          const isChecked = localSelectedUserId === user.id;
          return (
            <div className="flex items-center  justify-center mt-1">
              
              {(
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    if (isChecked) {
                      setLocalSelectedUserId(null);
                      handleSelectedCompanyProductChange(null);
                    } else {
                      setLocalSelectedUserId(user.id);
                      handleSelectedCompanyProductChange(user);
                    }
                  }}
                  className="cursor-pointer accent-blue-500 checkbox"
                />
              )}
            </div>
          );
        },
      },
      
    ],
    [localSelectedUserId] 
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
        ref={gridRef}
        rowData={companyProducts}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham}
      />
    </div>
  );
}

export default LookupCompanyUserAgGrid;
