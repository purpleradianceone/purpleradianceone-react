import { useEffect, useState } from "react";
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import toast from "react-hot-toast";
import POST_API from "../../constants/PostApi";
import axiosClient from "../../axios-client/AxiosClient";
import PostDataTypeForTaskPriority from "../../@types/my-task-management/PostDataTypeForTaskPriority";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";

function useTaskPriority() {
      const { loginStatus } = useLoggedInUserContext();
  const [taskPriority, setTaskPriority] = useState<
    PostDataTypeForTaskPriority[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getTaskPriority = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      name: null,
      isactive: true,
      requestedby: loginStatus.id,
    };

    // if (postData.company_id === 0) return;

    await axiosClient
      .post(POST_API.GET_TASK_PRIORITY, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          console.log(response.data);
          
          setTaskPriority(response.data);
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
    getTaskPriority();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    taskPriority,
  };

}

export default useTaskPriority;