/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  ChangeEvent,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
} from "react";
import {
  XCircle,
  ArrowRight,
  Search,
  Info,
  ArrowLeft,
  LucideFolderInput,
} from "lucide-react";
import Papa from "papaparse";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import PostDataTypeForLeadSourceAndStatusAndStates from "../../../../@types/lead-management/PostDataTypeForLeadSourceAndStatusAndStates";
import { NUMBER_VALUES, STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import CompanyUser from "../../../../@types/company-users/CompanyUser";
import { useUserPreference } from "../../../../context/user/UserPreference";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import LeadImportResponse from "../../../../@types/lead-management/LeadImportResponse";
import LeadImportResultPopUp from "./LeadImportResultPopUp";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../../ui/MessageSnackbar";
import Button from "../../../ui/Button";
import InterestType from "../../../../@types/lead-management/InterestType";
import ApiError from "../../../../@types/error/ApiError";
import { Product } from "../../../../@types/products/ProductsManagementProps";
import COLORS from "../../../../constants/Colors";
import toast from "react-hot-toast";
import LoadingPopUpAnimation from "../../../views/card/LoadingPopUpAnimation";
import { convertToCsvFile } from "../../../../constants/PostDataToCsv";
import MESSAGE from "../../../../constants/Messages";

// --- GENERIC TYPES ---
interface MappableItem {
  id: number | null;
  name: string | null;
}

// --- DRAG-AND-DROP TYPES ---
type CsvData = string[][];

interface CrmField {
  id: string;
  label: string;
  required: boolean;
}

interface FieldMapping {
  [crmFieldId: string]: string[];
}

interface ValueMapping {
  [crmId: string]: string;
}

const ItemTypes = {
  CSV_COLUMN: "csv_column",
  CSV_STATUS_VALUE: "csv_status_value",
  CSV_SOURCE_VALUE: "csv_source_value",
  CSV_OWNER_VALUE: "csv_owner_value",
  CSV_INTEREST_VALUE: "csv_interest_value",
  CSV_PRODUCT_VALUE: "csv_product_value",
};

interface DragItem {
  name: string;
  type: string;
}

// --- DND-ENABLED COMPONENTS ---

const DraggableCsvColumn: React.FC<{ header: string }> = ({ header }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CSV_COLUMN,
    item: { name: header },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));
  return (
    <li
      ref={drag}
      className={`bg-gray-100  px-3 py-1.5 rounded input-label-custom border border-gray-200 shadow-sm cursor-grab ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {header}
    </li>
  );
};

const DraggableCsvValue: React.FC<{ value: string; type: string }> = ({
  value,
  type,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { name: value },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));
  return (
    <div
      ref={drag}
      className={`p-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm cursor-grab transition-all ${
        isDragging ? "opacity-40 scale-95" : "opacity-100"
      }`}
    >
      {value}
    </div>
  );
};

const DroppableCrmField: React.FC<{
  field: CrmField;
  mappedHeaders: string[];
  onDrop: (id: string, header: string) => void;
  onRemoveMapping: (id: string, header: string) => void;
}> = ({ field, mappedHeaders, onDrop, onRemoveMapping }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.CSV_COLUMN,
    drop: (item: DragItem) => {
      if (!mappedHeaders.includes(item.name)) onDrop(field.id, item.name);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div key={field.id} className="flex items-start justify-evenly">
      <label
        htmlFor={`map-${field.id}`}
        className="w-1/2 input-label-custom  pt-2"
      >
        {field.label}
        {field.required && <span className="text-red-500 ">*</span>} :
      </label>
      <div
        ref={drop}
        className={`w-1/2 min-h-[40px] border rounded-md p-2 flex flex-wrap gap-2 items-center transition-all ${
          isOver && canDrop
            ? "border-blue-500 bg-blue-50 ring-2"
            : "border-gray-300 bg-gray-50"
        } ${canDrop ? "border-dashed" : ""}`}
      >
        {mappedHeaders.length > 0 ? (
          mappedHeaders.map((header) => (
            <span
              key={header}
              className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 caption-custom-blue"
            >
              {header}
              <XCircle
                className={`ml-1 w-4 h-4 ${COLORS.CANCEL_BUTTON_TEXT_COLOR} cursor-pointer`}
                onClick={() => onRemoveMapping(field.id, header)}
              />
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm  italic">
            Drag column here
          </span>
        )}
      </div>
    </div>
  );
};

// Generic Value Mapping Card Component
interface ValueMappingCardProps<T extends MappableItem> {
  title: string;
  csvValues: string[];
  crmData:
    | T[]
    | PostDataTypeForLeadSourceAndStatusAndStates[]
    | Product[]
    | null;
  mapping: ValueMapping;
  onDrop: (crmItem: T, csvValue: string) => void;
  onRemove: (crmItem: T) => void;
  itemType: string;
  onSearch?: (searchTerm: string, offset: number, limit: number) => void; // Added offset and limit
  searchPlaceholder?: string;
  totalCrmItems?: number; // Added total for pagination
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

// note : wrapped this component with thte forwardRef to get the ref of the component
// VALUE MAPPING CARD COMPONENT
const GenericValueMappingCard = forwardRef(
  <T extends MappableItem>(
    {
      title,
      csvValues,
      crmData,
      mapping,
      onDrop,
      onRemove,
      itemType,
      onSearch,
      searchPlaceholder,
      totalCrmItems,
      currentPage = 0,
      itemsPerPage = 25,
      onPageChange,
    }: ValueMappingCardProps<T>,
    ref: React.Ref<HTMLDivElement> // added this for component reference
  ) => {
    const [searchTerm, setSearchTerm] = useState("");
    const crmValues = crmData || [];
    const mappedCsvValues = Object.values(mapping);
    const unmappedCsvValues = csvValues.filter(
      (v) => !mappedCsvValues.includes(v)
    );

    const getMappedCsvValue = (crmId: number | null) =>
      crmId ? mapping[String(crmId)] : undefined;

    const handleSearch = () => {
      if (onSearch) {
        onSearch(searchTerm, currentPage * itemsPerPage, itemsPerPage);
      }
    };

    // NOTE : DROP EACH VALUE TO ITS TARGET
    const DroppableTarget: React.FC<{ crmItem: T | any }> = ({ crmItem }) => {
      const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
          accept: itemType,
          drop: (item: DragItem) => onDrop(crmItem, item.name),
          collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
          }),
        }),
        [crmItem, onDrop]
      );

      const mappedValue = getMappedCsvValue(crmItem.id);

      return (
        <div className="flex items-center gap-2">
          <div
            ref={drop}
            className={`flex-1 p-2 border rounded-md transition-all text-center h-10 flex items-center justify-center ${
              isOver && canDrop
                ? "border-green-500 bg-green-50 ring-2"
                : "border-gray-300"
            } ${mappedValue ? "bg-green-100" : "bg-white"}`}
          >
            {mappedValue ? (
              <div className="flex justify-between items-center w-full input-label-custom-active">
                <span>{mappedValue}</span>
                <XCircle
                  className={`w-4 h-4  ${COLORS.CANCEL_BUTTON_TEXT_COLOR} cursor-pointer`}
                  onClick={() => onRemove(crmItem)}
                />
              </div>
            ) : (
              <span className="caption-custom">Drop here</span>
            )}
          </div>
          <ArrowRight className="text-gray-400 flex-shrink-0" />
          <div className="flex-1 p-2 bg-blue-100 input-label-custom-blue rounded-md h-10 flex items-center justify-center">
            {crmItem.name!}
          </div>
        </div>
      );
    };

    // Pagination controls
    const totalPages = totalCrmItems
      ? Math.ceil(totalCrmItems / itemsPerPage)
      : 0;

    // Function to handle page change in the GenericValueMappingCard
    const handleInternalPageChange = (newPage: number) => {
      if (onPageChange) {
        onPageChange(newPage); // Update the parent component's page state
        if (onSearch) {
          // Trigger search with the new offset
          onSearch(searchTerm, newPage * itemsPerPage, itemsPerPage);
        }
      }
    };

    return (
      <div ref={ref} className="border rounded-lg p-3 bg-gray-50/80 shadow-sm">
        <h3 className="table-header-custom mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={onSearch ? " mt-12 ": ""}>
            <h4 className="input-label-custom text-center mb-2">
              Your CSV Values (Drag)
            </h4>
            <div className="space-y-2 p-2 input-label-custom  bg-white rounded-md border min-h-[100px] max-h-80 overflow-y-auto">
              {unmappedCsvValues.map((s) => (
                <DraggableCsvValue key={s} value={s} type={itemType} />
              ))}
            </div>
          </div>
          <div>
            {onSearch && (
              <div className="flex items-center gap-1 mb-2">
                <span className="p-2 bg-blue-600 text-white rounded-md ">
                  <Search className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={
                    (e) => {
                      const value = e.target.value;
                      setSearchTerm(value);
                      onSearch(value, null!, null!);
                    }
                    // setSearchTerm(e.target.value)
                  }
                  onKeyDown={handleSearch}
                  placeholder={searchPlaceholder || "Search..."}
                  className="flex-grow p-2 border rounded-md text-sm"
                />
                {/* <button
                onClick={() => onSearch(searchTerm, null!, null!)}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Search className="w-5 h-5" />
              </button> */}
              </div>
            )}
            <h4 className="input-label-custom  text-center mb-2">
              To CRM Values (Drop)
            </h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {crmValues.map(
                (item) =>
                  item.id && <DroppableTarget key={item.id} crmItem={item} />
              )}
            </div>
            {totalPages > 1 && onPageChange && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => handleInternalPageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded-md bg-gray-200 input-label-custom  disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="input-label-custom ">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => handleInternalPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1 rounded-md bg-gray-200 input-label-custom  disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

// --- MAIN COMPONENT ---
const LeadImportCsv = ({
  // isSelectCsvButtonClicked
  handleButtonClicked,
}: {
  // isSelectCsvButtonClicked:boolean
  handleButtonClicked: (value: boolean) => void;
}) => {
  const { userPreference } = useUserPreference();
  const { loginStatus } = useLoggedInUserContext();

  // --- STATE ---
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [originalCsvHeaders, setOriginalCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [showPreImportReview, setShowPreImportReview] =
    useState<boolean>(false); // New state for pre-import review

  const [isLoadingLeadInterestData, setIsLoadingLeadInterestData] =
    useState<boolean>(true);
  const [
    isLoadingLeadSourceAndStatusData,
    setIsLoadingLeadSourceAndSourceData,
  ] = useState<boolean>(true);

  // Refs for auto-scrolling
  const leadStatusMappingRef = useRef<HTMLDivElement>(null);
  const leadSourceMappingRef = useRef<HTMLDivElement>(null);
  const leadOwnerMappingRef = useRef<HTMLDivElement>(null);
  const productDataMappingRef = useRef<HTMLDivElement>(null);

  const leadInterestTypeMappingRef = useRef<HTMLDivElement>(null);

  // Mappings
  const [fieldMappings, setFieldMappings] = useState<FieldMapping>({});
  const [statusValueMapping, setStatusValueMapping] = useState<ValueMapping>(
    {}
  );
  const [sourceValueMapping, setSourceValueMapping] = useState<ValueMapping>(
    {}
  );
  const [ownerValueMapping, setOwnerValueMapping] = useState<ValueMapping>({});
  const [productDataValueMapping, setProductDataValueMapping] =
    useState<ValueMapping>({});

  const [InterestTypeValueMapping, setInterestTypeValueMapping] =
    useState<ValueMapping>({});

  // Unique values from CSV
  const [csvUniqueStatuses, setCsvUniqueStatuses] = useState<string[]>([]);
  const [csvUniqueSources, setCsvUniqueSources] = useState<string[]>([]);
  const [csvUniqueOwners, setCsvUniqueOwners] = useState<string[]>([]);
  const [csvUniqueProductData, setCsvUniqueProductData] = useState<string[]>(
    []
  );

  const [csvUniqueInterestType, setCsvUniqueInterestType] = useState<string[]>(
    []
  );

  // Data from API
  const [leadStatus, setLeadStatus] = useState<
    PostDataTypeForLeadSourceAndStatusAndStates[] | null
  >(null);
  const [leadSource, setLeadSource] = useState<
    PostDataTypeForLeadSourceAndStatusAndStates[] | null
  >(null);
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
  // Note : For getting the product data
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [totalProductData, setTotalProductData] = useState<number>(0); // Total count for pagination
  const [productDataCurrentPage, setProductDataCurrentPage] =
    useState<number>(0);

  const [totalCompanyUsers, setTotalCompanyUsers] = useState<number>(0); // Total count for pagination
  const [companyUsersCurrentPage, setCompanyUsersCurrentPage] =
    useState<number>(0);
  const [csvImportButtonClicked, setCsvImportButtonClicked] =
    useState<boolean>(false);
  const [isLoadingSpinnerAfterSubmission, setIsLoadingSpinnerAfterSubmission] =
    useState<boolean>(false);
  const [showLeadImportResultPopUp, setShowLeadImportResultPopUp] =
    useState<boolean>(false);
  const [LeadImportResponse, setLeadImportResponse] =
    useState<LeadImportResponse>({
      message: "",
      status: false,
    });

  const [interestTypeData, setInterestTypeData] = React.useState<
    InterestType[]
  >([]);

  //note : Message Snackbar
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
  // Processed CSV data for review

  interface ProcessedLeadData {
    // originalRow: string[];
    mappedData: {
      [key: string]: string | number | null; // Allow number for IDs
      // leadStatus?: number | null ;
      // leadSource?: number | null;
      // leadOwner?: number | null;
      // name?: string | null;
      // email?: string | null;
      // mobileNumber?: string | null;
      // ... other CRM fields
    };
    displayData: { [key: string]: string | null };
    isDuplicate: boolean;
    isSelectedForImport: boolean;
  }
  const [processedLeads, setProcessedLeads] = useState<ProcessedLeadData[]>([]);

  // --- STATIC DATA ---
  const crmLeadFields: CrmField[] = useMemo(
    () => [
      { id: "name", label: "Full Name", required: true },
      { id: "email", label: "Email", required: false },
      { id: "mobilenumber", label: "Mobile Number", required: false },
      { id: "description", label: "Description", required: false },
      { id: "lead_interest_id", label: "Interest Type", required: false },
      { id: "job_title", label: "Job Title", required: false },
      { id: "industry_name", label: "Industry", required: false },
      { id: "country", label: "Country", required: false },
      { id: "state", label: "State", required: false },
      { id: "district", label: "District", required: false },
      { id: "website", label: "Website", required: false },
      { id: "leadStatus", label: "Lead Status", required: false },
      {
        id: "additional_contact_number",
        label: "Addi. Contact Number",
        required: false,
      },
      { id: "leadSource", label: "Lead Source", required: false },
      { id: "address", label: "Address", required: false },
      { id: "lead_created_on_string", label: "Created On", required: false },
      { id: "company_product_id", label: "Product", required: false },

      { id: "leadOwner", label: "Lead Owner", required: false },
    ],
    []
  );

  // --- API CALLS ---
  const fetchApiData = useCallback(async () => {
    const callApi = async (
      url: string,
      setData: (data: PostDataTypeForLeadSourceAndStatusAndStates[]) => void,
      callFn: () => Promise<void>
    ) => {
      const postDataForLeadStatusAndSource = {
        id: null,
        name: null,
        description: null,
        isactive: true,
      };
      try {
        const response = await axios.post(url, postDataForLeadStatusAndSource, {
          withCredentials: true,
        });
        if (response.status === STATUS_CODE.OK) {
          setData(response.data);
        }
      } catch (error: any) {
        if (error.response?.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: callFn,
          });
          if (refreshTokenStatus) {
            callFn();
          }
        }
      }
    };

    try{
      await callApi(POST_API.GET_LEAD_STATUS, setLeadStatus, fetchApiData);
      await callApi(POST_API.GET_LEAD_SOURCE, setLeadSource, fetchApiData);
    }catch(err : any ){
      toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG+" Please refresh the page.");
    }finally{
        setIsLoadingLeadSourceAndSourceData(false);
    }
  }, []);

  // API call to get lead interest data
  const  getLeadInterestData = useCallback(async ()=> {
    try {
      const response = await axios.get(POST_API.GET_LEAD_INTEREST_TYPE, {
        params: {
          id: null,
          name: null,
          isActive: true,
        },
        withCredentials: true,
      });

      if (response.status === STATUS_CODE.OK) {
        setInterestTypeData(response.data);
      }
    } catch (error: any) {
      //NOTE : NEED TO ADD REFRESH TOKEN HANDLING HERE
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getLeadInterestData,
        });
        if (refreshTokenStatus) {
          getLeadInterestData();
        }
      }else{
              toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG+" Please refresh the page.");
      }
    }finally{
        setIsLoadingLeadInterestData(false);
      }
  },[])
  // Note : called the above function , will get the data once the component renders
  useEffect(() => {
      getLeadInterestData();
  }, []);

  // Note : api call to get company product
  const fetchCompanyProducts = async (
    searchParameter: string,
    offset: number,
    limit: number
  ) => {
    const getProductPostData = {
      company_id: loginStatus.companyId,
      id: null,
      limit: limit,
      offset: offset,
      search_company_specific_date_range_id: null,
      search_parameter: searchParameter,
      search_parameter_date: null,
      requestedby_id: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.GET_PRODUCTS,
        getProductPostData,
        {
          withCredentials: true,
        }
      );

      const normalizedProductData = response.data.map((product: any) => ({
        ...product,
        name: `${product.name}`.trim(),
      }));
      setProductsData(normalizedProductData);

      // Assuming the API response includes a total count in a 'count' field
      if (response.data.length > 0 && response.data[0].count !== undefined) {
        setTotalProductData(response.data[0].count);
      } else {
        setTotalProductData(normalizedProductData.length); // Fallback if count is not provided
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: () =>
            fetchCompanyProducts(searchParameter, offset, limit),
        });

        if (refreshTokenStatus) {
          fetchCompanyProducts(searchParameter, offset, limit);
        }
      }
    }
  };

  // Note : Api call to get the data Company User with offset and limit
  const fetchCompanyUsers = async (
    searchParameter: string,
    offset: number,
    limit: number
  ) => {
    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      requestedby: loginStatus.id,
      limit: limit,
      offset: offset,
      search_company_specific_date_range_id: null,
      search_parameter: searchParameter,
      search_parameter_date: null,
    };

    try {
      const response = await axios.post(POST_API.GET_COMPANY_USERS, postData, {
        withCredentials: true,
      });

      const normalizedUsers = response.data.map((user: CompanyUser) => ({
        ...user,
        name: `${user.fullname}`.trim(),
      }));
      setCompanyUsers(normalizedUsers);
      // Assuming the API response includes a total count in a 'count' field
      if (response.data.length > 0 && response.data[0].count !== undefined) {
        setTotalCompanyUsers(response.data[0].count);
      } else {
        setTotalCompanyUsers(normalizedUsers.length); // Fallback if count is not provided
      }
    } catch (error: any) {
      if (error.response?.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: () => fetchCompanyUsers(searchParameter, offset, limit),
        });
        if (refreshTokenStatus) {
          fetchCompanyUsers(searchParameter, offset, limit);
        }
      }
    }
  };

  useEffect(() => {
    fetchApiData();
    fetchCompanyProducts("", 0, userPreference.rowsInGrid || 25);
    fetchCompanyUsers("", 0, userPreference.rowsInGrid || 25); // Initial fetch
  }, [fetchApiData, userPreference.rowsInGrid]);

  // --- EFFECTS ---
  useEffect(() => {
    if (originalCsvHeaders.length > 0) {
      const initialMappings: FieldMapping = {};
      crmLeadFields.forEach((field) => {
        const fieldIdLower = field.id.toLowerCase();
        const found = originalCsvHeaders.find(
          (h) => h.toLowerCase().replace(/ /g, "") === fieldIdLower
        );
        initialMappings[field.id] = found ? [found] : [];
      });
      setFieldMappings(initialMappings);
    }
  }, [originalCsvHeaders, crmLeadFields]);

  // Note : extract the unique values
  const extractUniqueValues = (
    fieldId:
      | "leadStatus"
      | "leadSource"
      | "leadOwner"
      | "lead_interest_id"
      | "company_product_id",
    setUniqueValues: (v: string[]) => void
  ) => {
    const mappedHeaders = fieldMappings[fieldId];
    if (!csvData || !mappedHeaders?.length) {
      setUniqueValues([]);
      return;
    }
    const indices = mappedHeaders
      .map((h) => originalCsvHeaders.indexOf(h))
      .filter((i) => i !== -1);
    const unique = new Set<string>();
    csvData.slice(1).forEach((row) => {
      indices.forEach((index) => {
        if (row[index]?.trim()) unique.add(row[index].trim());
      });
    });
    setUniqueValues(Array.from(unique));
  };

  const extractUniqueValuesForMultipleMapping = (
    fieldId: "company_product_id",
    setUniqueValues: (v: string[]) => void
  ) => {
    const mappedHeaders = fieldMappings[fieldId];
    if (!csvData || !mappedHeaders?.length) {
      setUniqueValues([]);
      return;
    }

    const indices = mappedHeaders
      .map((h) => originalCsvHeaders.indexOf(h))
      .filter((i) => i !== -1);

    const unique = new Set<string>();

    csvData.slice(1).forEach((row) => {
      indices.forEach((index: number) => {
        const cellValue = row[index];

        if (cellValue?.trim().includes(`"`)) {
          const values = cellValue
            .replace(/"/g, "")
            .split(":")
            .map((v) => v.trim())
            .filter((v) => v.length > 0);

          values.forEach((v) => {
            unique.add(v);
          });
        } else {
          const values = cellValue
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v.length > 0);

          values.forEach((v) => {
            unique.add(v);
          });
        }
      });
    });

    setUniqueValues(Array.from(unique));
  };

  // Note
  useEffect(() => {
    extractUniqueValues("leadStatus", setCsvUniqueStatuses);
    setStatusValueMapping({});
  }, [csvData, fieldMappings.leadStatus]);
  useEffect(() => {
    extractUniqueValues("leadSource", setCsvUniqueSources);
    setSourceValueMapping({});
  }, [csvData, fieldMappings.leadSource]);
  useEffect(() => {
    extractUniqueValues("leadOwner", setCsvUniqueOwners);
    setOwnerValueMapping({});
  }, [csvData, fieldMappings.leadOwner]);
  // for Product Data
  useEffect(() => {
    extractUniqueValuesForMultipleMapping(
      "company_product_id",
      setCsvUniqueProductData
    );
    setProductDataValueMapping({});
  }, [csvData, fieldMappings.company_product_id]);
  // for interest type
  useEffect(() => {
    extractUniqueValues("lead_interest_id", setCsvUniqueInterestType);
    setInterestTypeValueMapping({});
  }, [csvData, fieldMappings.lead_interest_id]);

  // --- HANDLERS ---
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // true if button is clicked
    // setIsSelectCsvButtonClicked(true);
    setCsvImportButtonClicked(true);
    handleButtonClicked(true);
    setCsvFile(null);
    setCsvData(null);
    setOriginalCsvHeaders([]);
    setError(null);
    handleCloseSnackbar();
    setFieldMappings({});
    setStatusValueMapping({});
    setSourceValueMapping({});
    setInterestTypeValueMapping({});
    setProductDataValueMapping({});
    setOwnerValueMapping({});
    setCsvUniqueStatuses([]);
    setCsvUniqueSources([]);
    setCsvUniqueOwners([]);
    setCsvUniqueProductData([]);
    setCsvUniqueInterestType([]);
    setProcessedLeads([]); // Clear processed leads on new file
    setShowPreImportReview(false); // Hide review on new file

    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setCsvFile(file);
        readCsv(file);
      } else {
        // setError("Please select a valid CSV file.");
        showMessageSnackbar({
          message: "Please select a valid CSV file.",
          type: "error",
        });
      }
    }
  };

  const resetState = () => {
    setCsvImportButtonClicked(false);
    handleButtonClicked(false);
    setCsvFile(null);
    setCsvData(null);
    setOriginalCsvHeaders([]);
    setError(null);
    handleCloseSnackbar();
    setFieldMappings({});
    setStatusValueMapping({});
    setSourceValueMapping({});
    setInterestTypeValueMapping({});
    setProductDataValueMapping({});
    setOwnerValueMapping({});
    setCsvUniqueStatuses([]);
    setCsvUniqueSources([]);
    setCsvUniqueOwners([]);
    setCsvUniqueInterestType([]);
    setCsvUniqueProductData([]);
    setProcessedLeads([]); // Clear processed leads on new file
    setShowPreImportReview(false); // Hide review on new file
  };
  const readCsv = (file: File) => {
    setIsParsing(true);

    Papa.parse(file, {
      header: false, // since you're manually managing headers
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData = results.data as string[][];

          if (!parsedData || parsedData.length === 0) {
            throw new Error("CSV file is empty.");
          }

          // Set parsed data and headers
          setCsvData(parsedData);
          setOriginalCsvHeaders(parsedData[0]);

          // Clear any existing error message
          handleCloseSnackbar();
        } catch (err: any) {
          showMessageSnackbar({
            message: err.message || "Failed to parse CSV.",
            type: "error",
          });
        } finally {
          setIsParsing(false);
        }
      },
      error: (err) => {
        showMessageSnackbar({
          message: err.message || "Error reading CSV file.",
          type: "error",
        });
        setIsParsing(false);
      },
    });
  };

  //   const readCsv = (file: File) => {
  //   setIsParsing(true);
  //   Papa.parse(file, {
  //     complete: (result :any) => {
  //       setCsvData(result.data);
  //       setOriginalCsvHeaders(result.data[0]);
  //       handleCloseSnackbar();
  //       setIsParsing(false);
  //     },
  //     error: (err :any) => {
  //       showMessageSnackbar({
  //         message: err.message || "Failed to parse CSV.",
  //         type: "error",
  //       });
  //       setIsParsing(false);
  //     },
  //   });
  // };
  const handleDropField = useCallback(
    (crmFieldId: string, csvHeader: string) => {
      setFieldMappings((prev) => {
        const currentMappings = prev[crmFieldId] || [];
        // Prevent adding the same header multiple times to a field
        if (!currentMappings.includes(csvHeader)) {
          const newMappings = [...currentMappings, csvHeader];

          // --- Auto-scroll logic ---
          // Use a small timeout to ensure the DOM has updated before scrolling
          // (This might not always be strictly necessary but can help prevent race conditions)
          setTimeout(() => {
            if (crmFieldId === "leadStatus" && leadStatusMappingRef.current) {
              leadStatusMappingRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            } else if (
              crmFieldId === "leadSource" &&
              leadSourceMappingRef.current
            ) {
              leadSourceMappingRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            } else if (
              crmFieldId === "leadOwner" &&
              leadOwnerMappingRef.current
            ) {
              leadOwnerMappingRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
            // product data
            else if (
              crmFieldId === "company_product_id" &&
              productDataMappingRef.current
            ) {
              productDataMappingRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
            // for lead interest type
            else if (
              crmFieldId === "lead_interest_id" &&
              leadInterestTypeMappingRef.current
            ) {
              leadInterestTypeMappingRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 100); // Small delay, adjust if needed

          return { ...prev, [crmFieldId]: newMappings };
        }
        return prev; // If header already mapped, return previous state
      });
    },
    [
      leadStatusMappingRef,
      leadSourceMappingRef,
      leadOwnerMappingRef,
      productDataMappingRef,
      leadInterestTypeMappingRef,
      leadOwnerMappingRef,
    ] // Add refs to dependency array
  );
  const handleRemoveFieldMapping = useCallback(
    (crmFieldId: string, csvHeader: string) => {
      setFieldMappings((prev) => ({
        ...prev,
        [crmFieldId]: (prev[crmFieldId] || []).filter((h) => h !== csvHeader),
      }));
    },
    []
  );

  // const handleValueMap = <T extends MappableItem>(
  //   crmItem: T,
  //   csvValue: string,
  //   currentMapping: ValueMapping,
  //   setMapping: (m: ValueMapping) => void
  // ) => {
  //   if (!crmItem.id) return;
  //   const newMapping = { ...currentMapping };
  //   Object.keys(newMapping).forEach((key) => {
  //     if (newMapping[key] === csvValue) delete newMapping[key];
  //   });
  //   newMapping[String(crmItem.id)] = csvValue;

  //   setMapping(newMapping);
  // };

  // const handleRemoveValueMap = <T extends MappableItem>(
  //   crmItem: T,
  //   currentMapping: ValueMapping,
  //   setMapping: (m: ValueMapping) => void
  // ) => {
  //   if (!crmItem.id) return;
  //   const newMapping = { ...currentMapping };
  //   delete newMapping[String(crmItem.id)];
  //   setMapping(newMapping);
  // };

  // Add this in parent component

  const [ownerCache, setOwnerCache] = useState<Record<string, CompanyUser>>({});

  useEffect(() => {
    if (companyUsers?.length) {
      setOwnerCache((prev) => {
        const updated = { ...prev };
        companyUsers.forEach((u) => (updated[String(u.id)] = u));
        return updated;
      });
    }
  }, [companyUsers]);

  const [productCache, setProductCache] = useState<Record<string, any>>({});
  useEffect(() => {
    if (productsData?.length) {
      setProductCache((prev) => {
        const updated = { ...prev };
        productsData.forEach((p) => (updated[String(p.id)] = p));
        return updated;
      });
    }
  }, [productsData]);

  const handleValueMap = <T extends MappableItem>(
    crmItem: T,
    csvValue: string,
    setMapping: React.Dispatch<React.SetStateAction<ValueMapping>>
  ) => {
    if (!crmItem.id) return;

    setMapping((prev) => {
      const newMapping = { ...prev };

      // Remove existing entry for this CSV value (to prevent duplicates)
      Object.keys(newMapping).forEach((key) => {
        if (newMapping[key] === csvValue) delete newMapping[key];
      });

      // Map CRM ID → CSV value
      newMapping[String(crmItem.id)] = csvValue;
      return newMapping;
    });
  };

  const handleRemoveValueMap = <T extends MappableItem>(
    crmItem: T,
    setMapping: React.Dispatch<React.SetStateAction<ValueMapping>>
  ) => {
    if (!crmItem.id) return;

    setMapping((prev) => {
      const newMapping = { ...prev };
      delete newMapping[String(crmItem.id)];
      return newMapping;
    });
  };

  const processCsvForReview = useCallback(() => {
    if (!csvData || !originalCsvHeaders.length) return;

    const emailSet = new Set<string>();
    const mobileSet = new Set<string>();
    const duplicateEmails = new Set<string>();
    const duplicateMobiles = new Set<string>();

    // Helper function to get concatenated value from multiple mapped CSV headers
    const getConcatenatedCsvValue = (
      row: string[],
      crmFieldId: string
    ): string | null => {
      const mappedHeaders = fieldMappings[crmFieldId];
      if (!mappedHeaders || mappedHeaders.length === 0) {
        return null;
      }

      const values = mappedHeaders
        .map((header) => {
          const index = originalCsvHeaders.indexOf(header);

          if (row[index].replace(/"/g, "").split(":").length === 1) {
            return index !== -1 ? row[index]?.trim() : null;
          } else {
            return index !== -1
              ? row[index].replace(/"/g, "").split(":")
              : null;
          }
        })
        .filter(Boolean); // Filter out null, undefined, empty strings

      return values.length > 0 ? values.join(" ").trim() : null;
    };

    const processed: any[] = csvData.slice(1).map((row) => {
      // Get email and mobile for duplicate checking using the new helper
      const email = getConcatenatedCsvValue(row, "email");
      const mobile = getConcatenatedCsvValue(row, "mobileNumber");
      const product = getConcatenatedCsvValue(row, "company_product_id");

      let isDuplicate = false;
      if (email && emailSet.has(email)) {
        duplicateEmails.add(email);
        isDuplicate = true;
      } else if (email) {
        emailSet.add(email);
      }

      if (mobile && mobileSet.has(mobile)) {
        duplicateMobiles.add(mobile);
        isDuplicate = true;
      } else if (mobile) {
        mobileSet.add(mobile);
      }

      const mappedData: {
        [key: string]: string | number | null | undefined | number[] | string[];
      } = {};
      const displayData: {
        [key: string]: string | null | undefined | number[] | string[];
      } = {};

      // Iterate through all CRM fields to process them

      crmLeadFields.forEach((field) => {
        const csvValue = getConcatenatedCsvValue(row, field.id); // Use helper for any field

        if (field.id === "leadStatus" && csvValue) {
          const crmStatus = leadStatus?.find(
            (status) => statusValueMapping[String(status.id)] === csvValue
          );
          mappedData[field.id] = crmStatus ? crmStatus.id : null; // Store ID
          displayData[field.id] = crmStatus ? crmStatus.name : ""; // Display Name or original CSV
        } else if (field.id === "leadSource" && csvValue) {
          const crmSource = leadSource?.find(
            (source) => sourceValueMapping[String(source.id)] === csvValue
          );
          mappedData[field.id] = crmSource ? crmSource.id : null; // Store ID
          displayData[field.id] = crmSource ? crmSource.name : ""; // Display Name or original CSV
        } else if (field.id === "leadOwner" && csvValue) {
          const matchedCrmIdEntry = Object.entries(ownerValueMapping).find(
            ([_, mappedCsv]) => mappedCsv === csvValue
          );
          if (matchedCrmIdEntry) {
            const crmId = matchedCrmIdEntry[0];
            const crmOwner = ownerCache[crmId];
            mappedData[field.id] = crmId;
            displayData[field.id] = crmOwner ? crmOwner.fullname : "null";
          }
        }

        // else if (field.id === "leadOwner" && csvValue) {
        //   const crmOwner = companyUsers?.find(
        //     (owner) => ownerValueMapping[String(owner.id)] === csvValue
        //   );
        //   mappedData[field.id] = crmOwner ? crmOwner.id : null; // Store ID
        //   displayData[field.id] = crmOwner ? crmOwner.fullname : ""; // Display Name or original CSV
        // }
        // Note : product data
        // else if (field.id === "company_product_id") {
        //   const prodArr = product?.split(",").map((item) => item.trim());
        //   const crmProduct = productsData.filter((p) => {
        //     const mappedValue = productDataValueMapping[String(p.id)];
        //     return (
        //       p.id !== undefined &&
        //       p.id !== null &&
        //       prodArr?.includes(mappedValue)
        //     );
        //   });

        //   // 2. Use map() on the filtered array to extract only the 'id' property.
        //   const crmProductIds: number[] = crmProduct.map((p) => p.id as number);

        //   mappedData[field.id] = crmProduct ? crmProductIds : null; // Store ID
        //   displayData[field.id] = crmProduct
        //     ? crmProduct.map((item) => item.name).join(",")
        //     : null; // Display Name or original CSV
        // }
        else if (field.id === "company_product_id" && product) {
          const prodArr = product.split(",").map((item) => item.trim());
          const crmProductIds: number[] = [];
          const crmProductNames: string[] = [];

          prodArr.forEach((csvValue) => {
            const matchedCrmIdEntry = Object.entries(
              productDataValueMapping
            ).find(([, mappedCsv]) => mappedCsv === csvValue);

            if (matchedCrmIdEntry) {
              const crmId = Number(matchedCrmIdEntry[0]);
              const crmProduct = productCache[crmId];

              crmProductIds.push(crmId);
              crmProductNames.push(crmProduct ? crmProduct.name : "null");
            }
          });

          mappedData[field.id] =
            crmProductIds.length > 0 ? crmProductIds : null;
          displayData[field.id] =
            crmProductNames.length > 0 ? crmProductNames.join(",") : null;
        }

        // NOte : lead interest type leadInterestType
        else if (field.id === "lead_interest_id" && csvValue) {
          const crmInterestType = interestTypeData?.find(
            (interest) =>
              InterestTypeValueMapping[String(interest.id)] === csvValue
          );
          mappedData[field.id] = crmInterestType ? crmInterestType.id : null; // Store ID
          displayData[field.id] = crmInterestType ? crmInterestType.name : ""; // Display Name or original CSV
        } else {
          // For other fields (including 'name', 'email', etc.), store the concatenated CSV value
          mappedData[field.id] = csvValue;
          displayData[field.id] = csvValue;
        }
      });

      return {
        originalRow: row,
        mappedData,
        displayData,
        isDuplicate,
        isSelectedForImport: !isDuplicate,
      };
    });

    // Mark duplicates that were found after the initial pass
    const finalProcessed = processed.map((lead) => {
      const email = lead.mappedData.email as string | null; // Cast for type safety
      const mobile = lead.mappedData.mobileNumber as string | null; // Cast for type safety
      return {
        ...lead,
        isDuplicate:
          (email && duplicateEmails.has(email)) ||
          (mobile && duplicateMobiles.has(mobile)),
      };
    });
    //Note: error commented below line
    setProcessedLeads(finalProcessed);
    setShowPreImportReview(true);
  }, [
    csvData,
    originalCsvHeaders,
    fieldMappings,
    statusValueMapping,
    sourceValueMapping,
    ownerValueMapping,
    productDataValueMapping,
    InterestTypeValueMapping,
    productsData,
    interestTypeData,
    leadStatus,
    leadSource,
    companyUsers,
    crmLeadFields,
  ]);
  const handleToggleLeadSelection = (index: number) => {
    setProcessedLeads((prevLeads) =>
      prevLeads.map((lead, i) =>
        i === index
          ? { ...lead, isSelectedForImport: !lead.isSelectedForImport }
          : lead
      )
    );
  };

  //  const handleMarkAll = () => {
  //   setProcessedLeads((prevLeads) =>
  //     prevLeads.map((lead) => ({
  //       ...lead,
  //       isSelectedForImport: true,
  //     }))
  //   );
  // };
  // const handleMarkAll = () => {
  //   setProcessedLeads((prevLeads) => {
  //     // Check if all leads are currently selected
  //     const allSelected = prevLeads.every((lead) => lead.isSelectedForImport);

  //     // Toggle based on current state
  //     return prevLeads.map((lead) => ({
  //       ...lead,
  //       isSelectedForImport: !allSelected, // mark or unmark all
  //     }));
  //   });
  // };

  const [previousSelections, setPreviousSelections] = useState<boolean[]>([]);

  const handleMarkAll = () => {
    setProcessedLeads((prevLeads) => {
      // If no previous state saved → Mark all
      if (previousSelections.length === 0) {
        // Save the current selection state before marking all
        setPreviousSelections(
          prevLeads.map((lead) => lead.isSelectedForImport)
        );

        // Mark all leads (including duplicates)
        return prevLeads.map((lead) => ({
          ...lead,
          isSelectedForImport: true,
        }));
      } else {
        // Restore to previous selection state
        const restoredLeads = prevLeads.map((lead, i) => ({
          ...lead,
          isSelectedForImport: previousSelections[i],
        }));

        // Clear the previous state
        setPreviousSelections([]);
        return restoredLeads;
      }
    });
  };

  function generateUniqueTag() {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    // const timeStamp = new Date().toISOString().slice(0,19);
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const formmatedDate = `${yyyy}${mm}${dd}_${hh}${min}${seconds}`;
    return `TG_${randomString}_${formmatedDate}`;
  }
  // Note : api call for lead import
  const handleSubmitImport = async () => {
    if (!csvFile || !csvData) {
      // setError("No CSV data to import.");
      showMessageSnackbar({
        message: "No CSV data to import.",
        type: "error",
      });
      return;
    }

    const isContactMapped =
      fieldMappings.email?.length > 0 || fieldMappings.mobilenumber?.length > 0;
    // const isNameMapped = fieldMappings.name?.length > 0;
    // Note : if Name is mandotory then add this in below condition  !isNameMapped ||
    if (!isContactMapped) {
      toast.error(
        'Please map "Name" and either of "Email" or "Mobile Number".'
      );
      return;
    }
    setError(null);

    // Filter leads selected for import
    const leadsToImport = processedLeads.filter(
      (lead) => lead.isSelectedForImport
    );

    if (leadsToImport.length === 0) {
      showMessageSnackbar({
        message: "No leads selected for import.",
        type: "error",
      });
      return;
    }

    // This is where you'd construct the actual payload for your backend API
    // based on `leadsToImport` and your `fieldMappings`, `valueMappings`.
    // The `csvFile` itself would be sent as a FormData.

    // Note : this function will return the unique import tag.
    const importTag = generateUniqueTag();
    // Note : This is the old payload working but the logic is changed.
    // const payload = {
    //   // fieldMappings,
    //   // statusValueMapping,
    //   // sourceValueMapping,
    //   // ownerValueMapping,
    //   leadsToImport: leadsToImport.map((lead) => ({
    //     // originalRow: lead.originalRow,
    //     mappedData: {
    //       ...lead.mappedData,
    //       createdby: loginStatus.id,
    //       company_id: loginStatus.companyId,
    //       import_tag: importTag,
    //     },
    //   })), // Sending only necessary data
    // };

    // const csvFileFormatted = convertPayloadToCsv(payload);
    setIsLoadingSpinnerAfterSubmission(true);
    const rowsData = leadsToImport.map((lead) => ({
      ...lead.mappedData,
      createdby: loginStatus.id,
      company_id: loginStatus.companyId,
      import_tag: importTag,
    }));
    const leadImportCsvFile = convertToCsvFile(rowsData, "importLeadFile.csv");
    const reader = new FileReader();
    console.log("this is the row data");

    console.log(rowsData);

    reader.onload = (e) => {
      console.log(e.target?.result);
    };

    console.log("this is the csv file data ");
    reader.readAsText(leadImportCsvFile);
    // console.log("Submitting payload:", payload);
    try {
      // const formData = new FormData();
      // formData.append("csvFile", csvFile);
      // formData.append("mappings", JSON.stringify(payload)); // Send the structured payload
      // formData.append("mappings",payload );
      // const response = await axios.post(POST_API.LEAD_IMPORT_VIA_CSV, payload, {
      //   withCredentials: true,
      // });

      // new code comment if needed above response os working but old code
      const formData = new FormData();
      formData.append("file", leadImportCsvFile, leadImportCsvFile.name);
      formData.append("company_id", loginStatus.companyId.toString());
      formData.append("createdby", loginStatus.id.toString());
      const response = await axios.post(
        POST_API.UPLOAD_CSV_FOR_IMPORT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // alert("Import simulated successfully! Check console for payload.");

      if (response.status === STATUS_CODE.OK) {
        setIsLoadingSpinnerAfterSubmission(false);
        const data: LeadImportResponse = response.data;
        setLeadImportResponse(data);
        setShowLeadImportResultPopUp(true);
        // setTimeout(() => {
        //   handleFileChange({ target: { files: null } } as any); // Reset form
        // }, 1000);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handleSubmitImport,
        });

        if (refreshTokenStatus) {
          handleSubmitImport();
        }
      } else {
        showMessageSnackbar({
          message:
            error.message || "An unexpected error occurred during import.",
          type: "error",
        });
      }
    } finally {
      setIsLoadingSpinnerAfterSubmission(false);
      handleFileChange({ target: { files: null } } as any);
    }
  };

  // --- RENDER LOGIC ---
  const showStatusMapping =
    fieldMappings.leadStatus?.length > 0 && csvUniqueStatuses.length > 0;
  const showSourceMapping =
    fieldMappings.leadSource?.length > 0 && csvUniqueSources.length > 0;
  const showOwnerMapping =
    fieldMappings.leadOwner?.length > 0 && csvUniqueOwners.length > 0;

  // lead owner changes
  useEffect(() => {
    console.log("🧭 Current owner mappings:", ownerValueMapping);
  }, [ownerValueMapping]);
  useEffect(() => {
    console.log("Updated productDataValueMapping:", productDataValueMapping);
  }, [productDataValueMapping]);

  // NOte : product data
  const showProductDataMapping =
    fieldMappings.company_product_id?.length > 0 &&
    csvUniqueProductData.length > 0;
  const showLeadInterestTypeMapping =
    fieldMappings.lead_interest_id?.length > 0 &&
    csvUniqueInterestType.length > 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-full   overflow-auto flex flex-col   space-y-2">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-2 border-b-2 bg-white rounded-lg z-10">
          {csvImportButtonClicked && (
            <button
              className="flex items-center gap-2 table-header-custom hover:text-blue-600 transition-colors"
              onClick={resetState}
            >
              <ArrowLeft size={16} />
              <span>Back to File Selection / Imported Tags</span>
            </button>
          )}

          {!csvImportButtonClicked && (
            <div className="flex items-center justify-between w-full">
              <h2 className="table-header-custom hover:text-blue-500   px-1 ">
                Import leads via CSV file
                {/* Import leads via CSV */}
              </h2>

              {!isLoadingLeadInterestData &&
              !isLoadingLeadSourceAndStatusData ? (
                <>
                  <label
                    htmlFor="csv-upload"
                    className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white  sm:text-xs md:text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer shadow-sm"
                  >
                    <LucideFolderInput className="w-5 h-5" />
                    <span>{csvFile ? "Change File" : "Browse CSV"}</span>
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <div className="flex items-center justify-center w-24 ">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          )}
        </div>

        {isParsing && (
          <div className="p-3 input-label-custom bg-blue-100 rounded-md">
            Parsing CSV...
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-100 input-label-inactive rounded-md ">
            {error}
          </div>
        )}

        {/* Preview Section */}
        {csvData && (
          <div className="flex-shrink-0 p-2 border rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="table-header-custom">Preview (First 5 Rows)</h4>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="input-label-custom-blue text-blue-600 hover:underline"
              >
                {showPreview ? "Hide" : "Show"}
              </button>
            </div>
            {showPreview && (
              <div className="w-full overflow-x-auto border rounded-md">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {originalCsvHeaders.map((h, i) => (
                        <th
                          key={i}
                          className="px-3 py-2 text-left table-header-custom"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(1, 6).map((row, i) => (
                      <tr key={i} className="border-t table-data-custom">
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="caption-custom">
              Total records in csv file : {csvData.length - 1}
            </div>
          </div>
        )}

        {/* Main Mapping UI */}
        {!showPreImportReview && csvData && (
          <>
            <div className="flex-grow flex flex-col lg:flex-row w-full gap-6">
              <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col gap-4">
                <div className="border rounded-lg p-3 bg-white shadow-sm">
                  <h3 className=" flex items-center gap-1 table-header-custom mb-3">
                    <span>1. CSV Columns</span>
                    <span
                      className="cursor-pointer"
                      title="Available Columns From Given CSV File."
                    >
                      <Info size={12} className="" />
                    </span>
                  </h3>
                  {/* <ul className="space-y-1 max-h-96 overflow-y-auto"> */}
                  <ul className="grid max-h-96 overflow-y-auto grid-col-1 sm:grid-cols-2 gap-2">
                    {originalCsvHeaders.map((h, i) => (
                      <DraggableCsvColumn key={i} header={h} />
                    ))}
                  </ul>
                </div>
              </div>
              <div className="w-full  lg:w-7/12 xl:w-8/12 flex flex-col">
                <div className="border rounded-lg p-4 bg-white flex-grow shadow-sm">
                  <h3 className=" flex items-center gap-2 table-header-custom mb-4">
                    <span>2. Map Columns to CRM Fields </span>
                    <span
                      className="cursor-pointer"
                      title="You can add multiple columns for single crn fields for concatination. Eg: for Full Name : if in CSV File available data is first name and last name then you can add both in Full Name field. Data will be concatinated"
                    >
                      <Info size={12} />
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4  text-xs">
                    {crmLeadFields.map((field) => (
                      <DroppableCrmField
                        key={field.id}
                        field={field}
                        mappedHeaders={fieldMappings[field.id] || []}
                        onDrop={handleDropField}
                        onRemoveMapping={handleRemoveFieldMapping}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 m-4 gap-6 mt-6">
              {showStatusMapping && (
                <GenericValueMappingCard
                  ref={leadStatusMappingRef}
                  title=" Map CSV Status"
                  csvValues={csvUniqueStatuses}
                  crmData={leadStatus}
                  mapping={statusValueMapping}
                  onDrop={(c, v) =>
                    handleValueMap(
                      c,
                      v,
                      // statusValueMapping,
                      setStatusValueMapping
                    )
                  }
                  onRemove={(c) =>
                    handleRemoveValueMap(
                      c,
                      // statusValueMapping,
                      setStatusValueMapping
                    )
                  }
                  itemType={ItemTypes.CSV_STATUS_VALUE}
                />
              )}
              {showSourceMapping && (
                <GenericValueMappingCard
                  ref={leadSourceMappingRef}
                  title=" Map CSV Sources"
                  csvValues={csvUniqueSources}
                  crmData={leadSource}
                  mapping={sourceValueMapping}
                  onDrop={(c, v) =>
                    handleValueMap(
                      c,
                      v,
                      // sourceValueMapping,
                      setSourceValueMapping
                    )
                  }
                  onRemove={(c) =>
                    handleRemoveValueMap(
                      c,
                      // sourceValueMapping,
                      setSourceValueMapping
                    )
                  }
                  itemType={ItemTypes.CSV_SOURCE_VALUE}
                />
              )}
              {showOwnerMapping && (
                <GenericValueMappingCard
                  ref={leadOwnerMappingRef}
                  title="Map Lead Owners"
                  csvValues={csvUniqueOwners}
                  crmData={companyUsers}
                  mapping={ownerValueMapping}
                  onDrop={(c, v) =>
                    handleValueMap(
                      c,
                      v,
                      // ownerValueMapping,
                      setOwnerValueMapping
                    )
                  }
                  onRemove={(c) =>
                    handleRemoveValueMap(
                      c,
                      // ownerValueMapping,
                      setOwnerValueMapping
                    )
                  }
                  itemType={ItemTypes.CSV_OWNER_VALUE}
                  onSearch={fetchCompanyUsers} // This is already good
                  searchPlaceholder="Search user..."
                  totalCrmItems={totalCompanyUsers}
                  currentPage={companyUsersCurrentPage}
                  itemsPerPage={25}
                  onPageChange={(newPage) => {
                    setCompanyUsersCurrentPage(newPage);
                    fetchCompanyUsers("", newPage * 25, 25);
                  }}
                />
              )}
              {/* for product mapping */}

              {showProductDataMapping && (
                <GenericValueMappingCard
                  ref={productDataMappingRef}
                  title="Map Product assigned to lead"
                  csvValues={csvUniqueProductData}
                  crmData={productsData}
                  mapping={productDataValueMapping}
                  onDrop={(c, v) =>
                    handleValueMap(c, v, setProductDataValueMapping)
                  }
                  onRemove={(c) =>
                    handleRemoveValueMap(c, setProductDataValueMapping)
                  }
                  itemType={ItemTypes.CSV_PRODUCT_VALUE}
                  onSearch={fetchCompanyProducts}
                  searchPlaceholder="Search product..."
                  totalCrmItems={totalProductData}
                  currentPage={productDataCurrentPage}
                  itemsPerPage={25}
                  onPageChange={(newPage) => {
                    setProductDataCurrentPage(newPage);
                    fetchCompanyProducts("", newPage * 25, 25);
                  }}
                />

                // <GenericValueMappingCard
                //   ref={productDataMappingRef}
                //   title="Map Product assigned to lead"
                //   csvValues={csvUniqueProductData}
                //   crmData={productsData}
                //   mapping={productDataValueMapping}
                //   onDrop={(c, v) =>
                //     handleValueMap(
                //       c,
                //       v,
                //       // productDataValueMapping,
                //       setProductDataValueMapping
                //     )
                //   }
                //   onRemove={(c) =>
                //     handleRemoveValueMap(
                //       c,
                //       // productDataValueMapping,
                //       setProductDataValueMapping
                //     )
                //   }
                //   itemType={ItemTypes.CSV_PRODUCT_VALUE}
                //   onSearch={fetchCompanyProducts} // This is already good
                //   searchPlaceholder="Search product..."
                //   totalCrmItems={totalProductData}
                //   currentPage={productDataCurrentPage}
                //   itemsPerPage={10}
                //   onPageChange={(newPage) => {
                //     setProductDataCurrentPage(newPage);
                //     fetchCompanyProducts("", newPage * 10, 10);
                //   }}
                // />
              )}
              {/* For lead interest type data  */}
              {showLeadInterestTypeMapping && (
                <GenericValueMappingCard
                  ref={leadInterestTypeMappingRef}
                  title=" Map Interest Type"
                  csvValues={csvUniqueInterestType}
                  crmData={interestTypeData}
                  mapping={InterestTypeValueMapping}
                  onDrop={(c, v) =>
                    handleValueMap(
                      c,
                      v,
                      // InterestTypeValueMapping,
                      setInterestTypeValueMapping
                    )
                  }
                  onRemove={(c) =>
                    handleRemoveValueMap(
                      c,
                      // InterestTypeValueMapping,
                      setInterestTypeValueMapping
                    )
                  }
                  itemType={ItemTypes.CSV_INTEREST_VALUE}
                />
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <div>
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    processCsvForReview();
                  }} // Changed to trigger review first
                  disabled={isParsing || !csvFile}
                  // className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-sm disabled:bg-gray-400"
                >
                  Review and Finalize Import
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Pre-Import Review Section */}
        {showPreImportReview && (
          <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="section-header-custom mb-4">
              6. Review Leads Before Import
            </h3>
            <p className="input-label-custom mb-4">
              Review the mapped data below. Leads highlighted in{" "}
              <span className="font-bold text-red-600">red</span> indicate
              potential duplicates (based on Email or Mobile Number). Check the
              box for each record you wish to import.
            </p>
            <div className="bg-pink-00 w-fit flex items-center justify-start pl-2">
              <Button
                // className="bg-blue-500 p-1 rounded-md"
                onClick={handleMarkAll}
              >
                {previousSelections.length === 0 ? "Mark duplicate leads." : "Unmark duplicate leads."}
              </Button>
            </div>
            <div className="w-full overflow-x-auto overflow-y-auto max-h-96  border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6  text-left table-header-custom uppercase tracking-wider"
                    >
                      Import
                    </th>
                    {crmLeadFields.map((field) => (
                      <th
                        key={field.id}
                        scope="col"
                        className="px-6  text-left table-header-custom uppercase tracking-wider"
                      >
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processedLeads.map((lead, index) => (
                    <tr
                      key={index}
                      className={
                        lead.isDuplicate ? "bg-red-100" : "bg-green-50" // Apply red background for duplicates, green for unique
                      }
                    >
                      <td className="px-6  whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={lead.isSelectedForImport}
                          onChange={() => handleToggleLeadSelection(index)}
                          className="focus:ring-blue-500 h-3 w-3 text-blue-600 border-gray-300 rounded"
                        />
                      </td>
                      {crmLeadFields.map((field) => (
                        <td
                          key={field.id}
                          className="px-6 py-1 whitespace-nowrap table-data-custom"
                        >
                          {lead.displayData[field.id]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-between">
              <div>
                <Button
                  type="button"
                  onClick={() => setShowPreImportReview(false)}
                  // className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-md shadow-sm"
                >
                  Back to Mapping
                </Button>
              </div>

              <div>
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmitImport();
                  }}
                  disabled={
                    isParsing ||
                    !csvFile ||
                    processedLeads.filter((l) => l.isSelectedForImport)
                      .length === 0
                  }
                  // className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow-sm disabled:bg-gray-400"
                >
                  Confirm and Import Selected Leads
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isLoadingSpinnerAfterSubmission && (
        <LoadingPopUpAnimation
          show={isLoadingSpinnerAfterSubmission}
          text="Loading please wait..."
        />
      )}
      {showLeadImportResultPopUp && (
        <LeadImportResultPopUp
          data={LeadImportResponse}
          onClose={() => {
            setShowLeadImportResultPopUp(false);
            handleFileChange({ target: { files: null } } as any);
          }}
        />
      )}
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </DndProvider>
  );
};

export default LeadImportCsv;
