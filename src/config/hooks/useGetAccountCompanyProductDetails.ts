import axios from "axios";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import AccountProduct from "../../@types/account/AccountProduct";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RefreshToken from "../validations/RefreshToken";
import ApiError from "../../@types/error/ApiError";

export const useGetAccountCompanyProductDetails = (accountId: number, companyProductId: number) => {
    const { loginStatus } = useLoggedInUserContext();

    const [accountCompanyProduct, setAccountCompanyProduct] = useState<
        AccountProduct[]
    >([]);

    const [isLoadingAccountCompanyProduct, setIsLoadingAccountCompanyProduct] =
        useState<boolean>(true);

    const getAccountCompanyProduct = async () => {
        const postData = {
            company_id: loginStatus.companyId,
            account_id: accountId,
            company_product_id: companyProductId,
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
                        updatedBy: item.updatedby,
                        createdOn: item.createdon,
                        updatedOn: item.updatedon,
                        createdBy: item.createdby,
                    }));
                    setAccountCompanyProduct(formattedData);
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
        if (accountId > 0 && companyProductId > 0) {
            getAccountCompanyProduct();
        }
    }, [accountId, companyProductId]);

    return {
        isLoadingAccountCompanyProduct,
        accountCompanyProduct
    }
}