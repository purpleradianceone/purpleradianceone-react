import { Store, X } from "lucide-react";
import {
  NUMBER_VALUES,
  SIZE,
  STATUS_CODE,
  TAX_CODE,
} from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import TextAreaInput from "../../ui/TextAreaInput";
import RadioButtons from "../../ui/RadioButton";
import { ProductsRadioButtonOptions } from "../../../constants/TestData";
import React, { useEffect, useState } from "react";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { Product } from "../../../@types/products/ProductsManagementProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
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

function AddProductModal({
  isOpen,
  onClose,
  handleProductChangeOnAdd,
} : AddProductModalProps) {
  const [selectedTaxCode, setSelectedTaxCode] = useState<string>("");
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success",
  });

  const {isSmallScreen} = useScreenSize()
  function handleTaxRadioButtonChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSelectedTaxCode(event.target.value);
  }

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  const [intialAddProductFormData,setInitialAddProductFormData] =  useState<Product>({
    name: "",
    code: "",
    description: "",
    cost: 0,
    hsn: "",
    sac: "",
    validFrom: "",
  });

  const { userHasAccessToAddProduct } = useUserAccessModules();
  

  const { loginStatus } = useLoggedInUserContext();

  const {
    handleChange: handleAddProductFormDataChange,
    formData: addProductFormData,
  } = useFormChange(intialAddProductFormData);

  const { errors, handleBlur } = useFormValidation(
    addProductFormData,
    "registration"
  );

  useEffect(() => {
    handleMessageSnackbarClose();
  }, []);


  const handleAddProductFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (
      addProductFormData.name !== "" ||
      addProductFormData.code !== "" ||
      addProductFormData.description !== ""
    ) {
      if (
        (addProductFormData.hsn !== "" ||
          addProductFormData.sac !== "") &&
        (addProductFormData.taxRate === 0 ||
          addProductFormData.validFrom === "")
      ) {
        showMessageSnackbar({
          message: "Please insert Tax Rate and Valid From",
          type: "error",
        });
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
          name: addProductFormData.name,
          code: addProductFormData.code,
          description: addProductFormData.description,
          cost: addProductFormData.cost,
          hsn: addProductFormData.hsn,
          sac: addProductFormData.sac,
          tax_rate: taxRateDecimal,
          valid_from: formattedDate,
          createdby: loginStatus.id,
        };
        await axios
          .post(POST_API.ADD_PRODUCT, addProductPostData, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.data) {
              showMessageSnackbar({
                message: "Product Added Successfully",
                type: "success",
              });

              handleProductChangeOnAdd(addProductFormData);
              setTimeout(() => {
                onClose();
              }, NUMBER_VALUES.SNACKBAR_DURATION);
            }
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch(async (error : ApiError | any) => {
            if (error.status === STATUS_CODE.UNATHORISED) {
              const refreshTokenResponse = await RefreshToken({
                callFunctionWithEvent: handleAddProductFormSubmit,
              });
              if(refreshTokenResponse){
                handleAddProductFormSubmit(event);
              }
            }
           
          });
      }
    }
  };
  useEffect(()=>{
    if(!isOpen){
      setInitialAddProductFormData({
        name: "",
        code: "",
        description: "",
        cost: 0,
        hsn: "",
        sac: "",
        validFrom: "",
      })
    }
  },[isOpen])

  if (!isOpen) return null;

  return (
    <div className={isSmallScreen ?"fixed inset-0 z-50 pt-10 pl-20 pr-2 overflow-hidden bg-black bg-opacity-45" : "fixed inset-0 z-50 p-10 overflow-hidden bg-black bg-opacity-45" }>
      <div className="flex min-h-screen mb-5 items-center justify-center">
        <div
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
        >
          <div className="py-3 px-9">
            <div className="flex items-center gap-3 mb-6">
              <Store className="text-blue-500" size={SIZE.TWENTY_FOUR} />
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Product
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X size={SIZE.TWENTY} />
              </button>
            </div>

            <form className="space-y-1 " onSubmit={handleAddProductFormSubmit}>
              <FormInput
                label="Product Name : "
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
                label="Item Code : "
                type="text"
                name="code"
                required={true}
                value={addProductFormData.code}
                placeholder="Product Item Code"
                onChange={handleAddProductFormDataChange}
                onBlur={handleBlur}
                error={errors.code}
              />
              <FormInput
                label="Basic Cost : "
                type="number"
                name="cost"
                value={addProductFormData.cost?.toString()}
                placeholder="Product Price"
                onChange={handleAddProductFormDataChange}
              />
              <TextAreaInput
                label="Description : "
                name="description"
                placeholder="Product Description"
                value={addProductFormData.description}
                cols={5}
                rows={3}
                required={true}
                maxLength={256}
                onChange={handleAddProductFormDataChange}
                onBlur={handleBlur}
                error={errors.description}
              />

              <RadioButtons
                options={ProductsRadioButtonOptions}
                onChange={handleTaxRadioButtonChange}
              />

              {(selectedTaxCode === TAX_CODE.HSN ||
                selectedTaxCode === "") && (
                <FormInput
                  label="HSN : "
                  type="text"
                  name="hsn"
                  value={addProductFormData.hsn}
                  placeholder="Enter HSN Code"
                  onChange={handleAddProductFormDataChange}
                />
              )}

              {selectedTaxCode === TAX_CODE.SAC && (
                <FormInput
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
                name="validFrom"
                value={addProductFormData.validFrom}
                placeholder="Select Date"
                onChange={handleAddProductFormDataChange}
                onBlur={handleBlur}
                error={errors.validFrom}
              />

              {userHasAccessToAddProduct ? (
                <div className="flex justify-self-center max-w-60 m-3 pb-5">
                  <Button type="submit">Add Product</Button>
                </div>
              ) : (
                <div className="flex justify-self-end max-w-36 m-3">
                  <Button
                    type="submit"
                    onClick={() => {
                      showMessageSnackbar({
                        message: MESSAGE.ERROR.NOT_ATHORISED,
                        type: "error",
                      });
                    }}
                    disabled
                  >
                    Add Product
                  </Button>
                  
                </div>
              )}
            </form>
          </div>
        </div>
        <MessageSnackBar
          isOpen={messageSnackbar.open}
          message={messageSnackbar.message}
          type={messageSnackbar.type}
          onClose={handleMessageSnackbarClose}
          duration={NUMBER_VALUES.SNACKBAR_DURATION}
        />
      </div>
    </div>
  );
}

export default AddProductModal;
