import React, { useState } from "react";
import LoadingSpinner from "../../../../../assets/animations/LoadingSpinner";
import { AccountCompanyProductWarrantyAgGrid } from "../../../../ag-grid/AccountCompanyProductWarrantyAgGrid";
import { useAccountCompanyProductWarranty } from "../../../../../config/hooks/useAccountCompanyProductWarranty";
import { AccountCompanyProductWarranty } from "../../../../../@types/account/AccountCompanyProductWarranty";
import { AccountCompanyProductWarrantyUpdate } from "./AccountCompanyProductWarrantyUpdate";
import Button from "../../../../ui/Button";
import { AccountCompanyProductWarrantyCreate } from "./AccountCompanyProductWarrantyCreate";
import { useUserAccessModules } from "../../../../../config/hooks/useAccessModules";
import toast from "react-hot-toast";
import MESSAGE from "../../../../../constants/Messages";

interface AccountCompanyProductWarrantyDetails {
  accountCompanyProductId: number;
}
export const AccountCompanyProductWarrantyDetails: React.FC<
  AccountCompanyProductWarrantyDetails
> = ({ accountCompanyProductId }) => {
  const {
    userHasAccessToAddAccountProductsWarranty,
    userHasAccessToViewAccountProductsWarranty,
  } = useUserAccessModules();
  // Note : function to fetch the data for the list
  const {
    accountCompanyProductWarranty: data,
    loading,
    getAccountCompanyProductWarranty: refreshCall,
  } = useAccountCompanyProductWarranty(accountCompanyProductId);

  // Note: state to update selected amc
  const [selectedAmcForUpdate, setSelectedAmcForUpdate] =
    useState<AccountCompanyProductWarranty | null>(null);

  // Note : State to manage for open close of AMC creation
  const [openCreateWarrantyForm, setOpenCreateWarrnatyForm] =
    useState<boolean>(false);

  // Note : function to update the state of selectedAmcForUpdate
  const handleRowSelectForUpdate = (data: AccountCompanyProductWarranty) => {
    if (!data) return;

    setSelectedAmcForUpdate(data);
  };

  // Note : function to update the state of selectedAmcForUpdate which will close the form
  function handleUpdateWarrantyFormClose() {
    setSelectedAmcForUpdate(null);
  }

  if (!userHasAccessToViewAccountProductsWarranty) return null;
  return (
    <div className="bg-white rounded-xl border p-1 grid gap-1 border-slate-200">
      <h3 className="flex items-center justify-between bg-gray-100 table-header-custom rounded-t-md px-2">
        <span>Warranty Details</span>
        <div className="justify-end items-center text-xs gap-x-2 py-0.5 text-gray-500">
          <Button
            disabled={!userHasAccessToAddAccountProductsWarranty}
            onClick={() => {
              if (userHasAccessToAddAccountProductsWarranty) {
                setOpenCreateWarrnatyForm(true);
              } else {
                toast.error(
                  MESSAGE.MODULE_ACCESS.ACCOUNT_COMPANY_PRODUCT_WARRANTY
                    .DENIED_ADD_ACCESS,
                );
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 caption-custom white-text px-1 py-0.5 rounded-md flex items-center gap-1"
          >
            <span>+Add</span>
          </Button>
        </div>
      </h3>

      <div className={"ag-theme-balham w-full h-[20vh]"}>
        {loading && <LoadingSpinner />}
        {!loading && (
          <AccountCompanyProductWarrantyAgGrid
            data={data}
            onRowSelect={handleRowSelectForUpdate}
          />
        )}
      </div>

      {selectedAmcForUpdate && (
        <AccountCompanyProductWarrantyUpdate
          handleCloseForm={handleUpdateWarrantyFormClose}
          selectedAmcForUpdate={selectedAmcForUpdate}
          onSuccess={refreshCall}
        />
      )}
      {openCreateWarrantyForm && (
        <AccountCompanyProductWarrantyCreate
          accountCompanyProductId={accountCompanyProductId}
          isOpen={openCreateWarrantyForm}
          onClose={() => {
            setOpenCreateWarrnatyForm(false);
          }}
          onSuccess={refreshCall}
        />
      )}
    </div>
  );
};
