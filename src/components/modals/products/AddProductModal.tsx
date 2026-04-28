/* eslint-disable react-hooks/exhaustive-deps */
import {
  ListOrdered,
  LucideAirplay,
  LucideCalendar,
  LucideClock,
  LucideGroup,
  LucideIndianRupee,
  LucideLink,
  LucidePercent,
  LucidePresentation,
  LucideTimer,
  LucideVerified,
  Save,
  Store,
  Text,
  X,
} from "lucide-react";
import { GAP, STATUS_CODE, VALIDATIONS } from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import TextAreaInput from "../../ui/TextAreaInput";
import RadioButtons from "../../ui/RadioButton";
import React, { useEffect, useMemo, useState } from "react";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { Product } from "../../../@types/products/ProductsManagementProps";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import RefreshToken from "../../../config/validations/RefreshToken";
import DatePickerInput from "../../ui/DatePickerInput";
import AddProductModalProps from "../../../@types/modal/AddProductModalProps";
import MESSAGE from "../../../constants/Messages";
import ApiError from "../../../@types/error/ApiError";
// import useScreenSize from "../../../config/hooks/useScreenSize";
import toast from "react-hot-toast";
import CustomDropdown from "../leads/CustomDropdown";
import { useIntervalType } from "../../../config/hooks/useIntervalType";
import { useProductType } from "../../../config/hooks/useProductTypes";
import { Item, range } from "../../../constants/NumberList";
import FormHeader from "../../ui/FormHeader";
import useUnit from "../../../config/hooks/useUnit";
import FormLayout from "../../ui/FormLayout";
import FormSkeleton from "../Account/FormSkeleton";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import FormCheckbox from "../../ui/FormCheckbox";

