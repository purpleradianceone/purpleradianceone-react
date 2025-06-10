import { useState, ChangeEvent, useMemo, useEffect, useCallback } from "react";
import { FileUp, XCircle, ArrowRight } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import PostDataTypeForLeadSourceAndStatusAndStates from "../../../../@types/lead-management/PostDataTypeForLeadSourceAndStatusAndStates";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import ROUTES_URL from "../../../../constants/Routes";
import { useNavigate } from "react-router-dom";
import { DialogueBox } from "../../../dialogue-box/Dialogue";

// --- TYPES AND INTERFACES ---

type CsvData = string[][];

interface CrmField {
  id: string;
  label: string;
  required: boolean;
}

// Maps CRM Field ID to an array of CSV column headers
interface FieldMapping {
  [crmFieldId: string]: string[];
}

// Maps a CRM ID to a specific CSV value (e.g., { "status-id-1": "New Lead" })
interface ValueMapping {
  [crmId: string]: string;
}

const ItemTypes = {
  CSV_COLUMN: "csv_column",
  CSV_STATUS_VALUE: "csv_status_value",
  CSV_SOURCE_VALUE: "csv_source_value",
};

interface DragItem {
  name: string;
  type: string;
}

// --- DND-ENABLED COMPONENTS ---

// Draggable CSV Column (for top-level field mapping)
const DraggableCsvColumn: React.FC<{ header: string }> = ({ header }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CSV_COLUMN,
    item: { name: header },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <li
      ref={drag}
      className={`bg-gray-100 text-gray-800 px-3 py-1.5 rounded text-sm border border-gray-200 shadow-sm cursor-grab ${
        isDragging ? "opacity-50 border-blue-500" : ""
      }`}
    >
      {header}
    </li>
  );
};

