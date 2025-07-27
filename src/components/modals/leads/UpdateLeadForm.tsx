/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit, X } from "lucide-react";
import {
  NUMBER_VALUES,
  SIZE,
  STATUS_CODE,
} from "../../../constants/AppConstants";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { useFormChange } from "../../../config/hooks/useFormChange";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";

import UpdateLeadProps from "../../../@types/lead-management/UpdateLeadProps";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import PostDataLeadUpdate from "../../../@types/lead-management/PostDataLeadUpdate";

function UpdateLeadForm({
  isOpen,
  onClose,
  selectedLeadForEdit,
  
}: UpdateLeadProps) {
  const { loginStatus } = useLoggedInUserContext();

  const initialCreatLeadFormData = {
    name: selectedLeadForEdit.name,
    email: selectedLeadForEdit.email,
    mobileNumber: selectedLeadForEdit.mobileNumber,
  };
  const { errors } = useFormValidation(
    initialCreatLeadFormData,
    "registration"
  );
  const {
    formData: createLeadModalFormData,
    handleChange: handleUpdateLeadFormDataChange,
  } = useFormChange(initialCreatLeadFormData);

  //note : Message Snackbar
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      (createLeadModalFormData.email === null ||
        createLeadModalFormData.email === "") &&
      (createLeadModalFormData.mobileNumber === null ||
        createLeadModalFormData.mobileNumber === "")
    ) {
      showMessageSnackbar({
        message: "email and mobilenumber both cannot be null.",
        type: "error",
      });
      return;
    }

    const postDataForLeadUpdate: PostDataLeadUpdate = {
      company_id: loginStatus.companyId,
      id: selectedLeadForEdit.id, //NOTE : LEAD ID FOR EDIT
      name: createLeadModalFormData.name,
      email: createLeadModalFormData.email,
      mobilenumber: createLeadModalFormData.mobileNumber,
      updatedby_id: loginStatus.id,
    };
    try {
      const response = await axios.post(
        POST_API.UPDATE_LEAD,
        postDataForLeadUpdate,
        { withCredentials: true }
      );
        if (response.data.status === true) {
          showMessageSnackbar({
            message: response.data.message,
            type: "success",
          });
          onClose();
        } else if (response.data.status === false) {
          showMessageSnackbar({
            message: response.data.message,
            type: "error",
          });
        }
      
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handleSubmit,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          handleSubmit(event);
        }
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      handleCloseSnackbar();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-45 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl relative animate-fadeIn px-6 py-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <Edit className="text-blue-500" size={SIZE.TWENTY_FOUR} />
            <h2 className="text-lg font-semibold text-gray-800">Edit Lead</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={SIZE.TWENTY} />
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300"></div>

        {/* Form */}
        <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-3">
            <FormInput
              label="Name : "
              type="text"
              name="name"
              placeholder="Enter Name"
              value={createLeadModalFormData.name}
              defaultValue={initialCreatLeadFormData.name}
              onChange={handleUpdateLeadFormDataChange}
            />

            {/* NOTE : EIGHTER ONE THEM IS REQUIRED FIELD (from email and mobile number) */}
            <FormInput
              label="Email : "
              type="email"
              name="email"
              placeholder="Enter Email"
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              value={createLeadModalFormData.email}
              defaultValue={initialCreatLeadFormData.email}
              onChange={handleUpdateLeadFormDataChange}
              error={errors.email}
            />

            <FormInput
              label="Mobile Number : "
              type="tel"
              name="mobileNumber"
              pattern="[0-9]{10}"
              placeholder="Enter Phone Number"
              value={createLeadModalFormData.mobileNumber}
              defaultValue={initialCreatLeadFormData.mobileNumber}
              onChange={handleUpdateLeadFormDataChange}
              error={errors.mobileNumber}
            />
          </div>

          <div className="flex justify-center px-36 ">
            <Button type="submit">
              <span> Save</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Snackbar */}
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

export default UpdateLeadForm;
