import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import ROUTES_URL from "../../../../../constants/Routes";
import { getAccountCompanyProductDetails } from "../../../../../config/apis/api";
import { handleApiError } from "../../../../../config/error/handleApiError";
import AccountProduct from "../../../../../@types/account/AccountProduct";
import AccountProductDetailsSkeleton from "../../account-skeletons/AccountProductDetailsSkeleton";
import { AccountCompanyProductDetailsCard } from "./AccountCompanyProductDetailsCard";

export const AccountCompanyProductDetails: React.FC = () => {
  const { productId, accountId } = useParams<{
    productId: string;
    accountId: string;
  }>();

  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();

  const parsedAccountId = Number(accountId);
  const parsedProductId = Number(productId);

  /**
   * Validate route params
   */
  useEffect(() => {
    if (
      !accountId ||
      !productId ||
      Number.isNaN(parsedAccountId) ||
      Number.isNaN(parsedProductId)
    ) {
      navigate(ROUTES_URL.ACCOUNT_MANAGEMENT);
    }
  }, [accountId, productId, parsedAccountId, parsedProductId, navigate]);

  const [accountCompanyProduct, setAccountCompanyProduct] =
    useState<AccountProduct | null>(null);

  /**
   * Fetch product details
   */
  useEffect(() => {
    if (!loginStatus?.companyId || !loginStatus?.id) return;
    if (Number.isNaN(parsedAccountId) || Number.isNaN(parsedProductId)) return;

    const fetchProductDetails = async () => {
      try {
        const payload = {
          company_id: loginStatus.companyId,
          id: parsedProductId,
          account_id: parsedAccountId,
          company_product_id: null,
          requestedby: loginStatus.id,
        };

        const response = await getAccountCompanyProductDetails(payload);

        const item = response.data?.[0];

        if (!item) {
          navigate(`${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}`)
          // throw new Error("No product data returned from API");
        }

        const formattedData: AccountProduct = {
          id: item.id,
          accountId: item.account_id,
          accountName: item.account_name,
          companyProductId: item.company_product_id,
          companyProductName: item.company_product_name,
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
          totalCost: item.total_cost,
          updatedBy: item.updatedby,
          createdOn: item.createdon,
          updatedOn: item.updatedon,
          createdBy: item.createdby,
        };

        setAccountCompanyProduct(formattedData);
      } catch (error) {
        handleApiError(error);
      }
    };

    fetchProductDetails();
  }, [loginStatus, parsedAccountId, parsedProductId]);

  if (!accountCompanyProduct) return (
    <AccountProductDetailsSkeleton />
  );
  return (
    <AccountCompanyProductDetailsCard
      selectedProductCard={accountCompanyProduct}
    />
  );
};
