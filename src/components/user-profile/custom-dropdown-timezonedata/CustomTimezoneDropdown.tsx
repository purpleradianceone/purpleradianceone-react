

import React, { useState, useRef, useEffect } from "react";
import Timezone from "../../../@types/user-profile/Timezone";

type Props = {
  timezoneData: Timezone[];
  hasMore: boolean;
  loadMore: () => void;
  onSearchChange: (text: string) => void;
  onSelect: (zone: Timezone) => void;
  setShowTimeZoneData : React.Dispatch<React.SetStateAction<boolean>>,
};

const CustomTimezoneDropdown: React.FC<Props> = ({
  timezoneData,
  hasMore,
  loadMore,
  onSearchChange,
  onSelect,
  setShowTimeZoneData,
}) => {
  const [searchText, setSearchText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasOpened = useRef(false); // Track if the dropdown has been opened before

  const handleScroll = () => {
    const div = dropdownRef.current;
    if (div) {
      const { scrollTop, scrollHeight, clientHeight } = div;
      if (timezoneData.length > 0 && scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
        loadMore();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    onSearchChange(text); // Call onSearchChange only when the text changes
  };

  const handleFocus = () => {
    setDropdownOpen(true);
    if (!hasOpened.current) {
      onSearchChange(""); // Initial load when first opened
      hasOpened.current = true;
    }
  };

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.scrollTop = 0;
    }
  }, [searchText, dropdownOpen]);



  // Close the dropdown if click is outside the card
  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setShowTimeZoneData(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={cardRef} className="relative w-full max-w-md ">
      <input
        type="text"
        value={searchText}
        onFocus={handleFocus}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded"
        placeholder="Search timezones..."
      />
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          onScroll={handleScroll}
          className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded shadow-md"
        >
          {timezoneData.map((zone) => (
            <div
              key={zone.id}
              onClick={() => {
                setSearchText(zone.timezone);
                setDropdownOpen(false);
                onSelect(zone);
              }}
              className="px-3 py-2 caption-custom hover:bg-gray-100 cursor-pointer"
            >
              {zone.timezone}
            </div>
          ))}
          {hasMore && timezoneData.length > 0 && (
            <div className="text-center caption-custom py-2">
              Loading more...
            </div>
          )}
          {timezoneData.length === 0 && searchText !== "" && (
            <div className="text-center caption-custom py-2">
              No timezones found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomTimezoneDropdown;