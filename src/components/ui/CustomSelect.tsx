import React, { useMemo } from "react";
import Select, { SingleValue } from "react-select";
import { LucideIcon } from "lucide-react";
import toast from "react-hot-toast";
// types/select.ts
export interface SelectOption {
  value: number;
  label: string;
}

interface AppSelectProps {
  label: string;
  options: SelectOption[];
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  icon?: LucideIcon;
  className?: string;
  isClearable? : boolean

  // New Props for scroll api data and onSearchApiCall
  onMenuOpen?: () => void;
  onMenuScrollToBottom?: () => void;
  onInputChange?: (value: string) => void;
  isLoading?: boolean;
}


/**
 * Note : 
 * 1. options -First map them as only label -name(string) and value - id(number) and then pass to this component
 * e.g : const warehouseOptions = toSelectOptions(warehouseTypeData, "id", "name");
 * 2. toSelectOptions function created : pass that function data and value and label , it will convert and return it , DO THIS IN THE PARENT FUNCTION
 * 2. onChange - It will provide value i.e number not type 
 */

const CustomSelect: React.FC<AppSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option",
  isDisabled = false,
  isRequired = false,
  icon: Icon,
  className,
  isClearable = true,
  isLoading,
  onInputChange ,
  onMenuOpen ,
  onMenuScrollToBottom 
}) => {
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) ?? null,
    [options, value]
  );

  const handleChange = (option: SingleValue<SelectOption>) => {
    if (isDisabled) {
      toast.error(`Can't update ${label}`);
      return;
    }
    onChange(option?.value);
  };

  return (
    <div className={`w-full ${className ?? ""}`}>
      <label className="block input-label-custom ">
        {Icon && <Icon size={14} className="inline mr-1 text-blue-500" />}
        {label}
        {isRequired && <span className="text-rose-500 ml-0.5">*</span>}
      </label>

      <Select<SelectOption, false>
        options={options}
        value={selectedOption}
        onChange={handleChange}
        isClearable={isClearable}
        isDisabled={isDisabled}
        placeholder={placeholder}
        classNamePrefix="app-select "
        menuPortalTarget={document.body}
        menuPosition="fixed"
        // new props for api and text search
        isLoading={isLoading}
        onInputChange={onInputChange}
        onMenuOpen={onMenuOpen}
        onMenuScrollToBottom={onMenuScrollToBottom}
        // above props are used for the search and scroll api call
        classNames={{
            placeholder : ()=> "input-label-custom placeholder-gray-400",
            input: ()=> "input-label-custom",
        }}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: 30,
            height: 30,
            borderColor: state.isFocused ? "#2563eb" : base.borderColor,
            boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
          }),
          valueContainer: (base) => ({
            ...base,
            height: 30,
            padding: "0 12px",
          }),
          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
          }),
          indicatorsContainer: (base) => ({
            ...base,
            height: 30,
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          menu: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
};

export default CustomSelect;
