import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import POST_API from "../../constants/PostApi";
import axiosClient from "../../axios-client/AxiosClient";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import PostDataTypeForTaskFrequency from "../../@types/my-task-management/PostDataTypeForTaskFrequency";

function useTaskFrequency() {
      const { loginStatus } = useLoggedInUserContext();
  const [taskFrequency, setTaskFrequency] = useState<
    PostDataTypeForTaskFrequency[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getTaskFrequency = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      name: null,
      isactive: true,
      requestedby: loginStatus.id,
    };

    // if (postData.company_id === 0) return;

    await axiosClient
      .post(POST_API.GET_TASK_FREQUENCY, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          console.log(response.data);
          
          setTaskFrequency(response.data);
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
    getTaskFrequency();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    taskFrequency,
  };

}


export default useTaskFrequency;