function AddProductModal({
  isOpen,
  onClose,
  handleProductChangeOnAdd,
}: AddProductModalProps) {
  const { loading: unitDataLoading, unit: unitData } = useUnit();
  const { loading: intervalTypeLoading, intervalTypeData } = useIntervalType();
  const { loading: productTypeLoading, productTypeData } = useProductType();
  const { userHasAccessToAddProduct } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [selectedTaxCode, setSelectedTaxCode] = useState<"hsn" | "sac">("hsn");

  const ProductsRadioButtonOptions = [
    {
      label: "HSN",
      value: "hsn",
      id: "hsn",
      name: "taxCode",
      checked: selectedTaxCode === "hsn" ? true : false,
    },
    {
      label: "SAC",
      value: "sac",
      id: "sac",
      name: "taxCode",
      checked: selectedTaxCode === "sac" ? true : false,
    },
  ];

  const handleTaxRadioButtonChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.value === "hsn") {
      setSelectedTaxCode("hsn");
    } else if (event.target.value === "sac") {
      setSelectedTaxCode("sac");
    }
  };

  const rangeOfNumber: Item[] = useMemo(() => {
    return range(1, 365);
  }, []);

  const [intialAddProductFormData, setInitialAddProductFormData] =
    useState<Product>({
      count: 0,
      id: 0,
      companyId: 0,
      productTypeId: 0,
      productTypeName: "",
      defaultWarrantyIntervalTypeId: 0,
      defaultWarranty: 0,
      defaultWarrantyName: "",
      defaultAmcCycleIntervalTypeId: 0,
      defaultAmcCycle: 0,
      defaultAmcCycleName: "",
      unitId: 0,
      unitName: "",
      name: "",
      barcode: "",
      cost: 0,
      description: "",
      version: "",
      url: "",
      isActive: false,
      hsn: "",
      sac: "",
      taxRate: 0,
      cess: 0,
      validFrom: "",
      createdBy: "",
      createdOn: "",
      unitNameInStock: "",
      minimumStock: 0,
    });

  const [selectedUnitId, setUnitId] = useState<number | undefined>(0);

  const [isSerialNumberChecked, setIsSerialNumberChecked] =
    useState<boolean>(false);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<
    number | undefined
  >(0);

  const [selectedWarrantyIntervalTypeId, setWarrantyIntervalTypeId] = useState<
    number | undefined
  >(0);

  const [selectedDefaultWarranty, setDefaultWarranty] = useState<
    number | undefined
  >(0);

  const [selectedAmcIntervalTypeId, setAmcIntervalTypeId] = useState<
    number | undefined
  >(0);

  const [selectedDefaultAmc, setDefaultAmc] = useState<number | undefined>(0);

  const {
    handleChange: handleAddProductFormDataChange,
    formData: addProductFormData,
  } = useFormChange(intialAddProductFormData);

  const { errors, handleBlur, setErrors } = useFormValidation(
    addProductFormData,
    "registration",
  );

  const [selectedProductTypeIdError, setSelectedProductTypeIdError] =
    useState<boolean>(false);

  const [selectedUnitError, setSelectedUnitError] = useState<boolean>(false);

  const isProuctSelected =
    selectedProductTypeId === 3 || selectedProductTypeId === 4;

  useEffect(() => {
    if (selectedProductTypeId === 3 || selectedProductTypeId === 4) {
      setInitialAddProductFormData((prev) => ({
        ...prev,
      }));

      setIsSerialNumberChecked(false);
      setErrors((prev) => ({
        ...prev,
        mininumStock: "",
      }));
    }
  }, [selectedProductTypeId]);

  function handleCheckboxChangeOfSerialNumber(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setIsSerialNumberChecked(event.target.checked);
  }
  const validateDropdown = () => {
    if (selectedProductTypeId === 0 || selectedProductTypeId === undefined) {
      setSelectedProductTypeIdError(true);
      // toast.error("Please select 'Product Type'");
    } else {
      setSelectedProductTypeIdError(false);
    }

    if (selectedProductTypeId === 3 || selectedProductTypeId === 4) {
      setSelectedUnitError(false);
    } else if (selectedUnitId === 0 || selectedUnitId === undefined) {
      setSelectedUnitError(true);
      // toast.error("Please select 'AMC Cycle Duration'");
    } else {
      setSelectedUnitError(false);
    }
  };

  function validate() {
    // Validation the minimum stock field here also before the api call
    if (selectedProductTypeId === 3 || selectedProductTypeId === 4) {
      setErrors((prev) => ({
        ...prev,
        mininumStock: "",
      }));
    } else if (
      addProductFormData.minimumStock == 0 ||
      addProductFormData.minimumStock == null ||
      addProductFormData.minimumStock === undefined
    ) {
      setErrors((prev) => ({
        ...prev,
        mininumStock: "minimum stock is required.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        mininumStock: "",
      }));
    }
    return true;
  }

  const handleAddProductFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const isvalid = validate();
    if (!isvalid) return;
    validateDropdown();
    if (isSaving) return;
    if (userHasAccessToAddProduct) {
      if (addProductFormData.name !== "" || addProductFormData.version !== "") {
        if (
          (addProductFormData.hsn !== "" || addProductFormData.sac !== "") &&
          (addProductFormData.taxRate === 0 ||
            addProductFormData.validFrom === "")
        ) {
          toast.error("Please insert Tax Rate and Valid From");
          return;
        } else {
          let formattedDate: string = "";
          if (addProductFormData.validFrom) {
            const dateObj = new Date(addProductFormData.validFrom);
            const day = dateObj.getDate();
            const month = dateObj
              .toLocaleString("defalut", { month: "short" })
              .toLowerCase();
            const year = dateObj.getFullYear();
            formattedDate = `${day}-${month}-${year}`;
          }
          let taxRateDecimal: number = 0;
          if (addProductFormData.taxRate) {
            taxRateDecimal = parseFloat(addProductFormData.taxRate.toString());
          }

          let cessDecimal: number = 0;
          if (addProductFormData.cess) {
            cessDecimal = parseFloat(addProductFormData.cess.toString());
          }

          if (
            selectedProductTypeId !== 0 &&
            selectedProductTypeId !== undefined &&
            // selectedWarrantyIntervalTypeId !== 0 &&
            // selectedWarrantyIntervalTypeId !== undefined &&
            // selectedDefaultWarranty !== 0 &&
            // selectedDefaultWarranty !== undefined &&
            // selectedAmcIntervalTypeId !== 0 &&
            // selectedAmcIntervalTypeId !== undefined &&
            // selectedDefaultAmc !== 0 &&
            // selectedDefaultAmc !== undefined &&
            (isProuctSelected || selectedUnitId !== 0) &&
            // selectedUnitId !== 0 &&
            // selectedUnitId !== undefined &&
            addProductFormData.cost !== null &&
            (isProuctSelected || addProductFormData.minimumStock != 0)
          ) {
            setIsSaving(true);
            const addProductPostData = {
              company_id: loginStatus.companyId,
              product_type_id: selectedProductTypeId,
              default_warranty_interval_type_id: isProuctSelected
                ? null
                : selectedWarrantyIntervalTypeId,
              default_warranty: isProuctSelected
                ? null
                : selectedDefaultWarranty,
              default_amc_cycle_interval_type_id: isProuctSelected
                ? null
                : selectedAmcIntervalTypeId,
              default_amc_cycle: isProuctSelected ? null : selectedDefaultAmc,
              name: addProductFormData.name,
              unit_id: isProuctSelected ? 1 : selectedUnitId,
              barcode: addProductFormData.barcode,
              is_serial_number: isSerialNumberChecked,
              cost: addProductFormData.cost,
              description: addProductFormData.description,
              version: isProuctSelected ? "1.0" : addProductFormData.version,
              minimum_stock: isProuctSelected
                ? 1
                : Number(addProductFormData.minimumStock),
              url: addProductFormData.url,
              hsn: selectedTaxCode === "hsn" ? addProductFormData.hsn : null,
              sac: selectedTaxCode === "sac" ? addProductFormData.sac : null,
              tax_rate: taxRateDecimal,
              cess: cessDecimal || 0,
              valid_from_string: formattedDate,
              createdby_id: loginStatus.id,
            };

            // alert(JSON.stringify(addProductPostData, null, 2));

            await axios
              .post(POST_API.ADD_PRODUCT, addProductPostData, {
                withCredentials: true,
              })
              .then((response) => {
                if (response.data.status) {
                  toast.success(response.data.message);
                  handleProductChangeOnAdd();
                  setTimeout(() => {
                    onClose();
                  }, 100);
                } else {
                  toast.error(response.data.message);
                }
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .catch(async (error: ApiError | any) => {
                if (error.status === STATUS_CODE.UNATHORISED) {
                  const refreshTokenResponse = await RefreshToken({
                    callFunctionWithEvent: handleAddProductFormSubmit,
                  });
                  if (refreshTokenResponse) {
                    handleAddProductFormSubmit(event);
                  }
                } else {
                  toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG_TRY_AGAIN);
                }
              })
              .finally(() => {
                setIsSaving(false);
              });
          } else {
            toast.error(MESSAGE.ERROR.REQUIRED_FIELDS);
          }
        }
      } else {
        toast.error(MESSAGE.ERROR.REQUIRED_FIELDS);
      }
    } else {
      toast.error(MESSAGE.MODULE_ACCESS.PRODUCT_MANAGEMENT.DENIED_ADD_ACCESS);
    }
  };

  const clearCreateForm = () => {
    setSelectedProductTypeId(0);
    setWarrantyIntervalTypeId(0);
    setDefaultWarranty(0);
    setAmcIntervalTypeId(0);
    setUnitId(0);
    setDefaultAmc(0);
    setSelectedUnitError(false);
    setSelectedProductTypeIdError(false);
    setInitialAddProductFormData({
      count: 0,
      id: 0,
      companyId: 0,
      productTypeId: 0,
      productTypeName: "",
      defaultWarrantyIntervalTypeId: 0,
      defaultWarranty: 0,
      defaultWarrantyName: "",
      defaultAmcCycleIntervalTypeId: 0,
      defaultAmcCycle: 0,
      defaultAmcCycleName: "",
      name: "",
      barcode: "",
      cost: 0,
      description: "",
      version: "",
      unitId: 0,
      unitName: "",
      url: "",
      isActive: false,
      hsn: "",
      sac: "",
      taxRate: 0,
      cess: 0,
      validFrom: "",
      createdBy: "",
      createdOn: "",
      unitNameInStock: "",
      minimumStock: 0,
    });

    addProductFormData.description = "";
  };
  useEffect(() => {
    // if (!isOpen) {
    clearCreateForm();
    setErrors({
      barcode: "",
      name: "",
      version: "",
    });
    // }
  }, [isOpen]);

  const filteredUnits = useMemo(() => {
    return isSerialNumberChecked
      ? unitData.filter((unit) => unit.isBaseUnit)
      : unitData;
  }, [unitData, isSerialNumberChecked]);

  useEffect(() => {
    if (
      isSerialNumberChecked &&
      selectedUnitId &&
      !unitData.find((unit) => unit.id === selectedUnitId && unit.isBaseUnit)
    ) {
      setUnitId(undefined);
    }
  }, [isSerialNumberChecked, selectedUnitId, unitData]);

  // const [unitDataFiltered , setUnitDataFiltered ] = useState<UnitType[]>([]);

  // useEffect(()=> {
  //   setUnitDataFiltered(unitData)
  // }, [unitData])

  // useEffect(()=>{

  //   if(addProductFormData.isSerialNumber){
  //     const filteredParentUnits= unitData.filter((item)=> item.isBaseUnit);
  //     console.log("this is the filter");

  //     setUnitDataFiltered(filteredParentUnits);
  //   }
  // } , [addProductFormData.isSerialNumber])
  if (!isOpen) return null;

  if (unitDataLoading || intervalTypeLoading || productTypeLoading) {
    return (
      <FormLayout>
        <FormSkeleton />
      </FormLayout>
    );
  }

  return (
    <FormLayout padding={3} width={6}>
      <LoadingPopUpAnimation show={isSaving} />
      <div className="">
        <FormHeader
          icon={Store}
          onClose={() => {
            clearCreateForm();
            onClose();
          }}
          preText="Add New Product"
          description="Enter the necessary details to add a new product."
        />

        <form className="space-y-2 p-1" onSubmit={handleAddProductFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* product name */}
            <FormInput
              label="Product Name :"
              logo={LucidePresentation}
              maxLength={40}
              type="text"
              name="name"
              placeholder="Product Name"
              required={true}
              value={addProductFormData.name}
              onChange={handleAddProductFormDataChange}
              onBlur={handleBlur}
              error={errors.name}
              autoFocus={true}
            />
            <div className="grid grid-cols-2 gap-3 ">
              {/* product type */}
              <div className="">
                <CustomDropdown
                  labelName="Product Type :"
                  logo={LucideGroup}
                  preselectedOption={0}
                  onSelect={(e) => {
                    if (e) {
                      setSelectedProductTypeIdError(false);
                    }
                    setSelectedProductTypeId(e);
                  }}
                  options={productTypeData}
                  requiredRedDot={true}
                />
                {selectedProductTypeIdError && (
                  <div className="caption-custom-inactive">
                    Product Type is required
                  </div>
                )}
              </div>
              {/* Unit */}
              <div>
                <CustomDropdown
                  labelName="Unit :"
                  logo={LucideTimer}
                  preselectedOption={0}
                  key={selectedProductTypeId}
                  onSelect={(data) => {
                    if (data) {
                      setSelectedUnitError(false);
                    }
                    setUnitId(data);
                  }}
                  // options={unitData}
                  options={filteredUnits}
                  requiredRedDot={true}
                  readOnly={
                    selectedProductTypeId === 3 || selectedProductTypeId === 4
                  }
                />
                {selectedUnitError && (
                  <div className="caption-custom-inactive">
                    Product Unit is required
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 ">
              {/* basic cost */}
              <FormInput
                label="Basic Cost : "
                logo={LucideIndianRupee}
                type="number"
                name="cost"
                value={addProductFormData.cost}
                // value={addProductFormData.cost ==0 ? "" : addProductFormData.cost}
                placeholder="Product Price"
                onChange={handleAddProductFormDataChange}
                error={errors.cost}
                min={0}
                step={'0.0001'} />
              {/* Minimum Stock */}
              <FormInput
                label="Minimum Stock : "
                logo={ListOrdered}
                type="number"
                name="minimumStock"
                value={addProductFormData.minimumStock}
                // value={addProductFormData.minimumStock ==0 ? "" : addProductFormData.minimumStock}
                placeholder="Enter Mininum Stock"
                onChange={handleAddProductFormDataChange}
                error={errors.mininumStock}
                min={0}
                onBlur={handleBlur}
                required={true}
                disabled={
                  selectedProductTypeId === 3 || selectedProductTypeId === 4
                }
              />

              {/* version */}
              <FormInput
                label="Version :"
                logo={LucideVerified}
                type="text"
                name="version"
                max={20}
                required={true}
                value={addProductFormData.version}
                placeholder="Product Version"
                onChange={handleAddProductFormDataChange}
                onBlur={handleBlur}
                error={errors.version}
                disabled={
                  selectedProductTypeId === 3 || selectedProductTypeId === 4
                }
              />
            </div>
            {/* barcode */}
            <div className="grid grid-cols-2 gap-6">
              <FormInput
                label="Barcode :"
                logo={LucideAirplay}
                type="text"
                name="barcode"
                value={addProductFormData.barcode}
                placeholder="Product Bar Code"
                onChange={handleAddProductFormDataChange}
                onBlur={handleBlur}
              />

              <div className="mt-6">
                <FormCheckbox
                  label="Has Serial Number"
                  name="is_serial_number"
                  onChange={handleCheckboxChangeOfSerialNumber}
                  checked={isSerialNumberChecked}
                  disabled={
                    selectedProductTypeId === 3 || selectedProductTypeId === 4
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* warranty duration */}
              <div>
                <CustomDropdown
                  labelName="Warranty Duration :"
                  logo={LucideClock}
                  preselectedOption={0}
                  onSelect={(e) => {
                    setDefaultWarranty(e);
                  }}
                  options={rangeOfNumber}
                  // requiredRedDot={true}
                  readOnly={
                    selectedProductTypeId === 3 || selectedProductTypeId === 4
                  }
                />
                {/* {selectedDefaultWarrantyError && (
                    <div className="caption-custom-inactive">
                      Warranty Duration is required
                    </div>
                  )} */}
              </div>
              {/* warranty time unit */}
              <div>
                <CustomDropdown
                  labelName="Warranty Time Unit :"
                  logo={LucideTimer}
                  preselectedOption={0}
                  onSelect={(e) => {
                    setWarrantyIntervalTypeId(e);
                  }}
                  options={intervalTypeData}
                  // requiredRedDot={true}
                  readOnly={
                    selectedProductTypeId === 3 || selectedProductTypeId === 4
                  }
                />
                {/* {selectedWarrantyIntervalTypeIdError && (
                    <div className="caption-custom-inactive">
                      Warranty Time Unit is required
                    </div>
                  )} */}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* amc cycle duration */}
              <div>
                <CustomDropdown
                  labelName="AMC Cycle Duration :"
                  logo={LucideClock}
                  preselectedOption={selectedDefaultAmc}
                  onSelect={(e) => {
                    setDefaultAmc(e);
                  }}
                  options={rangeOfNumber}
                  // requiredRedDot={true}
                  readOnly={
                    selectedProductTypeId === 3 || selectedProductTypeId === 4
                  }
                />
                {/* {selectedDefaultAmcError && (
                    <div className="caption-custom-inactive">
                      AMC Cycle Duration is required
                    </div>
                  )} */}
              </div>

              {/* amc time unit */}
              <div>
                <CustomDropdown
                  labelName="AMC Time Unit :"
                  logo={LucideTimer}
                  preselectedOption={0}
                  onSelect={(e) => {
                    setAmcIntervalTypeId(e);
                  }}
                  options={intervalTypeData}
                  // requiredRedDot={true}
                  readOnly={
                    selectedProductTypeId === 3 || selectedProductTypeId === 4
                  }
                />
                {/* {selectedAmcIntervalTypeIdError && (
                    <div className="caption-custom-inactive">
                      AMC Time Unit is required
                    </div>
                  )} */}
              </div>
            </div>

            {/* </div> */}
            <div className="flex items-center justify-between">
              <div className="flex items-center  h-full">
                <RadioButtons
                  options={ProductsRadioButtonOptions}
                  onChange={handleTaxRadioButtonChange}
                />
              </div>
              <div className="w-full">
                {selectedTaxCode === "hsn" && (
                  <FormInput
                    label="HSN : "
                    logo={LucideVerified}
                    type="text"
                    name="hsn"
                    value={addProductFormData.hsn}
                    placeholder="Enter HSN Code"
                    onChange={handleAddProductFormDataChange}
                  />
                )}

                {selectedTaxCode === "sac" && (
                  <FormInput
                    logo={LucideVerified}
                    label="SAC : "
                    type="text"
                    name="sac"
                    value={addProductFormData.sac}
                    placeholder="Enter SAC Code"
                    onChange={handleAddProductFormDataChange}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 ">
              {/* tax rate */}
              <FormInput
                label="Tax Rate"
                logo={LucidePercent}
                type="text"
                name="taxRate"
                value={addProductFormData.taxRate?.toString()}
                placeholder="Enter Tax Rate"
                onChange={handleAddProductFormDataChange}
                onBlur={handleBlur}
                error={errors.taxRate}
              />

              <FormInput
                label="Cess"
                logo={LucidePercent}
                type="text"
                name="cess"
                value={addProductFormData.cess?.toString()}
                placeholder="Enter Cess"
                onChange={handleAddProductFormDataChange}
                onBlur={handleBlur}
                error={errors.cess}
              />
              {/* valid from */}
              <DatePickerInput
                label="Valid From :"
                logo={LucideCalendar}
                name="validFrom"
                value={addProductFormData.validFrom}
                placeholder="Select Date"
                onChange={handleAddProductFormDataChange}
                onBlur={handleBlur}
                error={errors.validFrom}
              />
            </div>

            {/* url */}
            <FormInput
              label="URL :"
              logo={LucideLink}
              type="text"
              name="url"
              required={false}
              value={addProductFormData.url}
              placeholder="Product URL"
              onChange={handleAddProductFormDataChange}
              onBlur={handleBlur}
              error={errors.url}
            />
            {/* description */}
            <div className="col-span-1 md:col-span-2 ">
              <TextAreaInput
                label="Description :"
                logo={Text}
                name="description"
                placeholder="Product Description"
                value={addProductFormData.description}
                cols={5}
                rows={3}
                required={false}
                // maxLength={256}
                maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
                onChange={handleAddProductFormDataChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
          {
            <div
              className={`flex justify-self-end col-span-2 ${GAP.POPUP_GAP_BETWEEN_BUTTONS}`}
            >
              <Button
                type="button"
                onClick={() => {
                  clearCreateForm();
                  onClose();
                }}
              >
                <div className="flex items-center justify-center gap-0.5">
                  <X size={16} />
                  Cancel
                </div>
              </Button>
              <Button type="submit">
                <div className="flex items-center justify-center gap-1">
                  <Save size={16} />
                  Save
                </div>
              </Button>
            </div>
          }
        </form>
      </div>
    </FormLayout>

    //     </div>

    //   </div>
    // </div>,
    // document.body
  );
}

export default AddProductModal;
