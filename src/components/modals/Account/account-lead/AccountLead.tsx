/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import CreateAccountLeadType from "../../../../@types/account/CreateAccountLeadType";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { useEffect, useState } from "react";
import CreateAccountLead from "./CreateAccountLead";
import AccountLeadType from "../../../../@types/account/AccountLead";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import toast from "react-hot-toast";

const AccountLead = ({ account }: CreateAccountLeadType) => {
  const { loginStatus } = useLoggedInUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accountLead, setAccountLead] = useState<AccountLeadType[]>([]);

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

  if (isLoading) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  return (
    <div className="bg-white border flex flex-col gap-1 rounded-md p-2">
      <div className="bg-gray-100 table-header-custom rounded-t-md px-2">
        <span>Account lead</span>
      </div>
      {accountLead.length === 0 && (
        <>
          <div className="flex items-center justify-center">
            <span className="italic flex gap-1">
              <CreateAccountLead account={account} />
              No data available.
            </span>
          </div>
        </>
      )}
      {accountLead &&
        accountLead.map((item: AccountLeadType) => (
          <>
            <CreateAccountLead account={account} />
            <div className="p-1 bg-white shadow-md rounded-xl border border-gray-200 flex flex-col gap-3 w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.leadName}
                </h2>
                <label className="inline-flex items-center cursor-pointer relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={item.isActive}
                    id={item.id.toString()}
                    onChange={(e) => {
                      e.preventDefault();
                      handleAccountLeadStatusChange(item);
                    }}
                    readOnly
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />
                </label>
              </div>

              {/* Meta Info */}
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Created By:</span>{" "}
                  {item.createdBy}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Created On:</span>{" "}
                  {item.createdOn}
                </p>
              </div>
            </div>
          </>
        ))}
    </div>
  );
};

export default AccountLead;
