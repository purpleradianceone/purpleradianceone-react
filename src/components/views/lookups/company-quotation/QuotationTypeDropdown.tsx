/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { handleApiError } from "../../../../config/error/handleApiError";
import { getQuotationType } from "../../../../config/apis/CompanyQuotationApis";

export const QuotationTypeDropdown = ({
  icon,
  label,
  value,
  handleQuotationTypeSelection,
  isDisabled = false,
}: {
  icon?: React.ReactNode;
  label?: string;
  value?: any;
  handleQuotationTypeSelection: (data: any) => void;
  isDisabled?: boolean;
}) => {
  const { loginStatus } = useLoggedInUserContext();

  const [allOptions, setAllOptions] = useState<any[]>([]); //master data
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const selectRef = useRef<any>(null);

  /* ================= FETCH ONLY ONCE ================= */
  useEffect(() => {
    if (isDisabled || loginStatus.companyId === 0) return;

    fetchQuotationType();
  }, []);

  const fetchQuotationType = async () => {
    setLoading(true);

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      name: "",
      isactive: true,
      requestedby_id: loginStatus.id,
    };

    try {
      const res = await getQuotationType(postData);

      const formatted = res.data
        .map((item: any) => ({
          value: item.id,
          label: item.name || "Unnamed",
          data: item,
        }))
        .sort((a: any, b: any) => a.label.localeCompare(b.label));

      setAllOptions(formatted);
      setFilteredOptions(formatted);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOCAL FILTER ================= */
  useEffect(() => {
    const search = inputValue.trim().toLowerCase();

    if (!search) {
      setFilteredOptions(allOptions);
      return;
    }

    const filtered = allOptions.filter((opt) =>
      opt.label.toLowerCase().includes(search),
    );

    setFilteredOptions(filtered);

    const exactMatch = allOptions.find(
      (opt) => opt.label.toLowerCase() === search,
    );

    if (exactMatch) {
      handleQuotationTypeSelection(exactMatch.data);
      return;
    }

    if (filtered.length > 0) {
      handleQuotationTypeSelection(filtered[0].data);
    }
  }, [inputValue, allOptions]);

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
        placeholder="Search Type..."
        options={filteredOptions}
        isLoading={loading}
        isDisabled={isDisabled}
        filterOption={() => true} // ✅ no internal filtering
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
            handleQuotationTypeSelection(selected.data);
            setInputValue("");
          } else {
            handleQuotationTypeSelection(null);
          }
        }}
        noOptionsMessage={() => {
          if (loading) return "Loading...";
          if (!inputValue) return "Start typing to search";
          return "No Type found";
        }}
      />
    </div>
  );
};

/* ================= SAME STYLE ================= */

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

// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { useEffect, useState, useRef } from "react";
// import Select from "react-select";
// import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
// import { handleApiError } from "../../../../config/error/handleApiError";
// import { getQuotationType } from "../../../../config/apis/CompanyQuotationApis";

// export const QuotationTypeDropdown = ({
//   icon,
//   label,
//   value,
//   handleQuotationTypeSelection,
//   isDisabled = false,
// }: {
//   icon?: React.ReactNode;
//   label?: string;
//   value?: any;
//   handleQuotationTypeSelection: (data: any) => void;
//   isDisabled?: boolean;
// }) => {
//   const { loginStatus } = useLoggedInUserContext();

//   const [options, setOptions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState("");

//   const selectRef = useRef<any>(null);

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     if (isDisabled || loginStatus.companyId === 0) return;

//       const search = inputValue.trim().toLowerCase();

//       // if (!search) return;

//       // ✅ Check exact match first
//       const exactMatch = options.find(
//         (opt) => opt.label?.toLowerCase() === search,
//       );

//       if (exactMatch) {
//         handleQuotationTypeSelection(exactMatch.data);
//         return;
//       }

//       const partialMatch = options.find((opt) =>
//         opt.label?.toLowerCase().includes(search),
//       );

//       if (partialMatch) {
//         handleQuotationTypeSelection(partialMatch.data);
//         return;
//       }

//       fetchQuotationType(inputValue);

//   }, [inputValue, isDisabled]);

//   const fetchQuotationType = async (searchText: string) => {
//     setLoading(true);

//     const postData = {
//       company_id: loginStatus.companyId,
//       id: null,
//       name: searchText,
//       isactive: true,
//       requestedby_id: loginStatus.id,
//     };

//     try {
//       const res = await getQuotationType(postData);

//       const formatted = res.data.map((item: any) => ({
//         value: item.id,
//         label: item.name || "Unnamed",
//         data: item,
//       }));

//       setOptions(formatted);

//       // ✅ Auto select ONLY when exactly 1 result
//       if (formatted.length === 1) {
//         handleQuotationTypeSelection(formatted[0].data);
//       }
//     } catch (error) {
//       handleApiError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= CURSOR FIX ================= */
//   useEffect(() => {
//     if (selectRef.current) {
//       setTimeout(() => {
//         const input = selectRef.current.inputRef;
//         if (input) {
//           input.setSelectionRange(0, 0);
//         }
//       }, 0);
//     }
//   }, [value]);

//   /* ================= RENDER ================= */
//   return (
//     <div className="w-full">
//       <div className="flex gap-1">
//         {icon && <span className="text-blue-500">{icon}</span>}
//         <label className="block input-label-custom">{label}</label>
//       </div>

//       <Select
//         ref={selectRef}
//         styles={customStyles}
//         placeholder="Search Type..."
//         options={options}
//         isLoading={loading}
//         isDisabled={isDisabled}
//         filterOption={() => true} // ✅ disable client filtering
//         inputValue={inputValue}
//         onInputChange={(value, { action }) => {
//           if (action === "input-change") {
//             setInputValue(value);
//           }

//           if (action === "menu-close") {
//             setInputValue("");
//           }

//           if (action === "set-value") {
//             return "";
//           }
//         }}
//         value={
//           value
//             ? {
//                 value: value.id,
//                 label: value.name,
//                 data: value,
//               }
//             : null
//         }
//         onChange={(selected: any) => {
//           if (selected) {
//             handleQuotationTypeSelection(selected.data);
//             setInputValue("");
//           } else {
//             handleQuotationTypeSelection(null);
//           }
//         }}
//         noOptionsMessage={() => {
//           if (loading) return "Searching...";
//           if (!inputValue) return "Start typing to search";
//           return "No Type found";
//         }}
//       />
//     </div>
//   );
// };

// /* ================= SAME STYLE ================= */

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
