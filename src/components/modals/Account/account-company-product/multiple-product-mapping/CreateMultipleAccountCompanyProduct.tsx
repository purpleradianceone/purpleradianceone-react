/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import POST_API from "../../../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import { useCreateCall } from "../../../../../config/hooks/useCreateAccountCompanyProruct";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../../../@types/error/ApiError";
import { STATUS_CODE } from "../../../../../constants/AppConstants";
import RefreshToken from "../../../../../config/validations/RefreshToken";
import FormInput from "../../../../ui/FormInput";
import DatePickerInput from "../../../../ui/DatePickerInput";
import {
  ChevronRight,
  Info,
  LucideCalendar,
  LucideIcon,
  LucideTimer,
  MapPin,
  Plus,
  Save,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import TextAreaInput from "../../../../ui/TextAreaInput";
import { PageLayout } from "../../../../ui/PageLayout";
import { Link, useParams } from "react-router-dom";
import ROUTES_URL from "../../../../../constants/Routes";
import Button from "../../../../ui/Button";
import { useUserAccessModules } from "../../../../../config/hooks/useAccessModules";
import CustomDropdown from "../../../leads/CustomDropdown";
import useUnitForProduct from "../../../../../config/hooks/useUnitForProduct";
import UnitForProduct from "../../../../../@types/products/UnitForProduct";
import toast from "react-hot-toast";
import { Product } from "../../../../../@types/products/ProductsManagementProps";
import { StockSerialNumber } from "../../../stock/stock-available-serial-number/StockSerialNumber";
import CompanyUser from "../../../../../@types/company-users/CompanyUser";
import { useUserPreference } from "../../../../../context/user/UserPreference";
import axiosClient from "../../../../../axios-client/AxiosClient";
import { debounce } from "lodash";
import COLORS from "../../../../../constants/Colors";
import { createPortal } from "react-dom";

interface ProductRow {
  product: string;
  productId: number | null;
  unit_id: number;
  quantity: number;
  serialNumber: number[];
  isSerialNumber: boolean;
  purchaseDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  billingAddress: string;
  installationDate: string;
  installedBy: string;
  installedById: number;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyTerms: string;
  amcCycleStartDate: string;
  amcCycleEndDate: string;
  warranty: number;
  amc: number;
  conversionFactor: number;
}

export const CreateMultipleAccountCompanyProduct = () => {
  const { userHasAccessToUpdateAccount } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  const { accountId } = useParams();
  const [rows, setRows] = useState<ProductRow[]>([
    {
      product: "",
      productId: null,
      quantity: 1,
      purchaseDate: "",
      warranty: 0,
      amc: 0,
      installedBy: "Select",
      amcCycleEndDate: "",
      amcCycleStartDate: "",
      billingAddress: "",
      deliveryAddress: "",
      deliveryDate: "",
      installationDate: "",
      unit_id: 0,
      warrantyEndDate: "",
      warrantyStartDate: "",
      warrantyTerms: "",
      serialNumber: [],
      isSerialNumber: false,
      installedById: 0,
      conversionFactor: 0,
    },
  ]);

  // Per-row product dropdown
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ==============================
  // FETCH PRODUCTS
  // ==============================
  const fetchProducts = async (search: string | null, newOffset: number) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await axios.post(
        POST_API.GET_PRODUCTS,
        {
          search_parameter: search, // null when first clicked
          offset: newOffset,
          limit,

          company_id: loginStatus.companyId,
          id: null,
          search_company_specific_date_range_id: null,
          search_parameter_date: null,
          requestedby_id: loginStatus.id,
        },
        { withCredentials: true }
      );

      const list = res.data;

      if (list.length === 0) {
        setHasMore(false);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedData: Product[] = res.data.map((res: any) => ({
          count: res.count,
          id: res.id,
          companyId: res.company_id,
          productTypeId: res.product_type_id,
          productTypeName: res.product_type_name,
          unitName: res.unit_name,
          unitId: res.unit_id,
          unitNameInStock: res.unit_name_in_stock,
          defaultWarrantyIntervalTypeId: res.default_warranty_interval_type_id,
          defaultWarranty: res.default_warranty,
          defaultWarrantyName: res.default_warranty_name,
          defaultAmcCycleIntervalTypeId: res.default_amc_cycle_interval_type_id,
          defaultAmcCycle: res.default_amc_cycle,
          defaultAmcCycleName: res.default_amc_cycle_name,
          name: res.name,
          barcode: res.barcode,
          parentUnitId: res.parent_unit_id,
          isSerialNumber: res.is_serial_number,
          cost: res.cost,
          description: res.description,
          version: res.version,
          url: res.url,
          isActive: res.isactive,
          hsn: res.hsn,
          sac: res.sac,
          taxRate: res.tax_rate,
          validFrom: res.valid_from,
          createdBy: res.createdby,
          createdOn: res.createdon,
        }));
        setProducts((prev) => [...prev, ...formattedData]);
        // setProducts((prev) => [...prev, ...list]);
        setOffset(newOffset + limit);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithTwoParamsAndEvent: fetchProducts,
        });
        if (refreshTokenStatus) {
          fetchProducts(search, newOffset);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // HANDLE SEARCH CHANGE PER ROW
  // ==============================
  const handleSearch = (value: string, index: number) => {
    setSearchText(value);
    setActiveRow(index);

    setProducts([]);
    setOffset(0);
    setHasMore(true);

    fetchProducts(value, 0);
  };

  // ==============================
  // ADD ROW
  // ==============================
  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        product: "",
        productId: null,
        purchaseDate: "",
        warranty: 12,
        amc: 1,
        installedBy: "Select",
        amcCycleEndDate: "",
        amcCycleStartDate: "",
        billingAddress: "",
        deliveryAddress: "",
        deliveryDate: "",
        installationDate: "",
        quantity: 1,
        unit_id: 0,
        warrantyEndDate: "",
        warrantyStartDate: "",
        warrantyTerms: "",
        serialNumber: [],
        isSerialNumber: false,
        installedById: 0,
        conversionFactor: 0,
      },
    ]);
  };

  // ==============================
  // DELETE ROW
  // ==============================
  const deleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // ==============================
  // UPDATE ROW
  // ==============================
  // const updateRow = (index: number, field: keyof ProductRow, value: any) => {
  //   const updated = [...rows];

  //   updated[index][field] = value;
  //   setRows(updated);
  // };

  const updateRow = <K extends keyof ProductRow>(
    index: number,
    field: K,
    value: ProductRow[K]
  ) => {
    const updated = [...rows];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setRows(updated);
  };

  const [showSerialNumberModule, setShowSerialNumberModule] =
    useState<boolean>(false);
  const { unitForProduct, getUnitForProduct } = useUnitForProduct({});
  // ==============================
  // HANDLE PRODUCT SELECT
  // ==============================

  const handleProductSelect = async (
    // item: ProductResponseItem,
    item: Product,
    index: number
  ) => {
    // Check duplicate selection
    const alreadySelected = rows.some((r) => r.productId === item.id);

    if (alreadySelected) {
      toast.error("This product is already selected in another row!");
      // alert("This product is already selected in another row!");
      return;
    }

    updateRow(index, "product", item.name);
    updateRow(index, "productId", item.id!);
    updateRow(index, "isSerialNumber", item.isSerialNumber!);
    console.log("Fetching unit for product", item.id);

    //  IMPORTANT: get fresh units directly from API
    const units = await getUnitForProduct(item.id!);

    // Store units for this specific row
    setUnitsForRows((prev) => ({
      ...prev,
      [index]: units, // use returned value, not unitForProduct state
    }));

    setSearchText("");
    setActiveRow(null);
    setProducts([]); // if errors comes then comment this
  };

  // ==============================
  // INFINITE SCROLL
  // ==============================
  const handleDropdownScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 10;
    if (bottom && hasMore) {
      fetchProducts(searchText || null, offset);
    }
  };

  const { triggerCall, data } = useCreateCall<any>(
    `${POST_API.CREATE_ACCOUNT_COMPANY_PRODUCT}-list`
  );

  const handleCreateAccountCompanyProduct = async () => {
    const payloadList = rows.map((row) => ({
      unit_id: row.unit_id,
      quantity: row.quantity,
      stock_inward_id_array: row.serialNumber ?? [],
      company_id: loginStatus.companyId,
      account_id: Number(accountId),
      company_product_id: row.productId,
      purchase_date: row.purchaseDate === "" ? null : row.purchaseDate,
      delivery_date: row.deliveryDate === "" ? null : row.deliveryDate,
      installation_date:
        row.installationDate === "" ? null : row.installationDate,
      warranty_start_date:
        row.warrantyStartDate === "" ? null : row.warrantyStartDate,
      warranty_end_date:
        row.warrantyEndDate === "" ? null : row.warrantyEndDate,
      amc_cycle_start_date:
        row.amcCycleStartDate === "" ? null : row.amcCycleStartDate,
      amc_cycle_end_date:
        row.amcCycleEndDate === "" ? null : row.amcCycleEndDate,
      delivery_address: row.deliveryAddress,
      billing_address: row.billingAddress,
      installed_by: row.installedById || loginStatus.id,
      warranty_terms: row.warrantyTerms,
      createdby_id: loginStatus.id,
    }));
    console.log(payloadList);
    await triggerCall(payloadList);
    console.log(data);
    if (data.status) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  const [unitsForRows, setUnitsForRows] = useState<
    Record<number, UnitForProduct[]>
  >({});

  const openSerialNumberPopup = (rowIndex: number) => {
    setActiveRow(rowIndex);
    setSelectedCompanyProductId(rows[rowIndex].productId!);
    setShowSerialNumberModule(true);
  };

  const [selectedCompanyProductId, setSelectedCompanyProductId] = useState<
    number | null
  >(null);

  // const [errorsData, setErrorsData] = useState<{
  //   WarrantyIntervalTypeId: boolean;
  //   Warranty: boolean;
  //   AmcIntervalTypeId: boolean;
  //   SelectedAmc: boolean;
  //   unitIdError: boolean;
  // }>({
  //   WarrantyIntervalTypeId: false,
  //   Warranty: false,
  //   AmcIntervalTypeId: false,
  //   SelectedAmc: false,
  //   unitIdError: false,
  // });

  if (!userHasAccessToUpdateAccount) return <div>permission denied</div>;

  return (
    <PageLayout>
      <div className=" flex items-center  gap-3 mx-2 my-1">
        <Link to={ROUTES_URL.ACCOUNT_MANAGEMENT}>
          <Button className="flex caption-custom items-center justify-center hover:text-gray-800">
            <span>Accounts</span>
          </Button>
        </Link>
        <ChevronRight size={16} />
        <Link to={`${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}`}>
          <Button className="caption-custom flex items-center justify-center hover:text-gray-800">
            Account Details
          </Button>
        </Link>
        <ChevronRight size={16} />
        <h1 className="table-header-custom">Assign Products</h1>
      </div>
      <form
        onClick={(e) => {
          e.preventDefault();
          handleCreateAccountCompanyProduct();
        }}
      >
        <div className=" w-full px-2">
          <div className=" flex justify-between gap-3 mb-1">
            <div>
              <Button type="button" onClick={addRow}>
                <div className="flex items-center gap-1">
                  <Plus size={16} />
                  <span>Add Row</span>
                </div>
              </Button>
            </div>
            <div>
              <Button type="submit">
                <div className="flex items-center gap-1">
                  <Save size={14} />
                  <span>Save</span>
                </div>
              </Button>
            </div>
          </div>

          {/* PRODUCT BUNDLE GRID */}
          <div className="flex flex-col gap-2">
            {rows.map((row, index) => {
              return (
                <div
                  key={index}
                  className={`border rounded-xl p-2 shadow-sm bg-white`}
                >
                  {/* Header Row */}
                  <div className={` flex gap-6 mb-2  items-center`}>
                    <h2 className="caption-custom text-lg">
                      Product #{index + 1}
                    </h2>
                    {/* PRODUCT SEARCH */}
                    <div className="relative  w-72">
                      <input
                        type="text"
                        placeholder="Search product..."
                        className="border table-header-custom bg-blue-00 py-0.5 px-1.5 rounded  w-full"
                        value={activeRow === index ? searchText : row.product}
                        onChange={(e) => handleSearch(e.target.value, index)}
                        onClick={() => {
                          setActiveRow(index);
                          setProducts([]);
                          setOffset(0);
                          setHasMore(true);
                          fetchProducts(null, 0);
                        }}
                      />
                      {row.product && <h1>{row.product}</h1>}

                      {/* DROPDOWN */}
                      {activeRow === index && (
                        <div
                          ref={dropdownRef}
                          onScroll={handleDropdownScroll}
                          className="absolute bg-white border w-full max-h-60 overflow-auto z-20 shadow rounded"
                        >
                          {products.map((item: Product) => (
                            <div
                              key={item.id}
                              className="p-1 table-header-custom  hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleProductSelect(item, index)}
                            >
                              {item.name}
                            </div>
                          ))}

                          {loading && (
                            <p className="p-2 text-sm text-gray-500">
                              Loading...
                            </p>
                          )}
                          {!hasMore && (
                            <p className="p-2 text-sm text-gray-400">
                              No more data
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteRow(index)}
                      className={` ${
                        index == 0 ? "hidden" : ""
                      } text-red-500 text-xl font-bold`}
                    >
                      ×
                    </button>
                  </div>

                  {/* GRID */}
                  <div className="grid  md:grid-cols-4 gap-1">
                    <div
                      className={`col-span-2 grid gap-1 bg-pink-00 ${
                        row.isSerialNumber ? "grid-cols-2" : "grid-cols-1"
                      }`}
                    >
                      {/* QTY + UNIT */}
                      <div className="grid grid-cols-2">
                        <FormInput
                          label="Quantity :"
                          required
                          type="number"
                          value={row.quantity}
                          min={1}
                          onChange={(e) => {
                            const qty = Number(e.target.value);
                            updateRow(index, "quantity", qty);
                            // updateRow(index, "quantity", Number(e.target.value));
                            const selectedUnit = unitsForRows[index]?.find(
                              (u) => u.id === row.unit_id
                            );

                            if (selectedUnit) {
                              const finalFactor =
                                qty * Number(selectedUnit.conversionFactor);
                              updateRow(index, "conversionFactor", finalFactor);
                            }
                          }}
                        />
                        {/* Unit */}
                        <div className="">
                          <CustomDropdown
                            labelName="Unit :"
                            logo={LucideTimer}
                            // onSelect={(data) => {
                            //   updateRow(index, "unit_id", data);

                            // }}
                            onSelect={(unit) => {
                              updateRow(index, "unit_id", unit!);

                              const finalFactor =
                                Number(row.quantity) *
                                Number(
                                  unitForProduct.find(
                                    (item) => item.id === unit
                                  )?.conversionFactor
                                );

                              updateRow(index, "conversionFactor", finalFactor);
                            }}
                            options={unitsForRows[index] || []}
                            requiredRedDot={true}
                          />
                        </div>
                        <div className="col-span-2">
                          {row.conversionFactor !== 0 && (
                            <p
                              title="Quantity is converted automatically based on the product base unit and current selected unit."
                              className="caption-custom-active flex items-center cursor-pointer gap-1"
                            >
                              Quantity will be deducted from stock :{" "}
                              {row.conversionFactor}
                              {
                                unitForProduct.find(
                                  (item) =>
                                    item.conversionFactor ===
                                    row.conversionFactor
                                )?.unitNameInStock
                              }
                              <Info size={12} className="" />
                            </p>
                          )}
                        </div>
                      </div>

                      {row !== undefined && row?.isSerialNumber === true && (
                        <div>
                          <div className="flex items-center justify-end h-fit ">
                            <div className="w-full ">
                              <label className=" input-label-custom text-sm   flex items-center gap-1 text-gray-700  ">
                                <User className="text-blue-500" size={15} />
                                <div>
                                  Serial Number :
                                  <span className="ml-0 text-red-400">*</span>
                                </div>
                              </label>

                              <div className="flex items-center justify-between border border-gray-300 rounded px-3 py-1 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                                <span className="table-header-custom">
                                  {row.serialNumber.length > 0 ? (
                                    <>
                                      <span className="">
                                        Serial number Selected:{" "}
                                        {row.serialNumber.length}
                                      </span>
                                    </>
                                  ) : (
                                    "No serial number selected"
                                  )}
                                </span>

                                <Button
                                  type="button"
                                  className="text-blue-600 text-sm underline hover:text-blue-800"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    openSerialNumberPopup(index);
                                  }}
                                >
                                  {row.serialNumber.length > 0
                                    ? "Change"
                                    : "Select"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col-span-2 grid grid-cols-2 gap-1">
                      {/* INSTALLED BY */}
                      <div>
                        <CompanyUserSearchFieldInput
                          label="Installed By :"
                          required
                          onUserSelected={(data) => {
                            if (data) {
                              updateRow(index, "installedById", data?.id);
                              updateRow(index, "installedBy", data?.fullname);
                            } else {
                              updateRow(index, "installedById", 0);
                              updateRow(index, "installedBy", "");
                            }
                          }}
                          defaultValue={loginStatus.fullName}
                          // disabledMessage={ }
                          error=""
                          logo={User}
                          placeholder="Select User"
                        />
                      </div>
                      <div>
                        <DatePickerInput
                          label="Installation Date :"
                          logo={LucideCalendar}
                          name="installationDate"
                          placeholder="Select Date"
                          value={row.installationDate}
                          onChange={(e) =>
                            updateRow(index, "installationDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-2 grid grid-cols-4 gap-1">
                      {/* PURCHASE DATE */}
                      <div>
                        <DatePickerInput
                          required
                          label="Purchase Date :"
                          logo={LucideCalendar}
                          name="purchaseDate"
                          placeholder="Select Date"
                          value={row.purchaseDate}
                          onChange={(e) =>
                            updateRow(index, "purchaseDate", e.target.value)
                          }
                          // error={handleError}
                        />
                      </div>
                      {/* Delivery date */}
                      <DatePickerInput
                        label="Delivery Date :"
                        logo={LucideCalendar}
                        name="deliveryDate"
                        placeholder="Select Date"
                        value={row.deliveryDate}
                        onChange={(e) =>
                          updateRow(index, "deliveryDate", e.target.value)
                        }
                      />
                      {/* Warranty start date  & Warranty end date*/}
                      {/* Warranty start date */}
                      <DatePickerInput
                        label="Warranty Start Date :"
                        logo={LucideCalendar}
                        name="warrantyStartDate"
                        placeholder="Select Date"
                        value={row.warrantyStartDate}
                        onChange={(e) =>
                          updateRow(index, "warrantyStartDate", e.target.value)
                        }
                      />

                      {/* Warranty end date */}
                      <DatePickerInput
                        label="Warranty End Date :"
                        logo={LucideCalendar}
                        name="warrantyEndDate"
                        placeholder="Select Date"
                        value={row.warrantyEndDate}
                        onChange={(e) =>
                          updateRow(index, "warrantyEndDate", e.target.value)
                        }
                      />
                    </div>
                    {/* Amc start date & Amc End date */}
                    {/* <div className="grid grid-cols-2 gap-3 "> */}
                    <DatePickerInput
                      label="Amc Start Date :"
                      logo={LucideCalendar}
                      name="amcCycleStartDate"
                      placeholder="Select Date"
                      value={row.amcCycleStartDate}
                      onChange={(e) =>
                        updateRow(index, "amcCycleStartDate", e.target.value)
                      }
                    />
                    <DatePickerInput
                      label="Amc End Date :"
                      logo={LucideCalendar}
                      name="amcCycleEndDate"
                      placeholder="Select Date"
                      value={row.amcCycleEndDate}
                      onChange={(e) =>
                        updateRow(index, "amcCycleEndDate", e.target.value)
                      }
                    />
                    {/* </div> */}
                    <div className="col-span-4 grid grid-cols-2 gap-1">
                      {/* Warranty terms */}
                      <TextAreaInput
                        logo={ShieldCheck}
                        cols={4}
                        label="Warranty Terms : "
                        name="warrantyTerms"
                        rows={2}
                        value={row.warrantyTerms}
                        onChange={(e) =>
                          updateRow(index, "warrantyTerms", e.target.value)
                        }
                      />
                      {/* Delivery address */}
                      <TextAreaInput
                        logo={MapPin}
                        cols={4}
                        label="Delivery Address :"
                        name="deliveryAddress"
                        value={row.deliveryAddress}
                        onChange={(e) =>
                          updateRow(index, "deliveryAddress", e.target.value)
                        }
                        rows={2}
                      />
                      {/* Billing address */}
                      <TextAreaInput
                        logo={MapPin}
                        cols={4}
                        label="Billing Address :"
                        rows={2}
                        name="billingAddress"
                        value={row.billingAddress}
                        onChange={(e) =>
                          updateRow(index, "billingAddress", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className=" flex justify-end mt-6 text-right">
            <div>
              <Button type="submit">
                <div className="flex items-center gap-1">
                  <Save size={14} />
                  <span>Save</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </form>
      {showSerialNumberModule && activeRow !== null && (
        <StockSerialNumber
          companyProductId={selectedCompanyProductId!} // required for API call
          selectedInwardIds={rows[activeRow].serialNumber ?? []} // pass existing selected serials
          onClose={() => setShowSerialNumberModule(false)}
          handleStockSerialNumberChange={(selectedSerialIds) => {
            updateRow(activeRow, "serialNumber", selectedSerialIds);
            // setShowSerialNumberModule(false);
          }}
        />
      )}
    </PageLayout>
  );
};

interface CompanyUserSearchFieldProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  onUserSelected: (user: CompanyUser | null) => void;
  error?: string;
  logo?: LucideIcon;
  readOnly?: boolean;
  defaultValue?: string;
  isDisabled?: boolean;
  disabledMessage?: string | null;
}

function CompanyUserSearchFieldInput({
  label,
  placeholder = "Search company users...",
  required,
  error,
  logo: Icon,
  readOnly = false,
  defaultValue = "",
  onUserSelected,
  isDisabled = false,
  disabledMessage = null,
}: CompanyUserSearchFieldProps) {
  const [query, setQuery] = useState(defaultValue);
  const [selectedUser, setSelectedUser] = useState<CompanyUser | null>(null);
  const [results, setResults] = useState<CompanyUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const { loginStatus } = useLoggedInUserContext();
  const { userPreference } = useUserPreference();

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
      onUserSelected(user);
    }
  }, [defaultValue]);

  // ---------------- DISABLED ----------------
  const handleDisabled = () => {
    toast.error(disabledMessage || "You are not authorised");
  };

  // ---------------- SEARCH API ----------------
  const fetchUsers = async (searchText: string) => {
    if (!searchText.trim() || searchText.trim().length < 2 || isDisabled) {
      setResults([]);
      return;
    }

    try {
      setIsLoading(true);

      const response = await axiosClient.post(POST_API.GET_COMPANY_USERS, {
        company_id: loginStatus.companyId,
        search_parameter: searchText.trim(),
        limit: userPreference.rowsInGrid,
        requestedby: loginStatus.id,
      });

      if (response?.status === STATUS_CODE.OK) {
        setResults(response.data || []);
        setActiveIndex(0); // ⭐ set first as active
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("SEARCH ERROR:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((txt: string) => fetchUsers(txt), 300),
    [isDisabled]
  );

  useEffect(() => {
    if (isDisabled) return;

    if (query && !selectedUser) {
      if (query !== defaultValue) {
        debouncedSearch(query);
        setShowDropdown(true);
      }
    }
  }, [query, selectedUser, debouncedSearch, isDisabled]);

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

    setSelectedUser(user);
    setQuery(user.fullname);
    setShowDropdown(false);
    onUserSelected(user);
  };

  // ---------------- CLEAR ----------------
  const clearSelected = () => {
    if (isDisabled) return handleDisabled();

    setSelectedUser(null);
    setQuery("");
    setResults([]);
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
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

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
      <label className="flex items-center input-label-custom">
        {Icon && <Icon size={14} className={COLORS.INPUT_LABEL_ICONS_COLOR} />}

        {label}
        {required && (
          <span className="caption-custom-inactive align-top">*</span>
        )}
      </label>

      <div className=" relative w-full">
        <input
          ref={inputRef}
          type="text"
          readOnly={readOnly || isDisabled}
          value={query}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            if (isDisabled) return handleDisabled();
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
              ? "appearance-none block w-full px-3 py-0.5 border bg-gray-200 border-gray-300 rounded-md shadow-sm text-gray-500 cursor-not-allowed"
              : readOnly
              ? "appearance-none block w-full px-3 py-0.5 border bg-gray-200 border-gray-300 rounded-md shadow-sm"
              : "appearance-none block w-full px-3 py-0.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          }
        />

        {query && !readOnly && !isDisabled && (
          <button
            onClick={clearSelected}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}

        {!readOnly && !isDisabled && (
          <Search
            className={`absolute ${
              query ? "right-8" : "right-3"
            } top-2 text-gray-400`}
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
            className="bg-white shadow-lg rounded-md border max-h-[160px] overflow-y-auto scroll-smooth"
          >
            {isLoading ? (
              <div className="p-2 table-header-custom">Searching...</div>
            ) : results.length > 0 ? (
              results.map((user, index) => (
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
              ))
            ) : (
              query.length >= 2 &&
              query !== defaultValue && (
                <div className="p-2 table-header-custom">No users found</div>
              )
            )}
          </div>,
          document.body
        )}

      {error && (
        <div className="mt-0 ml-0.5 caption-custom-inactive">{error}</div>
      )}
    </div>
  );
}
