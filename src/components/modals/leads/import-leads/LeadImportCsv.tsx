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
  FileUp,
  XCircle,
  ArrowRight,
  Search,
  Info,
  ArrowLeft,
} from "lucide-react";
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
      className={`bg-gray-100 text-gray-800 px-3 py-1.5 rounded text-sm border border-gray-200 shadow-sm cursor-grab ${
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
    <div key={field.id} className="flex items-start gap-1">
      <label
        htmlFor={`map-${field.id}`}
        className="w-1/3 text-sm font-medium text-gray-700 pt-2"
      >
        {field.label} :
        {field.required && <span className="text-red-500 ml-1">*</span>}
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
              className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium"
            >
              {header}
              <XCircle
                className="ml-1 w-4 h-4 cursor-pointer"
                onClick={() => onRemoveMapping(field.id, header)}
              />
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm italic">Drag column here</span>
        )}
      </div>
    </div>
    // <div key={field.id} className="grid grid-cols-2 gap-2 items-start ">
    //     <label
    //       htmlFor={`map-${field.id}`}
    //       className="text-sm font-medium text-gray-700 pt-2"
    //     >
    //       {field.label}
    //       {field.required && <span className="text-red-500 ml-1">*</span>}
    //     </label>

    //     <div
    //       ref={drop}
    //       className={`min-h-[40px] border rounded-md p-2 flex flex-wrap gap-2 items-center transition-all
    //   ${
    //     isOver && canDrop
    //       ? "border-blue-500 bg-blue-50 ring-2"
    //       : "border-gray-300 bg-gray-50"
    //   }
    //   ${canDrop ? "border-dashed" : ""}`}
    //     >
    //       {mappedHeaders.length > 0 ? (
    //         mappedHeaders.map((header) => (
    //           <span
    //             key={header}
    //             className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium"
    //           >
    //             {header}
    //             <XCircle
    //               className="ml-1 w-4 h-4 cursor-pointer"
    //               onClick={() => onRemoveMapping(field.id, header)}
    //             />
    //           </span>
    //         ))
    //       ) : (
    //         <span className="text-gray-500 text-sm italic">
    //           Drag column here
    //         </span>
    //       )}
    //     </div>
    //   </div>
  );
};

