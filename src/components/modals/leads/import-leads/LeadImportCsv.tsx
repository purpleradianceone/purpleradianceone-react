/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import { useState, ChangeEvent, useMemo, useEffect, useCallback } from "react";
// import { FileUp, XCircle, ArrowRight, Search } from "lucide-react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import axios from "axios";
// import POST_API from "../../../../constants/PostApi";
// import PostDataTypeForLeadSourceAndStatusAndStates from "../../../../@types/lead-management/PostDataTypeForLeadSourceAndStatusAndStates";
// import { STATUS_CODE } from "../../../../constants/AppConstants";
// import RefreshToken from "../../../../config/validations/RefreshToken";
// import ROUTES_URL from "../../../../constants/Routes";
// import { useNavigate } from "react-router-dom";
// import { DialogueBox } from "../../../dialogue-box/Dialogue";
// import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
// import CompanyUsersSearchProps from "../../../../@types/company-users/CompanyUserProps";

// // --- GENERIC TYPES ---
// // A generic item that has at least an id and a name
// interface MappableItem {
//   id: number | null;
//   name: string | null;
// }

// // --- DRAG-AND-DROP TYPES ---
// type CsvData = string[][];

// interface CrmField {
//   id: string;
//   label: string;
//   required: boolean;
// }

// interface FieldMapping {
//   [crmFieldId: string]: string[];
// }

// // Maps a CRM ID to a specific CSV value, e.g., { "123": "John Doe" }
// interface ValueMapping {
//   [crmId: string]: string;
// }

// const ItemTypes = {
//   CSV_COLUMN: "csv_column",
//   CSV_STATUS_VALUE: "csv_status_value",
//   CSV_SOURCE_VALUE: "csv_source_value",
//   CSV_OWNER_VALUE: "csv_owner_value", // New type for lead owners
// };

// interface DragItem {
//   name: string;
//   type: string;
// }

// // --- DND-ENABLED COMPONENTS ---

// const DraggableCsvColumn: React.FC<{ header: string }> = ({ header }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: ItemTypes.CSV_COLUMN,
//     item: { name: header },
//     collect: (monitor) => ({ isDragging: monitor.isDragging() }),
//   }));
//   return (
//     <li ref={drag} className={`bg-gray-100 text-gray-800 px-3 py-1.5 rounded text-sm border border-gray-200 shadow-sm cursor-grab ${isDragging ? "opacity-50" : ""}`}>
//       {header}
//     </li>
//   );
// };

// const DraggableCsvValue: React.FC<{ value: string; type: string }> = ({ value, type, }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type,
//     item: { name: value },
//     collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
//   }));
//   return (
//     <div ref={drag} className={`p-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm cursor-grab transition-all ${isDragging ? "opacity-40 scale-95" : "opacity-100"}`}>
//       {value}
//     </div>
//   );
// };

// const DroppableCrmField: React.FC<{field: CrmField; mappedHeaders: string[]; onDrop: (id: string, header: string) => void; onRemoveMapping: (id: string, header: string) => void;}> = ({ field, mappedHeaders, onDrop, onRemoveMapping }) => {
//   const [{ isOver, canDrop }, drop] = useDrop(() => ({
//     accept: ItemTypes.CSV_COLUMN,
//     drop: (item: DragItem) => {
//       if (!mappedHeaders.includes(item.name)) onDrop(field.id, item.name);
//     },
//     collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
//   }));

//   return (
//     <div key={field.id} className="flex items-start gap-4">
//       <label htmlFor={`map-${field.id}`} className="w-1/3 text-sm font-medium text-gray-700 pt-2">
//         {field.label}
//         {field.required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <div ref={drop} className={`w-2/3 min-h-[40px] border rounded-md p-2 flex flex-wrap gap-2 items-center transition-all ${isOver && canDrop ? "border-blue-500 bg-blue-50 ring-2" : "border-gray-300 bg-gray-50"} ${canDrop ? "border-dashed" : ""}`}>
//         {mappedHeaders.length > 0 ? (
//           mappedHeaders.map((header) => (
//             <span key={header} className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
//               {header}
//               <XCircle className="ml-1 w-4 h-4 cursor-pointer" onClick={() => onRemoveMapping(field.id, header)}/>
//             </span>
//           ))
//         ) : (
//           <span className="text-gray-500 text-sm italic">Drag column here</span>
//         )}
//       </div>
//     </div>
//   );
// };

// // Generic Value Mapping Card Component
// interface ValueMappingCardProps<T extends MappableItem> {
//   title: string;
//   csvValues: string[];
//   crmData: T[] | null;
//   mapping: ValueMapping;
//   onDrop: (crmItem: T, csvValue: string) => void;
//   onRemove: (crmItem: T) => void;
//   itemType: string;
//   // Optional search functionality
//   onSearch?: (searchTerm: string) => void;
//   searchPlaceholder?: string;
// }

// const GenericValueMappingCard = <T extends MappableItem>({ title, csvValues, crmData, mapping, onDrop, onRemove, itemType, onSearch, searchPlaceholder }: ValueMappingCardProps<T>) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const crmValues = crmData || [];
//   const mappedCsvValues = Object.values(mapping);
//   const unmappedCsvValues = csvValues.filter((v) => !mappedCsvValues.includes(v));

