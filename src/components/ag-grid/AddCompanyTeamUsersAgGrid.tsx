/* eslint-disable react-hooks/rules-of-hooks */

/* eslint-disable @typescript-eslint/no-unused-expressions */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { AllCommunityModule, ColDef, GridApi, themeAlpine, ViewportChangedEvent } from "ag-grid-community";
import { useMemo, useState, useRef } from "react";
import { INNERHTML } from "../../constants/AppConstants";
import { AgGridReact } from "ag-grid-react";
import companyUsersSearchProps from "../../@types/company-users/CompanyUserProps";
import { CheckCircle2, XCircle } from "lucide-react";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../constants/PostApi";

function AddCompanyTeamUsersAgGrid({
  companyUsers,
  handleViewPortChanged,
  onGridReady,
  handleCompanyUserCheckBoxChange,
  addCompanyTeamUserArray,
  isGridForUpdateCompanyUser,
  // You can still call this if needed
  handleCompanyUserStatusChange,
  isGridForSubscription,
  handleCompanyUserToggleChange
}: {
  companyUsers: companyUsersSearchProps[];
  handleViewPortChanged: (params: ViewportChangedEvent) => void;
  onGridReady: (params: { api: GridApi }) => void;
  handleCompanyUserCheckBoxChange?: (params: companyUsersSearchProps, event: React.ChangeEvent<HTMLInputElement>) => void;
  addCompanyTeamUserArray?: number[];
  isGridForUpdateCompanyUser?: boolean;
  handleCompanyUserStatusChange?: (statusChangeCount: number) => void;
  isGridForSubscription: boolean;
  handleCompanyUserToggleChange? : (message : string , status : boolean)=> void;
}) {
  const { userHasAccessToUpdateUser } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  // Global counter for net status changes across rows.
  const [statusChangeCount, setStatusChangeCount] = useState<number>(0);

  // This helper updates the global counter.
  const updateGlobalCount = (delta: number) => {
    setStatusChangeCount((prev) => {
      const newCount = prev + delta;
      // Optionally call the provided callback with the new count
      if (handleCompanyUserStatusChange) {
        handleCompanyUserStatusChange(newCount);
      }
      return newCount;
    });
  };

  const companyUserColDefs = useMemo<ColDef[]>(
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
        field: "isactive",
        headerName: "Status",
        sortable: true,
        filter: true,
        hide: !isGridForUpdateCompanyUser,
        // Render the active/inactive badge
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
      {
        headerName: "Action",
        sortable: true,
        filter: false,
        pinned: "right",
        width: 100,
        cellRenderer: (params: any) => {
          // For non-update grids, simply render a checkbox.
          if (!isGridForUpdateCompanyUser) {
            const isChecked = addCompanyTeamUserArray
              ? addCompanyTeamUserArray.includes(params.data.id)
              : false;
            return (
              <div className="flex flex-col ml-2 items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  onChange={(event) => {
                       handleCompanyUserCheckBoxChange!(params.data, event);
                  }}
                  
                />
              </div>
            );
          } else  {
            // When updating, manage a toggle button that updates status.
            // Each row remembers its original status.
            const originalStatusRef = useRef<boolean>(params.data.isactive);
            // Local state for the current status.
            const [isActive, setIsActive] = useState<boolean>(params.data.isactive);
            // Local delta tracks how this row’s status differs from the original.
            const [localDelta, setLocalDelta] = useState<number>(0);

            const handleCompanyUserUpdateToggle = async (event: React.FormEvent<HTMLButtonElement>) => {
              //NOTE CHANGES ARE DONE HERE
              // alert("called from here1")
              // if (userHasAccessToUpdateUser) {

                const userId = parseInt(event.currentTarget.id);
                const updateCompanyUserPostData = {
                  company_id: loginStatus.companyId,
                  id: userId,
                  // Toggle the status
                  isactive: !isActive,
                  updatedby: loginStatus.id,
                };
                // alert("called from here")
                try {
                  const res = await axios.put(POST_API.UPDATE_COMPANY_USER, updateCompanyUserPostData, {
                    withCredentials: true,
                  });
                  if (res.data.status) {
                    // Toggle the local state.
                    const newStatus = !isActive;
                    setIsActive(newStatus);
                    params.node.setDataValue("isactive", newStatus);
                    

                    // Determine what the new delta should be.
                    // If the new status is the same as the original, delta is 0.
                    // Otherwise, if original was inactive (false) and now active, delta is +1.
                    // Or if original was active (true) and now inactive, delta is -1.
                    const original = originalStatusRef.current;
                    const newDelta = newStatus === original ? 0 : (original ? -1 : 1);
                    // Update the global counter by the change in this row’s delta.
                    updateGlobalCount(newDelta - localDelta);
                    // Save the new delta locally.
                    setLocalDelta(newDelta);
                  
                  }
                  handleCompanyUserToggleChange!(res.data.message, res.data.status)
                } catch (error) {
                  console.error("Error updating user status:", error);
                }
              // }
            };

            return (
              <div className="flex flex-col items-center mt-3">
                <button
                  id={params.data.id.toString()}
                  onClick={(event) => {
                    handleCompanyUserUpdateToggle(event);
                  }}
                  className={`w-6 h-3 rounded-md transition-colors duration-200 ${
                    isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                  } text-white font-semibold`}
                >
                  <div
                    className={`bg-gray-200 h-2 w-2 transition-opacity rounded-full ${
                      isActive ? "float-end" : "float-start"
                    }`}
                  ></div>
                </button>
              </div>
            );
          }
        },
      },
    ],
    // Include dependencies that affect the rendering.

    [addCompanyTeamUserArray, companyUsers, isGridForUpdateCompanyUser, handleCompanyUserCheckBoxChange, userHasAccessToUpdateUser, loginStatus,  ]
    //[addCompanyTeamUserArray, companyUsers]
    //need to check the above code 
  );

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      minWidth: 30,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);

  return (
    <>
      {/* Optional: display the global change count */}
      <div className="mb-2">
        {isGridForSubscription &&
        (
          <><span className="font-semibold">Net Status Change Count: </span><span>{statusChangeCount}</span></>
        )
        }
        
      </div>
      <AgGridReact
        rowData={companyUsers}
        columnDefs={companyUserColDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        theme={themeAlpine}
        onViewportChanged={handleViewPortChanged}
        onGridReady={onGridReady}

      />
    </>
  );
}

export default AddCompanyTeamUsersAgGrid;
