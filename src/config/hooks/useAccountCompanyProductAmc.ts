/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../validations/RefreshToken";
import { AccountCompanyProductAmc } from "../../@types/account/AccountCompanyProductAmc";
import axiosClient from "../../axios-client/AxiosClient";

export const useAccountCompanyProductAmc = (accountCompanyProductId : number) =>{
    const {loginStatus} = useLoggedInUserContext();
    const [loading, setIsLoading] = useState<boolean>(true)
    const [accountCompanyProductAmc, setAccountCompanyProductAmc] = useState<AccountCompanyProductAmc[]>([]);

    const getCompanyProductAmc = async () => {

        setIsLoading(true)
        const postData = {
            company_id: loginStatus.companyId,
            account_company_product_id: accountCompanyProductId,
            isactive: true,
            requestedby_id : loginStatus.id
        };

        try {
            const response = await axiosClient.post(
                POST_API.GET_ACCOUNT_COMPANY_PRODUCT_AMC
                , postData, {
                withCredentials: true,
            });
            if (response.status == STATUS_CODE.OK) {
                setIsLoading(false);
                const responseData = response.data;
                const formattedData : AccountCompanyProductAmc[] = responseData.map((item: any) => (
                    {
                    id: item.id,
                    accountCompanyProductId: item.account_company_product_id,
                    isActive: item.isactive,
                    amcCycleStartDate: item.amc_cycle_start_date,
                    amcCycleEndDate: item.amc_cycle_end_date ,
                    details : item.details,
                    createdBy: item.createdby,
                    updatedBy : item.updatedby ,
                    createdOn : item.createdon,
                    updatedOn : item.updatedon 
                }
                ))

                setAccountCompanyProductAmc(formattedData);
            }
        } catch (error: ApiError | any) {
            if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({
                    callFunctionWithEvent:  getCompanyProductAmc,
                });
                if (refreshTokenStatus) {
                    getCompanyProductAmc();
                }
            }
        }
    };
    useEffect(() => {
        getCompanyProductAmc();
    }, [accountCompanyProductId]);

    return {
        accountCompanyProductAmc,
        loading
    }
}