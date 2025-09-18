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
  Store,
  Text,
  X,
} from "lucide-react";
import { SIZE, STATUS_CODE, TAX_CODE } from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import TextAreaInput from "../../ui/TextAreaInput";
import RadioButtons from "../../ui/RadioButton";
import { ProductsRadioButtonOptions } from "../../../constants/TestData";
import React, { useEffect, useState } from "react";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { Product } from "../../../@types/products/ProductsManagementProps";
// import MessageSnackBar from "../../ui/MessageSnackbar";
// import {
//   MessageSnackbarState,
//   ShowMessageSnackbarProps,
// } from "../../../@types/ui/MessageSnackbarProps";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import RefreshToken from "../../../config/validations/RefreshToken";
import DatePickerInput from "../../ui/DatePickerInput";
import AddProductModalProps from "../../../@types/modal/AddProductModalProps";
import MESSAGE from "../../../constants/Messages";
import ApiError from "../../../@types/error/ApiError";
import useScreenSize from "../../../config/hooks/useScreenSize";
import toast from "react-hot-toast";
import CustomDropdown from "../leads/CustomDropdown";
import { useIntervalType } from "../../../config/hooks/useIntervalType";
import { useProductType } from "../../../config/hooks/useProductTypes";
import { Item, range } from "../../../constants/NumberList";

