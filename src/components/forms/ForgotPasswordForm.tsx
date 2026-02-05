import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { FormEvent, useState } from "react";
import ForgotPasswordRequestPage from "../../assets/animations/EmailSentAnimation";
import axios from "axios";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import POST_API from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
import { useFormValidation } from "../../config/hooks/useFormValidation";
import { useFormChange } from "../../config/hooks/useFormChange";
import { VALIDATIONS } from "../../constants/AppConstants";
import MESSAGE from "../../constants/Messages";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import { APP_VERSION } from "../../@types/config/AppVersion";

/**
 *
 * @returns JSX.Element of animation after mail sent for forgot password
 */
function ForgotPasswordForm() {
  /**
   * state to manage the visibility of animation
   */
  const navigate = useNavigate();

  const [showEmailSentAnimation, setShowEmailSentAnimation] =
    useState<boolean>(false);

  const initialForgotPasswordState = {
    email: "",
  };
  const {
    formData: forgotPasswordFromState,
    handleChange: handleForgotPasswordFormDataChange,
  } = useFormChange(initialForgotPasswordState);
  const { errors, handleBlur } = useFormValidation(
    forgotPasswordFromState,
    "registered"
  );

  /**
     * @function handleResetPasswordClick handles the click event of the reset password button 
     and redirect to login page on completion of setTimeout
     */
  const handleResetPasswordClick = (e: FormEvent) => {
    e.preventDefault();

    if (
      forgotPasswordFromState.email !== "" ||
      forgotPasswordFromState.email === null
    ) {
      const requestData = {
        email: forgotPasswordFromState.email,
      };

      axios
        .post(POST_API.CHANGE_FORGOT_PASSWORD, requestData, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status) {
            if (response.data) {
              setTimeout(() => {
                navigate(ROUTES_URL.CREATE_PASSWORD);
              }, 8000);
              setShowEmailSentAnimation(!showEmailSentAnimation);
              toast.success(response.data.message);
              localStorage.setItem(
                LOCALSTORAGE_KEYS.FORGOT_PASSWORD_EMAIL,
                forgotPasswordFromState.email
              );
            } else {
              toast.error(MESSAGE.ERROR.UNABLE_TO_SEND_OTP);
            }
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          toast.error(error.data);
        });
    } else {
      toast.error(MESSAGE.ERROR.EMAIL_REQUIRED);
    }
  };

  return (
    <>
      <form className="space-y-5">
        <FormInput
          logo={Mail}
          label="Email"
          type="email"
          name="email"
          required={true}
          maxLength={VALIDATIONS.MAX_NAME_LENGTH}
          minLength={VALIDATIONS.MIN_NAME_LENGTH}
          placeholder="Enter your Registered Email"
          onBlur={handleBlur}
          onChange={handleForgotPasswordFormDataChange}
          value={forgotPasswordFromState.email}
          error={errors.email}
        />
        <Link to={ROUTES_URL.FORGOT_PASSWORD_REQUEST_PAGE}>
          <Button type="submit" onClick={handleResetPasswordClick}>
            Reset Password
          </Button>
        </Link>
        <div className="flex justify-center items-center caption-custom mb-1">{APP_VERSION}</div>
        
      </form>
      {showEmailSentAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg animate-fade-in">
            <h2 className="section-header-custom">
              Sending mail in Progress...
            </h2>
            <ForgotPasswordRequestPage />
          </div>
        </div>
      )}
    </>
  );
}

/**
 * @exports ForgotPasswordForm as a default export
 */
export default ForgotPasswordForm;
