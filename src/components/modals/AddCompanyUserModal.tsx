import React, { useState } from "react";
import { UserPlus, X } from "lucide-react";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import MessageSnackBar from "../ui/MessageSnackbar";
import AddCompanyUserStateType from "../../@types/modal/AddCompanyUserStateType";
import AddCompanyUserModalProps from "../../@types/modal/AddCompanyUserModalProps";
import POST_API from "../../constants/PostApi";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../@types/ui/MessageSnackbarProps";
import { useFormChange } from "../../config/hooks/useFormChange";
import { useFormValidation } from "../../config/hooks/useFormValidation";
import { STRING_VALUES } from "../../constants/AppConstants";

function AddCompanyUserModal({ isOpen, onClose }: AddCompanyUserModalProps) {
  const { loginStatus } = useLoggedInUserContext();


    const initialAddCompanyUserFormData : AddCompanyUserStateType = {
      name: "",
      mobilenumber: "",
      email: "",
    }

    const {formData:addCompanyUserFormData, handleChange:handleAddComapnyUserFormDataChange ,setFormData : setAddCompanyUserFormData} = useFormChange(initialAddCompanyUserFormData)
    const {errors,handleBlur} = useFormValidation(addCompanyUserFormData,"registration")

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });





  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if(addCompanyUserFormData.email !== STRING_VALUES.EMPTY_STRING && addCompanyUserFormData.name !=STRING_VALUES.EMPTY_STRING &&
      addCompanyUserFormData.email !== null && addCompanyUserFormData.name !== null
    ) {
      const createCompanyUserData = {
        fullname: addCompanyUserFormData.name.trim(),
        mobilenumber: addCompanyUserFormData.mobilenumber.trim(),
        email: addCompanyUserFormData.email.trim(),
        createdby: loginStatus.id,
        company_id: loginStatus.companyId,
      };
  
      try {
        const response = await axios.post(
          POST_API.CREATE_USER,
          createCompanyUserData,
          {
            withCredentials: true,
          }
        );
        if (response.data.status) {
          
          showMessageSnackbar({
            message: response.data.message,
            type: "success",
          });
          setAddCompanyUserFormData({
            name: "",
            mobilenumber: "",
            email: "",
          })
          onClose();
          window.location.href = "/home/manage-users/users";
        } else {
          showMessageSnackbar({ message: response.data.message, type: "error" });
        }
      } catch (error) {
        showMessageSnackbar({
          message: "Something went wrong. Please try again.",
          type: "error",
        });
        console.log(error);
      }

    }
    else{
      showMessageSnackbar({ message: "Please fill in required fields.", type: "error" });
    }
   
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">
              Add New Company CompanyUser
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormInput
              label="Name : "
              type="text"
              name="name"
              placeholder="Enter User Name"
              value={addCompanyUserFormData.name}
              onChange={handleAddComapnyUserFormDataChange}
              onBlur={handleBlur}
              error={errors.name}
              maxLength={100}
            />
            <FormInput
              label="Mobile Number : "
              type="tel"
              name="mobilenumber"
              placeholder="Enter Mobile Number"
              value={addCompanyUserFormData.mobilenumber}
              onChange={handleAddComapnyUserFormDataChange}
              onBlur={handleBlur}
              error={errors.mobileNumber}
              maxLength={15}
            />
            <FormInput
              label="Email : "
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={addCompanyUserFormData.email}
              onChange={handleAddComapnyUserFormDataChange}
              onBlur={handleBlur}
              error={errors.email}
              maxLength={256}
            />
            <Button type="submit">Create Company CompanyUser</Button>
          </form>
        </div>
      </div>
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={2000}
      />
    </div>
  );
}

export default AddCompanyUserModal;
