/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, forwardRef } from "react";
import Papa from "papaparse";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Button from "../../../ui/Button";
import {
  XCircle,
  ArrowRight,
  X,
  Import,
  LucideFolderInput,
  Eye,
  EyeOff,
  TrashIcon,
} from "lucide-react";
import ConfirmationDialog from "../../../dialogue-box/ConfirmationDialogue";
import { SIZE } from "../../../../constants/AppConstants";

// ----------------- TYPES -----------------
interface Account {
  companyId: number;
  name: string;
  company_account_type_id: number;
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
  "company_account_type_id",
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

// ---------- companyAccountTypes (from your JSON) ----------
const companyAccountTypes: MappableItem[] = [
  { id: 25, name: "Etc (Reseller)" },
  { id: 9, name: "Goverment (Customer)" },
  { id: 19, name: "HCL Tech. (Customer)" },
  { id: 30, name: "Partner 1 (Partner)" },
  { id: 18, name: "Police (Customer)" },
  { id: 10, name: "Private (Customer)" },
  { id: 17, name: "RAW1 (Customer)" },
  { id: 11, name: "Shop (Reseller)" },
  { id: 12, name: "test1 (Vendor)" },
  { id: 13, name: "test2 (Customer)" },
  { id: 14, name: "test3 (Reseller)" },
  { id: 15, name: "test4 (Customer)" },
  { id: 16, name: "test5 (Vendor)" },
  { id: 36, name: "uuuuuu (Customer)" },
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
    <div >
      <div
      ref={drag}
      className="border rounded px-2 py-1 bg-gray-100 cursor-move text-sm mb-2"
    >
      {col}
    </div>
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
    // mapping: Record<csvValue, crmId>
    const mappedKeys = Object.keys(mapping); // csv values that are already mapped
    const unmappedCsvValues = csvValues.filter((v) => !mappedKeys.includes(v));

    const getMappedCsvValue = (crmId: number | null) =>
      crmId ? Object.keys(mapping).find((k) => mapping[k] === crmId) : undefined;

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
              isOver && canDrop ? "border-green-500 bg-green-50 ring-2" : "border-gray-300"
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
      <div ref={ref} className="border rounded-lg p-3 bg-gray-50/80 shadow-sm mt-4">
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
              {crmData.map((item) => item.id && <DroppableTarget key={item.id} crmItem={item} />)}
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

  const [industryValueMapping, setIndustryValueMapping] = useState<Record<string, number>>(
    {}
  );
  const [businessValueMapping, setBusinessValueMapping] = useState<Record<string, number>>(
    {}
  );
  // NEW: company account mapping state (csvValue -> companyAccountType id)
  const [companyAccountValueMapping, setCompanyAccountValueMapping] = useState<Record<string, number>>(
    {}
  );

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
      if (!prevCols.includes(col)) return { ...prev, [crmField]: [...prevCols, col] };
      return prev;
    });
  };

  const handleRemove = (crmField: string, col: string) => {
    setMapping((prev) => ({ ...prev, [crmField]: prev[crmField].filter((c) => c !== col) }));
  };

  // ----------------- VALUE MAPPING CARDS -----------------
  const industryCsvValues = mapping["industryTypeId"]?.length
    ? Array.from(new Set(csvData.map((r) => r[mapping["industryTypeId"][0]])))
    : [];
  const businessCsvValues = mapping["businessTypeId"]?.length
    ? Array.from(new Set(csvData.map((r) => r[mapping["businessTypeId"][0]])))
    : [];
  const companyAccountCsvValues = mapping["company_account_type_id"]?.length
    ? Array.from(new Set(csvData.map((r) => r[mapping["company_account_type_id"][0]])))
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

  // NEW: company account handlers
  const handleCompanyAccountDrop = (crmItem: MappableItem, csvValue: string) => {
    setCompanyAccountValueMapping((prev) => ({ ...prev, [csvValue]: crmItem.id }));
  };
  const handleCompanyAccountRemove = (crmItem: MappableItem) => {
    const newMap = { ...companyAccountValueMapping };
    Object.keys(newMap).forEach((k) => {
      if (newMap[k] === crmItem.id) delete newMap[k];
    });
    setCompanyAccountValueMapping(newMap);
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

          if (crmField === "industryTypeId") value = industryValueMapping[value] || null;
          else if (crmField === "businessTypeId")
            value = businessValueMapping[value] || null;
          else if (crmField === "company_account_type_id")
            value = companyAccountValueMapping[value] || null;
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
              "company_account_type_id",
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
    setCompanyAccountValueMapping({});
    setShowPreview(false);
    if (inputRef.current) inputRef.current.value = "";
    setShowConfirm(false);
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
            <div className="flex items-center justify-center gap-0.5">
              <LucideFolderInput size={SIZE.SIXTEEN} />
              Browse CSV
            </div>
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
                  type="button"
                  onClick={() => {
                    setShowConfirm(true);
                  }}
                >
                  <div className="flex items-center justify-center gap-0.5">
                    <TrashIcon size={SIZE.SIXTEEN} />
                    Remove file
                  </div>
                </Button>
              </div>
            </div>
            {/* CSV Preview */}
            <div>
              <div className="w-full flex justify-end">
                <div className="w-fit h-fit">
                  <Button onClick={() => setShowPreview(!showPreview)}>
                    {showPreview ? (
                      <div className="flex items-center justify-center gap-0.5">
                        <EyeOff size={SIZE.SIXTEEN} />
                        Hide CSV Preview
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-0.5">
                        <Eye size={SIZE.SIXTEEN} />
                        Show CSV Preview
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              {showPreview && (
                <div className="mt-4 border rounded p-4 bg-white overflow-x-auto">
                  <h3 className="font-semibold mb-2">CSV Preview (First 5 Rows)</h3>
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
                  <div className="grid grid-cols-2 gap-3">
                    {csvHeaders.map((col) => (
                    <CsvColumn key={col} col={col} />
                  ))}
                  </div>
                  
                </div>
                <div className="border w-fit rounded p-4 bg-gray-50">
                  <h3 className="font-semibold mb-2">2. Map Columns to CRM Fields</h3>

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

            {/* Industry & Business & Company Account Drag-Drop */}
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
            {companyAccountCsvValues.length > 0 && (
              <GenericValueMappingCard
                title="Map Company Account Type Values"
                csvValues={companyAccountCsvValues}
                crmData={companyAccountTypes}
                mapping={companyAccountValueMapping}
                onDrop={handleCompanyAccountDrop}
                onRemove={handleCompanyAccountRemove}
                itemType="CSV_COLUMN"
              />
            )}

            {/* Import Button */}
            <div className="flex w-full justify-end items-center">
              <div className="items-end mt-4 flex gap-3">
                <div className="w-fit h-fit">
                  <Button type="button" onClick={() => setShowConfirm(true)}>
                    <div className="flex items-center justify-center gap-0.5">
                      <X size={SIZE.SIXTEEN} />
                      Cancel
                    </div>
                  </Button>
                </div>
                <div className="w-fit h-fit">
                  <Button onClick={handleImport}>
                    <div className="flex items-center justify-center gap-0.5">
                      <Import size={SIZE.SIXTEEN} />
                      Import Accounts
                    </div>
                  </Button>
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
