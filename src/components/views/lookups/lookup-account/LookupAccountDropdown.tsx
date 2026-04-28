/* eslint-disable @typescript-eslint/no-explicit-any */

import Select from "react-select";
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { getLookupAccounts } from "../../../../config/apis/AccountApis";
import { handleApiError } from "../../../../config/error/handleApiError";

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

  // 🔥 Debounce Effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAccounts(inputValue);
    }, 400); // ⏱ 400ms debounce

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  // 🔥 API Call
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
      console.log(res.data);

      const formatted = res.data.map((item: any) => ({
        value: item.id,
        label: `${item.name} (${item.email} / ${item.mobilenumber})`,
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
        {icon && <span className="text-blue-500 mt-0.5">{icon}</span>}
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
                label: `${value.name} (${value.email} / ${value.mobilenumber})`,
                data: value,
              }
            : null
        } // ✅ CONTROLLED VALUE
        onChange={(selected: any) => {
          if (selected) {
            handleAccountSelection(selected.data);
          } else {
            handleAccountSelection(null); // ✅ handle clear
          }
        }}
        noOptionsMessage={() =>
          inputValue ? "Accounts not found" : "Start typing to search"
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
