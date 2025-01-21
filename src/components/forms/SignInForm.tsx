
/**
 * @import React for using react library
 * @import useState for state management
 * @import {Eye,EyeOff} for Icons from lucide-react
 * @import FormInput for form custom input component
 * @import FormCheckbox for form custom checkbox component
 * @import {Link} for Link component from react-router-dom
 * @import ReCAPTCHA from google recaptcha
 */
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


/**
 * 
 * @returns JSX.Element for the login form
 */
const SignInForm = () => {

  const navigate = useNavigate();
  const {setLoginStatus} = useLoggedInUserContext();

  const sitekey = "6LcLKaYqAAAAANtiPbLxFRpgPCS9oG4aecWlA-70";
  // const secretKey = '6LcLKaYqAAAAAGpStS9lxqb_jKhV14dXqTypdqN1';


  const {captchaToken,handleRecaptcha,recaptchaRef} = useRecaptcha();


  /**
   * State to store boolean values for password visibility
   **/
  const [showPassword, setShowPassword] = useState(false);

  /**
   * State to store Login form data i.e. email and password
   **/
  const [loginUserCredentials, setLoginUserCredentials] = useState({
    email: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success'
  });

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbar({ open: true, message, type });
  };

  const handleClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  /**
   * States to store error messages for email and paswword empty/blank feilds
   **/
  const [loginEmailErrorMessage, setLoginEmailErrorMessage] =
    useState<string>("");
  const [loginPasswordErrorMessage, setLoginPasswordErrorMessage] =
    useState<string>("");

  /**
   * @param event - event handler for email and password feild changes
   * @function handleLoginOnchange handles the change event on email and password feild values changes and 
     updates the loginUserCredentials state
   */
  const handleLoginOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginUserCredentials((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * @param event - event handler for password feild change
   * @function handleLoginOnBlurPassword handles the blur event on password feild and checks if password is empty 
     or not and updates the loginPasswordErrorMessage state
   */
  const handleLoginOnBlurPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value == "") {
      setLoginPasswordErrorMessage("Password is required");
    } else {
      setLoginPasswordErrorMessage("");
    }
  };

  /** 
   * @param event - event handler for email feild change
   * @function handleLoginOnBlurEmail handles the blur event on email feild and checks if email is empty
     or not and updates the loginEmailErrorMessage state
  */
  const handleLoginOnBlurEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value == "") {
      setLoginEmailErrorMessage("Email Address is required");
    } else {
      setLoginEmailErrorMessage("");
    }
  };

 

  /**
   * 
   * @param event event handler for login button click
   * @function handleLoginSubmit handles the submit event on login button click and check if email and password
     is entered or not and if entered then it checks the value of rememberMe key is present or not in localstorage
     and if present then it sets the the loginUserCredentials in localstorage
   */
  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (loginUserCredentials.email == "") {
      setLoginEmailErrorMessage("Email Address is required");
    }
    else if(loginUserCredentials.password == ""){
      setLoginPasswordErrorMessage("Password is required");
    }
     else{

      if (
        loginUserCredentials.email != "" &&
        loginUserCredentials.password != "" &&
        localStorage.getItem("rememberMe") === "true"
      ) {
        localStorage.setItem(
          "loginUserCredentials",
          JSON.stringify(loginUserCredentials)
        );
    }

    if(captchaToken !== ""){
      const captchaRequest = {
        token : captchaToken
      }
      axios.post("/api/authentication/purple-crm-api/cpatcha/verify",captchaRequest)
      .then(response => {
        console.log(response)
        
        if(response.data.status){
          const user = {
            email: loginUserCredentials.email,
            login_password : loginUserCredentials.password
          }
          axios.post("/api/authentication/purple-crm-api/authenticate" , user)
          .then( response => {
            if(response.data.status === true){
              setLoginStatus({
                userId : response.data.user_id,
                companyId : response.data.company_id,
                status: response.data.status,
                message: response.data.message,
                token: response.data.token,
                email: user.email
              });
              
              if (response.data.token && response.data.token !== "") {
                axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
                showSnackbar('Login successful!', 'success');
                setTimeout(() => {
                  navigate("/home");
                }, 1000);
            }
              
              
            }
            else{
              showSnackbar('Wrong email and Password!', 'error');
              setLoginStatus({
                userId : 0,
                companyId : 0,
                status: false,
                message: "",
                token: "",
                email: ""
              });
            }
          } )
          .catch( error => {
            console.log(error);
            showSnackbar('Something Went Wrong!', 'error');
      
          } );
  
        }
        
    
      })
      .catch( error => {
        console.log(error);
        showSnackbar("Something Went Wrong","error")
      });
    }
    else{
      showSnackbar("Please Complete The Captcha", "error")
    }
    
    
    

    }


  };

  /**
   * 
   * @param event event handler for remember me checkbox click
   * @function handleRememberMeChange handles the change event on remember me checkbox click and updates the 
     rememberMe key in localstorage which will be used for remembering the user credentials
   */
  const handleRememberMeCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
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
            onChange={handleLoginOnchange}
            onBlur={handleLoginOnBlurEmail}
            error={loginEmailErrorMessage}
          />
          <FormInput
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            onChange={handleLoginOnchange}
            onBlur={handleLoginOnBlurPassword}
            error={loginPasswordErrorMessage}
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
              <Link to= "/forgotpassword">Forgot Password?</Link>
            </button>
          </div>
            
            <ReCAPTCHA 
            ref={recaptchaRef}
            sitekey={sitekey}
            onChange={handleRecaptcha}
            />
            
          

            <Button type="submit" onClick={handleLoginSubmit}>Log In</Button>

          <div className="text-center">
            <span className="text-gray-600 text-sm">
              Don't have an account yet?{" "}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                 {/* <Button type="submit">Sign up</Button> */}
                <Link to="/signup">Sign Up</Link>
              </button>
            </span>
          </div>
        </form>
        <MessageSnackBar
        isOpen={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={handleClose}
        duration={2000}
      />
        </>
  );
};

/**
 * @exports SignInForm component as default export
 */
export default SignInForm;
