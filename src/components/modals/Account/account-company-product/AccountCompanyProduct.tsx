/* eslint-disable @typescript-eslint/no-explicit-any */
import AccountCompanyProductType from "../../../../@types/account/AccountCompanyProductType";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import POST_API from "../../../../constants/PostApi";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import MESSAGE from "../../../../constants/Messages";
import { createPortal } from "react-dom";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import CreateAccountCompanyProduct from "./CreateAccountCompanyProduct";
import AccountProduct from "../../../../@types/account/AccountProduct";
import AccountCompanyProductAgGrid from "../../../ag-grid/AccountCompanyProductAgGrid";
import { Link, useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";
import Button from "../../../ui/Button";
import COLORS from "../../../../constants/Colors";
import axiosClient from "../../../../axios-client/AxiosClient";
import { handleApiError } from "../../../../config/error/handleApiError";
import AccessDeniedMessagePage from "../../../views/not-found/AccessDeniedMessagePage";
import CreateAccountSubscription from "../account-subscription/CreateAccountSubscription";
import { Modules } from "../../../../@types/List/CompanyQuotationManagementListProps";

const AccountCompanyProduct = ({
  accountId,
  // handleShowCompanyProductData
}: AccountCompanyProductType) => {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();
  const {
    userHasAccessToAddAccountProducts,
    userHasAccessToViewAccountProducts,
    userHasAccessToAddAccountQuotation,
  } = useUserAccessModules();
  const [isLoadingAccountCompanyProduct, setIsLoadingAccountCompanyProduct] =
    useState<boolean>(true);
  const [showCreateAccountCompanyProduct, setShowCreateAccountCompanyProduct] =
    useState<boolean>(false);

  // const [selectedProductCard, setSelectedProductCard] =
  //   useState<AccountProduct | null>(null);
  const [accountCompanyProduct, setAccountCompanyProduct] = useState<
    AccountProduct[]
  >([]);
  const [accountCompanyProductCount, setAccountCompanyProductCount] =
    useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductForAMC, setSelectedProductForAMC] = useState<any>(null);
  // const [refreshKey, setRefreshKey] = useState<number>(0);

  // const handleRowSelectAccountProduct = (data: AccountProduct) => {
  //   // if (data) {
  //   //   setSelectedProductCard(data);
  //   // }
  //   navigate(`${ROUTES_URL.ACCOUNT_COMPANY_PRODUCT_DETAILS}/${data.id}`)
  //   handleShowCompanyProductData(data);

  // };

  const handleCreateQuotationForAccountProduct = (data: AccountProduct) =>{
        if (!userHasAccessToAddAccountQuotation){
          toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_QUOTATION.DENIED_ADD_ACCESS);
          return;
        }
            const quotationSearchParam=  `?other_id=${accountId}&quotation_type_id=${2}&isUsedFor=${Modules.AMC_QUOTATION}&account_company_product=${JSON.stringify(data)}`;

        const path = ROUTES_URL.QUOTATION_CREATE_AND_DETAILS.replace(
            ":quotationId",
            String(0),
          )+quotationSearchParam;
          navigate(path);


  }
  const handleRowSelectAccountProduct = (data: AccountProduct) => {
    if (!userHasAccessToViewAccountProducts) return;

    navigate(
      // `products/${data.id}`,
      `${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}/products/${data.id}`,

      {
        state: {
          productName: data.companyProductName,
          // accountName : data.accountName
        },
      },
    );
  };

  function handleRowClick(event: any) {
    if (!userHasAccessToViewAccountProducts) return;
    const data = event.data;
    navigate(
      // `products/${data.id}`,
      `${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}/products/${data.id}`,

      {
        state: {
          productName: data.companyProductName,
          // accountName : data.accountName
        },
      },
    );
  }

  
  const openSubscriptionModal = (rowData: any) => {
    setSelectedProductForAMC(rowData);
    setIsModalOpen(true);
  };
  const [hasError, setHasError] = useState(false);

  const handleAddToInvoice = async (rowData: AccountProduct) => {
    console.log(rowData);
    const postData = {
      company_id: loginStatus.companyId,
      account_id: rowData.accountId,
      account_company_product_id: rowData.id,
      createdby_id: loginStatus.id,
    };
    console.log(postData);
    // setIsSubmitting(true);
    try {
      const res = await axiosClient.post(
        POST_API.CREATE_COMPANY_INVOICE_ITEM,
        postData,
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        setAccountCompanyProductCount((prev) => prev + 1);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      // setIsSubmitting(false);s
    }
  };

  const getAccountCompanyProduct = async () => {
    setIsLoadingAccountCompanyProduct(true);
    setHasError(false);

    const postData = {
      company_id: loginStatus.companyId,
      account_id: accountId,
      id: null,
      company_product_id: null,
      requestedby: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(
        POST_API.GET_ACCOUNT_COMPANY_PRODUCT,
        postData,
        { withCredentials: true },
      );
      console.log(response.data);

      const formattedData: AccountProduct[] = response.data.map(
        (item: any) => ({
          id: item.id,
          accountId: item.account_id,
          accountName: item.account_name,
          companyProductId: item.company_product_id,
          companyProductName: item.company_product_name,
          ProductTypeName: item.product_type_name,
          quantity: item.quantity,
          quantityReturn: item.quantity_return,
          barcode: item.barcode,
          serialNumber: item.serial_number,
          unitName: item.unit_name,
          unitNameInStock: item.unit_name_in_stock,
          purchaseDate: item.purchase_date,
          deliveryDate: item.delivery_date,
          deliveryAddress: item.delivery_address,
          billingAddress: item.billing_address,
          installationDate: item.installation_date,
          installedByName: item.installed_by_name,
          installedBy: item.installed_by,
          isAddedToInvoiceDraft: item.is_added_to_invoice_draft,
          updatedBy: item.updatedby,
          createdOn: item.createdon,
          updatedOn: item.updatedon,
          createdBy: item.createdby,
        }),
      );

      setAccountCompanyProduct(formattedData);
      // setRefreshKey((prev) => prev + 1);
    } catch (error) {
      setHasError(true); //  distinguish error vs empty
      handleApiError(error);
    } finally {
      setIsLoadingAccountCompanyProduct(false); //  always runs
    }
  };

  useEffect(() => {
    if (userHasAccessToViewAccountProducts) {
      getAccountCompanyProduct();
    }
  }, [userHasAccessToViewAccountProducts, accountCompanyProductCount]);

  if (hasError) {
    return (
      <div className="text-center caption-custom">
        <h1>Someting went wrong!</h1>
      </div>
    );
  }

  if (!userHasAccessToViewAccountProducts)
    return (
      <AccessDeniedMessagePage
        message={
          MESSAGE.MODULE_ACCESS.ACCOUNT_COMPANY_PRODUCT.DENIED_VIEW_ACCESS
        }
      />
    );
  return (
    <div className="h-full w-full min-h-14">
      {/* Main Content */}

      {isLoadingAccountCompanyProduct ? (
        <div className="flex justify-center items-center h-full min-h-44">
          <LoadingSpinner />
        </div>
      ) : accountCompanyProduct.length === 0 &&
        !isLoadingAccountCompanyProduct &&
        !hasError ? (
          <>
           <h3 className="bg-gray-100 table-header-custom rounded-t-md px-2">
              Product Details
            </h3>
         
        <div className="flex items-center justify-center w-full   h-full">
         
          <div className="flex gap-1 w-full text-xs  h-16 bg-green-0 py-3 items-center justify-center">
            
            <Link
              to={ROUTES_URL.ACCOUNT_MULTIPLE_COMPANY_PRODUCT}
              state={{
                assignProducts: true,
              }}
              // to={`${ROUTES_URL.ACCOUNT_MULTIPLE_COMPANY_PRODUCT}/${accountId}`}
              //  state={{
              //     assignProducts: true,
              //   }}
              onClick={(e) => {
                if (!userHasAccessToAddAccountProducts) {
                  e.preventDefault();
                  toast.error(
                    MESSAGE.MODULE_ACCESS.ACCOUNT_COMPANY_PRODUCT
                      .DENIED_ADD_ACCESS,
                  );
                }
              }}
              className={
                !userHasAccessToAddAccountProducts
                  ? "cursor-not-allowed opacity-85"
                  : "cursor-pointer"
              }
            >
              {" "}
              <Button
              type="button"
                disabled={!userHasAccessToAddAccountProducts}
                // onClick={() => {
                //   if (userHasAccessToUpdateAccount) {
                //     setShowCreateAccountCompanyProduct(
                //       !showCreateAccountCompanyProduct
                //     );
                //   } else {
                //     toast.error(
                //       MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS
                //     );
                //   }
                // }}
                className={COLORS.ADD_BUTTON}
              >
                +Add
              </Button>
            </Link>
            <span className="italic caption-custom">No data available.</span>
          </div>
        </div>
         </>
      ) : (
        <div className="w-full ">
         <div className="w-full flex justify-between bg-gray-100 table-header-custom  rounded-t-md p-1">
              Product Details

              <Link
              to={ROUTES_URL.ACCOUNT_MULTIPLE_COMPANY_PRODUCT}
              state={{
                assignProducts: true,
              }}
              // to={`${ROUTES_URL.ACCOUNT_MULTIPLE_COMPANY_PRODUCT}/${accountId}`}
              onClick={(e) => {
                if (!userHasAccessToAddAccountProducts) {
                  e.preventDefault();
                  toast.error(
                    MESSAGE.MODULE_ACCESS.ACCOUNT_COMPANY_PRODUCT
                      .DENIED_ADD_ACCESS,
                  );
                }
              }}
              className={
                !userHasAccessToAddAccountProducts
                  ? "cursor-not-allowed opacity-55"
                  : "cursor-pointer"
              }
            >
              <Button
               type="button"
                disabled={!userHasAccessToAddAccountProducts}
                // onClick={() => {
                //   if (userHasAccessToUpdateAccountProducts) {

                //     toast.error(
                //       MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS
                //     );
                //   }
                // }}
                className={COLORS.ADD_BUTTON}
              >
                +Add
              </Button>
            </Link>
            </div>
       
        <div className="grid grid-cols-2  w-full">
         
          <div className="col-span-2 flex justify-end p-0.5">
            
            
          </div>
          <div className="col-span-2  w-full h-56">
            <AccountCompanyProductAgGrid
              handleAddToInvoice={handleAddToInvoice}
              accountProductData={accountCompanyProduct}
              onRowSelect={handleRowSelectAccountProduct}
              handleRowClick={handleRowClick}
              openSubscriptionModal={openSubscriptionModal}
              handleCreateQuotation={handleCreateQuotationForAccountProduct}
            />
          </div>
          <CreateAccountSubscription
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProductForAMC(null);
            }}
            accountId={accountId}
            handleAddAccountSubscritption={() => {}}
            selectedProductForAMC={selectedProductForAMC} // 👈 NEW PROP
          />
        </div>
         </div>
      )}

      {/* {selectedProductCard && (
        <AccountCompanyProductPopUpDetails
          selectedProductCard={selectedProductCard}
          onClose={() => {
            setSelectedProductCard(null);
            getAccountCompanyProduct();
          }}
          refreshKey={refreshKey}
        />
      )} */}

      {/* Modal */}
      {showCreateAccountCompanyProduct &&
        createPortal(
          <CreateAccountCompanyProduct
            onClose={() => {
              setShowCreateAccountCompanyProduct(
                !showCreateAccountCompanyProduct,
              );
            }}
            accountId={accountId}
            getAccountCompanyProduct={getAccountCompanyProduct}
          />,
          document.body,
        )}
    </div>
  );
};

export default AccountCompanyProduct;
