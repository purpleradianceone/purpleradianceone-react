/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../validations/RefreshToken";
import { AccountCompanyProductWarranty } from "../../@types/account/AccountCompanyProductWarranty";

export const useAccountCompanyProductWarranty = (accountCompanyProductId : number) =>{
    const {loginStatus} = useLoggedInUserContext();
    const [loading, setIsLoading] = useState<boolean>(true)
    const [accountCompanyProductWarranty, setAccountCompanyProductWarranty] = useState<AccountCompanyProductWarranty[]>([]);

    const getAccountCompanyProductWarranty = async () => {

        setIsLoading(true)
        const postData = {
            company_id: loginStatus.companyId,
            account_company_product_id: accountCompanyProductId,
            isactive: true,
            requestedby_id : loginStatus.id
        };

        try {
            const response = await axios.post(
                POST_API.GET_ACCOUNT_COMPANY_PRODUCT_WARRANTY
                , postData, {
                withCredentials: true,
            });
            if (response.status == STATUS_CODE.OK) {
                setIsLoading(false);
                const responseData = response.data;
                const formattedData : AccountCompanyProductWarranty[] = responseData.map((item: any) => (
                    {
                    id: item.id,
                    accountCompanyProductId: item.account_company_product_id,
                    isActive: item.isactive,
                    warrantyStartDate: item.warranty_start_date,
                    warrantyEndDate: item.warranty_end_date ,
                    details : item.details,
                    createdBy: item.createdby,
                    updatedBy : item.updatedby ,
                    createdOn : item.createdon,
                    updatedOn : item.updatedon 
                }
                ))
                setAccountCompanyProductWarranty(formattedData);
            }
        } catch (error: ApiError | any) {
            if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({
                    callFunctionWithEvent:  getAccountCompanyProductWarranty,
                });
                if (refreshTokenStatus) {
                    getAccountCompanyProductWarranty();
                }
            }
        }
    };
    useEffect(() => {
        getAccountCompanyProductWarranty();
    }, [accountCompanyProductId]);

    return {
        accountCompanyProductWarranty,
        loading
    }
}