function AddProductModal({
  isOpen,
  onClose,
  handleProductChangeOnAdd,
}: AddProductModalProps) {
  const [selectedTaxCode, setSelectedTaxCode] = useState<string>("");
  // const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
  //   open: false,
  //   message: "",
  //   type: "success",
  // });

  const { isSmallScreen } = useScreenSize();
  function handleTaxRadioButtonChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSelectedTaxCode(event.target.value);
  }

  // const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
  //   setMessageSnackbar({ open: true, message, type });
  // };

  // const handleMessageSnackbarClose = () => {
  //   setMessageSnackbar((prev) => ({ ...prev, open: false }));
  // };

  const { intervalTypeData } = useIntervalType();
  const { productTypeData } = useProductType();
  const rangeOfNumber: Item[] = range(1, 365);

  const [intialAddProductFormData, setInitialAddProductFormData] =
    useState<Product>({
      count: 0,
      id: 0,
      companyId: 0,
      productTypeId: 0,
      defaultWarrantyIntervalTypeId: 0,
      defaultWarranty: 0,
      defaultWarrantyName: "",
      defaultAmcCycleIntervalTypeId: 0,
      defaultAmcCycle: 0,
      defaultAmcCycleName: "",
      name: "",
      code: "",
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
    });

  const { userHasAccessToAddProduct } = useUserAccessModules();

  const [selectedProductTypeId, setSelectedProductTypeId] = useState<number>(0);

  const [selectedWarrantyIntervalTypeId, setWarrantyIntervalTypeId] =
    useState<number>(0);

  const [selectedDefaultWarranty, setDefaultWarranty] = useState<number>(0);

  const [selectedAmcIntervalTypeId, setAmcIntervalTypeId] = useState<number>(0);

  const [selectedDefaultAmc, setDefaultAmc] = useState<number>(0);

  const { loginStatus } = useLoggedInUserContext();

  const {
    handleChange: handleAddProductFormDataChange,
    formData: addProductFormData,
  } = useFormChange(intialAddProductFormData);

  const { errors, handleBlur } = useFormValidation(
    addProductFormData,
    "registration"
  );

  // useEffect(() => {
  //   handleMessageSnackbarClose();
  // }, []);

  const handleAddProductFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (addProductFormData.name !== "" || addProductFormData.code !== "") {
      if (
        (addProductFormData.hsn !== "" || addProductFormData.sac !== "") &&
        (addProductFormData.taxRate === 0 ||
          addProductFormData.validFrom === "")
      ) {
        // showMessageSnackbar({
        //   message: "Please insert Tax Rate and Valid From",
        //   type: "error",
        // });
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
        const addProductPostData = {
          company_id: loginStatus.companyId,
          product_type_id:
            selectedProductTypeId ?? addProductFormData.productTypeId,
          default_warranty_interval_type_id: selectedWarrantyIntervalTypeId,
          default_warranty: selectedDefaultWarranty,
          default_amc_cycle_interval_type_id: selectedAmcIntervalTypeId,
          default_amc_cycle: selectedDefaultAmc,
          name: addProductFormData.name,
          code: addProductFormData.code,
          cost: addProductFormData.cost,
          description: addProductFormData.description,
          version: addProductFormData.version,
          url: addProductFormData.url,
          hsn: addProductFormData.hsn,
          sac: addProductFormData.sac,
          tax_rate: taxRateDecimal,
          valid_from_string: formattedDate,
          createdby_id: loginStatus.id,
        };
        console.log(addProductPostData);
        await axios
          .post(POST_API.ADD_PRODUCT, addProductPostData, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.data.status) {
              // showMessageSnackbar({
              //   message: "Product Added Successfully",
              //   type: "success",
              // });
              toast.success(response.data.message);
              handleProductChangeOnAdd(addProductFormData);
              setTimeout(() => {
                onClose();
              }, 500);
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
            }
          });
      }
    }
  };
  useEffect(() => {
    if (!isOpen) {
      setInitialAddProductFormData({
        count: 0,
        id: 0,
        companyId: 0,
        productTypeId: 0,
        defaultWarrantyIntervalTypeId: 0,
        defaultWarranty: 0,
        defaultWarrantyName: "",
        defaultAmcCycleIntervalTypeId: 0,
        defaultAmcCycle: 0,
        defaultAmcCycleName: "",
        name: "",
        code: "",
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
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={
        isSmallScreen
          ? "fixed inset-0 z-50 pt-10   pr-2 overflow-hidden bg-black bg-opacity-45"
          : "fixed inset-0 z-50 p-10 overflow-hidden bg-black bg-opacity-45"
      }
    >
      <div className="flex min-h-screen mb-5 items-center justify-center">
        <div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3 border-b">
              <Store className="text-blue-500" size={SIZE.TWENTY} />
              <h2 className="text-lg font-semibold text-gray-800">
                Add New Product
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div>

            <form
              className=" grid grid-cols-2  gap-3 "
              onSubmit={handleAddProductFormSubmit}
            >
              <div className="grid col-span-1 ">
                <FormInput
                  label="Product Name : "
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
                <FormInput
                  label="Version :"
                  logo={LucideVerified}
                  type="text"
                  name="version"
                  max={20}
                  required={false}
                  value={addProductFormData.version}
                  placeholder="Product Version"
                  onChange={handleAddProductFormDataChange}
                  onBlur={handleBlur}
                />

                <TextAreaInput
                  label="Description : "
                  logo={Text}
                  name="description"
                  placeholder="Product Description"
                  value={addProductFormData.description}
                  cols={5}
                  rows={2}
                  required={false}
                  maxLength={256}
                  onChange={handleAddProductFormDataChange}
                  onBlur={handleBlur}
                  // error={errors.description}
                />
              </div>
              <div className="grid col-span-1 gap-1">
                <div className="grid col-span-1 gap-1">
                  <FormInput
                    label="Basic Cost : "
                    logo={LucideIndianRupee}
                    type="number"
                    name="cost"
                    value={addProductFormData.cost?.toString()}
                    placeholder="Product Price"
                    onChange={handleAddProductFormDataChange}
                  />
                  <FormInput
                    label="Item Code : "
                    logo={LucideAirplay}
                    type="text"
                    name="code"
                    required={true}
                    value={addProductFormData.code}
                    placeholder="Product Item Code"
                    onChange={handleAddProductFormDataChange}
                    onBlur={handleBlur}
                    error={errors.code}
                  />
                  <CustomDropdown
                    labelName="Product Type :"
                    logo={LucideGroup}
                    preselectedOption={0}
                    onSelect={(e) => {
                      if (e) {
                        setSelectedProductTypeId(e);
                      }
                    }}
                    options={productTypeData}
                    requiredRedDot={true}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <CustomDropdown
                    labelName="Warranty Duration"
                    logo={LucideClock}
                    preselectedOption={0}
                    onSelect={(e) => {
                      if (e) {
                        setDefaultWarranty(e);
                      }
                    }}
                    options={rangeOfNumber}
                    requiredRedDot={true}
                  />
                  <CustomDropdown
                    labelName="Warranty Time Unit"
                    logo={LucideTimer}
                    preselectedOption={0}
                    onSelect={(e) => {
                      if (e) {
                        setWarrantyIntervalTypeId(e);
                      }
                    }}
                    options={intervalTypeData}
                    requiredRedDot={true}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <CustomDropdown
                    labelName="AMC Cycle Duration"
                    logo={LucideClock}
                    preselectedOption={0}
                    onSelect={(e) => {
                      if (e) {
                        setDefaultAmc(e);
                      }
                    }}
                    options={rangeOfNumber}
                    requiredRedDot={true}
                  />
                  <CustomDropdown
                    labelName="AMC Time Unit"
                    logo={LucideTimer}
                    preselectedOption={0}
                    onSelect={(e) => {
                      if (e) {
                        setAmcIntervalTypeId(e);
                      }
                    }}
                    options={intervalTypeData}
                    requiredRedDot={true}
                  />
                </div>
              </div>

              <div className="flex col-span-2 justify-center">
                <RadioButtons
                  options={ProductsRadioButtonOptions}
                  onChange={handleTaxRadioButtonChange}
                />
              </div>

              {(selectedTaxCode === TAX_CODE.HSN || selectedTaxCode === "") && (
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

              {selectedTaxCode === TAX_CODE.SAC && (
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

              {userHasAccessToAddProduct ? (
                <div className="flex justify-self-end col-span-2 gap-2">
                  <Button onClick={onClose}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              ) : (
                <div className="flex justify-self-center col-span-2  gap-2 pt-4">
                  <Button onClick={onClose}>Cancel</Button>

                  <Button
                    type="submit"
                    onClick={() => {
                      // showMessageSnackbar({
                      //   message: MESSAGE.ERROR.NOT_ATHORISED,
                      //   type: "error",
                      // });
                      toast.error(MESSAGE.ERROR.NOT_ATHORISED);
                    }}
                    disabled
                  >
                    Save
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
        {/* <MessageSnackBar
          isOpen={messageSnackbar.open}
          message={messageSnackbar.message}
          type={messageSnackbar.type}
          onClose={handleMessageSnackbarClose}
          duration={NUMBER_VALUES.SNACKBAR_DURATION}
        /> */}
      </div>
    </div>
  );
}

export default AddProductModal;
