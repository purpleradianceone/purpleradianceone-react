/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useEffect, useState } from "react";
import RefreshToken from "../validations/RefreshToken";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../@types/error/ApiError";
import IntervalType from "../../@types/interval/IntervalType";

export const useIntervalType = () => {
  const [intervalTypeData, setIntervalTypeData] = useState<
    IntervalType[]
  >([]);
  const [loading , setLoading]= useState<boolean>(true);

  const getIntervalType = async () => {
    setLoading(true)
    const PostData: IntervalType = {
      id: null,
      name: null,
      isactive: true,
    };

    try {
      const response = await axios.post(POST_API.GET_INTERVAL_TYPE, PostData, {
        withCredentials: true,
      });
      if (response.status == STATUS_CODE.OK) {
        setLoading(false)
        setIntervalTypeData(response.data);
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getIntervalType,
        });
        if (refreshTokenStatus) {
          getIntervalType();
        }
      }
    }
  };
  useEffect(() => {
    getIntervalType();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    intervalTypeData,
    loading
  };
};
