/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Mail, Phone, Save, User, UserPlus, X } from "lucide-react";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import AddCompanyUserStateType from "../../../@types/modal/AddCompanyUserStateType";
import AddCompanyUserModalProps from "../../../@types/modal/AddCompanyUserModalProps";
import POST_API from "../../../constants/PostApi";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import {  SIZE, STATUS_CODE, VALIDATIONS } from "../../../constants/AppConstants";
import ROUTES_URL from "../../../constants/Routes";
import MESSAGE from "../../../constants/Messages";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import useScreenSize from "../../../config/hooks/useScreenSize";
import REGEX from "../../../constants/Regex";
import toast from "react-hot-toast";
import FormHeader from "../../ui/FormHeader";
import { createPortal } from "react-dom";

function AddCompanyUserModal({ isOpen, onClose }: AddCompanyUserModalProps) {
  const { loginStatus } = useLoggedInUserContext();

  const initialAddCompanyUserFormData: AddCompanyUserStateType = {
    name: "",
    mobilenumber: "",
    email: "",
  };

  const { isSmallScreen } = useScreenSize();

  const {
    formData: addCompanyUserFormData,
    handleChange: handleAddComapnyUserFormDataChange,
    setFormData: setAddCompanyUserFormData,
  } = useFormChange(initialAddCompanyUserFormData);
  const { errors, handleBlur, setErrors } = useFormValidation(
    addCompanyUserFormData,
    "registration"
  );
  const handleAddUserSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const mobileRegex = REGEX.MOBILE_NUMBER;
    const nameRegex = REGEX.NAME_SPACE_DOT_ALLOWED_ONLY;
    if (addCompanyUserFormData.mobilenumber!.trim() !== "") {
      if (!mobileRegex.test(addCompanyUserFormData.mobilenumber!.trim())) {
        toast.error("Invalid mobile number");
        return;
      }
    }
    if (
      addCompanyUserFormData.name.trim() !== "" &&
      !nameRegex.test(addCompanyUserFormData.name)
    ) {
      toast.error(MESSAGE.ERROR.NAME_SPACE_AND_DOT_ERROR);
      return;
    }

    if (
      addCompanyUserFormData.email !== "" &&
      addCompanyUserFormData.name != "" &&
      addCompanyUserFormData.email !== null &&
      addCompanyUserFormData.name !== null
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
          toast.success(response.data.message);
          setAddCompanyUserFormData({
            name: "",
            mobilenumber: "",
            email: "",
          });
          onClose();
          window.location.href = ROUTES_URL.GET_COMPANY_USERS;
        } else {
          toast.error(response.data.message);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: ApiError | any) {
        toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG);
        if (error) {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus = await RefreshToken({
              callFunctionWithEvent: handleAddUserSubmit,
            });
            if (refreshTokenStatus) {
              handleAddUserSubmit(event);
            }
          } else {
            toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG);
          }
        }
      }
    } else {
      toast.error(MESSAGE.ERROR.REQUIRED_FIELDS);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setErrors({
        name: "",
        email: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div id="add-company-user-modal"
        className={
          isSmallScreen
            ? "fixed inset-0 z-50 pt-10 pl-20 pr-2 overflow-hidden bg-black bg-opacity-5"
            : "fixed inset-0 z-50 p-5 overflow-hidden bg-black bg-opacity-5"
        }
      >
        <div className="flex min-h-screen items-center justify-center">
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-s-lg [&::-webkit-scrollbar-track]:rounded-lg"
          >
            <div className="py-6 px-4">
              {/* <div className="flex border-b items-center gap-3 mb-4">
                <UserPlus className="text-blue-500" size={SIZE.TWENTY} />
                <h2 className="text-lg font-semibold text-gray-800">
                  Add Company User
                </h2>
                <button
                  //  note : this is logic will not work dynamically CHANGES NEEDED
                  // disabled={
                  //   loginStatus.activeUsersInCompany >
                  //   loginStatus.subscriptionAllowedUsers
                  // }
                  onClick={onClose}
                  className="absolute right-4 top-8 text-gray-400 hover:text-gray-600"
                >
                  <X size={SIZE.TWENTY} />
                </button>
              </div> */}
              <FormHeader
                icon={UserPlus}
                onClose={onClose}
                preText="Add Company User"
                description="Create and manage a new user account for your company."

              />

              <form className="space-y-3" onSubmit={handleAddUserSubmit}>
                <FormInput
                logo={User}
                  id="company-user-module-add-name"
                  label="Name"
                  type="text"
                  name="name"
                  required={true}
                  placeholder="Enter User Name"
                  value={addCompanyUserFormData.name}
                  onChange={handleAddComapnyUserFormDataChange}
                  onBlur={handleBlur}
                  error={errors.name}
                  maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                  minLength={VALIDATIONS.MIN_NAME_LENGTH}
                />
                <FormInput
                logo={Phone}
                  label="Mobile Number"
                  type="tel"
                  name="mobilenumber"
                  placeholder="Enter Mobile Number"
                  value={addCompanyUserFormData.mobilenumber}
                  onChange={handleAddComapnyUserFormDataChange}
                  onBlur={handleBlur}
                  error={errors.mobileNumber}
                  minLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
                  maxLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}

                />
                <FormInput
                logo={Mail}
                  label="Email"
                  type="email"
                  name="email"
                  required={true}
                  placeholder="Enter Email Address"
                  value={addCompanyUserFormData.email}
                  onChange={handleAddComapnyUserFormDataChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                  minLength={VALIDATIONS.MIN_EMAIL_LENGTH}
                />

                <div className="flex items-center justify-end">
                  <div className="flex gap-2">

                <Button  onClick={onClose} type="button">
                  
                   <div className="flex items-center justify-center gap-0.5">
                    <X size={SIZE.SIXTEEN}/>
                    Cancel
                    </div>
                    </Button>
                  <Button type="submit">
                   <div className="flex items-center justify-center gap-1">
                     <Save size={SIZE.SIXTEEN}/>
                    Save
                   </div>
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

export default AddCompanyUserModal;
