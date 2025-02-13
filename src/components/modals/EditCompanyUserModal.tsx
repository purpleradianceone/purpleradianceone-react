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
import {
  BOOLEAN_VALUES,
  NUMBER_VALUES,
  SIZE,
  STATUS_CODE,
  STRING_VALUES,
} from "../../constants/AppConstants";
import MESSAGE from "../../constants/Messages";
import ApiError from "../../@types/error/ApiError";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import { DialogueBox } from "../dialogue-box/Dialogue";

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

  const navigate = useNavigate();
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(
    BOOLEAN_VALUES.FALSE
  );
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: BOOLEAN_VALUES.FALSE,
    message: STRING_VALUES.EMPTY_STRING,
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
    setIsDialogueOpen(BOOLEAN_VALUES.FALSE);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      initialUpdateUserformData.name !== updateUserformData.name ||
      updateUserformData.mobilenumber !== initialUpdateUserformData.mobilenumber
    ) {
      if (updateUserformData.name != STRING_VALUES.EMPTY_STRING) {
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
          axios
            .post(POST_API.UPDATE_COMPANY_USER, postUpdateUserData, {
              withCredentials: BOOLEAN_VALUES.TRUE,
            })
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error: ApiError | any) => {
              if (error.response.headers.error === STATUS_CODE.UNATHORISED) {
                setIsDialogueOpen(BOOLEAN_VALUES.TRUE);
              } else {
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
    setMessageSnackbar({ open: BOOLEAN_VALUES.TRUE, message, type });
  };

  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: BOOLEAN_VALUES.FALSE }));
  };

  useEffect(() => {
    setMessageSnackbar((prev) => ({ ...prev, open: BOOLEAN_VALUES.FALSE }));
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 mt-16 bg-black bg-opacity-45 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn px-3 py-11">
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

            <form className="space-y-8" onSubmit={handleSubmit}>
              <FormInput
                label="Name : "
                type="text"
                name="name"
                value={updateUserformData.name}
                placeholder="Enter User Name"
                defaultValue={initialUpdateUserformData.name}
                maxLength={NUMBER_VALUES.TWO_FIFTY_SIX}
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
                readonly={BOOLEAN_VALUES.TRUE}
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
          duration={NUMBER_VALUES.SNACKBAR_DURATION}
        />
      </div>
      <DialogueBox
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(BOOLEAN_VALUES.FALSE)}
        onConfirm={handleDialogueConfirm}
        title="Session Expired !"
        message="Session Expired. Please login again."
      />
    </>
  );
}

export default EditCompanyUserModal;
