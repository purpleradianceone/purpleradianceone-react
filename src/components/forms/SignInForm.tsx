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
import useRecaptcha from "../../config/hooks/useRecaptcha";
import { useAccessManagementContext } from "../../context/user/AccessManagementContext";
import POST_API from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import CryptoJS from "crypto-js";
import { useFormChange } from "../../config/hooks/useFormChange";
import { useFormValidation } from "../../config/hooks/useFormValidation";
import SignInFormDataType from "../../@types/auth/forms/SignInFormDataType";
import {
  SITE_KEY,
  STATUS_CODE,
  STRING_VALUES,
  VALIDATIONS,
} from "../../constants/AppConstants";
import PasswordVisibilityToggle from "../ui/PasswordVisibilityToggle";
import MESSAGE from "../../constants/Messages";
import SubscriptionDialogueBox from "../views/card/SubscriptionDialogueBox";
import { useUserPreference } from "../../context/user/UserPreference";
import { useNotificationCountContext } from "../../context/notification/NotificationCountContext";
import toast from "react-hot-toast";
import { KeySquare, Mail } from "lucide-react";
import { TutorailDataType } from "../../@types/tutorail/TutorailDataType";
import { useTutorailDataContext } from "../../context/tutorail/useTutorailDataContext";

function SignInForm() {
  const navigate = useNavigate();
  const { setLoginStatus } = useLoggedInUserContext();
  const { setAccessModules } = useAccessManagementContext();
  const { setUserPreference } = useUserPreference();
  const { setNotificationCount } = useNotificationCountContext();
  const { setTutorailData } = useTutorailDataContext();

  const { captchaToken, handleRecaptcha, recaptchaRef } = useRecaptcha();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const initialSignInFormState: SignInFormDataType = {
    email: "",
    password: "",
  };

  const loginStatusRef = useRef<any>();

  const {
    formData: loginUserCredentials,
    handleChange: handleSignInFormDatachange,
    setFormData: setInitialSignInFormState,
  } = useFormChange(initialSignInFormState);
  const { errors, handleBlur } = useFormValidation(
    loginUserCredentials,
    "registered",
  );

  const secretKey = "S7qXRmjdLZhGv3Kunc1tlBbZiFkymrIt";
  const encryptData = (data: string) => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  };

  const decryptData = (encryptedData: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

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

  // const isActiveSubscriptionUseRef =useRef<boolean>(false);

  const resetLoginStatus = () => {
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
      isSuperUser: false,
      isActiveSubscription: false,
      subscriptionAllowedUsers: 0,
      activeUsersInCompany: 0,
      subscriptionId: 0,
      startDateSubscription: "",
      endDateSubscription: "",
    });
    setTutorailData({
      id: 0,
      companyUserId: 0,
      isNavbarSeen: false,
      isDashboardSeen: false,
      isCrmDashboardSeen: false,
      isCompanyUserSeen: false,
      isCompanyUserActionsSeen: false,
      isLeadSeen: false,
      isAccountSeen: false,
      isProductSeen: false,
      isTeamSeen: false,
      isSettingCompanySeen: false,
      isSettingEmailTemplateSeen: false,
      isSettingIntegrationSeen: false,
      createdBy: "",
      updatedBy: "",
      createdOn: "",
      updatedOn: "",
    });
    setNotificationCount(0);
  };

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!loginUserCredentials.email || !loginUserCredentials.password) {
      if (!loginUserCredentials.email) {
        toast.error(MESSAGE.ERROR.EMAIL_REQUIRED);
        return;
      }
      if (!loginUserCredentials.password) {
        toast.error(MESSAGE.ERROR.PASSWORD_REQUIRED);
        return;
      }
    }

    if (!captchaToken) {
      toast.error(MESSAGE.ERROR.COMPLETE_CAPTCHA);
      return;
    }

    setSpinnerAnimation({
      status: "loading",
      message: MESSAGE.INPROCESS.LOGGING_IN,
    });

    const user = {
      email: loginUserCredentials.email,
      captcha_token: captchaToken,
      password: loginUserCredentials.password,
    };
    axios
      .post(POST_API.SIGN_IN, user, { withCredentials: true })
      .then((response) => {
        if (response.status === STATUS_CODE.ACCEPTED) {
          toast.error(response.data.message);
          recaptchaRef.current!.reset();
          setSpinnerAnimation({
            status: "idle",
            message: "",
          });
          return;
        }
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
            isSuperUser: response.data.is_super_user,
            isActiveSubscription: response.data.isactive_subscription,
            subscriptionAllowedUsers: response.data.subscription_allowed_users,
            activeUsersInCompany: response.data.active_users_in_company,
            subscriptionId: response.data.subscription_id,
            startDateSubscription: response.data.start_date_subscription,
            endDateSubscription: response.data.end_date_subscription,
          });

           const getCrmModuleAccessData = {
            company_id: response.data.company_id,
            company_user_id: response.data.id,
            requestedby: response.data.id,
          };
          // note: is status false , then it will navigate to create subscription page
          if (!response.data.isactive_subscription) {
            setTimeout(() => {
              toast.error(MESSAGE.ERROR.SUBSCRIPTION_PLAN_ERROR);

              axios
                .post(POST_API.GET_CRM_MODULE_ACCESS, getCrmModuleAccessData, {
                  withCredentials: true,
                })
                .then((response) => {
                  setAccessModules(response.data);
                  navigate(ROUTES_URL.CREATE_SUBSCRIPTION);
                });

            }, 1500);
            return; //  Stops further execution
          }

         

          axios
            .post(POST_API.GET_CRM_MODULE_ACCESS, getCrmModuleAccessData, {
              withCredentials: true,
            })
            .then((response) => {
              setAccessModules(response.data);
              setSpinnerAnimation({
                status: "success",
                message: MESSAGE.SUCCESS.LOGGED_IN,
              });
              toast.success(MESSAGE.SUCCESS.LOGIN_SUCCESSFUL);

              // note : changes done here
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
                        countryId: res.country_id,
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
                const GetCompanyUserTutorailPostData = {
                  company_id: loginStatusRef.current.company_id,
                  company_user_id: loginStatusRef.current.id,
                  requestedby: loginStatusRef.current.id,
                };
                axios
                  .post(
                    POST_API.GET_COMPANY_USER_TUTORAIL,
                    GetCompanyUserTutorailPostData,
                    {
                      withCredentials: true,
                    },
                  )
                  .then((response) => {
                    if (response.status === STATUS_CODE.OK) {
                      const formattedData: TutorailDataType = {
                        id: response.data.id,
                        companyUserId: response.data.company_user_id,
                        isNavbarSeen: response.data.is_navbar_seen,
                        isDashboardSeen: response.data.is_dashboard_seen,
                        isCrmDashboardSeen: response.data.is_crm_dashboard_seen,
                        isCompanyUserSeen: response.data.is_company_user_seen,
                        isCompanyUserActionsSeen:
                          response.data.is_company_user_actions_seen,
                        isLeadSeen: response.data.is_lead_seen,
                        isAccountSeen: response.data.is_account_seen,
                        isProductSeen: response.data.is_product_seen,
                        isTeamSeen: response.data.is_team_seen,
                        isSettingCompanySeen:
                          response.data.is_setting_company_seen,
                        isSettingEmailTemplateSeen:
                          response.data.is_setting_email_template_seen,
                        isSettingIntegrationSeen:
                          response.data.is_setting_integration_seen,
                        createdBy: response.data.createdby,
                        updatedBy: response.data.updatedby,
                        createdOn: response.data.createdon,
                        updatedOn: response.data.updatedon,
                      };

                      setTutorailData(formattedData);
                    }
                  });
                setTimeout(() => {
                  navigate(ROUTES_URL.HOME); // Navigates ONLY if subscription checks pass
                }, 1000);
              }
            })
            .catch((error) => {
              console.error(error);
              resetLoginStatus();
              setSpinnerAnimation({
                status: "idle",
                message: "",
              });
            });
        } else {
          // showMessageSnackbar({
          //   message: response.data.message,
          //   type: "error",
          // });
          toast.error(response.data.message);
          setSpinnerAnimation({
            status: "idle",
            message: "",
          });
        }
      })
      .catch((error) => {
        recaptchaRef.current!.reset();
        // showMessageSnackbar({
        //   message: error.response.data.message,
        //   type: "error",
        // });
        toast.error(error.response.data.message);
        setSpinnerAnimation({
          status: "idle",
          message: "",
        });
      });
  };

  //when sign in page loads resets the contexts and local storage
  useEffect(() => {
    resetLoginStatus();
    setAccessModules([]);

    const remember = localStorage.getItem(LOCALSTORAGE_KEYS.REMEMBER_ME);
    if (remember === "true") {
      setRememberMe(true);
      const storedEmail = localStorage.getItem(
        LOCALSTORAGE_KEYS.LOGIN_CREDENTIALS,
      );
      const storedPass = localStorage.getItem(
        LOCALSTORAGE_KEYS.LOGINCREDENTAILSPASS,
      );
      if (storedEmail) {
        setInitialSignInFormState((prev) => ({
          ...prev,
          email: storedEmail,
        }));
      }
      if (storedPass) {
        setInitialSignInFormState((prev) => ({
          ...prev,
          password: decryptData(storedPass),
        }));
      }
    }
    localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
    localStorage.removeItem(LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT);
    localStorage.removeItem(LOCALSTORAGE_KEYS.GOOGLE_MEET_STATUS);
    localStorage.removeItem(LOCALSTORAGE_KEYS.ZOOM_MEETING_STATUS);
    localStorage.removeItem(LOCALSTORAGE_KEYS.USER_PREFERENCE);
    localStorage.removeItem(LOCALSTORAGE_KEYS.NOTIFICATION_COUNT);
  }, []);

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);

    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      navigate(ROUTES_URL.SIGN_IN, { replace: true });
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  const handleRememberMeCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.checked) {
      localStorage.setItem(LOCALSTORAGE_KEYS.REMEMBER_ME, STRING_VALUES.TRUE);
      setRememberMe(true);
      localStorage.setItem(
        LOCALSTORAGE_KEYS.LOGIN_CREDENTIALS,
        loginUserCredentials.email,
      );
      localStorage.setItem(
        LOCALSTORAGE_KEYS.LOGINCREDENTAILSPASS,
        encryptData(loginUserCredentials.password),
      );
    } else {
      localStorage.removeItem(LOCALSTORAGE_KEYS.REMEMBER_ME);
      setRememberMe(false);
      localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_CREDENTIALS);
      localStorage.removeItem(LOCALSTORAGE_KEYS.LOGINCREDENTAILSPASS);
    }
  };

  return (
    <>
      <div>
        <form className="space-y-5" onSubmit={handleLoginSubmit}>
          <FormInput
            logo={Mail}
            label="Email"
            type="email"
            name="email"
            required={true}
            placeholder="Enter your email"
            value={loginUserCredentials.email}
            defaultValue={loginUserCredentials.email}
            minLength={VALIDATIONS.MIN_EMAIL_LENGTH}
            maxLength={VALIDATIONS.MAX_NAME_LENGTH}
            onChange={(e) => {
              if (rememberMe) {
                localStorage.setItem(
                  LOCALSTORAGE_KEYS.LOGIN_CREDENTIALS,
                  e.target.value,
                );
              } else {
                localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_CREDENTIALS);
              }
              handleSignInFormDatachange(e);
            }}
            onBlur={handleBlur}
            error={errors.email}
          />
          <FormInput
            logo={KeySquare}
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            required={true}
            placeholder="Enter your password"
            value={loginUserCredentials.password}
            defaultValue={loginUserCredentials.password}
            onChange={(e) => {
              if (rememberMe) {
                localStorage.setItem(
                  LOCALSTORAGE_KEYS.LOGINCREDENTAILSPASS,
                  encryptData(e.target.value),
                );
              } else {
                localStorage.removeItem(LOCALSTORAGE_KEYS.LOGINCREDENTAILSPASS);
              }
              handleSignInFormDatachange(e);
            }}
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
              checked={rememberMe}
            />
            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <Link
                to={ROUTES_URL.FORGOT_PASSWORD}
                className="table-header-custom-blue"
              >
                Forgot Password?
              </Link>
            </button>
          </div>

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={SITE_KEY}
            onChange={handleRecaptcha}
          />

          <Button
            type="submit"
            // onClick={}
            spinner={spinnerAnimation}
          >
            Log In
          </Button>

          <div className="text-center">
            <span className="caption-custom">
              Don't have an account yet?{" "}
              <button
                type="button"
                className="caption-custom-blue hover:text-blue-700"
              >
                <Link to={ROUTES_URL.SIGN_UP}>Sign Up</Link>
              </button>
            </span>
            {/* <AppVersionViewCard/> */}
          </div>
        </form>
        {showSubscriptionOrInActivePopUp && (
          <SubscriptionDialogueBox
            isOpen={showSubscriptionOrInActivePopUp}
            cardTitle="User Management"
            message="Get the Subscription / Inactive Some users."
            onClose={() => {
              setShowSubscriptionOrInActivePopUp(false);
              localStorage.removeItem(LOCALSTORAGE_KEYS.LOGIN_STATUS);
              localStorage.removeItem(LOCALSTORAGE_KEYS.ACCESS_MANAGEMENT);
              localStorage.removeItem(LOCALSTORAGE_KEYS.GOOGLE_MEET_STATUS);
              localStorage.removeItem(LOCALSTORAGE_KEYS.ZOOM_MEETING_STATUS);
              localStorage.removeItem(LOCALSTORAGE_KEYS.USER_PREFERENCE);
              localStorage.removeItem(LOCALSTORAGE_KEYS.NOTIFICATION_COUNT);
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
                isSuperUser: false,
                subscriptionAllowedUsers: 0,
                activeUsersInCompany: 0,
                subscriptionId: 0,
                startDateSubscription: "",
                endDateSubscription: "",
              });
              setTutorailData({
                id: 0,
                companyUserId: 0,
                isNavbarSeen: false,
                isDashboardSeen: false,
                isCrmDashboardSeen: false,
                isCompanyUserSeen: false,
                isCompanyUserActionsSeen: false,
                isLeadSeen: false,
                isAccountSeen: false,
                isProductSeen: false,
                isTeamSeen: false,
                isSettingCompanySeen: false,
                isSettingEmailTemplateSeen: false,
                isSettingIntegrationSeen: false,
                createdBy: "",
                updatedBy: "",
                createdOn: "",
                updatedOn: "",
              });
              navigate(ROUTES_URL.SIGN_IN);
              setSpinnerAnimation({
                status: "idle",
                message: "",
              });
            }}
          />
        )}
      </div>

      {/* <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleMessageSnackbarClose}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      /> */}
    </>
  );
}

export default SignInForm;
