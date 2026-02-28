/* eslint-disable @typescript-eslint/no-explicit-any */
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useEffect, useState } from "react";
import RefreshToken from "../validations/RefreshToken";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../@types/error/ApiError";
import District from "../../@types/general/District";
import axiosClient from "../../axios-client/AxiosClient";

export const useDistricts = (stateId: number) => {
  const [districts, setDistricts] = useState<District[]>([]);

  const getAllDistricts = async () => {
    const PostData: District = {
      id: null,
      state_id: stateId,
      name: null,
      description: null,
      isactive: true,
    };

    try {
      const response = await axiosClient.post(POST_API.GET_DISTRICT, PostData, {
        withCredentials: true,
      });
      if (response.status == STATUS_CODE.OK) {
        setDistricts(response.data);
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getAllDistricts,
        });
        if (refreshTokenStatus) {
          getAllDistricts();
        }
      }
    }
  };
  // useEffect(() => {
  //   if (!stateId || stateId <= 0) return;
  //     getAllDistricts();


  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [stateId]);

  useEffect(() => {
    if (!stateId || stateId <= 0) {
      setDistricts([]);   // return empty array
      return;             // do not call API
    }

    getAllDistricts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId]);

  return {
    districts,
    getAllDistricts
  }

};