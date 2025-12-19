import { useEffect, useState } from "react";
import Account from "../../@types/account/Account";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../validations/RefreshToken";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axiosClient from "../../axios-client/AxiosClient";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";

export const useAccountDetails = (accountId: number) => {
    const { loginStatus } = useLoggedInUserContext();
    const [accountDetails, setAccountDetails] = useState<Account>();
    
      const navigate = useNavigate();
    
    const [loading, setLoading] = useState<boolean>(true);
    const fetchAccountDetails = async () => {
        const postData = {
            company_id: loginStatus.companyId,
            id: accountId,
            requestedby: loginStatus.id,
            limit: null,
            offset: null,
            search_company_specific_date_range_id: null,
            search_parameter: null,
            isactive: null,
            search_parameter_date: null,
        };

        try {
            const response = await axiosClient.post(POST_API.GET_ACCOUNT, postData, {
                withCredentials: true,
            });

            // const response = response.data[0];
           if (response.status === STATUS_CODE.OK) {
                const res = response.data[0]; // SINGLE OBJECT

                if(res===undefined){
                    navigate(ROUTES_URL.ACCOUNT_MANAGEMENT)
                    return;
                }
                const formattedData: Account = {
                    count: res.count,
                    id: res.id,
                    companyId: res.company_id,
                    name: res.name,
                    email: res.email,
                    mobileNumber: res.mobilenumber,
                    industryTypeId: res.industry_type_id,
                    industryTypeName: res.industry_type_name,
                    businessTypeId: res.business_type_id,
                    businessTypeName: res.business_type_name,
                    countryId: res.country_id,
                    stateId: res.state_id,
                    districtId: res.district_id,
                    countryName: res.country_name,
                    stateName: res.state_name,
                    districtName: res.district_name,
                    pan: res.pan,
                    gst: res.gst,
                    tan: res.tan,
                    billingAddress: res.billing_address,
                    shippingAddress: res.shipping_address,
                    registeredOfficeAddress: res.registered_office_address,
                    businessResgistrationNumber: res.business_registration_number,
                    website: res.website,
                    isActive: res.isactive,
                    createdBy: res.createdby,
                    createdOn: res.createdon,
                };

                setAccountDetails(formattedData);
            }
            
            else {
                throw new Error("Failed to fetch industry type");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({
                    callFunction: fetchAccountDetails,
                });

                if (refreshTokenStatus) {
                    fetchAccountDetails();
                }
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (accountId > 0) {
            fetchAccountDetails();
        }
    }, [accountId])

    return {
        loading, accountDetails
    }
}