//   const getMappedCsvValue = (crmId: number | null) => crmId ? mapping[crmId] : undefined;
  
//   const handleSearch = () => {
//       if(onSearch) onSearch(searchTerm);
//   }

//   const DroppableTarget: React.FC<{ crmItem: T }> = ({ crmItem }) => {
//     const [{ isOver, canDrop }, drop] = useDrop(() => ({
//         accept: itemType,
//         drop: (item: DragItem) => onDrop(crmItem, item.name),
//         collect: (monitor) => ({ isOver: !!monitor.isOver(), canDrop: !!monitor.canDrop() }),
//       }), [crmItem, onDrop]
//     );

//     const mappedValue = getMappedCsvValue(crmItem.id);

//     return (
//       <div className="flex items-center gap-2">
//         <div ref={drop} className={`flex-1 p-2 border rounded-md transition-all text-center h-10 flex items-center justify-center ${isOver && canDrop ? "border-green-500 bg-green-50 ring-2" : "border-gray-300"} ${mappedValue ? "bg-green-100" : "bg-white"}`}>
//           {mappedValue ? (
//             <div className="flex justify-between items-center w-full text-sm font-medium text-green-800">
//               <span>{mappedValue}</span>
//               <XCircle className="w-4 h-4 text-red-500 cursor-pointer" onClick={() => onRemove(crmItem)}/>
//             </div>
//           ) : (
//             <span className="text-gray-400 text-sm italic">Drop here</span>
//           )}
//         </div>
//         <ArrowRight className="text-gray-400 flex-shrink-0" />
//         <div className="flex-1 p-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium h-10 flex items-center justify-center">
//           {crmItem.name}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="border rounded-lg p-3 bg-gray-50/80 shadow-sm">
//       <h3 className="text-md font-semibold text-gray-800 mb-3">{title}</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <h4 className="font-medium text-sm text-center mb-2 text-gray-600">Your CSV Values (Drag)</h4>
//           <div className="space-y-2 p-2 bg-white rounded-md border min-h-[100px] max-h-60 overflow-y-auto">
//             {unmappedCsvValues.map((s) => <DraggableCsvValue key={s} value={s} type={itemType} />)}
//           </div>
//         </div>
//         <div>
//            {onSearch && (
//                <div className="flex items-center gap-2 mb-2">
//                    <input
//                         type="text"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         placeholder={searchPlaceholder || "Search..."}
//                         className="flex-grow p-2 border rounded-md text-sm"
//                     />
//                     <button onClick={handleSearch} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                         <Search className="w-5 h-5"/>
//                     </button>
//                </div>
//            )}
//           <h4 className="font-medium text-sm text-center mb-2 text-gray-600">To CRM Values (Drop)</h4>
//           <div className="space-y-2 max-h-60 overflow-y-auto">
//             {crmValues.map((item) => item.id && <DroppableTarget key={item.id} crmItem={item} />)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// // --- MAIN COMPONENT ---
// const LeadImportCsv = () => {
//   const navigate = useNavigate();
//   const { loginStatus } = useLoggedInUserContext();
  
//   // --- STATE ---
//   const [csvFile, setCsvFile] = useState<File | null>(null);
//   const [originalCsvHeaders, setOriginalCsvHeaders] = useState<string[]>([]);
//   const [csvData, setCsvData] = useState<CsvData | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [showPreview, setShowPreview] = useState<boolean>(true);
//   const [isParsing, setIsParsing] = useState<boolean>(false);
//   const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false);

//   // Mappings
//   const [fieldMappings, setFieldMappings] = useState<FieldMapping>({});
//   const [statusValueMapping, setStatusValueMapping] = useState<ValueMapping>({});
//   const [sourceValueMapping, setSourceValueMapping] = useState<ValueMapping>({});
//   const [ownerValueMapping, setOwnerValueMapping] = useState<ValueMapping>({});

//   // Unique values from CSV
//   const [csvUniqueStatuses, setCsvUniqueStatuses] = useState<string[]>([]);
//   const [csvUniqueSources, setCsvUniqueSources] = useState<string[]>([]);
//   const [csvUniqueOwners, setCsvUniqueOwners] = useState<string[]>([]);

//   // Data from API
//   const [leadStatus, setLeadStatus] = useState<PostDataTypeForLeadSourceAndStatusAndStates[] | null>(null);
//   const [leadSource, setLeadSource] = useState<PostDataTypeForLeadSourceAndStatusAndStates[] | null>(null);
//   const [companyUsers, setCompanyUsers] = useState<CompanyUsersSearchProps[]>([]);

//   // --- STATIC DATA ---
//   const crmLeadFields: CrmField[] = useMemo(() => [
//       { id: "name", label: "Name", required: true },
//       { id: "email", label: "Email", required: false },
//       { id: "mobileNumber", label: "Mobile Number", required: false },
//       { id: "leadOwner", label: "Lead Owner", required: false },
//       { id: "leadStatus", label: "Lead Status", required: false },
//       { id: "leadSource", label: "Lead Source", required: false },
//       { id: "jobTitle", label: "Job Title", required: false },
//       { id: "industry", label: "Industry", required: false },
//       { id: "address", label: "Address", required: false },
//     ], []);

