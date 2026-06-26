import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";

export const getLookupCompanyProduct = async (payload: object) => {
  const response = await axiosClient.post(
    POST_API.GET_LOOKUP_COMPANY_PRODUCT,
    payload,
    { withCredentials: true },
  );
  return response;
};


export const getLookupCompanyProductByProductType = async (payload: object) => {
  const response = await axiosClient.post(
    POST_API.GET_LOOKUP_COMPANY_PRODUCT_BY_PRODUCT_TYPE,
    payload,
    { withCredentials: true },
  );
  return response;
};


export const getLookupAccountCompanyProductByProductType = async (
  payload: object,
) => {
  const response = await axiosClient.post(
    POST_API.GET_LOOKUP_ACCOUNT_COMPANY_PRODUCT_BY_PRODUCT_TYPE,
    payload,
    { withCredentials: true },
  );
  return response;
};
