import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";

export const getReportType  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.GET_REPORT_TYPE, payload, { withCredentials: true })
    return response;
}