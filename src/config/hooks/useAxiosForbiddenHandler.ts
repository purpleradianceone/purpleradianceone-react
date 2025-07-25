/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAxios403Handler.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import ApiError from '../../@types/error/ApiError';
import { STATUS_CODE } from '../../constants/AppConstants';
import RefreshToken from '../validations/RefreshToken';
import POST_API from '../../constants/PostApi';
import ROUTES_URL from '../../constants/Routes';

export function useAxiosForbiddenHandler() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogMessage = 'Session Expired. Please login again.';

   const handleLogout = async() => {
    await axios.post(POST_API.LOGOUT,{} , {withCredentials: true} )
    .then((response ) =>{
      if(response.status === 200){
        localStorage.clear();
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

  }

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        console.log("error from interceptor");
        console.log(error);
        if (error.response?.status === 403) {
          setIsDialogOpen(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const closeDialog = () => setIsDialogOpen(false);
  const confirmHandler = () => {
      handleLogout();
  };

  return {
    isDialogOpen,
    dialogMessage,
    closeDialog,
    confirmHandler,
  };
}
