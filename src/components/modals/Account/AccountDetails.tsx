/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Factory,
  ArrowLeft,
  Edit3,
} from "lucide-react";
import Account from "../../../@types/account/Account";
import { useUserPreference } from "../../../context/user/UserPreference";
import industryType from "../../../@types/general/industryType";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import BusinessType from "../../../@types/account/BusinessType";
import REGEX from "../../../constants/Regex";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import {
  MOBILE_NUMBER_VALIDATION,
  STATUS_CODE,
} from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import AccountContact from "./Account-contact/AccountContact";

interface AccountDetailsProps {
  company: Account;
  onClose: () => void;
  indutryTypeData?: industryType[];
  businessTypeData: BusinessType[];
  fetchAccounts: () => Promise<void>;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({
  company,
  onClose,
  indutryTypeData = [],
  businessTypeData = [],
  fetchAccounts,
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const { userPreference } = useUserPreference();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<Account>(company);
  const [originalValues, setOriginalValues] = useState<{
    [key: string]: string;
  }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<"contact" | "legal" | "address">(
    "contact"
  );

  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case "name":
        if (!value.trim()) return "Company name is required";
        if (value.length > 40)
          return "Company name cannot exceed 40 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (value.length > 50) return "Email cannot exceed 50 characters";
        if (!REGEX.EMAIL.test(value)) return "Please enter a valid email";
        return "";
      case "mobileNumber":
        if (!value.trim()) return "Mobile number is required";
        if (!/^\d+$/.test(value))
          return "Mobile number can only contain digits";
        if (!MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(value))
          return "Please enter a valid 10-digit mobile number";
        return "";
      default:
        return "";
    }
  };

