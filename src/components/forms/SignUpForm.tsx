import React, { useState } from "react";
import SignUpFormDataType from "../../@types/auth/forms/SignUpFormDataType";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import EmailSentAnimation from "../../assets/animations/EmailSentAnimation";
import MessageSnackBar from "../ui/MessageSnackbar";
import POST_API from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
import { useFormChange } from "../../config/hooks/useFormChange";
import { useFormValidation } from "../../config/hooks/useFormValidation";
import {
  NUMBER_VALUES,
  SITE_KEY,
} from "../../constants/AppConstants";
import useRecaptcha from "../../config/hooks/useRecaptcha";
import MESSAGE from "../../constants/Messages";
import PasswordVisibilityToggle from "../ui/PasswordVisibilityToggle";
import REGEX from "../../constants/Regex";

function SignUpForm() {
  const initialSignUpFormState: SignUpFormDataType = {
    name: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const { formData: SignUpFormData, handleChange: handleSignUpFormDataChange } =
    useFormChange(initialSignUpFormState);
  const { errors, handleBlur } = useFormValidation(
    SignUpFormData,
    "registration"
  );

  const [showEmailSentAnimation, setShowEmailSentAnimation] = useState<boolean>(
    false
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(
    false
  );

  const { captchaToken, handleRecaptcha, recaptchaRef } = useRecaptcha();

  const [messageSnackbar, setMessageSnackbar] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });

  const showMessageSnackbar = (message: string, type: "success" | "error") => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSignUpFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     const mobileRegex = REGEX.MOBILE_NUMBER_NEW;
        if(SignUpFormData.mobileNumber!.trim() !== ""){
         if (!mobileRegex.test(SignUpFormData.mobileNumber!.trim())) {
          showMessageSnackbar("Invalid mobile number","error");
          return;
        }
     }
    const signupDataPost = {
      fullname: SignUpFormData.name?.trim(),
      mobilenumber: SignUpFormData.mobileNumber?.trim(),
      email: SignUpFormData.email.trim(),
      captcha_token : captchaToken,
      password: SignUpFormData.password.trim(),
    };

    if (
      signupDataPost.email !== "" &&
      signupDataPost.password !== "" &&
      SignUpFormData.confirmPassword !== "" &&
      errors.email === "" &&
      errors.password === "" &&
      errors.confirmPassword === "" &&
      errors.mobileNumber === ""
    ) {
      if (captchaToken !== "") {
        
              axios
                .post(POST_API.SIGN_UP, signupDataPost, {
                  withCredentials: true,
                })
                .then((respone) => {

                  if (respone.data.status) {
                    if (
                      respone.data.message ==
                      MESSAGE.SUCCESS.ACCOUNT_ALREADY_REGISTERED
                    ) {
                      showMessageSnackbar(respone.data.message, "error");
                    } else {
                      showMessageSnackbar(respone.data.message, "success");
                      setShowEmailSentAnimation(!showEmailSentAnimation);
                    }
                    setTimeout(() => {
                      window.location.href = ROUTES_URL.SIGN_IN;
                    }, 5000);
                  } else {
                    showMessageSnackbar(respone.data.message, "error");
                  }
                })
                .catch((error) => {
                  console.log(error);
                  recaptchaRef.current!.reset();
                });
          
      } else {
        showMessageSnackbar(MESSAGE.ERROR.COMPLETE_CAPTCHA, "error");
      }
    } else {
      showMessageSnackbar(MESSAGE.ERROR.REQUIRED_FIELDS, "error");
    }
  };

  return (
    <>
      <form className="space-y-5">
        <FormInput
          label="Full Name"
          type="text"
          name="name"
          required={true}
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
          required={true}
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
          maxLength={15}
          required
          error={errors.password}
          rightElement={
            <PasswordVisibilityToggle
              setShowPassword={setShowPassword}
              showPassword={showPassword}
            />
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
            <PasswordVisibilityToggle
              setShowPassword={setConfirmPassword}
              showPassword={showConfirmPassword}
            />
          }
        />
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={SITE_KEY}
          onChange={handleRecaptcha}
        />
        <Button type="submit" onClick={handleSignUpFormSubmit}>
          Sign Up
        </Button>
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
            <h2 className="text-lg font-semibold text-center">
              Please Check Your Email
            </h2>
            <EmailSentAnimation />
          </div>
        </div>
      )}

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

export default SignUpForm;
