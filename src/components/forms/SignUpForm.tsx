import React, { useState } from "react";
import CredentialSignUp from "../../@types/auth/forms/SignUpFormProps";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

/**
 * created functional components for SignUp Form
 * @returns the xml for signUp form
 */
const SignUpPage: React.FC = () => {
  /**
   * state is defined for getting values from the input fields.
   */
  const [SignUpData, setSignUpData] = useState<CredentialSignUp>({
    name: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [, setMessage] = useState<string>("");

  const onChange = (value: string | null) => {
    setCaptchaToken(value);
  };
  /**
   * state is defined for logging the errors
   */
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

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

    if (name === "password") {
      if (!value) {
        setErrors((prev) => ({ ...prev, password: "Password is required" }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }

    if (name === "confirmPassword") {
      if (value !== SignUpData.password) {
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
    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  /**
   *
   * @param field : which is the field to be validated
   * common method is defined for toggling the visibility of password and confirm password
   */
  /**
   *
   * @param e is an react formEvent
   * validation done here before submitting the form for email,password and confirm password.
   * checks the password and confirmPassword are same or not.
   * checks the email id given or not.
   * @returns the alerts
   *
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!SignUpData.email) {
      setErrors((prev) => ({
        ...prev,
        "email": "Email Address is required!" ,
      }));
      
    }

    if (!validateEmail(SignUpData.email)) {
      setErrors((prev) => ({
        ...prev,
        "email": "Email Address must be valid!" ,
      }));
     
    }

    if (SignUpData.password !== SignUpData.confirmPassword) {
      alert("Passwords do not match!");
      setErrors((prev) => ({
        ...prev,
        "confirmPassword": "Passwords do not match!" ,
      }));
    }

    if (captchaToken) {
      setMessage("CAPTCHA verified successfully!");
    } else {
      setMessage("Please complete the CAPTCHA.");
    }

   

    
    const signupDataPost = {
      name : SignUpData.name,
      mobilenumber: SignUpData.mobileNumber,
      email: SignUpData.email,
      login_password: SignUpData.password
    };
    if(signupDataPost.email != "" && signupDataPost.mobilenumber  != "" && signupDataPost.name  != "" && signupDataPost.login_password  != "" && SignUpData.confirmPassword != ""){
      axios.post("/api/authentication/purple-crm-api/signup",signupDataPost)
      .then(respone => {
        console.log(respone);
        alert(respone.data.message);
        if(respone.data.status === true){
          const sendVerificationEmailPost = {
            onboarding_status_id : 2,
            email_sent : false
          }
          axios.post("/api/notification/purple-crm-api/send-signup-verification-mail",sendVerificationEmailPost)
          .then(response => {
            if(response.data == "Email Sent"){
              alert("Verification Email Sent Check your Email");
              window.location.href = '/signin';
            }
          })
          .catch(error => {
            console.log(error);
          });
        }

      })
      .catch(error => {
       console.log(error)
      })
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
                value={SignUpData.name}
                onChange={handleChange}
                maxLength={100}
                
            />
            {/* </div> */}
            <FormInput
                label="Mobile Number"
                type="text"
                name="mobileNumber"
                placeholder="99xxxxxxxx"
                value={SignUpData.mobileNumber}
                onChange={handleChange}
                maxLength={15}
              />

          

            {/* Email Field */}
            
              <FormInput
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={SignUpData.email}
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
                value={SignUpData.password}
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
                placeholder="confirm password"
                value={SignUpData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                minLength={8}
                maxLength={20}
                required
                error={errors.password}
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
                          <Link to="/signin">Log In</Link>
                        </button>
                      </span>
                    </div>
            
          </form>
           
      </>
  );
};

export default SignUpPage;
