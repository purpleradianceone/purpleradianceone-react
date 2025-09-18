import React, { useState, FormEvent } from "react";
import axios from "axios";
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
import { DATA_TYPE,  VALIDATIONS, } from "../../constants/AppConstants";
import MESSAGE from "../../constants/Messages";
import PasswordVisibilityToggle from "../ui/PasswordVisibilityToggle";
import { OTPInput } from "../ui/OtpInput";
import REGEX from "../../constants/Regex";
import toast from "react-hot-toast";
import { KeySquare } from "lucide-react";

function CreatePasswordForm() {
  const [createPasswordFormData, setCreatePasswordFormData] =
    useState<CreatePasswordFormData>({
      otp: Array(6).fill(""),
      newPassword: "",
      confirmPassword: "",
    });
  const [createPasswordFormError, setCreatePasswordFormError] =
    useState<CreatePasswordFormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleOtpChange = (newOtp: string[]) => {
    setCreatePasswordFormData((prev) => ({ ...prev, otp: newOtp }));
    if(createPasswordFormError.otp){
      setCreatePasswordFormError((prev) => ({...prev,otp:DATA_TYPE.UNDEFINED}))
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreatePasswordFormData((prev) => ({ ...prev, [name]: value }));
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
    } else if (createPasswordFormData.newPassword.length < 8) {
      newErrors.password = MESSAGE.ERROR.EIGHT_CHARACTER_PASSWORD;
    } else if (
      createPasswordFormData.newPassword !==
      createPasswordFormData.confirmPassword
    ) {
      newErrors.password = MESSAGE.ERROR.PASSWORD_NOT_MATCH;
    }else if (!REGEX.PASSWORD.test(createPasswordFormData.newPassword) ){  
          
      newErrors.password = MESSAGE.ERROR.PASSWORD_VALIDATION_ERROR;
    }else if (!REGEX.PASSWORD.test(createPasswordFormData.confirmPassword) ){
      newErrors.password = MESSAGE.ERROR.PASSWORD_VALIDATION_ERROR;
    }

    setCreatePasswordFormError(newErrors);
    return Object.keys(newErrors).length === 0;
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
        withCredentials : true
      })
      .then((response) => {
        if (response.data.status) {
          setIsSubmitting(true);

          localStorage.removeItem(LOCALSTORAGE_KEYS.FORGOT_PASSWORD_EMAIL);
          toast.success(response.data.message);

          setTimeout(() => {
            navigate(ROUTES_URL.SIGN_IN);
          }, 3000);
        } else {
          toast.error(response.data.message);
          setIsSubmitting(false);
        }
      });
  };

  return (
    <>
      <form onSubmit={handleCreatePasswordSubmit} className="space-y-6">
      <OTPInput
         required={true}
          length={6}
          value={createPasswordFormData.otp}
          onChange={handleOtpChange}
          error={createPasswordFormError.otp}
          autoFocus
        />
        <FormInput
          logo={KeySquare}
          type={showPassword ? "text" : "password"}
          label="Enter new password"
          placeholder="New password"
          value={createPasswordFormData.newPassword}
          name="newPassword"
          onChange={handlePasswordChange}
          minLength={VALIDATIONS.MIN_PASSWORD_LENGTH}
          maxLength={VALIDATIONS.MAX_PASSWORD_LENGTH}
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
        logo={KeySquare}
          type={showConfirmPassword ? "text" : "password"}
          label="Re-enter new password"
          placeholder="Confirm password"
          value={createPasswordFormData.confirmPassword}
          name="confirmPassword"
          onChange={handlePasswordChange}
          minLength={VALIDATIONS.MIN_PASSWORD_LENGTH}
          maxLength={VALIDATIONS.MAX_PASSWORD_LENGTH}
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
    </>
  );
}

export default CreatePasswordForm;
