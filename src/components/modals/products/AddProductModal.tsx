import { Store, X } from "lucide-react";
import AddCompanyUserModalProps from "../../../@types/modal/AddCompanyUserModalProps";
import { NUMBER_VALUES, SIZE, TAX_CODE } from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import TextAreaInput from "../../ui/TextAreaInput";
import RadioButtons from "../../ui/RadioButton";
import { ProductsRadioButtonOptions } from "../../../constants/TestData";
import { useState } from "react";

function AddProductModal({ isOpen, onClose }: AddCompanyUserModalProps) {
  const [selectedTaxCode, setSelectedTaxCode] = useState<string>("");

  function handleTaxRadioButtonChange(value: string) {
    setSelectedTaxCode(value);
    console.log(value);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-45 flex items-center justify-center p-4 overflow-y-scroll"  style={selectedTaxCode === TAX_CODE.ALL ? {paddingTop : "245px"} : {paddingTop : "130px"}}>
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

          <form className="space-y-8">
            <FormInput
              label="Product Name : "
              type="text"
              name="productName"
              placeholder="Enter Product Name"
            />
            <FormInput
              label="Item Code : "
              type="text"
              name="itemCode"
              placeholder="Enter Mobile Number"
            />
            <TextAreaInput
              label="Description : "
              name="description"
              cols={NUMBER_VALUES.FIVE}
              rows={NUMBER_VALUES.THREE}
              maxLength={NUMBER_VALUES.TWO_FIFTY_SIX}
            />

            <RadioButtons
              options={ProductsRadioButtonOptions}
              onChange={handleTaxRadioButtonChange}
            />
            {selectedTaxCode === TAX_CODE.HSN && (
              <FormInput
                label="HSN : "
                type="text"
                name="HSN"
                placeholder="Enter HSN Code"
              />
            )}

            {selectedTaxCode === TAX_CODE.SAC && (
              <FormInput
                label="HSN : "
                type="text"
                name="SAC"
                placeholder="Enter SAC Code"
              />
            )}
            {selectedTaxCode === TAX_CODE.ALL && (
              <>
                <FormInput
                  label="HSN : "
                  type="text"
                  name="HSN"
                  placeholder="Enter HSN Code"
                />
                <FormInput
                  label="HSN : "
                  type="text"
                  name="HSN"
                  placeholder="Enter HSN Code"
                />
              </>
            )}

            <Button type="submit">Create Company CompanyUser</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;
