import { Link } from "react-router-dom";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { FormEvent, useState } from "react";
import ForgotPasswordRequestPage from "../../assets/animations/EmailSentAnimation";

/**
 *
 * @returns JSX.Element of animation after mail sent for forgot password
 */
function ForgotPasswordForm() {
  /**
   * state to manage the visibility of animation
   */
  const [showAnimation, setShowAnimation] = useState(false);
  const [formState, setFormState] = useState({ email: '' });

    /**
     * State is declared for errors
     */
    const [error, setError] = useState({
        email: "",
    });

  /**
   * email regex for validation
   * @param email 
   * @returns 
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      if (!value) {
        setError((prev) => ({
          ...prev,
          email: "Email is required",
        }));
      } else if (!validateEmail(value)) {
        setError((prev) => ({
          ...prev,
          email: "Invalid email address",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          email: "",
        }));
      }
    }
  };
  /**
     * @function handleResetPasswordClick handles the click event of the reset password button 
     and redirect to login page on completion of setTimeout
     */
  const handleResetPasswordClick = (e: FormEvent) => {
    e.preventDefault(); 

    if (!formState.email) {
        setError((prev) => ({
          ...prev,
          "email": "Email Address is required!" ,
        }));
        
    }else if (!validateEmail(formState.email)){
        setError((prev) => ({
            ...prev,
            email: "Invalid email address",
          }));
    }else{
        setShowAnimation(true);
        setTimeout(() => {
          window.location.href = "/signin";
        }, 15000);
    }
    
  };

    function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
       const { name, value } = event.target;
       if (name === "email") {
        setFormState((prev)=>({
            ...prev, 
            [name]:value
        }))
       }
        
    }

  return (
    <>
      <form className="space-y-5">
        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your Registered Email"
          onBlur={handleBlur}
          onChange={handleChange}
          value={formState.email}
          error={error.email}
        />
        <Link to="/forgotpasswordrequestpage">
          <Button type="submit" onClick={handleResetPasswordClick}>
            Reset Password
          </Button>
        </Link>
      </form>
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg animate-fade-in">
            <h2 className="text-lg font-semibold">Animation in Progress...</h2>
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
