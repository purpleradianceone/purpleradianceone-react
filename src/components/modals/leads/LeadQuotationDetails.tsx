import React from "react";
import { Modules } from "../../../@types/List/CompanyQuotationManagementListProps";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import MESSAGE from "../../../constants/Messages";
import CompanyQuotationManagement from "../../views/company-quotation-management/CompanyQuotationManagement";
import AccessDeniedMessagePage from "../../views/not-found/AccessDeniedMessagePage";

type QuotationDetailsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lead: any;
};

const LeadQuotationDetails: React.FC<QuotationDetailsProps> = ({ lead, }) => {
  const { userHasAccessToViewLeadQuotation, } = useUserAccessModules();

  return (
    <div className="w-full  shadow-lg ">
      <div className="w-full gap-1">
        {userHasAccessToViewLeadQuotation ? (
          <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-1 ">
            <CompanyQuotationManagement otherData={lead} isUsedFor={Modules.LEAD_QUOTATION}/>
          </div>
        ) : (
          <AccessDeniedMessagePage
            message={MESSAGE.MODULE_ACCESS.LEAD_QUOTATION.DENIED_VIEW_ACCESS}
          />
        )}
      </div>
    </div>
  );
};

export default LeadQuotationDetails;