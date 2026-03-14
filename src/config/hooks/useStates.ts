/* eslint-disable @typescript-eslint/no-explicit-any */
  import POST_API from "../../constants/PostApi";
  import { STATUS_CODE } from "../../constants/AppConstants";
  import { useEffect, useState } from "react";
  import RefreshToken from "../validations/RefreshToken";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import ApiError from "../../@types/error/ApiError";
import State from "../../@types/general/State";
import axiosClient from "../../axios-client/AxiosClient";
  
  export const useStates = (countryId : number) => {

      const [states, setStates] = useState<State[]>([]);
  
    const getAllStates = async () => {
    const PostData: State = {
      id: null,
      country_id: countryId,
      name: null,
      description: null,
      gst_code: null,
      isactive: true,
    };

    try {
      const response = await axiosClient.post(POST_API.GET_STATE, PostData, {
        withCredentials: true,
      });
      if (response.status == STATUS_CODE.OK) {
        setStates(response.data);
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getAllStates,
        });
        if (refreshTokenStatus) {
          getAllStates();
        }
      }
    }
  };
      useEffect(() => {
        if(countryId){

          getAllStates(); 
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [countryId]);
      
      return{
          states,
      }
  
    };