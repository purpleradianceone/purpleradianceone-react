/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef } from "react";
import Select, { components } from "react-select";
import { getLookupQuotationTemplate } from "../../../../config/apis/CompanyQuotationApis";
import { handleApiError } from "../../../../config/error/handleApiError";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { Delete, FileText } from "lucide-react";

export const LookupQuotationTemplateDropdown = ({
  icon,
  label,
  value,
  handleQuotationTemplateSelection,
  isDisabled = false,
  heightInPx = "34px",
  isClearButton = false,
}: {
  icon?: React.ReactNode;
  label?: string;
  value?: any;
  handleQuotationTemplateSelection: (data: any) => void;
  isDisabled?: boolean;
  heightInPx?: string;
  isClearButton?: boolean;
}) => {
  const { loginStatus } = useLoggedInUserContext();

  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const selectRef = useRef<any>(null);

  const CLEAR_OPTION = {
    value: "__clear__",
    label: "Clear Selection",
    // data: {name:"❌ Clear Selection"},
    data: null,
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    if (isDisabled) return;

    const delayDebounce = setTimeout(() => {
      fetchQuotationTemplate(inputValue);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, isDisabled]);

  const fetchQuotationTemplate = async (searchText: string) => {
    if(loginStatus.companyId === 0)return;
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
      const res = await getLookupQuotationTemplate(postData);

      const formatted = res.data.map((item: any) => ({
        value: item.id,
        label: item.name || "Unnamed",
        data: item,
      }));

      // Add clear option at top
      const updatedOptions = isClearButton
        ? [CLEAR_OPTION, ...formatted]
        : formatted;

      if (searchText) {
        setOptions(formatted);
      } else {
        setOptions(updatedOptions);
      }      
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
             {data.label == "Clear Selection" ? (
              <div className="flex gap-1 justify-start items-center">
                <Delete size={18} />
                Clear Selection
              </div>
            ) : data.data ? (
              data.data.name
            ) : (
              "Unnamed"
            )}
          </div>

          {/* DESCRIPTION WITH ICON */}
          {data.datra && data.data.description && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start", // important for multiline
                gap: "6px",
                marginTop: "4px",
                fontSize: "12px",
                color: isSelected ? "#dbeafe" : "#64748b",
              }}
            >
              {/* ICON (fixed) */}
              <FileText
                size={13}
                style={{
                  flexShrink: 0, // 🔥 prevents icon from shrinking
                  marginTop: "2px", // aligns with first line nicely
                }}
              />

              {/* TEXT (flexible) */}
              <span
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {data.data.description}
              </span>
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
          {props.data.data.name || "Unnamed"}
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

  /* ================= SAME GLOBAL STYLE (MATCHED) ================= */

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
        placeholder="Search Template..."
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
            handleQuotationTemplateSelection(selected.data);
            setInputValue("");
          } else {
            handleQuotationTemplateSelection(null);
          }
        }}
        noOptionsMessage={() =>
          inputValue ? "No template found" : "Start typing to search"
        }
      />
    </div>
  );
};


