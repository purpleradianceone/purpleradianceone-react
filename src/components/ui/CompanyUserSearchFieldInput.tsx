/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { Edit3, Search, X } from "lucide-react";
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

import { forwardRef, useImperativeHandle } from "react";

export type CompanyUserSearchFieldRef = {
  focus: () => void;
};

interface CompanyUserSearchFieldProps {
  label: string;
  labelClassname?: string;
  required?: boolean;
  placeholder?: string;
  onUserSelected: (user: CompanyUser | null) => void;
  error?: string;
  logo?: any;
  readOnly?: boolean;
  defaultValue?: string;
  isDisabled?: boolean;
  disabledMessage?: string | null;
  hasXLogo?: boolean;
  hasPenLogo?: boolean;
  hasBorder?: boolean;
  hasSearchLogo?: boolean;

  has?: {
    xLogo?: boolean;
    penLogo?: boolean;
    border?: boolean;
    searchLogo?: boolean;
  };
}

const CompanyUserSearchFieldInput = forwardRef<
  CompanyUserSearchFieldRef,
  CompanyUserSearchFieldProps
>(
  (
    {
      label,
      labelClassname,
      placeholder = "Search with name, email, mobilenumber...",
      required,
      error,
      logo: Icon,
      readOnly = false,
      defaultValue = "",
      onUserSelected,
      isDisabled = false,
      disabledMessage = null,
      has = {
        border: true,
        penLogo: false,
        searchLogo: true,
        xLogo: true,
      },
    },
    ref,
  ) => {
    const [query, setQuery] = useState(defaultValue);
    const [selectedUser, setSelectedUser] = useState<CompanyUser | null>(null);
    const [results, setResults] = useState<CompanyUser[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    /** 🔹 Pagination states */
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
        inputRef.current?.select();
      },
    }));

    const dropdownRef = useRef<HTMLDivElement>(null);
    let abortController = new AbortController();

    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    const { loginStatus } = useLoggedInUserContext();
    const { userPreference } = useUserPreference();

    const [lastSelectedUser, setLastSelectedUser] =
      useState<CompanyUser | null>(null);
    const [isExplicitClear, setIsExplicitClear] = useState(false);

    const userPreferenceLimit = userPreference.rowsInGrid;
    // const userPreferenceLimit = 5;

    // ---------------- PRE POPULATE ----------------
    useEffect(() => {
      if (defaultValue && defaultValue.trim().length > 0) {
        setQuery(defaultValue);

        const user = {
          id: 0,
          fullname: defaultValue,
          email: "",
        } as CompanyUser;

        setSelectedUser(user);
        // onUserSelected(user);
        setLastSelectedUser(user);
      }
    }, [defaultValue]);

    // ---------------- DISABLED ----------------
    const handleDisabled = () => {
      toast.error(disabledMessage || "You are not authorised");
    };

    // ---------------- SEARCH API ----------------
    const fetchUsers = async (searchText: string, nextOffset = 0) => {
      if (
        !searchText.trim() ||
        searchText.trim().length < 2 ||
        isDisabled ||
        isFetchingMore
      ) {
        // abortController.abort();
        // setResults([]);
        return;
      }

      //abort previous request
      if (abortController) {
        abortController.abort();
        console.log("previous request is cancled");
      }

      // const controller = new AbortController();
      abortController = new AbortController();

      try {
        setIsLoading(nextOffset === 0);
        setIsFetchingMore(true);

        const response = await axiosClient.post(
          POST_API.GET_LOOKUP_COMPANY_USERS,
          {
            company_id: loginStatus.companyId,
            search_parameter: searchText.trim(),
            isactive: true,
            limit: userPreferenceLimit,
            offset: nextOffset,
            requestedby: loginStatus.id,
          },
          {
            withCredentials: true,
            signal: abortController.signal,
          },
        );

        if (response?.status === STATUS_CODE.OK) {
          const newData: CompanyUser[] = response.data || [];
          setResults((prev) =>
            nextOffset === 0 ? newData : [...prev, ...newData],
          );
          setHasMore(newData.length === userPreferenceLimit);
          setActiveIndex(0);
        } else {
          setHasMore(false);
        }
      } catch (err: any) {
        if (err.code === "ERR_CANCELED") {
          console.log("Request canceled:", searchText);
          return;
        }
        console.error("SEARCH ERROR:", err);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    };

    const debouncedSearch = useCallback(
      debounce((txt: string) => {
        setOffset(0);
        setHasMore(true);
        fetchUsers(txt, 0);
      }, 500),
      [isDisabled],
    );

    // cleanup AbortController on unmount
    useEffect(() => {
      return () => {
        debouncedSearch.cancel();
        if (abortController) {
          abortController.abort();
        }
      };
    }, []);

    useEffect(() => {
      if (isDisabled) return;

      if (query && !selectedUser && query !== defaultValue) {
        debouncedSearch(query);
        setShowDropdown(true);
      }
    }, [query, selectedUser, debouncedSearch, isDisabled]);

    // ---------------- DROPDOWN SCROLL (LOAD MORE) ----------------
    const handleDropdownScroll = () => {
      if (!dropdownRef.current || !hasMore || isFetchingMore) return;

      const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        const nextOffset = offset + userPreferenceLimit;
        setOffset(nextOffset);
        fetchUsers(query, nextOffset);
      }
    };

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

      setIsExplicitClear(false);
      setLastSelectedUser(user); //  persist valid selection
      setSelectedUser(user);
      setQuery(user.fullname);
      setShowDropdown(false);
      onUserSelected(user);
    };

    // ---------------- CLEAR ----------------
    const clearSelected = () => {
      if (isDisabled) return handleDisabled();

      setIsExplicitClear(true);

      setSelectedUser(null);
      setQuery("");
      setResults([]);
      setOffset(0);
      setHasMore(true);
      setShowDropdown(false);
      onUserSelected(null);
    };

    //Outside check
    useEffect(() => {
      const handleOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          !inputRef.current?.contains(event.target as Node)
        ) {
          setShowDropdown(false);

          // RESTORE PREVIOUS VALUE
          if (lastSelectedUser && !isExplicitClear) {
            setSelectedUser(lastSelectedUser);
            setQuery(lastSelectedUser.fullname);
            onUserSelected(lastSelectedUser);
          }
        }
      };

      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }, [query, lastSelectedUser, isExplicitClear]);

    //Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!showDropdown || results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
      }

      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };

    const textMeasureRef = useRef<HTMLSpanElement>(null);

    const getIconLeft = () => {
      if (!textMeasureRef.current) return 0;
      return textMeasureRef.current.offsetWidth + 16; // input padding left
    };

    // Auto-scroll active item into view
    useEffect(() => {
      if (!dropdownRef.current) return;

      const activeItem = dropdownRef.current.querySelector(".active-item");
      if (activeItem) {
        (activeItem as HTMLElement).scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }, [activeIndex]);

    return (
      <div className="mt-0 w-full relative">
        <label
          className={`flex items-center ${
            labelClassname || "input-label-custom"
          } `}
        >
          {Icon && (
            <Icon size={14} className={COLORS.INPUT_LABEL_ICONS_COLOR} />
          )}

          {label}
          {required && (
            <span className="caption-custom-inactive align-top">*</span>
          )}
        </label>

        <div className="relative w-full justify-center input-label-custom ">
          <input
            ref={inputRef}
            type="text"
            readOnly={readOnly || isDisabled}
            value={query}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              if (isDisabled) return handleDisabled();
              setIsExplicitClear(false);
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
                ? "appearance-none block w-full px-1 pb-1 pt-1 border bg-gray-200 border-gray-300 rounded-md shadow-sm text-gray-500 cursor-not-allowed"
                : readOnly
                  ? "appearance-none block w-full px-1 pb-1 pt-1 border bg-gray-200 border-gray-300 rounded-md shadow-sm"
                  : `appearance-none block w-full  ${
                      has.border
                        ? "border border-gray-300 px-1 pb-1 pt-1 rounded-md shadow-sm focus:outline-none"
                        : ""
                    }   focus:ring-blue-500 focus:border-blue-500`
            }
          />
          {/* TEXT WIDTH MEASURER (hidden) */}
          <span
            ref={textMeasureRef}
            className="absolute invisible whitespace-pre text-sm font-normal"
          >
            {query || placeholder}
          </span>
          {has.penLogo && (
            <Edit3
              size={12}
              style={{ left: getIconLeft() }}
              className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          )}

          {query && !readOnly && !isDisabled && has.xLogo && (
            <button
            type="button"
              onClick={clearSelected}
              className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}

          {!readOnly && !isDisabled && has.searchLogo && (
            <Search
              className={`absolute ${
                query ? "right-8" : "right-3"
              } top-1.5 text-gray-400`}
              size={16}
            />
          )}
        </div>

        {/* Dropdown */}
        {showDropdown &&
          !readOnly &&
          !isDisabled &&
          createPortal(
            <div
              ref={dropdownRef}
              style={dropdownStyle}
              onScroll={handleDropdownScroll} // ✅ SCROLL HANDLER
              className="bg-white shadow-lg rounded-md border max-h-[160px] overflow-y-auto scroll-smooth"
            >
              {isLoading ? (
                <div className="p-2 table-header-custom">Searching...</div>
              ) : results.length > 0 ? (
                <div>
                  {results.map((user, index) => (
                    <div
                      key={user.id}
                      onMouseDown={() => handleSelect(user)}
                      className={`px-2 py-1 cursor-pointer 
                  ${
                    index === activeIndex
                      ? "bg-blue-100 active-item"
                      : "hover:bg-gray-100"
                  }`}
                    >
                      <div className="table-header-custom">{user.fullname}</div>
                      <div className="caption-custom">{user.email}</div>
                    </div>
                  ))}
                  {isFetchingMore && (
                    <div className="p-2 text-center text-sm text-gray-400">
                      Loading more...
                    </div>
                  )}
                  {!hasMore && (
                    <div className="p-2 text-center text-sm text-gray-400">
                      No more data
                    </div>
                  )}
                </div>
              ) : (
                query.length >= 2 &&
                query !== defaultValue && (
                  <div className="p-2 table-header-custom">No users found</div>
                )
              )}
            </div>,
            document.body,
          )}

        {error && (
          <div className="mt-0 ml-0.5 caption-custom-inactive">{error}</div>
        )}
      </div>
    );
  },
);

export default CompanyUserSearchFieldInput;
