/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react"; // Import useState
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../validations/RefreshToken";
import ApiError from "../../@types/error/ApiError";
import MeetingPlatforms from "../../@types/meeting/MeetingPlatform";

export const useMeetingPlatform = () => {
  // 1. Use useState to declare meetingPlatform as a state variable
  const [meetingPlatform, setMeetingPlatform] = useState<MeetingPlatforms[]>([]);

  const getMeetingPlatform = async () => {
    try {
      const response = await axios.post(
        POST_API.GET_MEETING_PLATFORMS,
        {},
        {
          withCredentials: true,
        }
      );
      //
      setMeetingPlatform([]);
      if (response.status === STATUS_CODE.OK) {
        response.data.map((res : any) => {
          setMeetingPlatform((prev) => [
            ...prev,
            {
              id: res.id,
              colorCode : res.color_code,
              name : res.name,
            isActive : res.isactive
            },
          ]);
        });
      }
    } catch (error: ApiError | any) {
      console.error(error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunction: getMeetingPlatform,
        });
      }
    }
  };

  useEffect(() => {
    getMeetingPlatform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount

  return {
    meetingPlatform, // This now returns the state variable
  };
};
