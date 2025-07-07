/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
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
import {
  NUMBER_VALUES,
  SITE_KEY,
  STATUS_CODE,
  STRING_VALUES,
} from "../../constants/AppConstants";
import PasswordVisibilityToggle from "../ui/PasswordVisibilityToggle";
import MESSAGE from "../../constants/Messages";
import SubscriptionDialogueBox from "../views/card/SubscriptionDialogueBox";
import { useGoogleMeetContext } from "../../context/meeting/GoogleMeetContext";
import { useZoomMeetingContext } from "../../context/meeting/ZoomMeetingContext";
import { useUserPreference } from "../../context/user/UserPreference";


function SignInForm() {
  const navigate = useNavigate();
  const { setLoginStatus } = useLoggedInUserContext();
  const { setAccessModules } = useAccessManagementContext();

  const {setGoogleMeetStatus} = useGoogleMeetContext();
  const {setZoomMeetingStatus} = useZoomMeetingContext();
  const { setUserPreference } = useUserPreference();

  const { captchaToken, handleRecaptcha, recaptchaRef } = useRecaptcha();
  const [showPassword, setShowPassword] = useState(false);

  const initialSignInFormState: SignInFormDataType = {
    email: "",
    password: "",
  };

  const loginStatusRef = useRef<any>();

  const {
    formData: loginUserCredentials,
    handleChange: handleSignInFormDatachange,
  } = useFormChange(initialSignInFormState);
  const { errors, handleBlur } = useFormValidation(
    loginUserCredentials,
    "registered"
  );

  //NOTE : NEED TO HANDLE THIS FUNCTIONALITY
  const [showSubscriptionOrInActivePopUp, setShowSubscriptionOrInActivePopUp] =
    useState<boolean>(false);

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

  // const isActiveSubscriptionUseRef =useRef<boolean>(false);

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!loginUserCredentials.email || !loginUserCredentials.password) {
      if (!loginUserCredentials.email) {
        showMessageSnackbar({
          message: MESSAGE.ERROR.EMAIL_REQUIRED,
          type: "error",
        });
        return;
      }
      if (!loginUserCredentials.password) {
        showMessageSnackbar({
          message: MESSAGE.ERROR.PASSWORD_REQUIRED,
          type: "error",
        });
        return;
      }
    }

    if (
      localStorage.getItem(LOCALSTORAGE_KEYS.REMEMBER_ME) === STRING_VALUES.TRUE
    ) {
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
      .post(POST_API.VERIFIY_CAPTCHA, captchaRequest, {
        withCredentials: true,
      })
      .then((response) => {
        if (response) {
          const user = {
            email: loginUserCredentials.email,
            password: loginUserCredentials.password,
          };
          axios
            .post(POST_API.SIGN_IN, user, { withCredentials: true })
            .then((response) => {
              if (response.data.status) {
                loginStatusRef.current = response.data;
                setLoginStatus({
                  id: response.data.id,
                  companyId: response.data.company_id,
                  companyName: response.data.company_name,
                  fullName: response.data.fullname,
                  email: response.data.email,
                  mobileNumber: response.data.mobilenumber,
                  message: response.data.message,
                  token: response.data.token,
                  status: response.data.status,
                  createdOn: response.data.createdon,
                  isActiveSubscription: response.data.isactive_subscription,
                  subscriptionAllowedUsers:
                    response.data.subscription_allowed_users,
                  activeUsersInCompany: response.data.active_users_in_company,
                  subscriptionId: response.data.subscription_id,
                  startDateSubscription: response.data.start_date_subscription,
                  endDateSubscription: response.data.end_date_subscription,
                });

                // note: is status false , then it will navigate to create subscription page
                if (!response.data.isactive_subscription) {
                  setTimeout(() => {
                    showMessageSnackbar({
                      message: MESSAGE.ERROR.SUBSCRIPTION_PLAN_ERROR,
                      type: "error",
                    });
                    navigate(ROUTES_URL.CREATE_SUBSCRIPTION);
                  }, 1500);
                  return; // ⬅️ Stops further execution
                }

                const getCrmModuleAccessData = {
                  company_id: response.data.company_id,
                  company_user_id: response.data.id,
                  requestedby: response.data.id,
                };

                axios
                  .post(
                    POST_API.GET_CRM_MODULE_ACCESS,
                    getCrmModuleAccessData,
                    { withCredentials: true }
                  )
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
                    const validateGoogleMeetConnection = {
                      company_id : loginStatusRef.current.company_id,
                      company_user_id : loginStatusRef.current.id ,
                      requestedby : loginStatusRef.current.id 
                    }
                    axios.post(POST_API.VALIDATE_GOOGLE_MEET_CONNECTION,validateGoogleMeetConnection,{
                      withCredentials: true
                    })
                    .then((response) => {
                      console.log(response)
                      if(response.status === STATUS_CODE.OK){
                          setGoogleMeetStatus({
                            isConnected : response.data.status
                          })  

                      const validateZoomMeetingsConnection = {
                        company_id : loginStatusRef.current.company_id,
                      company_user_id : loginStatusRef.current.id ,
                      requestedby : loginStatusRef.current.id 
                      }
                      axios.post(POST_API.VALIDATE_ZOOM_MEETINGS_CONNECTION,validateZoomMeetingsConnection,{
                        withCredentials : true
                      }).then((response) => {
                        console.log(response)
                        if(response.status === STATUS_CODE.OK){
                          setZoomMeetingStatus({
                              isConnected : response.data.status  
                          });
                        }
                      })
                      .catch((error) => {
                        console.log(error)
                      })
                      }
                    })
                    .catch((error) => {
                      console.log(error)
                    })
                    // //note : temporary fix
                    // if ((loginStatus.activeUsersInCompany > loginStatus.subscriptionAllowedUsers)) {
                    //   setShowSubscriptionOrInActivePopUp(true);
                    //   return;
                    // }


                    //note : 
                    if (
                      loginStatusRef.current.active_users_in_company >
                      loginStatusRef.current.subscription_allowed_users
                    ) {
                      setShowSubscriptionOrInActivePopUp(true);
                      return;
                    }
                    if (!loginStatusRef.current.isactive_subscription) {
                      navigate(ROUTES_URL.CREATE_SUBSCRIPTION);
                      return;
                    } else if (
                      loginStatusRef.current.isactive_subscription &&
                      loginStatusRef.current.active_users_in_company <=
                      loginStatusRef.current.subscription_allowed_users
                    ) {
                       axios
                          .get(POST_API.GET_COMPANY_USER_PREFERENCE, {
                            params: {
                              companyId: loginStatusRef.current.company_id,
                              companyUserId: loginStatusRef.current.id,
                              requestedBy: loginStatusRef.current.id,
                            },
                            withCredentials: true,
                          })
                          .then((response) => {
                            if (response.status === STATUS_CODE.OK) {
                              const res = response.data;
                              setUserPreference({
                                companyUserId: res.company_user_id,
                                createdBy: res.createdby,
                                createdOn: res.createdon,
                                id: res.id,
                                timezoneId: res.timezone_id,
                                updatedBy: res.updatedby,
                                updatedOn: res.updatedon,
                                isHamburgerMenuCollapsed:
                                  res.is_hamburger_menu_collapsed,
                                isLeftMenu: res.is_left_menu,
                                rowsInGrid: res.rows_in_grid,
                                timezone: res.Timezone,
                                timezoneName: res["Timezone Name"],
                                timezoneUTCOffset: res["Timezone UTC Offset"],
                              });
                            }
                          });
                      setTimeout(() => {
                        navigate(ROUTES_URL.HOME); // Navigates ONLY if subscription checks pass
                      }, 1000);
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                    setSpinnerAnimation({
                      status: "idle",
                      message: "",
                    });
                  });
              } else {
                showMessageSnackbar({
                  message: MESSAGE.ERROR.WRONG_CREDENTIALS,
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
                  isActiveSubscription: false,
                  subscriptionAllowedUsers: 0,
                  activeUsersInCompany: 0,
                  subscriptionId: 0,
                  startDateSubscription: "",
                  endDateSubscription: "",
                });
              }
            })
            .catch((error) => {
              console.log(error);
              recaptchaRef.current!.reset();
              showMessageSnackbar({
                message: MESSAGE.ERROR.WRONG_CREDENTIALS,
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
        showMessageSnackbar({
          message: MESSAGE.ERROR.INVALID_CAPTCHA,
          type: "error",
        });
        setSpinnerAnimation({
          status: "idle",
          message: "",
        });
      });
  };

  //when sign in page loads resets the contexts and local storage
  useEffect(() => {
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
      isActiveSubscription: false,
      subscriptionAllowedUsers: 0,
      activeUsersInCompany: 0,
      subscriptionId: 0,
      startDateSubscription: "",
      endDateSubscription: "",
    });

    setAccessModules([]);
    localStorage.clear();
  }, []);


    useEffect(() => {
      window.history.pushState(null, document.title, window.location.href);
  
      const handleBackButton = (event: PopStateEvent) => {
        event.preventDefault();
        navigate(ROUTES_URL.SIGN_IN, { replace: true }); 

      };
  
      window.addEventListener('popstate', handleBackButton);

      return () => {
        window.removeEventListener('popstate', handleBackButton);
      };
    }, [navigate]);

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
      <div>
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
                showPassword={showPassword}
              />
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
            sitekey={SITE_KEY}
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
        <SubscriptionDialogueBox
          isOpen={showSubscriptionOrInActivePopUp}
          cardTitle="Subscription Required"
          message="Get the Subscription / Inactive Some users."
          onClose={() => {
            setShowSubscriptionOrInActivePopUp(false);
            localStorage.clear();
            navigate(ROUTES_URL.SIGN_IN);
            setSpinnerAnimation({
              status: "idle",
              message: "",
            });
          }}
        />
      </div>

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
