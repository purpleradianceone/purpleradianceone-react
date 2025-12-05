// export default CompanyUserAgGridForLead;
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { INNERHTML } from "../../../../constants/AppConstants";
import type { AgGridReact as AgGridReactType } from "ag-grid-react";
import CompanyUsersSearchProps from "../../../../@types/company-users/CompanyUserProps";
import CompanyUser from "../../../../@types/company-users/CompanyUser";
import ToggleButton from "../../../ui/ToggleButton";
import toast from "react-hot-toast";
import MESSAGE from "../../../../constants/Messages";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import StatusIndicator from "../../../ui/StatusIndicator";

type CompanyUserAgGridPropsForLead = {
  users: CompanyUsersSearchProps[];
  handleSelectedCompanyUserChange: (params: CompanyUser | null) => void;
  selectedUserId: number | null; // Receive the prop
  isUsedForSettings: boolean;
  handleUpdateLeadUser?: (params: CompanyUser | null) => boolean;
};

function CompanyUserAgGridForLead({
  users,
  handleSelectedCompanyUserChange,
  selectedUserId, // Destructure the prop
  isUsedForSettings,
  handleUpdateLeadUser,
}: CompanyUserAgGridPropsForLead) {
  const {userHasAccessToUpdateSettingLead} = useUserAccessModules();
  const [localSelectedUserId, setLocalSelectedUserId] = useState<number | null>(
    selectedUserId
  ); // Initialize local state with the prop
  const gridRef = useRef<AgGridReactType<any>>(null);

  useEffect(() => {
    setLocalSelectedUserId(selectedUserId);
    // Refresh the Action column
    if (gridRef.current?.api) {
      gridRef.current.api.refreshCells({
        force: true,
        columns: ["Action"], // Only refresh the checkbox column
      });
    }
  }, [selectedUserId]);

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
          const user: CompanyUser = params.data;
          const isChecked = isUsedForSettings
            ? user!.all_leads_visible
            : localSelectedUserId === user.id;

          const onToggle = () => {
            if(userHasAccessToUpdateSettingLead){
            if (!handleUpdateLeadUser) return;
             handleUpdateLeadUser(user);
              if (isUsedForSettings) {
              user.all_leads_visible = !user.all_leads_visible;
              console.log(""+user.all_leads_visible);
              params.api.refreshCells({
                columns: ["Action"], 
                force: true,
              });
            }
          }else{
            toast.error(MESSAGE.ERROR.NOT_ATHORISED)
          }
            
            
          };
          return (
            <div className="flex items-center  justify-center mt-1">
              {isUsedForSettings && (
                <ToggleButton
                  checked={isChecked!}
                  name=""
                  onToggle={() => {
                    onToggle();
                  }}
                />
              )}
              {!isUsedForSettings && (
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
      {
        field: "isactive",
        headerName: "Status",
        hide: true,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center gap-1 ">
              {params.value ? (
                <>
                <StatusIndicator
                  isActive={params.value}
                />
                  {/* <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Active</span> */}
                </>
              ) : (
                <>
                  {/* <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Inactive</span> */}
                  <StatusIndicator
                  isActive={params.value}
                />
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

export default CompanyUserAgGridForLead;
