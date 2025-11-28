import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { AccountCompanyProductAmc } from "../../@types/account/AccountCompanyProductAmc";
import StatusIndicator from "../ui/StatusIndicator";

interface AccountCompanyProductAmcAgGrid {
  data: AccountCompanyProductAmc[];
}
export const AccountCompanyProductAmcAggrid: React.FC<
  AccountCompanyProductAmcAgGrid
> = ({ data }) => {


    //  id : number,
    // accountCompanyProductId  : number,
    // amcCycleStartDate: string ,
    // amcCycleEndDate : string ,
    // details : string  ,
    // isActive: boolean,
    // createdBy : string ,
    // updatedBy : string ,
    // createdOn : string ,
    // updatedOn: string 
  const columnDefs = useMemo<ColDef[]>(
    () => [
    //   {
    //     field: "leadStatus",
    //     headerName: "Lead Status",
    //     cellStyle: {
    //       color: "black",
    //       fontWeight: "bold",
    //     },
    //     hide: true,
    //   },
      {
        field: "amcCycleStartDate",
        headerName: "Start Date",
        // hide: true,
      },
      {
        field: "amcCycleEndDate",
        headerName: "End Date",
      },
      {
        field: "details",
        headerName: "Details",
      },
      {
        field: "isActive",
        headerName: "Active",
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
      },
       {
        field: "createdOn",
        headerName: "Created On",
      },
      {
        field: "createdBy",
        headerName: "Created By",
      },
     
      {
        field: "updatedBy",
        headerName: "updated By",
      },
      {
        field: "updatedOn",
        headerName: "updated On ",
      },
    ],
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
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
      />
    </div>
  );
};
