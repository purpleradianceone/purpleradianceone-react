/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect } from "react"; // Import useState
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../validations/RefreshToken";
import ApiError from "../../@types/error/ApiError";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import { useZoomMeetingContext } from "../../context/meeting/ZoomMeetingContext";

export const useZoomMeetingsStatus = () => {
  const { loginStatus } = useLoggedInUserContext();
  const { setZoomMeetingStatus } = useZoomMeetingContext();

  const validateZoomMeetingsConnection = async () => {
    try {
      const validateZoomMeetingsConnectionPostData = {
        company_id: loginStatus.companyId,
        company_user_id: loginStatus.id,
        requestedby: loginStatus.id,
      };
      await axios
        .post(
          POST_API.VALIDATE_ZOOM_MEETINGS_CONNECTION,
          validateZoomMeetingsConnectionPostData,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            setZoomMeetingStatus({
              isConnected: response.data.status,
            });
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunction: validateZoomMeetingsConnection,
            });
            if (refreshTokenResponse) {
              validateZoomMeetingsConnection();
            }
          }
        });
    } catch (error: ApiError | any) {
      console.error(error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenResponse = await RefreshToken({
          callFunction: validateZoomMeetingsConnection,
        });
        if (refreshTokenResponse) {
          validateZoomMeetingsConnection();
        }
      }
    }
  };

  useEffect(() => {
    validateZoomMeetingsConnection();
  }, []);
};
