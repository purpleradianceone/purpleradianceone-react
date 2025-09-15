/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import CompanyAccountType from "../../@types/settings/CompanyAccountType";
import { useEffect, useState } from "react";
import ApiError from "../../@types/error/ApiError";
import RefreshToken from "../validations/RefreshToken";
import toast from "react-hot-toast";

export const useCompanyAccountType = () => {

    const { loginStatus } = useLoggedInUserContext();
    const [isLoading, setIsLoading] = useState<boolean>();

    const [companyAccountType, setCompanyAccountType] = useState<
        CompanyAccountType[]
    >([]);

    const getComapnyAccountType = async () => {
        const PostDataToGetCompanyAccountType = {
            company_id: loginStatus.companyId,
            account_type_id: null,
            id: null,
            isactive: null,
            requestedby_id: loginStatus.id,
        };

        axios
            .post(
                POST_API.GET_COMPANY_ACCOUNT_TYPE,
                PostDataToGetCompanyAccountType,
                {
                    withCredentials: true,
                }
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
                    setIsLoading(false);
                }
            }) // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch(async (error: ApiError | any) => {
                //if exception occurs then rollback to previous state
                if (error.status === STATUS_CODE.UNATHORISED) {
                    const refreshTokenResponse = await RefreshToken({
                        callFunction: getComapnyAccountType,
                    });
                    if (refreshTokenResponse) {
                        getComapnyAccountType();
                    }
                } else {
                    toast.error(error.response.data);
                }
            })


    };

    useEffect(() => {
        getComapnyAccountType();
    }, [])

    return {
        companyAccountType, isLoading
    }
}