import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { INNERHTML } from "../../constants/AppConstants";
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
  const toggleSelect = (id: number) => {
    let updated;

    if (selectedIds.includes(id)) {
      updated = selectedIds.filter((x) => x !== id);
    } else {
      updated = [...selectedIds, id];
    }

    onSelectionChange(updated); // send updated list to parent
  };

  const columnDefs = useMemo<ColDef[]>(
    () => [
      { hide: true, field: "stockInwardId", headerName: "stockInwardId" },
      {
        field: "companyWarehouseName",
        headerName: "Warehouse",
        cellStyle: { color: "black", fontWeight: "bold" },
      },
      { field: "companyWarehouseId", headerName: "companyWarehouseId" },
      { field: "barcode", headerName: "barcode" },
      { field: "serialNumber", headerName: "serialNumber" },
      { field: "systemCode", headerName: "systemCode" },
      { field: "createdOn", headerName: "createdOn" },

      //  NEW ACTION COLUMN
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
              type="checkbox"
              checked={isChecked}
              onChange={() => params.context.toggleSelect(stockInwardId)}
            />
          );
        },
      },
    ],
    [selectedIds]
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
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeBalham}
        context={{ selectedIds, toggleSelect }}   //  THIS IS IMPORTANT
      />
    </div>
  );
};
