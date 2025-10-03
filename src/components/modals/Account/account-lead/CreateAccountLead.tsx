/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Account from "../../../../@types/account/Account";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import Button from "../../../ui/Button";
import LeadManagement from "../../../views/lead-management/LeadManagement";
import LeadDataProps from "../../../../@types/lead-management/LeadProps";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import FormHeader from "../../../ui/FormHeader";
import { Handshake } from "lucide-react";

const CreateAccountLead = ({
  account,
  getAccountLead,
}: {
  account: Account;

  getAccountLead: () => void;
}) => {
  const { loginStatus } = useLoggedInUserContext();

  const [showLeadsData, setShowLeadsData] = useState<boolean>(false);

  const handleRowSelectedForShowAccountLead = (rowData: LeadDataProps) => {
    // calling the api
    if (rowData) {
      createAccountLead(rowData.id);
    }
  };
  const createAccountLead = async (leadId: number) => {
    if (leadId === undefined || leadId === null || leadId === 0) {
      return;
    }
    const postData = {
      company_id: loginStatus.companyId,
      account_id: account.id,
      lead_id: leadId,
      is_lead_converted: null,
      createdby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.CREATE_ACCOUNT_LEAD, postData, { withCredentials: true })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          setShowLeadsData(false);
        } else {
          toast.error(response.data.message);
        }
        getAccountLead();
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithParamsNotEvent: createAccountLead,
          });
          if (refreshTokenResponse) {
            createAccountLead(leadId);
          }
        }
      });
  };

  return (
    <div className="  flex  justify-end ">
      {/* Header */}
      <div className="flex justify-end items-center text-xs gap-x-2 py-0.5 text-gray-500">
        <Button
          onClick={() => {
            setShowLeadsData(!showLeadsData);
          }}
          className="bg-blue-600 hover:bg-blue-700 caption-custom white-text px-1 py-0.5 rounded-md flex items-center gap-1"
        >
          <span>+Add</span>
        </Button>
      </div>
      {showLeadsData && (
        <div className="fixed inset-0 z-50 mt-10 flex items-center justify-center bg-black bg-opacity-5 ">
          <div className=" bg-white border rounded-2xl shadow-xl w-full max-w-6xl p-2 max-h-[85vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
            <FormHeader
              icon={Handshake}
              onClose={()=>{
                setShowLeadsData(false)
              }}
              preText="Leads"
              description="Choose the lead that is linked to this account."
            />
            {/* Lead Management Content */}
            <LeadManagement
              isUsedInLeadModule={false}
              handleRowSelectedForShowAccountLead={
                handleRowSelectedForShowAccountLead
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccountLead;
