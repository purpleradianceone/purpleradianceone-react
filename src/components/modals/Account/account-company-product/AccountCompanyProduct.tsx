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
import AccountProduct from "../../../../@types/account/AccountProduct";
import AccountCompanyProductPopUpDetails from "./AccountCompanyProductPopUpDetails";
import AccountCompanyProductAgGrid from "../../../ag-grid/AccountCompanyProductAgGrid";

const AccountCompanyProduct = ({ accountId }: AccountCompanyProductType) => {
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToUpdateAccount } = useUserAccessModules();
  const [isLoadingAccountCompanyProduct, setIsLoadingAccountCompanyProduct] =
    useState<boolean>(true);
  const [showCreateAccountCompanyProduct, setShowCreateAccountCompanyProduct] =
    useState<boolean>(false);

  const [selectedProductCard, setSelectedProductCard] =
    useState<AccountProduct | null>(null);
  const [accountCompanyProduct, setAccountCompanyProduct] = useState<
    AccountProduct[]
  >([]);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRowSelectAccountProduct =(data : AccountProduct)=>{
    if(data){
      setSelectedProductCard(data)
    }
    console.log(data);
    
  }
  const getAccountCompanyProduct = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      account_id: accountId,
      company_product_id: null,
      requestedby: loginStatus.id,
    };

    await axios
      .post(POST_API.GET_ACCOUNT_COMPANY_PRODUCT, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const data = response.data;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedData: AccountProduct[] = data.map((item: any) => ({
            id: item.id,
            accountId: item.account_id,
            accountName: item.account_name,
            companyProductId: item.company_product_id,
            companyProductName: item.company_product_name,
            quantity: item.quantity,
            purchaseDate: item.purchase_date,
            deliveryDate: item.delivery_date,
            deliveryAddress: item.delivery_address,
            billingAddress: item.billing_address,
            installationDate: item.installation_date,
            installedByName: item.installed_by_name,
            installedBy: item.installed_by,
            warrantyIntervalTypeId: item.warranty_interval_type_id,
            warrantyIntervalName: item.warranty_interval_name,
            warranty: item.warranty,
            warrantyStartDate: item.warranty_start_date,
            warrantyEndDate: item.warranty_end_date,
            warrantyTerms: item.warranty_terms,
            amcCycleIntervalTypeId: item.amc_cycle_interval_type_id,
            amcCycle: item.amc_cycle,
            amcCycleStartDate: item.amc_cycle_start_date,
            amcCycleEndDate: item.amc_cycle_end_date,
            amcIntervalName: item.amc_interval_name,
            updatedBy: item.updatedby,
            createdOn: item.createdon,
            updatedOn: item.updatedon,
            createdBy: item.createdby,
          }));
          setAccountCompanyProduct(formattedData);
          setRefreshKey((prev) => prev + 1);
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
      })
      .finally(() => {
        setIsLoadingAccountCompanyProduct(false);
      });
  };

  useEffect(() => {
    getAccountCompanyProduct();
  }, []);

  return (
    <div className="h-full w-full">
      {/* Main Content */}

      {isLoadingAccountCompanyProduct ? (
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner />
        </div>
      ) : accountCompanyProduct.length === 0 &&
        !isLoadingAccountCompanyProduct ? (
        <div className="flex items-center justify-center w-full   h-full">
          <div className="flex gap-1 w-full text-xs  h-16 bg-green-0 py-3 items-center justify-center">
            <Button
              disabled={!userHasAccessToUpdateAccount}
              onClick={() => {
                if (userHasAccessToUpdateAccount) {
                  setShowCreateAccountCompanyProduct(
                    !showCreateAccountCompanyProduct
                  );
                } else {
                  toast.error(
                    MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS
                  );
                }
              }}
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
              onClick={() => {
                if (userHasAccessToUpdateAccount) {
                  setShowCreateAccountCompanyProduct(
                    !showCreateAccountCompanyProduct
                  );
                } else {
                  toast.error(
                    MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS
                  );
                }
              }}
              className={COLORS.ADD_BUTTON}
            >
              +Add
            </Button>
          </div>
          <div className="md:col-span-2  w-full h-96">
            {/* {accountCompanyProduct &&
              accountCompanyProduct.map((item: AccountProduct, index) => (
                <div
                  key={index}
                  className={COLORS.CONTACT_CARD}
                  onClick={() => setSelectedProductCard(item)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        bg-blue-500
                      text-white flex items-center justify-center w-9 h-9 rounded-full border    font-semibold shadow-sm`}
                    >
                      {item.companyProductName
                        ? item.companyProductName.charAt(0).toUpperCase()
                        : "?"}
                    </div>

                    <div className="flex flex-col">
                      <p className="input-label-custom underline hover:decoration-blue-400 hover:text-blue-400 ">
                        {item.companyProductName || "Unknown Contact"}
                      </p>
                      <p className="caption-custom flex flex-wrap items-center gap-x-1">
                        {item.quantity && (
                          <span className="flex gap-1 items-center">
                            Quantity: {item.quantity}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex caption-custom bg-pink-00 items-end gap-1 text-[10px] font-semibold">
                    <div className="grid ">
                      <span>Installed By: {item.installedByName}</span>
                      <span>Installation date:{item.installationDate}</span>
                    </div>
                  </div>
                </div>
              ))} */}

              <AccountCompanyProductAgGrid
                accountProductData={accountCompanyProduct}
                onRowSelect={handleRowSelectAccountProduct}
              />
          </div>
        </div>
      )}

      <AccountCompanyProductPopUpDetails
        selectedProductCard={selectedProductCard}
        onClose={() => {
          setSelectedProductCard(null);
          getAccountCompanyProduct();
        }}
        refreshKey={refreshKey}
      />

      {/* Modal */}
      {showCreateAccountCompanyProduct &&
        createPortal(
          <CreateAccountCompanyProduct
            onClose={() => {
              setShowCreateAccountCompanyProduct(
                !showCreateAccountCompanyProduct
              );
            }}
            accountId={accountId}
            getAccountCompanyProduct={getAccountCompanyProduct}
          />,
          document.body
        )}
    </div>
  );
};

export default AccountCompanyProduct;
