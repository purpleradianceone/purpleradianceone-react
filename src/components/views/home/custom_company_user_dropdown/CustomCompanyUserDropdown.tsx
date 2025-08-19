// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useCallback } from "react";
// import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
// import { GroupBase } from "react-select";
// import axios from "axios";
// import POST_API from "../../../../constants/PostApi";

// export interface UserResponse {
//   id: number;
//   company_id: number;
//   fullname: string;
//   email: string;
//   mobilenumber: string;
//   isactive: boolean;
//   createdby: string;
//   createdon: string;
// }

// interface OptionType {
//   value: number;
//   label: string;
//   email: string;
//   mobilenumber: string;
//   isActive: boolean;
// }

// interface Additional {
//   page: number;
// }

// interface Props {
//   limit: number;
//   companyId: number;
//   requestedBy: number;
//   onChange: (user: OptionType | null) => void;
// }

// const CompanyUserDropdown: React.FC<Props> = ({
//   limit,
//   companyId,
//   requestedBy,
//   onChange,
// }) => {
//   const loadOptions: LoadOptions<
//     OptionType,
//     GroupBase<OptionType>,
//     Additional
//   > = useCallback(
//     async (search, _loadedOptions, additional) => {
//       // safely get page, default to 1 if undefined
//       const page = additional?.page ?? 1;

//       const postData = {
//         company_id: companyId,
//         search_parameter: search || null, // fallback
//         isactive: null,
//         offset: (page - 1) * limit,
//         limit: limit,
//         requestedby: requestedBy,
//       };

//       const response = await axios.post<UserResponse[]>(
//         POST_API.GET_COMPANY_USERS,
//         postData,
//         {
//           withCredentials: true,
//         }
//       );

//       const users = response.data || [];

//       return {
//         options: users.map((u) => ({
//           value: u.id,
//           label: u.fullname,
//           email: u.email,
//           mobilenumber: u.mobilenumber,
//           isActive: u.isactive,
//         })),
//         hasMore: users.length === 50,
//         additional: {
//           page: page + 1,
//         },
//       };
//     },
//     [companyId, requestedBy, limit]
//   );

//   return (
//     <div className="">
//       <AsyncPaginate<OptionType, GroupBase<OptionType>, Additional>
//         placeholder="Select Company User..."
//         debounceTimeout={300}
//         loadOptions={loadOptions}
//         onChange={onChange}
//         additional={{ page: 1 }}
//         isClearable
//       />
//     </div>
//   );
// };

// export default CompanyUserDropdown;
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useCallback } from "react";
// import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
// import { GroupBase } from "react-select";
// import axios from "axios";
// import POST_API from "../../../../constants/PostApi";
// import { createPortal } from "react-dom";
// import { useUserPreference } from "../../../../context/user/UserPreference";

// export interface UserResponse {
//   id: number;
//   company_id: number;
//   fullname: string;
//   email: string;
//   mobilenumber: string;
//   isactive: boolean;
//   createdby: string;
//   createdon: string;
// }

// interface OptionType {
//   value: number;
//   label: string;
//   email: string;
//   mobilenumber: string;
//   isActive: boolean;
// }

// interface Additional {
//   page: number;
// }

// interface Props {
//   limit: number;
//   companyId: number;
//   requestedBy: number;
//   onChange: (user: OptionType | null) => void;
// }
// // eslint-disable-next-line react-hooks/rules-of-hooks
// const {userPreference} = useUserPreference();

// const CompanyUserDropdown: React.FC<Props> = ({
//   limit,
//   companyId,
//   requestedBy,
//   onChange,
// }) => {
//   const loadOptions: LoadOptions<
//     OptionType,
//     GroupBase<OptionType>,
//     Additional
//   > = useCallback(
//     async (search, _loadedOptions, additional) => {
//       const page = additional?.page ?? 1;

//       const postData = {
//         company_id: companyId,
//         search_parameter: search || null,
//         isactive: null,
//         offset: (page - 1) * limit,
//         limit: limit,
//         requestedby: requestedBy,
//       };

//       const response = await axios.post<UserResponse[]>(
//         POST_API.GET_COMPANY_USERS,
//         postData,
//         { withCredentials: true }
//       );

//       const users = response.data || [];

//       return {
//         options: users.map((u) => ({
//           value: u.id,
//           label: u.fullname,
//           email: u.email,
//           mobilenumber: u.mobilenumber,
//           isActive: u.isactive,
//         })),
//         hasMore: users.length === limit, // use dynamic check
//         additional: {
//           page: page + 1,
//         },
//       };
//     },
//     [companyId, requestedBy, limit]
//   );

//   return createPortal(
//     <div className={`fixed ${userPreference.isLeftMenu?"top-12":"top-1"}  right-0`}>
//       <AsyncPaginate<OptionType, GroupBase<OptionType>, Additional>
//         placeholder="Select Company User..."
//         debounceTimeout={300}
//         loadOptions={loadOptions}
//         onChange={onChange}
//         additional={{ page: 1 }}
//         isClearable
//         styles={{
//           control: (provided) => ({
//             ...provided,
//             minHeight: "32px", // reduce default height
//             height: "32px",
//             fontSize: "14px",
//           }),
//           valueContainer: (provided) => ({
//             ...provided,
//             padding: "0 6px",
//           }),
//           input: (provided) => ({
//             ...provided,
//             margin: 0,
//             padding: 0,
//           }),
//           indicatorsContainer: (provided) => ({
//             ...provided,
//             height: "32px",
//           }),
//         }}
//       />
//     </div>,
//     document.body
//   );
// };

// export default CompanyUserDropdown;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { GroupBase } from "react-select";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import { createPortal } from "react-dom";
import { useUserPreference } from "../../../../context/user/UserPreference";

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

  // simple API call (no Promise<UserResponse[]> typing)
  const fetchCompanyUsers = async (search: string, page: number) => {
    const postData = {
      company_id: companyId,
      search_parameter: search || null,
      isactive: null,
      offset: (page - 1) * limit,
      limit: limit,
      requestedby: requestedBy,
    };

    const response = await axios.post(POST_API.GET_COMPANY_USERS, postData, {
      withCredentials: true,
    });

    return response.data || [];
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
