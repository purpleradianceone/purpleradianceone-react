import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";

export const getFacebookComapnyStatus  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.GET_FACEBOOK_COMPANY_STATUS, payload, { withCredentials: true })
    return response;
}

export const getFacebookPageDetails  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.GET_FACEBOOK_PAGE_DETAILS, payload, { withCredentials: true })
    return response;
}

/**
 * 
 * @param payload  - object contains post data
 * @returns response or error
 */
export const createConnectFacebookPage  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.CREATE_CONNECT_FACEBOOK_PAGE, payload, { withCredentials: true })
    return response;
}

/**
 * CREATE CONNECT WHATSAPP ACCOUNT API
 * @param payload - object contains post data
 * @returns response or error
 */
export const createConnectWhatsappAccount  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.CREATE_CONNECT_WHATSAPP_ACCOUNT, payload, { withCredentials: true })
    return response;
}

export const disconnectFacebookPage  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.DELETE_FACEBOOK_PAGE_DETAILS, payload, { withCredentials: true })
    return response;
}

export const disconnectFacebookAccount = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.DISCONNECT_FACEBOOK_ACCOUNT, payload, { withCredentials: true })
    return response;
}
/**
 * GET FACEBOOK ACCOUNT RELATED WHATSAPP ACCOUNTS DATA 
 * @param payload 
 * @returns 
 */
// "http://localhost:8080/api/main/purple-crm-api/get/me-whatsapp-accounts"
export const getMeWhatsappAccount  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.GET_ME_WHATSAPP_ACCOUNTS , payload, { withCredentials: true })
    return response;
}

/**
 * CREATE WHATSAPP PHONE INTEGRATION 
 * @param payload 
 * @returns 
 */
// "http://localhost:8080/api/main/purple-crm-api/create/whatsapp-phone-integration"
export const createWhatsappPhoneIntegration  = async (payload: object
) => {
    
    const response = await axiosClient.post(POST_API.CREATE_WHATSAPP_PHONE_INTEGRATION, payload, { withCredentials: true })
    return response;
}
/**
 * GET THE COMPANY ASSIGNED WHATSAPP PHONE DETAILS
 * @param payload 
 * @returns 
 */
// "http://localhost:8080/api/main/purple-crm-api/get/whatsapp-phone-integration"

export const getCompanyWhatsappPhone  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.GET_WHATSAPP_PHONE_INTEGRATION, payload, { withCredentials: true })
    return response;
}

/**
 * INACTIVE THE CONNECTED WHATSAPP PHONE NUMBER 
 * @param payload 
 * @returns RESPONSE STATUS RETURNED FROM BACKEND
 */
// "http://localhost:8080/api/main/purple-crm-api/update/whatsapp-phone-integration"

export const updateCompanyWhatsappPhone  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.UPDATE_WHATSAPP_PHONE_INTEGRATION, payload, { withCredentials: true })
    return response;
}