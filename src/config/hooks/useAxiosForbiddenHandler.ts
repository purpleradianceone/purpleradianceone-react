/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAxios403Handler.ts
import { useEffect, useState } from "react";
import axios from "axios";
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../validations/RefreshToken";
import POST_API from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
import toast from "react-hot-toast";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";

export function useAxiosForbiddenHandler() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogMessage =
    "Your session has expired or another login was detected. Please sign in again.";

  const handleLogout = async () => {
    await axios
      .post(POST_API.LOGOUT, {}, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
          localStorage.removeItem(LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT);
          localStorage.removeItem(LOCALSTORAGE_KEYS.GOOGLE_MEET_STATUS);
          localStorage.removeItem(LOCALSTORAGE_KEYS.ZOOM_MEETING_STATUS);
          localStorage.removeItem(LOCALSTORAGE_KEYS.USER_PREFERENCE);
          localStorage.removeItem(LOCALSTORAGE_KEYS.NOTIFICATION_COUNT);
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
      });
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log("error from interceptor");
        console.log(error);
        if (error.status === STATUS_CODE.FORBIDDEN) {
          setIsDialogOpen(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
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
