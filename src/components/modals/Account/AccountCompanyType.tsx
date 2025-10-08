/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";
import AccountCompanyAccountType from "../../../@types/account/AccountCompanyAccountType";
import COLORS from "../../../constants/Colors";
import { createPortal } from "react-dom";
import CreateAccountCompanyAccountType from "./CreateAccountCompanyAccountType";
import ToggleButton from "../../ui/ToggleButton";

const AccountCompanyType = ({ accountId }: { accountId: number }) => {
  // const {} = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  // States
  const [isLoadingCompanyAccountType, setIsLoadingCompanyAccountType] =
    useState<boolean>(true);
  const [accountCompanyAccountType, setAccountCompanyAccountType] = useState<
    AccountCompanyAccountType[]
  >([]);
  const [showCompanyAccountTypeForCreate, setShowCompanyAccountTypeForCreate] =
    useState<boolean>(false);

  const getAccountCompanyAccountType = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      account_id: accountId,
      isactive: null,
      requestedby: loginStatus.id,
    };
    await axios
      .post(POST_API.GET_ACCOUNT_COMPANY_ACCOUNT_TYPE, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const data = response.data;

          const filteredData: AccountCompanyAccountType[] = data.map(
            (item: any) => ({
              id: item.id,
              accountId: item.account_id,
              companyAccountTypeId: item.company_account_type_id,
              accountTypeName: item.account_type_name,
              companyAccountTypeName: item.company_account_type_name,
              isActive: item.isactive,
              createdBy: item.createdby,
              updatedBy: item.updatedby,
              createdOn: item.createdon,
              updatedOn: item.updatedon,
            })
          );

          setAccountCompanyAccountType(filteredData);
          setIsLoadingCompanyAccountType(false);
        }
      })
      .catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getAccountCompanyAccountType,
          });
          if (refreshTokenResponse) {
            getAccountCompanyAccountType();
          }
        } else {
          toast.error(error.response.data);
        }
      });
  };

  const handleAccountCompanyAccountStatusChange = async (item : AccountCompanyAccountType ) =>{
    const status = !item.isActive;
    const postData = {
      company_id : loginStatus.companyId,
	    id  : item.id,
	    isactive  :status ,
	    updatedbyid: loginStatus.id
    }


    await  axios.post(POST_API.UPDATE_ACCOUNT_COMPANY_ACCOUNT_TYPE , postData, {withCredentials : true})
    .then((response) => {
       if (response.data.status) {
          toast.success(response.data.message);
          // list refresh call
          getAccountCompanyAccountType()
        } else {
          toast.error(response.data.message);
        }
    })
     .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithParamsNotEvent: handleAccountCompanyAccountStatusChange,
          });
          if (refreshTokenResponse) {
            handleAccountCompanyAccountStatusChange(item);
          }
        }
      });
  }

  useEffect(() => {
    getAccountCompanyAccountType();
  }, []);

  if (isLoadingCompanyAccountType) {
    return (
      <div>
        <h1>
          <LoadingSpinner />
        </h1>
      </div>
    );
  }

 
  return (
  <div className="h-full w-full">
    {/* Main Content */}

    {isLoadingCompanyAccountType ? (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    ) : accountCompanyAccountType.length === 0 && !isLoadingCompanyAccountType ? (
      <div className="flex items-center justify-center w-full  h-full">
        <div className="flex gap-1 w-full text-xs  h-full bg-green-0 items-center justify-center">
          <button
            onClick={() =>
              setShowCompanyAccountTypeForCreate(!showCompanyAccountTypeForCreate)
            }
            className={COLORS.ADD_BUTTON}
          >
            +Add
          </button>
          <span className="italic caption-custom">No company account type available.</span>
        </div>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 gap-1 w-full">
         <div className="col-span-2 flex justify-end p-0.5">
          <button
            onClick={() =>
              setShowCompanyAccountTypeForCreate(!showCompanyAccountTypeForCreate)
            }
            className={COLORS.ADD_BUTTON}
          >
            +Add
          </button>
         </div>
        {accountCompanyAccountType.map((item: AccountCompanyAccountType) => (
          <div
            key={item.id}
            className="p-2 max-h-56 hover:white-text hover:shadow-md bg-white shadow-sm rounded-xl border border-gray-200 flex flex-col"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h2
                  title={item.companyAccountTypeName || ""}
                  className="input-label-custom hover:text-blue-00"
                >
                  {item.companyAccountTypeName?.length > 35
                    ? item.companyAccountTypeName.substring(0, 34) + "..."
                    : item.companyAccountTypeName || (
                        <span className="text-xs italic">Name not given</span>
                      )}
                </h2>
                <p
                  title={item.accountTypeName || ""}
                  className="caption-custom hover:text-blue-00"
                >
                  {item.accountTypeName }
                </p>
               
              </div>
                {/* Toggle */}
              <ToggleButton
                  checked={item.isActive}
                  name={item.id.toString()}
                  onToggle={(e) => {
                    e.preventDefault();
                    handleAccountCompanyAccountStatusChange(item);
                  }}
                />
            </div>
          </div>
        ))}
      </div>
    )}

     {/* Modal */}
    {showCompanyAccountTypeForCreate && createPortal(
       <CreateAccountCompanyAccountType
        onClose={() =>{
            setShowCompanyAccountTypeForCreate(!showCompanyAccountTypeForCreate)
        }}
        accountId={accountId}
        getAccountCompanyAccountType={getAccountCompanyAccountType}
       />,
      document.body
    )}
  </div>
);
};
export default AccountCompanyType;
