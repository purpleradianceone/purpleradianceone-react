/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { useState } from "react";
import RefreshToken from "../validations/RefreshToken";
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";



export const useCreateCall = <T,>(
  apiUrl: string,

) => {

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track retry count
//   const retryCount = useRef(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const triggerCall = async (postData: Record<string, any>) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await axios.post(apiUrl, postData, {
        withCredentials: true,
      });

      setData(response.data);
      setSuccess(true);
    //   retryCount.current = 0; // reset on success
      

    }
    //  catch (err: any) {
    //   const status = err?.response?.status;

    //   // ---- Handle 401 Refresh Token Retry ----
    //   if (status === 401 ) {
    //     // retryCount.current++;
    //     const refreshed = await RefreshToken({ callFunction: triggerCall });
    //     if (refreshed) {
    //       return triggerCall(postData);
    //     }
    //   }
    //   // ---- Other Errors ----
    //   const message = err?.response?.data || "Something went wrong";
    //   setError(message);
    //   toast.error(message);
    //   return null;
    // } 
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
