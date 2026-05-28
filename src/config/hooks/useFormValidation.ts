import { useState } from 'react';
import validateEmail from '../validations/ValidateEmail';
import validateMobileNumber from '../validations/ValidateMobileNumber';
import { STRING_VALUES } from '../../constants/AppConstants';
import REGEX from '../../constants/Regex';
import MESSAGE from '../../constants/Messages';
import validateUrl from '../validations/ValidateUrl';
import validateLocation from '../validations/ValidateLocation';


export type ErrorType = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  mobileNumber?: string;
  name?: string;
  barcode?: string;
  description?: string;
  cost?: string;
  taxRate?: string;
  cess?: string;
  validFrom?: string;
  hsn?: string;
  sac?: string;
  url?: string;
  companyUserCount?: string;
  monthsToPurchase?: string;
  companyUserCountForUpdateSubscription?: string
  purchaseDate?: string;
  deliveryDate?: string;
  installationDate?: string;
  warrantyStartDate?: string;
  quantity?: string;
  version?: string;
  location?: string;
  mininumStock? : string

};

export type FormType = 'registered' | 'registration';

export const useFormValidation = (formData: Record<string, string | number | boolean | number[] | undefined>, formType: FormType) => {
  const [errors, setErrors] = useState<ErrorType>({});




  const handleBlur = (e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>) => {
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
      case "url":
        if (value === null || value.trim() === "") {
          setErrors((prev) => ({ ...prev, url: "" }));
        } else {
          if (!validateUrl(value)) {
            setErrors((prev) => ({
              ...prev,
              url: "Enter valid URL or leave it blank",
            }));
          } else {
            setErrors((prev) => ({ ...prev, url: "" }));
          }
        }

        break;
      
      case "version":
        if (value === null || value.trim() === "") {
          setErrors((prev) => ({ ...prev, version: "Version is required" }));
        } else {
            setErrors((prev) => ({
              ...prev,
              version: "",
            }));
        }

        break;

      case "password":
        if (!value) {
          setErrors((prev) => ({ ...prev, password: "Password is required" }));
        } else if (formType === STRING_VALUES.REGISTRATION && !REGEX.PASSWORD.test(value)) {
          setErrors((prev) => ({
            ...prev,
            password: MESSAGE.ERROR.PASSWORD_VALIDATION_ERROR,
          }));
        } else if (formType === STRING_VALUES.REGISTRATION && formData.confirmPassword !== null && formData.confirmPassword !== "" && value !== formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            password: "Passwords adas do not match.",
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
              confirmPassword: "Confirm password is required.",
            }));
          } else if (value !== formData.password) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: "Passwords do not match.",
            }));
          } else if (formType === STRING_VALUES.REGISTRATION && !REGEX.PASSWORD.test(value)) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: MESSAGE.ERROR.PASSWORD_VALIDATION_ERROR,
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
            mobileNumber: "Please enter a valid 10-digit mobile number without country code or spaces.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, mobileNumber: "" }));
        }
        break;

      case "name":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, name: "Name is required" }));
        } else if (formType === STRING_VALUES.REGISTRATION && !REGEX.NAME_SPACE_DOT_ALLOWED_ONLY.test(value)) {
          setErrors((prev) => ({ ...prev, name: MESSAGE.ERROR.NAME_SPACE_AND_DOT_ERROR }));
        }
        else {
          setErrors((prev) => ({ ...prev, name: "" }));
        }
        break;

      case "barcode":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          console.log("inside barcode");
          setErrors((prev) => ({ ...prev, barcode: "Item Code is required" }));
        }
        else {
          setErrors((prev) => ({ ...prev, barcode: "" }));
        }
        break;

      case "description":
        if (formType === STRING_VALUES.REGISTRATION) {
          if (value === "") {
            setErrors((prev) => ({ ...prev, description: "Description is required" }));
          }
          else {
            setErrors((prev) => ({ ...prev, description: "" }));
          }
        }
        break;

      case "taxRate":
        if (formType === STRING_VALUES.REGISTRATION) {
          if (value === "") {
            setErrors((prev) => ({ ...prev, taxRate: "if tax rate given , valid from is madatory." }));
          }
          else {
            setErrors((prev) => ({ ...prev, taxRate: "" }));
          }
        }
        break;

        case "cess":
          if (formType === STRING_VALUES.REGISTRATION) {

            const numericValue = parseFloat(value);

            console.log(value);
            console.log(typeof value);
            if (value === "") {
              setErrors((prev) => ({ ...prev, cess: "" }));
            } else if (numericValue < 0) {
              setErrors((prev) => ({ ...prev, cess: "Cess cannot be negative" }));
            } else {
              setErrors((prev) => ({ ...prev, cess: "" }));
            }
          }
          break;
          
      case "validFrom":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, validFrom: "mandatory if tax rate is given." }));
        }
        else {
          setErrors((prev) => ({ ...prev, validFrom: "" }));
        }
        break;

      case "hsn":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, hsn: "HSN is required" }));
        }
        else {
          setErrors((prev) => ({ ...prev, hsn: "" }));
        }
        break;

      case "sac":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, sac: "SAC is required" }));
        }
        else {
          setErrors((prev) => ({ ...prev, sac: "" }));
        }
        break;
      case "numberOfUsers":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, companyUserCount: "minimum 1 user required" }));
        }
        else {
          setErrors((prev) => ({ ...prev, companyUserCount: "" }));
        }
        break;


      case "monthsToPurchase":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, monthsToPurchase: "minimum 1 month subscription is required" }));
        } else {
          setErrors((prev) => ({ ...prev, monthsToPurchase: "" }));
        }
        break;

      case "companyUserCountForUpdateSubscription":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, companyUserCountForUpdateSubscription: "minimum 1 user is required" }));
        } else {
          setErrors((prev) => ({ ...prev, companyUserCountForUpdateSubscription: "" }));
        }
        break;

      case "purchaseDateString":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, purchaseDate: "Purchase Date is required" }));
        }
        else {
          setErrors((prev) => ({ ...prev, purchaseDate: "" }));
        }
        break;
      case "quantity":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, quantity: "Quantity is required" }));
        }
         else if (formType === STRING_VALUES.REGISTRATION && value === "0") {
          setErrors((prev) => ({ ...prev, quantity: "Quantity is required" }));
        }
        else {
          setErrors((prev) => ({ ...prev, quantity: "" }));
        }
        break;
        case "deliveryDate":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, deliveryDate: "Delivery date is required" }));
        }
        else {
          setErrors((prev) => ({ ...prev, deliveryDate: "" }));
        }
        break;
        case "installationDate":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, installationDate: "Installation date is required" }));
        }
        else {
          setErrors((prev) => ({ ...prev, installationDate: "" }));
        }
        break;
        case "warrantyStartDate":
        if (formType === STRING_VALUES.REGISTRATION && value === "") {
          setErrors((prev) => ({ ...prev, warrantyStartDate: "Warranty start date is required" }));
        }
        else {
          setErrors((prev) => ({ ...prev, warrantyStartDate: "" }));
        }
        break;
        case "location":
        if (!validateLocation(value) && value.length) {
          setErrors((prev) => ({ ...prev,
            location: "Please enter a valid location (letters, numbers, spaces, and common punctuation allowed)",
          }));
        } else {
          setErrors((prev) => ({ ...prev, location: "" }));
        }
        break;
         case "minimumStock":
        if (formType === STRING_VALUES.REGISTRATION && Number(value)<=0) {
          setErrors((prev) => ({ ...prev,
          mininumStock  : "Minimum stock is required.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, mininumStock: "" }));
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

    if (!formData.url) {
      if (!validateUrl(formData.url!.toString())) {
        newErrors.url = "Enter a valid url or leave it blank";
      }
    } else {
      newErrors.url = "";
    }

    if (!formData.version) {
      if(formData.version?.toString().trim() === ""){
        newErrors.version = "Version is required";
      }
    } else {
      newErrors.version = "Version is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    // SignUp specific validations
    if (formType === STRING_VALUES.REGISTRATION && formData.password) {
      if (formData.password.toString().length < 8 || formData.password.toString().length > 20) {
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