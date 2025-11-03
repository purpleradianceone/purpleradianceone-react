/* eslint-disable @typescript-eslint/no-explicit-any */
import AddStockModalProps from "../../../@types/stock/AddStockModalProps";
import FormHeader from "../../ui/FormHeader";
import {
  ArrowLeft,
  ClipboardPen,
  Info,
  ListOrdered,
  LucideIndianRupee,
  LucideTimer,
  Plus,
  Save,
  ShieldCheck,
  WarehouseIcon,
  X,
} from "lucide-react";
import FormLayout from "../../ui/FormLayout";
import ProductManagement from "../../views/product-Management/ProductsManagement";
import { Product } from "../../../@types/products/ProductsManagementProps";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import TextAreaInput from "../../ui/TextAreaInput";
import {
  useCompanyWarehouse,
  Warehouse,
} from "../../../config/hooks/useCompanyWarehouse";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";
import CompanyWarehouseAgGrid from "../../ag-grid/CompanyWarehouseAgGrid";
import useAdjustmentReason from "../../../config/hooks/useAdjustmentReason";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import CustomDropdown from "../leads/CustomDropdown";
import useUnitForProduct from "../../../config/hooks/useUnitForProduct";

const AddStock = ({ isOpen, onClose }: AddStockModalProps) => {
  const { loginStatus } = useLoggedInUserContext();
  // const { loading: isUnitDataLoading, unit: unitData } = useUnit();
  const { companyWarehouse, loading: companyWarehouseLoading } =
    useCompanyWarehouse();
  const { adjustmentReason, loading: adjustmentReasonLoading } =
    useAdjustmentReason();
  const [selectedCompanyWarehouse, setSelectedCompanyWarehouse] =
    useState<Warehouse | null>(null);
  const [showWarehouseSelectionModule, setShowWarehouseSelectionModule] =
    useState<boolean>(false);
  const [selectedUnitId, setSelectedUnitId] = useState<number | undefined>(0);
  // const [selectedUnitError, setSelectedUnitError] = useState<boolean>(false);
  const [selectedAdjustmentReasonId, setSelectedAdjustmentReasonId] = useState<
    number | null
  >(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [showInputForm, setShowInputForm] = useState<boolean>(false);
  const { unitForProduct: unitForProductData } = useUnitForProduct({
    companyProductId: selectedProduct?.id,
  });

  const [error, setError] = useState<{
    unitIdError: boolean;
    warehouseIdError: boolean;
    adjustmentReasonId: boolean;
  }>({
    unitIdError: false,
    warehouseIdError: false,
    adjustmentReasonId: false,
  });

  const intialAddStockFormData = {
    companyId: loginStatus.companyId,
    companyProductId: 0,
    companyWarehouseId: 0,
    serial_number: "",
    quantity: 0,
    other_id: 0,
    description: "",
    createdby: loginStatus.id,
  };

  const {
    handleChange: handleAddStockFormDataChange,
    formData: addStockFormData,
    resetForm: resetStockCreateForm,
  } = useFormChange(intialAddStockFormData);

  const { errors, handleBlur, setErrors } = useFormValidation(
    addStockFormData,
    "registration"
  );

  function onRowSelectProductForStock(product: Product) {
    setSelectedProduct(null);
    if (product !== null && product !== undefined) {
      setSelectedProduct(product);
      setShowInputForm(true);
    }
  }

  function handleSelectedWarehouse(selectedWarehouse: Warehouse) {
    setSelectedCompanyWarehouse(selectedWarehouse);
    if (selectedWarehouse.id > 0 && selectedCompanyWarehouse?.id !== null) {
      setShowWarehouseSelectionModule(false);
      setShowInputForm(true);
      setError((prev) => ({
        ...prev,
        warehouseIdError: false,
      }));
    }
  }
  function handleGoBackToProductSelection() {
    setSelectedProduct(null);
    setShowInputForm(false);
  }

  const [productUnitConversionFactor, setProductUnitConversionFactor] =
    useState<number>(0);
  useEffect(() => {
    const factor = unitForProductData.find(
      (item) => item.id === selectedUnitId
    );
    if (factor?.conversionFactor) {
      const productUnitConversionFactorCalculation =
        factor?.conversionFactor * addStockFormData.quantity;
      setProductUnitConversionFactor(productUnitConversionFactorCalculation);
    } else {
      setProductUnitConversionFactor(0);
    }
  }, [selectedUnitId, addStockFormData.quantity]);

  function handleAdjustmentReasonChange(option: number) {
    if (option !== 0) {
      setSelectedAdjustmentReasonId(option);
      setError((prev) => ({
        ...prev,
        adjustmentReasonId: false,
      }));
    }
  }
  const handleCloseForm = () => {
    resetStockCreateForm();

    setErrors({
      quantity: "",
      description: "",
    });
    setSelectedAdjustmentReasonId(null);
    setSelectedCompanyWarehouse(null);
    setSelectedProduct(null);
    setSelectedUnitId(undefined);
    // setSelectedUnitError(false);
    setError({
      unitIdError: false,
      warehouseIdError: false,
      adjustmentReasonId: false,
    });
    onClose();
  };

  const validateForm = (): boolean => {
    if (addStockFormData.quantity === 0) {
      toast.error("Quantity is required");
      return false;
    }
    if (selectedUnitId === 0 || selectedUnitId === undefined) {
      // setSelectedUnitError(true);
      setError((prev) => ({
        ...prev,
        unitIdError: true,
      }));
      return false;
      // toast.error("Please select 'AMC Cycle Duration'");
    } else {
      setError((prev) => ({
        ...prev,
        unitIdError: false,
      }));
      // setSelectedUnitError(false);
    }
    if (
      selectedCompanyWarehouse?.id === null ||
      selectedCompanyWarehouse?.id === 0 ||
      selectedCompanyWarehouse?.id === undefined
    ) {
      // toast.error("Warehouse is required.")
      setError((prev) => ({
        ...prev,
        warehouseIdError: true,
      }));
      return false;
    } else {
      setError((prev) => ({
        ...prev,
        warehouseIdError: false,
      }));
    }

    if (
      selectedAdjustmentReasonId === 0 ||
      selectedAdjustmentReasonId === null ||
      selectedAdjustmentReasonId === undefined
    ) {
      // toast.error("Adjustment reason is required.");
      setError((prev) => ({
        ...prev,
        adjustmentReasonId: true,
      }));
      return false;
    }

    return true;
  };
  // submit api call
  const handleCreateStockAdjustment = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const postData = {
      company_id: loginStatus.companyId,
      company_product_id: selectedProduct?.id,
      company_warehouse_id: selectedCompanyWarehouse?.id,
      serial_number: addStockFormData.serial_number,
      unit_id: selectedUnitId,
      quantity: addStockFormData.quantity,
      other_id: selectedAdjustmentReasonId,
      description: addStockFormData.description,
      createdby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.CREATE_ADJUSTMENT_STOCK, postData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);

        if (response.data.status) {
          toast.success(response.data.message);
          handleCloseForm();
        } else {
          toast.error(response.data.message);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: handleCreateStockAdjustment,
          });
          if (refreshTokenResponse) {
            handleCreateStockAdjustment(event);
          }
        } else {
          toast.error(error.response.data);
        }
      });
  };

  useEffect(() => {
   setSelectedUnitId(undefined)
  }, [selectedProduct]);

  if (!isOpen) return null;
  if (companyWarehouseLoading || adjustmentReasonLoading)
    return (
      <FormLayout>
        <LoadingSpinner />
      </FormLayout>
    );

  return (
    <FormLayout>
      <>
        <FormHeader
          icon={Plus}
          onClose={handleCloseForm}
          description="Add new stock details to the inventory."
          preText="Add stock"
        />

        {!showInputForm && !showWarehouseSelectionModule && (
          <ProductManagement
            isGridForAccountProduct={true}
            onRowSelect={onRowSelectProductForStock}
          />
        )}
        {showInputForm && !showWarehouseSelectionModule && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center  gap-2 mt-3 px-2 ">
              <Button
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 px-1 py-1.5 border border-blue-200 bg-blue-50 rounded-md transition-all"
                onClick={handleGoBackToProductSelection}
              >
                <ArrowLeft size={14} />
                Change Product
              </Button>

              {selectedProduct && (
                <div className="text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1.5 rounded-md">
                  <span className="text-gray-500">Product:</span>{" "}
                  {selectedProduct.name}
                </div>
              )}
              {selectedProduct?.barcode !== null && (
                <div className="text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1.5 rounded-md">
                  <span className="text-gray-500">Product Barcode:</span>{" "}
                  {selectedProduct?.barcode}
                </div>
              )}
            </div>

            <form
              onSubmit={handleCreateStockAdjustment}
              className="grid grid-cols-2 space-2 gap-2"
            >
              {/* Quantity */}
              <div className="mt-1.5">
                <FormInput
                  label="Quantity : "
                  logo={LucideIndianRupee}
                  required
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity here"
                  // value={addProductToAccountFormData.quantity}
                  defaultValue={
                    addStockFormData.quantity === 0
                      ? ""
                      : addStockFormData.quantity
                  }
                  onChange={handleAddStockFormDataChange}
                  onBlur={handleBlur}
                  error={errors.quantity}
                />
                {errors.quantity && (
                  <div className="caption-custom-inactive">
                    Quantity is required
                  </div>
                )}
                {productUnitConversionFactor !== 0 && (
                  <p
                    title="Quantity is converted automatically based on the product’s default and selected stock units."
                    className="caption-custom-active flex items-center cursor-pointer gap-1"
                  >
                    Converted Quantity: {productUnitConversionFactor}{" "}
                    <Info size={12} className="" />
                  </p>
                )}
              </div>
              {/* Unit */}
              <div className="mt-4">
                <CustomDropdown
                  labelName="Unit :"
                  logo={LucideTimer}
                  preselectedOption={
                    selectedUnitId !== undefined ? selectedUnitId : 0
                  }
                  onSelect={(data) => {
                    if (data) {
                      // setSelectedUnitError(false);
                      setError((prev) => ({
                        ...prev,
                        unitIdError: false,
                      }));
                    }
                    setSelectedUnitId(data);
                  }}
                  options={unitForProductData}
                  requiredRedDot={true}
                />
                {error.unitIdError && (
                  <div className="caption-custom-inactive">
                    Product Unit is required
                  </div>
                )}
              </div>
              {/* serial number */}
              <div className="mt-1">
                <FormInput
                  label="Serial Number : "
                  logo={ListOrdered}
                  type="text"
                  name="serial_number"
                  placeholder="Enter serial number here"
                  // value={addProductToAccountFormData.quantity}
                  defaultValue={addStockFormData.serial_number}
                  onChange={handleAddStockFormDataChange}
                  // error={errors.serial_number}
                />
              </div>

              {/* warehouse */}
              <div className=" mt-2">
                <div className="w-full">
                  <label className=" input-label-custom text-sm   flex items-center gap-1 text-gray-700 mb-1 ">
                    <WarehouseIcon className="text-blue-500" size={15} />
                    <div>
                      Warehouse :<span className="ml-0 text-red-400">*</span>
                    </div>
                  </label>

                  <div className="flex items-center justify-between border border-gray-300 rounded px-3 py-1.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                    <span className="input-label-custom ">
                      {selectedCompanyWarehouse ? (
                        <>
                          {selectedCompanyWarehouse?.name}{" "}
                          <span className="text-sm">
                            ({selectedCompanyWarehouse.warehouseTypeName})
                          </span>
                        </>
                      ) : (
                        "No Warehouse selected"
                      )}
                    </span>

                    <Button
                      type="button"
                      className="text-blue-600 text-sm underline hover:text-blue-800"
                      onClick={() => {
                        setShowWarehouseSelectionModule(true);
                        setShowInputForm(false);
                      }}
                    >
                      {selectedCompanyWarehouse ? "Change" : "Select"}
                    </Button>
                  </div>
                </div>
                {error.warehouseIdError && (
                  <div className="caption-custom-inactive">
                    Warehouse is required
                  </div>
                )}
              </div>

              {/* adjustment reason */}
              <div className="mt-2">
                <h1 className="input-label-custom  mb-1 gap-1 flex items-center ">
                  <ClipboardPen className="text-blue-500" size={15} />{" "}
                  Adjustment Reason :<span className="text-red-400">*</span>
                </h1>
                <div className="flex flex-wrap gap-3">
                  {adjustmentReason.length > 0 &&
                    adjustmentReason.map((option: any) => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-2 px-2 py-1.5 border rounded cursor-pointer transition ${
                          selectedAdjustmentReasonId === option.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="radio"
                          name="adjustmentReason"
                          value={option.id}
                          checked={selectedAdjustmentReasonId === option.id}
                          onChange={() =>
                            handleAdjustmentReasonChange(option.id)
                          }
                          className="accent-blue-600 cursor-pointer"
                        />

                        <span className="caption-custom">{option.name}</span>
                      </label>
                    ))}
                </div>
                {error.adjustmentReasonId && (
                  <div className="caption-custom-inactive">
                    Adjustment reason is required
                  </div>
                )}
              </div>

              {/* description */}
              <div className="col-span-2 ">
                <TextAreaInput
                  logo={ShieldCheck}
                  cols={4}
                  label="Description: "
                  name="description"
                  rows={3}
                  defaultValue={addStockFormData.description}
                  onChange={handleAddStockFormDataChange}
                />
              </div>

              <div className="flex items-center justify-end bg-pink-00 col-span-2">
                <div className="flex gap-1">
                  <Button onClick={handleCloseForm} type="button">
                    <div className="flex items-center gap-0.5">
                      <X size={SIZE.SIXTEEN} />
                      Cancel
                    </div>
                  </Button>
                  <Button type="submit">
                    <div className="flex items-center gap-1">
                      <Save size={SIZE.SIXTEEN} />
                      Save
                    </div>
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}

        {showWarehouseSelectionModule && !showInputForm && (
          <div className="ag-theme-balham w-full h-[calc(100vh-120px)] p-2">
            <CompanyWarehouseAgGrid
              data={companyWarehouse}
              onRowSelect={handleSelectedWarehouse}
            />
          </div>
        )}
      </>
    </FormLayout>
  );
};
export default AddStock;
