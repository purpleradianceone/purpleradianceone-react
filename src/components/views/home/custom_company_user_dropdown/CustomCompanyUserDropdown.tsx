import React from "react";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { GroupBase } from "react-select";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import { createPortal } from "react-dom";
import { useUserPreference } from "../../../../context/user/UserPreference";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../../@types/error/ApiError";

export interface UserResponse {
  id: number;
  company_id: number;
  fullname: string;
  email: string;
  mobilenumber: string;
  isactive: boolean;
  createdby: string;
  createdon: string;
}

interface OptionType {
  value: number;
  label: string;
  email: string;
  mobilenumber: string;
  isActive: boolean;
}

interface Additional {
  page: number;
}

interface Props {
  limit: number;
  companyId: number;
  requestedBy: number;
  onChange: (user: OptionType | null) => void;
}

const CompanyUserDropdown: React.FC<Props> = ({
  limit,
  companyId,
  requestedBy,
  onChange,
}) => {
  const { userPreference } = useUserPreference();

  const fetchCompanyUsers = async (search: string, page: number) => {
    const postData = {
      company_id: companyId,
      search_parameter: search || null,
      isactive: null,
      offset: (page - 1) * limit,
      limit: limit,
      requestedby: requestedBy,
    };

    try{
    const response = await axios.post(POST_API.GET_COMPANY_USERS, postData, {
      withCredentials: true,
    });
    return response.data || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: ApiError | any){
      if(error.status === STATUS_CODE.UNATHORISED){
        const refreshTokenStatus = await RefreshToken({
              callFunctionWithTwoParamsNotEvent: fetchCompanyUsers,
            });
            if (refreshTokenStatus) {
              fetchCompanyUsers(search,page);
            }
      }
    }

    return [];
  };

  const loadOptions: LoadOptions<
    OptionType,
    GroupBase<OptionType>,
    Additional
  > = async (search, _loadedOptions, additional) => {
    const page = additional?.page ?? 1;
    const users: UserResponse[] = await fetchCompanyUsers(search, page);

    return {
      options: users.map((u) => ({
        value: u.id,
        label: u.fullname,
        email: u.email,
        mobilenumber: u.mobilenumber,
        isActive: u.isactive,
      })),
      hasMore: users.length === limit,
      additional: {
        page: page + 1,
      },
    };
  };

  return createPortal(
    <div
      className={`fixed ${
        userPreference.isLeftMenu ? "top-12" : "top-14"
      } right-0 `}
    >
      <AsyncPaginate<OptionType, GroupBase<OptionType>, Additional>
        placeholder="Select Company User..."
        debounceTimeout={300}
        loadOptions={loadOptions}
        onChange={onChange}
        additional={{ page: 1 }}
        isClearable
        styles={{
          control: (provided) => ({
            ...provided,
            maxWidth:"250px",
            minHeight: "31px",
            minWidth: "200px",
            height: "31px",
            fontSize: "14px",
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: "0 6px",
          }),
          input: (provided) => ({
            ...provided,
            margin: 0,
            padding: 0,
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            height: "32px",
          }),
        }}
      />
    </div>,
    document.body
  );
};

export default CompanyUserDropdown;
