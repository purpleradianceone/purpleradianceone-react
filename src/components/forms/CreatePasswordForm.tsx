import React, { useState, FormEvent } from "react";
import axios from "axios";
import MessageSnackBar from "../ui/MessageSnackbar";
import { useNavigate } from "react-router-dom";
import {
  CreatePasswordFormData,
  CreatePasswordFormErrors,
} from "../../@types/forms/CreatePasswordFormTypes";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import POST_API from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../@types/ui/MessageSnackbarProps";
import { BOOLEAN_VALUES, DATA_TYPE, NUMBER_VALUES, STRING_VALUES } from "../../constants/AppConstants";
import MESSAGE from "../../constants/Messages";
import PasswordVisibilityToggle from "../ui/PasswordVisibilityToggle";
import { OTPInput } from "../ui/OtpInput";

function CreatePasswordForm() {
  const [createPasswordFormData, setCreatePasswordFormData] =
    useState<CreatePasswordFormData>({
      otp: Array(6).fill(""),
      newPassword: STRING_VALUES.EMPTY_STRING,
      confirmPassword: STRING_VALUES.EMPTY_STRING,
    });
  const [createPasswordFormError, setCreatePasswordFormError] =
    useState<CreatePasswordFormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(BOOLEAN_VALUES.FALSE);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(BOOLEAN_VALUES.FALSE);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(BOOLEAN_VALUES.FALSE);
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: BOOLEAN_VALUES.FALSE,
    message: STRING_VALUES.EMPTY_STRING,
    type: "success",
  });

  const navigate = useNavigate();

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: BOOLEAN_VALUES.TRUE, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: BOOLEAN_VALUES.FALSE }));
  };

  const handleOtpChange = (newOtp: string[]) => {
    setCreatePasswordFormData((prev) => ({ ...prev, otp: newOtp }));
    console.log(createPasswordFormData.otp);
    if(createPasswordFormError.otp){
      setCreatePasswordFormError((prev) => ({...prev,otp:DATA_TYPE.UNDEFINED}))
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreatePasswordFormData((prev) => ({ ...prev, [name]: value }));
    console.log(e.target.value)
    // Clear password error if exists
    if (createPasswordFormError.password) {
      setCreatePasswordFormError((prev) => ({ ...prev, password: undefined }));
    }
  };

  const validateCreatePasswordForm = (): boolean => {
    const newErrors: CreatePasswordFormErrors = {};

    // Validate OTP
    if(createPasswordFormData.otp.length !== 6){
        newErrors.otp = MESSAGE.ERROR.ENTER_COMPLETE_OTP;
    }

    // Validate Password
    if (!createPasswordFormData.newPassword) {
      newErrors.password = MESSAGE.ERROR.ENTER_NEW_PAWSSWORD;
    } else if (createPasswordFormData.newPassword.length < NUMBER_VALUES.EIGHT) {
      newErrors.password = MESSAGE.ERROR.EIGHT_CHARACTER_PASSWORD;
    } else if (
      createPasswordFormData.newPassword !==
      createPasswordFormData.confirmPassword
    ) {
      newErrors.password = MESSAGE.ERROR.PASSWORD_NOT_MATCH;
    }

    setCreatePasswordFormError(newErrors);
    return Object.keys(newErrors).length === NUMBER_VALUES.ZERO;
  };

  const handleCreatePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateCreatePasswordForm()) {
      return;
    }

    const otpData = createPasswordFormData.otp.join("");

    axios
      .post(POST_API.CREATE_FORGOT_PASSWORD, {
        otp: otpData,
        password: createPasswordFormData.newPassword,
        email: localStorage.getItem(LOCALSTORAGE_KEYS.FORGOT_PASSWORD_EMAIL),
      },{
        withCredentials : BOOLEAN_VALUES.TRUE
      })
      .then((response) => {
        if (response.data.status) {
          setIsSubmitting(BOOLEAN_VALUES.TRUE);
          console.log(response);

          localStorage.removeItem(LOCALSTORAGE_KEYS.FORGOT_PASSWORD_EMAIL);
          showMessageSnackbar({
            message: response.data.message,
            type: "success",
          });

          setTimeout(() => {
            navigate(ROUTES_URL.SIGN_IN);
          }, 5000);
        } else {
          showMessageSnackbar({
            message: response.data.message,
            type: "error",
          });
          setIsSubmitting(BOOLEAN_VALUES.FALSE);
        }
      });
  };

  return (
    <>
      <form onSubmit={handleCreatePasswordSubmit} className="space-y-6">
      <OTPInput
          length={6}
          value={createPasswordFormData.otp}
          onChange={handleOtpChange}
          error={createPasswordFormError.otp}
          autoFocus
        />
        <FormInput
          type={showPassword ? "text" : "password"}
          label="Enter new password :"
          placeholder="New password"
          value={createPasswordFormData.newPassword}
          name="newPassword"
          onChange={handlePasswordChange}
          minLength={8}
          maxLength={20}
          required
          error={createPasswordFormError.password}
          rightElement={
            <PasswordVisibilityToggle
            setShowPassword={setShowPassword}
            showPassword = {showPassword}
            />
          }
        />

        <FormInput
          type={showConfirmPassword ? "text" : "password"}
          label="Re-enter new password :"
          placeholder="Confirm password"
          value={createPasswordFormData.confirmPassword}
          name="confirmPassword"
          onChange={handlePasswordChange}
          minLength={8}
          maxLength={20}
          required
          error={createPasswordFormError.password}
          rightElement={
            <PasswordVisibilityToggle
            setShowPassword={setShowConfirmPassword}
            showPassword = {showConfirmPassword}
            />
          }
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Password..." : "Create Password"}
        </Button>
      </form>

      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleMessageSnackbarClose}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </>
  );
}

export default CreatePasswordForm;
