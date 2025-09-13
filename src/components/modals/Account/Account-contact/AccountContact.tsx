/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import { useEffect, useState } from "react";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import AccountContactType from "../../../../@types/account/AccountContact";

type AccountContactTypeComponent ={
    accountId : number
}

const AccountContact = ({
    accountId
}: AccountContactTypeComponent) => {
  const { loginStatus } = useLoggedInUserContext();
  const [accountContact, setAccountContact] = useState<AccountContactType[]>(
    []
  );
  const fetchAccountContact = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      account_id: accountId,
      isactive: true,
      requestedby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.GET_ACCOUNT_CONTACT, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const responseData = response.data;
          const mappedData: AccountContactType[] = responseData.map(
            (item: any) => ({
              id: item.id,
              accountId: item.account_id,
              name: item.name,
              email: item.email,
              mobileNumber: item.mobilenumber,
              address: item.address,
              department: item.department,
              designation: item.designation,
              preferredCommunicationChannel:item.preferred_communication_channel,
              preferredLanguage: item.preferref_language,
              isActive: item.isactive,
              createdBy: item.createdby,
              updatedBy: item.updatedby,
              createdOn: item.createdon,
              updatedOn: item.updatedon,
            })
          );

          //store that data in state.
          setAccountContact(mappedData);
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: fetchAccountContact,
          });
          if (refreshTokenResponse) {
            fetchAccountContact();
          }
        }
      });
  };

  //Note : call will go for the first render.
  useEffect(() => {
    fetchAccountContact();
  }, []);

  useEffect(() => {
    console.log(accountContact);
  }, [accountContact]);

  return (
    <>
      <div className="bg-gray-200">
        <h1>Account contact</h1>
      </div>
      <div className="flex items-center justify-center h-full text-gray-400 bg-pink-50"></div>
    </>
  );
};
export default AccountContact;
