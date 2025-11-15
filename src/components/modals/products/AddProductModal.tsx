/* eslint-disable react-hooks/exhaustive-deps */
import {
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
import { GAP,  STATUS_CODE } from "../../../constants/AppConstants";
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
  // const { isSmallScreen } = useScreenSize();
  const { loginStatus } = useLoggedInUserContext();
  const [isSaving , setIsSaving] = useState<boolean>(false);

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
    event: React.ChangeEvent<HTMLInputElement>
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
      unitId : 0,
      unitName : "",
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
      validFrom: "",
      createdBy: "",
      createdOn: "",
      unitNameInStock : ""
    });

  const [selectedUnitId, setUnitId] = useState<number | undefined>(0);

  const [isSerialNumberChecked , setIsSerialNumberChecked ] = useState<boolean >(false)
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
    "registration"
  );

  const [selectedProductTypeIdError, setSelectedProductTypeIdError] =
    useState<boolean>(false);

  const [
    selectedWarrantyIntervalTypeIdError,
    setSelectedWarrantyIntervalTypeIdError,
  ] = useState<boolean>(false);

  const [selectedDefaultWarrantyError, setSelectedDefaultWarrantyError] =
    useState<boolean>(false);

  const [selectedAmcIntervalTypeIdError, setSelectedAmcIntervalTypeIdError] =
    useState<boolean>(false);
  const [selectedDefaultAmcError, setSelectedDefaultAmcError] =
    useState<boolean>(false);
  const [selectedUnitError, setSelectedUnitError] = useState<boolean>(false);


  function handleCheckboxChangeOfSerialNumber(event : React.ChangeEvent<HTMLInputElement>){
    setIsSerialNumberChecked(event.target.checked)
  }
  const validateDropdown = () => {
    if (selectedProductTypeId === 0 || selectedProductTypeId === undefined) {
      setSelectedProductTypeIdError(true);
      // toast.error("Please select 'Product Type'");
    } else {
      setSelectedProductTypeIdError(false);
    }

    if (
      selectedWarrantyIntervalTypeId === 0 ||
      selectedWarrantyIntervalTypeId === undefined
    ) {
      setSelectedWarrantyIntervalTypeIdError(true);
      // toast.error("Please select 'Warranty Time Unit'");
    } else {
      setSelectedWarrantyIntervalTypeIdError(false);
    }

    if (
      selectedDefaultWarranty === 0 ||
      selectedDefaultWarranty === undefined
    ) {
      setSelectedDefaultWarrantyError(true);
      // toast.error("Please select 'Warranty Duration'");
    } else {
      setSelectedDefaultWarrantyError(false);
    }
    if (
      selectedAmcIntervalTypeId === 0 ||
      selectedAmcIntervalTypeId === undefined
    ) {
      setSelectedAmcIntervalTypeIdError(true);
      // toast.error("Please select 'AMC Time Unit'");
    } else {
      setSelectedAmcIntervalTypeIdError(false);
    }
    if (selectedDefaultAmc === 0 || selectedDefaultAmc === undefined) {
      setSelectedDefaultAmcError(true);
      // toast.error("Please select 'AMC Cycle Duration'");
    } else {
      setSelectedDefaultAmcError(false);
    }

     if (selectedUnitId === 0 || selectedUnitId === undefined) {
      setSelectedUnitError(true);
      // toast.error("Please select 'AMC Cycle Duration'");
    } else {
      setSelectedUnitError(false);
    }
  };

  const handleAddProductFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    validateDropdown();
    if(isSaving) return;
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
          if (
            selectedProductTypeId !== 0 &&
            selectedProductTypeId !== undefined &&
            selectedWarrantyIntervalTypeId !== 0 &&
            selectedWarrantyIntervalTypeId !== undefined &&
            selectedDefaultWarranty !== 0 &&
            selectedDefaultWarranty !== undefined &&
            selectedAmcIntervalTypeId !== 0 &&
            selectedAmcIntervalTypeId !== undefined &&
            selectedDefaultAmc !== 0 &&
            selectedDefaultAmc !== undefined &&
             selectedUnitId !== 0 &&
            selectedUnitId !== undefined &&
            addProductFormData.cost !== null
          ) {

            setIsSaving(true)
            const addProductPostData = {
              company_id: loginStatus.companyId,
              product_type_id: selectedProductTypeId,
              default_warranty_interval_type_id: selectedWarrantyIntervalTypeId,
              default_warranty: selectedDefaultWarranty,
              default_amc_cycle_interval_type_id: selectedAmcIntervalTypeId,
              default_amc_cycle: selectedDefaultAmc,
              name: addProductFormData.name,
              unit_id : selectedUnitId,
              barcode: addProductFormData.barcode,
              is_serial_number : isSerialNumberChecked,
              cost: addProductFormData.cost,
              description: addProductFormData.description,
              version: addProductFormData.version,
              url: addProductFormData.url,
              hsn: selectedTaxCode === "hsn" ? addProductFormData.hsn : null,
              sac: selectedTaxCode === "sac" ? addProductFormData.sac : null,
              tax_rate: taxRateDecimal,
              valid_from_string: formattedDate,
              createdby_id: loginStatus.id,
            };

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
                }else{
                  toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG_TRY_AGAIN)
                }
              })
              .finally(()=>{
                setIsSaving(false)
              });
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
    setSelectedDefaultAmcError(false);
    setSelectedUnitError(false);
    setSelectedAmcIntervalTypeIdError(false);
    setSelectedDefaultWarrantyError(false);
    setSelectedWarrantyIntervalTypeIdError(false);
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
      unitId : 0,
      unitName : "",
      url: "",
      isActive: false,
      hsn: "",
      sac: "",
      taxRate: 0,
      validFrom: "",
      createdBy: "",
      createdOn: "",
      unitNameInStock : ""
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

  if (!isOpen) return null;

  if (unitDataLoading || intervalTypeLoading || productTypeLoading) {
    return (
      <FormLayout>
        <FormSkeleton />
      </FormLayout>
    );
  }
  return (
  <FormLayout>
          <LoadingPopUpAnimation show={isSaving}/>
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

            <form
              className=" grid grid-cols-2 space-y-3  gap-x-3 "
              onSubmit={handleAddProductFormSubmit}
            >
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
                    onSelect={(data) => {
                      if (data) {
                        setSelectedUnitError(false);
                      }
                      setUnitId(data);
                    }}
                    options={unitData}
                    requiredRedDot={true}
                  />
                  {selectedUnitError && (
                    <div className="caption-custom-inactive">
                      Product Unit is required
                    </div>
                  )}
                </div>
              </div>

              {/* basic cost */}
              <FormInput
                label="Basic Cost : "
                logo={LucideIndianRupee}
                type="number"
                name="cost"
                value={addProductFormData.cost?.toString()}
                placeholder="Product Price"
                onChange={handleAddProductFormDataChange}
                error={errors.cost}
              />
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
                
               <div className="mt-10">
                <FormCheckbox
                label="Has Serial number"
                name="is_serial_number"
                onChange={handleCheckboxChangeOfSerialNumber}
                checked={isSerialNumberChecked}
               />
               </div>
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
              />

              <div className="grid grid-cols-2 gap-3">
                {/* warranty duration */}
                <div>
                  <CustomDropdown
                    labelName="Warranty Duration :"
                    logo={LucideClock}
                    preselectedOption={0}
                    onSelect={(e) => {
                      if (e) {
                        setSelectedDefaultWarrantyError(false);
                      }
                      setDefaultWarranty(e);
                    }}
                    options={rangeOfNumber}
                    requiredRedDot={true}
                  />
                  {selectedDefaultWarrantyError && (
                    <div className="caption-custom-inactive">
                      Warranty Duration is required
                    </div>
                  )}
                </div>
                {/* warranty time unit */}
                <div>
                  <CustomDropdown
                    labelName="Warranty Time Unit :"
                    logo={LucideTimer}
                    preselectedOption={0}
                    onSelect={(e) => {
                      if (e) {
                        setSelectedWarrantyIntervalTypeIdError(false);
                      }
                      setWarrantyIntervalTypeId(e);
                    }}
                    options={intervalTypeData}
                    requiredRedDot={true}
                  />
                  {selectedWarrantyIntervalTypeIdError && (
                    <div className="caption-custom-inactive">
                      Warranty Time Unit is required
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* amc cycle duration */}
                <div>
                  <CustomDropdown
                    labelName="AMC Cycle Duration :"
                    logo={LucideClock}
                    preselectedOption={0}
                    onSelect={(e) => {
                      if (e) {
                        setSelectedDefaultAmcError(false);
                      }
                      setDefaultAmc(e);
                    }}
                    options={rangeOfNumber}
                    requiredRedDot={true}
                  />
                  {selectedDefaultAmcError && (
                    <div className="caption-custom-inactive">
                      AMC Cycle Duration is required
                    </div>
                  )}
                </div>

                {/* amc time unit */}
                <div>
                  <CustomDropdown
                    labelName="AMC Time Unit :"
                    logo={LucideTimer}
                    preselectedOption={0}
                    onSelect={(e) => {
                      if (e) {
                        setSelectedAmcIntervalTypeIdError(false);
                      }
                      setAmcIntervalTypeId(e);
                    }}
                    options={intervalTypeData}
                    requiredRedDot={true}
                  />
                  {selectedAmcIntervalTypeIdError && (
                    <div className="caption-custom-inactive">
                      AMC Time Unit is required
                    </div>
                  )}
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
              <div className="grid grid-cols-2 gap-3 ">
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
             

              {/* description */}
              <div className="col-span-2">
                <TextAreaInput
                  label="Description :"
                  logo={Text}
                  name="description"
                  placeholder="Product Description"
                  value={addProductFormData.description}
                  cols={5}
                  rows={3}
                  required={false}
                  maxLength={256}
                  onChange={handleAddProductFormDataChange}
                  onBlur={handleBlur}
                />
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
