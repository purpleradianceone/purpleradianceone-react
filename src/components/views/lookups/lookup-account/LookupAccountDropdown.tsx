/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef } from "react";
import Select, { components } from "react-select";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { getLookupAccounts } from "../../../../config/apis/AccountApis";
import { handleApiError } from "../../../../config/error/handleApiError";
import { Mail, Phone } from "lucide-react";

export const LookupAccountDropdown = ({
  icon,
  label,
  value,
  handleAccountSelection,
  isDisabled = false,
}: {
  icon?: React.ReactNode;
  label?: string;
  value?: any;
  handleAccountSelection: (data: any) => void;
  isDisabled?: boolean;
}) => {
  const { loginStatus } = useLoggedInUserContext();

  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const selectRef = useRef<any>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (isDisabled) return;

    const delayDebounce = setTimeout(() => {
      fetchAccounts(inputValue);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, isDisabled]);

  const fetchAccounts = async (searchText: string) => {
    setLoading(true);

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      isactive: true,
      limit: 20,
      offset: 0,
      search_parameter: searchText,
      requestedby_id: loginStatus.id,
    };

    try {
      const res = await getLookupAccounts(postData);

      const formatted = res.data.map((item: any) => ({
        value: item.id,
        label: item.name || "Unnamed",
        data: item,
      }));

      setOptions(formatted);
      setLoading(false);
    } catch (error) {
      handleApiError(error);
      setLoading(false);
    }
  };

  /* ================= CUSTOM OPTION ================= */
  const CustomOption = (props: any) => {
    const { data, isSelected } = props;

    return (
      <components.Option {...props}>
        <div
          style={{
            padding: "6px 1px",
            fontFamily: "Inter, sans-serif",
            borderBottom: `1px solid ${
              isSelected ? "#2563eb" : "#f1f5f9"
            }`,
            transition: "all 0.15s ease",
          }}
        >
          {/* NAME */}
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: isSelected ? "#ffffff" : "#0f172a",
            }}
          >
            {data.data.name || "Unnamed"}
          </div>

          {/* CONTACT INFO */}
          {(data.data.email || data.data.mobilenumber) && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "12px",
                marginTop: "4px",
                fontSize: "12px",
                color: isSelected ? "#dbeafe" : "#64748b",
              }}
            >
              {data.data.email && (
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                  }}
                >
                  <Mail size={13} />
                  <span>{data.data.email}</span>
                </div>
              )}

              {data.data.mobilenumber && (
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                  }}
                >
                  <Phone size={13} />
                  <span>{data.data.mobilenumber}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </components.Option>
    );
  };

  /* ================= SELECTED VALUE ================= */
  const CustomSingleValue = (props: any) => {
    return (
      <components.SingleValue {...props}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            fontSize: "13px",
            fontWeight: 500,
            fontFamily: "Roboto, Inter, sans-serif",
          }}
        >
          {props.data.data.name ||
            props.data.data.email ||
            props.data.data.mobilenumber ||
            "Unnamed"}
        </div>
      </components.SingleValue>
    );
  };

  /* ================= CURSOR FIX ================= */
  useEffect(() => {
    if (selectRef.current) {
      setTimeout(() => {
        const input = selectRef.current.inputRef;
        if (input) {
          input.setSelectionRange(0, 0);
        }
      }, 0);
    }
  }, [value]);

  /* ================= RENDER ================= */
  return (
    <div className="w-full">
      <div className="flex gap-1">
        {icon && <span className="text-blue-500">{icon}</span>}
        <label className="block input-label-custom">{label}</label>
      </div>

      <Select
        ref={selectRef}
        styles={customStyles}
        placeholder="Search Account..."
        options={options}
        isLoading={loading}
        isDisabled={isDisabled}
        filterOption={() => true}
        components={{
          Option: CustomOption,
          SingleValue: CustomSingleValue,
        }}
        inputValue={inputValue}
        onInputChange={(value, { action }) => {
          if (action === "input-change") {
            setInputValue(value);
          }

          if (action === "menu-close") {
            setInputValue("");
          }

          if (action === "set-value") {
            return "";
          }
        }}
        value={
          value
            ? {
                value: value.id,
                label: value.name,
                data: value,
              }
            : null
        }
        onChange={(selected: any) => {
          if (selected) {
            handleAccountSelection(selected.data);
            setInputValue("");
          } else {
            handleAccountSelection(null);
          }
        }}
        noOptionsMessage={() =>
          inputValue ? "Accounts not found" : "Start typing to search"
        }
      />
    </div>
  );
};

/* ================= SAME GLOBAL STYLE ================= */

