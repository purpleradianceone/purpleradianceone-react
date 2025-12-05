import React from "react";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import { AccountCompanyProductWarrantyAgGrid } from "../../../ag-grid/AccountCompanyProductWarrantyAgGrid";
import { useAccountCompanyProductWarranty } from "../../../../config/hooks/useAccountCompanyProductWarranty";

interface AccountCompanyProductWarrantyDetails {
  accountCompanyProductId: number;
}
export const AccountCompanyProductWarrantyDetails: React.FC<
  AccountCompanyProductWarrantyDetails
> = ({ accountCompanyProductId }) => {
  const { accountCompanyProductWarranty: data, loading } =
    useAccountCompanyProductWarranty(accountCompanyProductId);

  return (
    <div className="bg-white rounded-xl border p-1 grid gap-1 border-slate-200">
      <h3 className="bg-gray-100 table-header-custom rounded-t-md px-2">
        Warranty Details
      </h3>

      <div className={"ag-theme-balham w-full h-[25vh]"}>
        {loading && <LoadingSpinner />}
        {!loading && <AccountCompanyProductWarrantyAgGrid data={data} />}
      </div>
    </div>
  );
};
