/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import RefreshToken from "../validations/RefreshToken";
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import axiosClient from "../../axios-client/AxiosClient";



export const useCreateCall = <T,>(
  apiUrl: string,

) => {

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const triggerCall = async (postData: Record<string, any>) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await axiosClient.post(apiUrl, postData, {
        withCredentials: true,
      });

      setData(response.data);
      setSuccess(true);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: ApiError | any) {
            if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({
                    callFunctionWithParamsNotEvent:  triggerCall,
                });
                if (refreshTokenStatus) {
                    triggerCall(postData);
                }
            }
        }
    finally {
      setLoading(false);
    }
  };

  return {
    triggerCall, 
    data,
    loading,
    success,
    error,
  };
};
