import { AllCommunityModule, ColDef, } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import LiveStock from "../../@types/stock/LiveStock";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import { AGGRID } from "../../constants/AppConstants";
import AgGridProfileCell from "../ui/AgGridProfileCell";
import { Warehouse } from "lucide-react";

const StockLiveAgGrid = ({
  data,
  isDataLoading,
}: {
  data: LiveStock[];
  isDataLoading: boolean;
}) => {
  const columnDefs = useMemo<ColDef[]>(
    () => [
       {

        field: "companyWarehouseName",
        headerName: "Warehouse",
        cellStyle:{
          color : "black",
          fontWeight: "bold",
        },
        cellRenderer: (params: any) => (
      <AgGridProfileCell
        primaryText={params.value}
        icon={<Warehouse size={16} />}
      />
    ),
      },
      {
        hide: false,
        field: "companyProductName",
        headerName: " Product",
        // cellStyle: {
        //   color: "black",
        //   // fontWeight: "bold",
        // },
      },
     
      {
        field: "quantityLive",
        headerName: "Current Quantity",
      },
      {
        field: "quantityInward",
        headerName: "Inward",
      },
      {
        field: "quantityOutward",
        headerName: "Outward",
      },
    ],
    [],
  );

  const skeletonRows = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      __isSkeleton: true,
    }));
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      minWidth: 150,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => {
        if (params.data?.__isSkeleton) {
          return <SkeletonRowsAgGrid />;
        }
        return params.value;
      },
    };
  }, []);
  return (
    <div
      className="modern-user-grid custom-height-scrollbar w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        rowData={isDataLoading ? skeletonRows : data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        // theme={themeBalham}
        rowHeight={AGGRID.ROW_HEIGHT}
                headerHeight={AGGRID.HEADER_HEIGHT}
      />
    </div>
  );
};

export default StockLiveAgGrid;
