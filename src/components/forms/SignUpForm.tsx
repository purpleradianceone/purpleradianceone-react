import React, { useState } from "react";
import SignUpFormDataType from "../../@types/auth/forms/SignUpFormDataType";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import EmailSentAnimation from "../../assets/animations/EmailSentAnimation";
import MessageSnackBar from "../ui/MessageSnackbar";
import POST_API from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
import { useFormChange } from "../../config/hooks/useFormChange";
import { useFormValidation } from "../../config/hooks/useFormValidation";
import { STRING_VALUES } from "../../constants/AppConstants";

function SignUpForm() {
  const initialSignUpFormState: SignUpFormDataType = {
    name: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const { formData: SignUpFormData, handleChange : handleSignUpFormDataChange } = useFormChange(initialSignUpFormState);
  const { errors, handleBlur } = useFormValidation(SignUpFormData,"registration");

  const [showEmailSentAnimation, setShowEmailSentAnimation] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);

  const onChange = (value: string | null) => {
    setCaptchaToken(value);
  };

  const [messageSnackbar, setMessageSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: "",
    type: "success",
  });

  const showMessageSnackbar = (message: string, type: 'success' | 'error') => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const signupDataPost = {
      fullname: SignUpFormData.name?.trim(),
      mobilenumber: SignUpFormData.mobileNumber?.trim(),
      email: SignUpFormData.email.trim(),
      password: SignUpFormData.password.trim()
    };

    if (signupDataPost.email !== STRING_VALUES.EMPTY_STRING && signupDataPost.password ! == STRING_VALUES.EMPTY_STRING && SignUpFormData.confirmPassword ! == STRING_VALUES.EMPTY_STRING) {
      if (captchaToken !== STRING_VALUES.EMPTY_STRING) {
        const captchaRequest = {
          token: captchaToken
        };
        axios.post(POST_API.VERIFIY_CAPTCHA, captchaRequest)
          .then(response => {
            if (response.data.status) {
              axios.post(POST_API.SIGN_UP, signupDataPost)
                .then(respone => {
                  console.log(respone);

                  if (respone.data.status === true) {
                    console.log(respone.data.message);
                    if (respone.data.message == "Your email is already verified. You can now log in and start using your account.") {
                      showMessageSnackbar(respone.data.message, 'error');
                    } else {
                      showMessageSnackbar(respone.data.message, 'success');
                      setShowEmailSentAnimation(!showEmailSentAnimation);
                    }
                    setTimeout(() => {
                      window.location.href = ROUTES_URL.SIGN_IN;
                    }, 5000);
                  } else {
                    showMessageSnackbar(respone.data.message, 'error');
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
          })
          .catch(error => {
            console.log(error);
            showMessageSnackbar("Invalid Captcha", "error");
          });
      } else {
        showMessageSnackbar("Please complete the captcha", "error");
      }
    } else {
      showMessageSnackbar('Fill required fields', 'error');
    }
  };

  return (
    <>
      <form className="space-y-5">
        <FormInput
          label="Full Name"
          type="text"
          name="name"
          placeholder="Enter full name"
          value={SignUpFormData.name}
          onChange={handleSignUpFormDataChange}
          maxLength={100}
        />
        <FormInput
          label="Mobile Number"
          type="text"
          name="mobileNumber"
          placeholder="99xxxxxxxx"
          value={SignUpFormData.mobileNumber}
          onChange={handleSignUpFormDataChange}
          maxLength={15}
          onBlur={handleBlur}
          error={errors.mobileNumber}
        />
        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={SignUpFormData.email}
          onChange={handleSignUpFormDataChange}
          onBlur={handleBlur}
          error={errors.email}
        />
        <FormInput
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter password"
          value={SignUpFormData.password}
          onChange={handleSignUpFormDataChange}
          onBlur={handleBlur}
          minLength={8}
          maxLength={20}
          required
          error={errors.password}
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
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm password"
          value={SignUpFormData.confirmPassword}
          onChange={handleSignUpFormDataChange}
          onBlur={handleBlur}
          minLength={8}
          maxLength={20}
          required
          error={errors.confirmPassword}
          rightElement={
            <button
              type="button"
              onClick={() => setConfirmPassword(!showConfirmPassword)}
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
        <ReCAPTCHA
          sitekey="6LcLKaYqAAAAANtiPbLxFRpgPCS9oG4aecWlA-70"
          onChange={onChange}
        />
        <Button type="submit" onClick={handleSubmit}>Sign Up</Button>
        <div className="text-center">
          <span className="text-gray-600 text-sm">
            Already Have an account?{" "}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              <Link to={ROUTES_URL.SIGN_IN}>Log In</Link>
            </button>
          </span>
        </div>
      </form>

      {showEmailSentAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95">
          <div className="bg-white p-6 h-auto w-auto rounded-2xl shadow-lg animate-fade-in">
            <button></button>
            <h2 className="text-lg font-semibold text-center">Please Check Your Email</h2>
            <EmailSentAnimation />
          </div>
        </div>
      )}

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

export default SignUpForm;