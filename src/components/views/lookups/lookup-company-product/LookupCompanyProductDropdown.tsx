/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef } from "react";
import Select, { components } from "react-select";
import { getLookupCompanyProduct } from "../../../../config/apis/Lookups";
import { handleApiError } from "../../../../config/error/handleApiError";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { Barcode } from "lucide-react";

export const LookupCompanyProductDropdown = ({
  icon,
  label,
  value,
  productTypeId,
  handleCompanyProductSelection,
  isDisabled = false,
}: {
  icon?: React.ReactNode;
  label?: string;
  value?: any;
  productTypeId?: number[];
  handleCompanyProductSelection: (data: any) => void;
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
      fetchLookupCompanyProductByProductType(inputValue);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, productTypeId, isDisabled]);

  const fetchLookupCompanyProductByProductType = async (searchText: string) => {
    if(loginStatus.companyId === 0)return;
    setLoading(true);

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      isactive: true,
      product_type_id: productTypeId,
      limit: 20,
      offset: 0,
      search_parameter: searchText,
      requestedby: loginStatus.id,
    };

    try {
      const res = await getLookupCompanyProduct(postData);

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
            borderBottom: `1px solid ${isSelected ? "#2563eb" : "#f1f5f9"}`,
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

          {/* BARCODE */}
          {data.data.barcode && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "6px",
                marginTop: "4px",
                fontSize: "12px",
                color: isSelected ? "#dbeafe" : "#64748b",
              }}
            >
              <Barcode size={13} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span
                style={{
                  wordBreak: "break-word",
                }}
              >
                {data.data.barcode}
              </span>
            </div>
          )}
        </div>
      </components.Option>
    );
  };

  /* ================= SELECTED VALUE ================= */
  const CustomSingleValue = (props: any) => {
    const data = props.data.data;

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
          {data.name || data.barcode || "Unnamed"}
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
        placeholder="Search Product..."
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
            handleCompanyProductSelection(selected.data);
            setInputValue("");
          } else {
            handleCompanyProductSelection(null);
          }
        }}
        noOptionsMessage={() =>
          inputValue ? "Product not found" : "Start typing to search"
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

// import { useEffect, useState } from "react";
// import Select from "react-select";
// import { getLookupCompanyProduct } from "../../../../config/apis/Lookups";
// import { handleApiError } from "../../../../config/error/handleApiError";
// import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";

// export const LookupCompanyProductDropdown = ({
//   icon,
//   label,
//   value,
//   productTypeId,
//   handleCompanyProductSelection,
//   isDisabled = false

// }: {
//   icon?: React.ReactNode;
//   label?: string;
//   value?: any;
//   productTypeId?: number[];
//   handleCompanyProductSelection: (data: any) => void;
//   isDisabled?: boolean

// }) => {
//   const { loginStatus } = useLoggedInUserContext();
//   const [options, setOptions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState("");

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       fetchLookupCompanyProductByProductType(inputValue);
//     }, 400); // ⏱ 400ms debounce

//     return () => clearTimeout(delayDebounce);
//   }, [inputValue]);

//   const fetchLookupCompanyProductByProductType = async (searchText: string) => {
//     setLoading(true);

//     const postData = {
//       company_id: loginStatus.companyId,
//       id: null,
//       isactive: true,
//       product_type_id: productTypeId,
//       limit: 20,
//       offset: 0,
//       search_parameter: searchText,
//       requestedby: loginStatus.id,
//     };

//     try {
//       const res = await getLookupCompanyProduct(postData);

//       const formatted = res.data.map((item: any) => ({
//         value: item.id,
//         label: `${item.name}`,
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
//         {icon && <span className="text-blue-500">{icon}</span>}
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
//                 label: `${value.name}`,
//                 data: value,
//               }
//             : null
//         } // ✅ CONTROLLED VALUE
//         onChange={(selected: any) => {
//           if (selected) {
//             handleCompanyProductSelection(selected.data);
//           } else {
//             handleCompanyProductSelection(null); // ✅ handle clear
//           }
//         }}
//         noOptionsMessage={() =>
//           inputValue ? "Product not found" : "Start typing to search"
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
