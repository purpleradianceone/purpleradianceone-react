import React, { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Calendar,
  User,
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
import { STATUS_CODE } from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";

interface AccountDetailsProps {
  company: Account;
  onClose: () => void;
  indutryTypeData?: industryType[];
  businessTypeData: BusinessType[];
fetchAccounts : () => Promise<void>;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({
  company,
  onClose,
  indutryTypeData,
  businessTypeData,
  fetchAccounts

}) => {
  const {loginStatus} = useLoggedInUserContext();
  const { userPreference } = useUserPreference();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<Account>(company);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case 'name':
        return !value.trim() ? 'Company name is required' : '';
      case 'email':
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Email is required';
        if (!REGEX.EMAIL.test(value)) return 'Please enter a valid email';
        return '';
      case 'mobileNumber':
        // const phoneRegex = /^[0-9]{10}$/;
        if (!value.trim()) return 'Mobile number is required';
        if (!REGEX.MOBILE_NUMBER_NEW.test(value.replace(/\D/g, ''))) return 'Please enter a valid 10-digit mobile number';
        return '';
      default:
        return '';
    }
  };

  const handleUpdateAccountDetails = async (fieldName: string, value: string) => {
    const error = validateField(fieldName, value);
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
      return;
    }

    setErrors(prev => ({ ...prev, [fieldName]: '' }));
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
      updatedby_id: loginStatus.id
    };
    
      await axios.post(POST_API.UPDATE_ACCOUNT, postData, { withCredentials: true })
      .then((response)=>{
        if(response.data.status ){
          toast.success(response.data.message);
          setFormData(prev => ({ ...prev, [fieldName]: value }));
        }else{
          toast.error(response.data.message)
        }
        fetchAccounts()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }).catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithTwoParamsNotEvent: handleUpdateAccountDetails,
          });
          if (refreshTokenResponse) {
            handleUpdateAccountDetails(fieldName , value);
          }
        } else {
          toast.error(error.response.data);
        }
      })
  };

  const handleFieldClick = (fieldName: string) => {
    if (!['createdOn', 'createdBy'].includes(fieldName)) {
      setEditingField(fieldName);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleDropdownChange = (fieldName: string, selectedId: string, selectedName: string) => {
    if (fieldName === 'businessTypeName') {
      setFormData(prev => ({ 
        ...prev, 
        businessTypeId: parseInt(selectedId),
        businessTypeName: selectedName 
      }));
    } else if (fieldName === 'industryTypeName') {
      setFormData(prev => ({ 
        ...prev, 
        industryTypeId: parseInt(selectedId),
        industryTypeName: selectedName 
      }));
    }
  };

  const handleInputBlur = (fieldName: string) => {
    const value = formData[fieldName as keyof Account] as string;
    if (value !== company[fieldName as keyof Account]) {
      handleUpdateAccountDetails(fieldName, value);
    }
    setEditingField(null);
  };

  const handleDropdownBlur = (fieldName: string) => {
    const currentValue = fieldName === 'businessTypeName' ? formData.businessTypeName : formData.industryTypeName;
    const originalValue = fieldName === 'businessTypeName' ? company.businessTypeName : company.industryTypeName;
    
    if (currentValue !== originalValue) {
      handleUpdateAccountDetails(fieldName, currentValue || '');
    }
    setEditingField(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter') {
      handleInputBlur(fieldName);
    } else if (e.key === 'Escape') {
      setFormData(prev => ({ ...prev, [fieldName]: company[fieldName as keyof Account] }));
      setEditingField(null);
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
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
              value={fieldName === 'businessTypeName' ? formData.businessTypeId || '' : formData.industryTypeId || ''}
              onChange={(e) => {
                const selectedOption = options.find(opt => opt.id!.toString() === e.target.value);
                if (selectedOption) {
                  handleDropdownChange(fieldName, e.target.value, selectedOption.name!);
                }
              }}
              onBlur={() => handleDropdownBlur(fieldName)}
              className={`w-full font-medium text-slate-800 bg-white border-2 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError ? 'border-red-500' : 'border-blue-500'
              }`}
              autoFocus
            >
              <option value="">{placeholder}</option>
              {options
                .filter(option => option.isactive!)
                .map(option => (
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
            className="font-medium text-slate-800 cursor-pointer hover:bg-slate-100 rounded px-2 py-1 transition-colors"
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
    type: string = "text"
  ) => {
    const isEditing = editingField === fieldName;
    const isReadOnly = ['createdOn', 'createdBy'].includes(fieldName);
    const isMandatory = ['name', 'email', 'mobileNumber'].includes(fieldName);
    const hasError = errors[fieldName];

    return (
      <div className="relative">
        {isEditing ? (
          <div>
            <input
              type={type}
              value={formData[fieldName as keyof Account] as string || ''}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              onBlur={() => handleInputBlur(fieldName)}
              onKeyDown={(e) => handleKeyPress(e, fieldName)}
              placeholder={placeholder}
              className={`w-full font-medium text-slate-800 bg-white border-2 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError ? 'border-red-500' : 'border-blue-500'
              }`}
              autoFocus
            />
            {hasError && (
              <p className="text-xs text-red-500 mt-1">{hasError}</p>
            )}
          </div>
        ) : (
          <div
            onClick={() => handleFieldClick(fieldName)}
            className={`font-medium text-slate-800 ${
              !isReadOnly ? 'cursor-pointer hover:bg-slate-100 rounded px-2 py-1 transition-colors' : ''
            } ${!value && !isReadOnly ? 'text-slate-400 italic' : ''} ${
              isMandatory && !value ? 'border border-red-300 bg-red-50' : ''
            }`}
          >
            {value || (isReadOnly ? 'N/A' : placeholder)}
            {!isReadOnly && (
              <Edit3 className="inline-block ml-2 h-3 w-3 text-slate-400" />
            )}
            {isMandatory && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={` ${
        userPreference.isLeftMenu ? " ml-14 " : ""
      } mt-8 mb-9 fixed inset-0 bg-white z-10 overflow-auto  mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen`}
    >
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-slate-200">
        <button
          className="flex items-center text-xs text-gray-400 gap-1  border-gray-400 rounded-md  p-1 bg-blue-0 hover:bg-blue-00 hover:text-indigo-500 hover:border-blue-600"
          onClick={onClose}
        >
          <ArrowLeft size={14} /> <span>back to accounts</span>
        </button>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {renderEditableField('name', formData.name, 'Enter company name')}
              </h1>
              <div className="text-slate-600 mt-1">
                {renderDropdownField('industryTypeName', formData.industryTypeName, indutryTypeData || [], 'Select industry type')}
              </div>
              <div className="flex items-center mt-2">
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
        </div>

        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-lg">
          <div className="flex items-center text-slate-700">
            <Factory className="h-4 w-4 mr-2" />
            <div className="font-medium">
              {renderDropdownField('businessTypeName', formData.businessTypeName, businessTypeData || [], 'Select business type')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-500" />
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
              <Mail className="h-4 w-4 text-slate-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-slate-600">Email</p>
                {renderEditableField('email', formData.email, 'Enter email address', 'email')}
              </div>
            </div>
            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
              <Phone className="h-4 w-4 text-slate-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-slate-600">Mobile</p>
                {renderEditableField('mobileNumber', formData.mobileNumber, 'Enter mobile number', 'tel')}
              </div>
            </div>
            <div className="flex items-center p-3 bg-slate-50 rounded-lg">
              <Globe className="h-4 w-4 text-slate-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-slate-600">Website</p>
                {editingField === 'website' ? (
                  renderEditableField('website', formData.website, 'Enter website URL', 'url')
                ) : (
                  <div onClick={() => handleFieldClick('website')} className="cursor-pointer hover:bg-slate-100 rounded px-2 py-1 transition-colors">
                    {formData.website ? (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {formData.website}
                      </a>
                    ) : (
                      <span className="font-medium text-slate-400 italic">Enter website URL</span>
                    )}
                    <Edit3 className="inline-block ml-2 h-3 w-3 text-slate-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legal Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-500" />
            Legal Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <p className="text-xs text-green-600 font-medium mb-1">PAN</p>
              {renderEditableField('pan', formData.pan, 'Enter PAN number')}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-600 font-medium mb-1">GST</p>
              {renderEditableField('gst', formData.gst, 'Enter GST number')}
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-xs text-purple-600 font-medium mb-1">TAN</p>
              {renderEditableField('tan', formData.tan, 'Enter TAN number')}
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-xs text-orange-600 font-medium mb-1">
                Registration
              </p>
              {renderEditableField('businessResgistrationNumber', formData.businessResgistrationNumber, 'Enter registration number')}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-red-500" />
            Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Billing Address
              </h3>
              <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                {renderEditableField('billingAddress', formData.billingAddress, 'Enter billing address')}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Shipping Address
              </h3>
              <div className="text-sm text-slate-600 bg-green-50 p-3 rounded-lg border border-green-100">
                {renderEditableField('shippingAddress', formData.shippingAddress, 'Enter shipping address')}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Registered Office
              </h3>
              <div className="text-sm text-slate-600 bg-purple-50 p-3 rounded-lg border border-purple-100">
                {renderEditableField('registeredOfficeAddress', formData.registeredOfficeAddress, 'Enter registered office address')}
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
            System Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
              <User className="h-8 w-8 text-indigo-500 mr-4" />
              <div>
                <p className="text-sm text-indigo-600 font-medium">
                  Created By
                </p>
                <p className="text-lg font-semibold text-slate-800 capitalize">
                  {formData.createdBy}
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
              <Calendar className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Created On</p>
                <p className="text-lg font-semibold text-slate-800">
                  {formatDate(formData.createdOn)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;