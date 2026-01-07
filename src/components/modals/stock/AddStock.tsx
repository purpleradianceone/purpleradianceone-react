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
import { useCompanyWarehouse } from "../../../config/hooks/useCompanyWarehouse";
import useAdjustmentReason from "../../../config/hooks/useAdjustmentReason";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import useUnitForProduct from "../../../config/hooks/useUnitForProduct";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import CustomSelect from "../../ui/CustomSelect";
import { toSelectOptions } from "../../../utils/toSelectOption";

const AddStock = ({
  isUsedInProductModal = false,
  isOpen,
  onClose,
  product,
}: AddStockModalProps) => {
  const { loginStatus } = useLoggedInUserContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { companyWarehouse, loading: companyWarehouseLoading } =
    useCompanyWarehouse();
  const { adjustmentReason, loading: adjustmentReasonLoading } =
    useAdjustmentReason();

  // preselected adjustment => initial stock
  const [selectedAdjustmentReasonId, setSelectedAdjustmentReasonId] = useState<
    number | null
  >(1);

  // it is used when we create stock from the stock module where we select the product and then continue
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [showInputForm, setShowInputForm] = useState<boolean>(false);
  const { unitForProduct: unitForProductData } = useUnitForProduct({
    companyProductId: selectedProduct?.id,
  });
  const [selectedUnitId, setSelectedUnitId] = useState<number | undefined>(
    undefined
  );

  // Note : if Product is given then set it to selected product AND if not then first show the selection module then select the product
  useEffect(() => {
    if (!product) return;

    setSelectedProduct(product);
    setShowInputForm(true);
  }, [product]);

  // Note : it will set the unit id if the selected product
  useEffect(() => {
    if (!selectedProduct) return;
    if (
      selectedUnitId == null &&
      // selectedProduct?.isSerialNumber === true &&
      selectedProduct?.parentUnitId
    ) {
      setSelectedUnitId(selectedProduct.parentUnitId);
    }
  }, [selectedProduct, selectedUnitId]);

  // for warehouse id
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
    null
  );

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
    quantity: 1,
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

  function handleGoBackToProductSelection() {
    setSelectedProduct(null);
    setSelectedUnitId(undefined)
    setShowInputForm(false);
  }

  const [productUnitConversionFactor, setProductUnitConversionFactor] =
    useState<number>(0);

  // Note : Conversion factor calculation
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
  }, [
    selectedUnitId,
    unitForProductData,
    addStockFormData.quantity,
    selectedProduct?.parentUnitId,
  ]);

  // Note : Adjustment reason change function
  function handleAdjustmentReasonChange(option: number) {
    if (option !== 0) {
      setSelectedAdjustmentReasonId(option);
      setError((prev) => ({
        ...prev,
        adjustmentReasonId: false,
      }));
    }
  }

  // Note : on close Clear the states
  const handleCloseForm = () => {
    resetStockCreateForm();

    setErrors({
      quantity: "",
      description: "",
    });
    setSelectedAdjustmentReasonId(null);
    setSelectedWarehouseId(null);
    setSelectedProduct(null);
    setSelectedUnitId(undefined);
    setError({
      unitIdError: false,
      warehouseIdError: false,
      adjustmentReasonId: false,
    });
    onClose();
  };

  // Note : Validation before api call
  const validateForm = (): boolean => {
    if (addStockFormData.quantity === 0) {
      toast.error("Quantity is required");
      return false;
    }

    if (selectedUnitId === 0 || selectedUnitId === undefined) {
      setError((prev) => ({
        ...prev,
        unitIdError: true,
      }));
      return false;
    } else {
      setError((prev) => ({
        ...prev,
        unitIdError: false,
      }));
    }

    if (
      selectedAdjustmentReasonId === 0 ||
      selectedAdjustmentReasonId === null ||
      selectedAdjustmentReasonId === undefined
    ) {
      setError((prev) => ({
        ...prev,
        adjustmentReasonId: true,
      }));
      return false;
    }
    if (
      selectedWarehouseId === 0 ||
      selectedWarehouseId === null ||
      selectedWarehouseId === undefined
    ) {
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
    if (isSaving) return;
    const postData = {
      company_id: loginStatus.companyId,
      company_product_id: selectedProduct?.id,
      company_warehouse_id: selectedWarehouseId,
      serial_number: addStockFormData.serial_number,
      unit_id: selectedUnitId,
      quantity: addStockFormData.quantity,
      other_id: selectedAdjustmentReasonId,
      description: addStockFormData.description,
      createdby_id: loginStatus.id,
    };

    setIsSaving(true);
    await axios
      .post(POST_API.CREATE_ADJUSTMENT_STOCK, postData, {
        withCredentials: true,
      })
      .then((response) => {
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
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  // Note : Data sanitization for dropdowns
  const warehouseOptions = toSelectOptions(companyWarehouse, "id", "name");
  const unitOptions = toSelectOptions(unitForProductData, "id", "name");

  // if isOpen is false then return null
  if (!isOpen) return null;

  // show loading animation till data comes from api
  if (companyWarehouseLoading || adjustmentReasonLoading)
    return (
      <LoadingPopUpAnimation
        show={companyWarehouseLoading || adjustmentReasonLoading}
      />
    );

  return (
    <FormLayout width={5}>
      <>
        <FormHeader
          icon={Plus}
          onClose={handleCloseForm}
          description="Add new stock details to the inventory."
          preText="Add Stock"
        />

        {!selectedProduct && !showInputForm && (
          <ProductManagement
            isGridForAccountProduct={true}
            onRowSelect={onRowSelectProductForStock}
          />
        )}
        {showInputForm && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center  gap-2 mt-3 px-2 ">
              {!isUsedInProductModal && (
                <Button
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 px-1 py-1.5 border border-blue-200 bg-blue-50 rounded-md transition-all"
                  onClick={handleGoBackToProductSelection}
                >
                  <ArrowLeft size={14} />
                  Change Product
                </Button>
              )}

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
              className="space-y-2 p-1"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Quantity */}
                <div className="mt-1.5">
                  <FormInput
                    label="Quantity : "
                    logo={LucideIndianRupee}
                    required
                    readonly={selectedProduct?.isSerialNumber}
                    type="number"
                    name="quantity"
                    placeholder="Enter quantity here"
                    defaultValue={
                      selectedProduct?.isSerialNumber
                        ? 1
                        : !selectedProduct?.isSerialNumber &&
                          addStockFormData.quantity === 0
                        ? ""
                        : addStockFormData.quantity
                    }
                    value={
                      selectedProduct?.isSerialNumber
                        ? 1
                        : !selectedProduct?.isSerialNumber &&
                          addStockFormData.quantity === 0
                        ? ""
                        : addStockFormData.quantity
                    }
                    onChange={handleAddStockFormDataChange}
                    onBlur={handleBlur}
                  />
                  {errors.quantity && (
                    <div className="caption-custom-inactive">
                      Quantity is required
                    </div>
                  )}

                  <p
                    title="Quantity is converted automatically based on the Product base unit and selected stock unit."
                    className="caption-custom-active flex items-center cursor-pointer gap-1"
                  >
                    Quantity will be inserted into the stock :{" "}
                    {productUnitConversionFactor}
                    {selectedProduct?.unitNameInStock}
                    <Info size={12} className="" />
                  </p>
                </div>
                {/* Unit */}

                <div className="mt-1.5">
                  {/* <CustomDropdown
                    labelName="Unit :"
                    logo={LucideTimer}
                    preselectedOption={
                      !selectedUnitId
                        ? selectedProduct?.parentUnitId || product?.parentUnitId
                        : selectedUnitId
                    }
                    onSelect={(data) => {
                      if (data) {
                        setError((prev) => ({
                          ...prev,
                          unitIdError: false,
                        }));
                      }
                      setSelectedUnitId(data);
                    }}
                    readOnly={
                      selectedProduct?.isSerialNumber &&
                      (selectedProduct?.parentUnitId || product?.parentUnitId)
                        ? true
                        : false
                    }
                    options={unitForProductData}
                    requiredRedDot={true}
                  /> */}
                  <CustomSelect
                    label="Unit :"
                    isClearable={false}
                    icon={LucideTimer}
                    options={unitOptions}
                    value={selectedUnitId ?? undefined}
                    onChange={(value) => {
                      if (value) {
                        setError((prev) => ({
                          ...prev,
                          unitIdError: false,
                        }));
                      } else {
                        setError((prev) => ({
                          ...prev,
                          unitIdError: true,
                        }));
                      }
                      setSelectedUnitId(value);
                    }}
                    isDisabled={
                      !!(
                        selectedProduct?.isSerialNumber &&
                        selectedProduct?.parentUnitId
                      )
                    }
                    isRequired={true}
                    placeholder="Select Unit"
                  />

                  {error.unitIdError && (
                    <div className="caption-custom-inactive">
                      Product Unit is required
                    </div>
                  )}
                </div>

                {/* serial number */}
                <div className="">
                  <FormInput
                    label="Serial Number : "
                    logo={ListOrdered}
                    type="text"
                    required={selectedProduct?.isSerialNumber}
                    name="serial_number"
                    placeholder="Enter serial number here"
                    defaultValue={addStockFormData.serial_number}
                    onChange={handleAddStockFormDataChange}
                  />
                </div>

                {/* warehouse */}
                <div className="">
                  <div className="w-full h-fit">
                    <CustomSelect
                      icon={WarehouseIcon}
                      options={warehouseOptions}
                      placeholder="Select Warehouse"
                      label="Warehouse :"
                      value={selectedWarehouseId ?? undefined}
                      onChange={(value) => {
                        if (value) {
                          setError((prev) => ({
                            ...prev,
                            warehouseIdError: false,
                          }));
                        } else {
                          setError((prev) => ({
                            ...prev,
                            warehouseIdError: true,
                          }));
                        }
                        setSelectedWarehouseId(value ?? null);
                      }}
                      isDisabled={false}
                      isRequired
                    />
                  </div>
                  {error.warehouseIdError && (
                    <div className="caption-custom-inactive">
                      Warehouse is required
                    </div>
                  )}
                </div>

                {/* adjustment reason */}
                <div className="">
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
                <div className="col-span-1 md:col-span-full ">
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
      </>
      {isSaving && <LoadingPopUpAnimation show={isSaving} />}
    </FormLayout>
  );
};
export default AddStock;
