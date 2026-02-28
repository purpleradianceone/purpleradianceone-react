/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit2 } from "lucide-react";
import FormHeader from "../../ui/FormHeader";
import { useEffect, useState } from "react";
import CompanyAccountType from "../../../@types/settings/CompanyAccountType";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";
import AccountCompanyAccountTypeAgGrid from "../../ag-grid/AccountCompanyAccountTypeAgGrid";
import ApiError from "../../../@types/error/ApiError";
import axiosClient from "../../../axios-client/AxiosClient";

const CreateAccountCompanyAccountType = ({
  onClose,
  accountId ,
  getAccountCompanyAccountType,

}: {
  onClose: () => void;
  accountId : number,
  getAccountCompanyAccountType : () => void
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const [companyAccountType, setCompanyAccountType] = useState<
    CompanyAccountType[]
  >([]);

  const [isLoadingCompanyAccountType, setIsLoadingCompanyAccountType] =
    useState<boolean>(true);

  // --- Fetch Company Account Types ---
  const getComapnyAccountType = async () => {
    const PostDataToGetCompanyAccountType = {
      company_id: loginStatus.companyId,
      account_type_id: null,
      id: null,
      isactive: null,
      requestedby_id: loginStatus.id,
    };
    axiosClient
      .post(
        POST_API.GET_COMPANY_ACCOUNT_TYPE,
        PostDataToGetCompanyAccountType,
        { withCredentials: true }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const responseData = response.data;

          const companyAccountData: CompanyAccountType[] = responseData.map(
            (item: any) => ({
              id: item.id,
              companyId: item.company_id,
              accountTypeId: item.account_type_id,
              companyAccountTypeName: item.company_account_type_name,
              accountTypeName: item.account_type_name,
              isActive: item.isactive,
              createdBy: item.createdby,
              createdOn: item.createdon,
              updatedBy: item.updatedby,
              updatedOn: item.updatedon,
            })
          );
          setCompanyAccountType(companyAccountData);
          setIsLoadingCompanyAccountType(false);
        }
      })
      .catch(async (error: any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getComapnyAccountType,
          });
          if (refreshTokenResponse) {
            getComapnyAccountType();
          }
        } else {
          toast.error(error.response.status + error.response.data);
        }
      });
  };


  const createAccountCompanyAccountType =async (id : number ) =>{
    if(id === null || id=== undefined || accountId ===null || accountId ===undefined) {
        return;
    }

    const postData = {
        company_id: loginStatus.companyId,
        account_id : accountId ,
        company_account_type_id : id,
        createdbyid : loginStatus.id
    }
    await axiosClient.post(POST_API.CREATE_ACCOUNT_COMPANY_ACCOUNT_TYPE, postData, {
        withCredentials : true
    })
    .then((response ) =>{
        if(response.data.status ){
            toast.success(response.data.message)
        }else{
            toast.error(response.data.message)
        }
        // refresh call for the list
        getAccountCompanyAccountType();
        onClose()
    })
    .catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithParamsNotEvent: createAccountCompanyAccountType,
          });
          if (refreshTokenResponse) {
            createAccountCompanyAccountType(id);
          }
        } else {
          toast.error(error.response.data);
        }
      });
  }
  const handleRowSelectForAssingingToAccount  = (data :  CompanyAccountType |any)=>{
    createAccountCompanyAccountType(data.id)
  }

  useEffect(() => {
    getComapnyAccountType();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-5 flex justify-center items-center  p-2 sm:p-2">
      <div className="bg-white w-full max-w-6xl  rounded  p-2 relative">
        {/* Header */}
        <FormHeader
          icon={Edit2}
          onClose={onClose}
          preText="Assign Company Account type"
          description="Assign a company under a specific account type for organizational or operational purposes."
        />

        {isLoadingCompanyAccountType && (
          <div>
            <LoadingSpinner />
          </div>
        )}

        {!isLoadingCompanyAccountType && companyAccountType.length === 0 && (
          <div className="flex items-center justify-center caption-custom p-2">
            <span>No Company account type available.</span>
          </div>
        )}

        {
            companyAccountType && !isLoadingCompanyAccountType && (
                <div className="ag-theme-balham w-full h-[calc(100vh-120px)] p-2">
                    <AccountCompanyAccountTypeAgGrid
                        accountCompanyAccountTypeData={companyAccountType}
                        onRowSelect={handleRowSelectForAssingingToAccount}
                    />
                </div>
            )
        }
      </div>
    </div>
  );
};

export default CreateAccountCompanyAccountType;
