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
import { MessageSnackbarState, ShowMessageSnackbarProps } from "../../@types/ui/MessageSnackbarProps";
import { useFormValidation } from "../../config/hooks/useFormValidation";
import { useFormChange } from "../../config/hooks/useFormChange";
import { STRING_VALUES } from "../../constants/AppConstants";

/**
 *
 * @returns JSX.Element of animation after mail sent for forgot password
 */
function ForgotPasswordForm(){
  /**
   * state to manage the visibility of animation
   */
  const navigate=useNavigate();

  const [showEmailSentAnimation, setShowEmailSentAnimation] = useState<boolean>(false);

  const initialForgotPasswordState = {
    email : "",
  }
    const{formData: forgotPasswordFromState , handleChange : handleForgotPasswordFormDataChange } = useFormChange(initialForgotPasswordState)
    const { errors, handleBlur } = useFormValidation(forgotPasswordFromState,"registered");


    const [messageSnackbar , setMessageSnackbar]= useState<MessageSnackbarState>({
        open: false,
        message: "",
        type: "success",
      })
    
      const showMessageSnackbar=({message, type} : ShowMessageSnackbarProps)=>{
        setMessageSnackbar({open:true,message, type})
      }
    
      const handleMessageSnackbarClose=()=>{
        setMessageSnackbar(prev=>({...prev , open:false}))
      }




  /**
     * @function handleResetPasswordClick handles the click event of the reset password button 
     and redirect to login page on completion of setTimeout
     */
  const handleResetPasswordClick = (e: FormEvent) => {
    e.preventDefault(); 

    if(forgotPasswordFromState.email !== STRING_VALUES.EMPTY_STRING || forgotPasswordFromState.email=== null){
      const requestData={
        email:forgotPasswordFromState.email
      }

      axios.post(POST_API.CHANGE_FORGOT_PASSWORD, requestData)
      .then((response)=>{
        if(response.data[0].status){
          
          if(response.data){
            setTimeout(() => {
              navigate(ROUTES_URL.CREATE_PASSWORD); 
             } , 8000);
             setShowEmailSentAnimation(!showEmailSentAnimation);
          showMessageSnackbar({message : response.data[0].message, type : "success"})
          localStorage.setItem(LOCALSTORAGE_KEYS.FORGOT_PASSWORD_EMAIL, forgotPasswordFromState.email);
          }
          else{
            showMessageSnackbar({message :"Unable to Send Otp ! something went wrong",type :"error"})
          }
          
          
        }else{
          showMessageSnackbar({message : response.data[0].message,type:"error"})
        }
      })
      .catch((error) => {
        console.error(error);
        showMessageSnackbar({message:error,type: "error"})
      })
      
    }
    else{
      showMessageSnackbar({message:"Please Fill the Email First",type:"error"})
    }
 
  };


  return (
    <>
      <form className="space-y-5">
        <FormInput
          label="Email"
          type="email"
          name="email"
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
            isOpen={messageSnackbar.open}
            message={messageSnackbar.message}
            type={messageSnackbar.type}
            onClose={handleMessageSnackbarClose}
            duration={2000}
          /> 
    </>
  );
}

/**
 * @exports ForgotPasswordForm as a default export
 */
export default ForgotPasswordForm;
