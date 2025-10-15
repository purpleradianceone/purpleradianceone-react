import axios from "axios";
import AccountCompanyProductType from "../../../../@types/account/AccountCompanyProductType";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import Button from "../../../ui/Button";
import COLORS from "../../../../constants/Colors";
import MESSAGE from "../../../../constants/Messages";
import { createPortal } from "react-dom";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import CreateAccountCompanyProduct from "./CreateAccountCompanyProduct";

const AccountCompanyProduct = ({
    accountId
}: AccountCompanyProductType) =>{
    const {loginStatus} = useLoggedInUserContext();
    const {userHasAccessToUpdateAccount} = useUserAccessModules();
    const [isLoadingAccountCompanyProduct, setIsLoadingAccountCompanyProduct] = useState<boolean>(true);
    const [showCreateAccountCompanyProduct , setShowCreateAccountCompanyProduct] = useState<boolean>(false);

    const [accountCompanyProduct , setAccountCompanyProduct] = useState<[]>([]);
    const getAccountCompanyProduct = async() =>{
        const postData = {
            company_id : loginStatus.companyId,
            account_id : accountId,
            company_product_id : null ,
            requestedby: loginStatus.id
        }

        await axios.post(POST_API.GET_ACCOUNT_COMPANY_PRODUCT, postData, {withCredentials : true})
        .then((response)=> {
            if(response.status === STATUS_CODE.OK){
                console.log(response.data);
                setAccountCompanyProduct(response.data)
                setIsLoadingAccountCompanyProduct(false)
            }
        })
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getAccountCompanyProduct,
          });
          if (refreshTokenResponse) {
            getAccountCompanyProduct();
          }
        } else {
          toast.error(error.response.data);
        }
      });
    }

    useEffect(() =>{
        getAccountCompanyProduct();
    },[])

    return (
      <div className="h-full w-full">
        {/* Main Content */}
    
        {isLoadingAccountCompanyProduct ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        ) : accountCompanyProduct.length === 0 && !isLoadingAccountCompanyProduct ? (
          <div className="flex items-center justify-center w-full   h-full">
            <div className="flex gap-1 w-full text-xs  h-16 bg-green-0 py-3 items-center justify-center">
              <Button
                disabled={!userHasAccessToUpdateAccount}
                onClick={
                  () =>{
                    if(userHasAccessToUpdateAccount){
                       setShowCreateAccountCompanyProduct(!showCreateAccountCompanyProduct)
                    }else{
                       toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS)
                    }
                  }
                }
                className={COLORS.ADD_BUTTON}
              >
                +Add
              </Button>
              <span className="italic caption-custom">No data available.</span>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-1 w-full">
             <div className="col-span-2 flex justify-end p-0.5">
              <Button
                disabled={!userHasAccessToUpdateAccount}
                onClick={
                  () =>{
                    if(userHasAccessToUpdateAccount){
                      setShowCreateAccountCompanyProduct(!showCreateAccountCompanyProduct)
                    }else{
                       toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS)
                    }
                  }
                }
                className={COLORS.ADD_BUTTON}
              >
                +Add
              </Button>
             </div>
            {/* {accountCompanyAccountType.map((item: AccountCompanyAccountType) => (
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
                  {/* <ToggleButton
                      checked={item.isActive}
                      name={item.id.toString()}
                      onToggle={(e) => {
                        e.preventDefault();
                        handleAccountCompanyAccountStatusChange(item);
                      }}
                    /> */}
                </div>
            //   </div>
            // ))} */}
        //   </div>
        )}
    
         {/* Modal */}
        {showCreateAccountCompanyProduct && createPortal(
           <CreateAccountCompanyProduct
            onClose={() =>{
                setShowCreateAccountCompanyProduct(!showCreateAccountCompanyProduct)
            }}
            accountId={accountId}
            // getAccountCompanyAccountType={getAccountCompanyAccountType}
           />,
          document.body
        )}
      </div>
    );
}


export default AccountCompanyProduct;