/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Delete } from "lucide-react";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import { NUMBER_VALUES } from "../../../constants/AppConstants";

interface DropdownProps {
  options: any[];
  onSelect: (selectedValue: number | undefined) => void;
  labelName: string;
  selectedValue?: number;
  readOnly?: boolean;
  preselectedOption?: number;
  requiredRedDot?: boolean;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  options = [],
  onSelect,
  labelName,
  selectedValue,
  readOnly,
  preselectedOption,
  requiredRedDot,
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

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (preselectedOption) {
      handleSelect(preselectedOption);
    }
  }, []);
  return (
    <div className="relative w-auto " ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700">
        {labelName === "status" ||
        labelName === "source" ||
        labelName === "type" ||
        labelName === "priority" ||
        labelName === "stage"
          ? ""
          : labelName}{" "}
       {
        requiredRedDot && (
           <span className="text-rose-500">*</span>
        )
       }
      </label>

      <div
        className={`w-full flex justify-between py-1 px-1 border-2 ${
          readOnly ? "bg-gray-300" : "bg-white"
        }  border-gray-300 bg-green-0 rounded-md cursor-pointer text-gray-700 focus:outline-none`}
        onClick={() => {
          if (!readOnly) {
            setShowDropdown((prev) => !prev);
          } else if (readOnly) {
            showMessageSnackbar({
              message: `Can't Update ${labelName}`,
              type: "error",
            });
          }
        }}
      >
        <div className="text-xs">
          {labelName === "status" ||
          labelName === "source" ||
          labelName === "type" ||
          labelName === "priority" ||
          labelName === "stage"
            ? selectedOption === undefined
              ? labelName === "status"
                ? "Status"
                : labelName === "source"
                ? "Source"
                : labelName === "type"
                ? "Type"
                : labelName === "priority"
                ? "Priority"
                : "Stage"
              : options.find((o) => o.id === selectedOption)?.name
            : selectedOption === undefined
            ? "Select Option"
            : options.find((o) => o.id === selectedOption)?.name}
        </div>
        {showDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {showDropdown && (
        <div className="absolute z-20 mt-1 mb-10 w-full max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-md">
          <div
            onClick={() => handleSelect(undefined)}
            className="px-4 py-0.5 flex gap-2 items-center hover:bg-red-600 hover:text-white cursor-pointer text-gray-800 border-b"
          >
            <Delete size={18} />{" "}
            <span className="text-xs"> Clear Selection</span>
          </div>
          {Array.isArray(options) &&
            options.map((option) => (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id!)}
                className="px-4 py-0.5 text-xs border-b hover:bg-blue-700 hover:text-white cursor-pointer text-gray-800"
              >
                {option.name}
              </div>
            ))}
        </div>
      )}
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </div>
  );
};

export default CustomDropdown;
