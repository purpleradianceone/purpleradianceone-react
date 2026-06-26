/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { getReportType } from "../../../../config/apis/ReportsApis";
import { handleApiError } from "../../../../config/error/handleApiError";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";

export const ReportTypeDropdown = ({
  icon,
  label,
  value,
  handleReportTypeSelection,
  isDisabled = false,
  heightInPx = "34px",
  isClearButton = false,
}: {
  icon?: React.ReactNode;
  label?: string;
  value?: any;
  handleReportTypeSelection: (data: any) => void;
  isDisabled?: boolean;
  heightInPx?: string;
  isClearButton?: boolean;
}) => {
  const { loginStatus } = useLoggedInUserContext();

  const [allOptions, setAllOptions] = useState<any[]>([]); //master data
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const selectRef = useRef<any>(null);

  const CLEAR_OPTION = {
    value: "__clear__",
    label: "Clear Selection",
    data: null,
  };



  const fetchReportType = async () => {
    if (loginStatus.companyId === 0) return;
    setLoading(true);

    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      name: null,
      isactive: true,
      requestedby_id: loginStatus.id,
    };

    try {
      const res = await getReportType(postData);

      const formatted = res.data
        .map((item: any) => ({
          value: item.id,
          label: item.name || "Unnamed",
          data: item,
        }))
        .sort((a: any, b: any) => a.label.localeCompare(b.label));

      const updatedOptions = isClearButton
        ? [CLEAR_OPTION, ...formatted]
        : formatted;

      setAllOptions(updatedOptions);
      setFilteredOptions(updatedOptions);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

    /* ================= FETCH ONLY ONCE ================= */
  useEffect(() => {
    if (isDisabled || loginStatus.companyId === 0) return;
        fetchReportType();
  }, []);

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
      handleReportTypeSelection(exactMatch.data);
      return;
    }

    if (filtered.length > 0) {
      handleReportTypeSelection(filtered[0].data);
    }
  }, [inputValue, allOptions]);
  /* ================= SAME STYLE ================= */

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "30px",
      height: heightInPx,
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
        filterOption={() => true} // no internal filtering
        inputValue={inputValue}
        isClearable={isClearButton}
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
            handleReportTypeSelection(selected.data);
            setInputValue("");
          } else {
            handleReportTypeSelection(null);
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
