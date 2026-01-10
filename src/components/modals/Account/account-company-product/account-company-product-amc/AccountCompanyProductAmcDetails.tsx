import { useState } from "react";

import { AccountCompanyProductAmcUpdate } from "./AccountCompanyProductAmcUpdate";
import { useAccountCompanyProductAmc } from "../../../../../config/hooks/useAccountCompanyProductAmc";
import { AccountCompanyProductAmc } from "../../../../../@types/account/AccountCompanyProductAmc";
import LoadingSpinner from "../../../../../assets/animations/LoadingSpinner";
import { AccountCompanyProductAmcAggrid } from "../../../../ag-grid/AccountCompanyProductAmcAggrid";
import Button from "../../../../ui/Button";
import { AccountCompanyProductAmcCreate } from "./AccountCompanyProductAmcCreate";

export const AccountCompanyProductAmcDetails = ({
  accountCompanyProductId,
}: {
  accountCompanyProductId: number;
}) => {
  // Note : gets the data for the grid from this hook
  const { accountCompanyProductAmc, loading , getCompanyProductAmc : trigerRefreshCall} = useAccountCompanyProductAmc(
    accountCompanyProductId
  );

  // Note : selected amc from the grid for update
  const [selectedAmcForUpdate, setSelectedAmcForUpdate] =
    useState<AccountCompanyProductAmc | null>(null);

  // Note : State to manage for open close of AMC creation
  const [openCreateAmcForm, setOpenCreateAmcForm] = useState<boolean>(false);

  // Note : function to set state for update operation
  const handleRowSelectForUpdate = (data: AccountCompanyProductAmc) => {
    if (!data) return;
    setSelectedAmcForUpdate(data);
  };

  // Note : function to handle form close operation
  function handleUpdateAmcFormClose() {
    setSelectedAmcForUpdate(null);
  }

  return (
    <div className="bg-white rounded-xl border p-1 grid gap-1 border-slate-200">
      <h3 className="flex items-center justify-between bg-gray-100 table-header-custom rounded-t-md px-2">
        <span>AMC Details</span>
        <div className="flex justify-end items-center text-xs gap-x-2 py-0.5 text-gray-500">
          <Button
            disabled={false}
            onClick={() => {
              // if (true) {
                setOpenCreateAmcForm(true);
              // } else {
              //   toast.error(
              //     MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS
              //   );
              // }
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
          <AccountCompanyProductAmcAggrid
            data={accountCompanyProductAmc}
            onRowSelect={handleRowSelectForUpdate}
          />
        )}
      </div>

      {selectedAmcForUpdate && (
        <AccountCompanyProductAmcUpdate
          handleCloseForm={handleUpdateAmcFormClose}
          selectedAmcForUpdate={selectedAmcForUpdate}
          onSuccess={trigerRefreshCall}
        />
      )}

      {openCreateAmcForm && (
        <AccountCompanyProductAmcCreate
          isOpen={openCreateAmcForm}
          onClose={() => {
            setOpenCreateAmcForm(false);
          }}
          accountCompanyProductId={accountCompanyProductId}
          onSuccess={trigerRefreshCall}
        />
      )}
    </div>
  );
};
