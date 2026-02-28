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

export const getLookupAccounts  = async (payload: object , signal? : AbortSignal
) => {
    const response = await axiosClient.post(POST_API.GET_LOOKUP_ACCOUNTS, payload, {signal, withCredentials: true })
    return response;
}

export const updateAccountCompanyProductSerialNumberApiCall  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.UPDATE_ACCOUNT_COMPANY_PRODUCT_SERIAL_NUMBER, payload, { withCredentials: true })
    return response;
}


export const updateAccount  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.UPDATE_ACCOUNT, payload, { withCredentials: true })
    return response;
}