// Generic Value Mapping Card Component
interface ValueMappingCardProps<T extends MappableItem> {
  title: string;
  csvValues: string[];
  crmData: T[] | PostDataTypeForLeadSourceAndStatusAndStates[] | null;
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
      itemsPerPage = 40,
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
              <div className="flex justify-between items-center w-full text-sm font-medium text-green-800">
                <span>{mappedValue}</span>
                <XCircle
                  className="w-4 h-4 text-red-500 cursor-pointer"
                  onClick={() => onRemove(crmItem)}
                />
              </div>
            ) : (
              <span className="text-gray-400 text-sm italic">Drop here</span>
            )}
          </div>
          <ArrowRight className="text-gray-400 flex-shrink-0" />
          <div className="flex-1 p-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium h-10 flex items-center justify-center">
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
        <h3 className="text-md font-semibold text-gray-800 mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-center mb-2 text-gray-600">
              Your CSV Values (Drag)
            </h4>
            <div className="space-y-2 p-2 bg-white rounded-md border min-h-[100px] max-h-60 overflow-y-auto">
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
            <h4 className="font-medium text-sm text-center mb-2 text-gray-600">
              To CRM Values (Drop)
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
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
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => handleInternalPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
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

  // Refs for auto-scrolling
  const leadStatusMappingRef = useRef<HTMLDivElement>(null);
  const leadSourceMappingRef = useRef<HTMLDivElement>(null);
  const leadOwnerMappingRef = useRef<HTMLDivElement>(null);

  // Mappings
  const [fieldMappings, setFieldMappings] = useState<FieldMapping>({});
  const [statusValueMapping, setStatusValueMapping] = useState<ValueMapping>(
    {}
  );
  const [sourceValueMapping, setSourceValueMapping] = useState<ValueMapping>(
    {}
  );
  const [ownerValueMapping, setOwnerValueMapping] = useState<ValueMapping>({});

  // Unique values from CSV
  const [csvUniqueStatuses, setCsvUniqueStatuses] = useState<string[]>([]);
  const [csvUniqueSources, setCsvUniqueSources] = useState<string[]>([]);
  const [csvUniqueOwners, setCsvUniqueOwners] = useState<string[]>([]);

  // Data from API
  const [leadStatus, setLeadStatus] = useState<
    PostDataTypeForLeadSourceAndStatusAndStates[] | null
  >(null);
  const [leadSource, setLeadSource] = useState<
    PostDataTypeForLeadSourceAndStatusAndStates[] | null
  >(null);
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
  const [totalCompanyUsers, setTotalCompanyUsers] = useState<number>(0); // Total count for pagination
  const [companyUsersCurrentPage, setCompanyUsersCurrentPage] =
    useState<number>(0);
  const [csvImportButtonClicked, setCsvImportButtonClicked] =
    useState<boolean>(false);
  const [isLoadingSpinnerAfterSubmission, setIsLoadingSpinnerAfterSubmission] =
    useState<boolean>(false);
  const [showLeadImportResultPopUp, setShowLeadImportResultPopUp] =
    useState<boolean>(false);
  const [LeadImportReponse, setLeadImportResponse] =
    useState<LeadImportResponse>({
      message: "",
      status: false,
    });

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
      { id: "name", label: "Full Name", required: false },
      { id: "email", label: "Email", required: false },
      { id: "mobilenumber", label: "Mobile Number", required: false },

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
    await callApi(POST_API.GET_LEAD_STATUS, setLeadStatus, fetchApiData);
    await callApi(POST_API.GET_LEAD_SOURCE, setLeadSource, fetchApiData);
  }, []);

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
    fetchCompanyUsers("", 0, userPreference.rowsInGrid || 40); // Initial fetch
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

  const extractUniqueValues = (
    fieldId: "leadStatus" | "leadSource" | "leadOwner",
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
    setOwnerValueMapping({});
    setCsvUniqueStatuses([]);
    setCsvUniqueSources([]);
    setCsvUniqueOwners([]);
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
    setOwnerValueMapping({});
    setCsvUniqueStatuses([]);
    setCsvUniqueSources([]);
    setCsvUniqueOwners([]);
    setProcessedLeads([]); // Clear processed leads on new file
    setShowPreImportReview(false); // Hide review on new file
  };
  const readCsv = (file: File) => {
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content
          .split(/[\r\n]+/)
          .map((l) => l.trim())
          .filter(Boolean);
        if (lines.length < 1) throw new Error("CSV file is empty.");
        const parsedData = lines.map((line) =>
          line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))
        );
        setCsvData(parsedData);
        setOriginalCsvHeaders(parsedData[0]);
        // setError(null);
        handleCloseSnackbar();
      } catch (err: any) {
        showMessageSnackbar({
          message: err.message || "Failed to parse CSV.",
          type: "error",
        });
        // setError(err.message || "Failed to parse CSV.");
      } finally {
        setIsParsing(false);
      }
    };
    reader.readAsText(file);
  };

  // const handleDropField = useCallback(
  //   (crmFieldId: string, csvHeader: string) => {
  //     const singleMapFields = ["leadStatus", "leadSource", "leadOwner"];
  //     if (singleMapFields.includes(crmFieldId)) {
  //       setFieldMappings((prev) => ({ ...prev, [crmFieldId]: [csvHeader] }));
  //     } else {
  //       setFieldMappings((prev) => ({
  //         ...prev,
  //         [crmFieldId]: [...(prev[crmFieldId] || []), csvHeader],
  //       }));
  //     }
  //   },
  //   []
  // );

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
          }, 100); // Small delay, adjust if needed

          return { ...prev, [crmFieldId]: newMappings };
        }
        return prev; // If header already mapped, return previous state
      });
    },
    [leadStatusMappingRef, leadSourceMappingRef, leadOwnerMappingRef] // Add refs to dependency array
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

  const handleValueMap = <T extends MappableItem>(
    crmItem: T,
    csvValue: string,
    currentMapping: ValueMapping,
    setMapping: (m: ValueMapping) => void
  ) => {
    if (!crmItem.id) return;
    const newMapping = { ...currentMapping };
    Object.keys(newMapping).forEach((key) => {
      if (newMapping[key] === csvValue) delete newMapping[key];
    });
    newMapping[String(crmItem.id)] = csvValue;
    setMapping(newMapping);
  };

  const handleRemoveValueMap = <T extends MappableItem>(
    crmItem: T,
    currentMapping: ValueMapping,
    setMapping: (m: ValueMapping) => void
  ) => {
    if (!crmItem.id) return;
    const newMapping = { ...currentMapping };
    delete newMapping[String(crmItem.id)];
    setMapping(newMapping);
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
          return index !== -1 ? row[index]?.trim() : null;
        })
        .filter(Boolean); // Filter out null, undefined, empty strings

      return values.length > 0 ? values.join(" ").trim() : null;
    };

    // Note : NEED TO FIX THIS ERROR ProcessedLeadData
    // note : error do changes , type changed to any
    const processed: any[] = csvData.slice(1).map((row) => {
      // Get email and mobile for duplicate checking using the new helper
      const email = getConcatenatedCsvValue(row, "email");
      const mobile = getConcatenatedCsvValue(row, "mobileNumber");

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

      const mappedData: { [key: string]: string | number | null } = {};
      const displayData: { [key: string]: string | null | undefined } = {};

      // Iterate through all CRM fields to process them
      crmLeadFields.forEach((field) => {
        const csvValue = getConcatenatedCsvValue(row, field.id); // Use helper for any field

        if (field.id === "leadStatus" && csvValue) {
          const crmStatus = leadStatus?.find(
            (status) => statusValueMapping[String(status.id)] === csvValue
          );
          mappedData[field.id] = crmStatus ? crmStatus.id : null; // Store ID
          displayData[field.id] = crmStatus ? crmStatus.name : csvValue; // Display Name or original CSV
        } else if (field.id === "leadSource" && csvValue) {
          const crmSource = leadSource?.find(
            (source) => sourceValueMapping[String(source.id)] === csvValue
          );
          mappedData[field.id] = crmSource ? crmSource.id : null; // Store ID
          displayData[field.id] = crmSource ? crmSource.name : csvValue; // Display Name or original CSV
        } else if (field.id === "leadOwner" && csvValue) {
          const crmOwner = companyUsers?.find(
            (owner) => ownerValueMapping[String(owner.id)] === csvValue
          );
          mappedData[field.id] = crmOwner ? crmOwner.id : null; // Store ID
          displayData[field.id] = crmOwner ? crmOwner.fullname : csvValue; // Display Name or original CSV
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
      // setError('Please map "Name" and either "Email" or "Mobile Number".');
      showMessageSnackbar({
        message: 'Please map "Name" and either "Email" or "Mobile Number.',
        type: "error",
      });
      return;
    }
    setError(null);

    // Filter leads selected for import
    const leadsToImport = processedLeads.filter(
      (lead) => lead.isSelectedForImport
    );

    if (leadsToImport.length === 0) {
      // setError("No leads selected for import.");
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
    const payload = {
      // fieldMappings,
      // statusValueMapping,
      // sourceValueMapping,
      // ownerValueMapping,
      leadsToImport: leadsToImport.map((lead) => ({
        // originalRow: lead.originalRow,
        mappedData: {
          ...lead.mappedData,
          createdby: loginStatus.id,
          company_id: loginStatus.companyId,
          import_tag: importTag,
        },
      })), // Sending only necessary data
    };
    console.log("Submitting payload:", payload);

    try {
      // const formData = new FormData();
      // formData.append("csvFile", csvFile);
      // formData.append("mappings", JSON.stringify(payload)); // Send the structured payload
      // formData.append("mappings",payload );
      const response = await axios.post(POST_API.LEAD_IMPORT_VIA_CSV, payload, {
        withCredentials: true,
      });

      // alert("Import simulated successfully! Check console for payload.");
      setIsLoadingSpinnerAfterSubmission(true);
      if (response.status === STATUS_CODE.OK) {
        setIsLoadingSpinnerAfterSubmission(false);
        // console.log("API Response:", response.data); // Log actual API response
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-full bg-gray-100 rounded-md overflow-auto flex flex-col p-1  space-y-2">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-1 border-b-2 bg-white rounded-lg z-10">
          {csvImportButtonClicked && (
            <button className="flex text-xs gap-3 items-center text-gray-800" onClick={resetState}>
              <ArrowLeft size={16}/> <span>Go back and Choose another file.</span>
            </button>
          )}

          {!csvImportButtonClicked && (
            <>
              <h2 className="text-base border-b font-semibold text-gray-800">
                Import leads from csv file.
              </h2>
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer shadow-sm"
              >
                <FileUp className="w-5 h-5" />
                <span>{csvFile ? "Change File" : "Select CSV"}</span>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>

        {isParsing && (
          <div className="p-3 bg-blue-100 rounded-md">Parsing CSV...</div>
        )}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md font-bold">
            {error}
          </div>
        )}

        {/* Preview Section */}
        {csvData && (
          <div className="flex-shrink-0 p-2 border rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-semibold text-gray-700">
                Preview (First 5 Rows)
              </h4>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-blue-600 hover:underline"
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
                        <th key={i} className="px-3 py-2 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(1, 6).map((row, i) => (
                      <tr key={i} className="border-t">
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
            <div className="text-xs text-gray-500">
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
                  <h3 className=" flex items-center gap-1 text-md font-semibold text-gray-800 mb-3">
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
                  <h3 className=" flex items-center gap-2 text-md font-semibold text-gray-800 mb-4">
                    <span>2. Map Columns to CRM Fields </span>
                    <span
                      className="cursor-pointer"
                      title="You can add multiple columns for single crn fields for concatination. Eg: for Full Name : if in CSV File available data is first name and last name then you can add both in Full Name field. Data will be concatinated"
                    >
                      <Info size={12} />
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      statusValueMapping,
                      setStatusValueMapping
                    )
                  }
                  onRemove={(c) =>
                    handleRemoveValueMap(
                      c,
                      statusValueMapping,
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
                      sourceValueMapping,
                      setSourceValueMapping
                    )
                  }
                  onRemove={(c) =>
                    handleRemoveValueMap(
                      c,
                      sourceValueMapping,
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
                      ownerValueMapping,
                      setOwnerValueMapping
                    )
                  }
                  onRemove={(c) =>
                    handleRemoveValueMap(
                      c,
                      ownerValueMapping,
                      setOwnerValueMapping
                    )
                  }
                  itemType={ItemTypes.CSV_OWNER_VALUE}
                  onSearch={fetchCompanyUsers} // This is already good
                  searchPlaceholder="Search users by Name, Email ,Mobile number."
                  totalCrmItems={totalCompanyUsers}
                  currentPage={companyUsersCurrentPage}
                  itemsPerPage={userPreference.rowsInGrid || 40}
                  onPageChange={(newPage) => {
                    setCompanyUsersCurrentPage(newPage);
                    fetchCompanyUsers(
                      "",
                      newPage * (userPreference.rowsInGrid || 40),
                      userPreference.rowsInGrid || 40
                    );
                  }}
                />
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={processCsvForReview} // Changed to trigger review first
                disabled={isParsing || !csvFile}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-sm disabled:bg-gray-400"
              >
                Review and Finalize Import
              </button>
            </div>
          </>
        )}

        {/* Pre-Import Review Section */}
        {showPreImportReview && (
          <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              6. Review Leads Before Import
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Review the mapped data below. Leads highlighted in{" "}
              <span className="font-bold text-red-600">red</span> indicate
              potential duplicates (based on Email or Mobile Number). Check the
              box for each record you wish to import.
            </p>
            <div className="w-full overflow-x-auto border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Import
                    </th>
                    {crmLeadFields.map((field) => (
                      <th
                        key={field.id}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={lead.isSelectedForImport}
                          onChange={() => handleToggleLeadSelection(index)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </td>
                      {crmLeadFields.map((field) => (
                        <td
                          key={field.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {lead.mappedData[field.id]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setShowPreImportReview(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-md shadow-sm"
              >
                Back to Mapping
              </button>
              <button
                onClick={handleSubmitImport}
                disabled={
                  isParsing ||
                  !csvFile ||
                  processedLeads.filter((l) => l.isSelectedForImport).length ===
                    0
                }
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow-sm disabled:bg-gray-400"
              >
                Confirm and Import Selected Leads
              </button>
            </div>
          </div>
        )}
      </div>
      {isLoadingSpinnerAfterSubmission && <LoadingSpinner />}
      {showLeadImportResultPopUp && (
        <LeadImportResultPopUp
          data={LeadImportReponse}
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
