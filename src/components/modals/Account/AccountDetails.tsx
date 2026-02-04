/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Edit3,
  Scale,
} from "lucide-react";
import Account from "../../../@types/account/Account";
import { useUserPreference } from "../../../context/user/UserPreference";
import industryType from "../../../@types/general/industryType";
import POST_API from "../../../constants/PostApi";
import BusinessType from "../../../@types/account/BusinessType";
import REGEX from "../../../constants/Regex";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import {
  MOBILE_NUMBER_VALIDATION,
  SIZE,
  STATUS_CODE,
} from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useIndustryType } from "../../../config/hooks/useIndustryType";
import { usebusinessType } from "../../../config/hooks/useBusinessType";
import AccountLead from "./account-lead/AccountLead";
import AccountContact from "./account-contact-temp/AccountContact";
import ToggleButton from "../../ui/ToggleButton";
import { useCountries } from "../../../config/hooks/useCountries";
import { useStates } from "../../../config/hooks/useStates";
import { useDistricts } from "../../../config/hooks/useDisctricts";
import AccountCompanyType from "./AccountCompanyType";
import AccountCompanyProduct from "./account-company-product/AccountCompanyProduct";
import { useAccountDetails } from "../../../config/hooks/useGetAccountDetails";
import ROUTES_URL from "../../../constants/Routes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseInt } from "lodash";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import MESSAGE from "../../../constants/Messages";
import axiosClient from "../../../axios-client/AxiosClient";
import State from "../../../@types/general/State";
import Country from "../../../@types/general/Country";
import District from "../../../@types/general/District";

