/* eslint-disable @typescript-eslint/no-explicit-any */

import Select from "react-select";
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { handleApiError } from "../../../../config/error/handleApiError";
import { getLookupAccountCompanyProductByProductType } from "../../../../config/apis/Lookups";

export const LookupAccountCompanyProductByProductTypeDropdown = ({
  icon,
  label,
  value,
  accountId,
  productTypeId,
  handleAccountCompanyProductSelection,
  isDisabled = false

}: {
  icon?: React.ReactNode;
  label?: string;
  value?: any;
  accountId?: number,
  productTypeId: number[];
  handleAccountCompanyProductSelection: (data: any) => void;
  isDisabled?: boolean

}) => {
  const { loginStatus } = useLoggedInUserContext();
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAccountCompanyProductByProductType(inputValue);
    }, 400); // ⏱ 400ms debounce

    return () => clearTimeout(delayDebounce);
  }, [inputValue, accountId, productTypeId]);

  const fetchAccountCompanyProductByProductType = async (searchText: string) => {
    if(!accountId)return;
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
        label: `${item.company_product_name??item.companyProductName}`,
        data: item,
      }));

      setOptions(formatted);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-1">
        {icon && <span className="text-blue-500">{icon}</span>}
        <label className="block input-label-custom">{label}</label>
      </div>
      <Select
        styles={customStyles}
        placeholder="Search Account..."
        options={options}
        isLoading={loading}
        // isClearable
        onInputChange={(value) => setInputValue(value)}
        value={
          value
            ? {
                value: value.id,
                label: `${value.company_product_name??value.companyProductName}`,
                data: value,
              }
            : null
        } 
        onChange={(selected: any) => {
          if (selected) {
            handleAccountCompanyProductSelection(selected.data);
          } else {
            handleAccountCompanyProductSelection(null); // ✅ handle clear
          }
        }}
        noOptionsMessage={() =>
          inputValue ? "Account products not found" : "Start typing to search"
        }
        isDisabled={isDisabled}
      />
    </div>
  );
};

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
