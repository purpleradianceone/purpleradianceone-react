import { useState } from 'react';
import validateEmail from '../validations/ValidateEmail';
import validateMobileNumber from '../validations/ValidateMobileNumber';
import { BOOLEAN_VALUES, STRING_VALUES } from '../../constants/AppConstants';


export type ErrorType = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  mobileNumber?: string;
  name?: string;
};

export type FormType = 'registered' | 'registration';

export const useFormValidation = (formData: Record<string, string>, formType: FormType) => {
  const [errors, setErrors] = useState<ErrorType>({});




  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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
        
        if (formType === STRING_VALUES.REGISTRATION && !validateMobileNumber(value)) {
          
          setErrors((prev) => ({
            ...prev,
            mobileNumber: "Please enter a valid mobile number",
          }));
        } else {
          setErrors((prev) => ({ ...prev, mobileNumber: "" }));
        }
        break;

      case "name":
        if (formType === STRING_VALUES.REGISTRATION && value === STRING_VALUES.EMPTY_STRING) {
          setErrors((prev) => ({ ...prev, name: "Name is required" }));
        } else {
          setErrors((prev) => ({ ...prev, name: "" }));
        }
        break;
    }
  };

  const validateForm = (): boolean => {
    let isValid = BOOLEAN_VALUES.TRUE;
    const newErrors: ErrorType = {};

    // Common validations for both forms
    if (!formData.email) {
      newErrors.email = "Email Address is required";
      isValid = BOOLEAN_VALUES.FALSE;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email Address must be valid";
      isValid = BOOLEAN_VALUES.FALSE;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = BOOLEAN_VALUES.FALSE;
    }

    // SignUp specific validations
    if (formType === STRING_VALUES.REGISTRATION) {
      if (formData.password.length < 8 || formData.password.length > 20) {
        newErrors.password = "Password must be between 8 to 20 characters";
        isValid = BOOLEAN_VALUES.FALSE;
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
        isValid = BOOLEAN_VALUES.FALSE;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = BOOLEAN_VALUES.FALSE;
      }

      if (formData.mobileNumber && !validateMobileNumber(formData.mobileNumber)) {
        newErrors.mobileNumber = "Please enter a valid mobile number";
        isValid = BOOLEAN_VALUES.FALSE;
      }

      if (!formData.name) {
        newErrors.name = "Name is required";
        isValid = BOOLEAN_VALUES.FALSE;
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