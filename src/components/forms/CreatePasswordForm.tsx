import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import MessageSnackBar from "../ui/MessageSnackbar";
import { useNavigate } from "react-router-dom";

interface FormData {
  otp: string[];
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  otp?: string;
  password?: string;
}

export function CreatePasswordForm() {
  const [formData, setFormData] = useState<FormData>({
    otp: Array(6).fill(""),
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
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

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData((prev) => ({ ...prev, otp: newOtp }));

    // Clear OTP error if exists
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: undefined }));
    }

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear password error if exists
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate OTP
    if (formData.otp.some((digit) => !digit)) {
      newErrors.otp = "Please enter the complete OTP";
    }

    // Validate Password
    if (!formData.newPassword) {
      newErrors.password = "Please enter a new password";
    } else if (formData.newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

   
    const otpData = formData.otp.join("");
    console.log(otpData);

    axios
      .post("/api/authentication/purple-crm-api/forgotpassword/verifyotp", {
        otp: otpData,
        login_password: formData.newPassword,
        email: localStorage.getItem("forgetPasswordEmail"),
      })
      .then((response) => {
        if (response.data[0].status) {
          console.log("inside if");
          setIsSubmitting(true);
          console.log(response);

          localStorage.removeItem("forgetPasswordEmail");
          showSnackbar(response.data[0].message, "success");
          
          setTimeout(() => {
            navigate("/signin");
          }, 5000);
        }else{
          showSnackbar(response.data[0].message, 'error');
          setIsSubmitting(false)
        }
      });

    // showSnackbar("Failed to update password. Please try again.", "error");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your OTP below:
          </label>
          <div className="flex gap-2 justify-between">
            {formData.otp.map((digit, index) => (
              <input
                key={index}
                ref={otpRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center border-2 rounded-lg text-lg font-semibold
                    ${
                      errors.otp
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    } focus:ring-4 outline-none transition-all`}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="mt-1 text-sm text-red-500">{errors.otp}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-2 border-2 rounded-lg pr-10
                  ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  } focus:ring-4 outline-none transition-all`}
              placeholder="Enter your new password"
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
            Confirm new Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-2 border-2 rounded-lg pr-10
                  ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  } focus:ring-4 outline-none transition-all`}
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
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
        onClose={handleClose}
        duration={2000}
      />
    </>
  );
}

export default CreatePasswordForm;
