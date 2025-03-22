import React, { useEffect, useState } from "react";
import { EditIcon, X } from "lucide-react";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import MessageSnackBar from "../../ui/MessageSnackbar";
import POST_API from "../../../constants/PostApi";
import EditUserPopupProps from "../../../@types/modal/EditCompanyUserProps";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import {
  NUMBER_VALUES,
  SIZE,
  STATUS_CODE,
} from "../../../constants/AppConstants";
import MESSAGE from "../../../constants/Messages";
import ApiError from "../../../@types/error/ApiError";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import RefreshToken from "../../../config/validations/RefreshToken";
import RadioButtons from "../../ui/RadioButton";

function EditCompanyUserModal({
  isOpen,
  onClose,
  user,
  handleCompanyUserChange,
}: EditUserPopupProps) {
  const initialUpdateUserformData = {
    name: user.fullname,
    mobileNumber: user.mobilenumber,
    isActive : user.isactive,
  };
  const CompanyUserIsActiveRadioButtonOptions = [
    {
      label : "Active",
      value : "true",
      id : "active",
      name : "isActive",
      checked : user.isactive 
      },
      {
        label : "Inactive",
        value : 'false',
        id : "inActive",
        name : "isActive",
        checked : !user.isactive
    }
  ]


  const {
    formData: updateUserformData,
    handleChange: handleEditUserFormChange,
  } = useFormChange(initialUpdateUserformData);
  const { errors, handleBlur, setErrors } = useFormValidation(
    updateUserformData,
    "registration"
  );

  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(
    false
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  const handleEditUserSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      initialUpdateUserformData.name !== updateUserformData.name ||
      updateUserformData.mobileNumber !== initialUpdateUserformData.mobileNumber ||
      updateUserformData.isActive !== initialUpdateUserformData.isActive
    ) {
      if (updateUserformData.name != "") {
        if (
          user.fullname !== updateUserformData.name ||
          user.mobilenumber !== updateUserformData.mobileNumber ||
          updateUserformData.isActive !== user.isactive
        ) {
          const postUpdateUserData = {
            id: user.id,
            updatedby: loginStatus.id,
            company_id: loginStatus.companyId,
            fullname: updateUserformData.name,
            mobileNumber: updateUserformData.mobileNumber,
            isactive : updateUserformData.isActive
          };
          await axios.put(POST_API.UPDATE_COMPANY_USER, postUpdateUserData, {
              withCredentials: true,
            })
            .then((response) => {
              if(response.data.status){
                showMessageSnackbar({
                  message: response.data.message,
                  type: "success",
                });
              }
              else if(!response.data.status){
                showMessageSnackbar({
                  message: response.data.message,
                  type: "error",
                });
              }
              handleCompanyUserChange(user);
                setTimeout(() => {
                  onClose();
                }, 2000);
             
             
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch(async (error: ApiError | any) => {
              if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({callFunctionWithEvent : handleEditUserSubmit });
                if(refreshTokenStatus){
                  setIsDialogueOpen(false)
                }
                else{
                  setIsDialogueOpen(true);
                }
              } 
              else if(error.status === STATUS_CODE.FORBIDDEN){
                          setIsDialogueOpen(false);
                        }
                        else {
                showMessageSnackbar({
                  message: MESSAGE.ERROR.SOMETHING_WENT_WRONG,
                  type: "error",
                });
              }
            });
        } else {
          showMessageSnackbar({
            message: MESSAGE.ERROR.NO_CHANGES,
            type: "error",
          });
        }
      } else {
        showMessageSnackbar({
          message: MESSAGE.ERROR.NAME_REQUIRED,
          type: "error",
        });
        setErrors({
          name: MESSAGE.ERROR.NAME_REQUIRED,
        });
      }
    } else {
      showMessageSnackbar({ message: MESSAGE.ERROR.NO_CHANGES, type: "error" });
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
    <>
      <div className="fixed inset-0 z-50 p-9 overflow-hidden bg-black bg-opacity-45">
      <div className="flex min-h-screen items-center justify-center">
        <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X size={SIZE.TWENTY} />
          </button>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <EditIcon className="text-blue-500" size={SIZE.TWENTY_FOUR} />
              <h2 className="text-xl font-semibold text-gray-800">
                Edit {user.fullname}
              </h2>
            </div>

            <form className="space-y-8" onSubmit={handleEditUserSubmit}>
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
                name="mobileNumber"
                placeholder="Enter Mobile Number"
                defaultValue={initialUpdateUserformData.mobileNumber}
                onChange={handleEditUserFormChange}
                onBlur={handleBlur}
                error = {errors.mobileNumber}
              />

              <RadioButtons
              label="isActive"
              onChange={handleEditUserFormChange}
              options={CompanyUserIsActiveRadioButtonOptions}
              />
              <FormInput
                label="Email : "
                type="email"
                name="email"
                placeholder="Enter Email Address"
                defaultValue={user.email}
                readonly={true}
              />
              <div className="flex justify-self-center m-2 min-w-60 pb-10">
              <Button type="submit">Update Company User</Button>
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
      </div>
      <DialogueBox
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        onConfirm={handleDialogueConfirm}
        title="Session Expired !"
        message="Session Expired. Please login again."
      />
    </>
  );
}

export default EditCompanyUserModal;
