/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X } from "lucide-react";
import { createPortal } from "react-dom";
import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";
import { debounce } from "lodash";
import COLORS from "../../constants/Colors";
import CompanyUser from "../../@types/company-users/CompanyUser";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import toast from "react-hot-toast";
import { STATUS_CODE } from "../../constants/AppConstants";
import { useUserPreference } from "../../context/user/UserPreference";

interface CompanyUserSearchFieldProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  onUserSelected: (user: CompanyUser | null) => void;
  error?: string;
  logo?: any;
  readOnly?: boolean;
  defaultValue?: string;
  isDisabled?: boolean;
  disabledMessage?: string | null;
}

export default function CompanyUserSearchFieldInput({
  label,
  placeholder = "Search company users...",
  required,
  error,
  logo: Icon,
  readOnly = false,
  defaultValue = "",
  onUserSelected,
  isDisabled = false,
  disabledMessage = null,
}: CompanyUserSearchFieldProps) {

  const [query, setQuery] = useState(defaultValue);
  const [selectedUser, setSelectedUser] = useState<CompanyUser | null>(null);
  const [results, setResults] = useState<CompanyUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const { loginStatus } = useLoggedInUserContext();
  const { userPreference } = useUserPreference();

  // ---------------- PRE-SELECTED TEXT SUPPORT ----------------
  useEffect(() => {
    if (defaultValue && defaultValue.trim().length > 0) {
      setQuery(defaultValue);

      setSelectedUser({
        id: 0,
        fullname: defaultValue,
        email: "",
      } as CompanyUser);

      onUserSelected({
        id: 0,
        fullname: defaultValue,
        email: "",
      } as CompanyUser);
    }
  }, [defaultValue]);

  // ---------------- DISABLED HANDLER ----------------
  const handleDisabled = () => {
    toast.error(disabledMessage || "You are not authorised");
  };

  // ---------------- API SEARCH ----------------
  const fetchUsers = async (searchText: string) => {
    if (!searchText.trim() || searchText.trim().length < 2 || isDisabled) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);

      const response = await axiosClient.post(POST_API.GET_COMPANY_USERS, {
        company_id: loginStatus.companyId,
        search_parameter: searchText.trim(),
        limit: userPreference.rowsInGrid,
        requestedby: loginStatus.id,
      });

      if (response?.status === STATUS_CODE.OK) {
        setResults(response.data || []);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("SEARCH ERROR:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((txt: string) => fetchUsers(txt), 300),
    [isDisabled]
  );

  useEffect(() => {
    if (isDisabled) return;

    if (query && !selectedUser) {
      if(query !== defaultValue){
      debouncedSearch(query);
      setShowDropdown(true);
      }
    }
  }, [query, selectedUser, debouncedSearch, isDisabled]);

  // ---------------- POSITION DROPDOWN ----------------
  const updateDropdownPosition = () => {
    if (!inputRef.current) return;

    const rect = inputRef.current.getBoundingClientRect();

    setDropdownStyle({
      position: "absolute",
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
      zIndex: 9999,
    });
  };

  useEffect(() => {
    if (showDropdown) updateDropdownPosition();

    const listener = () => showDropdown && updateDropdownPosition();

    window.addEventListener("scroll", listener, true);
    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("scroll", listener, true);
      window.removeEventListener("resize", listener);
    };
  }, [showDropdown]);

  // ---------------- SELECT USER ----------------
  const handleSelect = (user: CompanyUser) => {
    if (isDisabled) return handleDisabled();

    setSelectedUser(user);
    setQuery(user.fullname);
    setShowDropdown(false);
    onUserSelected(user);
  };

  // ---------------- CLEAR FIELD ----------------
  const clearSelected = () => {
    if (isDisabled) return handleDisabled();

    setSelectedUser(null);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    onUserSelected(null);
  };

  // ---------------- CLICK OUTSIDE ----------------
  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="mt-0 w-full relative">

      {/* Label */}
      <label className="flex items-center input-label-custom">
        {Icon && <Icon size={14} className={COLORS.INPUT_LABEL_ICONS_COLOR} />}
        {label}
        {required && <span className="caption-custom-inactive align-top">*</span>}
      </label>

      {/* Input */}
      <div className="mt-1 relative w-full">
        <input
          ref={inputRef}
          type="text"
          readOnly={readOnly || isDisabled}
          value={query}
          onChange={(e) => {
            if (isDisabled) return handleDisabled();
            setQuery(e.target.value);
            setSelectedUser(null);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (isDisabled) return handleDisabled();
            setShowDropdown(true);
            updateDropdownPosition();
          }}
          placeholder={placeholder}
          className={
            isDisabled
              ? "appearance-none block w-full px-3 py-1 border bg-gray-200 border-gray-300 rounded-md shadow-sm text-gray-500 cursor-not-allowed"
              : readOnly
              ? "appearance-none block w-full px-3 py-1 border bg-gray-200 border-gray-300 rounded-md shadow-sm"
              : "appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          }
        />

        {/* Clear */}
        {query && !readOnly && !isDisabled && (
          <button
            onClick={clearSelected}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}

        {/* Search icon */}
        {!readOnly && !isDisabled && (
          <Search
            className={`absolute ${query ? "right-8" : "right-3"} top-2 text-gray-400`}
            size={16}
          />
        )}
      </div>

      {/* Dropdown Portal */}
      {showDropdown && !readOnly && !isDisabled &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="bg-white shadow-lg rounded-md border max-h-[160px] overflow-y-auto scroll-smooth"
          >
            {isLoading ? (
              <div className="p-2 table-header-custom">Searching...</div>
            ) : results.length > 0 ? (
              results.map((user) => (
                <div
                  key={user.id}
                  onMouseDown={() => handleSelect(user)}
                  className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                >
                  <div className="table-header-custom">{user.fullname}</div>
                  <div className="caption-custom">{user.email}</div>
                </div>
              ))
            ) : (
              query.length >= 2 && query !== defaultValue && (
                <div className="p-2 table-header-custom">No users found</div>
              )
            )}
          </div>,
          document.body
        )}

      {/* Error */}
      {error && <div className="mt-0 ml-0.5 caption-custom-inactive">{error}</div>}
    </div>
  );
}
