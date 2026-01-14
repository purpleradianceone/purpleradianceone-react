import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";

export const getLookupLeads  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.GET_LOOKUP_LEADS, payload, { withCredentials: true })
    return response;
}