// export default CompanyUserAgGridForLead;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AgGridReact as AgGridReactType } from "ag-grid-react";
import { INNERHTML } from "../../../constants/AppConstants";
import LookupCompanyUser from "../../../@types/lookup/LookupCompanyUser";

type LookupCompanyUserAgGridProps = {
  users: LookupCompanyUser[];
  handleSelectedCompanyUserChange: (params: LookupCompanyUser | null) => void;
  selectedUserId: number | null; 
};

function LookupCompanyUserAgGrid({
  users,
  handleSelectedCompanyUserChange,
  selectedUserId,
}: LookupCompanyUserAgGridProps) {
  const [localSelectedUserId, setLocalSelectedUserId] = useState<number | null>(
    selectedUserId
  );
  const gridRef = useRef<AgGridReactType<any>>(null);

  useEffect(() => {
    setLocalSelectedUserId(selectedUserId);
    if (gridRef.current?.api) {
      gridRef.current.api.refreshCells({
        force: true,
        columns: ["Action"], 
      });
    }
  }, [selectedUserId]);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "fullname",
        headerName: "Full Name",
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
        flex: 1,
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
          const user: LookupCompanyUser = params.data;
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
                      handleSelectedCompanyUserChange(null);
                    } else {
                      setLocalSelectedUserId(user.id);
                      handleSelectedCompanyUserChange(user);
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
        rowData={users}
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
