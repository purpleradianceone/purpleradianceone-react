import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";

export const getLookupCompanyProductForStockCreation  = async (payload: object
) => {
    const response = await axiosClient.post(POST_API.GET_LOOKUP_COMPANY_PRODUCT_FOR_STOCK_CREATION, payload, { withCredentials: true })
    return response;
}