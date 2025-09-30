/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgGridReact } from "ag-grid-react";
import Account from "../../@types/account/Account";
import { useMemo, useRef } from "react";
import { INNERHTML, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import StatusIndicator from "../ui/StatusIndicator";

function AccountManagementAgGrid({
  accounts,
  handleRowClick,
  onRowSelect,
  isUsedForAccountLead
}: {
  accounts: Account[];
  handleRowClick?: (event:  any) => void;
  onRowSelect?: (data: Account | any) => void;
  isUsedForAccountLead : boolean
}) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    () => [
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
        field: "industryTypeName",
        headerName: "Industry type",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 180,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
        hide: isUsedForAccountLead
      },
      {
        field: "businessTypeName",
        headerName: "Business Type",
        sortable: true,
        filter: true,
        minWidth: 200,
        hide: isUsedForAccountLead,
        tooltipValueGetter(params) {
          return params.data.businessTypeName;
        },
      },
       {
        field: "countryName",
        headerName: "Country",
        sortable: true,
        filter: true,
        minWidth: 200,
        tooltipValueGetter(params) {
          return params.data.countryName;
        },
        hide: isUsedForAccountLead
      },
       {
        field: "stateName",
        headerName: "State",
        sortable: true,
        filter: true,
        minWidth: 200,
        tooltipValueGetter(params) {
          return params.data.stateName;
        },
        hide: isUsedForAccountLead
      },
       {
        field: "districtName",
        headerName: "District",
        sortable: true,
        filter: true,
        minWidth: 200,
        tooltipValueGetter(params) {
          return params.data.districtName;
        },
        hide: isUsedForAccountLead
      },
      {
        field: "pan",
        headerName: "PAN",
        sortable: true,
        filter: true,
        hide: isUsedForAccountLead
      },
      
      {
        field: "gst",
        headerName: "GST",
        sortable: true,
        filter: true,
        minWidth: 180,
        tooltipValueGetter(params) {
          return params.data.gst;
        },
        hide: isUsedForAccountLead
      },
      {
        field: "tan",
        headerName: "TAN",
        sortable: true,
        filter: true,
        hide: isUsedForAccountLead
      },
      {
        field: "billingAddress",
        headerName: "Billing address",
        sortable: true,
        filter: true,
        hide: isUsedForAccountLead,
        minWidth: 250,
        tooltipValueGetter(params) {
          return params.data.billingAddress;
        },
        onCellClicked(params) {
          const address = encodeURIComponent(
            params.data.registeredOfficeAddress
          );

          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;

          window.open(googleMapsUrl, "_blank");
        },
      },
      {
        field: "shippingAddress",
        headerName: "Shipping address",
        sortable: true,
        filter: true,
        hide: isUsedForAccountLead,
        minWidth: 250,
        tooltipValueGetter(params) {
          return params.data.shippingAddress;
        },
        onCellClicked(params) {
          const address = encodeURIComponent(
            params.data.registeredOfficeAddress
          );

          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;

          window.open(googleMapsUrl, "_blank");
        },
      },
      {
        field: "registeredOfficeAddress",
        headerName: "Registered Office Add.",
        sortable: true,
        filter: true,
        hide: isUsedForAccountLead,
        minWidth: 250,
        tooltipValueGetter(params) {
          return params.data.registeredOfficeAddress;
        },
        onCellClicked(params) {
          const address = encodeURIComponent(
            params.data.registeredOfficeAddress
          );

          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;

          window.open(googleMapsUrl, "_blank");
        },
      },
      {
        field: "businessResgistrationNumber",
        headerName: "Business registration number",
        sortable: true,
        hide: isUsedForAccountLead,
        filter: true,
      },
      {
        field: "website",
        headerName: "Website",
        sortable: true,
        filter: true,
        minWidth: 250,
        hide: isUsedForAccountLead,
        cellDataType: "text",
        tooltipValueGetter(params) {
          return params.data.website;
        },
        cellRenderer: (params: any) => {
          if (!params.value) {
            return null;
          }
          return (
            <a
              className="text-blue-700"
              href={params.value}
              target="_blank"
              rel="noopener noreferrer"
            >
              {params.value}
            </a>
          );
        },
      },
      {
        field: "isActive",
        headerName: "Status",
        sortable: true,
        filter: true,
        hide: isUsedForAccountLead,
        cellRenderer: (params: any) => {
          return (
            <div className="flex items-center text-sm gap-1 mt-1">
             <StatusIndicator isActive={params.value}/>
            </div>
          );
        },
      },
      {
        field: "createdBy",
        headerName: "Created by",
        filter: true,
        hide: isUsedForAccountLead
      },
      {
        field: "createdOn",
        headerName: "Created on",
        sortable: true,
        filter: true,
        hide: isUsedForAccountLead
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
          color: "#2563eb", // Tailwind's blue-600
          textDecoration: "none",
          cursor: "pointer",
          fontWeight: "400",
        },
      },
      {
        headerName: "Actions",
        field: "view",
        pinned: "right",
        maxWidth: 80,
        // cellRenderer : ()=> "View",
        cellRenderer: (params: Account | any) => {
          
          return (
              <div className="flex items-center justify-center">
            <span
              className="lead-details"
              onClick={() => {
                params.context.handleRowSelect(params.data);
              }}
              >
              {isUsedForAccountLead ? "Select" : "Details"}
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
    <div
      className="ag-theme-balham w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef} // Attach the ref
        rowData={accounts}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{ handleRowSelect: onRowSelect }}
        onRowClicked={handleRowClick}
      />
    </div>
  );
}

export default AccountManagementAgGrid;
