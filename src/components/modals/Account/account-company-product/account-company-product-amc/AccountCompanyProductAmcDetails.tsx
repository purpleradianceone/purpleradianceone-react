import { useState } from "react";

import { AccountCompanyProductAmcUpdate } from "./AccountCompanyProductAmcUpdate";
import { useAccountCompanyProductAmc } from "../../../../../config/hooks/useAccountCompanyProductAmc";
import { AccountCompanyProductAmc } from "../../../../../@types/account/AccountCompanyProductAmc";
import LoadingSpinner from "../../../../../assets/animations/LoadingSpinner";
import { AccountCompanyProductAmcAggrid } from "../../../../ag-grid/AccountCompanyProductAmcAggrid";
import Button from "../../../../ui/Button";
import { AccountCompanyProductAmcCreate } from "./AccountCompanyProductAmcCreate";
import { useUserAccessModules } from "../../../../../config/hooks/useAccessModules";
import toast from "react-hot-toast";
import MESSAGE from "../../../../../constants/Messages";
import COLORS from "../../../../../constants/Colors";
import { CalendarClock,  } from "lucide-react";

export const AccountCompanyProductAmcDetails = ({
  accountCompanyProductId,
}: {
  accountCompanyProductId: number;
}) => {
  const {
    userHasAccessToAddAccountProductsAmc,
    userHasAccessToViewAccountProductsAmc,
  } = useUserAccessModules();
  // Note : gets the data for the grid from this hook
  const {
    accountCompanyProductAmc,
    loading,
    getCompanyProductAmc: trigerRefreshCall,
  } = useAccountCompanyProductAmc(accountCompanyProductId);

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

  if (!userHasAccessToViewAccountProductsAmc) return null;
  return (
    <div className="bg-white rounded-xl border p-1 grid gap-1 border-slate-200">
      <h3 className="flex items-center justify-between  table-header-custom rounded-t-md px-2">
       
       <div className="flex items-center gap-1">
       <div className={COLORS.SECTION_HEADER_ICON_STYLE}>
              <CalendarClock size={16} />
              </div>
        <span>AMC Details</span>
        </div>
        <div className="  hidden justify-end items-center text-xs gap-x-2 py-0.5 text-gray-500">
          <Button
            disabled={!userHasAccessToAddAccountProductsAmc}
            onClick={() => {
              if (userHasAccessToAddAccountProductsAmc) {
                setOpenCreateAmcForm(true);
              } else {
                toast.error(
                  MESSAGE.MODULE_ACCESS.ACCOUNT_COMPANY_PRODUCT_AMC
                    .DENIED_ADD_ACCESS,
                );
              }
            }}
            className={COLORS.ADD_BUTTON}
          >
            <span>+Add</span>
          </Button>
        </div>
      </h3>

      <div className={"w-full h-[20vh]"}>
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
