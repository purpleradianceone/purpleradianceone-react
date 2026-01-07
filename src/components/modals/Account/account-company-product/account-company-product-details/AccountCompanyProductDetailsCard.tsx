/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import AccountProduct from "../../../../../@types/account/AccountProduct";
import { useUserAccessModules } from "../../../../../config/hooks/useAccessModules";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import toast from "react-hot-toast";
import CompanyUser from "../../../../../@types/company-users/CompanyUser";
import axiosClient from "../../../../../axios-client/AxiosClient";
import POST_API from "../../../../../constants/PostApi";
import { handleApiError } from "../../../../../config/error/handleApiError";
import {
  Barcode,
  Calendar,
  FileDigit,
  LucideIcon,
  MapPin,
  Pen,
  ReceiptText,
  ShoppingBag,
  User,
} from "lucide-react";
import { AccountCompanyProductAmcDetails } from "../AccountCompanyProductAmcDetails";
import { AccountCompanyProductWarrantyDetails } from "../AccountCompanyProductWarrantyDetails";
import COLORS from "../../../../../constants/Colors";
import TextAreaInput from "../../../../ui/TextAreaInput";
import ControlledDatePicker from "../../../../ui/ControlledDatePicker";
import { format } from "date-fns";
import CompanyUserSearchFieldInput from "../../../../ui/CompanyUserSearchFieldInput";

