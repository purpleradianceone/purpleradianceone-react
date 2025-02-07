import React, { useState } from "react";
import SignUpFormDataType from "../../@types/auth/forms/SignUpFormDataType";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import EmailSentAnimation from "../../assets/animations/EmailSentAnimation";
import MessageSnackBar from "../ui/MessageSnackbar";
import  POST_API  from "../../constants/PostApi";
import ROUTES_URL from "../../constants/Routes";
/**
 * created functional components for SignUp Form
 * @returns the xml for signUp form
 */
const SignUpForm: React.FC = () => {
  /**
   * state is defined for getting values from the input fields.
   */
  const [SignUpFormData, setSignUpFormData] = useState<SignUpFormDataType>({
    name: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showEmailSentAnimation,setShowEmailSentAnimation] = useState<boolean>(false);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);


  const onChange = (value: string | null) => {
    setCaptchaToken(value);
  };
  /**
   * state is defined for logging the errors
   */
  const [errors, setErrors] = useState<{
    email?:string,
    password?:string,
    confirmPassword?:string,
    mobileNumber?:string
  }>({});

  /**
   * state is defined for toggling the visibility of password and confirmPassword, default false.
   */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword,setConfirmPassword] = useState(false);

  

  /**
   *
   * @param email for validation
   * @returns boolean , does email validation using provided regex
   */
  const validateEmail = (email: string): boolean => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  /**
   * for alert Message 
   */
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

  const handleClose=()=>{
    setSnackbar(prev=>({...prev , open:false}))
  }

  /**
   *
   * @param e is the focusEvent
   * below method does the validation of password , confirmPassword and email
   * using onBlur function , when focus get to the different inputfield ,
   * it checks data entered is correct or not as per requirements.
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    if (name === "email") {
      if (!value) {
        setErrors((prev) => ({ ...prev, email: "Email Address is required" }));
      } else if (!validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Email Address must be valid",
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }
    // 
    const mobileRegex = /^[0-9]{10,15}$/;

    
    if (name === "mobileNumber") {
      if (!mobileRegex.test(value) && value !=="") {
        setErrors((prev) => ({ ...prev, mobileNumber: "Please enter a valid mobile number." }));
      }  else {
        setErrors((prev) => ({ ...prev, mobileNumber: "" }));
      }
    }

    if (name === "password") {
      if (!value) {
        setErrors((prev) => ({ ...prev, password: "Password is required" }));
      }else if (value.length <8 || value.length>20){
        setErrors((prev) => ({ ...prev, password: "Password must be between 8 to 20 characters" }));
      } 
      else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }

    if (name === "confirmPassword") {
      if(!value){
        setErrors((prev)=> ({
          ...prev, confirmPassword:" confirm password is required"
        }))
      }
      
      else if (value !== SignUpFormData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Password and Confirm Password do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  /**
   *
   * @param e is the changeEvent
   * sets the form data of particular field when onChange gets fired of that field
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 
  
  /**
   *
   * @param e is an react formEvent
   * validation done here before submitting the form for email,password and confirm password.
   * checks the password and confirmPassword are same or not.
   * checks the email id given or not.
   * @returns the alerts
   *
   */

  //THIS IS THE MAIN METHOD FOR SIGN UP
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //Regex for password and confirm password length
   
    const passwordRegex = /^.{8,20}$/;
    if (!SignUpFormData.email) {
      setErrors((prev) => ({
        ...prev,
        email: "Email Address is required!",
      }));
    } else if (!validateEmail(SignUpFormData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Email Address must be valid!",
      }));
    }

    if (!SignUpFormData.password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required!",
      }));
    } else if (!passwordRegex.test(SignUpFormData.password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be between 8 to 20 characters!",
      }));
      return;
    }

    if (!SignUpFormData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirm Password is required!",
      }));
    } else if (SignUpFormData.password !== SignUpFormData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match!",
      }));
      return;
    }

    const signupDataPost = {
      fullname : SignUpFormData.name?.trim(),
      mobilenumber: SignUpFormData.mobileNumber?.trim(),
      email: SignUpFormData.email.trim(),
      password: SignUpFormData.password.trim()
    };

    if(signupDataPost.email != ""  && signupDataPost.password  != "" && SignUpFormData.confirmPassword != ""){

      if(captchaToken !== ""){
        const captchaRequest = {
          token : captchaToken
        }
      axios.post(POST_API.VERIFIY_CAPTCHA,captchaRequest)
      .then(response => {
        if(response.data.status){
          axios.post(POST_API.SIGN_UP,signupDataPost)
      .then(respone => {
        console.log(respone);

        if(respone.data.status === true){
          console.log(respone.data.message);
          if(respone.data.message=="Your email is already verified. You can now log in and start using your account."){
            
            showSnackbar(respone.data.message,'error');
          }else{
            showSnackbar(respone.data.message,'success');
            setShowEmailSentAnimation(!showEmailSentAnimation);
          }
          setTimeout(()=>{
            window.location.href = ROUTES_URL.SIGN_IN;
          },5000)
        }else{
          showSnackbar(respone.data.message,'error');
        }

      })
      .catch(error => {
       console.log(error)
      })
        }

      })
      .catch(error => {
        console.log(error)
        showSnackbar("Invalid Captcha","error");
      })
    }
    else{
      showSnackbar("Please complete the captcha","error");
    }
    
    }
    else{
      showSnackbar('Fill required fields','error');
    }
  };

  /**
   * xml written below
   */
  return (
    <>
          {/* form  */}
          <form className="space-y-5">
            {/* <div className="mb-3"> */}
            <FormInput
                label="Full Name"
                type="text"
                name="name"
                placeholder="Enter full name"
                value={SignUpFormData.name}
                onChange={handleChange}
                maxLength={100}
                
            />
            {/* </div> */}
            <FormInput
                label="Mobile Number"
                type="text"
                name="mobileNumber"
                placeholder="99xxxxxxxx"
                value={SignUpFormData.mobileNumber}
                onChange={handleChange}
                maxLength={15}
                onBlur={handleBlur}
                //  inputMode="numeric"
                // pattern="[0-9]*"
                error={errors.mobileNumber}
                
              />

            {/* Email Field */}
            
              <FormInput
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={SignUpFormData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
              />
              
            {/* Password Field */}
            <FormInput
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={SignUpFormData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                minLength={8}
                maxLength={20}
                required
                error={errors.password}
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
            {/* Confirm Password Field */}
            <FormInput
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={SignUpFormData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                minLength={8}
                maxLength={20}
                required
                error={errors.confirmPassword}
                rightElement={
                              <button
                                type="button"
                                onClick={() => setConfirmPassword(!showConfirmPassword)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            }
              />
            <ReCAPTCHA
              sitekey="6LcLKaYqAAAAANtiPbLxFRpgPCS9oG4aecWlA-70" // Replace with your site key
              onChange={onChange}
            />

            {/* Button for submitting the form */}
            <Button type="submit" onClick={handleSubmit}>Sign Up</Button>
          
            <div className="text-center">
                      <span className="text-gray-600 text-sm">
                        Already Have an account?{" "}
                        <button
                          type="button"
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          <Link to={ROUTES_URL.SIGN_IN}>Log In</Link>
                        </button>
                      </span>
                    </div>
            
          </form>

          {showEmailSentAnimation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95">
                    <div className="bg-white p-6 h-auto w-auto rounded-2xl shadow-lg animate-fade-in">
                      <button></button>
                      <h2 className="text-lg font-semibold text-center">Please Check Your Email</h2>
                      <EmailSentAnimation/>
                      
                        
                    </div>
                </div>
            )}

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

export default SignUpForm;
