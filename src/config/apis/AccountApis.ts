import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";

export const updateAccountCompanyProductAmc  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.UPDATE_ACCOUNT_COMPANY_PRODUCT_AMC, payload, { withCredentials: true })
    return response;
}

export const createAccountCompanyProductAmc  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.CREATE_ACCOUNT_COMPANY_PRODUCT_AMC, payload, { withCredentials: true })
    return response;
}

export const createAccountCompanyProductWarranty  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.CREATE_ACCOUNT_COMPANY_PRODUCT_WARRANTY, payload, { withCredentials: true })
    return response;
}