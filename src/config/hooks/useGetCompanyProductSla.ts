/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../validations/RefreshToken";
import POST_API from "../../constants/PostApi";
import { CompanyProductSla } from "../../@types/products/CompanyProductSla";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axiosClient from "../../axios-client/AxiosClient";

export const useCompanyProductSla = (companyProductId : number) =>{
    const {loginStatus} = useLoggedInUserContext();
    const [loading, setIsLoading] = useState<boolean>(true)
    const [companyProductSla, setCompanyProductSla] = useState<CompanyProductSla[]>([]);

    const getCompanyProductSla = async () => {
        setIsLoading(true)
        const postData = {
            company_id: loginStatus.companyId,
            company_product_id: companyProductId,
            isactive: null,
            requestedby_id : loginStatus.id
        };

        try {
            const response = await axiosClient.post(
                POST_API.GET_COMPANY_PRODUCT_SLA
                , postData, {
                withCredentials: true,
            });
            if (response.status == STATUS_CODE.OK) {
                setIsLoading(false);

                const responseData = response.data;
                const formattedData : CompanyProductSla[] = responseData.map((item: any) => (
                    {
                    id: item.id,
                    name: item.name,
                    isActive: item.isactive,
                    companyProductId: item.company_product_id,
                    colorCode: item.color_code ,
                    expectedResolutionTimeHours : item.expected_resolution_time_hours,
                    createdBy: item.createdby,
                    updatedBy : item.updatedby ,
                    createdOn : item.createdon,
                    updatedOn : item.updatedon 
                }
                ))

                setCompanyProductSla(formattedData);
            }
        } catch (error: ApiError | any) {
            if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({
                    callFunctionWithEvent:  getCompanyProductSla,
                });
                if (refreshTokenStatus) {
                    getCompanyProductSla();
                }
            }
        }
    };
    useEffect(() => {
        getCompanyProductSla();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyProductId]);

    return {
        companyProductSla,
        loading,
        refetch : getCompanyProductSla 
    }
}