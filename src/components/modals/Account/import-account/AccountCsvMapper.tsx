/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, forwardRef, useEffect } from "react";
import Papa from "papaparse";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Button from "../../../ui/Button";
import {
  XCircle,
  ArrowRight,
  X,
  LucideFolderInput,
  Eye,
  EyeOff,
  TrashIcon,
  LucideScanEye,
  Info,
} from "lucide-react";
import ConfirmationDialog from "../../../dialogue-box/ConfirmationDialogue";
import { SIZE } from "../../../../constants/AppConstants";
import { useCompanyAccountType } from "../../../../config/hooks/useCompanyAccountType";
import { usebusinessType } from "../../../../config/hooks/useBusinessType";
import { useIndustryType } from "../../../../config/hooks/useIndustryType";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import MappedAccountDataPopup from "./MappedAccountDataPreview";
import COLORS from "../../../../constants/Colors";

// ----------------- TYPES -----------------
export interface Account {
  company_id: number;
  company_account_type_id: number[];
  import_tag: string;
  name: string;
  email: string;
  mobilenumber: string;
  industry_type_id: number;
  business_type_id: number;
  country_name: string;
  state_name: string;
  district_name: string;
  pan: string;
  gst: string;
  tan: string;
  billing_address: string;
  shipping_address: string;
  registered_office_address: string;
  business_registration_number: string;
  website: string;
  account_created_on: string;
  createdby: number;
}

type Mapping = Record<string, string[]>;

export interface MappableItem {
  id: number;
  name: string;
  isactive: boolean;
}

/**
 * Maps any array of objects into MappableItem[]
 * if they contain the required fields.
 */
function toMappableItems<
  T extends {
    id?: number | null;
    name?: string | null;
    companyAccountTypeName?: string | null;
    accountTypeName?: string | null;
    isactive?: boolean | null;
  }
