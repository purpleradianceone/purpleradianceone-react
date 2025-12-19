import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo } from "react";
import { StockAvaibleSerialNumber } from "../../@types/stock/StockAvailableSerialNumber";

export const StockAvailableSerialNumberAgGrid = ({
  data,
  selectedIds,
  onSelectionChange,
}: {
  data: StockAvaibleSerialNumber[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}) => {
  const toggleSelect = useCallback((id: number) => {
    let updated;

    if (selectedIds.includes(id)) {
      updated = selectedIds.filter((x) => x !== id);
    } else {
      updated = [...selectedIds, id];
    }

    onSelectionChange(updated); 
  },[selectedIds, onSelectionChange]);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { hide: true, field: "stockInwardId", headerName: "stockInwardId" },
      {
        field: "companyWarehouseName",
        headerName: "Warehouse",
        cellStyle: { color: "black", fontWeight: "bold" },
      },
      { hide: true, field: "companyWarehouseId" },
      { field: "barcode" },
      { field: "serialNumber" },
      { field: "systemCode" },
      { field: "createdOn" },

      {
        headerName: "Actions",
        field: "actions",
        pinned: "right",
        minWidth: 120,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => {
          const { stockInwardId } = params.data;
          const isChecked = params.context.selectedIds.includes(stockInwardId);

          return (
            <input
              className="ml-4 mt-1 cursor-pointer"
              type="checkbox"
              checked={isChecked}
              onChange={() => params.context.toggleSelect(stockInwardId)}
            />
          );
        },
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      filter: "agTextColumnFilter",
      minWidth: 150,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    }),
    []
  );

  return (
    <div className="ag-theme-balham w-full" style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        key={selectedIds.join(",")}   //  forces checkbox re-render
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        context={{ selectedIds, toggleSelect }}
        getRowId={(params) => params.data.stockInwardId.toString()}   //  required for persistence
      />
    </div>
  );
};
