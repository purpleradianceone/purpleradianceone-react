import React, { useState } from "react";
import { UserPlus, X } from "lucide-react";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import MessageSnackBar from "../../ui/MessageSnackbar";
import AddCompanyUserStateType from "../../../@types/modal/AddCompanyUserStateType";
import AddCompanyUserModalProps from "../../../@types/modal/AddCompanyUserModalProps";
import POST_API from "../../../constants/PostApi";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { BOOLEAN_VALUES, NUMBER_VALUES, SIZE, STATUS_CODE, STRING_VALUES } from "../../../constants/AppConstants";
import ROUTES_URL from "../../../constants/Routes";
import MESSAGE from "../../../constants/Messages";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import { useNavigate } from "react-router-dom";
import { DialogueBox } from "../../dialogue-box/Dialogue";

function AddCompanyUserModal({ isOpen, onClose }: AddCompanyUserModalProps) {
  const { loginStatus } = useLoggedInUserContext();

    const initialAddCompanyUserFormData : AddCompanyUserStateType = {
      name: STRING_VALUES.EMPTY_STRING,
      mobilenumber: STRING_VALUES.EMPTY_STRING,
      email: STRING_VALUES.EMPTY_STRING,
    }

    const navigate = useNavigate();
    const [isDialogueOpen,setIsDialogueOpen] = useState<boolean>(BOOLEAN_VALUES.FALSE);

    const {formData:addCompanyUserFormData, handleChange:handleAddComapnyUserFormDataChange ,setFormData : setAddCompanyUserFormData} = useFormChange(initialAddCompanyUserFormData)
    const {errors,handleBlur} = useFormValidation(addCompanyUserFormData,"registration")

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
            withCredentials: BOOLEAN_VALUES.TRUE,
          }
        );
        if (response.data.status) {
          
          showMessageSnackbar({
            message: response.data.message,
            type: "success",
          });
          setAddCompanyUserFormData({
            name: STRING_VALUES.EMPTY_STRING,
            mobilenumber: STRING_VALUES.EMPTY_STRING,
            email: STRING_VALUES.EMPTY_STRING,
          })
          onClose();
          window.location.href = ROUTES_URL.GET_COMPANY_USERS;
        } else {
          showMessageSnackbar({ message: response.data.message, type: "error" });
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error : ApiError | any) {
        showMessageSnackbar({
          message: MESSAGE.ERROR.SOMETHING_WENT_WRONG,
          type: "error",
        });
        console.log(error);
        if(error){
          if (error.status === STATUS_CODE.UNATHORISED) {
            setIsDialogueOpen(BOOLEAN_VALUES.TRUE);
          }
          else{
            showMessageSnackbar({message:MESSAGE.ERROR.SOMETHING_WENT_WRONG,type : "error"})
          }
        }

        
      }

    }
    else{
      showMessageSnackbar({ message: MESSAGE.ERROR.REQUIRED_FIELDS, type: "error" });
    }
   
  };

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(BOOLEAN_VALUES.FALSE);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN)
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 mt-16 bg-black bg-opacity-45 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn px-3 py-11">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={SIZE.TWENTY} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="text-blue-500" size={SIZE.TWENTY_FOUR} />
            <h2 className="text-xl font-semibold text-gray-800">
              Add New Company CompanyUser
            </h2>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <FormInput
              label="Name : "
              type="text"
              name="name"
              placeholder="Enter User Name"
              value={addCompanyUserFormData.name}
              onChange={handleAddComapnyUserFormDataChange}
              onBlur={handleBlur}
              error={errors.name}
              maxLength={NUMBER_VALUES.HUNDRED}
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
              maxLength={NUMBER_VALUES.FIFTEEN}
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
              maxLength={NUMBER_VALUES.TWO_FIFTY_SIX}
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
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />

      <DialogueBox
              isOpen={isDialogueOpen}
              onClose={() => setIsDialogueOpen(BOOLEAN_VALUES.FALSE)}
              onConfirm={handleDialogueConfirm}
              title="Session Expired !"
              message="Session Expired. Please login again."
            />
    </div>
  );
}

export default AddCompanyUserModal;
