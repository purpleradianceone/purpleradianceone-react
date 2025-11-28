import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import { useAccountCompanyProductAmc } from "../../../../config/hooks/useAccountCompanyProductAmc";
import { AccountCompanyProductAmcAggrid } from "../../../ag-grid/AccountCompanyProductAmcAggrid";

export const AccountCompanyProductAmcDetails = ({
  accountCompanyProductId,
}: {
  accountCompanyProductId: number;
}) => {
  const { accountCompanyProductAmc, loading } = useAccountCompanyProductAmc(
    accountCompanyProductId
  );

  return (
    <div className="bg-white rounded-xl border p-1 grid gap-1 border-slate-200">
      <h3 className="bg-gray-100 table-header-custom rounded-t-md px-2">
        AMC Details
      </h3>

      <div className={"ag-theme-balham w-full h-[25vh]"}>
        {loading && <LoadingSpinner />}
        {!loading && (
          <AccountCompanyProductAmcAggrid data={accountCompanyProductAmc} />
        )}
      </div>
    </div>
  );
};
