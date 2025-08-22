import React, { useEffect, useState } from "react";
import { EditIcon, X } from "lucide-react";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import EditUserPopupProps from "../../../@types/modal/EditCompanyUserProps";
import { useFormChange } from "../../../config/hooks/useFormChange";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { SIZE, STATUS_CODE } from "../../../constants/AppConstants";
import MESSAGE from "../../../constants/Messages";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import REGEX from "../../../constants/Regex";
import toast from "react-hot-toast";
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

  // const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
  //   open: false,
  //   message: "",
  //   type: "success" as "success" | "error",
  // });
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

  const handleEditUserSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const mobileRegex = REGEX.MOBILE_NUMBER_NEW;
    if (updateUserformData.mobileNumber && updateUserformData.mobileNumber!.trim() !== "") {
      if (!mobileRegex.test(updateUserformData.mobileNumber!.trim())) {
        // showMessageSnackbar({message : "Invalid mobile number", type : "error"});
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
                // showMessageSnackbar({
                //   message: response.data.message,
                //   type: "success",
                // });
                toast.success(response.data.message);
              } else if (!response.data.status) {
                // showMessageSnackbar({
                //   message: response.data.message,
                //   type: "error",
                // });
                toast.error(response.data.message);
              }
              handleCompanyUserChange(user);
              setTimeout(() => {
                onClose();
              }, 2000);
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
                // showMessageSnackbar({
                //   message: MESSAGE.ERROR.SOMETHING_WENT_WRONG,
                //   type: "error",
                // });
                toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG);
              }
            });
        } else {
          // showMessageSnackbar({
          //   message: MESSAGE.ERROR.NO_CHANGES,
          //   type: "error",
          // });
          toast.error(MESSAGE.ERROR.NO_CHANGES);
        }
      } else {
        // showMessageSnackbar({
        //   message: MESSAGE.ERROR.NAME_REQUIRED,
        //   type: "error",
        // });
        toast.error(MESSAGE.ERROR.NAME_REQUIRED);
        setErrors({
          name: MESSAGE.ERROR.NAME_REQUIRED,
        });
      }
    } else {
      // showMessageSnackbar({ message: MESSAGE.ERROR.NO_CHANGES, type: "error" });
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
      // showMessageSnackbar({message : "Can't change your own status", type : "error"});
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
          // showMessageSnackbar({
          //   message: response.data.message,
          //   type: "success",
          // });
          toast.success(response.data.message);
          setUserIsActive(checked);
        } else if (!response.data.status) {
          // showMessageSnackbar({
          //   message: response.data.message,
          //   type: "error",
          // });
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
          // showMessageSnackbar({
          //   message: MESSAGE.ERROR.SOMETHING_WENT_WRONG,
          //   type: "error",
          // });
          toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG);
        }
      });
  };
  // const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
  //   setMessageSnackbar({ open: true, message, type });
  // };

  // const handleCloseSnackbar = () => {
  //   setMessageSnackbar((prev) => ({ ...prev, open: false }));
  // };

  // useEffect(() => {
  //   setMessageSnackbar((prev) => ({ ...prev, open: false }));
  // }, [isOpen]);
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 p-9 overflow-hidden bg-black bg-opacity-45">
        <div className="flex min-h-screen items-center justify-center">
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-scroll bg-white rounded-lg shadow-xl animate-fadeIn [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-400
   [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={SIZE.TWENTY} />
            </button>

            <div className="p-5">
              <div className="flex items-center gap-4 mb-5 border-b pb-1">
                <EditIcon className="text-blue-500" size={SIZE.TWENTY_FOUR} />
                <h2 className="text-xl font-semibold text-gray-800">
                  Edit {user.fullname}
                </h2>
              </div>

              <form className="space-y-8" onSubmit={handleEditUserSubmit}>
                <FormInput
                  label="Name"
                  type="text"
                  name="name"
                  required={true}
                  value={updateUserformData.name}
                  placeholder="Enter User Name"
                  defaultValue={initialUpdateUserformData.name}
                  maxLength={256}
                  onChange={handleEditUserFormChange}
                  error={errors.name}
                  onBlur={handleBlur}
                />
                <FormInput
                  label="Mobile Number"
                  type="tel"
                  name="mobileNumber"
                  placeholder="Enter Mobile Number"
                  defaultValue={initialUpdateUserformData.mobileNumber}
                  onChange={handleEditUserFormChange}
                  onBlur={handleBlur}
                  error={errors.mobileNumber}
                />

                <div className="flex items-center gap-4 justify-start">
                  <label
                    htmlFor="isActive"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status :
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={userIsActive}
                      onChange={handleCompanyUserToggle}
                      className="sr-only peer"
                    />
                    <div
                      className="w-11 h-6 bg-red-500 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-gray-300
                     after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                     peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white"
                    ></div>
                  </label>
                </div>
                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  required={true}
                  placeholder="Enter Email Address"
                  defaultValue={user.email}
                  readonly={true}
                />
                <div className="flex justify-self-center min-w-60 ">
                  <Button type="submit">Update Company User</Button>
                </div>
              </form>
            </div>
          </div>
          {/* <MessageSnackBar
            isOpen={messageSnackbar.open}
            message={messageSnackbar.message}
            type={messageSnackbar.type}
            onClose={handleCloseSnackbar}
            duration={NUMBER_VALUES.SNACKBAR_DURATION}
          /> */}
        </div>
      </div>
    </>
  );
}

export default EditCompanyUserModal;
