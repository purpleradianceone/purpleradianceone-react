import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { FormEvent, useState } from "react";
import ForgotPasswordRequestPage from "../../assets/animations/EmailSentAnimation";
import axios from "axios";
import MessageSnackBar from "../ui/MessageSnackbar";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";
import  POST_API  from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";

/**
 *
 * @returns JSX.Element of animation after mail sent for forgot password
 */
function ForgotPasswordForm() {
  /**
   * state to manage the visibility of animation
   */
  const navigate=useNavigate();

  const [showEmailSentAnimation, setShowEmailSentAnimation] = useState<boolean>(false);
  const [forgotPasswordFromState, setforgotPasswordFromState] = useState<{email:string}>({ email: '' });
    /**
     * State is declared for errors
     */
    const [forgotPasswordError, setForgotPasswordError] = useState({
        email: "",
    });


    const [snackbar , setSnackbar]= useState<{
        open: boolean,
        message: string,
        type:'success'|'error',
      }>({
        open: false,
        message: "",
        type: "success",
      })
    
      const showSnackbar=(message:string , type:'success' | 'error')=>{
        setSnackbar({open:true,message, type})
      }
    
      const handleSnackbarClose=()=>{
        setSnackbar(prev=>({...prev , open:false}))
      }
  /**
   * email regex for validation
   * @param email 
   * @returns 
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      if (!value) {
        setForgotPasswordError((prev) => ({
          ...prev,
          email: "Email is required",
        }));
      } else if (!validateEmail(value)) {
        setForgotPasswordError((prev) => ({
          ...prev,
          email: "Invalid email address",
        }));
      } else {
        setForgotPasswordError((prev) => ({
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

    if (!forgotPasswordFromState.email) {
      setForgotPasswordError((prev) => ({
          ...prev,
          "email": "Email Address is required!" ,
        }));
        
    }else if (!validateEmail(forgotPasswordFromState.email)){
      setForgotPasswordError((prev) => ({
            ...prev,
            email: "Invalid email address",
          }));
    }else{
      const requestData={
        email:forgotPasswordFromState.email
      }

      axios.post(POST_API.CHANGE_FORGOT_PASSWORD, requestData)
      .then((response)=>{
        if(response.data[0].status){
          
          if(response.data.status){
            setTimeout(() => {
              navigate(ROUTES_URL.CREATE_PASSWORD); 
             } , 5000);
             setShowEmailSentAnimation(!showEmailSentAnimation);
          showSnackbar(response.data[0].message, "success")
          localStorage.setItem(LOCALSTORAGE_KEYS.FORGOT_PASSWORD_EMAIL, forgotPasswordFromState.email);
          }
          else{
            showSnackbar("Unable to Send Otp ! something went wrong","error")
          }
          
          
        }else{
          showSnackbar(response.data[0].message,"error")
        }
      })
    }  
  };

    function handleFormDataChange(event: React.ChangeEvent<HTMLInputElement>): void {
       const { name, value } = event.target;
       if (name === "email") {
        setforgotPasswordFromState((prev)=>({
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
          onBlur={handleEmailBlur}
          onChange={handleFormDataChange}
          value={forgotPasswordFromState.email}
          error={forgotPasswordError.email}
        />
        <Link to={ROUTES_URL.FORGOT_PASSWORD_REQUEST_PAGE}>
          <Button type="submit" onClick={handleResetPasswordClick}>
            Reset Password
          </Button>
        </Link>
      </form>
      {showEmailSentAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg animate-fade-in">
            <h2 className="text-lg font-semibold">Animation in Progress...</h2>
            <ForgotPasswordRequestPage />
          </div>
        </div>
      )}

<MessageSnackBar
            isOpen={snackbar.open}
            message={snackbar.message}
            type={snackbar.type}
            onClose={handleSnackbarClose}
            duration={2000}
          /> 
    </>
  );
}

/**
 * @exports ForgotPasswordForm as a default export
 */
export default ForgotPasswordForm;
