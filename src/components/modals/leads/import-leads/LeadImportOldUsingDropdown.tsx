
import { useState, ChangeEvent, useMemo, useEffect, useCallback } from "react";
import { FileUp } from "lucide-react";
import { usePanel } from "../../../../context/panel/usePanel"; // Assuming this is relevant for your layout
import axios from "axios";
import POST_API from "../../../../constants/PostApi";

type CsvData = string[][];

interface CrmField {
  id: string; // Internal unique ID, often camelCase matching DB
  label: string; // User-friendly display name
  required: boolean; // Is this field mandatory for lead creation?
}

// Define the type for the mapping state
interface FieldMapping {
  [crmFieldId: string]: string | ""; // Maps crmFieldId to selected CSV column header or empty string (for unmapped)
}

const LeadImportCsv = () => {
  const { position } = usePanel(); // Assuming usePanel is relevant for your layout

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [originalCsvHeaders, setOriginalCsvHeaders] = useState<string[]>([]); // New state for ALL original CSV headers
  const [csvData, setCsvData] = useState<CsvData | null>(null); // Still used for preview, but headers from originalCsvHeaders
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping>({});
  const [isParsing, setIsParsing] = useState<boolean>(false);

  // Define your CRM's lead fields statically for this example.
  const crmLeadFields: CrmField[] = useMemo(
    () => [
      { id: "name", label: "Name", required: true },
      { id: "email", label: "Email", required: true },
      { id: "mobileNumber", label: "Mobile Number", required: true },
      { id: "leadOwner" , label : "Lead Owner", required: false },
      { id: "leadStatus", label: "Lead Status", required: false },
      { id: "leadSource", label: "Lead Source", required: false },
      { id: "jobTitle", label: "Job Title", required: false },
      { id: "industry", label: "Industry", required: false },
      { id: "country", label: "Country", required: false },
      { id: "state", label: "State", required: false },
      { id: "district", label: "District", required: false },
      { id: "address", label: "Address", required: false },
      { id: "additionalContactNumber", label: "Additional Contact Number", required: false },
      { id: "industryName", label: "Industry Name", required: false },
      { id: "website", label: "Website", required: false },
    ],
    []
  );

  // Derived state: Headers that are NOT currently selected by any CRM field
  const availableCsvHeaders = useMemo(() => {
    const mappedHeaders = Object.values(fieldMappings).filter(Boolean) as string[]; // Get all selected headers
    return originalCsvHeaders.filter(
      (header) => !mappedHeaders.includes(header)
    ).sort(); // Filter out mapped ones and sort
  }, [originalCsvHeaders, fieldMappings]);

  // Effect to initialize mappings when a new CSV is loaded
  useEffect(() => {
    if (originalCsvHeaders.length > 0) {
      const initialMappings: FieldMapping = {};
      const currentMappedHeaders: string[] = []; // Keep track of headers used in auto-suggestion

      crmLeadFields.forEach((crmField) => {
        let suggestedCsvHeader = "";

        // Find a header that's not already used in auto-suggestion
        const foundHeader = originalCsvHeaders.find(
          (header) =>
            !currentMappedHeaders.includes(header) && // Ensure it hasn't been used yet
            (header.toLowerCase() === crmField.label.toLowerCase() ||
             header.toLowerCase() === crmField.id.toLowerCase() ||
             (crmField.id === "name" && (header.toLowerCase() === "fullname" || header.toLowerCase() === "full name")) ||
             (crmField.id === "mobileNumber" && (header.toLowerCase() === "phone" || header.toLowerCase() === "mobile" || header.toLowerCase() === "contact number")) ||
             (crmField.id === "email" && (header.toLowerCase() === "email address" || header.toLowerCase() === "e-mail"))
            )
        );

        if (foundHeader) {
          suggestedCsvHeader = foundHeader;
          currentMappedHeaders.push(foundHeader); // Mark this header as used for auto-suggestion
        }
        initialMappings[crmField.id] = suggestedCsvHeader;
      });
      setFieldMappings(initialMappings);
    } else {
      setFieldMappings({}); // Clear mappings if no original headers
    }
  }, [originalCsvHeaders, crmLeadFields]); // Depend on originalCsvHeaders instead of csvData

  // Function to update mappings
  const handleMappingChange = useCallback(
    (crmFieldId: string, selectedCsvColumn: string) => {
      setFieldMappings((prevMappings) => ({
        ...prevMappings,
        [crmFieldId]: selectedCsvColumn,
      }));
      // The `availableCsvHeaders` will automatically re-calculate via useMemo
      // No need to manually add/remove here anymore!
    },
    []
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setCsvData(null);
    setCsvFile(null);
    setOriginalCsvHeaders([]); // Clear original headers
    setFieldMappings({}); // Clear mappings
    // `availableCsvHeaders` will automatically clear due to `originalCsvHeaders` being empty

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
        const lines = content
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== "");

        if (lines.length === 0) {
          setError("CSV file is empty or contains no data.");
          setCsvData(null);
          setOriginalCsvHeaders([]);
          return;
        }

        const parsedData: CsvData = lines.map((line) => {
          // A basic split that doesn't handle commas inside quotes well
          return line.split(",").map((cell) => cell.trim());
        });

        if (parsedData.length < 1 || parsedData[0].length === 0) {
          setError("CSV file has no readable headers or data.");
          setCsvData(null);
          setOriginalCsvHeaders([]);
          return;
        }

        setCsvData(parsedData); // Keep for preview
        setOriginalCsvHeaders(parsedData[0]); // Set the master list of headers
        setError(null);
      } catch (err) {
        console.error("Error parsing CSV:", err);
        setError("Failed to parse CSV file. Please check its format.");
        setCsvData(null);
        setOriginalCsvHeaders([]);
      } finally {
        setIsParsing(false);
      }
    };

    reader.onerror = () => {
      console.error("Error reading file:", reader.error);
      setError("Failed to read the file. Please try again.");
      setCsvData(null);
      setOriginalCsvHeaders([]);
      setIsParsing(false);
    };

    reader.readAsText(file);
  };

  const handleSubmitImport =async () => {
    if (!csvFile || !csvData || csvData.length === 0) {
      setError("No CSV data to import.");
      return;
    }

    const unmappedRequiredFields = crmLeadFields.filter(
      (field) => field.required && !fieldMappings[field.id]
    );

    if (unmappedRequiredFields.length > 0) {
      setError(
        `Please map all required fields: ${unmappedRequiredFields
          .map((f) => f.label)
          .join(", ")}`
      );
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", csvFile);
    formData.append("fieldMappings", JSON.stringify(fieldMappings));

    console.log("Sending to server...");
    console.log("Mapped Data:", fieldMappings);
    // console.log("CSV File:", csvFile);

   

    await axios.post(POST_API.LEAD_IMPORT_VIA_CSV, formData, {withCredentials: true})
    .then((res)=>{
      console.log(res.data);
    }).catch((error)=>{
      console.error(error);
    })

    setError(null);
    // alert("Data and mapping logged to console. Ready to send to server!");
  };

  return (
    <div
      className={`
        ${position === "left" ? "pl-[20px] pt-[0px]" : "pt-[2px] px-3"}
        w-full
        h-[calc(100vh-64px)]
        bg-white
        overflow-auto
        flex flex-col
    `}
    >
      {/* Header + Upload Button */}
      <div className="flex items-center justify-between mb-4 border rounded-md bg-gray-100 p-1 mt-1">
        <div className="flex gap-7">
          <h2 className="text-base font-medium text-gray-800">
            Import Leads from CSV
          </h2>
        </div>
        <label
          htmlFor="csv-upload"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-md cursor-pointer"
        >
          <FileUp className="w-5 h-5" />
          <span>{csvFile ? "Change CSV File" : "Select CSV File"}</span>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            key={csvFile?.name || "no-file"}
          />
        </label>
      </div>

      {/* Loading/Error Messages */}
      {isParsing && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg relative mb-4">
          Parsing CSV... Please wait.
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {/* File Info */}
      {csvFile && (
        <div className="bg-blue-50 p-2 border border-blue-200 text-blue-800 rounded-lg mb-4 text-sm">
          <p className="font-semibold">Selected File:</p>
          <p>
            {csvFile.name} ({csvFile.size} bytes)
          </p>
        </div>
      )}

      {/* Preview Section */}
      {csvData && csvData.length > 1 && (
        <div className="mb-4 flex flex-col">
          <div className="flex items-center justify-start gap-3 mb-2">
            <h4 className="text-sm font-semibold text-gray-800">
              Preview (First 5 Rows)
            </h4>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-blue-600 hover:underline"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>

          {showPreview && (
            <div className="w-full overflow-x-auto border border-gray-300 rounded shadow-sm">
              <div className="min-w-[600px]">
                <table className="w-full text-sm text-left table-auto">
                  <thead className="bg-gray-100 text-gray-700 font-medium">
                    <tr>
                      {csvData[0].map((header, i) => (
                        <th key={i} className="px-4 py-2 border-b">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData
                      .slice(1, Math.min(csvData.length, 6))
                      .map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mapping Section - Only show if CSV data is available */}
      {csvData && csvData.length > 0 && (
        <div className="flex w-full flex-grow gap-4">
          {/* CSV Columns Detected (30% section) */}
          <div className=" w-[20%] border border-gray-300 rounded-md p-3 bg-gray-50 flex-shrink-0 max-h-[500px] overflow-y-auto">
            <h3 className="text-md font-semibold text-gray-800 mb-3 sticky top-0 bg-gray-50 pb-2 z-10">
              CSV Columns:
            </h3>
            <ul className="space-y-2">
              {originalCsvHeaders.length > 0 ? (
                originalCsvHeaders.map((header, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded text-sm border border-gray-200 shadow-sm"
                  >
                    {header}
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No columns detected.</p>
              )}
            </ul>
          </div>

          {/* Mapping Form (70% section) */}
          <div className="  border-gray-300 rounded-md p-4 bg-white flex-grow  ">
            <h3 className="text-md font-semibold text-gray-800 mb-4">
              Map CSV Columns to CRM Fields:
            </h3>
            <div className="space-y-4">
              {crmLeadFields.map((field) => (
                <div key={field.id} className="flex items-center gap-4">
                  <label
                    htmlFor={`map-${field.id}`}
                    className="w-1/2 text-sm font-medium text-gray-700"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <div className="w-1/2">
                    <select
                      id={`map-${field.id}`}
                      value={fieldMappings[field.id] || ""} // Ensure controlled component
                      onChange={(e) =>
                        handleMappingChange(field.id, e.target.value)
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                    >
                      <option value="">-- Select CSV Column --</option>
                      {/*
                        Render the currently selected value if it exists,
                        then render the available headers.
                        The 'value' prop on <select> ensures the correct option is shown.
                      */}
                      {fieldMappings[field.id] && (
                        <option value={fieldMappings[field.id]} disabled={!originalCsvHeaders.includes(fieldMappings[field.id])}>
                          {fieldMappings[field.id]} (Currently Mapped)
                        </option>
                      )}
                      {availableCsvHeaders.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmitImport}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-md shadow-sm"
                disabled={isParsing || !csvFile || !csvData || csvData.length === 0} // Disable if no file, parsing, or no data
              >
                Import Leads
              </button>
            </div>
          </div>
        </div>
      )}

      {csvData && csvData.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Warning!</strong>
          <span className="block sm:inline ml-2">The selected CSV file appears to be empty or contains no data.</span>
        </div>
      )}
    </div>
  );
};

export default LeadImportCsv;