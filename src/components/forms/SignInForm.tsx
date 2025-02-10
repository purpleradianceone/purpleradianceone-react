import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import FormInput from "../ui/FormInput";
import FormCheckbox from "../ui/FormCheckbox";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Button from "../ui/Button";
import axios from "axios";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import MessageSnackBar from "../ui/MessageSnackbar";
import useRecaptcha from "../../config/hooks/useRecaptcha";
import { useAccessManagementContext } from "../../context/user/AccessManagementContext";
import POST_API from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../@types/ui/MessageSnackbarProps";
import { useFormChange } from "../../config/hooks/useFormChange";
import { useFormValidation } from "../../config/hooks/useFormValidation";
import SignInFormDataType from "../../@types/auth/forms/SignInFormDataType";
import { STRING_VALUES } from "../../constants/AppConstants";


function SignInForm() {
  const navigate = useNavigate();
  const { setLoginStatus } = useLoggedInUserContext();
  const { setAccessModules } = useAccessManagementContext();
  const sitekey = "6LcLKaYqAAAAANtiPbLxFRpgPCS9oG4aecWlA-70";
  
  const { captchaToken, handleRecaptcha, recaptchaRef } = useRecaptcha();
  const [showPassword, setShowPassword] = useState(false);

  const initialSignInFormState:SignInFormDataType = {
    email: "",
    password: "",

  };

  const { formData: loginUserCredentials, handleChange: handleSignInFormDatachange } = useFormChange(initialSignInFormState);
  const { errors, handleBlur } = useFormValidation(loginUserCredentials,"registered");

  const [spinnerAnimation, setSpinnerAnimation] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: "",
  });

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!loginUserCredentials.email || !loginUserCredentials.password) {
      if (!loginUserCredentials.email) {
        showMessageSnackbar({ message: "Email is required", type: "error" });
        return;
      }
      if (!loginUserCredentials.password) {
        showMessageSnackbar({ message: "Password is required", type: "error" });
        return;
      }
    }

    if (localStorage.getItem(LOCALSTORAGE_KEYS.REMEMBER_ME) === STRING_VALUES.TRUE) {
      localStorage.setItem(
        LOCALSTORAGE_KEYS.LOGIN_CREDENTIALS,
        JSON.stringify(loginUserCredentials)
      );
    }

    if (!captchaToken) {
      showMessageSnackbar({
        message: "Please Complete The Captcha",
        type: "error",
      });
      return;
    }

    setSpinnerAnimation({
      status: "loading",
      message: "Logging In",
    });

    const captchaRequest = { token: captchaToken };

    axios
      .post(POST_API.VERIFIY_CAPTCHA, captchaRequest)
      .then((response) => {
        if (response.data.status) {
          const user = {
            email: loginUserCredentials.email,
            password: loginUserCredentials.password,
          };
          
          axios
            .post(POST_API.SIGN_IN, user, { withCredentials: true })
            .then((response) => {
              if (response.data.status) {
                setLoginStatus({
                  id: response.data.id,
                  companyId: response.data.company_id,
                  companyName: response.data.company_name,
                  fullName: response.data.fullName,
                  email: response.data.email,
                  mobileNumber: response.data.mobilenumber,
                  message: response.data.message,
                  token: response.data.token,
                  status: response.data.status,
                  createdOn: response.data.createdon,
                });

                if (response.data) {
                  const getCrmModuleAccessData = {
                    company_id: response.data.company_id,
                    company_user_id: response.data.id,
                    requestedby: response.data.id,
                  };

                  axios
                    .post(POST_API.GET_CRM_MODULE_ACCESS, getCrmModuleAccessData)
                    .then((response) => {
                      setAccessModules(response.data);
                      setSpinnerAnimation({
                        status: "success",
                        message: "Logged In",
                      });
                      showMessageSnackbar({
                        message: "Login successful!",
                        type: "success",
                      });

                      setTimeout(() => {
                        try {
                          navigate(ROUTES_URL.HOME);
                        } catch (error) {
                          console.error("Error during navigation:", error);
                        }
                      }, 1000);
                    })
                    .catch((error) => {
                      console.error(error);
                      setSpinnerAnimation({
                        status: "idle",
                        message: "",
                      });
                    });
                }
              } else {
                showMessageSnackbar({
                  message: "Wrong email and Password!",
                  type: "error",
                });
                setSpinnerAnimation({
                  status: "idle",
                  message: "",
                });
                setLoginStatus({
                  companyId: 0,
                  companyName: "",
                  createdOn: "",
                  email: "",
                  fullName: "",
                  id: 0,
                  message: "",
                  mobileNumber: "",
                  status: false,
                  token: "",
                });
              }
            })
            .catch((error) => {
              console.log(error);
              showMessageSnackbar({
                message: "Something Went Wrong!",
                type: "error",
              });
              setSpinnerAnimation({
                status: "idle",
                message: "",
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);
        showMessageSnackbar({ message: "Captcha Invalid", type: "error" });
        setSpinnerAnimation({
          status: "idle",
          message: "",
        });
      });
  };

  const handleRememberMeCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      localStorage.setItem(LOCALSTORAGE_KEYS.REMEMBER_ME, STRING_VALUES.TRUE);
    } else {
      localStorage.removeItem(LOCALSTORAGE_KEYS.REMEMBER_ME);
    }
  };

  return (
    <>
      <form className="space-y-5">
        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={loginUserCredentials.email}
          onChange={handleSignInFormDatachange}
          onBlur={handleBlur}
          error={errors.email}
        />
        <FormInput
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          value={loginUserCredentials.password}
          onChange={handleSignInFormDatachange}
          onBlur={handleBlur}
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

        <div className="flex items-center justify-between">
          <FormCheckbox
            label="Remember me"
            name="remember"
            onChange={handleRememberMeCheckBoxChange}
          />
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <Link to={ROUTES_URL.FORGOT_PASSWORD}>Forgot Password?</Link>
          </button>
        </div>

        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={sitekey}
          onChange={handleRecaptcha}
        />

        <Button
          type="submit"
          onClick={handleLoginSubmit}
          spinner={spinnerAnimation}
        >
          Log In
        </Button>

        <div className="text-center">
          <span className="text-gray-600 text-sm">
            Don't have an account yet?{" "}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              <Link to={ROUTES_URL.SIGN_UP}>Sign Up</Link>
            </button>
          </span>
        </div>
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

export default SignInForm;