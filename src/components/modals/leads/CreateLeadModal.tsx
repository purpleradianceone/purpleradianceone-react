
import { Handshake, X } from "lucide-react";
import { BOOLEAN_VALUES, NUMBER_VALUES, SIZE, STRING_VALUES } from "../../../constants/AppConstants";
import AddCompanyUserModalProps from "../../../@types/modal/AddCompanyUserModalProps";
import FormInput from "../../ui/FormInput";
import TextAreaInput from "../../ui/TextAreaInput";
import Button from "../../ui/Button";
import ProductDropdownList from "../../ui/ProductDropdown";
import { leadsData, productsData } from "../../../constants/TestData";
import { useState } from "react";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { MessageSnackbarState, ShowMessageSnackbarProps } from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";

type CreateLeadFormDataType = {
    name: string,
    email: string,
    mobileNumber: string,
    address: string,
    circle: string,
    interest: string,
    referenceBy: string,
    remark: string,
    status: string,
}

function CreateLeadModal({ isOpen, onClose }: AddCompanyUserModalProps) {

    const initialCreatLeadFormData: CreateLeadFormDataType = {
        name: STRING_VALUES.EMPTY_STRING,
        email: STRING_VALUES.EMPTY_STRING,
        mobileNumber: STRING_VALUES.EMPTY_STRING,
        address: STRING_VALUES.EMPTY_STRING,
        circle: STRING_VALUES.EMPTY_STRING,
        interest: STRING_VALUES.EMPTY_STRING,
        referenceBy: STRING_VALUES.EMPTY_STRING,
        remark: STRING_VALUES.EMPTY_STRING,
        status:STRING_VALUES.EMPTY_STRING,
    }

    const { errors, handleBlur } = useFormValidation(initialCreatLeadFormData, "registration")
    const { formData: createLeadModalFormData, handleChange: handleCreateLeadModalFormDataChange } = useFormChange(initialCreatLeadFormData)


  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: BOOLEAN_VALUES.FALSE,
    message: STRING_VALUES.EMPTY_STRING,
    type: "success" as "success" | "error",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: BOOLEAN_VALUES.TRUE, message, type });
  };

  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: BOOLEAN_VALUES.FALSE }));
  };




    if (!isOpen) return null;

    // Handle Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (createLeadModalFormData.name !== STRING_VALUES.EMPTY_STRING 
            || createLeadModalFormData.email !== STRING_VALUES.EMPTY_STRING
        || createLeadModalFormData.mobileNumber !== STRING_VALUES.EMPTY_STRING){
            leadsData.push(createLeadModalFormData);
            showMessageSnackbar({
                message: "Lead Created Successfully",
                type:"success"
            })
            setTimeout(()=>{
                onClose();
            },NUMBER_VALUES.SNACKBAR_DURATION)
        }
    };

    return (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-45 flex items-center justify-center p-4 overflow-y-scroll" style={{ paddingTop: "480px" }} >
            <div className="bg-white mt-16 rounded-lg shadow-xl w-full max-w-2xl relative animate-fadeIn px-3 py-11">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={SIZE.TWENTY} />
                </button>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Handshake className="text-blue-500" size={SIZE.TWENTY_FOUR} />
                        <h2 className="text-xl font-semibold text-gray-800">
                            Create New Opportunity
                        </h2>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Product Name Dropdown */}
                        <ProductDropdownList product={productsData} />

                        {/* Name */}
                        <FormInput
                            label="Name : "
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            value={createLeadModalFormData.name}
                            onChange={handleCreateLeadModalFormDataChange}
                            onBlur={handleBlur}
                            error={errors.name}
                        />

                        {/* Email */}
                        <FormInput
                            label="Email : "
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={createLeadModalFormData.email}
                            onChange={handleCreateLeadModalFormDataChange}
                            onBlur={handleBlur}
                            error={errors.email}
                        />

                        {/* Phone Number */}
                        <FormInput
                            label="mobileNumber : "
                            type="text"
                            name="mobileNumber"
                            placeholder="Enter Phone Number"
                            value={createLeadModalFormData.mobileNumber}
                            onChange={handleCreateLeadModalFormDataChange

                            }
                            onBlur={handleBlur}
                            error={errors.mobileNumber}
                        />

                        {/* Address */}
                        <FormInput
                            label="Address : "
                            type="text"
                            name="address"
                            placeholder="Enter Address"
                            value={createLeadModalFormData.address}
                        />

                        {/* Circle Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Circle :</label>
                            <select
                                name="circle"
                                value={createLeadModalFormData.circle}

                                className="w-full p-2 border rounded-md"
                            >
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Telangana">Telangana</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Maharashtra">Maharashtra</option>
                            </select>
                        </div>

                        {/* Interest Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Interest :</label>
                            <select
                                name="interest"

                                className="w-full p-2 border rounded-md"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        {/* Reference By Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Reference by :</label>
                            <select
                                name="referenceBy"

                                className="w-full p-2 border rounded-md"
                            >
                                <option value="Marketing">Marketing</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Referral">Referral</option>
                                <option value="Cold Call">Cold Call</option>
                            </select>
                        </div>

                        {/* Remark */}
                        <TextAreaInput
                            label="Remark : "
                            name="remark"
                            cols={5}
                            rows={3}
                            maxLength={256}

                        />

                        {/* Buttons */}
                        <div className="flex justify-start gap-4">
                            <Button type="submit">Save</Button>


                        </div>
                    </form>
                </div>
            </div>
            <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
        </div>
    );
}

export default CreateLeadModal;

