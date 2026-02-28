import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import POST_API from "../../constants/PostApi";
import { useEffect, useState } from "react";
import PostDataTypeForSupportTicketSourceAndCategoryAndLifecycle from "../../@types/support-ticket-management/PostDataTypeForSupportTicketSourceAndCategoryAndLifecycle";
import axiosClient from "../../axios-client/AxiosClient";
import { toast } from "react-hot-toast";

export const useSupportTicketCategory = () => {
  const { loginStatus } = useLoggedInUserContext();
  const [supportTicketCategory, setSupportTicketCategory] = useState<
    PostDataTypeForSupportTicketSourceAndCategoryAndLifecycle[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSupportTicketCategory = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      name: null,
      description: null,
      isactive: true,
      requestedby: loginStatus.id,
    };

    // if (postData.company_id === 0) return;

    await axiosClient
      .post(POST_API.GET_LOOKUP_SUPPORT_TICKET_CATEGORY, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setSupportTicketCategory(response.data);
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
    getSupportTicketCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    supportTicketCategory,
  };
};
