import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ApiError from "../../@types/error/ApiError";
import axiosClient from "../../axios-client/AxiosClient";
import { STATUS_CODE } from "../../constants/AppConstants";
import POST_API from "../../constants/PostApi";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import PostDataTypeForTaskStage from "../../@types/my-task-management/PostDataTypeForTaskStage";

function useTaskStage() {

      const { loginStatus } = useLoggedInUserContext();
  const [taskStage, setTaskStage] = useState<
    PostDataTypeForTaskStage[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getTaskStage = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      name: null,
      isactive: true,
      requestedby: loginStatus.id,
    };

    // if (postData.company_id === 0) return;

    await axiosClient
      .post(POST_API.GET_TASK_STAGE, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          console.log(response.data);
          
          setTaskStage(response.data);
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
    getTaskStage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    taskStage,
  };

}

export default useTaskStage;
