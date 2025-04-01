import { AllCommunityModule, ColDef, themeAlpine, } from "ag-grid-community";
import { useEffect, useMemo } from "react";
import { INNERHTML } from "../../constants/AppConstants";
import { AgGridReact } from "ag-grid-react";
import AddCompanyTeamUsersAgGridProps from "../../@types/ag-grid/AddCompanyTeamUsersAgGridProps";


function AddCompanyTeamUsersAgGrid({
    companyUsers,
    handleViewPortChanged,
    onGridReady,
    handleCompanyUserCheckBoxChange,
    addCompanyTeamUserArray,
} : AddCompanyTeamUsersAgGridProps){


  useEffect(()=> {
    console.log("In Grid");
    console.log(companyUsers)
  },[companyUsers]);

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
            headerName: "Action",
            sortable: true,
            filter: true,
            pinned: "right",
            width: 100,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cellRenderer: (params: any) => {

              const isChecked = addCompanyTeamUserArray.includes(params.data.id);
              
              
              return (
                <div className="flex flex-col ml-2 items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    onChange={(event)=>{
                      handleCompanyUserCheckBoxChange(params.data,event)
                    }}
                  />
                </div>
              );
            },
          },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [addCompanyTeamUserArray]
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
          rowData={companyUsers}
          columnDefs={companyUserColDefs}
          defaultColDef={defaultColDef}
          modules={[AllCommunityModule]}
          overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
          theme={themeAlpine}
          onViewportChanged={handleViewPortChanged}
          onGridReady={onGridReady}
        />
      );
}

export default AddCompanyTeamUsersAgGrid;