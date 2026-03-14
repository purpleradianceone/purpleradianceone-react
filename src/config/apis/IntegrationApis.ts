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

export const createConnectFacebookPage  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.CREATE_CONNECT_FACEBOOK_PAGE, payload, { withCredentials: true })
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