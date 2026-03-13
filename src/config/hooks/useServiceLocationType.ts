/* eslint-disable react-hooks/rules-of-hooks */
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import RefreshToken from "../validations/RefreshToken";
import POST_API from "../../constants/PostApi";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client/AxiosClient";
import ServiceLocationType from "../../@types/account/ServiceLocationType";

export const useServiceLocationType = () => {
  const { loginStatus } = useLoggedInUserContext();

  const [serviceLocationType, setServiceLocationType] = useState<
    ServiceLocationType[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getServiceLocationType = async () => {
    const postData = {
      id: null,
      name: null,
      isactive: null,
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
    };

    await axiosClient
      .post(POST_API.GET_SERVICE_LOCATION_TYPE, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setServiceLocationType(response.data);
          setIsLoading(false);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getServiceLocationType,
          });
          if (refreshTokenResponse) {
            getServiceLocationType();
          }
        }
      });
  };

  useEffect(() => {
    getServiceLocationType();
  }, []);

  return {
    isLoading,
    serviceLocationType,
  };
};
