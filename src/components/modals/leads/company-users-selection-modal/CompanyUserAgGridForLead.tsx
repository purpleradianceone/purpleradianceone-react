// export default CompanyUserAgGridForLead;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeAlpine } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { INNERHTML } from "../../../../constants/AppConstants";

import CompanyUsersSearchProps from "../../../../@types/company-users/CompanyUserProps";
import CompanyUser from "../../../../@types/company-users/CompanyUser";

type CompanyUserAgGridPropsForLead = {
  users: CompanyUsersSearchProps[];
  handleSelectedCompanyUserChange: (params: CompanyUser | null) => void;
  selectedUserId: number | null; // Receive the prop
};

function CompanyUserAgGridForLead({
  users,
  handleSelectedCompanyUserChange,
  selectedUserId, // Destructure the prop
}: CompanyUserAgGridPropsForLead) {
  const [localSelectedUserId, setLocalSelectedUserId] = useState<number | null>(selectedUserId); // Initialize local state with the prop

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "fullname",
        headerName: "Name",
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
        field: "email",
        headerName: "Email",
        sortable: true,
        filter: true,
        flex: 1.5,
      },
      {
        field: "mobilenumber",
        headerName: "Mobile Number",
        sortable: true,
        filter: true,
        hide: true,
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
          const user: CompanyUser = params.data;
          const isChecked = localSelectedUserId === user.id;

          return (
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => {
                if (isChecked) {
                  setLocalSelectedUserId(null);
                  handleSelectedCompanyUserChange(null);
                } else {
                  setLocalSelectedUserId(user.id);
                  handleSelectedCompanyUserChange(user);
                }
              }}
              className="cursor-pointer accent-blue-500"
            />
          );
        },
      },
      {
        field: "isactive",
        headerName: "Status",
        hide: true,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center gap-1 mt-3">
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
    ],
    [localSelectedUserId] // Dependency array now includes local state
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
      className="ag-theme-alpine w-full"
      style={{ height: "460px", width: "100%" }}
    >
      <AgGridReact
        rowData={users}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeAlpine}
      />
    </div>
  );
}

export default CompanyUserAgGridForLead;