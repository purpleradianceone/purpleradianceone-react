import { useMemo } from "react";
import { AllCommunityModule, ColDef, } from "ag-grid-community";
import StockAgeing from "../../@types/stock/StockAgeing";
import { AgGridReact } from "ag-grid-react";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import AgGridProfileCell from "../ui/AgGridProfileCell";
import { Package } from "lucide-react";
import { AGGRID } from "../../constants/AppConstants";

const StockAgeingAgGrid = ({ data , isDataLoading }: { data: StockAgeing[] , isDataLoading : boolean }) => {
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: false,
        field: "companyProductName",
        headerName: " Product",
        cellStyle: {
          color: "black",
          fontWeight: "bold",
        },
        
         cellRenderer: (params: any) => (
      <AgGridProfileCell
        primaryText={params.value}
        icon={<Package size={16} />}
      />
    ),
        
      },
      {
        field: "unitName",
        headerName: "unit",
        hide: false,
        // cellStyle: {
        //   color: "black",
        //   // fontWeight: "bold",
        // },
      },
      {
        field: "zeroToThirtyDays",
        headerName: "0 - 30 Days",
      },
      {
        field: "thirtyToSixtyDays",
        headerName: "31 - 60 Days",
      },
      {
        field: "sixtyToNinetyDays",
        headerName: "61 - 90 Days",
      },
      {
        field: "ninetyPlusDays",
        headerName: "90+ Days",
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
        rowData={ isDataLoading ?skeletonRows : data}
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

export default StockAgeingAgGrid;
