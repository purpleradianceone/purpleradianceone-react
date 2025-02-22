import axios from "axios";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import POST_API from "../../constants/PostApi";
import { BOOLEAN_VALUES, NUMBER_VALUES, STATUS_CODE, STRING_VALUES } from "../../constants/AppConstants";
import SearchDropDownOptions from "../../@types/ag-grid/SearchDropDownOptions";
import { useEffect, useState } from "react";
import RefreshToken from "../validations/RefreshToken";
import ApiError from "../../@types/error/ApiError";

export const useComapanySpecificSearchDateRange = () => {

    const [dateRangeDropdownOptions, setDropdownOptions] = useState<
  SearchDropDownOptions[]
>([
  {
    id: NUMBER_VALUES.ZERO,
    criteria: STRING_VALUES.EMPTY_STRING,
    company_id: NUMBER_VALUES.ZERO,
    search_pages_criteria_id: NUMBER_VALUES.ZERO,
    search_date_range_id: NUMBER_VALUES.ZERO,
    createdby: NUMBER_VALUES.ZERO,
    updatedby: NUMBER_VALUES.ZERO,
    createdon: STRING_VALUES.EMPTY_STRING,
    updatedon: STRING_VALUES.EMPTY_STRING,
    date_range: STRING_VALUES.EMPTY_STRING,
  },
]);

const {loginStatus} = useLoggedInUserContext()

    const fetchDateRange = async() => {
        
        const postData = {
            requestedby: loginStatus.id,
            company_id: loginStatus.companyId,
          };
         await axios.post(POST_API.COMPANY_SPECIFIC_CRITERIA_DATE_RANGE, postData, {
              withCredentials: BOOLEAN_VALUES.TRUE,
            })
            .then((response) => {
              if (response.data) {
                setDropdownOptions(response.data);
              }
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error : ApiError | any) => {
              console.error(error);
              if(error.status === STATUS_CODE.UNATHORISED){
                 RefreshToken({callFunction: fetchDateRange})
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