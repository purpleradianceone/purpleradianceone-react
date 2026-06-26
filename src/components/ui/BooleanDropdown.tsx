/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Delete, LucideIcon } from "lucide-react";
import toast from "react-hot-toast";

interface BooleanDropdownProps {
  value?: boolean | null;
  onChange: (value: boolean | null | undefined) => void;
  labelName?: string;
  readOnly?: boolean;
  requiredRedDot?: boolean;
  logo?: LucideIcon;
  paddingy?: number;
}

const OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const BooleanDropdown: React.FC<BooleanDropdownProps> = ({
  value,
  onChange,
  labelName = "Status",
  readOnly,
  requiredRedDot,
  logo: Icon,
  paddingy = 1,
}) => {
  const [selectedValue, setSelectedValue] = useState<
    boolean | null | undefined
  >(value);

  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // sync parent value
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
    OPTIONS.find((o) => o.value === selectedValue)?.label ?? labelName;

  return (
    <div className="relative w-auto" ref={dropdownRef}>
      {/* SELECT BOX */}

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

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowDropdown((prev) => !prev);
          }
        }}
      >
        <div className="flex items-center gap-1">
          {Icon && <Icon size={14} className="text-blue-500" />}

          <div className="input-label-custom text-nowrap">
            {selectedLabel}

            {selectedValue === undefined && requiredRedDot && (
              <span className="text-rose-500 ml-1">*</span>
            )}
          </div>
        </div>

        {showDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {/* DROPDOWN */}

      {showDropdown && (
        <div className="absolute z-20 mt-1 mb-10 w-full max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-md">
          {/* CLEAR */}

          <div
            tabIndex={0}
            onClick={() => handleSelect(undefined)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSelect(undefined);
            }}
            className="px-4 py-0.5 flex gap-2 items-center caption-custom hover:bg-gray-200 cursor-pointer text-gray-800 border-b"
          >
            <Delete size={18} /> <span className="caption-custom"> Clear</span>
          </div>

          {/* OPTIONS */}

          {OPTIONS.map((option) => (
            <div
              key={String(option.value)}
              tabIndex={0}
              onClick={() => handleSelect(option.value)}
              className="px-4 py-0.5 caption-custom border-b hover:bg-blue-600 hover:text-white cursor-pointer focus:bg-blue-600 focus:text-white"
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