>(data: T[]): MappableItem[] {
  return data
    .filter((item) => item.id !== null && item.id !== undefined) // skip invalid ids
    .map((item) => ({
      id: item.id ?? 0,
      name:
        item.name && item.name.trim() !== ""
          ? item.name
          : `${item.companyAccountTypeName} (${item.accountTypeName})`,
      isactive: item.isactive ?? false, // null → false
    }));
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
  "name",
  "email",
  "mobilenumber",
  "industry_type_id",
  "business_type_id",
  "country_name",
  "state_name",
  "district_name",
  "company_account_type_id",
  "pan",
  "gst",
  "tan",
  "billing_address",
  "shipping_address",
  "registered_office_address",
  "business_registration_number",
  "website",
  "account_created_on",
  // "leadId",
  // "createdby",
];
const fieldVariables: Record<string, string> = {
  name: "Name",
  email: "Email",
  mobilenumber: "Mobile Number",
  industry_type_id: "Industry Type Name",
  business_type_id: "Business Type Name",
  country_name: "Country",
  state_name: "State",
  district_name: "District",
  company_account_type_id: "Account Type Name",
  pan: "PAN",
  gst: "GST",
  tan: "TAN",
  billing_address: "Billing Address",
  shipping_address: "Shipping Address",
  registered_office_address: "Reg.Office Address",
  business_registration_number: "Business Reg No",
  website: "Website",
  account_created_on: "Account Created On",
  // leadId: "Lead ID",
  // createdby: "Created By",
};

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
    <div>
      <div
        ref={drag}
        className="border rounded table-data-custom px-2 py-1 bg-gray-100 cursor-move text-sm "
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
    <div className="grid grid-cols-2 gap-2 items-center mb-3">
      {/* Field Label */}
      <span className="text-sm input-label-custom font-medium flex items-center">
        {fieldVariables[field]} :
      </span>

      {/* Droppable Area */}
      <div
        ref={drop}
        className="flex flex-wrap items-center gap-2 border rounded px-2 py-1 min-h-[40px] h-fit bg-white"
      >
        {mappedCols.length === 0 && (
          <span className="caption-custom">Drop csv columns here</span>
        )}
        {mappedCols.map((col) => (
          <div
            key={col}
            className="flex caption-custom-black justify-between items-center bg-blue-100 text-xs px-1 py-1 rounded gap-1"
          >
            {col}
            <XCircle
              className={`w-3 h-4 ${COLORS.CANCEL_BUTTON_TEXT_COLOR} cursor-pointer`}
              onClick={() => onRemove(field, col)}
            />
          </div>
        ))}
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
              <div className="flex table-data-custom justify-between items-center w-full gap-1">
                <span>{mappedValue}</span>
                <XCircle
                  className={`w-4 h-4 ${COLORS.CANCEL_BUTTON_TEXT_COLOR} cursor-pointer`}
                  onClick={() => onRemove(crmItem)}
                />
              </div>
            ) : (
              <span className="caption-custom">Drop here</span>
            )}
          </div>
          <ArrowRight className="caption-custom flex-shrink-0" />
          <div className="flex-1 p-2 table-header-custom bg-blue-100 rounded-md h-10 flex items-center justify-center">
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
        <h3 className="section-header-custom mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="table-header-custom mb-2 text-center">
              CSV Values (Drag)
            </h4>
            <div className="space-y-2 p-2 bg-white rounded-md border min-h-[100px] max-h-60 overflow-y-auto">
              {unmappedCsvValues.map((s) => (
                <CsvColumn key={s} col={s} type={itemType} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="table-header-custom mb-2 text-center">
              CRM Values (Drop)
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
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
export default function AccountCsvMapper({
  handleButtonClicked,
}: {
  handleButtonClicked: (value: boolean) => void;
}) {
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
  const { loginStatus } = useLoggedInUserContext();
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
    handleButtonClicked(true);
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
  const industryCsvValues = mapping["industry_type_id"]?.length
    ? Array.from(new Set(csvData.map((r) => r[mapping["industry_type_id"][0]])))
    : [];
  const businessCsvValues = mapping["business_type_id"]?.length
    ? Array.from(new Set(csvData.map((r) => r[mapping["business_type_id"][0]])))
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

  const companyAccountArrayCsvValues = mapping["company_account_type_id"]
    ?.length
    ? Array.from(
        new Set(csvData.map((r) => r[mapping["company_account_type_id"][0]]))
      )
    : [];

  // ----------------- DRAG AND DROP MAPPING FOR COMPANY_ACCOUNT_TYPE-----------------

  const accountTypeNamesFromCsv: string[] = Array.from(
    new Set(
      companyAccountArrayCsvValues.flatMap((row) =>
        row ? row.split(",").map((v: string) => v.trim()) : []
      )
    )
  );

  const [customerTypeMapping, setCustomerTypeMapping] = useState<
    Record<string, number[]>
  >({});

  const handleMappingChange = (csvValue: string, newIds: number[]) => {
    setCustomerTypeMapping((prev) => ({ ...prev, [csvValue]: newIds }));
  };

  const CsvValueItem: React.FC<{ value: string }> = ({ value }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "CSV_VALUE",
      item: { value },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        className={`px-2 py-1 table-data-custom rounded-md border text-sm cursor-move ${
          isDragging ? "opacity-50" : "bg-gray-100"
        }`}
      >
        {value}
      </div>
    );
  };

  interface AccountTypeDropProps {
    crmItem: MappableItem;
    mapping: Record<string, number[]>; // e.g. { "Regular": [25, 18] }
    onChange: (csvValue: string, newIds: number[]) => void;
  }

  const AccountTypeDrop: React.FC<AccountTypeDropProps> = ({
    crmItem,
    mapping,
    onChange,
  }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: "CSV_VALUE",
      drop: (item: { value: string }) => {
        const current = mapping[item.value] || [];
        if (!current.includes(crmItem.id)) {
          onChange(item.value, [...current, crmItem.id]);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }));

    // All CSV values mapped to this crmItem
    const mappedCsvValues = Object.entries(mapping)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_csvValue, ids]) => ids.includes(crmItem.id))
      .map(([csvValue]) => csvValue);

    return (
      <div className="flex items-center gap-2">
        {/* Drop area */}
        <div
          ref={drop}
          className={`flex-1 p-2 border rounded-md transition-all text-center min-h-10 h-fit flex items-center justify-center
          ${
            isOver && canDrop
              ? "border-green-500 bg-green-50 ring-2"
              : "border-gray-300"
          }
          ${mappedCsvValues.length ? "bg-green-100" : "bg-white"}
        `}
        >
          {mappedCsvValues.length ? (
            <div className="flex justify-between items-center w-full gap-1 flex-wrap max-h-fit overflow-y-auto">
              {mappedCsvValues.map((csv) => (
                <div
                  key={csv}
                  className="flex table-data-custom justify-between items-center w-full gap-1 bg-green-100 rounded-md text-sm "
                >
                  <span>{csv}</span>
                  <XCircle
                    className={`w-4 h-4 ${COLORS.CANCEL_BUTTON_TEXT_COLOR} cursor-pointer`}
                    onClick={() => {
                      const currentIds = mapping[csv] || [];
                      const updatedIds = currentIds.filter(
                        (id) => id !== crmItem.id
                      );
                      onChange(csv, updatedIds);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <span className="caption-custom">Drop here</span>
          )}
        </div>

        {/* Arrow */}
        <ArrowRight className="caption-custom flex-shrink-0" />

        {/* CRM Item */}
        <div className="flex-1 p-2 table-header-custom bg-blue-100 rounded-md h-10 flex items-center justify-center">
          {crmItem.name}
        </div>
      </div>
    );
  };

  //=================MultipleTypeMapper====================//
  interface MultipleTypeMapperProps {
    title: string; // section title
    csvValues: string[]; // list of CSV values
    crmValues: MappableItem[]; // CRM values
    mapping: Record<string, number[]>; // csvValue -> [crmItem.id...]
    onMappingChange: (csvValue: string, ids: number[]) => void;
  }

  const MultipleTypeMapper: React.FC<MultipleTypeMapperProps> = ({
    title,
    csvValues,
    crmValues,
    mapping,
    onMappingChange,
  }) => {
    return (
      <div className="border rounded-lg p-3 bg-gray-50 shadow-sm mt-4">
        <h3 className="section-header-custom mb-3">{title}</h3>

        <div className="grid grid-cols-2 gap-6">
          {/* Left: CSV Values */}
          <div>
            <h3 className="table-header-custom mb-3">CSV Values (Drag)</h3>
            <div className="space-y-2 p-2 bg-white rounded-md border min-h-[100px] max-h-60 overflow-y-auto">
              {csvValues.map((val) => (
                <CsvValueItem key={val} value={val} />
              ))}
            </div>
          </div>

          {/* Right: CRM Values */}
          <div>
            <h3 className="table-header-custom mb-3">CRM Values (Drop)</h3>
            <div className="grid grid-cols-1 gap-3 space-y-2 max-h-96 overflow-y-auto">
              {crmValues.map((crm) => (
                <AccountTypeDrop
                  key={crm.id}
                  crmItem={crm}
                  mapping={mapping}
                  onChange={onMappingChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  //=============================================================================================//

  const [mappedData, setMappedData] = useState<Account[]>([]);

  //------------------ unique account tag ------------

  function generateUniqueAccountId(): string {
    const prefix = "ACC_";
    // Get current date & time in YYYYMMDDHHmmss format
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const dateTimeStr = `${year}:${month}:${day}_${hours}:${minutes}:${seconds}`;

    // Add small random part to ensure uniqueness if called multiple times in same second
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `${prefix}${dateTimeStr}_${randomStr}`;
  }

  // ----------------- IMPORT -----------------
  const handleImport = () => {
    const accountTag = generateUniqueAccountId();
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

          if (crmField === "industry_type_id")
            value = industryValueMapping[value] || null;
          else if (crmField === "business_type_id")
            value = businessValueMapping[value] || null;
          else if (crmField === "company_account_type_id") {
            // Use your drag-and-drop mapping
            // `customerTypeMapping` should be Record<string, number[]>
            const csvValues = value
              ? value.split(",").map((v: string) => v.trim())
              : [];
            obj[crmField] = csvValues.flatMap(
              (csvVal: string) => customerTypeMapping[csvVal] || []
            );
            return;
          }

          if (
            [
              "company_id",
              "industry_type_id",
              "business_type_id",
              "leadId",
              "createdby",
            ].includes(crmField)
          )
            obj[crmField] = value ? parseInt(value, 10) : null;
          else obj[crmField] = value;
        }
      });

      obj.company_id = loginStatus.companyId;
      obj.createdby = loginStatus.id;
      obj.import_tag = accountTag;
      return obj as Account;
    });
    setMappedData(mappedData);
    // console.log("✅ Final Accounts JSON:", mappedData); // for debugging
    setShowPopup(true);
  };

  const { industryTypeData, loading } = useIndustryType();
  const { businessType, isLoading: businessTypeLoading } = usebusinessType();
  const { companyAccountType, isLoading: companyTypeLoading } =
    useCompanyAccountType();

  //Dummy filds
  let industryTypes: MappableItem[] = [
    { id: 1, name: "Retail", isactive: true },
    { id: 2, name: "Healthcare", isactive: true },
    { id: 3, name: "Education", isactive: true },
  ];
  industryTypes = toMappableItems(industryTypeData);

  let businessTypes: MappableItem[] = [
    { id: 1, name: "Sole Proprietorship", isactive: true },
    { id: 2, name: "Partnership", isactive: true },
    { id: 3, name: "LLP", isactive: true },
    { id: 4, name: "Private Limited", isactive: true },
    { id: 5, name: "Public Limited", isactive: true },
    { id: 6, name: "OPC", isactive: true },
    { id: 7, name: "Government Office", isactive: true },
    // { id: 8, name: "Individual" , isactive:true},
  ];

  businessTypes = toMappableItems(businessType);

  // ---------- companyAccountTypes (from your JSON) ----------
  let companyAccountTypes: MappableItem[] = [
    { id: 25, name: "Etc (Reseller)", isactive: true },
    { id: 9, name: "Goverment (Customer)", isactive: true },
    { id: 19, name: "HCL Tech. (Customer)", isactive: true },
    { id: 30, name: "Partner 1 (Partner)", isactive: true },
    { id: 18, name: "Police (Customer)", isactive: true },
    { id: 10, name: "Private (Customer)", isactive: true },
    { id: 17, name: "RAW1 (Customer)", isactive: true },
    { id: 11, name: "Shop (Reseller)", isactive: true },
    { id: 12, name: "test1 (Vendor)", isactive: true },
    { id: 13, name: "test2 (Customer)", isactive: true },
    { id: 14, name: "test3 (Reseller)", isactive: true },
    { id: 15, name: "test4 (Customer)", isactive: true },
    { id: 16, name: "test5 (Vendor)", isactive: true },
    { id: 36, name: "uuuuuu (Customer)", isactive: true },
  ];

  companyAccountTypes = toMappableItems(companyAccountType);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  function onCloseSuccessOrConfirmation() {
    handleButtonClicked(false);
    setCsvHeaders([]);
    setCsvData([]);
    setMapping({});
    setIndustryValueMapping({});
    setBusinessValueMapping({});
    setCustomerTypeMapping({});
    setShowPreview(false);
    if (inputRef.current) inputRef.current.value = "";
    setShowConfirm(false);
  }

  const industryCardRef = useRef<HTMLDivElement | null>(null);
  const businessCarRef = useRef<HTMLDivElement | null>(null);
  const companyAccountCarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (industryCsvValues.length > 0 && industryCardRef.current) {
      industryCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [industryCsvValues.length]); // run when values change

  useEffect(() => {
    if (businessCsvValues.length > 0 && businessCarRef.current) {
      businessCarRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [businessCsvValues.length]);

  useEffect(() => {
    console.log(accountTypeNamesFromCsv);
    if (companyAccountArrayCsvValues.length === 0) {
      setCustomerTypeMapping({});
    }
    if (
      companyAccountArrayCsvValues.length > 0 &&
      companyAccountCarRef.current
    ) {
      companyAccountCarRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [companyAccountArrayCsvValues.length]);

  // ----------------- RENDER -----------------
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 border-2 w-full border-dashed rounded-md">
        <h2 className="section-header-custom">Account CSV Import & Mapper</h2>

        {!(
          csvHeaders.length > 0 ||
          loading ||
          businessTypeLoading ||
          companyTypeLoading
        ) && (
          <div className="flex justify-center items-center w-full">
            <div className="w-fit h-fit">
              <Button onClick={() => inputRef.current?.click()}>
                <div className="flex items-center justify-center gap-0.5">
                  <LucideFolderInput size={SIZE.SIXTEEN} />
                  Browse CSV
                </div>
              </Button>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />
        {(loading || businessTypeLoading || companyTypeLoading) && (
          <div className="flex justify-center items-center h-fit">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}
        {!loading && !businessTypeLoading && !companyTypeLoading && (
          <div>
            {csvHeaders.length > 0 && (
              <div className="grid w-full grid-cols-1 gap-4">
                <div>
                  {/* Preview Section */}
                  {csvData && (
                    <div className="flex-shrink-0 p-2 border rounded-lg bg-white shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="table-header-custom">
                          Preview (First 5 Rows)
                        </h4>
                        <div className="flex gap-3">
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
                          <div className="w-fit h-fit">
                            <Button
                              onClick={() => setShowPreview(!showPreview)}
                            >
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
                      </div>
                      {showPreview && (
                        <div className="w-full overflow-x-auto border rounded-md">
                          <table className="w-full text-sm min-w-[2500px]">
                            <thead className="bg-gray-50 ">
                              <tr>
                                {csvHeaders.map((h, i) => (
                                  <th
                                    key={i}
                                    className="border p-1 px-3 py-2 text-left table-header-custom w-fit"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {csvData.slice(0, 5).map((row, i) => (
                                <tr
                                  key={i}
                                  className="border-t table-data-custom"
                                >
                                  {csvHeaders.map((h) => (
                                    <td
                                      key={h}
                                      className="border p-1 px-3 py-2"
                                    >
                                      {row[h]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <div className="caption-custom">
                        Total records in csv file : {csvData.length}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 w-full mt-4 gap-4">
                  <div className="flex col-span-2 gap-4 w-full">
                    {/*  CSV Fields */}
                    <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col gap-1">
                      <div className="border rounded-lg p-3 bg-white shadow-sm">
                        <h3 className=" flex items-center gap-1 table-header-custom mb-3">
                          <span>1. CSV Columns</span>
                          <span
                            className="table-data-custom cursor-pointer"
                            title="Available Columns From Given CSV File."
                          >
                            <Info size={12} className="" />
                          </span>
                        </h3>
                        <ul className="grid max-h-[600px] overflow-y-auto grid-col-1 sm:grid-cols-2 gap-2">
                          {csvHeaders.map((col) => (
                            <CsvColumn key={col} col={col} />
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Normal CRM Fields */}
                    <div className="w-full  lg:w-7/12 xl:w-8/12 flex flex-col">
                      <div className="border rounded-lg p-4 bg-white flex-grow shadow-sm">
                        <h3 className=" flex items-center gap-2 table-header-custom mb-4">
                          <span>2. Map Columns to CRM Fields </span>
                          <span
                            className="table-data-custom cursor-pointer"
                            title="You can add multiple columns for single crn fields for concatination. Eg: for Full Name : if in CSV File available data is first name and last name then you can add both in Full Name field. Data will be concatinated"
                          >
                            <Info size={12} />
                          </span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  </div>
                </div>

                {/* Industry & Business & Company Account Drag-Drop */}
                {industryCsvValues.length > 0 && (
                  <div ref={industryCardRef}>
                    <GenericValueMappingCard
                      title="Map Industry Types"
                      csvValues={industryCsvValues}
                      crmData={industryTypes}
                      mapping={industryValueMapping}
                      onDrop={handleIndustryDrop}
                      onRemove={handleIndustryRemove}
                      itemType="CSV_COLUMN"
                    />
                  </div>
                )}
                {businessCsvValues.length > 0 && (
                  <div ref={businessCarRef}>
                    <GenericValueMappingCard
                      title="Map Business Types"
                      csvValues={businessCsvValues}
                      crmData={businessTypes}
                      mapping={businessValueMapping}
                      onDrop={handleBusinessDrop}
                      onRemove={handleBusinessRemove}
                      itemType="CSV_COLUMN"
                    />
                  </div>
                )}

                {companyAccountArrayCsvValues.length > 0 && (
                  <div ref={companyAccountCarRef}>
                    <MultipleTypeMapper
                      title="Map Company Account Types"
                      csvValues={accountTypeNamesFromCsv}
                      crmValues={companyAccountTypes}
                      mapping={customerTypeMapping}
                      onMappingChange={handleMappingChange}
                    />
                  </div>
                )}

                {/* Import Button */}
                <div className="flex w-full justify-end items-center">
                  <div className="items-end mt-4 flex gap-3">
                    <div className="w-fit h-fit">
                      <Button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                      >
                        <div className="flex items-center justify-center gap-0.5">
                          <X size={SIZE.SIXTEEN} />
                          Cancel
                        </div>
                      </Button>
                    </div>
                    <div className="w-fit h-fit">
                      <Button onClick={handleImport}>
                        <div className="flex items-center justify-center gap-0.5">
                          <LucideScanEye size={SIZE.SIXTEEN} />
                          Preview Mapped Data
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <MappedAccountDataPopup
          open={showPopup}
          onClose={() => setShowPopup(false)}
          onCloseSuccessOrConfirmation={() => onCloseSuccessOrConfirmation()}
          mappedData={mappedData}
          fieldVariables={fieldVariables}
          industryTypes={industryTypes}
          businessTypes={businessTypes}
          companyAccountTypes={companyAccountTypes}
        />
      </div>
      {showConfirm && (
        <ConfirmationDialog
          open={showConfirm}
          title="Are you sure to remove changes?"
          message={
            "Are you sure you want to cancel all changes on page?\nAll unsaved work will be lost."
          }
          onConfirm={() => onCloseSuccessOrConfirmation()}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </DndProvider>
  );
}
