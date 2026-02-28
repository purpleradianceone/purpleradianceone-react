/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAxios403Handler.ts
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../validations/RefreshToken";
import POST_API from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
import toast from "react-hot-toast";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import axiosClient, { cancelAllRequests } from "../../axios-client/AxiosClient";
import { LocalStorageKeys } from "../../enums/LocalStorageKeys";

export function useAxiosForbiddenHandler() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isHandlingRef = useRef(false); // prevents multiple dialogs and logout

  const dialogMessage =
    "Your session has expired or another login was detected. Please sign in again.";

  const handleLogout = async () => {
      await  cancelAllRequests();

    if (isHandlingRef.current) return;
    isHandlingRef.current = true;

    await axios
      .post(POST_API.LOGOUT, {}, { withCredentials: true })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
          localStorage.removeItem(LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT);
          localStorage.removeItem(LOCALSTORAGE_KEYS.GOOGLE_MEET_STATUS);
          localStorage.removeItem(LOCALSTORAGE_KEYS.ZOOM_MEETING_STATUS);
          localStorage.removeItem(LOCALSTORAGE_KEYS.USER_PREFERENCE);
          localStorage.removeItem(LOCALSTORAGE_KEYS.NOTIFICATION_COUNT);
          localStorage.removeItem(LocalStorageKeys.SUPPORT_TICKET_MANAGEMENT_FILTERS);
          localStorage.removeItem(LocalStorageKeys.ACCOUNT_COMPANY_PRODUCT_FOR_SUPPORT_TICKET);
          toast.success(response.data);
          setTimeout(() => {
            setIsDialogOpen(false);
          }, 2000);

          window.location.href = ROUTES_URL.SIGN_IN;
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: handleLogout,
          });
          if (refreshTokenResponse) {
            handleLogout();
          }
        }
        if(error.status === STATUS_CODE.FORBIDDEN){
            window.location.href = ROUTES_URL.SIGN_IN;
        }
      });
  };

  // useEffect(() => {
  //   const interceptor = axios.interceptors.response.use(
  //     (response) => response,
  //     (error) => {
  //       console.log("error from interceptor");
  //       console.log(error);
  //       if (error.status === STATUS_CODE.FORBIDDEN) {
  //         setIsDialogOpen(true);
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   const interceptorAxiosClient = axiosClient.interceptors.response.use(
  //     (response) => response,
  //     (error) => {
  //       console.log("error from axiosClient interceptor");
  //       console.log(error);
  //       if (error.status === STATUS_CODE.FORBIDDEN) {
  //         setIsDialogOpen(true);
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   return () => {
  //     axios.interceptors.response.eject(interceptor);
  //     axiosClient.interceptors.response.eject(interceptorAxiosClient);
  //   };
  // }, []);


  useEffect(() => {
    const onError = (error: any) => {

      if (error.status === STATUS_CODE.FORBIDDEN) {
        // if (!isHandlingRef.current) {
          setIsDialogOpen(true);
        // }
      }

      return Promise.reject(error);
    };

    const axiosInterceptor = axios.interceptors.response.use(
      (response) => response,
      onError
    );

    const axiosClientInterceptor = axiosClient.interceptors.response.use(
      (response) => response,
      onError
    );

    return () => {
      axios.interceptors.response.eject(axiosInterceptor);
      axiosClient.interceptors.response.eject(axiosClientInterceptor); 
    };
  }, []);

  const confirmHandler = () => {
    handleLogout();
  };

  return {
    isDialogOpen,
    dialogMessage,
    confirmHandler,
  };
}
