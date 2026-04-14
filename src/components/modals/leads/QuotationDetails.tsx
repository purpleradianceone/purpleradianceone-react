import React from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import Button from "../../ui/Button";
import AccessDeniedMessagePage from "../../views/not-found/AccessDeniedMessagePage";
import MESSAGE from "../../../constants/Messages";

type QuotationDetailsProps = {
  id: number;
  quotation_type_id: number;
};

const QuotationDetails: React.FC<QuotationDetailsProps> = ({ id, quotation_type_id }) => {
  const { userHasAccessToViewLeadQuotation, userHasAccessToAddLeadQuotation } = useUserAccessModules();

  return (
    <div className="w-full  shadow-lg ">
      <div className="w-full gap-1">
        <div className="sticky top-16 flex bg-gray-200 shadow-sm  mb-1.5 w-full">
          <div className="flex justify-between  w-full pr-3 py-1">
            <span className="table-header-custom pl-1  text-center ">
              Quotation
            </span>
            {userHasAccessToAddLeadQuotation && (
              <div className="flex justify-end items-center text-xs gap-x-2  text-gray-500">
                <Button
                  disabled={!userHasAccessToAddLeadQuotation}
                  className="bg-blue-600 hover:bg-blue-700 caption-custom white-text px-1 py-0.5 rounded-md flex items-center gap-1"
                  onClick={() => {}}
                >
                  +Generate Quotation
                </Button>
              </div>
            )}
          </div>
        </div>
        {userHasAccessToViewLeadQuotation ? (
          <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-2 ">
            {`Id: ${id}`}
            <br />
            {`Quotation Type Id: ${quotation_type_id}`}
            <br />
            Quotation List
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

export default QuotationDetails;