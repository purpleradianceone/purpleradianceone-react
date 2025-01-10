import { Link } from "react-router-dom";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { useState } from "react";
import ForgotPasswordRequestPage from "../../assets/animations/EmailSentAnimation";

/**
 * 
 * @returns JSX.Element of animation after mail sent for forgot password
 */
function ForgotPasswordForm(){


    /**
     * state to manage the visibility of animation
     */
    const [showAnimation, setShowAnimation] = useState(false);

    /**
     * @function handleResetPasswordClick handles the click event of the reset password button 
     and redirect to login page on completion of setTimeout
     */
    const handleResetPasswordClick = () => {
        setShowAnimation(true);
        setTimeout(() => {
            window.location.href = '/signin';
        }, 15000);
    };


    return (
        <><form className="space-y-5" >
            <FormInput
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your Registered Email"
            center = {true}
          /> 
          <Link to="/forgotpasswordrequestpage"><Button type="submit" onClick={handleResetPasswordClick}>Reset Password</Button></Link>
        </form>
        {showAnimation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg animate-fade-in">
                        <h2 className="text-lg font-semibold">Animation in Progress...</h2>
                        <ForgotPasswordRequestPage/>
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