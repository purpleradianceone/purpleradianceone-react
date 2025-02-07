
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
import { useAccessManagementContext } from "../../context/user/AccessManagementContext";
import  POST_API  from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";

/**
 * 
 * @returns JSX.Element for the login form
 */
const SignInForm = () => {
  // const apiUrl=import.meta.env.VITE_API_URL

  const [spinnerAnimation,setSpinnerAnimation] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({
    status : "idle",
    message : ""
  })
  const navigate = useNavigate();
  const {setLoginStatus} = useLoggedInUserContext();
  const {setAccessModules} = useAccessManagementContext();

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
        localStorage.getItem(LOCALSTORAGE_KEYS.REMEMBER_ME) === "true"
      ) {
        localStorage.setItem(
          LOCALSTORAGE_KEYS.LOGIN_CREDENTIALS,
          JSON.stringify(loginUserCredentials)
        );
    }

    if(captchaToken !== ""){
      const captchaRequest = {
        token : captchaToken
      }
      setSpinnerAnimation({
        status: "loading",
        message: "Logging In",
      })
      axios.post(POST_API.VERIFIY_CAPTCHA,captchaRequest)
      .then(response => {
        if(response.data.status){
          const user = {
            email: loginUserCredentials.email,
            password : loginUserCredentials.password
          }
          axios.post(POST_API.SIGN_IN,user ,{withCredentials:true})
          .then( response => {
            
            if(response.data.status){

              
              setLoginStatus({
                id : response.data.id,
                companyId : response.data.company_id,
                companyName : response.data.company_name,
                fullName : response.data.fullName,
                email : response.data.email,
                mobileNumber : response.data.mobilenumber,
                message : response.data.message,
                token : response.data.token,
                status : response.data.status,
                createdOn : response.data.createdon
              });
              
              if (response.data) {
               
                const getCrmModuleAccessData={
                  company_id :response.data.company_id,
                  company_user_id: response.data.id,
                  requestedby : response.data.id
                }
            
                axios.post(POST_API.GET_CRM_MODULE_ACCESS,getCrmModuleAccessData)
                .then(response => 
                {
                  setAccessModules(response.data);
                  
                  console.log(response.data);
                  setSpinnerAnimation({
                    status: "success",
                    message:"Logged In"
                  })
                  showSnackbar('Login successful!', 'success');

                  setTimeout(() => {
                    try {
                        console.log("Navigating to home...");
                        navigate(ROUTES_URL.HOME) // or navigate(ROUTES_URL.HOME);
                    } catch (error) {
                        console.error("Error during navigation:", error);
                    }
                }, 1000);


                }

                )
                .catch(error => {
                  console.error(error);
                  setSpinnerAnimation({
                    status: "idle",
                    message :""                 
                  })
                });
                
            }
              
              
            }
            else{
              showSnackbar('Wrong email and Password!', 'error');
              setSpinnerAnimation({
                status: "idle",
                message :""                 
              })
              setLoginStatus({
                companyId : 0,
                companyName : "",
                createdOn : "",
                email : "",
                fullName : "",
                id : 0,
                message : "",
                mobileNumber : "",
                status : false,
                token : ""
              });
            }
          } )
          .catch( error => {
            console.log(error);
            showSnackbar('Something Went Wrong!', 'error');
            setSpinnerAnimation({
              status: "idle",
              message :""                 
            })
            
          } );
  
        }
        
    
      })
      .catch( error => {
        console.log(error);
        showSnackbar("Captcha Invalid","error")
        setSpinnerAnimation({
          status: "idle",
          message :""                 
        })
        
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
      localStorage.setItem(LOCALSTORAGE_KEYS.REMEMBER_ME, "true");
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
              <Link to= {ROUTES_URL.FORGOT_PASSWORD}>Forgot Password?</Link>
            </button>
          </div>
            
            <ReCAPTCHA 
            ref={recaptchaRef}
            sitekey={sitekey}
            onChange={handleRecaptcha}
            />
            
          

            <Button type="submit" onClick={handleLoginSubmit} spinner={spinnerAnimation}>Log In</Button>

          <div className="text-center">
            <span className="text-gray-600 text-sm">
              Don't have an account yet?{" "}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                 {/* <Button type="submit">Sign up</Button> */}
                <Link to={ROUTES_URL.SIGN_UP}>Sign Up</Link>
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