  const handleUpdateAccountDetails = async (
    fieldName: string,
    value: string
  ) => {
    const error = validateField(fieldName, value);
    if (error) {
      toast.error(error);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
      // Revert to original value on error
      setFormData((prev) => ({
        ...prev,
        [fieldName]:
          originalValues[fieldName] || company[fieldName as keyof Account],
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    const postData = {
      id: formData.id,
      company_id: loginStatus.companyId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobilenumber: formData.mobileNumber.trim(),
      industry_type_id: formData.industryTypeId,
      business_type_id: formData.businessTypeId,
      pan: formData.pan.trim(),
      gst: formData.gst.trim(),
      tan: formData.tan.trim(),
      billing_address: formData.billingAddress.trim(),
      shipping_address: formData.shippingAddress.trim(),
      registered_office_address: formData.registeredOfficeAddress.trim(),
      business_registration_number: formData.businessResgistrationNumber.trim(),
      website: formData.website.trim(),
      isactive: true,
      updatedby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.UPDATE_ACCOUNT, postData, { withCredentials: true })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          setFormData((prev) => ({ ...prev, [fieldName]: value }));
        } else {
          toast.error(response.data.message);
          // Revert to original value on API error
          setFormData((prev) => ({
            ...prev,
            [fieldName]:
              originalValues[fieldName] || company[fieldName as keyof Account],
          }));
        }
        fetchAccounts();
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithTwoParamsNotEvent: handleUpdateAccountDetails,
          });
          if (refreshTokenResponse) {
            handleUpdateAccountDetails(fieldName, value);
          }
        } else {
          toast.error(error.response.data);
          // Revert to original value on error
          setFormData((prev) => ({
            ...prev,
            [fieldName]:
              originalValues[fieldName] || company[fieldName as keyof Account],
          }));
        }
      });
  };

  const handleFieldClick = (fieldName: string) => {
    if (!["createdOn", "createdBy"].includes(fieldName)) {
      setEditingField(fieldName);
      // Store original value when starting to edit
      setOriginalValues((prev) => ({
        ...prev,
        [fieldName]: formData[fieldName as keyof Account] as string,
      }));
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    // Apply character limits during typing
    let processedValue = value;
    if (fieldName === "name" && value.length > 40) {
      processedValue = value.substring(0, 40);
    }
    if (fieldName === "email" && value.length > 50) {
      processedValue = value.substring(0, 50);
    }
    if (fieldName === "mobileNumber") {
      // Only allow digits for mobile number
      processedValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({ ...prev, [fieldName]: processedValue }));
  };

  const handleDropdownChange = (
    fieldName: string,
    selectedId: string,
    selectedName: string
  ) => {
    if (fieldName === "businessTypeName") {
      setFormData((prev) => ({
        ...prev,
        businessTypeId: parseInt(selectedId),
        businessTypeName: selectedName,
      }));
    } else if (fieldName === "industryTypeName") {
      setFormData((prev) => ({
        ...prev,
        industryTypeId: parseInt(selectedId),
        industryTypeName: selectedName,
      }));
    }
  };

  const handleInputBlur = (fieldName: string) => {
    const currentValue = formData[fieldName as keyof Account] as string;
    const originalValue =
      originalValues[fieldName] ||
      (company[fieldName as keyof Account] as string);

    // Only call API if value actually changed
    if (currentValue !== originalValue) {
      handleUpdateAccountDetails(fieldName, currentValue);
    }
    setEditingField(null);
  };

  const handleDropdownBlur = (fieldName: string) => {
    const currentValue =
      fieldName === "businessTypeName"
        ? formData.businessTypeName
        : formData.industryTypeName;
    const originalValue =
      fieldName === "businessTypeName"
        ? company.businessTypeName
        : company.industryTypeName;

    // Only call API if value actually changed
    if (currentValue !== originalValue) {
      handleUpdateAccountDetails(fieldName, currentValue || "");
    }
    setEditingField(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === "Enter") {
      handleInputBlur(fieldName);
    } else if (e.key === "Escape") {
      // Revert to original value
      setFormData((prev) => ({
        ...prev,
        [fieldName]:
          originalValues[fieldName] || company[fieldName as keyof Account],
      }));
      setEditingField(null);
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const renderDropdownField = (
    fieldName: string,
    value: string,
    options: BusinessType[] | industryType[],
    placeholder: string = "Select option"
  ) => {
    const isEditing = editingField === fieldName;
    const hasError = errors[fieldName];

    return (
      <div className="relative">
        {isEditing ? (
          <div>
            <select
              value={
                fieldName === "businessTypeName"
                  ? formData.businessTypeId || ""
                  : formData.industryTypeId || ""
              }
              onChange={(e) => {
                const selectedOption = options.find(
                  (opt) => opt.id!.toString() === e.target.value
                );
                if (selectedOption) {
                  handleDropdownChange(
                    fieldName,
                    e.target.value,
                    selectedOption.name!
                  );
                }
              }}
              onBlur={() => handleDropdownBlur(fieldName)}
              className={`w-full font-medium text-slate-800 bg-white border-2 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError ? "border-red-500" : "border-blue-500"
              }`}
              autoFocus
            >
              <option value="">{placeholder}</option>
              {options
                .filter((option) => option.isactive!)
                .map((option) => (
                  <option key={option.id} value={option.id!}>
                    {option.name}
                  </option>
                ))}
            </select>
            {hasError && (
              <p className="text-xs text-red-500 mt-1">{hasError}</p>
            )}
          </div>
        ) : (
          <div
            onClick={() => handleFieldClick(fieldName)}
            className="font-medium text-slate-800 cursor-pointer hover:bg-slate-100 rounded px-2 py-1 transition-colors truncate"
          >
            {value || placeholder}
            <Edit3 className="inline-block ml-2 h-3 w-3 text-slate-400" />
          </div>
        )}
      </div>
    );
  };

  const renderEditableField = (
    fieldName: string,
    value: string,
    placeholder: string = "Enter value",
    type: string = "text",
    required: boolean = false
  ) => {
    const isEditing = editingField === fieldName;
    const isReadOnly = ["createdOn", "createdBy"].includes(fieldName);
    const isMandatory = ["name", "email", "mobileNumber"].includes(fieldName);
    const hasError = errors[fieldName];

    // return (
    //   <div className="relative">
    //     {isEditing ? (
    //       <div>
    //         <input
    //           type={type}
    //           required={required}
    //           value={(formData[fieldName as keyof Account] as string) || ""}
    //           onChange={(e) => handleInputChange(fieldName, e.target.value)}
    //           onBlur={() => handleInputBlur(fieldName)}
    //           onKeyDown={(e) => handleKeyPress(e, fieldName)}
    //           placeholder={placeholder}
    //           className={`w-full font-medium text-slate-800 bg-white border-2 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    //             hasError ? "border-red-500" : "border-blue-500"
    //           }`}
    //           autoFocus
    //         />
    //         {hasError && (
    //           <p className="text-xs text-red-500 mt-1">{hasError}</p>
    //         )}
    //       </div>
    //     ) : (
    //       <div
    //         title={value}
    //         onClick={() => handleFieldClick(fieldName)}
    //         className={`font-medium  text-slate-800 truncate ${
    //           !isReadOnly
    //             ? "cursor-pointer hover:bg-slate-100 rounded transition-colors"
    //             : ""
    //         } ${!value && !isReadOnly ? "text-slate-400 italic" : ""} ${
    //           isMandatory && !value ? "border border-red-300 bg-red-50" : ""
    //         }`}
    //       >
    //         {value ||
    //           (isReadOnly ? (
    //             "N/A"
    //           ) : (
    //             <span className="text-xs text-gray-500 font-normal italic">
    //               {placeholder}
    //             </span>
    //           ))}
    //         {!isReadOnly && (
    //           <Edit3 className="inline-block ml-2 h-3 w-3 text-slate-400" />
    //         )}
    //         {isMandatory && <span className="text-red-500 ml-1">*</span>}
    //       </div>
    //     )}
    //   </div>
    // );
    return (
      <div className="relative w-full max-w-full">
        {/* // <div className="relative h-full flex flex-col justify-center"> */}
        {isEditing ? (
          <div className="h-full flex flex-col">
            <input
              type={type}
              required={required}
              value={(formData[fieldName as keyof Account] as string) || ""}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              onBlur={() => handleInputBlur(fieldName)}
              onKeyDown={(e) => handleKeyPress(e, fieldName)}
              placeholder={placeholder}
              className={`w-full h-full font-medium text-slate-800 bg-white border-2 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError ? "border-red-500" : "border-blue-500"
              }`}
              autoFocus
            />
            {hasError && (
              <p className="text-xs text-red-500 mt-1">{hasError}</p>
            )}
          </div>
        ) : (
          <div
            title={value}
            onClick={() => handleFieldClick(fieldName)}
            className={`h-full  flex items-center font-medium text-slate-800 truncate ${
              !isReadOnly
                ? "cursor-pointer hover:bg-slate-100 rounded transition-colors"
                : ""
            } ${!value && !isReadOnly ? "text-slate-400 italic" : ""} ${
              isMandatory && !value ? "border border-red-300 bg-red-50" : ""
            }`}
          >
            {value ||
              (isReadOnly ? (
                "N/A"
              ) : (
                <span className="text-xs text-gray-500 font-normal italic">
                  {placeholder}
                </span>
              ))}
            {!isReadOnly && (
              <Edit3 className="inline-block ml-2 h-3 w-3 text-slate-400" />
            )}
            {isMandatory && <span className="text-red-500 ml-1">*</span>}
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "contact":
        return (
          // <div className="grid  grid-cols-1 sm:grid-cols-2 gap-3 justify-evenly h-full bg-pink-300   items-stretch">
          <div className="grid max-h-full overflow-auto  grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            {/* Email */}
            <div className="col-span-2 flex justify-between p-2 bg-slate-50 border rounded-xl px-3 hover:shadow-sm transition">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="truncate pl-3 w-full overflow-hidden">
                <p className="text-xs text-slate-500">Email</p>
                {renderEditableField(
                  "email",
                  formData.email,
                  "Enter email address",
                  "email",
                  true
                )}
              </div>
            </div>

            {/* Mobile */}
            {/* <div className=" col-span-2  justify-between p-0.5 bg-slate-50 border rounded-xl px-3 hover:shadow-sm transition"> */}
            <div className="flex  col-span-2  bg-slate-50 border rounded-xl p-2 px-3 hover:shadow-sm transition">
              <div className="flex  items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div className="truncate pl-3 w-full overflow-hidden">
                <p className="text-xs text-slate-500">Mobile</p>
                {renderEditableField(
                  "mobileNumber",
                  formData.mobileNumber,
                  "Enter mobile number",
                  "text",
                  true
                )}
              </div>
            </div>

            {/* Website */}
            <div className="p-2 flex gap-2 bg-slate-50 border rounded-xl px-3 hover:shadow-sm transition sm:col-span-2">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div className="truncate ">
                <p className="text-xs  text-slate-500">Website</p>
                {editingField === "website" ? (
                  renderEditableField(
                    "website",
                    formData.website,
                    "Enter website URL",
                    "url"
                  )
                ) : (
                  <div
                    onClick={() => handleFieldClick("website")}
                    className="cursor-pointer flex items-center  hover:bg-slate-100 rounded transition-colors truncate"
                  >
                    {formData.website ? (
                      <a
                        href={formData.website}
                        target="_blank"
                        title={formData.website}
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 transition-colors truncate block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {formData.website}
                      </a>
                    ) : (
                      <span className="font-normal text-xs text-slate-600 italic">
                        Enter website URL
                      </span>
                    )}
                    <Edit3 className="inline-block ml-2 h-3 w-3 text-slate-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "legal":
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <p className="text-xs text-green-600 font-medium mb-1">PAN</p>
              {renderEditableField("pan", formData.pan, "Enter PAN number")}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-600 font-medium mb-1">GST</p>
              {renderEditableField("gst", formData.gst, "Enter GST number")}
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-xs text-purple-600 font-medium mb-1">TAN</p>
              {renderEditableField("tan", formData.tan, "Enter TAN number")}
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-xs text-orange-600 font-medium mb-1">
                Registration
              </p>
              {renderEditableField(
                "businessResgistrationNumber",
                formData.businessResgistrationNumber,
                "Enter registration number"
              )}
            </div>
          </div>
        );

      case "address":
        return (
          <div className="grid grid-cols-1 gap-4   overflow-auto">
            <div className="space-y-2">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Billing Address
              </h3>
              <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                {renderEditableField(
                  "billingAddress",
                  formData.billingAddress,
                  "Enter billing address"
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Shipping Address
              </h3>
              <div className="text-sm text-slate-600 bg-green-50 p-3 rounded-lg border border-green-100">
                {renderEditableField(
                  "shippingAddress",
                  formData.shippingAddress,
                  "Enter shipping address"
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Registered Office
              </h3>
              <div className="text-sm text-slate-600 bg-purple-50 p-3 rounded-lg border border-purple-100">
                {renderEditableField(
                  "registeredOfficeAddress",
                  formData.registeredOfficeAddress,
                  "Enter registered office address"
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`${
        userPreference.isLeftMenu ? "ml-14" : ""
      } mt-8 mb-9 fixed inset-0 bg-white z-10 overflow-auto mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen`}
    >
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow p-2 mb-2 border">
        <button
          className="flex items-center text-xs text-gray-400 gap-1 border-gray-400 rounded-md px-1 pt-1 bg-blue-0 hover:bg-blue-00 hover:text-indigo-500 hover:border-blue-600"
          onClick={onClose}
        >
          <ArrowLeft size={14} /> <span>back to accounts</span>
        </button>

        {/* Main header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-slate-800 truncate">
                {renderEditableField(
                  "name",
                  formData.name,
                  "Enter company name"
                )}
              </h1>
              <div className="text-slate-600 flex items-center">
                <span className="text-xs text-gray-600">Industry type:</span>
                {/* <div className="ml-1 truncate">

                  {renderDropdownField(
                    "industryTypeName",
                    formData.industryTypeName,
                    indutryTypeData || [],
                    "Select industry type"
                  )}
                </div> */}
                <div className="ml-1 truncate">
                  {indutryTypeData && indutryTypeData.length > 0 ? (
                    renderDropdownField(
                      "industryTypeName",
                      formData.industryTypeName,
                      indutryTypeData,
                      "Select industry type"
                    )
                  ) : (
                    <p className="text-gray-400">Loading industry types...</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {formData.isActive ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Inactive</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="grid gap-2 font-semibold text-gray-700">
            <div className="flex items-center justify-between gap-4">
              <span className="grid">
                <span className="text-xs font-normal text-gray-500">
                  Created By
                </span>
                <span className="text-sm truncate">{formData.createdBy}</span>
              </span>
              <span className="grid">
                <span className="text-xs font-normal text-gray-500">
                  Created On
                </span>
                <span className="text-sm truncate">{formData.createdOn}</span>
              </span>
            </div>

            {/* Business type */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-1 rounded-lg">
              <div className="grid items-center text-slate-700">
                <div className="text-gray-600 font-normal text-xs">
                  Business type
                </div>
                <div className="flex items-center">
                  <Factory className="h-4 w-4 mr-2" />
                  <div className="font-medium truncate">
                    {renderDropdownField(
                      "businessTypeName",
                      formData.businessTypeName,
                      businessTypeData || [],
                      "Select business type"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 max-h-72   gap-1">
        {/* Left Card with Tabs */}
        <div className="bg-white rounded-xl   p-3 border border-slate-200">
          {/* Tab Navigation */}
          <div className="flex border-b  border-gray-200 mb-2">
            <button
              onClick={() => setActiveTab("contact")}
              className={`flex items-center px-2  text-sm font-medium rounded-t-lg ${
                activeTab === "contact"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </button>
            <button
              onClick={() => setActiveTab("legal")}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === "legal"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Legal
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === "address"
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Address
            </button>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>

        {/* Right Card - Empty for future use */}
        <div className="bg-white rounded-xl h-72 border p-1 border-slate-200">
          <h3 className="bg-gray-100 text-sm rounded-t-md    px-2   text-gray-700 font-semibold">
            Account Contact
          </h3>
          <AccountContact accountId={company.id} />
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
