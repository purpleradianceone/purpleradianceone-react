/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback } from "react";
import POST_API from "../../../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../../../@types/error/ApiError";
import { STATUS_CODE, VALIDATIONS } from "../../../../../constants/AppConstants";
import RefreshToken from "../../../../../config/validations/RefreshToken";
import FormInput from "../../../../ui/FormInput";
import DatePickerInput from "../../../../ui/DatePickerInput";
import { nanoid } from "nanoid";
import {
  Box,
  ChevronRight,
  Info,
  LucideCalendar,
  LucideIcon,
  LucideTimer,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import TextAreaInput from "../../../../ui/TextAreaInput";
import { PageLayout } from "../../../../ui/PageLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import {
  createMultipleAccountCompanyProduct,
  getStockLiveForCompanyProduct,
} from "../../../../../config/apis/api";
import MESSAGE from "../../../../../constants/Messages";
import { handleApiError } from "../../../../../config/error/handleApiError";

interface ProductRow {
  rowNaNoId: string;
  product: string;
  productId: number | null;
  unit_id: number;
  quantity: number;
  serialNumber: number[];
  isSerialNumber: boolean;
  productQuantity?: number;
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
  productWarranty?: string;
  productAmc?: string;
  productWarrantyId?: number;
  productWarrantyNumber?: number;
  productAmcId?: number;
  productAmcNumber?: number;
  isLoading?: boolean;
  hasError?: {
    product?: boolean;
    unit?: boolean;
    installedBy?: boolean;
    purchaseDate?: boolean;
    quantity?: boolean;
    zeroQuantity?: boolean;
    installedById?: boolean;
  };
}

