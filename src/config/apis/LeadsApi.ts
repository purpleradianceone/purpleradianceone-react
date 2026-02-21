import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";

export const getLookupLeads  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.GET_LOOKUP_LEADS, payload, { withCredentials: true })
    return response;
}

export const getLeadNotes  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.GET_LEADS_NOTES, payload, { withCredentials: true })
    return response;
}

export const createLeadNote  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.CREATE_LEADS_NOTE, payload, { withCredentials: true })
    return response;
}

export const updateLeadNote  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.UPDATE_LEADS_NOTE, payload, { withCredentials: true })
    return response;
}