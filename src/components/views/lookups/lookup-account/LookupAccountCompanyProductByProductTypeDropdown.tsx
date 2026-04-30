/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef } from "react";
import Select, { components } from "react-select";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { handleApiError } from "../../../../config/error/handleApiError";
import { getLookupAccountCompanyProductByProductType } from "../../../../config/apis/Lookups";
import { Barcode, Hash } from "lucide-react";

export const LookupAccountCompanyProductByProductTypeDropdown = ({
  icon,
  label,
  value,
  accountId,
  productTypeId,
  handleAccountCompanyProductSelection,
  isDisabled = false,
}: {
  icon?: React.ReactNode;
  label?: string;
  value?: any;
  accountId?: number;
  productTypeId: number[];
  handleAccountCompanyProductSelection: (data: any) => void;
  isDisabled?: boolean;
}) => {
  const { loginStatus } = useLoggedInUserContext();

  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const selectRef = useRef<any>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (isDisabled || !accountId) return;

    const delayDebounce = setTimeout(() => {
      fetchAccountCompanyProductByProductType(inputValue);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, accountId, productTypeId, isDisabled]);

  const fetchAccountCompanyProductByProductType = async (
    searchText: string,
  ) => {
    if (!accountId) return;

    setLoading(true);

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      isactive: true,
      account_id: accountId,
      product_type_id: productTypeId,
      limit: 20,
      offset: 0,
      search_parameter: searchText,
      requestedby_id: loginStatus.id,
    };

    try {
      const res = await getLookupAccountCompanyProductByProductType(postData);

      const formatted = res.data.map((item: any) => ({
        value: item.id,
        label:
          item.company_product_name ?? item.companyProductName ?? "Unnamed",
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

    const name =
      data.data.company_product_name ??
      data.data.companyProductName ??
      "Unnamed";

    return (
      <components.Option {...props}>
        <div
          style={{
            padding: "6px 1px",
            fontFamily: "Inter, sans-serif",
            borderBottom: `1px solid ${isSelected ? "#2563eb" : "#f1f5f9"}`,
          }}
        >
          {/* PRODUCT NAME */}
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: isSelected ? "#ffffff" : "#0f172a",
            }}
          >
            {name}
          </div>

          {/* EXTRA DETAILS */}
          {(data.data.serial_number || data.data.barcode) && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                gap: "12px",
                marginTop: "4px",
                fontSize: "12px",
                color: isSelected ? "#dbeafe" : "#64748b",
              }}
            >
              {/* SERIAL NUMBER */}
              {data.data.serial_number && (
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                  }}
                >
                  <Hash size={13} style={{ flexShrink: 0 }} />
                  <span>{data.data.serial_number}</span>
                </div>
              )}

              {/* BARCODE */}
              {data.data.barcode && (
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                  }}
                >
                  <Barcode size={13} style={{ flexShrink: 0 }} />
                  <span>{data.data.barcode}</span>
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
          {data.company_product_name ??
            data.companyProductName ??
            data.serial_number ??
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
        placeholder="Search Product..."
        options={options}
        isLoading={loading}
        isDisabled={isDisabled || !accountId}
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
                label:
                  value.company_product_name ??
                  value.companyProductName ??
                  "Unnamed",
                data: value,
              }
            : null
        }
        onChange={(selected: any) => {
          if (selected) {
            handleAccountCompanyProductSelection(selected.data);
            setInputValue("");
          } else {
            handleAccountCompanyProductSelection(null);
          }
        }}
        noOptionsMessage={() =>
          !accountId
            ? "Select account first"
            : inputValue
              ? "Products not found"
              : "Start typing to search"
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
// import { handleApiError } from "../../../../config/error/handleApiError";
// import { getLookupAccountCompanyProductByProductType } from "../../../../config/apis/Lookups";

// export const LookupAccountCompanyProductByProductTypeDropdown = ({
//   icon,
//   label,
//   value,
//   accountId,
//   productTypeId,
//   handleAccountCompanyProductSelection,
//   isDisabled = false

// }: {
//   icon?: React.ReactNode;
//   label?: string;
//   value?: any;
//   accountId?: number,
//   productTypeId: number[];
//   handleAccountCompanyProductSelection: (data: any) => void;
//   isDisabled?: boolean

// }) => {
//   const { loginStatus } = useLoggedInUserContext();
//   const [options, setOptions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState("");

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       fetchAccountCompanyProductByProductType(inputValue);
//     }, 400); // ⏱ 400ms debounce

//     return () => clearTimeout(delayDebounce);
//   }, [inputValue, accountId, productTypeId]);

//   const fetchAccountCompanyProductByProductType = async (searchText: string) => {
//     if(!accountId)return;
//     setLoading(true);

//     const postData = {
//       company_id: loginStatus.companyId,
//       id: null,
//       isactive: true,
//       account_id: accountId,
//       product_type_id: productTypeId,
//       limit: 20,
//       offset: 0,
//       search_parameter: searchText,
//       requestedby_id: loginStatus.id,
//     };

//     try {
//       const res = await getLookupAccountCompanyProductByProductType(postData);

//       const formatted = res.data.map((item: any) => ({
//         value: item.id,
//         label: `${item.company_product_name??item.companyProductName}`,
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
//                 label: `${value.company_product_name??value.companyProductName}`,
//                 data: value,
//               }
//             : null
//         }
//         onChange={(selected: any) => {
//           if (selected) {
//             handleAccountCompanyProductSelection(selected.data);
//           } else {
//             handleAccountCompanyProductSelection(null); // ✅ handle clear
//           }
//         }}
//         noOptionsMessage={() =>
//           inputValue ? "Account products not found" : "Start typing to search"
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
