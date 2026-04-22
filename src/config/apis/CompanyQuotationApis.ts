import axios from "axios";
import POST_API from "../../constants/PostApi";
import axiosClient from "../../axios-client/AxiosClient";


export const getQuotationType  = async (payload: object
) => {
    const response = await axios.post(POST_API.GET_QUOTATION_TYPE, payload, { withCredentials: true })
    return response;
}

export const getLookupQuotationTemplate  = async (payload: object , signal? : AbortSignal
) => {
    const response = await axiosClient.post(POST_API.GET_LOOKUP_QUOTATION_TEMPLATE, payload, {signal, withCredentials: true })
    return response;
}