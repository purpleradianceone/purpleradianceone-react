/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { STATUS_CODE } from "../../constants/AppConstants";
import toast from "react-hot-toast";
// import POST_API from "../../constants/PostApi";
// import axiosClient from "../../axios-client/AxiosClient";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";

// 👉 create type if needed
// interface GoogleMeetSettingType { ... }

function useGoogleMeetSetting() {
  const { loginStatus } = useLoggedInUserContext();

  const [googleMeetSetting, setGoogleMeetSetting] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const getGoogleMeetSetting = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      company_user_id: loginStatus.id,
      requestedby: loginStatus.id,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/main/purple-crm-api/get-google-meet-setting",
        postData,
        {
          withCredentials: true,
        },
      );

      if (response.status === STATUS_CODE.OK) {
        const data = response.data[0];
        // console.log(data);
        
        setGoogleMeetSetting(data);
        if (data && data.isactive == true) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      }
    } catch (error: any) {
      if (error.response?.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
        toast.error(error.response?.data);
      } else if (error.response?.status === 403) {
        toast.error("Unauthorized access");
      } else {
        toast.error("Failed to fetch Google Meet settings");
      }
    } finally {
      setIsLoading(false);
    }
  };
  console.log(isConnected);

  useEffect(() => {
    if (loginStatus?.companyId && loginStatus?.id) {
      getGoogleMeetSetting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginStatus]);

  return {
    isLoading,
    googleMeetSetting,
    GoogleMeetStatus: isConnected,
  };
}

export default useGoogleMeetSetting;
