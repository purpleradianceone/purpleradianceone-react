import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import MessageSnackBar from "../ui/MessageSnackbar";
import { useNavigate } from "react-router-dom";
import { CreatePasswordFormData, CreatePasswordFormErrors } from "../../@types/forms/CreatePasswordFormTypes";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import  POST_API  from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
export function CreatePasswordForm() {
  const [createPasswordFormData, setCreatePasswordFormData] = useState<CreatePasswordFormData>({
    otp: Array(6).fill(""),
    newPassword: "",
    confirmPassword: "",
  });
  const [createPasswordFormError, setCreatePasswordFormError] = useState<CreatePasswordFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  // Create refs for OTP inputs
  const otpRef1 = useRef<HTMLInputElement>(null);
  const otpRef2 = useRef<HTMLInputElement>(null);
  const otpRef3 = useRef<HTMLInputElement>(null);
  const otpRef4 = useRef<HTMLInputElement>(null);
  const otpRef5 = useRef<HTMLInputElement>(null);
  const otpRef6 = useRef<HTMLInputElement>(null);

  const otpRefs = [otpRef1, otpRef2, otpRef3, otpRef4, otpRef5, otpRef6];

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ open: true, message, type });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
    if (e.key === "Backspace" && !createPasswordFormData.otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    if (createPasswordFormData.otp.some((digit) => !digit)) {
      newErrors.otp = "Please enter the complete OTP";
    }

    // Validate Password
    if (!createPasswordFormData.newPassword) {
      newErrors.password = "Please enter a new password";
    } else if (createPasswordFormData.newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (createPasswordFormData.newPassword !== createPasswordFormData.confirmPassword) {
      newErrors.password = "Passwords do not match";
    }

    setCreatePasswordFormError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateCreatePasswordForm()) {
      return;
    }

   
    const otpData = createPasswordFormData.otp.join("");

    axios
      .post(POST_API.CREATE_FORGOT_PASSWORD, {
        otp: otpData,
        login_password: createPasswordFormData.newPassword,
        email: localStorage.getItem(LOCALSTORAGE_KEYS.FORGOT_PASSWORD_EMAIL),
      })
      .then((response) => {
        if (response.data[0].status) {
          console.log("inside if");
          setIsSubmitting(true);
          console.log(response);

          localStorage.removeItem(LOCALSTORAGE_KEYS.FORGOT_PASSWORD_EMAIL);
          showSnackbar(response.data[0].message, "success");
          
          setTimeout(() => {
            navigate(ROUTES_URL.SIGN_IN);
          }, 5000);
        }else{
          showSnackbar(response.data[0].message, 'error');
          setIsSubmitting(false)
        }
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            <p className="mt-1 text-sm text-red-500">{createPasswordFormError.otp}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter new password :
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={createPasswordFormData.newPassword}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-2 border-2 rounded-lg pr-10
                  ${
                    createPasswordFormError.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  } focus:ring-4 outline-none transition-all`}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Re-enter new password : 
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={createPasswordFormData.confirmPassword}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-2 border-2 rounded-lg pr-10
                  ${
                    createPasswordFormError.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  } focus:ring-4 outline-none transition-all`}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {createPasswordFormError.password && (
            <p className="mt-1 text-sm text-red-500">{createPasswordFormError.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg
              ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-700"
              } transition-colors`}
        >
          {isSubmitting ? "Creating Password..." : "Create Password"}
        </button>
      </form>

      <MessageSnackBar
        isOpen={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={handleSnackbarClose}
        duration={2000}
      />
    </>
  );
}

export default CreatePasswordForm;