//   // --- API CALLS ---
//     // Note : api calls for the lead status and lead source
//   const fetchLeadData = useCallback(async () => {
//     const fetchData = async (
//       url: string,
//       setData: React.Dispatch<
//         React.SetStateAction<
//           PostDataTypeForLeadSourceAndStatusAndStates[] | null
//         >
//       >,
//       callFn: () => Promise<void>
//     ) => {
//       const postData = {
//         id: null,
//         name: null,
//         description: null,
//         isactive: true,
//       };
//       try {
//         const response = await axios.post(url, postData, {
//           withCredentials: true,
//         });
//         if (response.status === STATUS_CODE.OK) {
//           setData(response.data);
//         }
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       } catch (error: any) {
//         if (error.status === STATUS_CODE.UNATHORISED) {
//           // NOTE : CHANGES ARE DONE HERE
//           const refreshTokenStatus = await RefreshToken({
//             callFunction: callFn,
//           });
//           setIsDialogueOpen(!refreshTokenStatus);
//         } else if (error.status === STATUS_CODE.FORBIDDEN) {
//           setIsDialogueOpen(true);
//         }
//       }
//     };
//     await fetchData(POST_API.GET_LEAD_STATUS, setLeadStatus, fetchLeadData);
//     await fetchData(POST_API.GET_LEAD_SOURCE, setLeadSource, fetchLeadData);
//   }, []);
  
//   const fetchCompanyUsers = async (searchParameter: string) => {
//     const postData = {
//       company_id: loginStatus.companyId,
//       requestedby: loginStatus.id,
//       search_parameter: searchParameter,

//     };
//     try {
//       const response = await axios.post(POST_API.GET_COMPANY_USERS, postData, { withCredentials: true });
//       setCompanyUsers(response.data);
//     } catch (error: any) {
//       console.error("Failed to fetch company users:", error);
//       // Handle auth errors...
//     }
//   };

//   useEffect(() => {
//     fetchLeadData();
//     fetchCompanyUsers(""); // Initial fetch for users
//   }, [fetchLeadData, loginStatus]);
  
//   const handleDialogueConfirm = () => {
//     setIsDialogueOpen(false);
//     localStorage.clear();
//     navigate(ROUTES_URL.SIGN_IN);
//   };
  
//   // --- EFFECTS ---
//   // Auto-suggest field mappings on new CSV
//   useEffect(() => {
//     if (originalCsvHeaders.length > 0) {
//       const initialMappings: FieldMapping = {};
//       crmLeadFields.forEach((field) => {
//         const fieldIdLower = field.id.toLowerCase();
//         const found = originalCsvHeaders.find(h => h.toLowerCase().replace(/ /g, "") === fieldIdLower);
//         initialMappings[field.id] = found ? [found] : [];
//       });
//       setFieldMappings(initialMappings);
//     }
//   }, [originalCsvHeaders, crmLeadFields]);
  
//   // Extract unique values from CSV when mappings change
//   const extractUniqueValues = (fieldId: "leadStatus" | "leadSource" | "leadOwner", setUniqueValues: (v: string[]) => void) => {
//     const mappedHeaders = fieldMappings[fieldId];
//     if (!csvData || !mappedHeaders?.length) {
//       setUniqueValues([]);
//       return;
//     }
//     const indices = mappedHeaders.map(h => originalCsvHeaders.indexOf(h)).filter(i => i !== -1);
//     const unique = new Set<string>();
//     csvData.slice(1).forEach(row => {
//       indices.forEach(index => {
//         if (row[index]?.trim()) unique.add(row[index].trim());
//       });
//     });
//     setUniqueValues(Array.from(unique));
//   };
  
//   useEffect(() => { extractUniqueValues("leadStatus", setCsvUniqueStatuses); setStatusValueMapping({});}, [csvData, fieldMappings.leadStatus]);
//   useEffect(() => { extractUniqueValues("leadSource", setCsvUniqueSources); setSourceValueMapping({});}, [csvData, fieldMappings.leadSource]);
//   useEffect(() => { extractUniqueValues("leadOwner", setCsvUniqueOwners); setOwnerValueMapping({});}, [csvData, fieldMappings.leadOwner]);

//   // --- HANDLERS ---
//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     // Reset all relevant state
//     setCsvFile(null); setCsvData(null); setOriginalCsvHeaders([]); setError(null);
//     setFieldMappings({}); setStatusValueMapping({}); setSourceValueMapping({}); setOwnerValueMapping({});
//     setCsvUniqueStatuses([]); setCsvUniqueSources([]); setCsvUniqueOwners([]);

//     if (event.target.files?.[0]) {
//       const file = event.target.files[0];
//       if (file.type === "text/csv" || file.name.endsWith(".csv")) {
//         setCsvFile(file);
//         readCsv(file);
//       } else {
//         setError("Please select a valid CSV file.");
//       }
//     }
//   };
  
//   const readCsv = (file: File) => {
//     setIsParsing(true);
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const content = e.target?.result as string;
//         const lines = content.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
//         if (lines.length < 1) throw new Error("CSV file is empty.");
//         const parsedData = lines.map(line => line.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
//         setCsvData(parsedData); setOriginalCsvHeaders(parsedData[0]); setError(null);
//       } catch (err: any) {
//         setError(err.message || "Failed to parse CSV.");
//       } finally {
//         setIsParsing(false);
//       }
//     };
//     reader.readAsText(file);
//   };

//   const handleDropField = useCallback((crmFieldId: string, csvHeader: string) => {
//     const singleMapFields = ["leadStatus", "leadSource", "leadOwner"];
//     if (singleMapFields.includes(crmFieldId)) {
//         setFieldMappings(prev => ({ ...prev, [crmFieldId]: [csvHeader] }));
//     } else {
//         setFieldMappings(prev => ({ ...prev, [crmFieldId]: [...(prev[crmFieldId] || []), csvHeader] }));
//     }
//   }, []);

//   const handleRemoveFieldMapping = useCallback((crmFieldId: string, csvHeader: string) => {
//     setFieldMappings(prev => ({ ...prev, [crmFieldId]: prev[crmFieldId].filter(h => h !== csvHeader) }));
//   }, []);

//   const handleValueMap = <T extends MappableItem>(crmItem: T, csvValue: string, currentMapping: ValueMapping, setMapping: (m: ValueMapping) => void) => {
//     if (!crmItem.id) return;
//     const newMapping = { ...currentMapping };
//     Object.keys(newMapping).forEach(key => { if (newMapping[key] === csvValue) delete newMapping[key]; });
//     newMapping[crmItem.id] = csvValue;
//     setMapping(newMapping);
//   };
  
//   const handleRemoveValueMap = <T extends MappableItem>(crmItem: T, currentMapping: ValueMapping, setMapping: (m: ValueMapping) => void) => {
//     if (!crmItem.id) return;
//     const newMapping = { ...currentMapping };
//     delete newMapping[crmItem.id];
//     setMapping(newMapping);
//   };

//   const handleSubmitImport = async () => {
//     if (!csvFile || !csvData) { setError("No CSV data to import."); return; }
    
//     const isNameMapped = fieldMappings.name?.length > 0;
//     const isContactMapped = fieldMappings.email?.length > 0 || fieldMappings.mobileNumber?.length > 0;
    
//     if (!isNameMapped || !isContactMapped) {
//         setError('Please map "Name" and either "Email" or "Mobile Number".');
//         return;
//     }
//     setError(null);
    
//     const payload = { fieldMappings, statusValueMapping, sourceValueMapping, ownerValueMapping };
//     console.log("Submitting payload:", payload);
    
//     try {
//       const formData = new FormData();
//       formData.append("csvFile", csvFile);
//       formData.append("mappings", JSON.stringify(payload));
//       // const res = await axios.post(POST_API.LEAD_IMPORT_VIA_CSV, formData, { withCredentials: true });
//       alert("Import simulated successfully! Check console for payload.");
//     } catch (err) {
//       setError("An unexpected error occurred during import.");
//     }
//   };

//   // --- RENDER LOGIC ---
//   const showStatusMapping = fieldMappings.leadStatus?.length > 0 && csvUniqueStatuses.length > 0;
//   const showSourceMapping = fieldMappings.leadSource?.length > 0 && csvUniqueSources.length > 0;
//   const showOwnerMapping = fieldMappings.leadOwner?.length > 0 && csvUniqueOwners.length > 0;

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="w-full h-screen bg-gray-100 overflow-auto flex flex-col p-4 space-y-4">
//         {/* Header */}
//         <div className="flex-shrink-0 flex items-center justify-between p-2 border-b-2 bg-white rounded-lg z-10">
//             <h2 className="text-lg font-semibold text-gray-800">Import Leads from CSV</h2>
//             <label htmlFor="csv-upload" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer shadow-sm">
//                 <FileUp className="w-5 h-5" />
//                 <span>{csvFile ? "Change File" : "Select CSV"}</span>
//                 <input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
//             </label>
//         </div>
        
//         {isParsing && <div className="p-3 bg-blue-100 rounded-md">Parsing CSV...</div>}
//         {error && <div className="p-3 bg-red-100 text-red-700 rounded-md font-bold">{error}</div>}

//         {/* Preview Section */}
//         {csvData && (
//           <div className="flex-shrink-0 p-4 border rounded-lg bg-white shadow-sm">
//             <div className="flex justify-between items-center mb-2">
//               <h4 className="text-md font-semibold text-gray-700">Preview (First 5 Rows)</h4>
//               <button onClick={() => setShowPreview(!showPreview)} className="text-sm text-blue-600 hover:underline">{showPreview ? "Hide" : "Show"}</button>
//             </div>
//             {showPreview && (
//               <div className="w-full overflow-x-auto border rounded-md">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50"><tr>{originalCsvHeaders.map((h, i) => <th key={i} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr></thead>
//                   <tbody>{csvData.slice(1, 6).map((row, i) => <tr key={i} className="border-t">{row.map((cell, j) => <td key={j} className="px-3 py-2">{cell}</td>)}</tr>)}</tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Main Mapping UI */}
//         {csvData && (
//           <>
//             <div className="flex-grow flex flex-col lg:flex-row w-full gap-6">
//               <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col gap-4">
//                 <div className="border rounded-lg p-3 bg-white shadow-sm">
//                   <h3 className="text-md font-semibold text-gray-800 mb-3">1. CSV Columns</h3>
//                   <ul className="space-y-2 max-h-96 overflow-y-auto">{originalCsvHeaders.map((h, i) => <DraggableCsvColumn key={i} header={h} />)}</ul>
//                 </div>
//               </div>
//               <div className="w-full lg:w-7/12 xl:w-8/12 flex flex-col">
//                 <div className="border rounded-lg p-4 bg-white flex-grow shadow-sm">
//                   <h3 className="text-md font-semibold text-gray-800 mb-4">2. Map Columns to CRM Fields</h3>
//                   <div className="space-y-4">{crmLeadFields.map(field => <DroppableCrmField key={field.id} field={field} mappedHeaders={fieldMappings[field.id] || []} onDrop={handleDropField} onRemoveMapping={handleRemoveFieldMapping} />)}</div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
//                 {showStatusMapping && <GenericValueMappingCard title="3. Map CSV Statuses" csvValues={csvUniqueStatuses} crmData={leadStatus} mapping={statusValueMapping} onDrop={(c, v) => handleValueMap(c, v, statusValueMapping, setStatusValueMapping)} onRemove={(c) => handleRemoveValueMap(c, statusValueMapping, setStatusValueMapping)} itemType={ItemTypes.CSV_STATUS_VALUE}/>}
//                 {showSourceMapping && <GenericValueMappingCard title="4. Map CSV Sources" csvValues={csvUniqueSources} crmData={leadSource} mapping={sourceValueMapping} onDrop={(c, v) => handleValueMap(c, v, sourceValueMapping, setSourceValueMapping)} onRemove={(c) => handleRemoveValueMap(c, sourceValueMapping, setSourceValueMapping)} itemType={ItemTypes.CSV_SOURCE_VALUE}/>}
//                 {showOwnerMapping && <GenericValueMappingCard title="5. Map Lead Owners" csvValues={csvUniqueOwners} crmData={companyUsers} mapping={ownerValueMapping} onDrop={(c, v) => handleValueMap(c, v, ownerValueMapping, setOwnerValueMapping)} onRemove={(c) => handleRemoveValueMap(c, ownerValueMapping, setOwnerValueMapping)} itemType={ItemTypes.CSV_OWNER_VALUE} onSearch={fetchCompanyUsers} searchPlaceholder="Search users by name..."/>}
//             </div>

//             <div className="mt-6 flex justify-end">
//               <button onClick={handleSubmitImport} disabled={isParsing || !csvFile} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow-sm disabled:bg-gray-400">Finalize and Import</button>
//             </div>
//           </>
//         )}
//       </div>
//       <DialogueBox isOpen={isDialogueOpen} onClose={() => setIsDialogueOpen(false)} onConfirm={handleDialogueConfirm} title="Session Expired!" message="Your session has expired. Please login again."/>
//     </DndProvider>
//   );
// };

// export default LeadImportCsv;
import { useState, ChangeEvent, useMemo, useEffect, useCallback } from "react";
import { FileUp, XCircle, ArrowRight, Search } from "lucide-react";
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
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import CompanyUser from "../../../../@types/company-users/CompanyUser";


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
    <li ref={drag} className={`bg-gray-100 text-gray-800 px-3 py-1.5 rounded text-sm border border-gray-200 shadow-sm cursor-grab ${isDragging ? "opacity-50" : ""}`}>
      {header}
    </li>
  );
};

