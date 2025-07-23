/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
import {
  NUMBER_VALUES,
  SIZE,
  STATUS_CODE,
} from "../../../constants/AppConstants";
import ROUTES_URL from "../../../constants/Routes";
import MESSAGE from "../../../constants/Messages";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import { useNavigate } from "react-router-dom";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import RefreshToken from "../../../config/validations/RefreshToken";
import useScreenSize from "../../../config/hooks/useScreenSize";

function AddCompanyUserModal({ isOpen, onClose }: AddCompanyUserModalProps) {
  const { loginStatus } = useLoggedInUserContext();

  const initialAddCompanyUserFormData: AddCompanyUserStateType = {
    name: "",
    mobilenumber: "",
    email: "",
  };

  const {isSmallScreen} = useScreenSize()
  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(
    false
  );

  const {
    formData: addCompanyUserFormData,
    handleChange: handleAddComapnyUserFormDataChange,
    setFormData: setAddCompanyUserFormData,
  } = useFormChange(initialAddCompanyUserFormData);
  const { errors, handleBlur,setErrors } = useFormValidation(
    addCompanyUserFormData,
    "registration"
  );

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

  const handleAddUserSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      addCompanyUserFormData.email !== "" &&
      addCompanyUserFormData.name != "" &&
      addCompanyUserFormData.email !== null &&
      addCompanyUserFormData.name !== null
    ) {
      const createCompanyUserData = {
        fullname: addCompanyUserFormData.name.trim(),
        //NOTE : CHAGES NEEDED

        mobilenumber: "+91-"+ addCompanyUserFormData.mobilenumber.trim(),
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
          });
          onClose();
          window.location.href = ROUTES_URL.GET_COMPANY_USERS;
        } else {
          showMessageSnackbar({
            message: response.data.message,
            type: "error",
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: ApiError | any) {
        showMessageSnackbar({
          message: MESSAGE.ERROR.SOMETHING_WENT_WRONG,
          type: "error",
        });
        console.log(error);
        if (error) {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus = await RefreshToken({
              callFunctionWithEvent: handleAddUserSubmit,
            });
            if (refreshTokenStatus) {
              setIsDialogueOpen(false);
            } else {
              setIsDialogueOpen(true);
            }
          } 
          else if(error.status === STATUS_CODE.FORBIDDEN){
            setIsDialogueOpen(true);
          }
          else {
            showMessageSnackbar({
              message: MESSAGE.ERROR.SOMETHING_WENT_WRONG,
              type: "error",
            });
          }
        }
      }
    } else {
      showMessageSnackbar({
        message: MESSAGE.ERROR.REQUIRED_FIELDS,
        type: "error",
      });
    }
  };

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  useEffect(()=>{
    if(!isOpen){
      setErrors({
        name : "",
        email : "",
      })
    }
  },[])

  if (!isOpen) return null;

  return (
    <>
      <div className={isSmallScreen ? "fixed inset-0 z-10 pt-10 pl-20 pr-2 overflow-hidden bg-black bg-opacity-45" : "fixed inset-0 z-10 p-5 overflow-hidden bg-black bg-opacity-45" }>
        <div className="flex min-h-screen items-center justify-center">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-s-lg [&::-webkit-scrollbar-track]:rounded-lg">
            

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <UserPlus className="text-blue-500" size={SIZE.TWENTY_FOUR} />
                <h2 className="text-xl font-semibold text-gray-800">
                  Add New Company User
                </h2>
                <button
                //  note : this is logic will not work dynamically CHANGES NEEDED
                disabled={loginStatus.activeUsersInCompany> loginStatus.subscriptionAllowedUsers}
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={SIZE.TWENTY} />
            </button>
              </div>

              <form className="space-y-8" onSubmit={handleAddUserSubmit}>
                <FormInput
                  label="Name"
                  type="text"
                  name="name"
                   required={true}
                  placeholder="Enter User Name"
                  value={addCompanyUserFormData.name}
                  onChange={handleAddComapnyUserFormDataChange}
                  onBlur={handleBlur}
                  error={errors.name}
                  maxLength={100}
                />
                <FormInput
                  label="Mobile Number"
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
                  label="Email"
                  type="email"
                  name="email"
                   required={true}
                  placeholder="Enter Email Address"
                  value={addCompanyUserFormData.email}
                  onChange={handleAddComapnyUserFormDataChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  maxLength={256}
                />
                <Button type="submit">{isSmallScreen ? "Create" : "Create Company CompanyUser"}</Button>
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

export default AddCompanyUserModal;
