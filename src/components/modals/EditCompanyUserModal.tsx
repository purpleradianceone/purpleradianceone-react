import React, { useEffect, useState } from "react";
import { EditIcon, X } from "lucide-react";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import axios from "axios";
import MessageSnackBar from "../ui/MessageSnackbar";
import POST_API from "../../constants/PostApi";
import EditUserPopupProps from "../../@types/modal/EditCompanyUserProps";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../@types/ui/MessageSnackbarProps";
import { useFormChange } from "../../config/hooks/useFormChange";
import { useFormValidation } from "../../config/hooks/useFormValidation";

function EditCompanyUserModal({
  isOpen,
  onClose,
  user,
  handleCompanyUserChange,
}: EditUserPopupProps) {
  const initialUpdateUserformData = {
    name: user.fullname,
    mobilenumber: user.mobilenumber,
  };


  const {
    formData: updateUserformData,
    handleChange: handleEditUserFormChange,
  } = useFormChange(initialUpdateUserformData);
  const { errors, handleBlur, setErrors } = useFormValidation(
    updateUserformData,
    "registration"
  );

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const { loginStatus } = useLoggedInUserContext();

  useEffect(() => {
    if (isOpen) {
      setErrors({
        name: "",
      });
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if(initialUpdateUserformData.name !== updateUserformData.name || updateUserformData.mobilenumber !== initialUpdateUserformData.mobilenumber){
      if (updateUserformData.name !=STRING_VALUES.EMPTY_STRING) {
        if (
          user.fullname !== updateUserformData.name ||
          user.mobilenumber !== updateUserformData.mobilenumber
        ) {
          const postUpdateUserData = {
            id: user.id,
            updatedby: loginStatus.id,
            company_id: loginStatus.companyId,
            fullname: updateUserformData.name,
            mobilenumber: updateUserformData.mobilenumber,
          };
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + loginStatus.token;
          axios
            .post(POST_API.UPDATE_COMPANY_USER, postUpdateUserData)
            .then((response) => {
              showMessageSnackbar({
                message: response.data.message,
                type: "success",
              });
              handleCompanyUserChange(user);
              setTimeout(() => {
                onClose();
              }, 2000);
            })
            .catch((error) => {
              showMessageSnackbar({ message: error.message, type: "error" });
            });
        } else {
          showMessageSnackbar({ message: "No changes made", type: "error" });
        }
      } else {
        showMessageSnackbar({ message: "Name is required", type: "error" });
        setErrors({
          name: "Name is required",
        });
      }
    }
    else {
      showMessageSnackbar({message:"Please Make Changes",type:"error"});
    }
    
  };
  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  }, [isOpen]);
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
            <EditIcon className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">
              Edit {user.fullname}
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormInput
              label="Name : "
              type="text"
              name="name"
              value={updateUserformData.name}
              placeholder="Enter User Name"
              defaultValue={initialUpdateUserformData.name}
              maxLength={256}
              onChange={handleEditUserFormChange}
              error={errors.name}
              onBlur={handleBlur}
            />
            <FormInput
              label="Mobile Number : "
              type="tel"
              name="mobilenumber"
              placeholder="Enter Mobile Number"
              defaultValue={initialUpdateUserformData.mobilenumber}
              onChange={handleEditUserFormChange}
            />
            <FormInput
              label="Email : "
              type="email"
              name="email"
              placeholder="Enter Email Address"
              defaultValue={user.email}
              readonly={true}
            />
            <Button type="submit">Update Company User</Button>
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

export default EditCompanyUserModal;