const DraggableCsvValue: React.FC<{ value: string; type: string }> = ({ value, type, }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { name: value },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));
  return (
    <div ref={drag} className={`p-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm cursor-grab transition-all ${isDragging ? "opacity-40 scale-95" : "opacity-100"}`}>
      {value}
    </div>
  );
};

const DroppableCrmField: React.FC<{field: CrmField; mappedHeaders: string[]; onDrop: (id: string, header: string) => void; onRemoveMapping: (id: string, header: string) => void;}> = ({ field, mappedHeaders, onDrop, onRemoveMapping }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.CSV_COLUMN,
    drop: (item: DragItem) => {
      if (!mappedHeaders.includes(item.name)) onDrop(field.id, item.name);
    },
    collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  }));

  return (
    <div key={field.id} className="flex items-start gap-4">
      <label htmlFor={`map-${field.id}`} className="w-1/3 text-sm font-medium text-gray-700 pt-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div ref={drop} className={`w-2/3 min-h-[40px] border rounded-md p-2 flex flex-wrap gap-2 items-center transition-all ${isOver && canDrop ? "border-blue-500 bg-blue-50 ring-2" : "border-gray-300 bg-gray-50"} ${canDrop ? "border-dashed" : ""}`}>
        {mappedHeaders.length > 0 ? (
          mappedHeaders.map((header) => (
            <span key={header} className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
              {header}
              <XCircle className="ml-1 w-4 h-4 cursor-pointer" onClick={() => onRemoveMapping(field.id, header)}/>
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm italic">Drag column here</span>
        )}
      </div>
    </div>
  );
};

// Generic Value Mapping Card Component
interface ValueMappingCardProps<T extends MappableItem > {
  title: string;
  csvValues: string[];
  // Note : changes are done here.
  crmData: T[] | PostDataTypeForLeadSourceAndStatusAndStates[] | null;
  mapping: ValueMapping;
  onDrop: (crmItem: T, csvValue: string) => void;
  onRemove: (crmItem: T) => void;
  itemType: string;
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
}

const GenericValueMappingCard = <T extends MappableItem>({ title, csvValues, crmData, mapping, onDrop, onRemove, itemType, onSearch, searchPlaceholder }: ValueMappingCardProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const crmValues = crmData || [];
  const mappedCsvValues = Object.values(mapping);
  const unmappedCsvValues = csvValues.filter((v) => !mappedCsvValues.includes(v));

  const getMappedCsvValue = (crmId: number | null) => crmId ? mapping[String(crmId)] : undefined;
  
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if(e.key === 'Enter' && onSearch) {
          onSearch(searchTerm);
      }
  }

  //Note : Error during build to solve added any type
  const DroppableTarget: React.FC<{ crmItem: T |  any }> = ({ crmItem }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: itemType,
        drop: (item: DragItem) => onDrop(crmItem, item.name),
        collect: (monitor) => ({ isOver: !!monitor.isOver(), canDrop: !!monitor.canDrop() }),
      }), [crmItem, onDrop]
    );

    const mappedValue = getMappedCsvValue(crmItem.id);

    return (
      <div className="flex items-center gap-2">
        <div ref={drop} className={`flex-1 p-2 border rounded-md transition-all text-center h-10 flex items-center justify-center ${isOver && canDrop ? "border-green-500 bg-green-50 ring-2" : "border-gray-300"} ${mappedValue ? "bg-green-100" : "bg-white"}`}>
          {mappedValue ? (
            <div className="flex justify-between items-center w-full text-sm font-medium text-green-800">
              <span>{mappedValue}</span>
              <XCircle className="w-4 h-4 text-red-500 cursor-pointer" onClick={() => onRemove(crmItem)}/>
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

  return (
    <div className="border rounded-lg p-3 bg-gray-50/80 shadow-sm">
      <h3 className="text-md font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-sm text-center mb-2 text-gray-600">Your CSV Values (Drag)</h4>
          <div className="space-y-2 p-2 bg-white rounded-md border min-h-[100px] max-h-60 overflow-y-auto">
            {unmappedCsvValues.map((s) => <DraggableCsvValue key={s} value={s} type={itemType} />)}
          </div>
        </div>
        <div>
           {onSearch && (
               <div className="flex items-center gap-2 mb-2">
                   <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder={searchPlaceholder || "Search..."}
                        className="flex-grow p-2 border rounded-md text-sm"
                    />
                    <button onClick={() => onSearch(searchTerm)} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        <Search className="w-5 h-5"/>
                    </button>
               </div>
           )}
          <h4 className="font-medium text-sm text-center mb-2 text-gray-600">To CRM Values (Drop)</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {/* note : need to work on this error , not an error */}
            {crmValues.map((item) => item.id && <DroppableTarget key={item.id} crmItem={item} />)}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---
const LeadImportCsv = () => {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();
  
  // --- STATE ---
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
  const [ownerValueMapping, setOwnerValueMapping] = useState<ValueMapping>({});

  // Unique values from CSV
  const [csvUniqueStatuses, setCsvUniqueStatuses] = useState<string[]>([]);
  const [csvUniqueSources, setCsvUniqueSources] = useState<string[]>([]);
  const [csvUniqueOwners, setCsvUniqueOwners] = useState<string[]>([]);

  // Data from API
  const [leadStatus, setLeadStatus] = useState<PostDataTypeForLeadSourceAndStatusAndStates[] | null>(null);
  const [leadSource, setLeadSource] = useState<PostDataTypeForLeadSourceAndStatusAndStates[] | null>(null);
  const [companyUsers, setCompanyUsers] = useState<[]>([]);

  // --- STATIC DATA ---
  const crmLeadFields: CrmField[] = useMemo(() => [
      { id: "name", label: "Name", required: true },
      { id: "email", label: "Email", required: false },
      { id: "mobileNumber", label: "Mobile Number", required: false },
      { id: "leadOwner", label: "Lead Owner", required: false },
      { id: "leadStatus", label: "Lead Status", required: false },
      { id: "leadSource", label: "Lead Source", required: false },
      { id: "jobTitle", label: "Job Title", required: false },
      { id: "industry", label: "Industry", required: false },
      { id: "address", label: "Address", required: false },
    ], []);

  // --- API CALLS ---
  const fetchApiData = useCallback(async () => {
    // Note : Changes are done here in the setData type changed any -> PostDataTypeForLeadSourceAndStatusAndStates[]
    const callApi = async (url: string, setData: (data: PostDataTypeForLeadSourceAndStatusAndStates[]) => void, callFn: () => Promise<void>) => {
        const postDataForLeadStatusAndSource = { id: null, name: null, description: null, isactive: true };
        try {
            const response = await axios.post(url, postDataForLeadStatusAndSource, { withCredentials: true });
            if (response.status === STATUS_CODE.OK) {
                setData(response.data);
            }
        } catch (error: any) {
            if (error.response?.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({ callFunction: callFn });
                setIsDialogueOpen(!refreshTokenStatus);
            } else if (error.response?.status === STATUS_CODE.FORBIDDEN) {
                setIsDialogueOpen(true);
            }
        }
    };
    await callApi(POST_API.GET_LEAD_STATUS, setLeadStatus, fetchApiData);
    await callApi(POST_API.GET_LEAD_SOURCE, setLeadSource, fetchApiData);
  }, []);
  
  // Note : Api call to get the data Company User 
  const fetchCompanyUsers = async (searchParameter: string) => {
    const postData = {
      company_id: loginStatus.companyId,
      id: null,
      requestedby: loginStatus.id,
      limit: 50,
      offset: 0,
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
    } catch (error: any) {
      if (error.response?.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({ callFunction: () => fetchCompanyUsers(searchParameter) });
        if(refreshTokenStatus) {
            setIsDialogueOpen(false);
        } else {
            setIsDialogueOpen(true);
        }
      } else if (error.response?.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchApiData();
    fetchCompanyUsers("");
  }, [fetchApiData]);
  
  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };
  
  // --- EFFECTS ---
  useEffect(() => {
    if (originalCsvHeaders.length > 0) {
      const initialMappings: FieldMapping = {};
      crmLeadFields.forEach((field) => {
        const fieldIdLower = field.id.toLowerCase();
        const found = originalCsvHeaders.find(h => h.toLowerCase().replace(/ /g, "") === fieldIdLower);
        initialMappings[field.id] = found ? [found] : [];
      });
      setFieldMappings(initialMappings);
    }
  }, [originalCsvHeaders, crmLeadFields]);
  
  const extractUniqueValues = (fieldId: "leadStatus" | "leadSource" | "leadOwner", setUniqueValues: (v: string[]) => void) => {
    const mappedHeaders = fieldMappings[fieldId];
    if (!csvData || !mappedHeaders?.length) {
      setUniqueValues([]);
      return;
    }
    const indices = mappedHeaders.map(h => originalCsvHeaders.indexOf(h)).filter(i => i !== -1);
    const unique = new Set<string>();
    csvData.slice(1).forEach(row => {
      indices.forEach(index => {
        if (row[index]?.trim()) unique.add(row[index].trim());
      });
    });
    setUniqueValues(Array.from(unique));
  };
  
  useEffect(() => { extractUniqueValues("leadStatus", setCsvUniqueStatuses); setStatusValueMapping({});}, [csvData, fieldMappings.leadStatus]);
  useEffect(() => { extractUniqueValues("leadSource", setCsvUniqueSources); setSourceValueMapping({});}, [csvData, fieldMappings.leadSource]);
  useEffect(() => { extractUniqueValues("leadOwner", setCsvUniqueOwners); setOwnerValueMapping({});}, [csvData, fieldMappings.leadOwner]);

  // --- HANDLERS ---
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCsvFile(null); setCsvData(null); setOriginalCsvHeaders([]); setError(null);
    setFieldMappings({}); setStatusValueMapping({}); setSourceValueMapping({}); setOwnerValueMapping({});
    setCsvUniqueStatuses([]); setCsvUniqueSources([]); setCsvUniqueOwners([]);

    if (event.target.files?.[0]) {
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
        const lines = content.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
        if (lines.length < 1) throw new Error("CSV file is empty.");
        const parsedData = lines.map(line => line.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
        setCsvData(parsedData); setOriginalCsvHeaders(parsedData[0]); setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to parse CSV.");
      } finally {
        setIsParsing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleDropField = useCallback((crmFieldId: string, csvHeader: string) => {
    const singleMapFields = ["leadStatus", "leadSource", "leadOwner"];
    if (singleMapFields.includes(crmFieldId)) {
        setFieldMappings(prev => ({ ...prev, [crmFieldId]: [csvHeader] }));
    } else {
        setFieldMappings(prev => ({ ...prev, [crmFieldId]: [...(prev[crmFieldId] || []), csvHeader] }));
    }
  }, []);

  const handleRemoveFieldMapping = useCallback((crmFieldId: string, csvHeader: string) => {
    setFieldMappings(prev => ({ ...prev, [crmFieldId]: (prev[crmFieldId] || []).filter(h => h !== csvHeader) }));
  }, []);

  const handleValueMap = <T extends MappableItem>(crmItem: T, csvValue: string, currentMapping: ValueMapping, setMapping: (m: ValueMapping) => void) => {
    if (!crmItem.id) return;
    const newMapping = { ...currentMapping };
    Object.keys(newMapping).forEach(key => { if (newMapping[key] === csvValue) delete newMapping[key]; });
    newMapping[String(crmItem.id)] = csvValue;
    setMapping(newMapping);
  };
  
  const handleRemoveValueMap = <T extends MappableItem>(crmItem: T, currentMapping: ValueMapping, setMapping: (m: ValueMapping) => void) => {
    if (!crmItem.id) return;
    const newMapping = { ...currentMapping };
    delete newMapping[String(crmItem.id)];
    setMapping(newMapping);
  };

  // Note : api call for lead import 
  const handleSubmitImport = async () => {
    if (!csvFile || !csvData) { setError("No CSV data to import."); return; }
    
    const isNameMapped = fieldMappings.name?.length > 0;
    const isContactMapped = fieldMappings.email?.length > 0 || fieldMappings.mobileNumber?.length > 0;
    
    if (!isNameMapped || !isContactMapped) {
        setError('Please map "Name" and either "Email" or "Mobile Number".');
        return;
    }
    setError(null);
    
    const payload = { fieldMappings, statusValueMapping, sourceValueMapping, ownerValueMapping };
    console.log("Submitting payload:", payload);
    
    try {
        const formData = new FormData();
        formData.append("csvFile", csvFile);
        formData.append("mappings", JSON.stringify(payload));
      const res = await axios.post(POST_API.LEAD_IMPORT_VIA_CSV, formData, { withCredentials: true });
      alert(res);
      alert("Import simulated successfully! Check console for payload.");
      handleFileChange({ target: { files: null } } as any);
    } catch (error : any) {
      setError(error.message);
      setError("An unexpected error occurred during import.");
    }
  };

  // --- RENDER LOGIC ---
  const showStatusMapping = fieldMappings.leadStatus?.length > 0 && csvUniqueStatuses.length > 0;
  const showSourceMapping = fieldMappings.leadSource?.length > 0 && csvUniqueSources.length > 0;
  const showOwnerMapping = fieldMappings.leadOwner?.length > 0 && csvUniqueOwners.length > 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-screen bg-gray-100 overflow-auto flex flex-col p-4 space-y-4">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-2 border-b-2 bg-white rounded-lg z-10">
            <h2 className="text-lg font-semibold text-gray-800">Import Leads from CSV</h2>
            <label htmlFor="csv-upload" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer shadow-sm">
                <FileUp className="w-5 h-5" />
                <span>{csvFile ? "Change File" : "Select CSV"}</span>
                <input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            </label>
        </div>
        
        {isParsing && <div className="p-3 bg-blue-100 rounded-md">Parsing CSV...</div>}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md font-bold">{error}</div>}

        {/* Preview Section */}
        {csvData && (
          <div className="flex-shrink-0 p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-semibold text-gray-700">Preview (First 5 Rows)</h4>
              <button onClick={() => setShowPreview(!showPreview)} className="text-sm text-blue-600 hover:underline">{showPreview ? "Hide" : "Show"}</button>
            </div>
            {showPreview && (
              <div className="w-full overflow-x-auto border rounded-md">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>{originalCsvHeaders.map((h, i) => <th key={i} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr></thead>
                  <tbody>{csvData.slice(1, 6).map((row, i) => <tr key={i} className="border-t">{row.map((cell, j) => <td key={j} className="px-3 py-2">{cell}</td>)}</tr>)}</tbody>
                </table>
              </div>
            )}
            <div className="text-xs text-gray-500">
              Total records in csv file : {csvData.length-1}
            </div>
          </div>
        )}

        {/* Main Mapping UI */}
        {csvData && (
          <>
            <div className="flex-grow flex flex-col lg:flex-row w-full gap-6">
              <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col gap-4">
                <div className="border rounded-lg p-3 bg-white shadow-sm">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">1. CSV Columns</h3>
                  <ul className="space-y-2 max-h-96 overflow-y-auto">{originalCsvHeaders.map((h, i) => <DraggableCsvColumn key={i} header={h} />)}</ul>
                </div>
              </div>
              <div className="w-full lg:w-7/12 xl:w-8/12 flex flex-col">
                <div className="border rounded-lg p-4 bg-white flex-grow shadow-sm">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">2. Map Columns to CRM Fields</h3>
                  <div className="space-y-4">{crmLeadFields.map(field => <DroppableCrmField key={field.id} field={field} mappedHeaders={fieldMappings[field.id] || []} onDrop={handleDropField} onRemoveMapping={handleRemoveFieldMapping} />)}</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                {showStatusMapping && <GenericValueMappingCard title="3. Map CSV Statuses" csvValues={csvUniqueStatuses} crmData={leadStatus} mapping={statusValueMapping} onDrop={(c, v) => handleValueMap(c, v, statusValueMapping, setStatusValueMapping)} onRemove={(c) => handleRemoveValueMap(c, statusValueMapping, setStatusValueMapping)} itemType={ItemTypes.CSV_STATUS_VALUE}/>}
                {showSourceMapping && <GenericValueMappingCard title="4. Map CSV Sources" csvValues={csvUniqueSources} crmData={leadSource} mapping={sourceValueMapping} onDrop={(c, v) => handleValueMap(c, v, sourceValueMapping, setSourceValueMapping)} onRemove={(c) => handleRemoveValueMap(c, sourceValueMapping, setSourceValueMapping)} itemType={ItemTypes.CSV_SOURCE_VALUE}/>}
                {showOwnerMapping && <GenericValueMappingCard title="5. Map Lead Owners" csvValues={csvUniqueOwners} crmData={companyUsers} mapping={ownerValueMapping} onDrop={(c, v) => handleValueMap(c, v, ownerValueMapping, setOwnerValueMapping)} onRemove={(c) => handleRemoveValueMap(c, ownerValueMapping, setOwnerValueMapping)} itemType={ItemTypes.CSV_OWNER_VALUE} onSearch={fetchCompanyUsers} searchPlaceholder="Search users by name..."/>}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={handleSubmitImport} disabled={isParsing || !csvFile} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow-sm disabled:bg-gray-400">Finalize and Import</button>
            </div>
          </>
        )}
      </div>
      <DialogueBox isOpen={isDialogueOpen} onClose={() => setIsDialogueOpen(false)} onConfirm={handleDialogueConfirm} title="Session Expired!" message="Your session has expired. Please login again."/>
    </DndProvider>
  );
};

export default LeadImportCsv;
