/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { INNERHTML } from "../../constants/AppConstants";
import { useMemo, useRef } from "react";
import CompanyAccountType from "../../@types/settings/CompanyAccountType";

const AccountCompanyAccountTypeAgGrid = ({
  accountCompanyAccountTypeData,
  onRowSelect, //selected user for view lead details
}: {
  accountCompanyAccountTypeData: CompanyAccountType[];
  onRowSelect: (data: CompanyAccountType | any) => void;
}) => {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: true,

        field: "accountTypeId",
        headerName: "accountTypeId",
      },

      {
        field: "companyAccountTypeName",
        headerName: "Company Account Type",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 160,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      {
        field: "accountTypeName",
        headerName: "Account Type",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 160,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      {
        hide: true,
        field: "companyId",
        headerName: "companyId",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 160,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      {
        hide: true,
        field: "id",
        headerName: "id",
      },
      {
        headerName: "Actions",
        // hide: !isUsedInLeadModule,
        field: "view",
        pinned: "right",
        maxWidth: 80,
        // minWidth:80,
        // autoHeight: true,
        // suppressSizeToFit: true,
        cellRenderer: (params: CompanyAccountType | any) => {
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
    <div className="ag-theme-balham " style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        ref={gridRef} // Attach the ref
        rowData={accountCompanyAccountTypeData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{ handleRowSelect: onRowSelect }}
      />
    </div>
  );
};

export default AccountCompanyAccountTypeAgGrid;
