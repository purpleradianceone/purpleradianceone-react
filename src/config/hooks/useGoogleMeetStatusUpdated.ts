import { useEffect, useState } from "react";
import { GoogleMeetStatus } from "../../@types/meeting/GoogleMeetStatus";
import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import { handleApiError } from "../error/handleApiError";


// export interface GoogleMeetStatus {
//   id: number;
//   company_id: number;
//   company_user_id: number;
//   userName: string;
//   gmail_address: string;
//   current_date: string;
//   isactive: boolean;
//   createdby: string;
//   createdon: string;
// }

interface UseGoogleMeetStatusProps {
  companyId: number;
  userId: number;
}

export const useGoogleMeetStatusUpdated = ({
  companyId,
  userId,
}: UseGoogleMeetStatusProps) => {
  const [googleMeetStatus, setGoogleMeetStatus] =
    useState<GoogleMeetStatus | null>(null);

  const [loading, setLoading] = useState(false);

  const getGoogleMeetStatus = async () => {
    try {
      setLoading(true);

      const response = await axiosClient.post(
        POST_API.GOOGLE_MEET_STATUS,
        {
          requestedby: userId,
          company_id: companyId,
          company_user_id: userId,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === STATUS_CODE.OK) {
        const item = response.data[0];

        const formattedData: GoogleMeetStatus = {
          userName: item["User Name"],
          company_id: item.company_id,
          company_user_id: item.company_user_id,
          createdby: item.createdby,
          createdon: item.createdon,
          current_date: item.current_date,
          gmail_address: item.gmail_address,
          id: item.id,
          isactive: item.isactive,
        };

        setGoogleMeetStatus(formattedData);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId && userId) {
      getGoogleMeetStatus();
    }
  }, [companyId, userId]);

  return {
    googleMeetStatus,
    loading,
    refreshGoogleMeetStatus: getGoogleMeetStatus,
  };
};