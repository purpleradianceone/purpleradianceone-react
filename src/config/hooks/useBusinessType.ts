/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import RefreshToken from "../validations/RefreshToken";
import POST_API from "../../constants/PostApi";
import { useEffect, useState } from "react";
import BusinessType from "../../@types/account/BusinessType";

export const usebusinessType = () => {

    const { loginStatus } = useLoggedInUserContext();
    const [businessType, setBusinessType] = useState<BusinessType[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getBusinessType = async () => {
        const postData = {
            id: null,
            name: null,
            isactive: null,
            company_id: loginStatus.companyId,
            requestedby: loginStatus.id,
        };

        await axios
            .post(POST_API.GET_BUSINESS_TYPE, postData, {
                withCredentials: true,
            })
            .then((response) => {
                if (response.status === STATUS_CODE.OK) {
                    setBusinessType(response.data);
                    setIsLoading(false);
                }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch(async (error: ApiError | any) => {
                //if exception occurs then rollback to previous state
                if (error.status === STATUS_CODE.UNATHORISED) {
                    const refreshTokenResponse = await RefreshToken({
                        callFunction: getBusinessType,
                    });
                    if (refreshTokenResponse) {
                        getBusinessType();
                    }
                }
            });
    };

    useEffect(() =>{
        getBusinessType();
    },[])

    return {
        isLoading, businessType
    }
}