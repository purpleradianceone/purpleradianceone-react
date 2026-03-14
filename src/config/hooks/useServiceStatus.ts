/* eslint-disable react-hooks/rules-of-hooks */
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import RefreshToken from "../validations/RefreshToken";
import POST_API from "../../constants/PostApi";
import { useEffect, useState } from "react";

import axiosClient from "../../axios-client/AxiosClient";
import ServiceStatus from "../../@types/account/ServiceStatus";

export const useServiceStatus = () => {
  const { loginStatus } = useLoggedInUserContext();

  const [serviceStatus, setServiceStatus] = useState<ServiceStatus[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getServiceStatus = async () => {
    const postData = {
      id: null,
      name: null,
      isactive: null,
      company_id: loginStatus.companyId,
      requestedby_id: loginStatus.id,
    };

    await axiosClient
      .post(POST_API.GET_SERVICE_STATUS, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setServiceStatus(response.data);
          setIsLoading(false);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getServiceStatus,
          });
          if (refreshTokenResponse) {
            getServiceStatus();
          }
        }
      });
  };

  useEffect(() => {
    getServiceStatus();
  }, []);

  return {
    isLoading,
    serviceStatus,
  };
};