export const AccountCompanyProductDetailsCard = ({
  selectedProductCard,
}: {
  selectedProductCard: AccountProduct;
}) => {
  const { userHasAccessToUpdateAccount } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  const [productData, setProductData] = useState<AccountProduct | null>(
    selectedProductCard
  );
  const [originalProductData, setOriginalProductData] =
    useState<AccountProduct | null>(selectedProductCard);

  //  Fix: Update productData whenever selectedProductCard changes
  useEffect(() => {
    if (selectedProductCard) {
      setProductData({ ...selectedProductCard });
      setOriginalProductData({ ...selectedProductCard });
    }
  }, [selectedProductCard]);

  const ACCOUNT_PRODUCT_API_FIELD_MAP: Partial<
    Record<keyof AccountProduct, string>
  > = {
    deliveryAddress: "delivery_address",
    billingAddress: "billing_address",
    installedBy: "installed_by",
    purchaseDate: "purchase_date",
    deliveryDate: "delivery_date",
    installationDate: "installation_date",

    // companyProductId: "company_product_id",
    // accountId: "account_id",
    // add mappings only where API differs
  };

  const updateAccountCompanyProduct = async <K extends keyof AccountProduct>(
    field: K,
    value: AccountProduct[K]
  ) => {
    if (!productData || !originalProductData) return;

    const apiField = ACCOUNT_PRODUCT_API_FIELD_MAP[field] ?? field;

    try {
      const postData = {
        id: productData.id,
        [apiField]: value,
        company_id: loginStatus.companyId,
        updatedby_id: loginStatus.id,
      };

      const response = await axiosClient.post(
        POST_API.UPDATE_ACCOUNT_COMPANY_PRODUCT,
        postData,
        { withCredentials: true }
      );

      if (response.data.status) {
        toast.success(response.data.message);
        setOriginalProductData((prev) =>
          prev ? { ...prev, [field]: value } : prev
        );
      } else {
        toast.error(response.data.message);
        //   throw new Error(response.data.message);
        // rollback only the failed field
        setProductData((prev) =>
          prev ? { ...prev, [field]: originalProductData[field] } : prev
        );
      }
    } catch (error) {
      handleApiError(error);

      // rollback only the failed field
      setProductData((prev) =>
        prev ? { ...prev, [field]: originalProductData[field] } : prev
      );
    }
  };

  const handleOnChange = <K extends keyof AccountProduct>(
    fieldName: K,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;

    setProductData((prev) => {
      if (!prev) return prev; // keep null as null

      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  const handleDateCommit = <K extends keyof AccountProduct>(
    fieldName: K,
    date: Date | null
  ) => {
    if (!date) return;

    const formattedDate = format(date, "yyyy-MM-dd");

    setProductData((prev) => {
      if (!prev) return prev; //  critical fix

      return {
        ...prev,
        [fieldName]: formattedDate,
      };
    });
  };

  const handleInstalledBySelect = (user: CompanyUser | null) => {
    if (!user) return null;
    if(user.id===0) return ;
    
    console.log(user);
    
    setProductData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        installedBy: user.id, // backend field
        installedByName: user.fullname, // UI display
      };
    });
  };

  const API_UPDATABLE_FIELDS: (keyof AccountProduct)[] = [
    "installedBy",
    "deliveryAddress",
    "billingAddress",
    "installationDate",
    "purchaseDate",
    "deliveryDate",
    // add only backend fields here
  ];

  useEffect(() => {
    if (!productData || !originalProductData) return;

    // const changedField = (
    //   Object.keys(productData) as (keyof AccountProduct)[]
    // ).find((key) => productData[key] !== originalProductData[key]);

    // if (!changedField) return;
    const changedField = API_UPDATABLE_FIELDS.find(
      (key) => productData[key] !== originalProductData[key]
    );

    if (!changedField) return;

    const timer = setTimeout(() => {
      updateAccountCompanyProduct(changedField, productData[changedField]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [productData]);

  if (selectedProductCard === null) return null;
  return (
    <div className="px-1  py-0.5">
      {/* user access : {userHasAccessToUpdateAccount ? "true" : "false"} */}
      {/* Header */}
      <div className="grid  w-full grid-cols-4 md:grid-cols-4 gap-1    rounded p-0.5 pt-1">
        <div className=" col-span-4 flex items-center">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center 
                  text-2xl font-semibold text-white bg-blue-500 shrink-0"
            >
              {productData?.companyProductName
                ? productData.companyProductName.charAt(0).toUpperCase()
                : "?"}
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
              {/* Product Name */}
              <h2 className="table-header-custom">
                {productData?.companyProductName ? (
                  productData.companyProductName
                ) : (
                  <span className="italic text-gray-400">Un-Named Product</span>
                )}
              </h2>

              {/* Account Name */}
              <span className="caption-custom">
                {productData?.accountName ? (
                  <>
                    Account :{" "}
                    <span className="caption-custom">
                      {productData.accountName}
                    </span>
                  </>
                ) : (
                  <span className="italic">No account name</span>
                )}
              </span>
            </div>
          </div>
        </div>
        <DisplayComponent
          icon={ShoppingBag}
          title="Quantity"
          value={
            productData?.quantity
              ? productData.quantity
                  .toLocaleString()
                  .concat(" " + productData!.unitNameInStock)
              : ""
          }
          penLogo={false}
        />
        {productData?.serialNumber && (
          <DisplayComponent
            icon={FileDigit}
            title="Serial Number"
            value={productData!.serialNumber ? productData!.serialNumber : ""}
            penLogo={false}
          />
        )}

        {productData?.barcode && (
          <DisplayComponent
            icon={Barcode}
            title="Barcode"
            value={productData!.barcode ? productData!.barcode : ""}
            penLogo={false}
          />
        )}
      </div>

      {/* Content */}
      {/* <div className="px-2 pb-2"> */}
        {/* Left Section */}
        <div className="grid  grid-cols-2 md:grid-cols-4 gap-1   rounded p-0.5 ">
          <ControlledDatePicker
            label="Purchase Date"
            onCommit={(date) => {
              handleDateCommit("purchaseDate", date);
            }}
            logo={Calendar}
            readonly={!userHasAccessToUpdateAccount}
            value={productData?.purchaseDate}
            isClearable={false}
            penLogo={true}
          />
          <ControlledDatePicker
            label="Delivery Date"
            onCommit={(date) => {
              handleDateCommit("deliveryDate", date);
            }}
            logo={Calendar}
            readonly={!userHasAccessToUpdateAccount}
            value={productData?.deliveryDate}
            isClearable={false}
             penLogo={true}
          />

          <ControlledDatePicker
            label="Installation Date"
            onCommit={(date) => {
              handleDateCommit("installationDate", date);
            }}
            logo={Calendar}
            readonly={!userHasAccessToUpdateAccount}
            value={productData?.installationDate}
            isClearable={false}
             penLogo={true}
          />

          <CompanyUserSearchFieldInput
            readOnly={!userHasAccessToUpdateAccount}
            label="Installed By:"
            required
            onUserSelected={handleInstalledBySelect}
            defaultValue={productData?.installedByName}
            logo={User}
            placeholder="Select User"
          />
        </div>

        <div className=" grid grid-cols-2 gap-1 pb-1">
          {/* Addresses */}
          <TextAreaInput
            cols={2}
            placeholder="Enter delivery address"
            label="Delivery Address"
            value={productData?.deliveryAddress}
            rows={4}
            onChange={(event) => {
              handleOnChange("deliveryAddress", event);
            }}
            readonly={!userHasAccessToUpdateAccount}
            logo={MapPin}
          />
          <TextAreaInput
            readonly={!userHasAccessToUpdateAccount}
            placeholder="Enter billing address"
            cols={2}
            label="Billing Address"
            value={productData?.billingAddress}
            rows={4}
            onChange={(event) => {
              handleOnChange("billingAddress", event);
            }}
            logo={ReceiptText}
          />
        </div>
        {/* Right Card - Empty for future use */}

        <AccountCompanyProductAmcDetails
          accountCompanyProductId={selectedProductCard.id}
        />
        <AccountCompanyProductWarrantyDetails
          accountCompanyProductId={selectedProductCard.id}
        />
      {/* </div> */}
    </div>
  );
};

function DisplayComponent({
  value,
  penLogo,
  title,
  icon: Logo,
}: {
  value: string;
  penLogo: boolean;
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex w-full h-fit items-start gap-1  bg-white ">
      <div className="">
        <Logo className={`${COLORS.FORM_HEADER_ICONS_COLOR}`} size={16} />
      </div>

      <div className="flex flex-col w-full">
        <h4 className="card-header">{title}</h4>

        <div className="flex items-center justify-between   ">
          <p className="input-label-custom">
            {value.length > 30
              ? value.substring(0, 29).concat("...")
              : value || (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
          </p>
          {penLogo && <Pen className="text-blue-500 " size={14} />}
        </div>
      </div>
    </div>
  );
}
