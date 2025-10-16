/* eslint-disable @typescript-eslint/no-explicit-any */



  import axios from "axios";
  import POST_API from "../../constants/PostApi";
  import { STATUS_CODE } from "../../constants/AppConstants";
  import { useEffect, useState } from "react";
  import RefreshToken from "../validations/RefreshToken";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import ApiError from "../../@types/error/ApiError";
import Country from "../../@types/general/Country";
  
  export const useCountries = () => {

      const [countries, setCountries] = useState<Country[]>([]);
  
    const getAllCountries = async () => {
    const PostData: Country = {
      id: null,
      // dailcode: null,
      dialcode : null,
      name: null,
      description: null,
      isactive: true,
    };

    try {
      const response = await axios.post(POST_API.GET_COUNTRY, PostData, {
        withCredentials: true,
      });
      if (response.status == STATUS_CODE.OK) {
        console.log(response.data);
        setCountries(response.data);
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getAllCountries,
        });
        if (refreshTokenStatus) {
          getAllCountries();
        }
      }
    }
  };
      useEffect(() => {
            getAllCountries();

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
      
      return{
          countries,
      }
  
    };