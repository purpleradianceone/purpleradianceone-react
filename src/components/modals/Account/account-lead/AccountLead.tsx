/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import CreateAccountLeadType from "../../../../@types/account/CreateAccountLeadType";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import {  STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { useEffect, useState } from "react";
import CreateAccountLead from "./CreateAccountLead";
import AccountLeadType from "../../../../@types/account/AccountLead";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import toast from "react-hot-toast";
import ToggleButton from "../../../ui/ToggleButton";
import ROUTES_URL from "../../../../constants/Routes";
import qs from "query-string";
import { useNavigate } from "react-router-dom";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import MESSAGE from "../../../../constants/Messages";

const AccountLead = ({ account }: CreateAccountLeadType) => {
  const { loginStatus } = useLoggedInUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accountLead, setAccountLead] = useState<AccountLeadType[]>([]);
  const {userHasAccessToViewLead, userHasAccessToUpdateAccount} = useUserAccessModules();
  const navigate = useNavigate();
  // Note : get api call
  const getAccountLead = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      account_id: account.id,
      lead_id: null,
      requestedby: loginStatus.id,
    };

    await axios
      .post(POST_API.GET_ACCOUNT_LEAD, postData, { withCredentials: true })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const data = response.data;

          const filteredData: AccountLeadType[] = data.map((item: any) => ({
            id: item.id,
            accountId: item.account_id,
            accountName: item.account_name,
            leadId: item.lead_id,
            leadName: item.lead_name,
            leadEmail: item.lead_email,
            leadMobileNumber: item.lead_mobilenumber,
            isActive: item.isactive,
            createdBy: item.createdby,
            createdOn: item.createdon,
            updatedBy: item.updatedby,
            updatedOn: item.updatedon,
          }));

          setAccountLead(filteredData);
          setIsLoading(false);
        }
      }) // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getAccountLead,
          });
          if (refreshTokenResponse) {
            getAccountLead();
          }
        }
      });
  };
  // Note : first time api call when component renders.
  useEffect(() => {
    getAccountLead();
  }, []);

  // update api call
  const handleAccountLeadStatusChange = async (
    leadAccount: AccountLeadType
  ) => {
    const status = !leadAccount.isActive;
    console.log(status);

    const postData = {
      company_id: loginStatus.companyId,
      id: leadAccount.id,
      isactive: status,
      updatedby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.UPDATE_ACCOUNT_LEAD, postData, { withCredentials: true })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          getAccountLead();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithParamsNotEvent: handleAccountLeadStatusChange,
          });
          if (refreshTokenResponse) {
            handleAccountLeadStatusChange(leadAccount);
          }
        }
      });
  };

  const getLeadDetails = async (leadId: number) => {
    // if(companyUserId === null || companyUserId !== loginStatus.id){
    //   toast.error(MESSAGE.ERROR.YOU_ARE_NOT_ON_YOUR_DASHBOARD)
    //   return ;
    // }
    const postDataToGetLead = {
      company_id: loginStatus.companyId,
      id: leadId,
      requestedby: loginStatus.id,
    };
    await axios
      .post(POST_API.GET_LEAD, postDataToGetLead, {
        withCredentials: true,
      })
      .then((response) => {
        const leadData = response.data.map((item: any) => {
          const queryParams = qs.stringify({
            leadData: JSON.stringify({
              id: item.id,
              name: item.name,
              email: item.email,
              mobileNumber: item.mobilenumber,
              companyId: item.company_id,
              companyUserId: item.ownerid,
              count: item.count,
              createdBy: item.createdby,
              createdOn: item.createdon,
              leadOwner: item["Lead Owner"],
              leadSource: item["Lead Source"],
              leadSourceId: item.lead_source_id,
              leadStatus: item["Lead Status"],
              leadStatusId: item.lead_status_id,
              updatedBy: item.updatedby,
              updatedOn: item.updatedon,
            }),
          });
          return queryParams;
        });
        navigate(ROUTES_URL.LEAD_DETAILS + `?${leadData}`);
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithParamsNotEvent: getLeadDetails,
          });

          // setIsDialogueOpen(!refreshTokenStatus);
          if (refreshTokenStatus) {
            getLeadDetails(leadId);
          }
        }
      });
  };

  const handleAccountLead = (leadId :number) =>{
    if(leadId!==0) {
      getLeadDetails(leadId);
    }
  }

return (
  <div className="bg-white border flex flex-col  rounded-lg p-1 max-h-96 overflow-auto">
    {/* Header */}
    <div className="bg-gray-100 table-header-custom rounded-t-md px-2 ">
      <span>Account related leads</span>
    </div>

    {
      isLoading && (
        <div className="h-20 flex items-center justify-center">

          <LoadingSpinner />
        </div>
      )
    }
    {/* Empty State */}
    {!isLoading && accountLead.length === 0 && (
      <div className="flex items-center justify-center py-4">
        <span className="italic caption-custom flex gap-1 items-center ">
          <CreateAccountLead account={account} getAccountLead={getAccountLead} />
          No leads available.
        </span>
      </div>
    )}

    {/* Add button (if data exists) */}
    {accountLead.length > 0 && (
      <div className="py-0.5">
        <CreateAccountLead getAccountLead={getAccountLead} account={account} />
      </div>
    )}

    {/* Leads Grid */}
    {accountLead.length > 0 && (
      <div className="grid md:grid-cols-2 gap-1 w-full">
        {accountLead.map((item: AccountLeadType) => (
          <div
          onClick={() =>{
            if(userHasAccessToViewLead){
              handleAccountLead(item.leadId)
            }else{
              toast.error(MESSAGE.MODULE_ACCESS.LEAD_MODULE.DENIED_VIEW_ACCESS)
            }
          }}
            key={item.id}
            className="p-2 cursor-pointer hover:white-text  hover:shadow-md  bg-white shadow-sm rounded-xl border border-gray-200 flex flex-col "
          >
            {/* Header */}
            <div className=" flex justify-between items-start">
              <div className="flex flex-col">
                <h2 title={item.leadName || ""} className=" input-label-custom hover:text-blue-500 ">
                  {item.leadName && item.leadName.length>35  ? item.leadName.substring(0,34)+"..." : item.leadName || <><span className="text-xs italic">Name not given</span></>}
                </h2>
                <p title={item.leadEmail || ""} className="caption-custom hover:text-blue-500">{item.leadEmail || <><span className="italic">email - not given</span></>}</p>
                <p  title={item.leadMobileNumber || ""} className="caption-custom hover:text-blue-500">{item.leadMobileNumber || <><span className="italic">mobile number - not given</span></>}</p>
              </div>

              {/* Toggle */}
              <div onClick={(e) => e.stopPropagation()}>
              <ToggleButton
                  checked={item.isActive}
                  name={item.id.toString()}
                  onToggle={() => {
                    // e.stopPropagation();
                    if(userHasAccessToUpdateAccount){
                      handleAccountLeadStatusChange(item);
                    }else{
                      toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS)
                    }
                  }}
                />
                </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

};

export default AccountLead;
