/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X } from "lucide-react";
import { createPortal } from "react-dom";
import axiosClient from "../../axios-client/AxiosClient";
import POST_API from "../../constants/PostApi";
import { debounce } from "lodash";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";

export default function LookupCompanyProductDropdown({
  onProductSelected,
  productTypeId,
  placeholder = "Search Product...",
}: {
  onProductSelected: (product: any | null) => void;
  productTypeId?: number[];
  placeholder?: string;
}) {
  const { loginStatus } = useLoggedInUserContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");

  const [results, setResults] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const [showDropdown, setShowDropdown] = useState(false);

  const [offset, setOffset] = useState(0);
  const limit = 50;

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  let abortController = new AbortController();

  // ---------------- SEARCH API ----------------

  const fetchProducts = async (searchText: string, nextOffset = 0) => {
    // if (!searchText || searchText.length < 2) return;

    abortController.abort();
    abortController = new AbortController();

    try {
      setLoading(true);

      const apiUrl = POST_API.GET_LOOKUP_COMPANY_PRODUCT;
      const response = await axiosClient.post(
        apiUrl,
        {
          company_id: loginStatus.companyId,
          requestedby: loginStatus.id,
          limit,
          offset: nextOffset,
          search_parameter: searchText || "",
          isactive: true,
          product_type_id: productTypeId ?? null,
        },
        {
          withCredentials: true,
          signal: abortController.signal,
        },
      );

      const newData = response.data || [];

      setResults((prev) =>
        nextOffset === 0 ? newData : [...prev, ...newData],
      );

      setHasMore(newData.length === limit);
    } catch (err: any) {
      if (err.code !== "ERR_CANCELED") {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // ----------- debounce -----------

  const debouncedSearch = useCallback(
    debounce((txt: string) => {
      setOffset(0);
      setHasMore(true);
      fetchProducts(txt, 0);
    }, 400),
    [],
  );

  useEffect(() => {
    if (query && !selectedProduct) {
      debouncedSearch(query);
      setShowDropdown(true);
    }
  }, [query, debouncedSearch, selectedProduct]);
  // ----------- scroll pagination -----------
  const handleScroll = () => {
    if (!dropdownRef.current || !hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const nextOffset = offset + limit;
      setOffset(nextOffset);
      fetchProducts(query, nextOffset);
    }
  };
  // ----------- select -----------
  const handleSelect = (product: any) => {
    setSelectedProduct(product);
    setQuery(product.name);
    setShowDropdown(false);
    onProductSelected(product);
  };

  // ----------- clear -----------
  const clearSelected = () => {
    setSelectedProduct(null);
    setQuery("");
    setResults([]);
    onProductSelected(null);
  };

  // ----------- outside click -----------
  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (
        !dropdownRef.current?.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  // ----------- dropdown position -----------

  const [dropdownStyle, setDropdownStyle] = useState<any>({});

  const updatePosition = () => {
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
    if (showDropdown) updatePosition();
  }, [showDropdown]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedProduct(null);
          setShowDropdown(true);
        }}
        onFocus={() => {
          setShowDropdown(true);
          updatePosition();

          // ✅ NEW: load initial list
          if (results.length === 0) {
            setOffset(0);
            setHasMore(true);
            fetchProducts("", 0);
          }
        }}
        className="appearance-none block w-full px-1 pb-1 pt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 input-label-custom"
      />

      {query && (
        <button onClick={clearSelected} className="absolute right-8 top-1.5">
          <X size={16} />
        </button>
      )}

      <Search
        size={16}
        className="absolute right-2 top-1.5 input-label-custom"
      />

      {/* DROPDOWN */}
      {showDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            onScroll={handleScroll}
            className=" bg-white shadow-lg rounded-md border max-h-[160px] overflow-y-auto scroll-smooth"
          >
            {loading ? (
              <div className="p-2 input-label-custom">Searching...</div>
            ) : results.length ? (
              results.map((product) => (
                <div
                  key={query + product.id}
                  onMouseDown={() => handleSelect(product)}
                  className="px-2 py-1 cursor-pointer hover:bg-gray-100 input-label-custom"
                >
                  {product.name}
                </div>
              ))
            ) : (
              <div className="p-2 table-header-custom">No Products Found</div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
