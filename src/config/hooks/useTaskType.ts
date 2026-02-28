import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ApiError from "../../@types/error/ApiError";
import PostDataTypeForTaskType from "../../@types/my-task-management/PostDataTypeForTaskType";
import axiosClient from "../../axios-client/AxiosClient";
import { STATUS_CODE } from "../../constants/AppConstants";
import POST_API from "../../constants/PostApi";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";

function useTaskType() {

      const { loginStatus } = useLoggedInUserContext();
  const [taskType, setTaskType] = useState<
    PostDataTypeForTaskType[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getTaskType = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      name: null,
      isactive: true,
      requestedby: loginStatus.id,
    };

    // if (postData.company_id === 0) return;

    await axiosClient
      .post(POST_API.GET_TASK_TYPE, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          console.log(response.data);
          
          setTaskType(response.data);
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
    getTaskType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    taskType,
  };

}

export default useTaskType;
