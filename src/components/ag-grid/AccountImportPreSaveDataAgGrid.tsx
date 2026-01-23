/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AllCommunityModule, ColDef, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React, { useMemo, useRef } from "react";
import { AccountImportDataType } from "../../@types/account/AccountImportDataType";

const AccountImportPreSaveDataAgGrid: React.FC<{
  accountImportData: AccountImportDataType[];
  selectedIds: number[];
  onSelectedRow: (id: number, checked: boolean) => void;
}> = ({ accountImportData, selectedIds, onSelectedRow }) => {
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "Delete",
        field: "delete",
        width: 30,
        cellStyle: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        cellRenderer: (params: any) => {
          const rowId = params.data.id;
          const isChecked = params.context.selectedIds.includes(rowId);
          return (
            <div className="flex justify-center items-center">
              <input
                type="checkbox"
                className="checkbox"
                checked={isChecked}
                onChange={(e) =>
                  params.context.onSelectedRow(rowId, e.target.checked)
                }
              />
            </div>
          );
        },
      },
      { headerName: "ID", field: "id", hide: true },
      { headerName: "Name", field: "name" },
      { headerName: "Email", field: "email" },
      { headerName: "Mobile Number", field: "mobilenumber" },
      {
        headerName: "Company Account Type",
        field: "company_account_type_name",
        minWidth: 190,
      },
      {
        headerName: "Account Created On",
        field: "account_created_on",
        minWidth: 165,
      },
      { headerName: "Company ID", field: "company_id", hide: true },
      { headerName: "Count", field: "count", hide: true },

      { headerName: "Import Tag", field: "import_tag", hide: true },
      { headerName: "Industry Type Id", field: "industry_type_id", hide: true },

      { headerName: "Industry Type Name", field: "industry_type_name" },
      { headerName: "Business Type Id", field: "business_type_id", hide: true },
      { headerName: "Business Type Name", field: "business_type_name" },

      { headerName: "Country ID", field: "country_id", hide: true },
      { headerName: "Country", field: "country_name" },
      { headerName: "State ID", field: "state_id", hide: true },
      { headerName: "State", field: "state_name" },
      { headerName: "District ID", field: "district_id", hide: true },
      { headerName: "District", field: "district_name" },
      { headerName: "PAN", field: "pan" },
      { headerName: "GST", field: "gst" },
      { headerName: "TAN", field: "tan" },

      { headerName: "Billing Address", field: "billing_address" },
      { headerName: "Shipping Address", field: "shipping_address" },
      {
        headerName: "Registered Office Address",
        field: "registered_office_address",
      },
      {
        headerName: "Business Registration Number",
        field: "business_registration_number",
      },
      { headerName: "Website", field: "website" },
      { headerName: "Created On", field: "createdon" },
      { headerName: "Created By", field: "createdby_name" },
      { headerName: "Updated On", field: "updatedon" },
      { headerName: "Updated By", field: "updatedby_name" },
    ],
    [selectedIds],
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
        rowData={accountImportData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        modules={[AllCommunityModule]}
        theme={themeBalham}
        context={{
          selectedIds,
          onSelectedRow,
        }}
      />
    </div>
  );
};

export default AccountImportPreSaveDataAgGrid;
