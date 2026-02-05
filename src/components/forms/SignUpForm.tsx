import React, { useEffect, useState } from "react";
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
  VALIDATIONS,
} from "../../constants/AppConstants";
import useRecaptcha from "../../config/hooks/useRecaptcha";
import MESSAGE from "../../constants/Messages";
import PasswordVisibilityToggle from "../ui/PasswordVisibilityToggle";
import REGEX from "../../constants/Regex";
import { useCountries } from "../../config/hooks/useCountries";
import CustomDropdown from "../modals/leads/CustomDropdown";
import { useGeoLocationData } from "../../config/hooks/useGeoLocation";
import toast from "react-hot-toast";
import { Globe, KeySquare, Mail, Phone, User } from "lucide-react";
import { AppVersionViewCard } from "../views/card/AppVersionViewCard";

function SignUpForm() {
  const initialSignUpFormState: SignUpFormDataType = {
    name: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const { countries } = useCountries();
  const { countryName } = useGeoLocationData({
    countryList: countries,
  });

  const { formData: SignUpFormData, handleChange: handleSignUpFormDataChange } =
    useFormChange(initialSignUpFormState);
  const { errors, handleBlur } = useFormValidation(
    SignUpFormData,
    "registration"
  );

  const [showEmailSentAnimation, setShowEmailSentAnimation] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);

  const [countryId, setCountryId] = useState<number>(52);
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
    if (
      errors.email !== "" ||
      errors.password !== "" ||
      errors.confirmPassword !== "" ||
      errors.name !== ""
    ) {
      if (errors.email !== "") {
        toast.error(errors.email ?? "email is required");
      }
      if (errors.password !== "") {
        toast.error(errors.password! ?? "Password is required");
      }
      if (errors.confirmPassword !== "") {
        toast.error(errors.confirmPassword! ?? "Confirm Password is required.");
      }
      if (errors.name !== "") {
        toast.error(errors.name! ?? "name is required");
      }
      return;
    }
    if (SignUpFormData.password !== SignUpFormData.confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
      return;
    }
    const mobileRegex = REGEX.MOBILE_NUMBER;
    if (SignUpFormData.mobileNumber!.trim() !== "") {
      if (!mobileRegex.test(SignUpFormData.mobileNumber!.trim())) {
        showMessageSnackbar("Invalid mobile number", "error");
        return;
      }
    }

    const signupDataPost = {
      fullname: SignUpFormData.name?.trim(),
      mobilenumber: SignUpFormData.mobileNumber?.trim(),
      email: SignUpFormData.email.trim(),
      country_id: countryId,
      captcha_token: captchaToken,
      password: SignUpFormData.password.trim(),
    };
    console.log(signupDataPost);

    if (
      signupDataPost.email !== "" &&
      signupDataPost.password !== "" &&
      SignUpFormData.confirmPassword !== ""
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

  useEffect(() => {
    const country = countries.find((country) => country.name === countryName);
    const id = country ? country.id : 52;
    if (id) {
      setCountryId(id);
    }
  }, [countryName]);

  return (
    <>
      <form className="space-y-3" onSubmit={handleSignUpFormSubmit}>
        <FormInput
        logo={User}
          label="Full Name"
          type="text"
          name="name"
          required={true}
          placeholder="Enter full name"
          value={SignUpFormData.name}
          onChange={handleSignUpFormDataChange}
          maxLength={VALIDATIONS.MAX_NAME_LENGTH}
          minLength={VALIDATIONS.MIN_NAME_LENGTH}
          onBlur={handleBlur}
          error={errors.name}
        />
        <FormInput
        logo={Phone}
          label="Mobile Number"
          type="text"
          name="mobileNumber"
          placeholder="99xxxxxxxx"
          value={SignUpFormData.mobileNumber}
          onChange={handleSignUpFormDataChange}
          maxLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
          minLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
          onBlur={handleBlur}
          error={errors.mobileNumber}
        />
        <FormInput
        logo={Mail}
          label="Email"
          type="email"
          name="email"
          required={true}
          placeholder="Enter your email"
          maxLength={VALIDATIONS.MAX_NAME_LENGTH}
          minLength={VALIDATIONS.MIN_EMAIL_LENGTH}
          value={SignUpFormData.email}
          onChange={handleSignUpFormDataChange}
          onBlur={handleBlur}
          error={errors.email}
        />

        <CustomDropdown
        logo={Globe}
          requiredRedDot={true}
          labelName="Country"
          onSelect={(selectedValue) => {
            if (selectedValue) {
              setCountryId(selectedValue);
            }
          }}
          options={countries}
          selectedValue={countryId}
        />
        <FormInput
        logo={KeySquare}
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter password"
          value={SignUpFormData.password}
          onChange={handleSignUpFormDataChange}
          onBlur={handleBlur}
          minLength={VALIDATIONS.MIN_PASSWORD_LENGTH}
          maxLength={VALIDATIONS.MAX_PASSWORD_LENGTH}
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
        logo={KeySquare}
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm password"
          value={SignUpFormData.confirmPassword}
          onChange={handleSignUpFormDataChange}
          onBlur={handleBlur}
          minLength={VALIDATIONS.MIN_PASSWORD_LENGTH}
          maxLength={VALIDATIONS.MAX_PASSWORD_LENGTH}
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
        <Button type="submit"
        //  onClick={}
         >
          Sign Up
        </Button>
        <div className="text-center">
          <span className="caption-custom">
            Already Have an account?{" "}
            <button
              type="button"
              className="caption-custom-blue hover:text-blue-700"
            >
              <Link to={ROUTES_URL.SIGN_IN}>Log In</Link>
            </button>
          </span>

          <AppVersionViewCard/>
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
