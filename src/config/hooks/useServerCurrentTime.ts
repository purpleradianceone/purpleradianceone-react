/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react"; // Import useState
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../validations/RefreshToken";
import ApiError from "../../@types/error/ApiError";

export const useServerCurrentTime = () => {
  // 1. Use useState to declare currentTime as a state variable
  const [currentTime, setCurrentTime] = useState("");

  const getServerCurrentTime = async () => {
    try {
      const response = await axios.get(POST_API.GET_SERVER_CURRENT_TIME, {
        withCredentials: true,
      });
      setCurrentTime(response.data);
    } catch (error: ApiError | any) {
      console.error(error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunction: getServerCurrentTime,
        });
        if (refreshTokenResponse) {
          getServerCurrentTime();
        }
      }
    }
  };

  useEffect(() => {
    getServerCurrentTime();
  }, []); // Empty dependency array means this runs once on mount

  return {
    currentTime, // This now returns the state variable
  };
};