const AccountDetails: React.FC = () => {
  const location = useLocation();
  const { accountId } = useParams();
  const { accountDetails: company, loading: accountDetailsLoading } =
    useAccountDetails(parseInt(accountId!));
  const navigate = useNavigate();

  const parsedAccountId = Number(accountId);

  useEffect(() => {
    if (!accountId || Number.isNaN(parsedAccountId)) {
      navigate(ROUTES_URL.ACCOUNT_MANAGEMENT);
    }
  }, [accountId, parsedAccountId, navigate]);

  useEffect(() => {
    if (!accountDetailsLoading && company === undefined) {
      navigate(ROUTES_URL.ACCOUNT_MANAGEMENT);
      return;
    }
  }, [accountDetailsLoading, company, navigate]);

  const initialState = {
    count: 0,
    id: 0,
    companyId: 0,
    name: "",
    email: "",
    mobileNumber: "",
    industryTypeId: 0,
    industryTypeName: "",
    businessTypeId: 0,
    businessTypeName: "",
    countryId: 0,
    stateId: 0,
    districtId: 0,
    countryName: "",
    stateName: "",
    districtName: "",
    pan: "",
    gst: "",
    tan: "",
    billingAddress: "",
    shippingAddress: "",
    registeredOfficeAddress: "",
    businessResgistrationNumber: "",
    website: "",
    isActive: false,
    createdBy: "",
    createdOn: "",
  };

  // Note : states for managing the data
  const [formData, setFormData] = useState<Account>(initialState);
  const [originalValues, setOriginalValues] = useState<Account>(initialState);

  // set the data as it arrives on the render
  useEffect(() => {
    if (company != null) {
      setFormData(company);
      setOriginalValues(company);
    }
  }, [company]);

  const { userHasAccessToUpdateAccount } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const { userPreference } = useUserPreference();
  const [editingField, setEditingField] = useState<keyof Account | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<
    "primary contact" | "legal" | "address" | "details"
  >("details");
  const { industryTypeData, loading: isIndustryTypeLoading } =
    useIndustryType();
  const { businessType, isLoading: isBusinessTypeLoading } = usebusinessType();

  const { countries } = useCountries();
  const { states } = useStates(formData.countryId);
  const { districts } = useDistricts(formData.stateId);

  const validateField = (
    fieldName: keyof Account,
    value: string | number,
  ): string => {
    const str = String(value);
    switch (fieldName) {
      case "name":
        if (!str.trim()) return "Account name is required";
        if (str.length > 40) return "Account name cannot exceed 40 characters";
        return "";
      case "email":
        if (!str.trim()) return "Email is required";
        if (str.length > 50) return "Email cannot exceed 50 characters";
        if (!REGEX.EMAIL.test(str)) return "Please enter a valid email";
        return "";
      case "mobileNumber":
        if (!str.trim()) return "Mobile number is required";
        if (!/^\d+$/.test(str)) return "Mobile number can only contain digits";
        if (!MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(str))
          return "Please enter a valid 10-digit mobile number";
        return "";
      case "pan":
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(str))
          return "Please enter the valid pan.";
        return "";
      case "tan":
        if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(str))
          return "Please enter the valid tan.";
        return "";
      case "gst":
        if (
          !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(str)
        )
          return "Please enter the valid gst.";
        return "";
      case "businessResgistrationNumber":
        if (str.length > 100) {
          return "registration number length is greater that 100.";
        }
        return "";
      default:
        return "";
    }
  };

  function permissionVerification(): boolean {
    if (!userHasAccessToUpdateAccount) {
      toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS);
      return false;
    }
    return true;
  }

  type DropdownMeta = {
    idKey: keyof typeof formData;
    nameKey: keyof typeof formData;
    apiKey: string;
    resetApiKeys?: string[];
  };

  const dropdownFieldMap: Record<string, DropdownMeta> = {
    businessTypeName: {
      idKey: "businessTypeId",
      nameKey: "businessTypeName",
      apiKey: "business_type_id",
    },
    industryTypeName: {
      idKey: "industryTypeId",
      nameKey: "industryTypeName",
      apiKey: "industry_type_id",
    },
    countryName: {
      idKey: "countryId",
      nameKey: "countryName",
      apiKey: "country_id",
      resetApiKeys: ["state_id", "district_id"],
    },
    stateName: {
      idKey: "stateId",
      nameKey: "stateName",
      apiKey: "state_id",
      resetApiKeys: ["district_id"],
    },
    districtName: {
      idKey: "districtId",
      nameKey: "districtName",
      apiKey: "district_id",
    },
  };

  function revert(fieldName: keyof Account) {
    setFormData((prev) => {
      const updated: any = {
        ...prev,

        // Always revert the field that user tried to update
        [fieldName]: originalValues[fieldName],
      };

      // If country changed → revert country + state + district
      if (fieldName === "countryName") {
        updated.countryId = originalValues["countryId"];
        updated.countryName = originalValues["countryName"];

        updated.stateId = originalValues["stateId"];
        updated.stateName = originalValues["stateName"];

        updated.districtId = originalValues["districtId"];
        updated.districtName = originalValues["districtName"];
      }

      // If state changed → revert only state + district
      if (fieldName === "stateName") {
        updated.stateId = originalValues["stateId"];
        updated.stateName = originalValues["stateName"];

        updated.districtId = originalValues["districtId"];
        updated.districtName = originalValues["districtName"];
      }

      // If district changed → revert only district
      if (fieldName === "districtName") {
        updated.districtId = originalValues["districtId"];
        updated.districtName = originalValues["districtName"];
      }
      return updated;
    });
  }
  const handleUpdateAccountDetails = async (
    fieldName: keyof Account,
    value: string | number | any,
  ) => {
    const isDropdown = dropdownFieldMap[fieldName];
    const permission = permissionVerification();
    if (!permission) {
      revert(fieldName);
      return;
    }
    //  Validate correctly
    if (!isDropdown) {
      const error = validateField(fieldName, value);
      if (error) {
        toast.error(error);
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
        setFormData((prev) => ({
          ...prev,
          [fieldName]: originalValues[fieldName],
        }));
        return;
      }
    }
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));

    //  Build base payload
    const postData: any = {
      id: formData.id,
      company_id: loginStatus.companyId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobilenumber: formData.mobileNumber.trim(),
      industry_type_id: formData.industryTypeId,
      business_type_id: formData.businessTypeId,
      country_id: formData.countryId,
      state_id: formData.stateId,
      district_id: formData.districtId,
      pan: formData.pan.trim(),
      gst: formData.gst.trim(),
      tan: formData.tan.trim(),
      billing_address: formData.billingAddress.trim(),
      shipping_address: formData.shippingAddress.trim(),
      registered_office_address: formData.registeredOfficeAddress.trim(),
      business_registration_number: formData.businessResgistrationNumber.trim(),
      website: formData.website.trim(),
      isactive: null,
      updatedby_id: loginStatus.id,
    };

    try {
      const response = await axiosClient.post(
        POST_API.UPDATE_ACCOUNT,
        postData,
        { withCredentials: true },
      );

      if (!response.data.status) {
        toast.error(response.data.message);

        setFormData((prev) => ({
          ...prev,
          [fieldName]: originalValues[fieldName],
        }));
        return;
      } else {
        if (isDropdown) {
          const { idKey, nameKey } = isDropdown;

          setOriginalValues((prev) => ({
            ...prev,
            [idKey]: formData[idKey],
            [nameKey]: formData[nameKey],
          }));
        } else {
          setOriginalValues((prev) => ({
            ...prev,
            [fieldName]: formData[fieldName],
          }));
        }
      }
      toast.success(response.data.message);
      // PATCH #2
      if (fieldName === "name") {
        navigate(location.pathname, {
          replace: true,
          state: {
            ...location.state,
            accountName: String(value).trim(),
          },
        });
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshed = await RefreshToken({
          callFunctionWithTwoParamsNotEvent: handleUpdateAccountDetails,
        });
        if (refreshed) handleUpdateAccountDetails(fieldName, value);
      } else {
        toast.error(error.response?.data || "Update failed");
      }
    }
  };

  const handleAccountStatusToggle = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!userHasAccessToUpdateAccount) {
      toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS);
      return;
    }
    const { checked } = event.target;
    const postData = {
      id: formData.id,
      company_id: loginStatus.companyId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobilenumber: formData.mobileNumber.trim(),
      industry_type_id: formData.industryTypeId,
      business_type_id: formData.businessTypeId,
      country_id: formData.countryId,
      state_id: formData.stateId,
      district_id: formData.districtId,
      pan: formData.pan.trim(),
      gst: formData.gst.trim(),
      tan: formData.tan.trim(),
      billing_address: formData.billingAddress.trim(),
      shipping_address: formData.shippingAddress.trim(),
      registered_office_address: formData.registeredOfficeAddress.trim(),
      business_registration_number: formData.businessResgistrationNumber.trim(),
      website: formData.website.trim(),
      isactive: checked,
      updatedby_id: loginStatus.id,
    };

    await axiosClient
      .post(POST_API.UPDATE_ACCOUNT, postData, { withCredentials: true })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          setFormData((prev) => ({ ...prev, isActive: checked }));
        } else {
          toast.error(response.data.message);
        }
        // fetchAccounts();
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithTwoParamsNotEvent: handleAccountStatusToggle,
          });
          if (refreshTokenResponse) {
            handleAccountStatusToggle(event);
          }
        } else {
          toast.error(error.response.data);
        }
      });
  };

  // Note :
  const handleFieldClick = (fieldName: keyof Account) => {
    if (!userHasAccessToUpdateAccount) {
      toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS);
      return;
    }
    if (!["createdOn", "createdBy"].includes(fieldName)) {
      setEditingField(fieldName);
    }
  };

  const handleInputChange = (fieldName: keyof Account, value: string) => {
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
    fieldName: keyof Account,
    selectedId: string,
    selectedName: string,
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
    } else if (fieldName === "countryName") {
      setFormData((prev) => ({
        ...prev,
        countryId: parseInt(selectedId),
        countryName: selectedName,
        stateId: 0,
        stateName: "",
        districtId: 0,
        districtName: "",
      }));
    } else if (fieldName === "stateName") {
      setFormData((prev) => ({
        ...prev,
        stateId: parseInt(selectedId),
        stateName: selectedName,
        districtId: 0,
        districtName: "",
      }));
    } else if (fieldName === "districtName") {
      setFormData((prev) => ({
        ...prev,
        districtId: parseInt(selectedId),
        districtName: selectedName,
      }));
    }
  };

  // Note : changes string
  const handleInputBlur = (fieldName: keyof Account) => {
    const currentValue = formData[fieldName];
    const originalValue = originalValues[fieldName];

    console.log("ori value");
    console.log(originalValue);

    console.log("curr value");
    console.log(currentValue);

    // Only call API if value actually changed
    if (currentValue !== originalValue) {
      handleUpdateAccountDetails(fieldName, currentValue);
    }
    setEditingField(null);
  };

  // Note : need to make changes here
  const handleDropdownBlur = (fieldName: keyof Account ) => {

    const dropdownMeta= dropdownFieldMap[fieldName];
    if(!dropdownMeta) return;

    const {idKey } =dropdownMeta;

    const originalId = originalValues[idKey]
    const curretntId =   formData[idKey]

    // comparing the id's
    if(originalId !== curretntId){
      handleUpdateAccountDetails(fieldName, curretntId)
    }

    // const originalValue = originalValues[fieldName];
    // console.log("ori value");
    // console.log(originalValue);
    // console.log("curr value");
    // console.log(formData[fieldName]);
    // console.log("field name : " + fieldName);
    // if (originalValue !== formData[fieldName]) {
    //   handleUpdateAccountDetails(fieldName, formData[fieldName]);
    // }
    setEditingField(null);
  };

  // Note : changes string
  const handleKeyPress = (e: React.KeyboardEvent, fieldName: keyof Account) => {
    if (e.key === "Enter") {
      handleInputBlur(fieldName);
    } else if (e.key === "Escape") {
      // Revert to original value
      setFormData((prev) => ({
        ...prev,
        [fieldName]: originalValues[fieldName],
      }));
      setEditingField(null);
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  // Note : changes string
  const renderDropdownField = (
    fieldName: keyof Account,
    value: string,
    options: BusinessType[] | industryType[] | State[] | Country[] | District[],
    placeholder: string = "Select option",
    // hasUpdateAccess: boolean,
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
                  : fieldName === "industryTypeName"
                    ? formData.industryTypeId || ""
                    : fieldName === "countryName"
                      ? formData.countryId || ""
                      : fieldName === "stateName"
                        ? formData.stateId
                        : formData.districtId
              }
              onChange={(e) => {
                const selectedOption = options.find(
                  (opt) => opt.id!.toString() === e.target.value,
                );
                if (!selectedOption) return;
                // const selectedId = Number(e.target.value);
                handleDropdownChange(
                  fieldName,
                  e.target.value,
                  selectedOption.name!,
                );

                //  handleDropdownBlur(fieldName)
              }}
              onBlur={() => handleDropdownBlur(fieldName)}
              className={`w-full table-data-custom bg-white border-2 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
            className={`${
              value ? "table-data-custom" : "caption-custom"
            }  cursor-pointer hover:bg-slate-100 rounded px-2 py-1 transition-colors truncate  `}
          >
            {value || placeholder}
            <Edit3 className="inline-block ml-2 h-3 w-3 text-slate-400" />
          </div>
        )}
      </div>
    );
  };

  // Note : changes string
  const renderEditableField = (
    fieldName: keyof Account,
    value: string,
    placeholder: string = "Enter value",
    type: string = "text",
    required: boolean = false,
  ) => {
    const isEditing = editingField === fieldName;
    const isReadOnly = ["createdOn", "createdBy"].includes(fieldName);
    const isMandatory = ["name", "email", "mobileNumber"].includes(fieldName);
    const hasError = errors[fieldName];
    return (
      <div className="relative w-full max-w-full mb-2">
        {/* // <div className="relative h-full flex flex-col justify-center"> */}
        {isEditing ? (
          <div className="h-full flex flex-col mr-8 ml-0.5">
            <input
              type={type}
              required={required}
              value={(formData[fieldName as keyof Account] as string) || ""}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              onBlur={() => handleInputBlur(fieldName)}
              onKeyDown={(e) => handleKeyPress(e, fieldName)}
              placeholder={placeholder}
              className={`w-full h-full bg-white border-1 rounded px-2 py-1 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                fieldName === "name"
                  ? "section-header-custom"
                  : "caption-custom"
              } ${hasError ? "border-red-500" : "border-blue-500"}`}
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
            className={`h-full  flex items-center  ${
              !isReadOnly
                ? `${
                    fieldName === "name"
                      ? "section-header-custom"
                      : "table-data-custom  "
                  } cursor-pointer hover:bg-slate-100 rounded transition-colors`
                : fieldName === "name"
                  ? "section-header-custom"
                  : "caption-custom"
            }  ${
              isMandatory && !value ? "border border-red-300 bg-red-50" : ""
            }`}
          >
            {value ||
              (isReadOnly ? (
                "N/A"
              ) : (
                <span
                  className={`${
                    fieldName === "name"
                      ? "section-header-custom"
                      : "caption-custom"
                  }`}
                >
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
      case "details":
        return (
          <div className="grid grid-cols-2 gap-2 p-1">
            <div className="space-y-0">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="caption-custom">Account Status</span>
              </h3>
              <div className="text-sm text-slate-600 bg-white p-2 rounded-lg border border-green-100">
                <div className="flex items-center gap-4">
                  {formData.isActive ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="input-label-custom-active">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span className="input-label-custom-inactive">
                        Inactive
                      </span>
                    </div>
                  )}

                  <ToggleButton
                    checked={formData.isActive}
                    name="isActive"
                    onToggle={handleAccountStatusToggle}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-0">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="caption-custom">Country</span>
              </h3>
              <div className="text-sm text-slate-600 bg-white p-1 rounded-lg border border-green-100">
                <div className="ml-1 truncate">
                  {renderDropdownField(
                    "countryName",
                    formData.countryName,
                    countries,
                    "Select Country",
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-0">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="caption-custom">Industry Type</span>
              </h3>
              <div className="text-sm text-slate-600 bg-white p-1 rounded-lg border border-green-100">
                <div className="ml-1 truncate">
                  {renderDropdownField(
                    "industryTypeName",
                    formData.industryTypeName,
                    industryTypeData,
                    "Select industry type",
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-0">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                <span className="caption-custom">State</span>
              </h3>
              <div className="text-sm text-slate-600 bg-white p-1 rounded-lg border border-green-100">
                <div className="ml-1 truncate">
                  {renderDropdownField(
                    "stateName",
                    formData.stateName,
                    states,
                    "Select State",
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-0">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <span className="caption-custom">Business Type</span>
              </h3>
              <div className="text-sm text-slate-600 bg-white p-1 rounded-lg border border-green-100">
                <div className="grid items-center text-slate-700">
                  <div className="flex items-center">
                    {/* <Factory className="h-4 w-4 mr-2" /> */}
                    <div className="caption-custom truncate">
                      {renderDropdownField(
                        "businessTypeName",
                        formData.businessTypeName,
                        businessType || [],
                        "Select business type",
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-0">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                <span className="caption-custom">District</span>
              </h3>
              <div className="text-sm text-slate-600 bg-white p-1 rounded-lg border border-green-100">
                <div className="grid items-center text-slate-700">
                  <div className="flex items-center">
                    {/* <Factory className="h-4 w-4 mr-2" /> */}
                    <div className="caption-custom truncate">
                      {renderDropdownField(
                        "districtName",
                        formData.districtName,
                        districts,
                        "Select District",
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "primary contact":
        return (
          // <div className="grid  grid-cols-1 sm:grid-cols-2 gap-3 justify-evenly h-full bg-pink-300   items-stretch">
          <div className="grid max-h-full overflow-auto  grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {/* Email */}
            <div className="col-span-2 flex justify-between p-1 bg-slate-50 border rounded-xl px-2 hover:shadow-sm transition">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="truncate pl-3 w-full overflow-hidden">
                <p className="caption-custom">Email</p>
                {renderEditableField(
                  "email",
                  formData.email,
                  "Enter email address",
                  "email",
                  true,
                )}
              </div>
            </div>

            {/* Mobile */}
            {/* <div className=" col-span-2  justify-between p-0.5 bg-slate-50 border rounded-xl px-3 hover:shadow-sm transition"> */}
            <div className="flex  col-span-2  bg-slate-50 border rounded-xl p-1 px-2 hover:shadow-sm transition">
              <div className="flex  items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div className="truncate pl-3 w-full overflow-hidden">
                <p className="caption-custom">Mobile</p>
                {renderEditableField(
                  "mobileNumber",
                  formData.mobileNumber,
                  "Enter mobile number",
                  "text",
                  true,
                )}
              </div>
            </div>

            {/* Website */}
            <div className="p-2 flex gap-2 bg-slate-50 border rounded-xl px-2 hover:shadow-sm transition sm:col-span-2">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div className="truncate ">
                <p className="caption-custom">Website</p>
                {editingField === "website" ? (
                  renderEditableField(
                    "website",
                    formData.website,
                    "Enter website URL",
                    "url",
                  )
                ) : (
                  <div
                    onClick={() => handleFieldClick("website")}
                    className="cursor-pointer flex items-center  hover:bg-slate-100 rounded transition-colors truncate"
                  >
                    {formData.website ? (
                      <a
                        href={
                          formData.website.startsWith("http")
                            ? formData.website
                            : "https://" + formData.website
                        }
                        target="_blank"
                        title={formData.website}
                        rel="noopener noreferrer"
                        className="caption-custom hover:text-blue-800 transition-colors truncate block"
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
          <div className="grid grid-cols-2 gap-2 p-1">
            <div className="p-2 bg-green-50 rounded-lg border border-green-100">
              <p className="input-label-custom-active mb-1  flex items-center gap-1">
                <Scale size={SIZE.LUCIDE_LOGO_INPUT_LABEL_SIZE} /> PAN
              </p>
              {renderEditableField("pan", formData.pan, "Enter PAN number")}
            </div>
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <p className="input-label-custom-blue mb-1 flex items-center gap-1">
                <Scale size={SIZE.LUCIDE_LOGO_INPUT_LABEL_SIZE} /> GST
              </p>
              {renderEditableField("gst", formData.gst, "Enter GST number")}
            </div>
            <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
              <p className="input-label-custom-active-tab mb-1 flex items-center gap-1">
                <Scale size={SIZE.LUCIDE_LOGO_INPUT_LABEL_SIZE} /> TAN
              </p>
              {renderEditableField("tan", formData.tan, "Enter TAN number")}
            </div>
            <div className="p-2 bg-orange-50 rounded-lg border border-orange-100">
              <p className="input-label-custom-orange mb-1 flex items-center gap-1">
                <Scale size={SIZE.LUCIDE_LOGO_INPUT_LABEL_SIZE} /> Registration
              </p>
              {renderEditableField(
                "businessResgistrationNumber",
                formData.businessResgistrationNumber,
                "Enter registration number",
              )}
            </div>
          </div>
        );

      case "address":
        return (
          <div className="grid grid-cols-1 gap-4 p-1  overflow-auto">
            <div className="space-y-1">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="caption-custom">Billing Address</span>
              </h3>
              <div className="text-sm text-slate-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
                {renderEditableField(
                  "billingAddress",
                  formData.billingAddress,
                  "Enter billing address",
                )}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="caption-custom">Shipping Address</span>
              </h3>
              <div className="text-sm text-slate-600 bg-green-50 p-2 rounded-lg border border-green-100">
                {renderEditableField(
                  "shippingAddress",
                  formData.shippingAddress,
                  "Enter shipping address",
                )}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="caption-custom">Registered Office</span>
              </h3>
              <div className="text-sm text-slate-600 bg-purple-50 p-2 rounded-lg border border-purple-100">
                {renderEditableField(
                  "registeredOfficeAddress",
                  formData.registeredOfficeAddress,
                  "Enter registered office address",
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isIndustryTypeLoading || isBusinessTypeLoading || accountDetailsLoading) {
    return (
      <div
        className={` ${
          userPreference.isLeftMenu ? " ml-5 " : ""
        }fixed mt-11  inset-0 z-10 bg-white p-8`}
      >
        <Skeleton />
      </div>
    );
  }

  return (
    // <>

    <div className="pb-3 mt-0.5">
      {/* Header Section */}
      <div className="bg-white rounded-2xl  p-2 mb-1 border">
        {/* Main header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-4 rounded-xl ${
                formData.isActive
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                  : "bg-gradient-to-br from-red-500 to-amber-600"
              }`}
            >
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="section-header-custom truncate">
                {renderEditableField(
                  "name",
                  formData.name,
                  "Enter company name",
                )}
              </h1>
            </div>
          </div>

          {/* Right side */}
          <div className="grid gap-2 font-semibold text-gray-700">
            <div className="flex items-center justify-between gap-4">
              <span className="grid">
                <span className="input-label-custom">Created By</span>
                <span className="caption-custom truncate">
                  {formData.createdBy}
                </span>
              </span>
              <span className="grid">
                <span className="input-label-custom">Created On</span>
                <span className="caption-custom truncate">
                  {formData.createdOn}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2    gap-1">
        {/* Left Card with Tabs */}
        <div className="bg-white rounded-xl p-1 border border-slate-200">
          {/* Tab Navigation */}
          <div className="flex border-b  border-gray-200 mb-1">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex items-center px-4 py-1 rounded-t-lg border-b-2 ${
                activeTab === "details"
                  ? "border-teal-600 table-header-custom active"
                  : "border-transparent table-header-custom"
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Details
            </button>
            <button
              onClick={() => setActiveTab("primary contact")}
              className={`flex items-center px-2 rounded-t-lg border-b-2 ${
                activeTab === "primary contact"
                  ? "border-teal-600 table-header-custom active"
                  : "border-transparent table-header-custom"
              }`}
            >
              <Mail className="h-4 w-4 mr-2" />
              Primary Contact
            </button>
            <button
              onClick={() => setActiveTab("legal")}
              className={`flex items-center px-4 py-1 rounded-t-lg border-b-2 ${
                activeTab === "legal"
                  ? "border-teal-600 table-header-custom active"
                  : "border-transparent table-header-custom"
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Legal
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`flex items-center px-4 py-1 rounded-t-lg border-b-2 ${
                activeTab === "address"
                  ? "border-teal-600 table-header-custom active"
                  : "border-transparent table-header-custom"
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

        <div className="bg-white rounded-xl border p-1 border-slate-200">
          <h3 className="bg-gray-100 table-header-custom rounded-t-md px-2">
            Account Contacts
          </h3>
          <AccountContact accountId={company!.id} />
        </div>

        {/* Account Lead */}

        <div className="bg-white rounded-xl border p-1 border-slate-200">
          {/* Header */}
          <div className="bg-gray-100 table-header-custom rounded-t-md px-2 ">
            <span>Account related leads</span>
          </div>
          <AccountLead account={company!} />
        </div>

        {/* Account company type */}

        <div className="bg-white rounded-xl border p-1 border-slate-200">
          <div className="bg-gray-100 table-header-custom rounded-t-md px-2 ">
            <span>Company Account Type</span>
          </div>
          <AccountCompanyType accountId={company!.id} />
        </div>

        {/* Account company product */}
        <div className="bg-white col-span-2 rounded-xl border p-1 border-slate-200">
          <h3 className="bg-gray-100 table-header-custom rounded-t-md px-2">
            Product Details
          </h3>
          <AccountCompanyProduct
            accountId={company!.id}
            // handleShowCompanyProductData={handleShowCompanyProductData}
          />
        </div>
      </div>
    </div>
  );
};

// Note : this is the form skeleton
const Skeleton: React.FC = () => {
  return (
    <div className="    bg-white animate-pulse">
      {/* Header Section */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
        <div className="flex flex-col space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      {/* Tab and Content Section */}
      <div className="flex space-x-4 mb-6">
        <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
        <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
        <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side (Contact, Mobile, Website) */}
        <div className="flex flex-col space-y-4">
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>

        {/* Right Side (Account Contact) */}
        <div className="p-4 bg-white rounded-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side (Contact, Mobile, Website) */}
        <div className="flex flex-col space-y-4">
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>

        {/* Right Side (Account Contact) */}
        <div className="p-4 bg-white rounded-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
