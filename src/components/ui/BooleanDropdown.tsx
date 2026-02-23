/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Delete, LucideIcon } from "lucide-react";
import toast from "react-hot-toast";

interface BooleanDropdownProps {
  labelName?: string;
  value?: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
  readOnly?: boolean;
  requiredRedDot?: boolean;
  logo?: LucideIcon;
}

const OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const BooleanDropdown: React.FC<BooleanDropdownProps> = ({
  labelName = "Status",
  value,
  onChange,
  readOnly,
  requiredRedDot,
  logo: Icon,
}) => {
  const [selectedValue, setSelectedValue] = useState<boolean | undefined>(
    value,
  );

  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // sync outside value
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // outside click close
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

  const handleSelect = (val: boolean | undefined) => {
    setSelectedValue(val);

    onChange(val);

    setShowDropdown(false);
  };

  const selectedLabel =
    OPTIONS.find((o) => o.value === selectedValue)?.label ?? "Select";

  return (
    <div className="relative w-auto" ref={dropdownRef}>
      {/* LABEL */}

      {labelName && (
        <label className="block input-label-custom">
          {Icon && <Icon size={14} className="inline mr-1 text-blue-500" />}

          {labelName}

          {requiredRedDot && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* SELECT BOX */}

      <div
        role="button"
        tabIndex={0}
        className={`flex justify-between items-center border-2 rounded-md px-2 py-1 cursor-pointer
        ${readOnly ? "bg-gray-100" : "bg-white"}`}
        onClick={() => {
          if (readOnly) {
            toast.error(`Can't Update ${labelName}`);
            return;
          }

          setShowDropdown((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowDropdown((prev) => !prev);
          }
        }}
      >
        <span className="input-label-custom">{selectedLabel}</span>

        {showDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {/* DROPDOWN */}

      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full border rounded-md bg-white shadow-md">
          {/* CLEAR */}

          <div
            className="px-4 py-1 flex items-center gap-2 border-b hover:bg-gray-200 cursor-pointer"
            onClick={() => handleSelect(undefined)}
          >
            <Delete size={16} />
            Clear
          </div>

          {/* OPTIONS */}

          {OPTIONS.map((option) => (
            <div
              key={String(option.value)}
              tabIndex={0}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSelect(option.value);
              }}
              className="px-4 py-1 hover:bg-blue-600 hover:text-white cursor-pointer"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooleanDropdown;
