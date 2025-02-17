import { Store, X } from "lucide-react";
import AddCompanyUserModalProps from "../../../@types/modal/AddCompanyUserModalProps";
import {
  BOOLEAN_VALUES,
  NUMBER_VALUES,
  SIZE,
  STRING_VALUES,
  TAX_CODE,
} from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import TextAreaInput from "../../ui/TextAreaInput";
import RadioButtons from "../../ui/RadioButton";
import {
  productsData,
  ProductsRadioButtonOptions,
} from "../../../constants/TestData";
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

function AddProductModal({ isOpen, onClose }: AddCompanyUserModalProps) {
  const [selectedTaxCode, setSelectedTaxCode] = useState<string>("");
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: BOOLEAN_VALUES.FALSE,
    message: STRING_VALUES.EMPTY_STRING,
    type: "success",
  });

  function handleTaxRadioButtonChange(value: string) {
    setSelectedTaxCode(value);
    console.log(value);
  }

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: BOOLEAN_VALUES.TRUE, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: BOOLEAN_VALUES.FALSE }));
  };

  const intialAddProductFormData: Product = {
    name: STRING_VALUES.EMPTY_STRING,
    code: STRING_VALUES.EMPTY_STRING,
    description: STRING_VALUES.EMPTY_STRING,
    cost: NUMBER_VALUES.ZERO,
    hsn: STRING_VALUES.EMPTY_STRING,
    sac: STRING_VALUES.EMPTY_STRING,
  };

  const {userHasAccessToAddProduct} = useUserAccessModules();

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

  const handleAddProductFormSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (
      addProductFormData.name !== STRING_VALUES.EMPTY_STRING ||
      addProductFormData.code !== STRING_VALUES.EMPTY_STRING ||
      addProductFormData.description !== STRING_VALUES.EMPTY_STRING
    ) {
      productsData.push(addProductFormData);
      showMessageSnackbar({
        message: "Product Added Successfully",
        type: "success",
      });
      setTimeout(() => {
        onClose();
      }, NUMBER_VALUES.SNACKBAR_DURATION);
    }
  };

  const hanldeTopPadding = () => {
    if (selectedTaxCode === TAX_CODE.ALL) {
      return "475px";
    } else if (
      selectedTaxCode !== TAX_CODE.ALL &&
      selectedTaxCode !== STRING_VALUES.EMPTY_STRING
    ) {
      return "365px";
    } else if (selectedTaxCode === STRING_VALUES.EMPTY_STRING) {
      return "320px";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-10 bg-black bg-opacity-45 flex items-center justify-center overflow-y-scroll"
      style={{ paddingTop: hanldeTopPadding() }}
    >
      <div className="bg-white mt-16 rounded-lg shadow-xl w-full max-w-2xl relative animate-fadeIn px-3 py-11">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={SIZE.TWENTY} />
        </button>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Store className="text-blue-500" size={SIZE.TWENTY_FOUR} />
            <h2 className="text-xl font-semibold text-gray-800">
              Add New Product
            </h2>
          </div>

          <form className="space-y-8" onSubmit={handleAddProductFormSubmit}>
            <FormInput
              label="Product Name : "
              type="text"
              name="name"
              placeholder="Product Name"
              onChange={handleAddProductFormDataChange}
              onBlur={handleBlur}
              error={errors.name}
            />
            <FormInput
              label="Item Code : "
              type="text"
              name="code"
              placeholder="Product Item Code"
              onChange={handleAddProductFormDataChange}
              onBlur={handleBlur}
              error={errors.code}
            />
            <FormInput
              label="Basic Cost : "
              type="number"
              name="cost"
              placeholder="Product Price"
              onChange={handleAddProductFormDataChange}
            />
            <TextAreaInput
              label="Description : "
              name="description"
              placeholder="Product Description"
              cols={NUMBER_VALUES.FIVE}
              rows={NUMBER_VALUES.THREE}
              maxLength={NUMBER_VALUES.TWO_FIFTY_SIX}
              onChange={handleAddProductFormDataChange}
              onBlur={handleBlur}
              error={errors.description}
            />

            <RadioButtons
              options={ProductsRadioButtonOptions}
              onChange={handleTaxRadioButtonChange}
            />

            
         {(selectedTaxCode === TAX_CODE.HSN || selectedTaxCode === STRING_VALUES.EMPTY_STRING ) && (
          <FormInput
            label="HSN : "
            type="text"
            name="hsn"
            placeholder="Enter HSN Code"
            onChange={handleAddProductFormDataChange}
          />
        )}

        {selectedTaxCode === TAX_CODE.SAC && (
          <FormInput
            label="SAC : "
            type="text"
            name="sac"
            placeholder="Enter SAC Code"
            onChange={handleAddProductFormDataChange}
          />
        )}
        {selectedTaxCode === TAX_CODE.ALL && (
          <>
            <FormInput
              label="HSN : "
              type="text"
              name="hsn"
              placeholder="Enter HSN Code"
              onChange={handleAddProductFormDataChange}
            />
            <FormInput
              label="SAC : "
              type="text"
              name="sac"
              placeholder="Enter SAC Code"
              onChange={handleAddProductFormDataChange}
            />
          </>
        )}
        

           
            {userHasAccessToAddProduct ? <Button type="submit">Add Product</Button> : 
            <Button type="submit" onClick={()=>{
              showMessageSnackbar({message:"Don't have proper Access Rights",type:"error"})
            }} disabled>Add Product</Button>}
            
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
  );
}

export default AddProductModal;
