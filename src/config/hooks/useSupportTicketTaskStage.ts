import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import POST_API from "../../constants/PostApi";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client/AxiosClient";
import toast from "react-hot-toast";
import SupportTicketTaskStage from "../../@types/support-ticket-management/SupportTicketTaskStage";

export const useSupportTicketTaskStage = () => {
  const { loginStatus } = useLoggedInUserContext();
  const [supportTicketTaskStage, setSupportTicketStage] = useState<
    SupportTicketTaskStage[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSupportTicketTaskStage = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      name: null,
      isactive: true,
      requestedby: loginStatus.id,
    };

    // if (postData.company_id === 0) return;

    await axiosClient
      .post(POST_API.GET_SUPPORT_TICKET_TASK_STAGE, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setSupportTicketStage(response.data);
          setIsLoading(false);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.INTERNAL_SERVER_ERROR) {
          toast.error(error.response?.data);
        }
      });
  };

  useEffect(() => {
    getSupportTicketTaskStage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    supportTicketTaskStage,
  };
};
