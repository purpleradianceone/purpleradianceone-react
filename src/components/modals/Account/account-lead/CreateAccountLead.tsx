/* eslint-disable @typescript-eslint/no-explicit-any */
import Account from "../../../../@types/account/Account";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import Button from "../../../ui/Button";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import FormHeader from "../../../ui/FormHeader";
import { Handshake } from "lucide-react";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import axiosClient from "../../../../axios-client/AxiosClient";
import { LookupLeadManagement } from "../../../views/lookups/lookup-lead/LookupLeadManagement";
import { LookupLead } from "../../../../@types/lookup/LookupLead";
import { Popover } from "../../../ui/PopOver";
import COLORS from "../../../../constants/Colors";

const CreateAccountLead = ({
  account,
  getAccountLead,
}: {
  account: Account;

  getAccountLead: () => void;
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToAddAccountLeads } = useUserAccessModules();

  // const [showLeadsData, setShowLeadsData] = useState<boolean>(false);

  const handleRowSelectedForShowAccountLead = (rowData: LookupLead) => {
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

    await axiosClient
      .post(POST_API.CREATE_ACCOUNT_LEAD, postData, { withCredentials: true })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          // setShowLeadsData(false);
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
        <Popover
          accessRight={userHasAccessToAddAccountLeads}
          width={700}
          align="left"
          trigger={
            <Button
              disabled={!userHasAccessToAddAccountLeads}
              // onClick={() => {
              //   if (userHasAccessToAddAccountLeads) {
              //     setShowLeadsData(!showLeadsData);
              //   } else {
              //     toast.error(
              //       MESSAGE.MODULE_ACCESS.ACCOUNT_LEADS.DENIED_ADD_ACCESS
              //     );
              //   }
              // }}
             className={COLORS.ADD_BUTTON}            >
              <span>+Add</span>

              
            </Button>
          }
        >
          {(onClose) => (
            <>
            {/* <FormLayout width={6} padding={2}> */}
              <FormHeader
                icon={Handshake}
                onClose={() => {
                  onClose();
                  // setShowLeadsData(false);
                }}
                preText="Leads"
                description="Choose the lead that is linked to this account."
                />
              {/* Lead Management Content */}
              {/* <LeadManagement
              isUsedInLeadModule={false}
              handleRowSelectedForShowAccountLead={
                handleRowSelectedForShowAccountLead
                }
                /> */}
              <LookupLeadManagement
                handleRowSelectedForShowAccountLead={
                  handleRowSelectedForShowAccountLead
                }
                />
            {/* </FormLayout> */}
                </>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default CreateAccountLead;
