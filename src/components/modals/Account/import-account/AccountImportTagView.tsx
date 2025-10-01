/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import AccountImportData from "./AccountImportData";
import AccountImportTagData from "../../../../@types/account/AccountImportTagData";

const AccountImportTagView = ({
  isTagClick
 
}: {
  isTagClick: () => void;
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const [accountImportTagData, setAccountImportTagData] = useState<
    AccountImportTagData[]
  >([]);
  const [selectedAccountTag, setSelectedAccountTag] = useState<string>();
  const [accountimportTagDataCame, setAccountImportTagDataCame] =
    useState<boolean>(true);

  const getAccountImportTags = async () => {
    const postDataToGetAccountImportTags = {
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
    };
    await axios
      .post(POST_API.GET_ACCOUNT_IMPORT_IMPORT_TAG, postDataToGetAccountImportTags, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        setAccountImportTagDataCame(false);
        setAccountImportTagData(data);
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: getAccountImportTags,
          });
          if (refreshTokenStatus) {
            getAccountImportTags();
          }
        }
      });
  };

   function  onCloseOrUnselectTag(){
    setSelectedAccountTag("");
  }

  useEffect(()=>{

    if(selectedAccountTag){
      isTagClick();
    }
  },[selectedAccountTag])

  useEffect(() => {
    getAccountImportTags();
  }, []);


  return (
    <div className="bg-gray-50 rounded-xl shadow-md p-2 space-y-4 border border-gray-100">
      {/* Header */}
      {accountImportTagData.length > 0 && (
        <div className="bg-white p-2 rounded-lg shadow-sm border-b">
          <h2 className="table-header-custom mt-1">
            Account Import Tags : 
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed space-y-0 mt-4">
            <p className="table-header-custom">📌 How Tags Work:</p>

            <ul className="input-label-custom list-disc pl-6 space-y-1">
               <li>
                Tags are created automatically , when we import the accounts and current accounts are not merged into account table.
              </li>
              <li>
                By clicking on a tag, you can view all the accounts associated with
                it.
              </li>
              <li>
                To delete specific accounts from tag, select them and click
                <span className="font-semibold text-red-600 ml-1">Delete </span> button.
              </li>
              <li>
                To move all accounts from a tag to the main account data, select the
                tag and click
                <span className="font-semibold text-blue-600 ml-1">
                  Move all Accounts to Account data
                </span>
                . 
              </li>
            </ul>

            <div className="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              ⚠️{" "}
              <span className="caption-custom">
                Once moved, this action cannot be undone.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loader */}
      {accountimportTagDataCame && (
        <div className="flex justify-center items-center h-20">
          <LoadingSpinner />
        </div>
      )}

      {/* Empty State */}
      {accountImportTagData.length === 0 && !accountimportTagDataCame && (
        <div className="flex justify-center py-6">
          <span className="caption-custom">No tags found.</span>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {accountImportTagData.length > 0 &&
          accountImportTagData.map((data, index) => (
            <button
              key={index}
              onClick={() => setSelectedAccountTag(data.import_tag)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 border shadow-sm
              ${
                selectedAccountTag === data.import_tag
                  ? " text-white border-blue-600 shadow-md table-header-custom-blue "
                  : "bg-white hover:bg-blue-50 hover:border-blue-300 table-header-custom"
              }`}
            >
              {data.import_tag}
            </button>
          ))}
      </div>

      {/* Selected Tag Leads */}
      {selectedAccountTag && (
        <div className="pt-4">
          <AccountImportData
            onCloseOrUnselectTag = {onCloseOrUnselectTag}
            selectedAccountTag={selectedAccountTag}
            getAccountImportTags={getAccountImportTags}
          />
        </div>
      )}
    </div>
  );
};

export default AccountImportTagView;
