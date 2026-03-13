/* eslint-disable react-hooks/rules-of-hooks */
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import RefreshToken from "../validations/RefreshToken";
import POST_API from "../../constants/PostApi";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client/AxiosClient";
import ServiceBookingSource from "../../@types/account/ServiceBookingSource";

export const useServiceBookingSource = () => {
  const { loginStatus } = useLoggedInUserContext();

  const [serviceBookingSource, setServiceBookingSource] = useState<
    ServiceBookingSource[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getServiceBookingSource = async () => {
    const postData = {
      id: null,
      name: null,
      isactive: null,
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
    };

    await axiosClient
      .post(POST_API.GET_SERVICE_BOOKING_SOURCE, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setServiceBookingSource(response.data);
          setIsLoading(false);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getServiceBookingSource,
          });
          if (refreshTokenResponse) {
            getServiceBookingSource();
          }
        }
      });
  };

  useEffect(() => {
    getServiceBookingSource();
  }, []);

  return {
    isLoading,
    serviceBookingSource,
  };
};
