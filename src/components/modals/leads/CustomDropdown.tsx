import React, { useState, useEffect, useRef } from 'react';
import PostDataTypeForLeadSourceAndStatusAndStates from '../../../@types/lead-management/PostDataTypeForLeadSourceAndStatusAndStates';


interface DropdownProps {
  options: PostDataTypeForLeadSourceAndStatusAndStates[];
  onSelect: (selectedValue: number | undefined) => void;
  labelName: string;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  labelName,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | undefined>(undefined);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (options.length > 0) {
      setSelectedOption(undefined); // Initially unselected
    }
  }, [options]);

  // 📌 Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: number | undefined) => {
    setSelectedOption(value);
    onSelect(value);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block mb-1 text-sm font-medium text-gray-700">{labelName}</label>

      <div
        className="w-full py-2 px-3 border-2 border-gray-300 bg-green-50 rounded-md cursor-pointer text-gray-700 focus:outline-none"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {selectedOption === undefined
          ? '-- Select Option --'
          : options.find((o) => o.id === selectedOption)?.name}
      </div>

      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-md">
          <div
            onClick={() => handleSelect(undefined)}
            className="px-4 py-0.5 hover:bg-red-600 hover:text-white cursor-pointer text-gray-800 border-b"
          >
            Clear Selection
          </div>
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSelect(option.id!)}
              className="px-4 py-0.5 hover:bg-blue-700 hover:text-white cursor-pointer text-gray-800"
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
