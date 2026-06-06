/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef } from "react";
import { AGGRID, JSX_CHILDREN_NAME } from "../../constants/AppConstants";
import LeadManagementAgGridProps from "../../@types/ag-grid/LeadManagementAgGridProps";
import LeadDataProps from "../../@types/lead-management/LeadProps";
import { SkeletonRowsAgGrid } from "../ui/SkeletonRowsAgGrid";
import {
  avatarColors,
  leadStatusStyles,
} from "../../utils/colourSpecifierForNameInAggrid";
import { Eye, User } from "lucide-react";

function LeadManagementAgGrid({
  leads,
  onRowSelect, //selected user for view lead details
  handleRowClick,
  isUsedInLeadModule,
  isLoadingData,
}: LeadManagementAgGridProps) {
  const gridRef = useRef<AgGridReact>(null); // Ref to the AgGridReact component

  const renderUserWithIcon = (params: any) => {
    if (params.data?.__isSkeleton) {
      return <SkeletonRowsAgGrid />;
    }

    return (
      <div className="flex items-center  gap-1 h-full">
        <div className="w-3 h-3 rounded-full flex items-center justify-center">
          <User />
        </div>

        <span className=" truncate">{params.value || "-"}</span>
      </div>
    );
  };

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        hide: true,
        field: "id",
        headerName: "leadid",
      },
      {
        field: "name",
        headerName: "Lead Name",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1.5,
        minWidth: 240,

        comparator: (valueA, valueB) => {
          if (!valueA) return -1;
          if (!valueB) return 1;

          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        },

        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }

          const name = params.data?.name?.trim() || "-";

          const email = params.data?.email?.trim();
          const mobileNumber = params.data?.mobileNumber?.trim();

          const secondaryText = email || mobileNumber || "-";

          // avatar source only
          const avatarSource =
            params.data?.name?.trim() || params.data?.email?.trim() || "-";

          const initials =
            avatarSource !== "-"
              ? avatarSource
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((word: string, index: number, array: string[]) =>
                    index === 0 || index === array.length - 1
                      ? word.charAt(0)
                      : "",
                  )
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
              : "-";

          const colorIndex =
            avatarSource !== "-"
              ? avatarSource
                  .split("")
                  .reduce(
                    (acc: number, char: string) => acc + char.charCodeAt(0),
                    0,
                  ) % avatarColors.length
              : 0;

          return (
            <div className="flex items-center gap-3 h-full px-2 overflow-hidden">
              <div
                className={`w-8 h-8 rounded-full text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 ${
                  avatarColors[colorIndex]
                }`}
              >
                {initials}
              </div>

              <div className="flex flex-col justify-center overflow-hidden">
                <span className="text-sm font-semibold text-gray-800 truncate">
                  {name}
                </span>

                <span className="text-xs text-gray-500 truncate">
                  {secondaryText}
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
        field: "leadOwner",
        headerName: "Owner",
        sortable: true,
        filter: "agTextColumnFilter",
        flex: 1,
        minWidth: 180,
        cellRenderer: renderUserWithIcon,
      },
      {
        field: "leadStatus",
        headerName: "Status",
        sortable: true,
        filter: true,
        minWidth: 170,

        cellRenderer: (params: any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
          }

          const status = params.value || "-";

          return (
            <div className="flex items-center h-full">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  leadStatusStyles[status] || "bg-slate-100 text-slate-700"
                }`}
              >
                {status}
              </span>
            </div>
          );
        },
      },
      {
        field: "leadSource",
        headerName: "Source",
        sortable: true,
        filter: true,
      },
      {
        field: "countryName",
        headerName: "Country",
        sortable: true,
        filter: true,
      },
      {
        field: "stateName",
        headerName: "State",
        sortable: true,
        filter: true,
      },
      {
        field: "districtName",
        headerName: "District",
        sortable: true,
        filter: true,
      },

      {
        field: "leadDetailAddress",
        headerName: "Address",
        sortable: true,
        filter: true,
      },
      {
        field: "createdBy",
        headerName: "Created by",
        filter: true,
        cellRenderer: renderUserWithIcon,
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
        cellRenderer: renderUserWithIcon,
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
          color: "#2563eb", // Tailwind's blue-600
          textDecoration: "none",
          cursor: "pointer",
          fontWeight: "400",
        },
      },
      {
        headerName: "Actions",
        // hide: !isUsedInLeadModule,
        field: "view",
        pinned: "right",
        maxWidth: 80,
        filter: false,
        // minWidth:80,
        // autoHeight: true,
        // suppressSizeToFit: true,
        cellRenderer: (params: LeadDataProps | any) => {
          if (params.data?.__isSkeleton) {
            return <SkeletonRowsAgGrid />;
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
            {isUsedInLeadModule ? "Details" : "Select"}
          </span>
        </button>
      </div>
    );
        },
      },
    ],
    [],
  );

  const skeletonRows = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      name: "",
      email: "",
      mobileNumber: "",
      leadOwner: "",
      leadStatus: "",
      leadSource: "",
      countryName: "",
      stateName: "",
      districtName: "",
      leadDetailAddress: "",
      createdBy: "",
      createdOn: "",
      updatedBy: "",
      updatedOn: "",
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
          return <SkeletonRowsAgGrid />;
        }

        return (
          <span className="">
            {params.value !== null &&
            params.value !== undefined &&
            params.value !== ""
              ? params.value
              : "-"}
          </span>
        );
      },
    }),
    [],
  );

  return (
    <div
      className=" w-full modern-user-grid custom-height-scrollbar "
      style={{ height: "100%", width: "100%" }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={isLoadingData ? skeletonRows : leads}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        context={{
          handleRowSelect: isLoadingData ? undefined : onRowSelect,
        }}
        onRowClicked={isLoadingData ? undefined : handleRowClick}
        rowHeight={AGGRID.ROW_HEIGHT}
        headerHeight={AGGRID.HEADER_HEIGHT}
        suppressCellFocus={true}
        suppressRowClickSelection={true}
        rowSelection="multiple"
      />
    </div>
  );
}

export default LeadManagementAgGrid;
