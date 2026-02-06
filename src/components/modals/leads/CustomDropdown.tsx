/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Delete, LucideIcon } from "lucide-react";
import toast from "react-hot-toast";

interface DropdownProps {
  options: any[];
  onSelect: (selectedValue: number | undefined) => void;
  labelName: string;
  selectedValue?: number;
  readOnly?: boolean;
  preselectedOption?: number;
  requiredRedDot?: boolean;
  logo?: LucideIcon;
  paddingy? : number
}

const CustomDropdown: React.FC<DropdownProps> = ({
  options = [],
  onSelect,
  labelName,
  selectedValue,
  readOnly,
  preselectedOption,
  requiredRedDot,
  logo: Icon,
  paddingy=1
}) => {
  const [selectedOption, setSelectedOption] = useState<number | undefined>(
    () => {
      if (selectedValue) return selectedValue;
      else return undefined;
    }
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: number | undefined) => {
    setSelectedOption(value);
    onSelect(value);
    setShowDropdown(false);
  };

  // its working but if problem occurs use above code and comment below code
  useEffect(() => {
    //  If preselectedOption is given, select it
    if (
      preselectedOption !== undefined &&
      preselectedOption !== null &&
      preselectedOption !== 0
    ) {
      handleSelect(preselectedOption);
    }
    //  Else, fall back to selectedValue
    else if (
      selectedValue !== undefined &&
      selectedValue !== null &&
      selectedValue !== 0
    ) {
      handleSelect(selectedValue);
    }
  }, [preselectedOption, selectedValue]);

  return (
    <div className="relative w-auto" ref={dropdownRef}>
      <label className="block input-label-custom">
        {Icon && <Icon size={14} className="inline mr-1 text-blue-500" />}
        {labelName === "status" ||
        labelName === "source" ||
        labelName === "type" ||
        labelName === "category" ||
        labelName === "lifecycle" ||
        labelName === "priority" ||
        labelName === "stage"
          ? ""
          : labelName}{" "}
        {requiredRedDot && <span className="text-rose-500">*</span>}
      </label>

      <div
        role="button"
        tabIndex={0}
        className={`w-full flex justify-between py-${paddingy} px-1 border-2 rounded-md cursor-pointer text-gray-700 
          ${readOnly ? "bg-gray-100" : "bg-white"}`}
        onClick={() => {
          if (!readOnly) {
            setShowDropdown((prev) => !prev);
          } else {
            toast.error(`Can't Update ${labelName}`);
          }
        }}
        onKeyDown={(e) => {
          if (readOnly) return;
          if (
            e.key === "Enter" ||
            e.key === " " ||
            (e.key === "Tab" && requiredRedDot)
          ) {
            e.preventDefault();
            setShowDropdown((prev) => !prev);
          }
        }}
      >
        {/* <div className="caption-custom">
          {labelName === "status" ||
          labelName === "source" ||
          labelName === "type" ||
          labelName === "priority" ||
          labelName === "stage"
            ? selectedOption === undefined
              ? labelName.charAt(0).toUpperCase() + labelName.slice(1)
              : options.find((o) => o.id === selectedOption)?.name ?? ""
            : selectedOption === undefined
            ? "Select Option"
            : options.find((o) => o.id === selectedOption)?.name ?? ""}
        </div> */}
        <div className="input-label-custom text-nowrap">
          {labelName === "status" ||
          labelName === "source" ||
          labelName === "type" ||
          labelName === "category" ||
          labelName === "lifecycle" ||
          labelName === "priority" ||
          labelName === "stage"
            ? selectedOption === undefined
              ? labelName.charAt(0).toUpperCase() + labelName.slice(1)
              : options && Array.isArray(options)
              ? options.find((o) => o.id === selectedOption)?.name
              : ""
            : selectedOption === undefined
            ? "Select Option"
            : options && Array.isArray(options)
            ? options.find((o) => o.id === selectedOption)?.name
            : ""}
        </div>

        {showDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {showDropdown && (
        <div className="absolute z-20 mt-1 mb-10 w-full max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-md">
          <div
            tabIndex={0}
            onClick={() => handleSelect(undefined)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSelect(undefined);
            }}
            className="px-4 py-0.5 flex gap-2 items-center caption-custom hover:bg-gray-200 cursor-pointer text-gray-800 border-b"
          >
            <Delete size={18} />{" "}
            <span className="caption-custom"> Clear Selection</span>
          </div>

          {Array.isArray(options) &&
            options.map((option) => (
              <div
                key={option.id}
                tabIndex={0}
                onClick={() => handleSelect(option.id!)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSelect(option.id!);
                }}
                className="px-4 py-0.5 caption-custom border-b hover:bg-blue-600 hover:text-white cursor-pointer focus:bg-blue-600 focus:text-white"
              >
                {option.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
