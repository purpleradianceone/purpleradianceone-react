/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo, useRef } from "react";
import LeadImportDataType from "../../@types/lead-management/LeadImportData";

const LeadImportPreSaveDataAgGrid: React.FC<{
  leadImportData: LeadImportDataType[];
  // selectedIds : Set<number>
  selectedIds : number[];
  onSelectedRow : (id: number , checked : boolean) => void
}> = ({ leadImportData , selectedIds , onSelectedRow }) => {

const gridRef = useRef<AgGridReact>(null);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName : "Delete" , field: "delete",
        cellRenderer: (params: any) => {
          const rowId = params.data.id;
          // const isChecked = params.context.selectedIds.has(rowId)
          const isChecked = params.context.selectedIds.includes(rowId)
          return (
            <div>
              <input 
              type="checkbox"
               className="checkbox  mt-1"
              checked={isChecked}
              onChange={
                (e)=>params.context.onSelectedRow(rowId, e.target.checked)
              } />
            </div>
          )
        }
      },
      { headerName: "ID", field: "id" 
        ,hide:true
       },
      { headerName: "Name", field: "name" },
      
      { headerName: "Product", field: "company_product_name" },
      { headerName: "Interest", field: "lead_interest" },
      { headerName: "Description", field: "description" },
      { headerName: "Lead Created On", field: "lead_created_on" },


      { headerName: "Email", field: "email" },
      { headerName: "Mobile Number", field: "mobilenumber" },
      { headerName: "Address", field: "address" },
      { headerName: "Company ID",
         field: "company_id",
        hide:true },
      { headerName: "Count",
         field: "count",
        hide:true },
     
      { headerName: "Job Title", field: "job_title" },
     
      { headerName: "Lead Status", field: "lead_status" },
       { headerName: "Lead Source", field: "lead_source" },
       { headerName: "Lead Owner", field: "lead_owner" },
       {headerName : "Products" , field:"company_product_name" , hide:true},
      { headerName: "Owner ID", field: "ownerid" , hide:true },
     
      { headerName: "Lead Source ID", field: "lead_source_id"  , hide:true},
      
      { headerName: "Lead Status ID", field: "lead_status_id"  , hide:true},
      { headerName: "Import Tag", field: "import_tag", hide:true },
      { headerName: "Industry/ Company Name", field: "industry_name" },
      { headerName: "Country ID", field: "country_id"  , hide:true },
      { headerName: "Country", field: "country_name" },
      { headerName: "State ID", field: "state_id"  , hide:true},
      { headerName: "State", field: "state_name" },
      { headerName: "District ID", field: "district_id"  , hide:true},
      { headerName: "District", field: "district_name" },
       { headerName: "Website", field: "website" },
       {
        headerName: "Additional Contact Number",
        field: "additional_contact_number",
      },
      { headerName: "Created On", field: "createdon" },
      { headerName: "Created By", field: "createdby_name" },
      { headerName: "Updated On", field: "updatedon" },
      { headerName: "Updated By", field: "updatedby_name" , hide : false },
    ],
    [selectedIds]
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
      className="ag-theme-balham  "
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
      ref={gridRef}
        rowData={leadImportData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        context={{
          selectedIds,
          onSelectedRow
        }}
      />
    </div>
  );
};

export default LeadImportPreSaveDataAgGrid;