const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "34px",
    height: "34px",
    borderRadius: "6px",
    borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
    fontSize: "14px",
    marginTop: "0px",
  }),

  valueContainer: (base: any) => ({
    ...base,
    padding: "0 8px",
    height: "32px",
  }),

  input: (base: any) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),

  indicatorsContainer: (base: any) => ({
    ...base,
    height: "32px",
  }),

  placeholder: (base: any) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "13px",
  }),

  singleValue: (base: any) => ({
    ...base,
    fontSize: "13px",
    fontWeight: 500,
  }),

  menu: (base: any) => ({
    ...base,
    zIndex: 9999,
    borderRadius: "6px",
    overflow: "hidden",
  }),

  option: (base: any, state: any) => ({
    ...base,
    fontSize: "13px",
    padding: "8px 10px",
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
      ? "#f3f4f6"
      : "#fff",
    color: state.isSelected ? "#fff" : "#111827",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base: any) => ({
    ...base,
    padding: "4px",
  }),
};


// /* eslint-disable @typescript-eslint/no-explicit-any */

// import Select from "react-select";
// import { useEffect, useState } from "react";
// import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
// import { getLookupAccounts } from "../../../../config/apis/AccountApis";
// import { handleApiError } from "../../../../config/error/handleApiError";

// export const LookupAccountDropdown = ({
//   icon,
//   label,
//   value,
//   handleAccountSelection,
//   isDisabled = false,
// }: {
//   icon?: React.ReactNode;
//   label?: string;
//   value?: any;
//   handleAccountSelection: (data: any) => void;
//   isDisabled?: boolean;
// }) => {
//   const { loginStatus } = useLoggedInUserContext();
//   const [options, setOptions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState("");

//   // 🔥 Debounce Effect
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       fetchAccounts(inputValue);
//     }, 400); // ⏱ 400ms debounce

//     return () => clearTimeout(delayDebounce);
//   }, [inputValue]);

//   // 🔥 API Call
//   const fetchAccounts = async (searchText: string) => {
//     setLoading(true);

//     const postData = {
//       company_id: loginStatus.companyId,
//       id: null,
//       isactive: true,
//       limit: 20,
//       offset: 0,
//       search_parameter: searchText,
//       requestedby_id: loginStatus.id,
//     };

//     try {
//       const res = await getLookupAccounts(postData);
//       console.log(res.data);

//       const formatted = res.data.map((item: any) => ({
//         value: item.id,
//         label: `${item.name} (${item.email} / ${item.mobilenumber})`,
//         data: item,
//       }));

//       setOptions(formatted);
//     } catch (error) {
//       handleApiError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full">
//       <div className="flex gap-1">
//         {icon && <span className="text-blue-500 mt-0.5">{icon}</span>}
//         <label className="block input-label-custom">{label}</label>
//       </div>
//       <Select
//         styles={customStyles}
//         placeholder="Search Account..."
//         options={options}
//         isLoading={loading}
//         // isClearable
//         onInputChange={(value) => setInputValue(value)}
//         value={
//           value
//             ? {
//                 value: value.id,
//                 label: `${value.name} (${value.email} / ${value.mobilenumber})`,
//                 data: value,
//               }
//             : null
//         } // ✅ CONTROLLED VALUE
//         onChange={(selected: any) => {
//           if (selected) {
//             handleAccountSelection(selected.data);
//           } else {
//             handleAccountSelection(null); // ✅ handle clear
//           }
//         }}
//         noOptionsMessage={() =>
//           inputValue ? "Accounts not found" : "Start typing to search"
//         }
//         isDisabled={isDisabled}
//       />
//     </div>
//   );
// };

// const customStyles = {
//   control: (base: any, state: any) => ({
//     ...base,
//     minHeight: "34px",
//     height: "34px",
//     borderRadius: "6px",
//     borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
//     boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
//     "&:hover": {
//       borderColor: "#3b82f6",
//     },
//     fontSize: "14px",
//     marginTop: "0px",
//   }),

//   valueContainer: (base: any) => ({
//     ...base,
//     padding: "0 8px",
//     height: "32px",
//   }),

//   input: (base: any) => ({
//     ...base,
//     margin: 0,
//     padding: 0,
//   }),

//   indicatorsContainer: (base: any) => ({
//     ...base,
//     height: "32px",
//   }),

//   placeholder: (base: any) => ({
//     ...base,
//     color: "#9ca3af",
//     fontSize: "13px",
//   }),

//   singleValue: (base: any) => ({
//     ...base,
//     fontSize: "13px",
//     fontWeight: 500,
//   }),

//   menu: (base: any) => ({
//     ...base,
//     zIndex: 9999,
//     borderRadius: "6px",
//     overflow: "hidden",
//   }),

//   option: (base: any, state: any) => ({
//     ...base,
//     fontSize: "13px",
//     padding: "8px 10px",
//     backgroundColor: state.isSelected
//       ? "#2563eb"
//       : state.isFocused
//         ? "#f3f4f6"
//         : "#fff",
//     color: state.isSelected ? "#fff" : "#111827",
//   }),

//   indicatorSeparator: () => ({
//     display: "none",
//   }),

//   dropdownIndicator: (base: any) => ({
//     ...base,
//     padding: "4px",
//   }),
// };
