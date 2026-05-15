import React from "react";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import CompanyQuotationManagement from "../../../views/company-quotation-management/CompanyQuotationManagement";
import AccessDeniedMessagePage from "../../../views/not-found/AccessDeniedMessagePage";
import MESSAGE from "../../../../constants/Messages";
import { Modules } from "../../../../@types/List/CompanyQuotationManagementListProps";


type QuotationDetailsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  account: any;
};

const AccountQuotationDetails: React.FC<QuotationDetailsProps> = ({ account, }) => {
  const { userHasAccessToViewAccountQuotation, } = useUserAccessModules();

  return (
    <div className="w-full  shadow-lg ">
      <div className="w-full gap-1">
        {userHasAccessToViewAccountQuotation ? (
          <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-1 ">
            <CompanyQuotationManagement otherData={account} isUsedFor={Modules.AMC_QUOTATION}/>
          </div>
        ) : (
          <AccessDeniedMessagePage
            message={MESSAGE.MODULE_ACCESS.ACCOUNT_QUOTATION.DENIED_VIEW_ACCESS}
          />
        )}
      </div>
    </div>
  );
};

export default AccountQuotationDetails;