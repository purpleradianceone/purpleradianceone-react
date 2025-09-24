/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Button from "../../../ui/Button";
import {  XCircle, ArrowRight, } from "lucide-react";
import { forwardRef } from "react";
import { number } from "framer-motion";
import ConfirmationDialog from "../../../dialogue-box/ConfirmationDialogue";

// ----------------- TYPES -----------------
interface Account {
  companyId: number;
  name: string;
  email: string;
  mobileNumber: string;
  industryTypeId: number;
  businessTypeId: number;
  pan: string;
  gst: string;
  tan: string;
  buillingAddress: string;
  shippingAddress: string;
  registeredOfficeAddress: string;
  businessResgistrationNumber: string;
  website: string;
  leadId: number;
  companyAccountTypeIdArray: number[];
  createdBy: number;
}

type Mapping = Record<string, string[]>;

interface MappableItem {
  id: number;
  name: string;
}

interface ValueMappingCardProps<T> {
  title: string;
  csvValues: string[];
  crmData: T[];
  mapping: Record<string, number>;
  onDrop: (crmItem: T, csvValue: string) => void;
  onRemove: (crmItem: T) => void;
  itemType: string;
  onSearch?: (term: string, offset?: number, limit?: number) => void;
  searchPlaceholder?: string;
  totalCrmItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

// ----------------- DUMMY DATA -----------------
const crmRequiredFields: (keyof Account)[] = [
  "companyId",
  "name",
  "email",
  "mobileNumber",
  "industryTypeId",
  "businessTypeId",
  "pan",
  "gst",
  "tan",
  "buillingAddress",
  "shippingAddress",
  "registeredOfficeAddress",
  "businessResgistrationNumber",
  "website",
  "leadId",
  "companyAccountTypeIdArray",
  "createdBy",
];

const industryTypes: MappableItem[] = [
  { id: 1, name: "Retail" },
  { id: 2, name: "Healthcare" },
  { id: 3, name: "Education" },
];

const businessTypes: MappableItem[] = [
  { id: 1, name: "Sole Proprietorship" },
  { id: 2, name: "Partnership" },
  { id: 3, name: "LLP" },
  { id: 4, name: "Private Limited" },
  { id: 5, name: "Public Limited" },
  { id: 6, name: "OPC" },
  { id: 7, name: "Government Office" },
  { id: 8, name: "Individual" },
];

// ----------------- DRAGGABLE CSV COLUMN -----------------
const CsvColumn: React.FC<{ col: string; type?: string }> = ({
  col,
  type = "CSV_COLUMN",
}) => {
  const [, drag] = useDrag(() => ({
    type,
    item: { name: col },
  }));
  return (
    <div
      ref={drag}
      className="border rounded px-2 py-1 bg-gray-100 cursor-move text-sm mb-2"
    >
      {col}
    </div>
  );
};

// ----------------- CRM FIELD DROP -----------------
const CrmFieldDrop: React.FC<{
  field: string;
  mappedCols: string[];
  onDrop: (field: string, col: string) => void;
  onRemove: (field: string, col: string) => void;
}> = ({ field, mappedCols, onDrop, onRemove }) => {
  const [, drop] = useDrop(() => ({
    accept: "CSV_COLUMN",
    drop: (item: any) => onDrop(field, item.name),
  }));
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="grid grid-cols-2 w-full gap-2">
        <span className="text-sm font-medium flex items-center">{field} :</span>
        <div
          ref={drop}
          className="flex flex-wrap items-center gap-2 border rounded px-2 py-1 min-h-[40px] bg-white"
        >
          {mappedCols.length === 0 && (
            <span className="text-xs text-gray-400">Drag column here</span>
          )}
          {mappedCols.map((col) => (
            <div
              key={col}
              className="flex items-center bg-blue-100 text-xs px-2 py-1 rounded"
            >
              {col}
              <button
                className="ml-1 text-red-500 font-bold"
                onClick={() => onRemove(field, col)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ----------------- GENERIC VALUE MAPPING CARD -----------------
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
    }: ValueMappingCardProps<T>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const mappedCsvValues = Object.values(mapping);
    const unmappedCsvValues = csvValues.filter(
      (v) => !mappedCsvValues.includes(number.parse(v))
    );

    const getMappedCsvValue = (crmId: number | null) =>
      crmId
        ? Object.keys(mapping).find((k) => mapping[k] === crmId)
        : undefined;

    const DroppableTarget: React.FC<{ crmItem: T }> = ({ crmItem }) => {
      const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: itemType,
        drop: (item: any) => onDrop(crmItem, item.name),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop(),
        }),
      }));

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
              <div className="flex justify-between items-center w-full">
                <span>{mappedValue}</span>
                <XCircle
                  className="w-4 h-4 text-red-500 cursor-pointer"
                  onClick={() => onRemove(crmItem)}
                />
              </div>
            ) : (
              <span>Drop here</span>
            )}
          </div>
          <ArrowRight className="text-gray-400 flex-shrink-0" />
          <div className="flex-1 p-2 bg-blue-100 rounded-md h-10 flex items-center justify-center">
            {crmItem.name}
          </div>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className="border rounded-lg p-3 bg-gray-50/80 shadow-sm mt-4"
      >
        <h3 className="font-semibold mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="mb-2 text-center">Your CSV Values (Drag)</h4>
            <div className="space-y-2 p-2 bg-white rounded-md border min-h-[100px] max-h-60 overflow-y-auto">
              {unmappedCsvValues.map((s) => (
                <CsvColumn key={s} col={s} type={itemType} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-center">CRM Values (Drop)</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {crmData.map(
                (item) =>
                  item.id && <DroppableTarget key={item.id} crmItem={item} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// ----------------- MAIN COMPONENT -----------------
export default function AccountCsvMapper() {
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Mapping>({});
  const [showPreview, setShowPreview] = useState(false);

  const [industryValueMapping, setIndustryValueMapping] = useState<
    Record<string, number>
  >({});
  const [businessValueMapping, setBusinessValueMapping] = useState<
    Record<string, number>
  >({});

  const inputRef = useRef<HTMLInputElement | null>(null);

  // ----------------- CSV PARSE -----------------
  const parseCsv = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setCsvHeaders(result.meta.fields || []);
        setCsvData(result.data as any[]);
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    parseCsv(e.target.files[0]);
  };

  // ----------------- NORMAL MAPPING -----------------
  const handleDrop = (crmField: string, col: string) => {
    setMapping((prev) => {
      const prevCols = prev[crmField] || [];
      if (!prevCols.includes(col))
        return { ...prev, [crmField]: [...prevCols, col] };
      return prev;
    });
  };

  const handleRemove = (crmField: string, col: string) => {
    setMapping((prev) => ({
      ...prev,
      [crmField]: prev[crmField].filter((c) => c !== col),
    }));
  };

  // ----------------- VALUE MAPPING CARDS -----------------
  const industryCsvValues = mapping["industryTypeId"]?.length
    ? Array.from(new Set(csvData.map((r) => r[mapping["industryTypeId"][0]])))
    : [];
  const businessCsvValues = mapping["businessTypeId"]?.length
    ? Array.from(new Set(csvData.map((r) => r[mapping["businessTypeId"][0]])))
    : [];

  const handleIndustryDrop = (crmItem: MappableItem, csvValue: string) => {
    setIndustryValueMapping((prev) => ({ ...prev, [csvValue]: crmItem.id }));
  };
  const handleIndustryRemove = (crmItem: MappableItem) => {
    const newMap = { ...industryValueMapping };
    Object.keys(newMap).forEach((k) => {
      if (newMap[k] === crmItem.id) delete newMap[k];
    });
    setIndustryValueMapping(newMap);
  };
  const handleBusinessDrop = (crmItem: MappableItem, csvValue: string) => {
    setBusinessValueMapping((prev) => ({ ...prev, [csvValue]: crmItem.id }));
  };
  const handleBusinessRemove = (crmItem: MappableItem) => {
    const newMap = { ...businessValueMapping };
    Object.keys(newMap).forEach((k) => {
      if (newMap[k] === crmItem.id) delete newMap[k];
    });
    setBusinessValueMapping(newMap);
  };

  // ----------------- IMPORT -----------------
  const handleImport = () => {
    const mappedData: Account[] = csvData.map((row) => {
      const obj: any = {};
      crmRequiredFields.forEach((crmField) => {
        const csvFields = mapping[crmField];
        if (csvFields && csvFields.length > 0) {
          let value =
            csvFields.length > 1
              ? csvFields
                  .map((col) => row[col] || "")
                  .join(" ")
                  .trim()
              : row[csvFields[0]];

          if (crmField === "industryTypeId")
            value = industryValueMapping[value] || null;
          else if (crmField === "businessTypeId")
            value = businessValueMapping[value] || null;
          else if (crmField === "companyAccountTypeIdArray") {
            obj[crmField] = value
              ? value.split(",").map((v: string) => parseInt(v.trim(), 10))
              : [];
            return;
          }

          if (
            [
              "companyId",
              "industryTypeId",
              "businessTypeId",
              "leadId",
              "createdBy",
            ].includes(crmField)
          )
            obj[crmField] = value ? parseInt(value, 10) : null;
          else obj[crmField] = value;
        }
      });
      return obj as Account;
    });
    console.log("✅ Final Accounts JSON:", mappedData);
  };

  const [showConfirm, setShowConfirm] = useState(false);

  
  function onclose() {
    setCsvHeaders([]);
    setCsvData([]);
    setMapping({});
    setIndustryValueMapping({});
    setBusinessValueMapping({});
    setShowPreview(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  // ----------------- RENDER -----------------
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 border-2 border-dashed rounded-md">
        <h2 className="text-lg font-bold mb-2">Account CSV Import & Mapper</h2>
        {!(csvHeaders.length > 0) && (
          <button
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
          >
            Browse CSV
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />

        {csvHeaders.length > 0 && (
          <div className="grid w-full grid-cols-1 gap-4">
            <div className="w-full flex justify-end">
              <div className="w-fit h-fit">
                <Button
                  onClick={() => {
                    setShowConfirm(true);
                  }}
                >
                  Remove file
                </Button>
              </div>
            </div>
            {/* CSV Preview */}
            <div>
              <div className="w-full flex justify-end">
                <div className="w-fit h-fit">
                  <Button onClick={() => setShowPreview(!showPreview)}>
                    {showPreview ? "Hide CSV Preview" : "Show CSV Preview"}
                  </Button>
                </div>
              </div>

              {showPreview && (
                <div className="mt-4 border rounded p-4 bg-white overflow-x-auto">
                  <h3 className="font-semibold mb-2">
                    CSV Preview (First 5 Rows)
                  </h3>
                  <table className="border-collapse border w-full text-xs min-w-[600px]">
                    <thead>
                      <tr>
                        {csvHeaders.map((h) => (
                          <th key={h} className="border p-1">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 5).map((row, i) => (
                        <tr key={i}>
                          {csvHeaders.map((h) => (
                            <td key={h} className="border p-1">
                              {row[h]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Normal CRM Fields */}
            <div className="grid grid-cols-1 w-full mt-4 gap-4">
              <div className="flex col-span-2 gap-6 min-w-[600px]">
                <div className="border rounded p-4 bg-gray-50 w-1/2">
                  <h3 className="font-semibold mb-2 w-fit">1. CSV Columns</h3>
                  {csvHeaders.map((col) => (
                    <CsvColumn key={col} col={col} />
                  ))}
                </div>
                <div className="border w-fit rounded p-4 bg-gray-50">
                  <h3 className="font-semibold mb-2">
                    2. Map Columns to CRM Fields
                  </h3>
                  {crmRequiredFields.map((field) => (
                    <CrmFieldDrop
                      key={field}
                      field={field}
                      mappedCols={mapping[field] || []}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Industry & Business Drag-Drop */}
            {industryCsvValues.length > 0 && (
              <GenericValueMappingCard
                title="Map Industry Type Values"
                csvValues={industryCsvValues}
                crmData={industryTypes}
                mapping={industryValueMapping}
                onDrop={handleIndustryDrop}
                onRemove={handleIndustryRemove}
                itemType="CSV_COLUMN"
              />
            )}
            {businessCsvValues.length > 0 && (
              <GenericValueMappingCard
                title="Map Business Type Values"
                csvValues={businessCsvValues}
                crmData={businessTypes}
                mapping={businessValueMapping}
                onDrop={handleBusinessDrop}
                onRemove={handleBusinessRemove}
                itemType="CSV_COLUMN"
              />
            )}

            {/* Import Button */}
            <div className="flex w-full justify-end items-center">
              <div className="items-end mt-4 flex gap-3">
                <div className="w-fit h-fit">
                  <Button onClick={()=>setShowConfirm(true)}>Cancel</Button>
                </div>
                <div className="w-fit h-fit">
                  <Button onClick={handleImport}>Import Accounts</Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showConfirm && (
            <ConfirmationDialog
              open={showConfirm}
              title="Are you sure to remove changes?"
              message={
                "Are you sure you want to cancel all changes on page?\nAll unsaved work will be lost."
              }
              onConfirm={() => onclose()}
              onCancel={() => setShowConfirm(false)}
            />
          )}
      </div>
    </DndProvider>
  );
}

// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useRef, useEffect } from "react";
// import Papa from "papaparse";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import Button from "../../../ui/Button";
// import { LucideArrowRight } from "lucide-react";

// interface Account {
//   companyId: number;
//   name: string;
//   email: string;
//   mobileNumber: string;
//   industryTypeId: number;
//   businessTypeId: number;
//   pan: string;
//   gst: string;
//   tan: string;
//   buillingAddress: string;
//   shippingAddress: string;
//   registeredOfficeAddress: string;
//   businessResgistrationNumber: string;
//   website: string;
//   leadId: number;
//   companyAccountTypeIdArray: number[];
//   createdBy: number;
// }

// type Mapping = Record<string, string[]>;

// const crmRequiredFields: (keyof Account)[] = [
//   "companyId",
//   "name",
//   "email",
//   "mobileNumber",
//   "industryTypeId",
//   "businessTypeId",
//   "pan",
//   "gst",
//   "tan",
//   "buillingAddress",
//   "shippingAddress",
//   "registeredOfficeAddress",
//   "businessResgistrationNumber",
//   "website",
//   "leadId",
//   "companyAccountTypeIdArray",
//   "createdBy",
// ];

// // Industry & Business Types
// const industryTypes = [
//   { id: 1, name: "Retail", isactive: true },
//   { id: 2, name: "Healthcare", isactive: true },
//   { id: 3, name: "Education", isactive: true },
// ];

// const businessTypes = [
//   { id: 1, name: "Sole Proprietorship", isactive: true },
//   { id: 2, name: "Partnership", isactive: true },
//   { id: 3, name: "Limited Liability Partnership (LLP)", isactive: true },
//   { id: 4, name: "Private Limited Company", isactive: true },
//   { id: 5, name: "Public Limited Company", isactive: true },
//   { id: 6, name: "One Person Company (OPC)", isactive: true },
//   { id: 7, name: "Government Office", isactive: true },
//   { id: 8, name: "Individual Person", isactive: true },
// ];

// // Draggable CSV column
// const CsvColumn: React.FC<{ col: string }> = ({ col }) => {
//   const [, drag] = useDrag(() => ({
//     type: "CSV_COLUMN",
//     item: { col },
//   }));
//   return (
//     <div
//       ref={drag}
//       className="border rounded px-2 py-1 bg-gray-100 cursor-move text-sm mb-2"
//     >
//       {col}
//     </div>
//   );
// };

// // Droppable CRM field
// const CrmFieldDrop: React.FC<{
//   field: string;
//   mappedCols: string[];
//   onDrop: (field: string, col: string) => void;
//   onRemove: (field: string, col: string) => void;
// }> = ({ field, mappedCols, onDrop, onRemove }) => {
//   const [, drop] = useDrop(() => ({
//     accept: "CSV_COLUMN",
//     drop: (item: any) => onDrop(field, item.col),
//   }));

//   return (
//     <div className="flex items-center justify-between mb-3">
//       <div className="grid grid-cols-2 w-full gap-2">
//         <span className="text-sm font-medium flex items-center">{field} :</span>
//         <div
//           ref={drop}
//           className="flex flex-wrap items-center gap-2 border rounded px-2 py-1 min-h-[40px] bg-white"
//         >
//           {mappedCols.length === 0 && (
//             <span className="text-xs text-gray-400">Drag column here</span>
//           )}
//           {mappedCols.map((col) => (
//             <div
//               key={col}
//               className="flex items-center bg-blue-100 text-xs px-2 py-1 rounded"
//             >
//               {col}
//               <button
//                 className="ml-1 text-red-500 font-bold"
//                 onClick={() => onRemove(field, col)}
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function AccountCsvMapper() {
//   const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
//   const [csvData, setCsvData] = useState<any[]>([]);
//   const [mapping, setMapping] = useState<Mapping>({});
//   const [showPreview, setShowPreview] = useState(false);

//   const [industryValueMapping, setIndustryValueMapping] = useState<Record<string, number>>({});
//   const [businessValueMapping, setBusinessValueMapping] = useState<Record<string, number>>({});

//   const inputRef = useRef<HTMLInputElement | null>(null);

//   // Parse CSV
//   const parseCsv = (file: File) => {
//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (result) => {
//         setCsvHeaders(result.meta.fields || []);
//         setCsvData(result.data as any[]);
//       },
//     });
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     parseCsv(e.target.files[0]);
//   };

//   const handleDrop = (crmField: string, col: string) => {
//     setMapping((prev) => {
//       const prevCols = prev[crmField] || [];
//       if (!prevCols.includes(col)) {
//         return { ...prev, [crmField]: [...prevCols, col] };
//       }
//       return prev;
//     });
//   };

//   const handleRemove = (crmField: string, col: string) => {
//     setMapping((prev) => ({
//       ...prev,
//       [crmField]: prev[crmField].filter((c) => c !== col),
//     }));
//   };

//   // Watch for mapped fields to extract unique values
//   useEffect(() => {
//     if (csvData.length === 0) return;

//     if (mapping["industryTypeId"]?.length) {
//       const col = mapping["industryTypeId"][0];
//       const uniqueVals = Array.from(new Set(csvData.map((r) => r[col])));
//       const obj: Record<string, number> = {};
//       uniqueVals.forEach((v) => (obj[v] = industryTypes[0]?.id || 0));
//       setIndustryValueMapping(obj);
//     }

//     if (mapping["businessTypeId"]?.length) {
//       const col = mapping["businessTypeId"][0];
//       const uniqueVals = Array.from(new Set(csvData.map((r) => r[col])));
//       const obj: Record<string, number> = {};
//       uniqueVals.forEach((v) => (obj[v] = businessTypes[0]?.id || 0));
//       setBusinessValueMapping(obj);
//     }
//   }, [mapping, csvData]);

//   const handleImport = () => {
//     const mappedData: Account[] = csvData.map((row) => {
//       const obj: any = {};
//       crmRequiredFields.forEach((crmField) => {
//         const csvFields = mapping[crmField];
//         if (csvFields && csvFields.length > 0) {
//           let value =
//             csvFields.length > 1
//               ? csvFields.map((col) => row[col] || "").join(" ").trim()
//               : row[csvFields[0]];

//           if (crmField === "industryTypeId") {
//             value = industryValueMapping[value] || null;
//           } else if (crmField === "businessTypeId") {
//             value = businessValueMapping[value] || null;
//           } else if (crmField === "companyAccountTypeIdArray") {
//             obj[crmField] = value
//               ? value.split(",").map((v: string) => parseInt(v.trim(), 10))
//               : [];
//             return;
//           }

//           if (
//             ["companyId", "industryTypeId", "businessTypeId", "leadId", "createdBy"].includes(
//               crmField
//             )
//           ) {
//             obj[crmField] = value ? parseInt(value, 10) : null;
//           } else {
//             obj[crmField] = value;
//           }
//         }
//       });
//       return obj as Account;
//     });

//     console.log("✅ Final Accounts JSON:", mappedData);
//   };

//   // Droppable area component for Industry/Business
//   const DroppableValue: React.FC<{
//     csvVal: string;
//     value: number;
//     setValue: (val: number) => void;
//     options: { id: number; name: string }[];
//   }> = ({ csvVal, value, setValue, options }) => {
//     const [, drop] = useDrop(() => ({
//       accept: "CSV_COLUMN",
//       drop: (item: any) => {
//         const match = options.find((o) => o.id.toString() === item.col);
//         if (match) setValue(match.id);
//       },
//     }));

//     return (
//       <div
//         ref={drop}
//         className="border rounded p-1 flex-1 min-w-[150px] bg-gray-50 flex items-center gap-1 cursor-pointer"
//       >
//         {options.find((o) => o.id === value)?.name || "Drop CSV column here"}
//       </div>
//     );
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="p-4 border-2 border-dashed rounded-md">
//         <h2 className="text-lg font-bold mb-2">Account CSV Import & Mapper</h2>

//         <button
//           onClick={() => inputRef.current?.click()}
//           className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
//         >
//           Browse CSV
//         </button>
//         <input
//           ref={inputRef}
//           type="file"
//           accept=".csv"
//           className="hidden"
//           onChange={handleFileUpload}
//         />

//         {csvHeaders.length > 0 && (
//           <div className="grid w-full grid-cols-1 gap-4">
// {/* CSV Preview */}
// <div>
//   <div className="w-full flex justify-end">
//     <div className="w-fit h-fit">
//       <Button onClick={() => setShowPreview(!showPreview)}>
//         {showPreview ? "Hide CSV Preview" : "Show CSV Preview"}
//       </Button>
//     </div>
//   </div>

//   {showPreview && (
//     <div className="mt-4 border rounded p-4 bg-white overflow-x-auto">
//       <h3 className="font-semibold mb-2">
//         CSV Preview (First 5 Rows)
//       </h3>
//       <table className="border-collapse border w-full text-xs min-w-[600px]">
//         <thead>
//           <tr>
//             {csvHeaders.map((h) => (
//               <th key={h} className="border p-1">
//                 {h}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {csvData.slice(0, 5).map((row, i) => (
//             <tr key={i}>
//               {csvHeaders.map((h) => (
//                 <td key={h} className="border p-1">
//                   {row[h]}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )}
// </div>

//             {/* Drag & Drop Mapper */}
//             <div className="grid grid-cols-1 w-full">
//               <div className="grid grid-cols-1 justify-center items-center">
//                 <div className="w-full"> Drag fields from left to right</div>
//                 <LucideArrowRight className="w-full" />
//               </div>
//               <div className="flex col-span-2 gap-6 min-w-[600px]">
//                 {/* CSV Columns */}
//                 <div className="border rounded p-4 bg-gray-50">
//                   <h3 className="font-semibold mb-2 w-fit">1. CSV Columns</h3>
//                   <div className="h-fit w-fit overflow-y-auto pr-2">
//                     {csvHeaders.map((col) => (
//                       <CsvColumn key={col} col={col} />
//                     ))}
//                   </div>
//                 </div>

//                 {/* CRM Fields */}
//                 <div className="border w-fit rounded p-4 bg-gray-50">
//                   <h3 className="font-semibold mb-2">
//                     2. Map Columns to CRM Fields
//                   </h3>
//                   {crmRequiredFields.map((field) => (
//                     <CrmFieldDrop
//                       key={field}
//                       field={field}
//                       mappedCols={mapping[field] || []}
//                       onDrop={handleDrop}
//                       onRemove={handleRemove}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Industry Mapping */}
//         {Object.keys(industryValueMapping).length > 0 && (
//           <div className="mt-6 border p-4 rounded bg-white">
//             <h3 className="font-semibold mb-2">Map Industry Values</h3>
//             {Object.keys(industryValueMapping).map((csvVal) => (
//               <div key={csvVal} className="flex items-center mb-2 gap-2">
//                 <span className="w-48">{csvVal}</span>
//                 <DroppableValue
//                   csvVal={csvVal}
//                   value={industryValueMapping[csvVal]}
//                   setValue={(val) =>
//                     setIndustryValueMapping((prev) => ({
//                       ...prev,
//                       [csvVal]: val,
//                     }))
//                   }
//                   options={industryTypes}
//                 />
//                 <select
//                   className="border rounded p-1"
//                   value={industryValueMapping[csvVal]}
//                   onChange={(e) =>
//                     setIndustryValueMapping((prev) => ({
//                       ...prev,
//                       [csvVal]: parseInt(e.target.value, 10),
//                     }))
//                   }
//                 >
//                   {industryTypes.map((it) => (
//                     <option key={it.id} value={it.id}>
//                       {it.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Business Mapping */}
//         {Object.keys(businessValueMapping).length > 0 && (
//           <div className="mt-6 border p-4 rounded bg-white">
//             <h3 className="font-semibold mb-2">Map Business Type Values</h3>
//             {Object.keys(businessValueMapping).map((csvVal) => (
//               <div key={csvVal} className="flex items-center mb-2 gap-2">
//                 <span className="w-48">{csvVal}</span>
//                 <DroppableValue
//                   csvVal={csvVal}
//                   value={businessValueMapping[csvVal]}
//                   setValue={(val) =>
//                     setBusinessValueMapping((prev) => ({
//                       ...prev,
//                       [csvVal]: val,
//                     }))
//                   }
//                   options={businessTypes}
//                 />
//                 <select
//                   className="border rounded p-1"
//                   value={businessValueMapping[csvVal]}
//                   onChange={(e) =>
//                     setBusinessValueMapping((prev) => ({
//                       ...prev,
//                       [csvVal]: parseInt(e.target.value, 10),
//                     }))
//                   }
//                 >
//                   {businessTypes.map((bt) => (
//                     <option key={bt.id} value={bt.id}>
//                       {bt.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>
//         )}

//         {csvData.length > 0 && (
//           <div className="mt-4 flex gap-4">
//             <button
//               className="px-4 py-2 bg-green-600 text-white rounded"
//               onClick={handleImport}
//             >
//               Import Accounts
//             </button>
//           </div>
//         )}
//       </div>
//     </DndProvider>
//   );
// }
