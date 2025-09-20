/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeAlpine } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";
import { INNERHTML } from "../../constants/AppConstants";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import CompanyProductTeamsAgGridProps from "../../@types/ag-grid/CompanyProductTeamsAgGridProps";

function CompanyProductTeamsAgGrid({
  companyProductTeams,
  handleCompanyProductTeamUpdate,
  handleViewPortChanged,
  onGridReady,
}: CompanyProductTeamsAgGridProps) {

  const {userHasAccessToUpdateProductTeam} = useUserAccessModules();
  const {loginStatus} = useLoggedInUserContext();

  const companyProductTeamsColDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "Team",
        field: "teamName",
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
        headerName: "Action",
        sortable: true,
        filter: true,
        pinned: "right",
        width: 100,
        cellRenderer: (params: any) => {
          const [isActive, setIsActive] = useState<boolean>(
            params.data.isActive
          );

          const handleUpdateCompanyProductTeamToggle = async (event :React.ChangeEvent<HTMLInputElement>) => {
            if(userHasAccessToUpdateProductTeam){
              const updateCompanyProductTeamPostData = {
                company_id : loginStatus.companyId,
                id :parseInt(event.currentTarget.id),
                isactive : !isActive,
                updatedby : loginStatus.id
              }
              await axios.post(POST_API.UPDATE_COMPANY_PRODUCT_TEAM,updateCompanyProductTeamPostData,{
                withCredentials:true
              })
              .then((response) => {
                if(response.data.status){
                  setIsActive(!isActive)
                  params.data.isActive = !isActive;
                  handleCompanyProductTeamUpdate(response.data.message)
              }
              })

            }
          }
          return (
            <div className="flex flex-col items-center mt-3">
              {/* <button
                id={params.data.id.toString()}
                onClick={(event) => {
                  handleUpdateCompanyProductTeamToggle(event);
                }}
                className={`w-6 h-3 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-500"
                } text-white font-semibold`}
              >
                <div
                  className={`bg-gray-200 h-2 w-2 transition-opacity rounded-full ${
                    isActive ? "float-end" : "float-start"
                  }`}
                ></div>
              </button> */}
              <label className="inline-flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isActive}
                      id={params.data.id.toString()}
                      name="isActive"
                      onChange={(e) => {
                         handleUpdateCompanyProductTeamToggle(e);
                      }}
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />
                  </label>
            </div>
          );
        },
      },
    ],
    [companyProductTeams]
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
    <AgGridReact
    rowData={companyProductTeams}
      columnDefs={companyProductTeamsColDefs}
      defaultColDef={defaultColDef}
      modules={[AllCommunityModule]}
      overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
      theme={themeAlpine}
      onViewportChanged={handleViewPortChanged}
      onGridReady={onGridReady}
      
    />
  );
}

export default CompanyProductTeamsAgGrid;
