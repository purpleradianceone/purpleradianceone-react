import {
  ArrowLeft,
  BoxSelectIcon,
  Info,
  LucideCalendar,
  LucideIndianRupee,
  LucideTimer,
  MapPin,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import FormHeader from "../../../ui/FormHeader";
import FormInput from "../../../ui/FormInput";
import TextAreaInput from "../../../ui/TextAreaInput";
import { useEffect, useState } from "react";
import ProductManagement from "../../../views/product-Management/ProductsManagement";
import { Product } from "../../../../@types/products/ProductsManagementProps";
import Button from "../../../ui/Button";
import DatePickerInput from "../../../ui/DatePickerInput";
import { useFormChange } from "../../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../../config/hooks/useFormValidation";
import CustomDropdown from "../../leads/CustomDropdown";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import toast from "react-hot-toast";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import { SIZE, STATUS_CODE } from "../../../../constants/AppConstants";
import RefreshToken from "../../../../config/validations/RefreshToken";
import GetCompanyUsers from "../../../views/manage-company-users/CompanyUsersManagement";
import CompanyUser from "../../../../@types/company-users/CompanyUser";
import useUnitForProduct from "../../../../config/hooks/useUnitForProduct";
import LoadingPopUpAnimation from "../../../views/card/LoadingPopUpAnimation";
import { StockSerialNumber } from "../../stock/stock-available-serial-number/StockSerialNumber";
import FormLayout from "../../../ui/FormLayout";
import axiosClient from "../../../../axios-client/AxiosClient";
import { SelectedSerialNumber } from "../../../ag-grid/StockAvailableSerialNumberAgGrid";

const CreateAccountCompanyProduct = ({
  onClose,
  accountId,
  getAccountCompanyProduct,
}: {
  onClose: () => void;
  accountId: number;
  getAccountCompanyProduct: () => void;
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { unitForProduct: unitForProductData } = useUnitForProduct({
    companyProductId: selectedProduct?.id,
  });
  const [selectedUnitId, setSelectedUnitId] = useState<number | undefined>(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRowSelectProductForAssingingToAccount = (data: Product | any) => {
    console.log(data);
    setSelectedProduct(null);
    if (data !== null && data !== undefined) {
      setSelectedProduct(data);
      setShowGrid(!showGrid);
    }
  };
  const [selectedInstalledBy, setSelectedInstalledBy] = useState<CompanyUser>();
  const [showCompanyUserModule, setShowCompanyUserModule] =
    useState<boolean>(false);
  const [showSerialNumberModule, setShowSerialNumberModule] =
    useState<boolean>(false);
  const intialAddProductToAccountFormData = {
    accountId: 0,
    amcCycle: 0,
    amcCycleEndDate: "",
    amcCycleIntervalTypeId: 0,
    amcCycleStartDate: "",
    billingAddress: "",
    companyId: 0,
    companyProductId: 0,
    deliveryAddress: "",
    deliveryDate: "",
    installationDate: "",
    installedBy: 0,
    purchaseDate: "",
    quantity: 0,
    warranty: 0,
    warrantyEndDate: "",
    warrantyIntervalTypeId: 0,
    warrantyStartDate: "",
    warrantyTerms: "",
  };

  const {
    handleChange: handleAddProductToAccountFormDataChange,
    formData: addProductToAccountFormData,
    resetForm: resetAccountCreateForm,
  } = useFormChange(intialAddProductToAccountFormData);

  const { errors, handleBlur, setErrors } = useFormValidation(
    addProductToAccountFormData,
    "registration"
  );

  const handleGoBackToProductSelection = () => {
    setSelectedProduct(null);
    setShowGrid(!showGrid);
  };

  // reset add the states before closing the form
  const handleCloseForm = () => {
    setSelectedProduct(null);

    // resets the states for form
    resetAccountCreateForm();

    // setWarrantyIntervalTypeId(0);
    // setAmcIntervalTypeId(0);
    // setSelectedWarranty(0);
    // setSelectedAmc(0);
    setErrors({
      quantity: "",
      purchaseDate: "",
      installationDate: "",
      deliveryDate: "",
      warrantyStartDate: "",
    });
    setErrorsData({
      AmcIntervalTypeId: false,
      SelectedAmc: false,
      Warranty: false,
      WarrantyIntervalTypeId: false,
      unitIdError: false,
    });
    onClose();
  };

  // const rangeOfNumber: Item[] = useMemo(() => {
  //   return range(1, 365);
  // }, []);

  // const [selectedWarrantyIntervalTypeId, setWarrantyIntervalTypeId] =
  //   useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  // const [selectedAmcIntervalTypeId, setAmcIntervalTypeId] = useState<number>(0);
  // const [SelectedWarranty, setSelectedWarranty] = useState<number>(0);
  // const [selectedAmc, setSelectedAmc] = useState<number | undefined>(0);
  // useEffect(() => {
  //   if (selectedProduct) {
  //     setSelectedAmc(selectedProduct?.defaultAmcCycle);
  //     setAmcIntervalTypeId(selectedProduct.defaultAmcCycleIntervalTypeId);
  //     setWarrantyIntervalTypeId(selectedProduct.defaultWarrantyIntervalTypeId);
  //     setSelectedWarranty(selectedProduct.defaultWarranty);
  //   }
  // }, [selectedProduct]);
  const [errorsData, setErrorsData] = useState<{
    WarrantyIntervalTypeId: boolean;
    Warranty: boolean;
    AmcIntervalTypeId: boolean;
    SelectedAmc: boolean;
    unitIdError: boolean;
  }>({
    WarrantyIntervalTypeId: false,
    Warranty: false,
    AmcIntervalTypeId: false,
    SelectedAmc: false,
    unitIdError: false,
  });

  const [productUnitConversionFactor, setProductUnitConversionFactor] =
    useState<number>(0);
  useEffect(() => {
    const factor = unitForProductData.find(
      (item) => item.id === selectedUnitId
    );
    if (factor?.conversionFactor) {
      const productUnitConversionFactorCalculation =
        factor?.conversionFactor * addProductToAccountFormData.quantity;
      setProductUnitConversionFactor(productUnitConversionFactorCalculation);
    } else {
      setProductUnitConversionFactor(0);
    }
  }, [
    selectedUnitId,
    addProductToAccountFormData.quantity,
    unitForProductData,
  ]);

  const validateFormData = (): boolean => {
    if (
      selectedInstalledBy?.id === 0 ||
      selectedInstalledBy?.id === null ||
      selectedInstalledBy?.id === undefined
    ) {
      toast.error("Installed By user is required.");
      return false;
    }

    if (
      selectedProduct?.id === null ||
      selectedProduct?.id === undefined ||
      selectedProduct?.id === 0
    ) {
      toast.error("Product is required.");
      return false;
    }
    if (selectedUnitId === 0 || selectedUnitId === undefined) {
      setErrorsData((prev) => ({
        ...prev,
        unitIdError: true,
      }));
      return false;
    } else {
      setErrorsData((prev) => ({
        ...prev,
        unitIdError: false,
      }));
    }

    if (
      addProductToAccountFormData.quantity === 0 ||
      addProductToAccountFormData.quantity === null ||
      addProductToAccountFormData.quantity === undefined
    ) {
      toast.error("Quantity is required.");
      return false;
    }
    // if (
    //   selectedAmc === 0 ||
    //   selectedAmc === null ||
    //   selectedAmc === undefined
    // ) {
    //   setErrorsData((prev) => ({
    //     ...prev,
    //     SelectedAmc: true,
    //   }));
    //   return false;
    // }

    // if (
    //   selectedAmcIntervalTypeId === 0 ||
    //   selectedAmcIntervalTypeId === null ||
    //   selectedAmcIntervalTypeId === undefined
    // ) {
    //   setErrorsData((prev) => ({
    //     ...prev,
    //     AmcIntervalTypeId: true,
    //   }));
    //   return false;
    // }

    // if (
    //   SelectedWarranty === 0 ||
    //   SelectedWarranty === null ||
    //   SelectedWarranty === undefined
    // ) {
    //   setErrorsData((prev) => ({
    //     ...prev,
    //     Warranty: true,
    //   }));
    //   return false;
    // }

    // if (
    //   selectedWarrantyIntervalTypeId === 0 ||
    //   selectedWarrantyIntervalTypeId === null ||
    //   selectedWarrantyIntervalTypeId === undefined
    // ) {
    //   setErrorsData((prev) => ({
    //     ...prev,
    //     WarrantyIntervalTypeId: true,
    //   }));
    //   return false;
    // }

    // All good
    return true;
  };

  const handleSelctedInstalledByUser = (data: CompanyUser) => {
    console.log(data);

    setSelectedInstalledBy(data);
    if (data.id > 0) {
      setShowCompanyUserModule(false);
      setShowGrid(true);
    }
  };
  const formattedDate = (date: string) => {
    if(date){

      const dateObj = new Date(date);
      const day = dateObj.getDate();
      const month = dateObj
      .toLocaleString("defalut", { month: "short" })
      .toLowerCase();
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return null;
  };

  // Give call to the api
  const handleCreateAccountCompanyProduct = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (isSaving) return;
    const isValid = validateFormData();

    if (!isValid) {
      toast.error("Please fill the required field.");
      return;
    }

    const purchaseDate = formattedDate(
      addProductToAccountFormData.purchaseDate
    );
    const deliveryDate = formattedDate(
      addProductToAccountFormData.deliveryDate
    );

    const installationDate = formattedDate(
      addProductToAccountFormData.installationDate
    );

    const warrentyStartDate = formattedDate(
      addProductToAccountFormData.warrantyStartDate
    );

    const warrrentyEndDate = formattedDate(
      addProductToAccountFormData.warrantyEndDate
    );

    const amcCycleStartDate = formattedDate(
      addProductToAccountFormData.amcCycleStartDate
    );
    const AmcCycleEndDate = formattedDate(
      addProductToAccountFormData.amcCycleEndDate
    );

    setIsSaving(true);
    const postData = {
      company_id: loginStatus.companyId,
      account_id: accountId,
      company_product_id: selectedProduct?.id,
      unit_id: selectedUnitId,
      quantity: addProductToAccountFormData.quantity,
      stock_inward_id_array: selectedInwardIds,
      purchase_date: purchaseDate,
      delivery_date: deliveryDate,
      delivery_address: addProductToAccountFormData.deliveryAddress,
      billing_address: addProductToAccountFormData.billingAddress,
      installation_date: installationDate,
      installed_by: selectedInstalledBy?.id,
      warranty_start_date: warrentyStartDate,
      warranty_end_date: warrrentyEndDate,
      warranty_terms: addProductToAccountFormData.warrantyTerms,
      amc_cycle_start_date: amcCycleStartDate,
      amc_cycle_end_date: AmcCycleEndDate,
      createdby_id: loginStatus.id,
    };
    await axiosClient
      .post(POST_API.CREATE_ACCOUNT_COMPANY_PRODUCT, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          handleCloseForm();
          getAccountCompanyProduct();
        } else {
          toast.error(response.data.message);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: handleCreateAccountCompanyProduct,
          });
          if (refreshTokenResponse) {
            handleCreateAccountCompanyProduct(e);
          }
        } else {
          toast.error(error.response.data);
        }
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  useEffect(() => {
    setSelectedUnitId(undefined);
  }, [selectedProduct]);

  const [selectedInwardIds, setSelectedInwardIds] = useState<SelectedSerialNumber[]>([]);
  function handleStockSerialNumberChange(ids: SelectedSerialNumber[]) {
    setSelectedInwardIds(ids);
  }

  
  return (
    <FormLayout width={6}>
      {/* Header */}
      {isSaving && <LoadingPopUpAnimation show={isSaving} />}
      <FormHeader
        icon={BoxSelectIcon}
        onClose={handleCloseForm}
        preText="Assign Product to account"
        description="Assign the new product to this Account."
      />
      {!showGrid && !showCompanyUserModule && !showSerialNumberModule && (
        <>
          <ProductManagement
            isGridForAccountProduct={true}
            onRowSelect={onRowSelectProductForAssingingToAccount}
          />
        </>
      )}

      {showGrid && !showCompanyUserModule && (
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
          </div>

          <form
            onSubmit={handleCreateAccountCompanyProduct}
            className="space-y-2 p-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Quantity */}
              <div
                className={`grid ${
                  selectedProduct?.isSerialNumber
                    ? "grid-cols-2"
                    : "grid-cols-2"
                } gap-2`}
              >
                <div>
                  <FormInput
                    label="Quantity : "
                    logo={LucideIndianRupee}
                    step="any"
                    required
                    type="number"
                    name="quantity"
                    min={0}
                    placeholder="Enter quantity here"
                    // value={addProductToAccountFormData.quantity}
                    defaultValue={
                      addProductToAccountFormData.quantity === 0
                        ? ""
                        : addProductToAccountFormData.quantity
                    }
                    onChange={handleAddProductToAccountFormDataChange}
                    onBlur={handleBlur}
                    error={errors.quantity}
                  />
                  {productUnitConversionFactor !== 0 && (
                    <p
                      title="Quantity is converted automatically based on the product base unit and current selected unit."
                      className="caption-custom-active flex items-center cursor-pointer gap-1"
                    >
                      Quantity will be deducted from stock :{" "}
                      {productUnitConversionFactor}
                      {selectedProduct?.unitNameInStock}
                      <Info size={12} className="" />
                    </p>
                  )}
                </div>
                {/* Unit */}
                <div className="">
                  <CustomDropdown
                    labelName="Unit :"
                    logo={LucideTimer}
                    preselectedOption={
                      selectedUnitId !== undefined ? selectedUnitId : 0
                    }
                    onSelect={(data) => {
                      if (data) {
                        // setSelectedUnitError(false);
                        setErrorsData((prev) => ({
                          ...prev,
                          unitIdError: false,
                        }));
                      }
                      setSelectedUnitId(data);
                    }}
                    options={unitForProductData}
                    requiredRedDot={true}
                  />
                  {errorsData.unitIdError && (
                    <div className="caption-custom-inactive">
                      Product Unit is required
                    </div>
                  )}
                </div>
              </div>
              {selectedProduct?.isSerialNumber && (
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
                        {selectedInwardIds.length > 0 ? (
                          <>
                            {/* {selectedInstalledBy?.fullname}{" "} */}
                            <span className="">
                              Serial number Selected: {selectedInwardIds.length}
                            </span>
                          </>
                        ) : (
                          "No serial number selected"
                        )}
                      </span>

                      <Button
                        type="button"
                        className="text-blue-600 text-sm underline hover:text-blue-800"
                        onClick={() => {
                          setShowSerialNumberModule(true);
                          setShowCompanyUserModule(false);
                          setShowGrid(false);
                        }}
                      >
                        {selectedInstalledBy ? "Change" : "Select"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 ">
                {/* installation date */}
                <DatePickerInput
                  label="Installation Date :"
                  logo={LucideCalendar}
                  name="installationDate"
                  defaultValue={addProductToAccountFormData.installationDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                />

                <div className="flex items-center justify-center  h-fit">
                  <div className="w-full">
                    <label className=" input-label-custom text-sm   flex items-center gap-1 text-gray-700  ">
                      <User className="text-blue-500" size={15} />
                      <div>
                        Installed By :
                        <span className="ml-0 text-red-400">*</span>
                      </div>
                    </label>

                    <div className="flex items-center justify-between border border-gray-300 rounded px-3 py-1 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                      <span className=" table-header-custom  text-nowrap overflow-auto">
                        {selectedInstalledBy ? (
                          <>
                            {selectedInstalledBy?.fullname || "Name not given"}{" "}
                            <span className="text-sm">
                              {/* {` (${
                                selectedInstalledBy?.email
                                  ? selectedInstalledBy.email
                                  : selectedInstalledBy?.mobilenumber
                              })`} */}
                            </span>
                          </>
                        ) : (
                          "No user selected"
                        )}
                      </span>

                      <Button
                        type="button"
                        className="text-blue-600 text-sm underline hover:text-blue-800"
                        onClick={() => {
                          setShowCompanyUserModule(true);
                          setShowGrid(false);
                        }}
                      >
                        {selectedInstalledBy ? "Change" : "Select"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 ">
                {/* purchase date */}
                <DatePickerInput
                  label="Purchase Date :"
                  required
                  logo={LucideCalendar}
                  name="purchaseDate"
                  defaultValue={addProductToAccountFormData.purchaseDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                  onBlur={handleBlur}
                  error={errors.purchaseDate}
                />
                {/* Delivery date */}
                <DatePickerInput
                  label="Delivery Date :"
                  logo={LucideCalendar}
                  name="deliveryDate"
                  defaultValue={addProductToAccountFormData.deliveryDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                />
              </div>

              {/* amc cycle duration &&  Amc time unit */}
              {/* <div className="grid grid-cols-2 gap-3 mt-5">
                <div>
                  <CustomDropdown
                    labelName="AMC Cycle Duration:"
                    logo={LucideClock}
                    preselectedOption={selectedAmc}
                    onSelect={(selectedValue) => {
                      if (selectedValue) {
                        setErrorsData((prev) => ({
                          ...prev,
                          SelectedAmc: false,
                        }));
                        setSelectedAmc(selectedValue);
                      } else {
                        setErrorsData((prev) => ({
                          ...prev,
                          SelectedAmc: true,
                        }));
                        setSelectedAmc(0);
                      }
                    }}
                    options={rangeOfNumber}
                    requiredRedDot={true}
                  />
                  {errorsData.SelectedAmc && (
                    <div className="caption-custom-inactive">
                      AMC Cycle Duration is required
                    </div>
                  )}
                </div>

                <div>
                  <CustomDropdown
                    labelName="AMC Time Unit: "
                    logo={LucideTimer}
                    preselectedOption={selectedAmcIntervalTypeId}
                    onSelect={(selectedValue) => {
                      console.log(selectedValue);
                      if (selectedValue) {
                        setErrorsData((prev) => ({
                          ...prev,
                          AmcIntervalTypeId: false,
                        }));
                        setAmcIntervalTypeId(selectedValue);
                      } else {
                        setErrorsData((prev) => ({
                          ...prev,
                          AmcIntervalTypeId: true,
                        }));
                        setAmcIntervalTypeId(0);
                      }
                    }}
                    options={intervalTypeData}
                    requiredRedDot={true}
                  />
                  {errorsData.AmcIntervalTypeId && (
                    <div className="caption-custom-inactive">
                      Amc Time Unit is required
                    </div>
                  )}
                </div>
              </div> */}

              {/* Amc start date & Amc End date */}
              <div className="grid grid-cols-2 gap-3 ">
                <DatePickerInput
                  label="Amc Start Date :"
                  logo={LucideCalendar}
                  name="amcCycleStartDate"
                  defaultValue={addProductToAccountFormData.amcCycleStartDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                  maxDate={addProductToAccountFormData.amcCycleEndDate}
                />
                <DatePickerInput
                  label="Amc End Date :"
                  logo={LucideCalendar}
                  name="amcCycleEndDate"
                  defaultValue={addProductToAccountFormData.amcCycleEndDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                  minDate={addProductToAccountFormData.amcCycleStartDate}
                />
              </div>

              {/* Warranty & warranty time unit */}
              {/* <div className="grid grid-cols-2 gap-3 mt-7">
                <div>
                  <CustomDropdown
                    labelName="Warranty :"
                    logo={LucideClock}
                    preselectedOption={SelectedWarranty}
                    onSelect={(data) => {
                      if (data) {
                        setErrorsData((prev) => ({
                          ...prev,
                          Warranty: false,
                        }));
                        setSelectedWarranty(data);
                      } else {
                        setErrorsData((prev) => ({
                          ...prev,
                          Warranty: true,
                        }));
                        setSelectedWarranty(0);
                      }
                    }}
                    options={rangeOfNumber}
                    requiredRedDot={true}
                  />
                  {errorsData.Warranty && (
                    <div className="caption-custom-inactive">
                      Warranty duration is required
                    </div>
                  )}
                </div>
                <div>
                  <CustomDropdown
                    labelName="Warranty Time Unit :"
                    logo={LucideTimer}
                    preselectedOption={selectedWarrantyIntervalTypeId}
                    onSelect={(selectedValue) => {
                      console.log(selectedValue);
                      if (selectedValue) {
                        setErrorsData((prev) => ({
                          ...prev,
                          WarrantyIntervalTypeId: false,
                        }));
                        setWarrantyIntervalTypeId(selectedValue);
                      } else {
                        setErrorsData((prev) => ({
                          ...prev,
                          WarrantyIntervalTypeId: true,
                        }));
                        setWarrantyIntervalTypeId(0);
                      }
                    }}
                    options={intervalTypeData}
                    requiredRedDot={true}
                  />
                  {errorsData.WarrantyIntervalTypeId && (
                    <div className="caption-custom-inactive">
                      Warranty Time Unit is required
                    </div>
                  )}
                </div>
              </div> */}

              {/* Warranty start date  & Warranty end date*/}
              <div className="grid grid-cols-2 gap-3 ">
                {/* Warranty start date */}
                <DatePickerInput
                  label="Warranty Start Date :"
                  logo={LucideCalendar}
                  name="warrantyStartDate"
                  defaultValue={addProductToAccountFormData.warrantyStartDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                   maxDate={addProductToAccountFormData.warrantyEndDate}
                />

                {/* Warranty end date */}
                <DatePickerInput
                  label="Warranty End Date :"
                  logo={LucideCalendar}
                  name="warrantyEndDate"
                  defaultValue={addProductToAccountFormData.warrantyEndDate}
                  placeholder="Select Date"
                  onChange={handleAddProductToAccountFormDataChange}
                  minDate={addProductToAccountFormData.warrantyStartDate}
                />
              </div>
              {/* <div className="col-span-2"> */}
                {/* Warranty terms */}
                <TextAreaInput
                  logo={ShieldCheck}
                  cols={4}
                  label="Warranty Terms : "
                  name="warrantyTerms"
                  rows={3}
                  defaultValue={addProductToAccountFormData.warrantyTerms}
                  onChange={handleAddProductToAccountFormDataChange}
                  // onBlur={handleBlur}
                />
                {/* Delivery address */}
                <TextAreaInput
                  logo={MapPin}
                  cols={4}
                  label="Delivery Address :"
                  name="deliveryAddress"
                  defaultValue={addProductToAccountFormData.deliveryAddress}
                  onChange={handleAddProductToAccountFormDataChange}
                  // onBlur={handleBlur}
                  rows={3}
                />
                {/* Billing address */}
                <TextAreaInput
                  logo={MapPin}
                  cols={4}
                  label="Billing Address :"
                  rows={3}
                  name="billingAddress"
                  defaultValue={addProductToAccountFormData.billingAddress}
                  onChange={handleAddProductToAccountFormDataChange}
                  // onBlur={handleBlur}
                />
              {/* </div> */}
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
      {showCompanyUserModule && !showGrid && !showSerialNumberModule && (
        <GetCompanyUsers
          onRowSelect={handleSelctedInstalledByUser}
          isUsedInAccountProductForAssingingInstalledBy={true}
        />
      )}
      {showSerialNumberModule && !showGrid && !showCompanyUserModule && (
        <StockSerialNumber
          companyProductId={selectedProduct?.id}
          onClose={() => {
            setShowSerialNumberModule(false);
            setShowGrid(true);
          }}
          selectedInwardIds={selectedInwardIds}
          handleStockSerialNumberChange={handleStockSerialNumberChange}
        />
      )}
    </FormLayout>
  );
};

export default CreateAccountCompanyProduct;
