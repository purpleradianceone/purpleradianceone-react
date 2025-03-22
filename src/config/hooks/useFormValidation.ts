import { useState } from 'react';
import validateEmail from '../validations/ValidateEmail';
import validateMobileNumber from '../validations/ValidateMobileNumber';
import {  STRING_VALUES } from '../../constants/AppConstants';


export type ErrorType = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  mobileNumber?: string;
  name?: string;
  code? : string;
  description? : string;
  cost? : string;
  taxRate? : string;
  validFrom? :string;
  hsn? :string;
  sac? : string;
};

export type FormType = 'registered' | 'registration';

export const useFormValidation = (formData: Record<string, string|number|boolean|number[]|undefined>, formType: FormType) => {
  const [errors, setErrors] = useState<ErrorType>({});




  const handleBlur = (e: React.FocusEvent<HTMLInputElement>| React.FocusEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
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
        break;

      case "password":
        if (!value) {
          setErrors((prev) => ({ ...prev, password: "Password is required" }));
        } else if (formType === STRING_VALUES.REGISTRATION && (value.length < 8 || value.length > 20)) {
          setErrors((prev) => ({
            ...prev,
            password: "Password must be between 8 to 20 characters",
          }));
        } else {
          setErrors((prev) => ({ ...prev, password: "" }));
        }
        break;

      case "confirmPassword":
        if (formType === STRING_VALUES.REGISTRATION) {
          if (!value) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: "Confirm password is required",
            }));
          } else if (value !== formData.password) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: "Passwords do not match",
            }));
          } else {
            setErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }
        }
        break;

      case "mobileNumber":
        
        if (formType === STRING_VALUES.REGISTRATION && !validateMobileNumber(value) && value.length) {
          
          setErrors((prev) => ({
            ...prev,
            mobileNumber: "Please enter a valid mobile number",
          }));
        } else {
          setErrors((prev) => ({ ...prev, mobileNumber: "" }));
        }
        break;

      case "name":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, name: "Name is required" }));
        } else {
          setErrors((prev) => ({ ...prev, name: "" }));
        }
        break;

        case "code" :
          if(formType === STRING_VALUES.REGISTRATION && value === "") {
            console.log("inside code");
            setErrors((prev) => ({ ...prev, code: "Item Code is required"}));
          }
          else{
            setErrors((prev) => ({ ...prev, code: "" }));
          }
          break;

        case "description" :
          if(formType === STRING_VALUES.REGISTRATION){
            if(value === "") {
              setErrors((prev) => ({ ...prev, description: "Description is required"}));
            }
            else{
              setErrors((prev) => ({ ...prev, description: "" }));
            }
          }
          break;

        case "taxRate" :
          if(formType === STRING_VALUES.REGISTRATION){
            if(value === "") {
              setErrors((prev) => ({ ...prev, taxRate: "Tax Rate is required"}));
            }
            else{
              setErrors((prev) => ({ ...prev, taxRate: "" }));
            }
          }
          break;

        case "validFrom" : 
        if(formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, validFrom: "Valid From is required"}));
        }
        else{
          setErrors((prev) => ({...prev,validFrom : ""}));
        }
        break;

        case "hsn" :
          if(formType === STRING_VALUES.REGISTRATION && value === "") {
            setErrors((prev) => ({ ...prev, hsn: "HSN is required"}));
          }
          else{
            setErrors((prev) => ({ ...prev, hsn: "" }));
          }
          break;

        case "sac" :
          if(formType === STRING_VALUES.REGISTRATION && value === "") {
            setErrors((prev) => ({ ...prev, sac: "SAC is required"}));
          }
          else{
            setErrors((prev) => ({ ...prev, sac: "" }));
            }
            break;

    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: ErrorType = {};

    // Common validations for both forms
    if (!formData.email) {
      newErrors.email = "Email Address is required";
      isValid = false;
    } else if (!validateEmail(formData.email.toString())) {
      newErrors.email = "Email Address must be valid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    // SignUp specific validations
    if (formType === STRING_VALUES.REGISTRATION && formData.password) {
      if (formData.password.toString().length <  8 || formData.password.toString().length > 20) {
        newErrors.password = "Password must be between 8 to 20 characters";
        isValid = false;
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }

      if (formData.mobileNumber && !validateMobileNumber(formData.mobileNumber.toString())) {
        newErrors.mobileNumber = "Please enter a valid mobile number";
        isValid = false;
      }

      if (!formData.name) {
        newErrors.name = "Name is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  return {
    errors,
    setErrors,
    handleBlur,
    validateForm
  };
};