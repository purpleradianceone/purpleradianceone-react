import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";

export const getReportType  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.GET_REPORT_TYPE, payload, { withCredentials: true })
    return response;
}

export const getCompanyUserReport = async(paylode: object)=>{
    const response = await axiosClient.post(POST_API.GET_COMPANY_USER_REPORT, paylode,  {withCredentials: true})
    return response;
}