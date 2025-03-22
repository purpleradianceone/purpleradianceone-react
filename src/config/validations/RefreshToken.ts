import axios from "axios";
import { STATUS_CODE } from "../../constants/AppConstants";
import POST_API from "../../constants/PostApi";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../@types/error/ApiError";

const RefreshToken = async (props : {
    callFunction? : () => Promise<void>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callFunctionWithEvent? : (event : any) => Promise<void>
}) => {
    try {
      const refreshResponse = await axios.post(
        POST_API.REFRESH_TOKEN,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(refreshResponse);
      console.log("response Refresh");
      if (props.callFunction) {
        if (props.callFunction.length === 0) {
            // Call the function without arguments
            await props.callFunction();
        } else if(props.callFunctionWithEvent){
            
            const event = new Event('refresh') as unknown as React.FormEvent; // Cast to React.FormEvent
            await props.callFunctionWithEvent(event)
        }
    }

      
      return true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: ApiError | any) {
      console.log(error);
      console.log("refresh");
      if (error.status === STATUS_CODE.UNATHORISED) {
        return false;
      }
    }
  };

  export default RefreshToken;