// Draggable CSV Value (for status/source value mapping)
const DraggableCsvValue: React.FC<{ value: string; type: string }> = ({
  value,
  type,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { name: value },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
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

// Droppable CRM Field (for top-level field mapping)
interface DroppableCrmFieldProps {
  field: CrmField;
  mappedHeaders: string[];
  onDrop: (crmFieldId: string, csvHeader: string) => void;
  onRemoveMapping: (crmFieldId: string, csvHeader: string) => void;
}

const DroppableCrmField: React.FC<DroppableCrmFieldProps> = ({
  field,
  mappedHeaders,
  onDrop,
  onRemoveMapping,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.CSV_COLUMN,
    drop: (item: DragItem) => {
      if (!mappedHeaders.includes(item.name)) {
        onDrop(field.id, item.name);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
    <div key={field.id} className="flex items-start gap-4">
      <label
        htmlFor={`map-${field.id}`}
        className="w-1/3 text-sm font-medium text-gray-700 pt-2"
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        ref={drop}
        className={`w-2/3 min-h-[40px] border rounded-md p-2 flex flex-wrap gap-2 items-center transition-all ${
          isActive
            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
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
                className="ml-1 w-4 h-4 cursor-pointer text-blue-600 hover:text-blue-800"
                onClick={() => onRemoveMapping(field.id, header)}
              />
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm italic">
            Drag CSV column here
          </span>
        )}
      </div>
    </div>
  );
};

// Main Value Mapping Card Component
interface ValueMappingCardProps {
  title: string;
  csvValues: string[];
  crmData: PostDataTypeForLeadSourceAndStatusAndStates[] | null;
  mapping: ValueMapping;
  onDrop: (crmItem: PostDataTypeForLeadSourceAndStatusAndStates, csvValue: string) => void;
  onRemove: (crmItem: PostDataTypeForLeadSourceAndStatusAndStates) => void;
  itemType: string;
}

const ValueMappingCard: React.FC<ValueMappingCardProps> = ({
  title,
  csvValues,
  crmData,
  mapping,
  onDrop,
  onRemove,
  itemType,
}) => {
  const crmValues = crmData || [];
  const mappedCsvValues = Object.values(mapping);
  const unmappedCsvValues = csvValues.filter(
    (v) => !mappedCsvValues.includes(v)
  );

  const getMappedCsvValue = (crmId: number | null) =>
    crmId ? mapping[crmId] : undefined;

  const DroppableTarget: React.FC<{ crmItem: PostDataTypeForLeadSourceAndStatusAndStates }> = ({ crmItem }) => {
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

    // Note : Changes done here
    const mappedValue = getMappedCsvValue(crmItem.id);

    return (
      <div className="flex items-center gap-2">
        <div
          ref={drop}
          className={`flex-1 p-2 border rounded-md transition-all text-center h-10 flex items-center justify-center ${
            isOver && canDrop
              ? "border-green-500 bg-green-50 ring-2 ring-green-300"
              : "border-gray-300"
          } ${canDrop ? "border-dashed" : ""} ${
            mappedValue ? "bg-green-100 border-green-300" : "bg-white"
          }`}
        >
          {mappedValue ? (
            <div className="flex justify-between items-center w-full text-sm font-medium text-green-800">
              <span>{mappedValue}</span>
              <XCircle
                className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => onRemove(crmItem)}
              />
            </div>
          ) : (
            <span className="text-gray-400 text-sm italic">Drop here</span>
          )}
        </div>
        <ArrowRight className="text-gray-400 flex-shrink-0" />
        <div className="flex-1 p-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium h-10 flex items-center justify-center">
          {crmItem.name}
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-3 bg-gray-50/80 shadow-sm">
      <h3 className="text-md font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-sm text-center mb-2 text-gray-600">
            Your CSV Values (Drag these)
          </h4>
          <div className="space-y-2 p-2 bg-white rounded-md border min-h-[100px] max-h-60 overflow-y-auto">
            {unmappedCsvValues.length > 0 ? (
              unmappedCsvValues.map((s) => (
                <DraggableCsvValue key={s} value={s} type={itemType} />
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm p-4">
                All values mapped!
              </p>
            )}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-sm text-center mb-2 text-gray-600">
            To CRM Values (Drop on these)
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {crmValues.map((item) => (
              item.id && <DroppableTarget key={item.id} crmItem={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const LeadImportCsv = () => {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [originalCsvHeaders, setOriginalCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);

  // Mappings
  const [fieldMappings, setFieldMappings] = useState<FieldMapping>({});
  const [statusValueMapping, setStatusValueMapping] = useState<ValueMapping>({});
  const [sourceValueMapping, setSourceValueMapping] = useState<ValueMapping>({});

  // Unique values from CSV
  const [csvUniqueStatuses, setCsvUniqueStatuses] = useState<string[]>([]);
  const [csvUniqueSources, setCsvUniqueSources] = useState<string[]>([]);

  // Data from API
  const [leadStatus, setLeadStatus] = useState<PostDataTypeForLeadSourceAndStatusAndStates[] | null>(null);
  const [leadSource, setLeadSource] = useState<PostDataTypeForLeadSourceAndStatusAndStates[] | null>(null);

  // --- STATIC DATA ---
  const crmLeadFields: CrmField[] = useMemo(
    () => [
      { id: "name", label: "Name", required: true },
      { id: "email", label: "Email", required: false }, // Validation is conditional
      { id: "mobileNumber", label: "Mobile Number", required: false }, // Validation is conditional
      { id: "leadOwner", label: "Lead Owner", required: false },
      { id: "leadStatus", label: "Lead Status", required: false },
      { id: "leadSource", label: "Lead Source", required: false },
      { id: "jobTitle", label: "Job Title", required: false },
      { id: "industry", label: "Industry", required: false },
       { id: "address", label: "Address", required: false },
    ],
    []
  );

  // Note : api calls for the lead status and lead source
  const fetchLeadData = useCallback(async () => {
    const fetchData = async (url: string, setData: React.Dispatch<React.SetStateAction<PostDataTypeForLeadSourceAndStatusAndStates[] | null>>, callFn: () => void) => {
        const postData = { id: null, name: null, description: null, isactive: true };
        try {
            const response = await axios.post(url, postData, { withCredentials: true });
            if (response.status === STATUS_CODE.OK) {
                setData(response.data);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({ callFunction: fetchLeadData });
                setIsDialogueOpen(!refreshTokenStatus);
            } else if (error.status === STATUS_CODE.FORBIDDEN) {
                setIsDialogueOpen(true);
            }
        }
    }
    await fetchData(POST_API.GET_LEAD_STATUS, setLeadStatus, fetchLeadData);
    await fetchData(POST_API.GET_LEAD_SOURCE, setLeadSource, fetchLeadData);
  }, []);




  // to get the data for LEAD STATUS AND LEAD SOURCE
  useEffect(() => {
    fetchLeadData();
  }, [fetchLeadData]);


  // Note : for Refresh token logic
  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  // --- EFFECTS ---

  // Auto-suggest field mappings when CSV is loaded
  useEffect(() => {
    if (originalCsvHeaders.length > 0) {
      const initialMappings: FieldMapping = {};
      crmLeadFields.forEach((crmField) => {
        const fieldIdLower = crmField.id.toLowerCase();
        const foundHeader = originalCsvHeaders.find(
          (h) => h.toLowerCase().replace(/ /g, "") === fieldIdLower
        );
        initialMappings[crmField.id] = foundHeader ? [foundHeader] : [];
      });
      setFieldMappings(initialMappings);
    }
  }, [originalCsvHeaders, crmLeadFields]);

  // Function to extract unique values from CSV for a given field
  const extractUniqueValues = (
    fieldId: "leadStatus" | "leadSource",
    setUniqueValues: (values: string[]) => void
  ) => {
    const mappedHeaders = fieldMappings[fieldId];
    if (!csvData || csvData.length < 2 || !mappedHeaders || mappedHeaders.length === 0) {
      setUniqueValues([]);
      return;
    }
    const headerIndices = mappedHeaders.map((h) => originalCsvHeaders.indexOf(h)).filter((i) => i !== -1);
    if (headerIndices.length === 0) return;

    const uniqueValues = new Set<string>();
    csvData.slice(1).forEach((row) => {
      headerIndices.forEach((index) => {
        if (row[index] && row[index].trim())
          uniqueValues.add(row[index].trim());
      });
    });
    setUniqueValues(Array.from(uniqueValues));
  };

  useEffect(() => {
    extractUniqueValues("leadStatus", setCsvUniqueStatuses);
    setStatusValueMapping({}); // Reset mapping when field changes
  }, [csvData, fieldMappings.leadStatus, originalCsvHeaders]);

  useEffect(() => {
    extractUniqueValues("leadSource", setCsvUniqueSources);
    setSourceValueMapping({}); // Reset mapping when field changes
  }, [csvData, fieldMappings.leadSource, originalCsvHeaders]);

  // --- CALLBACKS & HANDLERS ---

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null); setCsvData(null); setCsvFile(null); setOriginalCsvHeaders([]);
    setFieldMappings({}); setStatusValueMapping({}); setSourceValueMapping({});
    setCsvUniqueSources([]); setCsvUniqueStatuses([]);

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setCsvFile(file);
        readCsv(file);
      } else {
        setError("Please select a valid CSV file.");
      }
    }
  };

  const readCsv = (file: File) => {
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);
        if (lines.length < 1) throw new Error("CSV file is empty.");
        const parsedData = lines.map((line) => line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")));
        if (parsedData[0].length === 0) throw new Error("CSV has no readable headers.");
        setCsvData(parsedData); setOriginalCsvHeaders(parsedData[0]); setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to parse CSV."); setCsvData(null); setOriginalCsvHeaders([]);
      } finally {
        setIsParsing(false);
      }
    };
    reader.onerror = () => { setError("Failed to read the file."); setIsParsing(false); };
    reader.readAsText(file);
  };

  const handleDropField = useCallback((crmFieldId: string, csvHeader: string) => {
    if (crmFieldId === "leadStatus" || crmFieldId === "leadSource") {
      setFieldMappings((prev) => ({ ...prev, [crmFieldId]: [csvHeader] }));
    } else {
      setFieldMappings((prev) => ({
        ...prev,
        [crmFieldId]: [...(prev[crmFieldId] || []), csvHeader],
      }));
    }
  }, []);

  const handleRemoveFieldMapping = useCallback((crmFieldId: string, csvHeader: string) => {
    setFieldMappings((prev) => ({
      ...prev,
      [crmFieldId]: (prev[crmFieldId] || []).filter((h) => h !== csvHeader),
    }));
  }, []);

  const handleValueMap = (
    crmItem: PostDataTypeForLeadSourceAndStatusAndStates,
    csvValue: string,
    currentMapping: ValueMapping,
    setMapping: (mapping: ValueMapping) => void
  ) => {
    if (!crmItem.id) return;
    const newMapping = { ...currentMapping };
    Object.keys(newMapping).forEach(key => {
      if (newMapping[key] === csvValue) delete newMapping[key];
    });
    delete newMapping[crmItem.id];
    newMapping[crmItem.id] = csvValue;
    setMapping(newMapping);
  };

  const handleRemoveValueMap = (
    crmItem: PostDataTypeForLeadSourceAndStatusAndStates,
    currentMapping: ValueMapping,
    setMapping: (mapping: ValueMapping) => void
  ) => {
    if (!crmItem.id) return;
    const newMapping = { ...currentMapping };
    delete newMapping[crmItem.id];
    setMapping(newMapping);
  };

  const handleSubmitImport = async () => {
    if (!csvFile || !csvData) {
      setError("No CSV data to import."); return;
    }

    const isNameMapped = fieldMappings.name && fieldMappings.name.length > 0;
    const isContactInfoMapped = (fieldMappings.email && fieldMappings.email.length > 0) || (fieldMappings.mobileNumber && fieldMappings.mobileNumber.length > 0);

    if (!isNameMapped || !isContactInfoMapped) {
      const errorMessages = [];
      if (!isNameMapped) errorMessages.push('"Name"');
      if (!isContactInfoMapped) errorMessages.push('"Email" or "Mobile Number"');
      setError(`Please map the required field(s): ${errorMessages.join(" and ")}.`);
      return;
    }

    setError(null);

    const payload = {
      fieldMappings,
      statusValueMapping,
      sourceValueMapping,
    };

    console.log("Submitting data to backend:", payload);

    try {
        const formData = new FormData();
        formData.append("csvFile", csvFile);
        formData.append("mappings", JSON.stringify(payload));
        // const res = await axios.post(POST_API.LEAD_IMPORT_VIA_CSV, formData, { withCredentials: true });
        alert("Check console for submission payload. Import simulated successfully!");
        handleFileChange({ target: { files: null } } as any);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during import.");
    }
  };

  // --- RENDER LOGIC ---
  const showStatusValueMapping = (fieldMappings.leadStatus?.length ?? 0) > 0 && csvUniqueStatuses.length > 0;
  const showSourceValueMapping = (fieldMappings.leadSource?.length ?? 0) > 0 && csvUniqueSources.length > 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-screen bg-gray-100 overflow-auto flex flex-col p-4 space-y-4">
        {/* Header and other UI elements... */}
        <div className="flex-shrink-0 flex items-center justify-between p-2 border-b-2 border-gray-200 bg-white  rounded-lg   z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            Import Leads from CSV
          </h2>
          <label
            htmlFor="csv-upload"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer transition-colors shadow-sm"
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
        </div>

        {isParsing && <div className="p-3 bg-blue-100 text-blue-700 rounded-md">Parsing CSV...</div>}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md font-bold">{error}</div>}

        {csvFile && csvData && (
          <div className="flex-shrink-0 p-4 border rounded-lg space-y-4 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-gray-700">Preview (First 5 Rows)</h4>
              <button onClick={() => setShowPreview(!showPreview)} className="text-sm text-blue-600 hover:underline">
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
            </div>
            {showPreview && (
              <div className="w-full overflow-x-auto border rounded-md">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr className="border-b">
                      {csvData[0].map((h, i) => <th key={i} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(1, 6).map((row, i) => (
                      <tr key={i} className="border-t">
                        {row.map((cell, j) => <td key={j} className="px-3 py-2 text-gray-800">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {csvData && (
          <>
            <div className="flex-grow flex flex-col lg:flex-row w-full gap-6">
              <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col gap-4">
                <div className="border rounded-lg p-3 bg-white shadow-sm">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">1. CSV Columns</h3>
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {originalCsvHeaders.map((h, i) => <DraggableCsvColumn key={i} header={h} />)}
                  </ul>
                </div>
              </div>
              <div className="w-full lg:w-7/12 xl:w-8/12 flex flex-col">
                <div className="border rounded-lg p-4 bg-white flex-grow shadow-sm">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">2. Map Columns to CRM Fields</h3>
                  <div className="space-y-4">
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
              {showStatusValueMapping && (
                <ValueMappingCard
                  title="3. Map CSV Statuses"
                  csvValues={csvUniqueStatuses}
                  crmData={leadStatus}
                  mapping={statusValueMapping}
                  onDrop={(c, v) => handleValueMap(c, v, statusValueMapping, setStatusValueMapping)}
                  onRemove={(c) => handleRemoveValueMap(c, statusValueMapping, setStatusValueMapping)}
                  itemType={ItemTypes.CSV_STATUS_VALUE}
                />
              )}
              {showSourceValueMapping && (
                <ValueMappingCard
                  title="4. Map CSV Sources"
                  csvValues={csvUniqueSources}
                  crmData={leadSource}
                  mapping={sourceValueMapping}
                  onDrop={(c, v) => handleValueMap(c, v, sourceValueMapping, setSourceValueMapping)}
                  onRemove={(c) => handleRemoveValueMap(c, sourceValueMapping, setSourceValueMapping)}
                  itemType={ItemTypes.CSV_SOURCE_VALUE}
                />
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={handleSubmitImport} disabled={isParsing || !csvFile} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                Finalize and Import Leads
              </button>
            </div>
          </>
        )}
      </div>
      <DialogueBox
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        onConfirm={handleDialogueConfirm}
        title="Session Expired!"
        message="Your session has expired. Please login again to continue."
      />
    </DndProvider>
  );
};

export default LeadImportCsv;