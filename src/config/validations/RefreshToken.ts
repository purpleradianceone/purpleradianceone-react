/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { STATUS_CODE } from "../../constants/AppConstants";
import POST_API from "../../constants/PostApi";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../@types/error/ApiError";

const RefreshToken = async (props: {
  callFunction?: () => Promise<void>;
  callFunctionWithEvent?: (event: any) => Promise<void>;
  callFunctionWithParamsNotEvent?: (params: any) => Promise<void>;
  callFunctionWithTwoParamsNotEvent?: (
    paramOne: any,
    paramTwo: any
  ) => Promise<void>;
}): Promise<boolean> => { // Explicitly declare return type as Promise<boolean>
  try {
    const response = await axios.post( // Await the axios call directly
      POST_API.REFRESH_TOKEN,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.status === STATUS_CODE.OK) {
      console.log(response);
      console.log("returning from refresh token");
      console.log(response.status === STATUS_CODE.OK);

      // Call functions after successful token refresh
      // if (props.callFunction) {
      //   if (props.callFunction.length === 0) {
      //     console.log(props.callFunction());
      //     // await props.callFunction();
      //   }
      // } else if (props.callFunctionWithEvent) {
      //   const event = new Event("refresh") as unknown as React.FormEvent;
      //   console.log(props.callFunctionWithEvent(event))
      // }
      console.log(props);
      // You might want to handle callFunctionWithParamsNotEvent and callFunctionWithTwoParamsNotEvent here as well

      return true; // Return true on success
    } else {
      // Handle cases where status is not OK but not an error (e.g., 204 No Content)
      // This part depends on your API's specific responses
      return false;
    }
  } catch (error: ApiError | any) {
    if (axios.isAxiosError(error) && error.response) { // Check if it's an Axios error with a response
      if (error.response.status === STATUS_CODE.UNATHORISED) {
        return false; // Return false on unauthorized error
      }
    }
    // For other types of errors or unexpected Axios errors, re-throw or return false
    console.error("RefreshToken error:", error);
    return false; // Default to false for any other error
  }
};

export default RefreshToken;