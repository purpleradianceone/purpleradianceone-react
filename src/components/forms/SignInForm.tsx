import React, { useState } from "react";
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
import { BOOLEAN_VALUES, NUMBER_VALUES, SITE_KEY, STRING_VALUES } from "../../constants/AppConstants";
import PasswordVisibilityToggle from "../ui/PasswordVisibilityToggle";
import MESSAGE from "../../constants/Messages";


function SignInForm() {
  const navigate = useNavigate();
  const { setLoginStatus } = useLoggedInUserContext();
  const { setAccessModules } = useAccessManagementContext();

  
  const { captchaToken, handleRecaptcha, recaptchaRef } = useRecaptcha();
  const [showPassword, setShowPassword] = useState(BOOLEAN_VALUES.FALSE);

  const initialSignInFormState:SignInFormDataType = {
    email: STRING_VALUES.EMPTY_STRING,
    password: STRING_VALUES.EMPTY_STRING,

  };

  const { formData: loginUserCredentials, handleChange: handleSignInFormDatachange } = useFormChange(initialSignInFormState);
  const { errors, handleBlur } = useFormValidation(loginUserCredentials,"registered");

  const [spinnerAnimation, setSpinnerAnimation] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: STRING_VALUES.EMPTY_STRING,
  });

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: BOOLEAN_VALUES.FALSE,
    message: STRING_VALUES.EMPTY_STRING,
    type: "success",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: BOOLEAN_VALUES.TRUE, message, type });
  };

  const handleMessageSnackbarClose = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: BOOLEAN_VALUES.FALSE }));
  };

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!loginUserCredentials.email || !loginUserCredentials.password) {
      if (!loginUserCredentials.email) {
        showMessageSnackbar({ message: MESSAGE.ERROR.EMAIL_REQUIRED, type: "error" });
        return;
      }
      if (!loginUserCredentials.password) {
        showMessageSnackbar({ message: MESSAGE.ERROR.PASSWORD_REQUIRED, type: "error" });
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
        message: MESSAGE.ERROR.COMPLETE_CAPTCHA,
        type: "error",
      });
      return;
    }

    setSpinnerAnimation({
      status: "loading",
      message: MESSAGE.INPROCESS.LOGGING_IN,
    });

    const captchaRequest = { token: captchaToken };

    axios
      .post(POST_API.VERIFIY_CAPTCHA, captchaRequest,{
        withCredentials : BOOLEAN_VALUES.TRUE
      })
      .then((response) => {
        if (response) {
          const user = {
            email: loginUserCredentials.email,
            password: loginUserCredentials.password,
          };
          
          axios
            .post(POST_API.SIGN_IN, user, { withCredentials: BOOLEAN_VALUES.TRUE })
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
                    device_type : STRING_VALUES.EMPTY_STRING
                  };

                  axios
                    .post(POST_API.GET_CRM_MODULE_ACCESS, getCrmModuleAccessData,{
                      withCredentials : BOOLEAN_VALUES.TRUE
                    })
                    .then((response) => {
                      setAccessModules(response.data);
                      setSpinnerAnimation({
                        status: "success",
                        message: MESSAGE.SUCCESS.LOGGED_IN,
                      });
                      showMessageSnackbar({
                        message: MESSAGE.SUCCESS.LOGIN_SUCCESSFUL,
                        type: "success",
                      });

                      setTimeout(() => {
                          navigate(ROUTES_URL.HOME);
                      }, 1000);
                    })
                    .catch((error) => {
                      console.error(error);
                      setSpinnerAnimation({
                        status: "idle",
                        message: STRING_VALUES.EMPTY_STRING,
                      });

                    });
                }
              } else {
                showMessageSnackbar({
                  message: MESSAGE.ERROR.WRONG_CREDENTIALS,
                  type: "error",
                });
                setSpinnerAnimation({
                  status: "idle",
                  message: STRING_VALUES.EMPTY_STRING,
                });
                setLoginStatus({
                  companyId: NUMBER_VALUES.ZERO,
                  companyName: STRING_VALUES.EMPTY_STRING,
                  createdOn: STRING_VALUES.EMPTY_STRING,
                  email: STRING_VALUES.EMPTY_STRING,
                  fullName: STRING_VALUES.EMPTY_STRING,
                  id: NUMBER_VALUES.ZERO,
                  message: STRING_VALUES.EMPTY_STRING,
                  mobileNumber: STRING_VALUES.EMPTY_STRING,
                  status: BOOLEAN_VALUES.FALSE,
                  token: STRING_VALUES.EMPTY_STRING,
                });
              }
            })
            .catch((error) => {
              console.log(error);
              showMessageSnackbar({
                message: MESSAGE.ERROR.SOMETHING_WENT_WRONG,
                type: "error",
              });
              setSpinnerAnimation({
                status: "idle",
                message: STRING_VALUES.EMPTY_STRING,
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);
        showMessageSnackbar({ message: MESSAGE.ERROR.INVALID_CAPTCHA, type: "error" });
        setSpinnerAnimation({
          status: "idle",
          message: STRING_VALUES.EMPTY_STRING,
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
            <PasswordVisibilityToggle
            setShowPassword={setShowPassword}
            showPassword = {showPassword}/>
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
          sitekey= {SITE_KEY}
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
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </>
  );
}

export default SignInForm;