export const CreateMultipleAccountCompanyProduct = () => {
  const navigate = useNavigate();
  const { userPreference } = useUserPreference();
  const { userHasAccessToUpdateAccount } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();

  const { accountId } = useParams();
  const [rows, setRows] = useState<ProductRow[]>([
    {
      rowNaNoId: nanoid(),
      product: "",
      productId: null,
      quantity: 0,
      purchaseDate: "",
      warranty: 0,
      amc: 0,
      installedBy: loginStatus.fullName || loginStatus.email || loginStatus.mobileNumber,
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
      installedById: loginStatus.id,
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
  const limit = userPreference.rowsInGrid || 25;
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setActiveRow(null);
        setProducts([]);
        setSearchText("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==============================
  // FETCH PRODUCTS
  // ==============================
  const fetchProducts = async (search: string | null, newOffset: number) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await axiosClient.post(
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
        rowNaNoId: nanoid(),
        product: "",
        productId: null,
        purchaseDate: "",
        warranty: 12,
        amc: 1,
        installedBy: loginStatus.fullName || loginStatus.email || loginStatus.mobileNumber,
        amcCycleEndDate: "",
        amcCycleStartDate: "",
        billingAddress: "",
        deliveryAddress: "",
        deliveryDate: "",
        installationDate: "",
        quantity: 0,
        unit_id: 0,
        warrantyEndDate: "",
        warrantyStartDate: "",
        warrantyTerms: "",
        serialNumber: [],
        isSerialNumber: false,
        installedById: loginStatus.id,
        conversionFactor: 0,
      },
    ]);
  };

  // ==============================
  // DELETE ROW
  // ==============================
  // const deleteRow = (index: number) => {
  //   setRows(rows.filter((_, i) => i !== index));
  // };

  // nanoid changes
  const deleteRow = (rowId : string )=>{
    setRows((prev)=> prev.filter((r)=> r.rowNaNoId !== rowId))
  }

  const validateRows = (): boolean => {
    let isValid = true;
    let hasStockError = false;
    let hasMandatoryError = false;

    const updated = rows.map((row) => {
      const qty = Number(row.quantity ?? 0);
      const conversionFactor = Number(row.conversionFactor ?? 0);
      const productQuantity = Number(row.productQuantity ?? 0);

      const errors = {
        product: !row.productId,
        unit: !row.unit_id,
        installedBy: !row.installedBy?.trim(),
        installedById: row.installedById <= 0,
        purchaseDate: !row.purchaseDate?.trim(),
        zeroQuantity: qty < 1,
        quantity: false,
      };

      //  FINAL STOCK VALIDATION
      if (productQuantity > 0 && conversionFactor > productQuantity) {
        errors.quantity = true;
        hasStockError = true;
        isValid = false;
      }

      //  Mandatory validation
      if (
        errors.product ||
        errors.unit ||
        errors.installedBy ||
        errors.purchaseDate ||
        errors.zeroQuantity ||
        errors.installedById
      ) {
        hasMandatoryError = true;
        isValid = false;
      }

      return { ...row, hasError: errors };
    });

    setRows(updated);

    //  Show toasts ONLY ONCE
    if (hasStockError) {
      toast.error("Entered quantity exceeds available stock.");
    }

    if (hasMandatoryError) {
      toast.error("Please fill all mandatory fields.");
    }

    return isValid;
  };

  const updateRow = <K extends keyof ProductRow>(
    index: number,
    field: K,
    value: ProductRow[K]
  ) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const newRow: ProductRow = { ...row };
        const newHasError = { ...row.hasError };

        if (!newRow.product) {
          toast.error("Select priduct first.");
          return newRow;
        }

        if (field === "quantity") {
          const qty = Number(value);
          const productQty = Number(row.productQuantity ?? 0);
          const requiredQty = Number(row.conversionFactor ?? 0);

          // Always allow typing
          newRow.quantity = qty;

          // Reset errors first
          newHasError.zeroQuantity = false;
          newHasError.quantity = false;

          if (qty < 1) {
            newHasError.zeroQuantity = true;
          } else if (
            productQty > 0 &&
            requiredQty > 0 &&
            requiredQty > productQty
          ) {
            newHasError.quantity = true;
          }

          newRow.hasError = newHasError;
          return newRow;
        } else {
          newRow[field] = value;
        }

        if (field === "unit_id") {
          newHasError.unit = false;
          const productQty = Number(newRow.productQuantity ?? 0);
          const requiredQty = Number(newRow.conversionFactor ?? 0);

          newHasError.quantity =
            productQty > 0 && requiredQty > 0 && requiredQty > productQty;

          newRow.hasError = newHasError;
          return newRow;
        }

        /* -----------------------------
         4. Clear errors for allowed fields
      ----------------------------- */
        const errorFields = [
          "unit",
          "installedBy",
          "purchaseDate",
          "product",
          "installedById",
        ] as const;

        if (errorFields.includes(field as any)) {
          newHasError[field as (typeof errorFields)[number]] = false;
        }

        //  Recalculate dates if purchaseDate exists
        if (field === "purchaseDate") {
          newRow.purchaseDate = value as any;
          if (!row.deliveryDate) newRow.deliveryDate = value as any;
          if (!row.installationDate) newRow.installationDate = value as any;

          if (
            !row.warrantyStartDate &&
            !row.warrantyEndDate &&
            newRow.productWarrantyNumber &&
            newRow.productWarrantyId
          ) {
            newRow.warrantyStartDate = value as any;

            newRow.warrantyEndDate = calculateEndDate(
              value as any,
              newRow.productWarrantyNumber!,
              newRow.productWarrantyId!
            );
          }

          if (
            !row.amcCycleStartDate &&
            !row.amcCycleEndDate &&
            newRow.productAmcNumber &&
            newRow.productAmcId
          ) {
            newRow.amcCycleStartDate = value as any;
            newRow.amcCycleEndDate = calculateEndDate(
              value as any,
              newRow.productAmcNumber,
              newRow.productAmcId
            );
          }
        }
        const manualFields = [
          "deliveryDate",
          "warrantyStartDate",
          "amcCycleStartDate",
        ];

        if (manualFields.includes(field as any)) {
          newRow[field] = value as any;
        }

        newRow.hasError = newHasError;
        return newRow;
      })
    );
  };

  const [showSerialNumberModule, setShowSerialNumberModule] =
    useState<boolean>(false);
  const { unitForProduct, getUnitForProduct } = useUnitForProduct({});
  const calculateEndDate = (
    startDate: string,
    count: number,
    intervalId: number
  ): string => {
    // SAFELY parse YYYY-MM-DD
    const parts = startDate.split("-").map(Number);
    const end = new Date(parts[0], parts[1] - 1, parts[2]);

    // Add duration
    switch (intervalId) {
      case 1: // Year
        end.setFullYear(end.getFullYear() + count);
        break;

      case 2: // Month
        end.setMonth(end.getMonth() + count);
        break;

      case 3: // Day
        end.setDate(end.getDate() + count);
        break;
    }

    // Subtract ONE day (inclusive range)
    end.setDate(end.getDate() - 1);

    // Format manually (NO timezone shift)
    const yyyy = end.getFullYear();
    const mm = String(end.getMonth() + 1).padStart(2, "0");
    const dd = String(end.getDate()).padStart(2, "0");

    console.log("this is the date:");
    // alert()
    console.log(`${yyyy}-${mm}-${dd}`);

    return `${yyyy}-${mm}-${dd}`;
  };

  // ==============================
  // HANDLE PRODUCT SELECT
  // ==============================
  // const handleProductSelect = async (item: Product, index: number) => {

  //   setSearchText("");
  //   setActiveRow(null);
  //   setProducts([]);

  //   if (rows.some((r, i) => r.productId === item.id && i !== index)) {
  //     toast.error("This product is already selected in another row!");
  //     return;
  //   }

  //   const payload = {
  //     company_id: loginStatus.companyId,
  //     search_company_specific_date_range_id: null,
  //     company_product_id: item.id,
  //     search_parameter: null,
  //     search_parameter_date: "",
  //     limit: 25,
  //     offset: 0,
  //     requestedby_id: loginStatus.id,
  //   };

  //   const response = await getStockLiveForCompanyProduct(payload);
  //   const stock = response.data?.[0];

  //   if (!stock || stock.quantity_live === 0) {
  //     toast.error("Selected Product doesn't have stock.");
  //     return;
  //   }

  //   setRows((prev) =>
  //     prev.map((row, i) => {
  //       if (i !== index) return row;

  //       const newRow: ProductRow = {
  //         ...row,
  //         product: item.name,
  //         productId: item.id!,
  //         productQuantity: stock.quantity_live,
  //         isSerialNumber: item.isSerialNumber!,
  //         unit_id: item.isSerialNumber ? item.unitId : row.unit_id,

  //         // warranty
  //         productWarranty: item.defaultWarrantyName,
  //         productWarrantyNumber: item.defaultWarranty,
  //         productWarrantyId: item.defaultWarrantyIntervalTypeId,

  //         // amc
  //         productAmc: item.defaultAmcCycleName,
  //         productAmcNumber: item.defaultAmcCycle,
  //         productAmcId: item.defaultAmcCycleIntervalTypeId,
  //       };

  //       // 🔁 Force recalculation if purchase date exists
  //       if (newRow.purchaseDate) {
  //         const start = new Date(newRow.purchaseDate);

  //         if (newRow.productWarrantyNumber && newRow.productWarrantyId) {
  //           const end = new Date(start);
  //           if (newRow.productWarrantyId === 1)
  //             end.setFullYear(end.getFullYear() + newRow.productWarrantyNumber);
  //           else if (newRow.productWarrantyId === 2)
  //             end.setMonth(end.getMonth() + newRow.productWarrantyNumber);
  //           else if (newRow.productWarrantyId === 3)
  //             end.setDate(end.getDate() + newRow.productWarrantyNumber);

  //           newRow.warrantyStartDate = newRow.purchaseDate;
  //           newRow.warrantyEndDate = end.toISOString().split("T")[0];
  //         }

  //         if (newRow.productAmcNumber && newRow.productAmcId) {
  //           const end = new Date(start);
  //           if (newRow.productAmcId === 1)
  //             end.setFullYear(end.getFullYear() + newRow.productAmcNumber);
  //           else if (newRow.productAmcId === 2)
  //             end.setMonth(end.getMonth() + newRow.productAmcNumber);
  //           else if (newRow.productAmcId === 3)
  //             end.setDate(end.getDate() + newRow.productAmcNumber);

  //           newRow.amcCycleStartDate = newRow.purchaseDate;
  //           newRow.amcCycleEndDate = end.toISOString().split("T")[0];
  //         }
  //       }

  //       return newRow;
  //     })
  //   );

  //   const units = await getUnitForProduct(item.id!);
  //   setUnitsForRows((prev) => ({ ...prev, [index]: units }));

  // };

  const handleProductSelect = async (item: Product, index: number) => {
    // Close dropdown immediately
    setSearchText("");
    setActiveRow(null);
    setProducts([]);

    // Duplicate check
    if (rows.some((r, i) => r.productId === item.id && i !== index)) {
      toast.error("This product is already selected in another row!");
      return;
    }

    //  Enable loader for this row
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, isLoading: true } : row))
    );

    try {
      const payload = {
        company_id: loginStatus.companyId,
        search_company_specific_date_range_id: null,
        company_product_id: item.id,
        search_parameter: null,
        search_parameter_date: "",
        limit: 25,
        offset: 0,
        requestedby_id: loginStatus.id,
      };

      // Run APIs in parallel
      const [stockRes, units] = await Promise.all([
        getStockLiveForCompanyProduct(payload),
        getUnitForProduct(item.id!),
      ]);

      const stock = stockRes.data?.[0];

      if (!stock || stock.quantity_live === 0) {
        toast.error("Selected Product doesn't have stock.");
        setRows((prev) =>
          prev.map((row, i) =>
            i === index ? { ...row, isLoading: false } : row
          )
        );
        return;
      }

      setUnitsForRows((prev) => ({ ...prev, [index]: units }));

      setRows((prev) =>
        prev.map((row, i) => {
          if (i !== index) return row;

          const newRow: ProductRow = {
            ...row,
            product: item.name,
            productId: item.id!,
            productQuantity: stock.quantity_live,
            isSerialNumber: item.isSerialNumber!,
            unit_id: item.isSerialNumber ? item.unitId : row.unit_id,

            productWarranty: item.defaultWarrantyName,
            productWarrantyNumber: item.defaultWarranty,
            productWarrantyId: item.defaultWarrantyIntervalTypeId,

            productAmc: item.defaultAmcCycleName,
            productAmcNumber: item.defaultAmcCycle,
            productAmcId: item.defaultAmcCycleIntervalTypeId,
            hasError: {
              ...row.hasError,
              product: false,
            },
          };

          //  Recalculate dates if purchaseDate exists
          if (newRow.purchaseDate) {
            if (newRow.productWarrantyNumber && newRow.productWarrantyId) {
              newRow.warrantyStartDate = newRow.purchaseDate;

              newRow.warrantyEndDate = calculateEndDate(
                newRow.purchaseDate,
                newRow.productWarrantyNumber!,
                newRow.productWarrantyId!
              );
            }

            if (newRow.productAmcNumber && newRow.productAmcId) {
              newRow.amcCycleStartDate = newRow.purchaseDate;
              newRow.amcCycleEndDate = calculateEndDate(
                newRow.purchaseDate,
                newRow.productAmcNumber,
                newRow.productAmcId
              );
            }
          }

          return { ...newRow, isLoading: false };
        })
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      toast.error("Failed to load product data.");

      setRows((prev) =>
        prev.map((row, i) => (i === index ? { ...row, isLoading: false } : row))
      );
    }
  };

  const handleDropdownScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 10;
    if (bottom && hasMore) {
      fetchProducts(searchText || null, offset);
    }
  };

  // Note : Create api call
  const handleCreateAccountCompanyProduct = async () => {
    if (!validateRows()) {
      // toast.error("Please fill all mandatory fields");
      return;
    }
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

    try {
      const response = await createMultipleAccountCompanyProduct(payloadList);
      if (response.status === STATUS_CODE.OK) {
        if (response.data.status === true) {
          toast.success(response.data.message);
          setRows([]);
          navigate(`${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}`);
        } else {
          toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG);
        }
      }
    } catch (error: any) {
      handleApiError(error);
      // toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG);
    }
  };

  useEffect(() => {
    console.log(" this are the rows : ");
    console.log(rows);
  }, [rows]);

  const [unitsForRows, setUnitsForRows] = useState<
    Record<number, UnitForProduct[]>
  >({});

  // const openSerialNumberPopup = (rowIndex: number) => {
  //   // setActiveRow(rowIndex);
  //   setSerialRowIndex(rowIndex);
  //   setSelectedCompanyProductId(rows[rowIndex].productId!);
  //   setShowSerialNumberModule(true);
  // };

  // nanoid changes
  const openSerialNumberPopup = (rowId: string) => {
    const row = rows.find((r) => r.rowNaNoId === rowId);

    if (!row) return;
    setSerialRowIndex(rowId);
    setSelectedCompanyProductId(row.productId);
    setShowSerialNumberModule(true);
  };

  const [selectedCompanyProductId, setSelectedCompanyProductId] = useState<
    number | null
  >(null);

  // separate state just for the serial number pop up
  // const [serialRowIndex, setSerialRowIndex] = useState<number | null>(null);
  // nonoid changes
  const [serialRowIndex, setSerialRowIndex] = useState<string | null>(null);

  if (!userHasAccessToUpdateAccount) return <div>permission denied</div>;

  return (
    <PageLayout>
      {/* Header navigation bar */}
      <div className="sticky top-0 z-20 bg-white py-1 border-b">
        <div className="flex items-center gap-3 mx-0.5 ">
          <Link to={ROUTES_URL.ACCOUNT_MANAGEMENT}>
            <Button className="caption-custom flex items-center justify-center hover:text-gray-800">
              Accounts
            </Button>
          </Link>

          <ChevronRight size={16} className="text-gray-400" />

          <Link to={`${ROUTES_URL.ACCOUNT_DETAILS}/${accountId}`}>
            <Button className="caption-custom flex items-center justify-center hover:text-gray-800">
              Account Details
            </Button>
          </Link>

          <ChevronRight size={16} className="text-gray-400" />

          <h1 className="table-header-custom">Assign Products</h1>
        </div>
      </div>

      {/* form */}
      <form>
        <div className=" w-full py-0.5 ">
          <div className="sticky top-0 z-20 bg-white border-b p-0.5 mb-0.5">
            <div className=" flex justify-between gap-3 ">
              {/* Add more button */}
              <div>
                <button
                  type="button"
                  onClick={addRow}
                  className="
                  inline-flex items-center gap-1.5
                  rounded-md
                  bg-blue-600
                  px-3 py-2
                  text-sm font-medium text-white
                  shadow-sm
                  hover:bg-blue-700
                  focus:outline-none
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                  transition-colors
                  "
                >
                  <Plus size={16} />
                  <span>Add More</span>
                </button>
              </div>
              <div>
                {/* Save button */}
                <Button
                  // disable={ .hasError.quantity || row.hasError.zeroQuantity}
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCreateAccountCompanyProduct();
                  }}
                >
                  <div className="flex items-center gap-1">
                    <Save size={14} />
                    <span>Save</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* PRODUCT BUNDLE GRID */}
          <div className="flex flex-col gap-2 ">
            {rows.map((row, index) => {
              return (
                <div
                  // nanoid changes
                  // key={index}
                  key={row.rowNaNoId}
                  className={`border rounded p-2 shadow-sm bg-slate-0`}
                >
                  {/* Header Row */}
                  <div className={` flex gap-6 mb-2  items-center`}>
                    <h2 className="caption-custom text-lg">
                      Product #{index + 1}
                    </h2>
                    {/* PRODUCT SEARCH */}
                    <div
                      //  ref={inputRef}
                      className="relative  w-72"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search Product..."
                        className="border table-header-custom bg-blue-00 py-0.5 px-1.5 rounded  w-full"
                        value={activeRow === index ? searchText : row.product}
                        onChange={(e) => handleSearch(e.target.value, index)}
                        onClick={(e) => {
                          e.preventDefault();
                          setSearchText(row.product);
                          setActiveRow(index);
                          setProducts([]);
                          setOffset(0);
                          setHasMore(true);
                          fetchProducts(null, 0);
                        }}
                      />
                      {row.hasError?.product && (
                        <p className="text-red-500 text-xs mt-1">
                          Product is required
                        </p>
                      )}
                      {row.isLoading && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {/* <Spinner size={12} /> */}
                          Loading product details...
                        </div>
                      )}

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
                              className={`p-2 ${
                                item.id === row.productId ? " bg-blue-100" : ""
                              } table-header-custom  hover:bg-gray-100 cursor-pointer`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleProductSelect(item, index);
                              }}
                            >
                              <div className="table-header-custom">
                                {item.name}
                              </div>
                              <div className="caption-custom">
                                {item.productTypeName}
                              </div>
                            </div>
                          ))}

                          {loading && (
                            <p className=" text-center caption-custom p-2  ">
                              Loading...
                            </p>
                          )}
                          {!hasMore && (
                            <p className="text-center caption-custom p-2">
                              No more data
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                    // nanoid changes
                    onClick={()=> deleteRow(row.rowNaNoId)}
                      // onClick={() => deleteRow(index)}
                      className={` ${
                        index == 0 ? "hidden" : ""
                      } text-red-500 text-xl font-bold`}
                    >
                      ×
                    </button>
                    {row.productQuantity && (
                      <span className="table-header-custom">
                        {"Available Quantity : " +
                          row.productQuantity +
                          " Units"}
                      </span>
                    )}
                  </div>

                  {/* GRID */}
                  <div className="grid  md:grid-cols-4 gap-1">
                    {/* QTY + UNIT */}
                    <div className="col-span-2 grid grid-cols-4 gap-1 ">
                      <div>
                        <FormInput
                          logo={Box}
                          label="Quantity :"
                          required
                          placeholder="Enter Product Quantity"
                          type="number"
                          value={row.quantity == 0 ? "" : row.quantity}
                          // min={0}
                          // max={row.productQuantity!}
                          onChange={(e) => {
                            const qty = Number(e.target.value);

                            const selectedUnit = unitsForRows[index]?.find(
                              (u) => u.id === row.unit_id
                            );

                            if (selectedUnit) {
                              const finalFactor =
                                qty * Number(selectedUnit.conversionFactor);
                              updateRow(index, "conversionFactor", finalFactor);
                            }
                            // if(qty){

                            updateRow(index, "quantity", qty);
                            // }
                          }}
                        />
                        {row.hasError?.zeroQuantity && (
                          <p className="text-red-500 text-xs mt-1">
                            Quantity is required.
                          </p>
                        )}
                        {row.hasError?.quantity === true && (
                          <p className="text-red-500 text-xs mt-1">
                            qty should be as per the stock
                          </p>
                        )}
                      </div>
                      {/* Unit */}
                      <div className="">
                        <CustomDropdown
                          labelName="Unit :"
                          logo={LucideTimer}
                          readOnly={row.isSerialNumber}
                          selectedValue={row.unit_id}
                          onSelect={(unit) => {
                            //  Clear selection
                            if (!unit) {
                              updateRow(index, "unit_id", undefined as any);
                              updateRow(index, "conversionFactor", 0);
                              return;
                            }

                            // if(unit){
                            updateRow(index, "unit_id", unit!);
                            // }

                            const finalFactor =
                              Number(row.quantity) *
                              Number(
                                unitForProduct.find((item) => item.id === unit)
                                  ?.conversionFactor
                              );

                            if (finalFactor) {
                              updateRow(index, "conversionFactor", finalFactor);
                            }
                          }}
                          options={unitsForRows[index] || []}
                          requiredRedDot={true}
                        />
                        {row.hasError?.unit && (
                          <p className="text-red-500 text-xs mt-1">
                            Unit is required
                          </p>
                        )}
                        <div className="col-span-2 text-xs">
                          {!Number.isNaN(row.conversionFactor) &&
                            row.quantity !== 0 &&
                            row.conversionFactor !== 0 && (
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

                      {/* PURCHASE DATE */}
                      <div>
                        <DatePickerInput
                          required
                          label="Purchase Date :"
                          logo={LucideCalendar}
                          name="purchaseDate"
                          placeholder="Select Date"
                          value={row.purchaseDate ?? ""}
                          onChange={(e) => {
                            console.log(e.target.value);
                            // if(e.target.value){
                            updateRow(index, "purchaseDate", e.target.value);
                            // }
                          }}
                          // error={handleError}
                        />
                        {row.hasError?.purchaseDate && (
                          <p className="text-red-500 text-xs mt-1">
                            Purchase Date is required
                          </p>
                        )}
                      </div>
                      {/* Delivery date */}
                      <DatePickerInput
                        label="Delivery Date :"
                        logo={LucideCalendar}
                        name="deliveryDate"
                        placeholder="Select Date"
                        value={row.deliveryDate ?? ""}
                        onChange={(e) =>
                          updateRow(index, "deliveryDate", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2 grid grid-cols-4 gap-x-1">
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
                    </div>
                    <div
                      className={`col-span-2 grid gap-1 bg-pink-00 ${
                        row.isSerialNumber ? "grid-cols-2" : "grid-cols-1"
                      }`}
                    >
                      {/* INSTALLED BY */}
                      <div className={`grid grid-cols-2 gap-x-1 mt-1`}>
                        <CompanyUserSearchFieldInput
                          label="Installed By :"
                          required
                          onUserSelected={(data) => {
                            if (!row.product) return;
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
                        {(row.hasError?.installedBy ||
                          row.hasError?.installedById) && (
                          <p className="text-red-500 text-xs mt-1">
                            Installed by is required
                          </p>
                        )}
                        {/* <div> */}
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
                                    // openSerialNumberPopup(index);

                                    // nondid changes
                                    openSerialNumberPopup(row.rowNaNoId);
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
                    <div className="col-span-2">
                      {/* Warranty terms */}
                      <TextAreaInput
                        placeholder="Enter Warranty Terms "
                        logo={ShieldCheck}
                        cols={4}
                        label="Warranty Terms : "
                        name="warrantyTerms"
                        rows={2}
                        value={row.warrantyTerms}
                        maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
                        onChange={(e) =>
                          updateRow(index, "warrantyTerms", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-4 grid grid-cols-2 gap-x-1">
                      {/* Billing address */}
                      <TextAreaInput
                        placeholder="Enter Billing Address"
                        logo={MapPin}
                        cols={4}
                        label="Billing Address :"
                        rows={2}
                        name="billingAddress"
                        maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
                        value={row.billingAddress}
                        onChange={(e) =>
                          updateRow(index, "billingAddress", e.target.value)
                        }
                      />
                      {/* Delivery address */}
                      <TextAreaInput
                        placeholder="Enter Delivery Address"
                        logo={MapPin}
                        cols={4}
                        label="Delivery Address :"
                        name="deliveryAddress"
                        value={row.deliveryAddress}
                        maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
                        onChange={(e) =>
                          updateRow(index, "deliveryAddress", e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className=" flex justify-end mt-6 text-right">
            <div>
              <Button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleCreateAccountCompanyProduct();
                }}
              >
                <div className="flex items-center gap-1">
                  <Save size={14} />
                  <span>Save</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </form>
      {showSerialNumberModule && serialRowIndex !== null && (
        <StockSerialNumber
          companyProductId={selectedCompanyProductId!} // required for API call
          // selectedInwardIds={rows[serialRowIndex].serialNumber ?? []} // pass existing selected serials
          selectedInwardIds={
            rows.find((r) => r.rowNaNoId === serialRowIndex)?.serialNumber || []
          }
          onClose={() => {
            // setActiveRow(null);
            // setSearchText("");
            // setShowSerialNumberModule(false);

            // new code
            setSerialRowIndex(null);
            setShowSerialNumberModule(false);
          }}
          // handleStockSerialNumberChange={(selectedSerialIds) => {
          //   updateRow(serialRowIndex!, "serialNumber", selectedSerialIds);
          // }}

          // nanoid changes
          handleStockSerialNumberChange={(selectedSerialIds) => {
            setRows((prev) =>
              prev.map((r) =>
                r.rowNaNoId === serialRowIndex
                  ? { ...r, serialNumber: selectedSerialIds }
                  : r
              )
            );
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
    // if (!searchText.trim() || searchText.trim().length < 0 || isDisabled) {
    //   setResults([]);
    //   return;
    // }
    if (isDisabled) return;

    try {
      setIsLoading(true);

      const response = await axiosClient.post(POST_API.GET_COMPANY_USERS, {
        company_id: loginStatus.companyId,
        search_parameter: searchText.trim() === "" ? null : searchText.trim(),
        limit: userPreference.rowsInGrid,
        requestedby: loginStatus.id,
      });

      if (response?.status === STATUS_CODE.OK) {
        setResults(response.data || []);
        setActiveIndex(0); //  set first as active
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
    fetchUsers("");
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
    // setQuery(defaultValue)
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

  const handleBlur = () => {
    // small delay so click selection still works
    setTimeout(() => {
      if (!selectedUser) {
        // nothing selected => clear or revert
        setQuery("");
        onUserSelected(null);
      } else {
        // revert back to last selected user
        setQuery(selectedUser.fullname);
      }

      setShowDropdown(false);
    }, 150);
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
          onBlur={handleBlur}
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
              : "table-header-custom appearance-none block w-full px-3 py-0.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          }
        />

        {query && !readOnly && !isDisabled && (
          <button
            onClick={clearSelected}
            className="absolute right-2 top-1 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
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
