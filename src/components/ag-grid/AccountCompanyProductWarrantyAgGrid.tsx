import { useMemo } from "react";
import { AccountCompanyProductWarranty } from "../../@types/account/AccountCompanyProductWarranty";
import { AllCommunityModule, ColDef,  } from "ag-grid-community";
import StatusIndicator from "../ui/StatusIndicator";
import { AgGridReact } from "ag-grid-react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import toast from "react-hot-toast";
import MESSAGE from "../../constants/Messages";
import Button from "../ui/Button";
import { AGGRID } from "../../constants/AppConstants";
import RenderUserWithIcon from "../ui/UserAgGridCellRenderer";


interface AccountCompanyProductWarrantyAgGrid {
  data: AccountCompanyProductWarranty[];
    onRowSelect : (data : AccountCompanyProductWarranty)=> void

}
export const AccountCompanyProductWarrantyAgGrid : React.FC<
  AccountCompanyProductWarrantyAgGrid
   
> = ({ data , onRowSelect }) => {

  const {userHasAccessToUpdateAccountProductsWarranty} = useUserAccessModules();
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
        cellRenderer: RenderUserWithIcon,
      },
      
      {
        field: "updatedBy",
        headerName: "updated By",
        cellRenderer: RenderUserWithIcon,
      },
      {
        field: "updatedOn",
        headerName: "updated On ",
      },
      {
              headerName: "Actions",
              field: "view",
              pinned: "right",
              maxWidth: 100,
              filter: false,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cellRenderer: (params: AccountCompanyProductWarranty | any) => {
                return (
                  <div className="flex items-center justify-center  ">
                    <Button
                    disabled={!userHasAccessToUpdateAccountProductsWarranty}
                      className={`lead-details  text-blue-600 ${userHasAccessToUpdateAccountProductsWarranty ? "hover:cursor-not-allowed" : "cursor-pointer"}  `}
                      onClick={() => {
                        if(!userHasAccessToUpdateAccountProductsWarranty){
                          toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_COMPANY_PRODUCT_WARRANTY.DENIED_UPDATE_ACCESS);
                          return;
                        }
                          params.context.handleRowSelect(params.data);
                        
                      }}
                    >
                      Update
                    </Button>
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
      className="modern-user-grid custom-height-scrollbar w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        // theme={themeBalham}
        rowHeight={AGGRID.ROW_HEIGHT}
        headerHeight={AGGRID.HEADER_HEIGHT}

         context={{ handleRowSelect: onRowSelect }}
      />
    </div>
  );
};
