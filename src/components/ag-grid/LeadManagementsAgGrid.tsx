/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {  useMemo, useRef } from "react";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import LeadManagementAgGridProps from "../../@types/ag-grid/LeadManagementAgGridProps";
import LeadDataProps from "../../@types/lead-management/LeadProps";



function LeadManagementAgGrid({
  leads,
  onRowSelect, //selected user for view lead details
  handleRowClick
}: LeadManagementAgGridProps) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: true,
        field:"id",
        headerName : "leadid",
      },
      {
        field: "name",
        headerName: "Name",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 160,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
      },
      {
        field: "email",
        headerName: "Email",
        sortable: true,
        filter: true,
        flex: 1.5,
        minWidth: 200,
      },
      {
        field: "mobileNumber",
        headerName: "Mobile number",
        sortable: true,
        filter: true,
      },
      {
        field: "leadOwner",
        headerName: "Owner",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 180,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),

      },
      {
        field: "leadStatus",
        headerName: "Status",
        sortable: true,
        filter: true,
      },
      {
        field: "leadSource",
        headerName: "Source",
        sortable: true,
        filter: true,
      },
      { 
        field: "createdBy",
        headerName: "Created by",
        filter: true
      },
      {
        field: "createdOn",
        headerName: "Created on",
        sortable: true,
        filter: true,
      },
       {
        field: "updatedBy",
        headerName: "Updated by",
        sortable: true,
        filter: true,
      },
       {
        field: "updatedOn",
        headerName: "Updated on",
        sortable: true,
        filter: true,
      },
      {
        hide: true,
        headerName: "Actions",
        field: "actions",
        cellRenderer: () => JSX_CHILDREN_NAME.ACTIONS,
        sortable: false,
        maxWidth: 110,
        pinned: "right",
         cellStyle: {
          color: '#2563eb', // Tailwind's blue-600
          textDecoration: 'none',
          cursor: 'pointer',
          fontWeight: '400'
        }
      },
      // {
      //   headerName :"Actions",
      //   field: "view",
      //   pinned : "right",
      //   maxWidth : 110,
      //   // cellRenderer : ()=> "View",
      //   cellRenderer : (params :LeadDataProps| any ) => {
      //     return (
      //       <span
      //       className="lead-details"
      //       onClick={() =>{
      //         params.context.handleRowSelect(params.data)
      //       }}>
      //         Details
      //       </span>
      //     )
      //   },
      // }
      {
  headerName: "Actions",
  field: "view",
  pinned: "right",
  maxWidth: 80,
  // minWidth:80,
  // autoHeight: true,
  // suppressSizeToFit: true,
  cellRenderer: (params: LeadDataProps | any) => {
    return (
      <div className="flex items-center justify-center  ">
        <span
          className="lead-details cursor-pointer text-blue-600 hover:underline "
          onClick={() => {
            params.context.handleRowSelect(params.data);
          }}
        >
          Details
        </span>
      </div>
    );
  },
}

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
    <div
      className="ag-theme-balham w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef} // Attach the ref
        rowData={leads}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{ handleRowSelect : onRowSelect}}
        onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default LeadManagementAgGrid;