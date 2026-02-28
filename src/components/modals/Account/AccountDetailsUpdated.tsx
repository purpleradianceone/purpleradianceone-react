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
  Scale,
  Pen,
} from "lucide-react";
import Account from "../../../@types/account/Account";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import toast from "react-hot-toast";
import ApiError from "../../../@types/error/ApiError";
import {
  MOBILE_NUMBER_VALIDATION,
  SIZE,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import { useIndustryType } from "../../../config/hooks/useIndustryType";
import { usebusinessType } from "../../../config/hooks/useBusinessType";

import ToggleButton from "../../ui/ToggleButton";
import { useCountries } from "../../../config/hooks/useCountries";
import { useStates } from "../../../config/hooks/useStates";
import { useDistricts } from "../../../config/hooks/useDisctricts";

import { useAccountDetails } from "../../../config/hooks/useGetAccountDetails";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseInt } from "lodash";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import MESSAGE from "../../../constants/Messages";
import axiosClient from "../../../axios-client/AxiosClient";
import FormInput from "../../ui/FormInput";
import CustomSelect from "../../ui/CustomSelect";
import { toSelectOptions } from "../../../utils/toSelectOption";
import TextAreaInput from "../../ui/TextAreaInput";
import { handleApiError } from "../../../config/error/handleApiError";
import { updateAccount } from "../../../config/apis/AccountApis";

