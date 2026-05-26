import React, { useEffect, useState } from "react";
import { EditIcon, Mail, Phone, Save, User, X } from "lucide-react";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import EditUserPopupProps from "../../../@types/modal/EditCompanyUserProps";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import {
  STATUS_CODE,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import MESSAGE from "../../../constants/Messages";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import REGEX from "../../../constants/Regex";
import toast from "react-hot-toast";
import FormHeader from "../../ui/FormHeader";
import ToggleButton from "../../ui/ToggleButton";
import { createPortal } from "react-dom";

function EditCompanyUserModal({
  isOpen,
  onClose,
  user,
  handleCompanyUserChange,
}: EditUserPopupProps) {
  const initialUpdateUserformData = {
    name: user.fullname,
    mobileNumber: user.mobilenumber,
  };

  const {
    formData: updateUserformData,
    handleChange: handleEditUserFormChange,
  } = useFormChange(initialUpdateUserformData);
  const { errors, handleBlur, setErrors } = useFormValidation(
    updateUserformData,
    "registration"
  );

  const [userIsActive, setUserIsActive] = useState<boolean>(user.isactive);

  const { loginStatus } = useLoggedInUserContext();

  useEffect(() => {
    if (isOpen) {
      setErrors({
        name: "",
      });
      setUserIsActive(user.isactive);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleEditUserSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const mobileRegex = REGEX.MOBILE_NUMBER_NEW;
    if (
      updateUserformData.mobileNumber &&
      updateUserformData.mobileNumber!.trim() !== ""
    ) {
      if (!mobileRegex.test(updateUserformData.mobileNumber!.trim())) {
        toast.error("Invalid mobile number");
        return;
      }
    }
    if (
      updateUserformData.name.trim() !== "" &&
      !REGEX.NAME_SPACE_DOT_ALLOWED_ONLY.test(updateUserformData.name)
    ) {
      toast.error(MESSAGE.ERROR.NAME_SPACE_AND_DOT_ERROR);
      return;
    }

    if (
      initialUpdateUserformData.name !== updateUserformData.name ||
      updateUserformData.mobileNumber !==
        initialUpdateUserformData.mobileNumber ||
      userIsActive !== user.isactive
    ) {
      if (updateUserformData.name != "") {
        if (
          user.fullname !== updateUserformData.name ||
          user.mobilenumber !== updateUserformData.mobileNumber ||
          userIsActive !== user.isactive
        ) {
          const postUpdateUserData = {
            id: user.id,
            updatedby: loginStatus.id,
            company_id: loginStatus.companyId,
            fullname: updateUserformData.name,
            mobilenumber: updateUserformData.mobileNumber,
            isactive: userIsActive,
          };
          await axios
            .put(POST_API.UPDATE_COMPANY_USER, postUpdateUserData, {
              withCredentials: true,
            })
            .then((response) => {
              if (response.data.status) {
                toast.success(response.data.message);
              } else if (!response.data.status) {
                toast.error(response.data.message);
              }
              handleCompanyUserChange(user);
              setTimeout(() => {
                onClose();
              }, 100);
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch(async (error: ApiError | any) => {
              if (error.status === STATUS_CODE.UNATHORISED) {
                const refreshTokenStatus = await RefreshToken({
                  callFunctionWithEvent: handleEditUserSubmit,
                });
                if (refreshTokenStatus) {
                  handleEditUserSubmit(event);
                }
              } else {
                toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG);
              }
            });
        } else {
          toast.error(MESSAGE.ERROR.NO_CHANGES);
        }
      } else {
        toast.error(MESSAGE.ERROR.NAME_REQUIRED);
        setErrors({
          name: MESSAGE.ERROR.NAME_REQUIRED,
        });
      }
    } else {
      toast.error(MESSAGE.ERROR.NO_CHANGES);
    }
  };

  const handleCompanyUserToggle = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // handleCloseSnackbar();
    const { checked } = event.target;

    if (user.id === loginStatus.id) {
      setUserIsActive(checked);
      toast.error("Can't change your own status");
      setTimeout(() => {
        setUserIsActive(user.isactive);
      }, 200);
      return;
    }

    const postUpdateUserData = {
      id: user.id,
      updatedby: loginStatus.id,
      company_id: loginStatus.companyId,
      fullname: updateUserformData.name,
      mobilenumber: updateUserformData.mobileNumber,
      isactive: checked,
    };
    await axios
      .put(POST_API.UPDATE_COMPANY_USER, postUpdateUserData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          setUserIsActive(checked);
        } else if (!response.data.status) {
          toast.error(response.data.message);
        }
        handleCompanyUserChange(user);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithEvent: handleCompanyUserToggle,
          });
          if (refreshTokenStatus) {
            handleCompanyUserToggle(event);
          }
        } else {
          toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG);
        }
      });
  };
  if (!isOpen) return null;

  return createPortal(
    <>
      <div  className="fixed inset-0 z-50 p-9 overflow-hidden bg-black bg-opacity-5">
        <div className="flex min-h-screen items-center justify-center">
          <div
            className=" w-full max-w-lg max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
          >
            <div  className="p-5">
              <FormHeader
                icon={EditIcon}
                onClose={onClose}
                preText="Update user : "
                userName={user.fullname}
                description="Modify and manage user details, including contact information, as needed."
              />

              <form id="company-user-edit-modal" className="space-y-5" onSubmit={handleEditUserSubmit}>
                <FormInput
                autoFocus={true}
                  logo={User}
                  label="Name"
                  type="text"
                  name="name"
                  required={true}
                  value={updateUserformData.name}
                  placeholder="Enter User Name"
                  defaultValue={initialUpdateUserformData.name}
                  maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                  minLength={VALIDATIONS.MIN_NAME_LENGTH}
                  onChange={handleEditUserFormChange}
                  error={errors.name}
                  onBlur={handleBlur}
                />
                <FormInput
                  logo={Phone}
                  label="Mobile Number"
                  type="tel"
                  name="mobileNumber"
                  placeholder="Enter Mobile Number"
                  maxLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
                  defaultValue={initialUpdateUserformData.mobileNumber}
                  onChange={handleEditUserFormChange}
                  onBlur={handleBlur}
                  error={errors.mobileNumber}
                />

                <div className="flex items-center gap-4 justify-start">
                  <label
                    htmlFor="isActive"
                    className="block input-label-custom"
                  >
                    Status :
                  </label>

                  {/* <label className="inline-flex items-center cursor-pointer relative self-end">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={userIsActive}
                      onChange={handleCompanyUserToggle}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />{" "}
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />{" "}
                  </label> */}
                  <ToggleButton
                  checked={userIsActive}
                  name="isActive"
                  onToggle={handleCompanyUserToggle}
                  />
                </div>
                <FormInput
                  logo={Mail}
                  label="Email"
                  type="email"
                  name="email"
                  required={true}
                  maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                  minLength={VALIDATIONS.MIN_EMAIL_LENGTH}
                  placeholder="Enter Email Address"
                  defaultValue={user.email}
                  readonly={true}
                />
                <div className="flex justify-end  ">
                  <div className="flex gap-1">
                    <Button onClick={onClose} type="button">
                      <div className="flex items-center">
                        <X size={16} /> Cancel
                      </div>
                    </Button>
                    <Button type="submit">
                      <div className="flex items-center gap-1">
                        <Save size={16} />
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

export default EditCompanyUserModal;
