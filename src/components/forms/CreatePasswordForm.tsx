import React, { useState, useRef, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
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
import KEYS from "../../constants/Keys";
import { NUMBER_VALUES } from "../../constants/AppConstants";

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
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success",
  });

  const navigate = useNavigate();
  // Create refs for OTP inputs
  const otpRef1 = useRef<HTMLInputElement>(null);
  const otpRef2 = useRef<HTMLInputElement>(null);
  const otpRef3 = useRef<HTMLInputElement>(null);
  const otpRef4 = useRef<HTMLInputElement>(null);
  const otpRef5 = useRef<HTMLInputElement>(null);
  const otpRef6 = useRef<HTMLInputElement>(null);

  const otpRefs = [otpRef1, otpRef2, otpRef3, otpRef4, otpRef5, otpRef6];

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...createPasswordFormData.otp];
    newOtp[index] = value;
    setCreatePasswordFormData((prev) => ({ ...prev, otp: newOtp }));

    // Clear OTP error if exists
    if (createPasswordFormError.otp) {
      setCreatePasswordFormError((prev) => ({ ...prev, otp: undefined }));
    }

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (
      e.key === KEYS.BACKSPACE &&
      !createPasswordFormData.otp[index] &&
      index > 0
    ) {
      otpRefs[index - 1].current?.focus();
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
    if (createPasswordFormData.otp.some((digit) => !digit)) {
      newErrors.otp = "Please enter the complete OTP";
    }

    // Validate Password
    if (!createPasswordFormData.newPassword) {
      newErrors.password = "Please enter a new password";
    } else if (createPasswordFormData.newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (
      createPasswordFormData.newPassword !==
      createPasswordFormData.confirmPassword
    ) {
      newErrors.password = "Passwords do not match";
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
      })
      .then((response) => {
        if (response.data.status) {
          console.log("inside if");
          setIsSubmitting(true);
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
          setIsSubmitting(false);
        }
      });
  };

  return (
    <>
      <form onSubmit={handleCreatePasswordSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your OTP :
          </label>
          <div className="flex gap-2 justify-between">
            {createPasswordFormData.otp.map((digit, index) => (
              <input
                key={index}
                ref={otpRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className={`w-12 h-12 text-center border-2 rounded-lg text-lg font-semibold
                    ${
                      createPasswordFormError.otp
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    } focus:ring-4 outline-none transition-all`}
              />
            ))}
          </div>
          {createPasswordFormError.otp && (
            <p className="mt-1 text-sm text-red-500">
              {createPasswordFormError.otp}
            </p>
          )}
        </div>
        <FormInput
          type={showPassword ? "text" : "password"}
          label="Enter new password :"
          placeholder="Confirm password"
          value={createPasswordFormData.newPassword}
          name="newPassword"
          onChange={handlePasswordChange}
          minLength={8}
          maxLength={20}
          required
          error={createPasswordFormError.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
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
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-500"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
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
        duration={2000}
      />
    </>
  );
}

export default CreatePasswordForm;