const AccountDetailsUpdated: React.FC = () => {
  const location = useLocation();
  const { accountId } = useParams();
  const {
    accountDetails: company,
    loading: accountDetailsLoading,
    refresh: accountDetailsRefreshCall,
  } = useAccountDetails(parseInt(accountId!));
  const navigate = useNavigate();

  //   const parsedAccountId = Number(accountId);

  //   useEffect(() => {
  //     if (!accountId || Number.isNaN(parsedAccountId)) {
  //       navigate(ROUTES_URL.ACCOUNT_MANAGEMENT);
  //     }
  //   }, [accountId, parsedAccountId, navigate]);

  //   useEffect(() => {
  //     if (!accountDetailsLoading && company === undefined) {
  //       navigate(ROUTES_URL.ACCOUNT_MANAGEMENT);
  //       return;
  //     }
  //   }, [accountDetailsLoading, company, navigate]);

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

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { userHasAccessToUpdateAccount } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [activeTab, setActiveTab] = useState<
    "primary contact" | "legal" | "address" | "details"
  >("details");

  const { industryTypeData, loading: isIndustryTypeLoading } =
    useIndustryType();

  const industryTypeOption = toSelectOptions(industryTypeData, "id", "name");

  const { businessType, isLoading: isBusinessTypeLoading } = usebusinessType();

  const { countries } = useCountries();
  const { states } = useStates(formData.countryId);
  const { districts } = useDistricts(formData.stateId);
  const stateTypeOption = toSelectOptions(states, "id", "name");
  const countryTypeOption = toSelectOptions(countries, "id", "name");
  const districtTypeOption = toSelectOptions(districts, "id", "name");
  const businessTypeOption = toSelectOptions(businessType, "id", "name");

  //   Note: this is not working
  //   useEffect(()=>{
  //     refreshDistrictCall()
  //   },[formData.stateId, formData.countryId])
  const newErrors = {
    mobilenumber: "",
    gst: "",
    name: "",
    pan: "",
    tan: "",
    email: "",
    registrationNumber: "",
  };
  const [errors, setErrors] = useState<{
    mobilenumber: string;
    name: string;
    pan: string;
    tan: string;
    gst: string;
    email: string;
    registrationNumber: string;
  }>(newErrors);
  //   const validateField = (
  //     fieldName: keyof Account,
  //     value: string | number,
  //   ): string => {
  //     const str = String(value);
  //     switch (fieldName) {
  //       case "name":
  //         if (!str.trim()) return "Account name is required";
  //         if (str.length > 40) return "Account name cannot exceed 40 characters";
  //         return "";
  //       case "email":
  //         if (!str.trim()) return "Email is required";
  //         if (str.length > 50) return "Email cannot exceed 50 characters";
  //         if (!REGEX.EMAIL.test(str)) return "Please enter a valid email";
  //         return "";
  //       case "mobileNumber":
  //         if (!str.trim()) return "Mobile number is required";
  //         if (!/^\d+$/.test(str)) return "Mobile number can only contain digits";
  //         if (!MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(str))
  //           return "Please enter a valid 10-digit mobile number";
  //         return "";
  //       case "pan":
  //         if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(str))
  //           return "Please enter the valid pan.";
  //         return "";
  //       case "tan":
  //         if (!/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(str))
  //           return "Please enter the valid tan.";
  //         return "";
  //       case "gst":
  //         if (
  //           !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(str)
  //         )
  //           return "Please enter the valid gst.";
  //         return "";
  //       case "businessResgistrationNumber":
  //         if (str.length > 100) {
  //           return "registration number length is greater that 100.";
  //         }
  //         return "";
  //       default:
  //         return "";
  //     }
  //   };

  //Note : Validation before the api submit call
  const validateData = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const mobile = formData.mobileNumber.trim();
    const pan = formData.pan.trim();
    const tan = formData.tan.trim();
    const gst = formData.gst.trim();

    // Name
    if (name.length === 0) {
      toast.error("Name is required");
      return false;
    }

    // Email
    if (email.length === 0) {
      toast.error("Email is required");
      return false;
    }

    if (email.length > 50) {
      toast.error("Email cannot exceed 50 characters");
      return false;
    }

    if (!VALIDATIONS.EMAIL.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    // Mobile
    if (
      mobile.length === 0 ||
      !MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(mobile)
    ) {
      toast.error("Please enter a valid Mobile Number.");
      return false;
    }

    // PAN (optional)
    if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      toast.error("Please enter a valid PAN.");
      return false;
    }

    // TAN (optional)
    if (tan && !/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(tan)) {
      toast.error("Please enter a valid TAN.");
      return false;
    }

    // GST (optional)
    if (gst) {
      if (gst.length > 100) {
        toast.error("Registration number length cannot exceed 100 characters.");
        return false;
      }

      if (
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst)
      ) {
        toast.error("Please enter a valid GST number.");
        return false;
      }
    }

    return true;
  };

  //   const validateData = () => {
  //     if (formData.name.length == 0) {
  //       toast.error("name is req");
  //       return false;
  //     }

  //     if (formData.email.trim().length == 0) {
  //       toast.error("Email is required");
  //       return false;
  //     }
  //     if (formData.email.length > 50) {
  //       toast.error("Email cannot exceed 50 characters");
  //       return false;
  //     }
  //     if (!VALIDATIONS.EMAIL.test(formData.email)) {
  //       toast.error("Please enter a valid email");
  //       return false;
  //     }
  //     const mobile = formData.mobileNumber.trim();

  //     if (
  //       mobile.length === 0 ||
  //       !MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(mobile)
  //     ) {
  //       toast.error("Please enter a valid Mobile Number.");
  //       return false;
  //     }

  //     if (
  //       formData.pan.trim() &&
  //       !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.trim())
  //     ) {
  //       toast.error("Please enter the valid pan.");
  //       return false;
  //     }

  //     if (
  //       formData.tan.trim() &&
  //       !/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(formData.tan)
  //     ) {
  //       toast.error("Please enter the valid tan.");
  //       return false;
  //     }

  //     if (
  //       formData.gst.trim() &&
  //       !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
  //         formData.gst.trim(),
  //       )
  //     ) {
  //       toast.error("Please enter valid gst.");
  //       return false;
  //     }

  //     if (formData.gst.trim().length > 100) {
  //       toast.error("registration number length is greater that 100.");
  //       return false;
  //     }

  //     return true;
  //   };

  //Note : handle api sublit logic here
  const handleSaveAccountDetails = async () => {
    const normalize = (obj: any) =>
      JSON.stringify(
        Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v ?? ""])),
      );

    if (normalize(originalValues) === normalize(formData)) {
      toast.error("No changes detected");
      return;
    }
    const validationResult = validateData();

    if (!validationResult) {
      //   setFormData({ ...originalValues });
      return;
    }
    try {
      const postData: any = {
        id: formData.id,
        company_id: loginStatus.companyId,
        name: formData.name,
        email: formData.email,
        mobilenumber: formData.mobileNumber,
        industry_type_id: formData.industryTypeId,
        business_type_id: formData.businessTypeId,
        country_id: formData.countryId,
        state_id: formData.stateId,
        district_id: formData.districtId,
        pan: formData.pan,
        gst: formData.gst,
        tan: formData.tan,
        billing_address: formData.billingAddress,
        shipping_address: formData.shippingAddress,
        registered_office_address: formData.registeredOfficeAddress,
        business_registration_number: formData.businessResgistrationNumber,
        website: formData.website,
        isactive: null,
        updatedby_id: loginStatus.id,
      };

      const response = await updateAccount(postData);
      if (response) {
        if (response.data.status) {
          toast.success(response.data.message);

          // Note : changes for breadcrumb account name.
          navigate(location.pathname, {
            replace: true,
            state: {
              ...location.state,
              accountName: formData.name,
            },
          });

          setIsEditing(false);
          //   Note : set the original state to form data
          setOriginalValues({ ...formData });
        } else {
          // Note : reset the editing state to false on success call
          toast.error(response.data.message);
          setFormData({ ...originalValues });
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      // Note: if want need to give refresh call on success full update
      accountDetailsRefreshCall();
    }
  };

  //Note : Cancel button click event
  const handleCancelAccountDetails = () => {
    // Note : Giving the old values
    setFormData({ ...originalValues });
    // NOte : resetting the errors field
    setErrors(newErrors);
    // Note : Making the editing state false.
    setIsEditing(false);
  };

  const handleAccountStatusToggle = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log("inside the toggle api call : 1 line");

    if (!userHasAccessToUpdateAccount) {
      console.log("in api call toggle check block 1");
      toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS);
      return;
    }

    const validationResult = validateData();

    if (!validationResult) {
      //   setFormData({ ...originalValues });
      return;
    }
    console.log("in api call toggle");
    const { checked } = event.target;
    const postData = {
      id: formData.id,
      company_id: loginStatus.companyId,
      name: formData.name,
      email: formData.email,
      mobilenumber: formData.mobileNumber,
      industry_type_id: formData.industryTypeId,
      business_type_id: formData.businessTypeId,
      country_id: formData.countryId,
      state_id: formData.stateId,
      district_id: formData.districtId,
      pan: formData.pan,
      gst: formData.gst,
      tan: formData.tan,
      billing_address: formData.billingAddress,
      shipping_address: formData.shippingAddress,
      registered_office_address: formData.registeredOfficeAddress,
      business_registration_number: formData.businessResgistrationNumber,
      website: formData.website,
      isactive: checked,
      updatedby_id: loginStatus.id,
    };
    console.log("in api call toggle final ");

    await axiosClient
      .post(POST_API.UPDATE_ACCOUNT, postData, { withCredentials: true })
      .then((response) => {
        // if (response.data.status) {
        //   toast.success(response.data.message);
        // //   setFormData((prev) => ({ ...prev, isActive: checked }));
        // } else {
        //   toast.error(response.data.message);
        // }

        if (response.data.status) {
          toast.success(response.data.message);

          // Note : changes for breadcrumb account name.
          navigate(location.pathname, {
            replace: true,
            state: {
              ...location.state,
              accountName: formData.name,
            },
          });

          // Note : reset the editing state to false on success call
          setIsEditing(false);
          setOriginalValues({ ...formData });
        } else {
          toast.error(response.data.message);
          setFormData({ ...originalValues });
        }
      })
      .catch(async (error: ApiError | any) => {
        handleApiError(error);
      })
      .finally(() => {
        // Note: if want need to give refresh call on success full update
        accountDetailsRefreshCall();
      });
  };

  const handleFormInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log("Name : " + name + " Value : " + value);

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Note : Add validation in here
  const handleOnBlur = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name + "value  : " + value);

    if (name === "name") {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, name: "Name is required" }));
      } else {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        setErrors((prev) => ({
          ...prev,
          email: "Email is required",
        }));
      } else if (!VALIDATIONS.EMAIL.test(value) && value !== "") {
        setErrors((prev) => ({
          ...prev,
          email: "Please enter valid email address.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    if (name === "mobileNumber") {
      if (!value.trim()) {
        setErrors((prev) => ({
          ...prev,
          mobilenumber: "Mobile Number is required",
        }));
      } else if (
        !MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(value) &&
        value.length !== 0
      ) {
        setErrors((prev) => ({
          ...prev,
          mobilenumber: "Please enter a valid Mobile Number.",
        }));
      } else if (value.length > 10) {
        setErrors((prev) => ({
          ...prev,
          mobilenumber: "Please enter a valid Mobile Number.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, mobileNumber: "" }));
      }
    }
    if (name === "pan") {
      if (value.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          pan: "Please enter the valid pan.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          pan: "",
        }));
      }
    }
    if (name === "tan") {
      if (value.trim() && !/^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          tan: "Please enter the valid tan.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          tan: "",
        }));
      }
    }
    if (name === "gst") {
      if (
        value.trim() &&
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)
      ) {
        setErrors((prev) => ({
          ...prev,
          gst: "Please enter the valid gst.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          gst: "",
        }));
      }
    }
    if (name === "businessResgistrationNumber") {
      if (value.trim().length > 100) {
        setErrors((prev) => ({
          ...prev,
          registrationNumber: "registration number length is greater that 100.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          registrationNumber: "",
        }));
      }
    }
  };

  //   Note : New Changes
  const handleDropdownvalueChange = (
    id: number | undefined,
    name: keyof Account,
  ) => {
    console.log(id + "name : " + name);

    setFormData((formData) => ({
      ...formData,
      [name]: id,
    }));
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
              <div className="text-sm text-slate-600 bg-white p-1 rounded-lg border border-green-100">
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
                  {/* {renderDropdownField(
                    "countryName",
                    formData.countryName,
                    countries,
                    "Select Country",
                  )} */}
                  {!isEditing ? (
                    <>
                      <span className="input-label-custom">
                        {formData.countryName ? (
                          formData.countryName
                        ) : (
                          <>
                            <span className="caption-custom italic">
                              Enter country Name
                            </span>
                          </>
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <CustomSelect
                        value={formData.countryId}
                        options={countryTypeOption}
                        onChange={(id) => {
                          handleDropdownvalueChange(id, "countryId");
                          handleDropdownvalueChange(0, "stateId");
                          handleDropdownvalueChange(0, "districtId");
                        }}
                        // label="Country"
                        isClearable={false}
                      />
                    </>
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
                  {/* {renderDropdownField(
                    "industryTypeName",
                    formData.industryTypeName,
                    industryTypeData,
                    "Select industry type",
                  )} */}

                  {!isEditing ? (
                    <>
                      <span className="input-label-custom">
                        {
                          industryTypeOption.find(
                            (opt) => opt.value === formData.industryTypeId,
                          )?.label
                        }
                      </span>
                      {/* <span>{formData.industryTypeName}</span> */}
                    </>
                  ) : (
                    <>
                      <CustomSelect
                        value={formData.industryTypeId}
                        options={industryTypeOption}
                        // label="Industry"
                        onChange={(id) => {
                          handleDropdownvalueChange(id, "industryTypeId");
                        }}
                        isClearable={false}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-0">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                <span className="caption-custom">State</span>
              </h3>
              {/* {renderDropdownField(
                    "stateName",
                    formData.stateName,
                    states,
                    "Select State",
                  )} */}
              <div className="text-sm text-slate-600 bg-white p-1 rounded-lg border border-green-100">
                <div className="truncate">
                  {!isEditing ? (
                    <>
                      <span className="input-label-custom">
                        {formData.stateName ? (
                          formData.stateName
                        ) : (
                          <>
                            <span className="caption-custom italic">
                              No state given
                            </span>
                          </>
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <CustomSelect
                        value={formData.stateId}
                        options={stateTypeOption}
                        onChange={(id) => {
                          handleDropdownvalueChange(id, "stateId");
                          handleDropdownvalueChange(0, "districtId");
                        }}
                        // label="State"
                        isClearable={false}
                      />
                    </>
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
                    <div className="w-full">
                      {/* {renderDropdownField(
                        "businessTypeName",
                        formData.businessTypeName,
                        businessType || [],
                        "Select business type",
                      )} */}
                      {!isEditing ? (
                        <>
                          <span className="input-label-custom">
                            {formData.businessTypeName ? (
                              formData.businessTypeName
                            ) : (
                              <>
                                <span className="caption-custom italic">
                                  Enter business type given
                                </span>
                              </>
                            )}
                          </span>
                        </>
                      ) : (
                        <>
                          <CustomSelect
                            value={formData.businessTypeId}
                            options={businessTypeOption}
                            onChange={(id) => {
                              handleDropdownvalueChange(id, "businessTypeId");
                            }}
                            // label="Business Type"
                            isClearable={false}
                          />
                        </>
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
                    <div className="w-full ">
                      {/* {renderDropdownField(
                        "districtName",
                        formData.districtName,
                        districts,
                        "Select District",
                      )} */}
                      {!isEditing ? (
                        <>
                          <span className="input-label-custom">
                            {formData.districtName ? (
                              formData.districtName
                            ) : (
                              <>
                                <span className="caption-custom italic">
                                  No district given
                                </span>
                              </>
                            )}
                          </span>
                        </>
                      ) : (
                        <>
                          <CustomSelect
                            value={formData.districtId}
                            options={districtTypeOption}
                            onChange={(id) => {
                              handleDropdownvalueChange(id, "districtId");
                            }}
                            // label="District"
                            isClearable={false}
                          />
                        </>
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
              {!isEditing && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
              )}
              <div className="truncate pl-3 w-full overflow-hidden">
                {!isEditing && <p className="caption-custom">Email</p>}
                {/* {renderEditableField(
                  "email",
                  formData.email,
                  "Enter email address",
                  "email",
                  true,
                )} */}
                {isEditing ? (
                  <>
                    <FormInput
                      required
                      logo={Mail}
                      type="text"
                      label="Email:"
                      name="email"
                      penLogo={Pen}
                      className="border-none"
                      placeholder="Enter email Address"
                      value={formData.email}
                      onBlur={handleOnBlur}
                      onChange={handleFormInputChange}
                    />

                    {errors.email && (
                      <span className="caption-custom-inactive">
                        {errors.email}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="input-label-custom">{formData.email}</span>
                  </>
                )}
              </div>
            </div>

            {/* Mobile */}
            {/* <div className=" col-span-2  justify-between p-0.5 bg-slate-50 border rounded-xl px-3 hover:shadow-sm transition"> */}
            <div className="flex  col-span-2  bg-slate-50 border rounded-xl p-1 px-2 hover:shadow-sm transition">
              {!isEditing && (
                <div className="flex  items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
              )}
              <div className="truncate pl-3 w-full overflow-hidden">
                {!isEditing && <p className="caption-custom">Mobile</p>}
                {/* {renderEditableField(
                  "mobileNumber",
                  formData.mobileNumber,
                  "Enter mobile number",
                  "text",
                  true,
                )} */}
                {isEditing ? (
                  <>
                    <FormInput
                      required
                      logo={Phone}
                      type="number"
                      label="Mobile number:"
                      name="mobileNumber"
                      penLogo={Pen}
                      className="border-none"
                      placeholder="Enter mobile number"
                      value={formData.mobileNumber}
                      onBlur={handleOnBlur}
                      onChange={handleFormInputChange}
                    />
                    {errors.mobilenumber && (
                      <span className="caption-custom-inactive">
                        {errors.mobilenumber}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="input-label-custom">
                      {formData.mobileNumber}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="p-1 flex gap-2 bg-slate-50 border rounded-xl px-2 hover:shadow-sm transition sm:col-span-2">
              {!isEditing && (
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
              )}
              <div className="w-full ">
                {!isEditing && <p className="caption-custom">Website</p>}
                {/* //   renderEditableField(
                  //     "website",
                  //     formData.website,
                  //     "Enter website URL",
                  //     "url",
                  //   ) */}
                {!isEditing ? (
                  <>
                    <div className=" flex items-center   rounded transition-colors truncate">
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
                          className="url cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {formData.website}
                        </a>
                      ) : (
                        <span className=" italic caption-custom">
                          No Website given
                        </span>
                      )}
                      {/* <Edit3 className="inline-block ml-2 h-3 w-3 text-slate-400" /> */}
                    </div>
                  </>
                ) : (
                  <div className="w-full pl-3">
                    <FormInput
                      logo={Globe}
                      type="text"
                      label="Website:"
                      name="website"
                      penLogo={Pen}
                      className="border-none"
                      placeholder="Enter website address"
                      value={formData.website}
                      onBlur={handleOnBlur}
                      onChange={handleFormInputChange}
                    />
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
              {!isEditing && (
                <>
                  <p className="caption-custom-inactive mb-1  flex items-center gap-1">
                    <Scale size={SIZE.LUCIDE_LOGO_INPUT_LABEL_SIZE} />
                    PAN
                  </p>
                </>
              )}
              {/* {renderEditableField("pan", formData.pan, "Enter PAN number")} */}
              {isEditing ? (
                <>
                  <FormInput
                    logo={Scale}
                    type="text"
                    label="PAN:"
                    name="pan"
                    penLogo={Pen}
                    className="border-none"
                    placeholder="Enter PAN number"
                    value={formData.pan}
                    onBlur={handleOnBlur}
                    onChange={handleFormInputChange}
                  />
                  {errors.pan && (
                    <span className="caption-custom-inactive">
                      {errors.pan}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="input-label-custom">
                    {formData.pan ? (
                      <span>
                        {formData.pan}
                        {/* <Copy size={12} onClick={ ()=> handleCopy(formData.pan)}/> */}
                      </span>
                    ) : (
                      <>
                        <span className="italic caption-custom">
                          No data given
                        </span>
                      </>
                    )}
                  </span>
                </>
              )}
            </div>
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              {!isEditing && (
                <p className="input-label-custom-blue mb-1 flex items-center gap-1">
                  <Scale size={SIZE.LUCIDE_LOGO_INPUT_LABEL_SIZE} /> GST
                </p>
              )}
              {/* {renderEditableField("gst", formData.gst, "Enter GST number")} */}
              {isEditing ? (
                <>
                  <FormInput
                    logo={Scale}
                    type="text"
                    label="GST:"
                    name="gst"
                    penLogo={Pen}
                    className="border-none"
                    placeholder="Enter GST number"
                    value={formData.gst}
                    onBlur={handleOnBlur}
                    onChange={handleFormInputChange}
                  />
                  {errors.gst && (
                    <span className="caption-custom-inactive">
                      {errors.gst}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="input-label-custom">
                    {formData.gst ? (
                      formData.gst
                    ) : (
                      <>
                        <span className="italic caption-custom">
                          No data given
                        </span>
                      </>
                    )}
                  </span>
                </>
              )}
            </div>
            <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
              {!isEditing && (
                <p className="input-label-custom-active-tab mb-1 flex items-center gap-1">
                  <Scale size={SIZE.LUCIDE_LOGO_INPUT_LABEL_SIZE} /> TAN
                </p>
              )}
              {/* {renderEditableField("tan", formData.tan, "Enter TAN number")} */}
              {isEditing ? (
                <>
                  <FormInput
                    logo={Scale}
                    type="text"
                    label="TAN:"
                    name="tan"
                    penLogo={Pen}
                    className="border-none"
                    placeholder="Enter TAN number"
                    value={formData.tan}
                    onBlur={handleOnBlur}
                    onChange={handleFormInputChange}
                  />
                  {errors.tan && (
                    <span className="caption-custom-inactive">
                      {errors.tan}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="input-label-custom">
                    {formData.tan ? (
                      formData.tan
                    ) : (
                      <>
                        <span className="italic caption-custom">
                          No data given
                        </span>
                      </>
                    )}
                  </span>
                </>
              )}
            </div>
            <div className="p-2 bg-orange-50 rounded-lg border border-orange-100">
              {!isEditing && (
                <p className="input-label-custom-orange mb-1 flex items-center gap-1">
                  <Scale size={SIZE.LUCIDE_LOGO_INPUT_LABEL_SIZE} />
                  Bussiness Registration Number
                </p>
              )}
              {/* {renderEditableField(
                "businessResgistrationNumber",
                formData.businessResgistrationNumber,
                "Enter registration number",
              )} */}

              {isEditing ? (
                <>
                  <FormInput
                    logo={Scale}
                    type="text"
                    label="Business Registration number:"
                    name="businessResgistrationNumber"
                    penLogo={Pen}
                    className="border-none"
                    placeholder="Enter registration number"
                    value={formData.businessResgistrationNumber}
                    onBlur={handleOnBlur}
                    onChange={handleFormInputChange}
                  />
                  {errors.registrationNumber && (
                    <span className="caption-custom-inactive">
                      {errors.registrationNumber}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="input-label-custom">
                    {formData.businessResgistrationNumber ? (
                      formData.businessResgistrationNumber
                    ) : (
                      <>
                        <span className="italic caption-custom">
                          No data given
                        </span>
                      </>
                    )}
                  </span>
                </>
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
                {/* {renderEditableField(
                  "billingAddress",
                  formData.billingAddress,
                  "Enter billing address",
                )} */}
                {/* billingAddress: "",
                shippingAddress: "",
                registeredOfficeAddress: "",
                businessResgistrationNumber: "", */}
                {!isEditing ? (
                  <span className="input-label-custom">
                    {formData.billingAddress ? (
                      formData.billingAddress
                    ) : (
                      <span className="caption-custom italic">
                        No billing address 
                      </span>
                    )}
                  </span>
                ) : (
                  <>
                    <TextAreaInput
                      cols={2}
                      label=""
                      rows={2}
                      value={formData.billingAddress}
                      onChange={handleFormInputChange}
                      name="billingAddress"
                    ></TextAreaInput>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="caption-custom">Shipping Address</span>
              </h3>
              <div className="text-sm text-slate-600 bg-green-50 p-2 rounded-lg border border-green-100">
                {/* {renderEditableField(
                  "shippingAddress",
                  formData.shippingAddress,
                  "Enter shipping address",
                )} */}
                {!isEditing ? (
                  <span className="input-label-custom">
                    {formData.shippingAddress ? (
                      formData.shippingAddress
                    ) : (
                      <span className="caption-custom italic">
                        No shilling address 
                      </span>
                    )}
                  </span>
                ) : (
                  <>
                    <TextAreaInput
                      cols={2}
                      label=""
                      rows={2}
                      value={formData.shippingAddress}
                      name="shippingAddress"
                      onChange={handleFormInputChange}
                    ></TextAreaInput>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-slate-700 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="caption-custom">
                  Registered Office Address
                </span>
              </h3>
              <div className="text-sm text-slate-600 bg-purple-50 p-2 rounded-lg border border-purple-100">
                {/* {renderEditableField(
                  "registeredOfficeAddress",
                  formData.registeredOfficeAddress,
                  "Enter registered office address",
                )} */}
                {!isEditing ? (
                  <span className="input-label-custom">
                    {formData.registeredOfficeAddress ? (
                      formData.registeredOfficeAddress
                    ) : (
                      <span className="caption-custom italic">
                        No registered office address
                      </span>
                    )}
                  </span>
                ) : (
                  <>
                    <TextAreaInput
                      cols={2}
                      label=""
                      rows={2}
                      value={formData.registeredOfficeAddress}
                      name="registeredOfficeAddress"
                      onChange={handleFormInputChange}
                    ></TextAreaInput>
                  </>
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
      <div className=" w-full">
        <AccountDetailsSkeleton />
      </div>
    );
  }

  return (
    // Note: Min height given
    <div className="min-h-56 mt-0.5">
      {/* Header Section */}
      {/* Main Content Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-1    gap-1">
        {/* Left Card with Tabs */}
        <div className="bg-white rounded-xl  border-slate-200">
          <div className="col-span-2 bg-white rounded-lg  p-1  mb-1 border">
            {/* Main header */}
            <div className="flex items-start justify-between p-1">
              <div className="flex w-full items-center space-x-3">
                <div
                  className={`p-2 rounded-md ${
                    formData.isActive
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                      : "bg-gradient-to-br from-red-500 to-amber-600"
                  }`}
                >
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="w-full bg-pink-00">
                  {/* <h1 className=" "> */}
                  {/* {renderEditableField(
                  "name",
                  formData.name,
                  "Enter company name",
                )} */}
                  {isEditing ? (
                    <div className="w-full">
                      <FormInput
                        required
                        logo={Mail}
                        type="text"
                        label="Name:"
                        name="name"
                        // penLogo={Pen}
                        className="border-none"
                        placeholder="Enter Account Name"
                        value={formData.name}
                        onBlur={handleOnBlur}
                        maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                        onChange={handleFormInputChange}
                      />
                      {errors.name && (
                        <>
                          <span className="caption-custom-inactive">
                            {errors.name}
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <span className="section-header-custom">
                        {formData.name}
                      </span>
                    </>
                  )}
                  {/* </h/1> */}
                  {!isEditing && (
                    <div
                      className="cursor-pointer caption-custom-blue "
                      onClick={() => {
                        if(userHasAccessToUpdateAccount){
                            setIsEditing(true);
                        }else{
                            toast.error(MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS)

                        }
                      }}
                    >
                      <span>Edit</span>
                    </div>
                  )}
                  {isEditing && (
                    <div className="flex gap-2">
                      <div
                        className="cursor-pointer caption-custom-blue "
                        onClick={handleSaveAccountDetails}
                      >
                        <span>Save</span>
                      </div>

                      <div
                        className="cursor-pointer caption-custom-blue "
                        onClick={handleCancelAccountDetails}
                      >
                        <span>Cancel</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side */}
              {/* Note : metadata */}
              {/* <div className="grid gap-2 font-semibold text-gray-700">
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid">
                      <span className="caption-custom truncate">
                      <span className="cap">Created By</span>
                        {formData.createdBy}
                      </span>
                    </span>
                    <span className="caption-custom">
                      <span className=" ">
                      <span className="">Created On</span>
                      <span>

                        {formData.createdOn}
                      </span>
                      </span>
                    </span>
                  </div>
                </div> */}
            </div>
          </div>
          {/* Tab Navigation */}
          <div className="flex border-b  border-gray-200 ">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex items-center px-4  rounded-t-lg border-b-2 ${
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
              className={`flex items-center px-4  p-0.5 rounded-t-lg border-b-2 ${
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
              className={`flex items-center px-4 py-0.5 rounded-t-lg border-b-2 ${
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

        {/* <div className="bg-white rounded-xl border p-1 border-slate-200">
          <h3 className="bg-gray-100 table-header-custom rounded-t-md px-2">
            Account Contacts
          </h3>
          <AccountContact accountId={company!.id} />
        </div> */}

        {/* Account Lead */}

        {/* <div className="bg-white rounded-xl border p-1 border-slate-200">
          <div className="bg-gray-100 table-header-custom rounded-t-md px-2 ">
            <span>Account related leads</span>
          </div>
          <AccountLead account={company!} />
        </div> */}

        {/* Account company type */}

        {/* <div className="bg-white rounded-xl border p-1 border-slate-200">
          <div className="bg-gray-100 table-header-custom rounded-t-md px-2 ">
            <span>Company Account Type</span>
          </div>
          <AccountCompanyType accountId={company!.id} />
        </div> */}

        {/* Account company product */}
        {/* <div className="bg-white col-span-2 rounded-xl border p-1 border-slate-200">
          <h3 className="bg-gray-100 table-header-custom rounded-t-md px-2">
            Product Details
          </h3>
          <AccountCompanyProduct
            accountId={company!.id}
          />
        </div> */}
      </div>
    </div>
  );
};

// Note : this is the form skeleton
// const Skeleton: React.FC = () => {
//   return (
//     <div className="    bg-white animate-pulse">
//       {/* Header Section */}
//       <div className="flex items-center space-x-4 mb-6">
//         <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
//         <div className="flex flex-col space-y-2 flex-1">
//           <div className="h-4 bg-gray-200 rounded w-48"></div>
//           <div className="h-3 bg-gray-200 rounded w-32"></div>
//         </div>
//         <div className="flex flex-col items-end space-y-2">
//           <div className="h-3 bg-gray-200 rounded w-24"></div>
//           <div className="h-3 bg-gray-200 rounded w-24"></div>
//         </div>
//       </div>

//       {/* Tab and Content Section */}
//       <div className="flex space-x-4 mb-6">
//         <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
//         <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
//         <div className="w-24 h-6 bg-gray-200 rounded-md"></div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Left Side (Contact, Mobile, Website) */}
//         <div className="flex flex-col space-y-4">
//           <div className="p-4 bg-white rounded-md border border-gray-200">
//             <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//             <div className="h-3 bg-gray-200 rounded w-full"></div>
//           </div>
//           <div className="p-4 bg-white rounded-md border border-gray-200">
//             <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
//             <div className="h-3 bg-gray-200 rounded w-full"></div>
//           </div>
//           <div className="p-4 bg-white rounded-md border border-gray-200">
//             <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
//             <div className="h-3 bg-gray-200 rounded w-full"></div>
//           </div>
//         </div>

//         {/* Right Side (Account Contact) */}
//         <div className="p-4 bg-white rounded-md border border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <div className="h-4 bg-gray-200 rounded w-32"></div>
//             <div className="w-16 h-8 bg-gray-200 rounded"></div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
//             <div className="flex-1">
//               <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
//               <div className="h-3 bg-gray-200 rounded w-48"></div>
//             </div>
//             <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
//           </div>
//         </div>
//       </div>
//       <br />
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Left Side (Contact, Mobile, Website) */}
//         <div className="flex flex-col space-y-4">
//           <div className="p-4 bg-white rounded-md border border-gray-200">
//             <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//             <div className="h-3 bg-gray-200 rounded w-full"></div>
//           </div>
//           <div className="p-4 bg-white rounded-md border border-gray-200">
//             <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
//             <div className="h-3 bg-gray-200 rounded w-full"></div>
//           </div>
//           <div className="p-4 bg-white rounded-md border border-gray-200">
//             <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
//             <div className="h-3 bg-gray-200 rounded w-full"></div>
//           </div>
//         </div>

//         {/* Right Side (Account Contact) */}
//         <div className="p-4 bg-white rounded-md border border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <div className="h-4 bg-gray-200 rounded w-32"></div>
//             <div className="w-16 h-8 bg-gray-200 rounded"></div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
//             <div className="flex-1">
//               <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
//               <div className="h-3 bg-gray-200 rounded w-48"></div>
//             </div>
//             <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const AccountDetailsSkeleton = () => {
  return (
    <div className="w-full  bg-white rounded-xl shadow-sm border p-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-64 bg-gray-200 rounded-md" />
        <div className="h-4 w-10 bg-gray-200 rounded-md" />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b pb-3 mb-4">
        <div className="h-3 w-16 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-12 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-200 rounded" />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          <SkeletonField />
          <SkeletonField />
          <SkeletonField />
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <SkeletonField />
          <SkeletonField />
          <SkeletonField />
        </div>
      </div>
    </div>
  );
};

const SkeletonField = () => {
  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="h-3 w-24 bg-gray-200 rounded" />

      {/* Input box */}
      <div className="h-5 w-full bg-gray-200 rounded-lg" />
    </div>
  )
};

// export default AccountDetailsSkeleton;
export default AccountDetailsUpdated;
