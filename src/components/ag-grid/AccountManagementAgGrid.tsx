/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgGridReact } from "ag-grid-react";
import Account from "../../@types/account/Account";
import { useMemo, useRef } from "react";
import {  AGGRID, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import { AllCommunityModule, ColDef,} from "ag-grid-community";

import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import { avatarColors } from "../../utils/colourSpecifierForNameInAggrid";
import { Eye } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

function AccountManagementAgGrid({
  accounts,
  handleRowClick,
  onRowSelect,
  isUsedForAccountLead,
  isDataLoading 

}: {
  accounts: Account[];
  handleRowClick?: (event:  any) => void;
  onRowSelect?: (data: Account | any) => void;
  isUsedForAccountLead : boolean;
  isDataLoading : boolean
}) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "name",
        headerName: "Name",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1.5,
        minWidth: 250,

        comparator: (valueA, valueB) => {
          if (!valueA) return -1;
          if (!valueB) return 1;

          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        },

        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }

          const name = params.data?.name?.trim() || "Account";

          const initials =
            name
              .trim()
              .split(/\s+/)
              .filter(Boolean)
              .map((word: string, index: number, array: string[]) =>
                index === 0 || index === array.length - 1 ? word.charAt(0) : "",
              )
              .join("")
              .substring(0, 2)
              .toUpperCase() || "A";

          const colorIndex =
            name
              .split("")
              .reduce(
                (acc: number, char: string) => acc + char.charCodeAt(0),
                0,
              ) % avatarColors.length;

          return (
            <div className="flex items-center gap-3 h-full px-2">
              <div
                className={`w-8 h-8 rounded-full text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 ${avatarColors[colorIndex]}`}
              >
                {initials}
              </div>

              <div className="flex flex-col justify-center overflow-hidden">
                <span className="text-sm font-semibold text-gray-800 truncate">
                  {params.data?.name}
                </span>

                <span className="text-xs text-gray-500 truncate">
                  {params.data?.email || "No Email"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        field: "email",
        headerName: "Email",
        sortable: true,
        filter: true,
        flex: 1.5,
        minWidth: 200,
        hide: true,
        
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
        minWidth: 150,
        comparator: (a, b) => a?.toLowerCase().localeCompare(b?.toLowerCase()),
        hide: isUsedForAccountLead
      },
      {
        field: "businessTypeName",
        headerName: "Business Type",
        sortable: true,
        filter: true,
        minWidth: 220,
        hide: isUsedForAccountLead,
        tooltipValueGetter(params) {
          return params.data.businessTypeName;
        },
      },

       {
        field: "isActive",
        headerName: "Status",
        sortable: true,
        filter: true,
        maxWidth: 120,

        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }
          return (
                <div className="h-full flex items-center">
                  <StatusBadge isActive={params.value} />
                </div>
              );
        },
      },
       {
        field: "countryName",
        headerName: "Country",
        sortable: true,
        filter: true,
        minWidth: 150,
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
          if (params.data?.__isSkeleton) {
                return (
                  <SkeletonRowsAgGrid/>
                );
              }
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
        maxWidth: 100,
        filter:false,
        // cellRenderer : ()=> "View",
        cellRenderer: (params: Account | any) => {
          if (params.data?.__isSkeleton) {
                return (
                  <SkeletonRowsAgGrid/>
                );
              }
         return (
        <div className="flex items-center justify-center h-full">
          <button
            className="lead-details"
            onClick={() => {
              params.context.handleRowSelect(params.data);
            }}
          >
            <Eye size={12} strokeWidth={1.5} />

            <span>
              {isUsedForAccountLead ? "Select" : "Details"}
            </span>
          </button>
        </div>
      );
        },
      },
    ],
    []
  );

  const skeletonRows = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      name: "",
      email: "",
      mobileNumber: "",
      industryTypeName: "",
      businessTypeName: "",
      countryName: "",
      stateName: "",
      districtName: "",
      pan: "",
      tan: "",
      gst: "",
      billingAddressan: "",
      shippingAddress: "",
      registeredOfficeAddress: "",
      businessResgistrationNumber: "",
      website: "",
      isActive: "",
      createdBy: "",
      createdOn: "",
      __isSkeleton: true,
    }));
  }, []);

  const defaultColDef = useMemo(
    () => ({
      filter: "agTextColumnFilter",
      minWidth: 150,
      flex: 0.8,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
       cellRenderer: (params: any) => {
              if (params.data?.__isSkeleton) {
                return (
                  <SkeletonRowsAgGrid/>
                );
              }
              return params.value;
            },
    }),
    []
  );

  return (
    <div
      className="modern-user-grid custom-height-scrollbar w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef} // Attach the ref
        rowData={ isDataLoading ? skeletonRows:  accounts}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        rowHeight={AGGRID.ROW_HEIGHT}
        headerHeight={AGGRID.HEADER_HEIGHT}
        // theme={themeBalham}
        // overlayNoRowsTemplate={INNERHTML.OVERLAY_NO_ROWS_TEMPLATE}
        context={{ handleRowSelect:  isDataLoading  ? undefined :  onRowSelect }}
        onRowClicked={ isDataLoading  ? undefined : handleRowClick}
      />
    </div>
  );
}

export default AccountManagementAgGrid;
