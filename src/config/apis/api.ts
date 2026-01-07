/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../../axios-client/AxiosClient"
import POST_API from "../../constants/PostApi"

export const createMultipleAccountCompanyProduct = async (payload: any
) => {
    const response = await axiosClient.post(POST_API.CREATE_ACCOUNT_COMPANY_PRODUCT + '-list', payload, { withCredentials: true })
    return response;
}
export const getStockAvailableSerialNumber = async (payload: any
) => {
    const response = await axiosClient.post(POST_API.GET_STOCK_AVAILABLE_SERIAL_NUMBER, payload, { withCredentials: true })
    return response;
}

export const getStockLive = async (payload: any
) => {
    const response = await axiosClient.post(POST_API.GET_STOCK_LIVE, payload, { withCredentials: true })
    return response;
}
export const getStockLiveForCompanyProduct  = async (payload: any
) => {
    const response = await axiosClient.post(POST_API.GET_STOCK_LIVE_COMPANY_PRODUCT, payload, { withCredentials: true })
    return response;
}
// getAccountCompanyProductDetails
export const getAccountCompanyProductDetails  = async (payload: any
) => {
    const response = await axiosClient.post(POST_API.GET_ACCOUNT_COMPANY_PRODUCT, payload, { withCredentials: true })
    return response;
}

export const fetchCompanyProduct  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.GET_PRODUCTS, payload, { withCredentials: true })
    return response;
}
export const fetchAccount  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.GET_ACCOUNT, payload, { withCredentials: true })
    return response;
}