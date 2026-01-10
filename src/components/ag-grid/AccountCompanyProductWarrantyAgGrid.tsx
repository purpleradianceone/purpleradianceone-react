import { useMemo } from "react";
import { AccountCompanyProductWarranty } from "../../@types/account/AccountCompanyProductWarranty";
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import StatusIndicator from "../ui/StatusIndicator";
import { AgGridReact } from "ag-grid-react";


interface AccountCompanyProductWarrantyAgGrid {
  data: AccountCompanyProductWarranty[];
    onRowSelect : (data : AccountCompanyProductWarranty)=> void

}
export const AccountCompanyProductWarrantyAgGrid : React.FC<
  AccountCompanyProductWarrantyAgGrid
   
> = ({ data , onRowSelect }) => {
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "warrantyStartDate",
        headerName: "Start Date",
      },
      {
        field: "warrantyEndDate",
        headerName: "End Date",
      },
      {
        field: "details",
        headerName: "Details",
      },
      {
        field: "warrantyTerms",
        headerName: "Warranty Terms",
      },
      {
        field: "isActive",
        headerName: "Active",
        sortable: true,
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
      {
              headerName: "Actions",
              field: "view",
              pinned: "right",
              maxWidth: 80,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cellRenderer: (params: AccountCompanyProductWarranty | any) => {
                return (
                  <div className="flex items-center justify-center  ">
                    <span
                      className="lead-details cursor-pointer text-blue-600  "
                      onClick={() => {
                        params.context.handleRowSelect(params.data);
                      }}
                    >
                      Update
                    </span>
                  </div>
                );
              },
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
         context={{ handleRowSelect: onRowSelect }}
      />
    </div>
  );
};
