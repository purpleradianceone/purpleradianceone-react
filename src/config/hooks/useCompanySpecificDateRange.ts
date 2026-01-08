import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import POST_API from "../../constants/PostApi";
import { STATUS_CODE } from "../../constants/AppConstants";
import SearchDropDownOptions from "../../@types/ag-grid/SearchDropDownOptions";
import { useEffect, useState } from "react";
import RefreshToken from "../validations/RefreshToken";
import ApiError from "../../@types/error/ApiError";
import axios from "axios";

export const useComapanySpecificSearchDateRange = () => {

    const [dateRangeDropdownOptions, setDropdownOptions] = useState<
  SearchDropDownOptions[]
>([
  {
    id: 0,
    criteria: "",
    company_id: 0,
    search_pages_criteria_id: 0,
    search_date_range_id: 0,
    createdby: 0,
    updatedby: 0,
    createdon: "",
    updatedon: "",
    date_range: "",
  },
]);

const {loginStatus} = useLoggedInUserContext()

    const fetchDateRange = async() => {
        if(loginStatus.companyId===0)return;
        const postData = {
            requestedby: loginStatus.id,
            company_id: loginStatus.companyId,
          };
         await axios.post(POST_API.COMPANY_SPECIFIC_CRITERIA_DATE_RANGE, postData, {
              withCredentials: true,
            })
            .then((response) => {
              if (response.data) {
                setDropdownOptions(response.data);
              }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch(async(error : ApiError | any) => {
              console.error(error);
              if(error.status === STATUS_CODE.UNATHORISED){
                 const refreshTokenResponse =  await RefreshToken({callFunction: fetchDateRange});
                 if(refreshTokenResponse){
                  fetchDateRange();
                 }
                 
              }
            });
    }

    useEffect(() => {
      const delay = 200; // Adjust the delay as needed (milliseconds)

      const timerId = setTimeout(() => {
          fetchDateRange();
      }, delay);

      return () => clearTimeout(timerId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
    return{
        dateRangeDropdownOptions,
    }

  };