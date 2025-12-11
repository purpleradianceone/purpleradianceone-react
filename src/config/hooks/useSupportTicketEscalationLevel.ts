import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import POST_API from "../../constants/PostApi";
import { useEffect, useState } from "react";
import PostDataTypeForSupportTicketSourceAndCategoryAndLifecycle from "../../@types/support-ticket-management/PostDataTypeForSupportTicketSourceAndCategoryAndLifecycle";
import axiosClient from "../../axios-client/AxiosClient";
import toast from "react-hot-toast";

export const useSupportTicketEscalationLevel = () => {
  const { loginStatus } = useLoggedInUserContext();
  const [supportTickeEscalationLevel, setSupportTicketEscalationLevel] = useState<
    PostDataTypeForSupportTicketSourceAndCategoryAndLifecycle[] 
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSupportTicketEscalationLevel = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      name: null,
      isactive: true,
      requestedby: loginStatus.id,
    };

    await axiosClient
      .post(POST_API.GET_SUPPORT_TICKET_ESCALATION_LEVEL, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setSupportTicketEscalationLevel(response.data);
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
    getSupportTicketEscalationLevel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    supportTickeEscalationLevel,
  };
};
