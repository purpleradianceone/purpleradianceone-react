/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import FormInput from "../../ui/FormInput";
import TextAreaInput from "../../ui/TextAreaInput";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import {
  MOBILE_NUMBER_VALIDATION,
  STATUS_CODE,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import {
  Briefcase,
  Building2,
  Factory,
  FileSignature,
  FileText,
  Globe,
  Mail,
  MapPin,
  MapPinnedIcon,
  Phone,
  ReceiptText,
  Save,
  User,
  UserCogIcon,
  Waypoints,
  X,
} from "lucide-react";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import POST_API from "../../../constants/PostApi";
import CustomDropdown from "../leads/CustomDropdown";
import { useIndustryType } from "../../../config/hooks/useIndustryType";
import { usebusinessType } from "../../../config/hooks/useBusinessType";
import { useCompanyAccountType } from "../../../config/hooks/useCompanyAccountType";
import CompanyAccountType from "../../../@types/settings/CompanyAccountType";
import FormSkeleton from "./FormSkeleton";
import Button from "../../ui/Button";
import FormHeader from "../../ui/FormHeader";
import { useCountries } from "../../../config/hooks/useCountries";
import { useStates } from "../../../config/hooks/useStates";
import { useDistricts } from "../../../config/hooks/useDisctricts";
import FormLayout from "../../ui/FormLayout";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import axiosClient from "../../../axios-client/AxiosClient";

type CreateAccountType = {
  onClose: () => void;
  handleCreateAccount: () => void;
};
type AccountFormType = {
  name: string;
  email: string;
  mobilenumber: string;
  industry_type_id: number | undefined;
  business_type_id: number | undefined;
  pan: string;
  gst: string;
  tan: string;
  billing_address: string;
  shipping_address: string;
  registered_office_address: string;
  business_registration_number: string;
  website: string;
  lead_id: number;
  company_account_type_id_array: number[];
  createdby: number;
};
const CreateAccount: React.FC<CreateAccountType> = ({
  onClose,
  handleCreateAccount,
}) => {
  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { loginStatus } = useLoggedInUserContext();
  const [createAccountFormData, setCreateAccountFormData] =
    useState<AccountFormType>({
      name: "",
      mobilenumber: "",
      email: "",
      industry_type_id: undefined,
      business_type_id: undefined,
      pan: "",
      gst: "",
      tan: "",
      billing_address: "",
      shipping_address: "",
      registered_office_address: "",
      business_registration_number: "",
      website: "",
      lead_id: 0,
      company_account_type_id_array: [],
      createdby: loginStatus.id,
    });

  const { industryTypeData, loading: industryTypeLoading } = useIndustryType();
  const { businessType, isLoading: businessTypeLoading } = usebusinessType();
  const { companyAccountType, isLoading: companyTypeLoading } =
    useCompanyAccountType();

  const [companTypeId, setCompanyTypeId] = useState<number[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number>(0);
  const [selectedState, setSelectedState] = useState<number>(0);
  const [selectedDisctrict, setSelectedDisctrict] = useState<number>(0);
  const { countries } = useCountries();
  const { states } = useStates(selectedCountryId);
  const { districts } = useDistricts(selectedState);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    businessType: "",
    industryType: "",
  });

  useEffect(() => {
    setSelectedState(0);
    setSelectedDisctrict(0);
  }, [selectedCountryId]);
  function handleSelectedBusinessType(
    selectedBusinessType: number | undefined
  ) {
    setCreateAccountFormData((prev) => ({
      ...prev,
      business_type_id: selectedBusinessType ?? undefined,
    }));
    console.log(selectedBusinessType);
    if (selectedBusinessType !== undefined) {
      setErrors((prev) => ({
        ...prev,
        businessType: "",
      }));
    }
  }

  function handleSelectedIndustryType(
    selectedIndustryType: number | undefined
  ) {
    setCreateAccountFormData((prev) => ({
      ...prev,
      industry_type_id: selectedIndustryType ?? undefined,
    }));
    if (selectedIndustryType !== undefined) {
      setErrors((prev) => ({
        ...prev,
        industryType: "",
      }));
    }
  }

  const handleAccountTypeCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value);
    if (event.target.checked) {
      setCompanyTypeId([...companTypeId, value]);
    } else {
      setCompanyTypeId(companTypeId.filter((item) => item != value));
    }
  };

  const handleOnBlur = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

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

    if (name === "mobilenumber") {
      if (!value.trim()) {
        setErrors((prev) => ({
          ...prev,
          mobileNumber: "Mobile Number is required",
        }));
      } else if (
        !MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(value) &&
        value.length !== 0
      ) {
        setErrors((prev) => ({
          ...prev,
          mobileNumber: "Please enter a valid Mobile Number.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, mobileNumber: "" }));
      }
    }

    // if (name === "name" && !value.trim()) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     name: "Name is required",
    //   }));
    // } else {
    //   setErrors((prev) => ({
    //     ...prev,
    //     name: "",
    //   }));
    // }
    // if (name === "email" && !VALIDATIONS.EMAIL.test(value) && value !== "") {
    //   setErrors((prev) => ({
    //     ...prev,
    //     email: "please enter valid email address.",
    //   }));
    // } else {
    //   setErrors((prev) => ({
    //     ...prev,
    //     email: "",
    //   }));
    // }
    // if (
    //   name === "mobilenumber" &&
    //   !MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(value) &&
    //   value.length !== 0
    // ) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     mobileNumber: "Please enter a valid mobile number.",
    //   }));
    // } else {
    //   setErrors((prev) => ({
    //     ...prev,
    //     mobileNumber: "",
    //   }));
    // }
  };
  const handleFormInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setCreateAccountFormData({
      ...createAccountFormData,
      [name]: value,
    });
  };

  // create function call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    const { name, email, mobilenumber, business_type_id, industry_type_id } =
      createAccountFormData;
    let isValid = true;

    // Prepare a copy to store validation errors
    const newErrors: typeof errors = {
      name: "",
      email: "",
      mobileNumber: "",
      businessType: "",
      industryType: "",
    };

    // Check required fields
    if (!name.trim()) {
      newErrors.name = "Name is required.";
      toast.error("Name is required.");
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email address  is required.";
      toast.error("Email address  is required.");
      isValid = false;
    }
    if (!mobilenumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required.";
      toast.error("Mobile number is required.");
      isValid = false;
    }
    if (email.trim() && !VALIDATIONS.EMAIL.test(email)) {
      toast.error("Please enter a valid email address.");
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (
      mobilenumber.trim() &&
      !MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(mobilenumber)
    ) {
      newErrors.mobileNumber =
        "Please enter a valid 10-digit Indian mobile number.";
      toast.error("Please enter a valid 10-digit Indian mobile number.");
      isValid = false;
    }

    if (
      industry_type_id === 0 ||
      industry_type_id === null ||
      industry_type_id === undefined
    ) {
      newErrors.industryType = "Industry type is not selected.";
      toast.error("Industry type is not selected.");
      isValid = false;
    }
    if (
      business_type_id === 0 ||
      business_type_id === null ||
      business_type_id === undefined
    ) {
      newErrors.businessType = "Business type is not selected.";
      toast.error("Business type is not selected.");
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;
    setIsSaving(true);
    //  Proceed with form submission logic here
    const postData = {
      name: createAccountFormData.name.trim(),
      mobilenumber: createAccountFormData.mobilenumber.trim(),
      email: createAccountFormData.email.trim(),
      industry_type_id: createAccountFormData.industry_type_id,
      business_type_id: createAccountFormData.business_type_id,
      country_id: selectedCountryId,
      state_id: selectedState,
      district_id: selectedDisctrict,
      pan: createAccountFormData.pan.trim(),
      gst: createAccountFormData.gst.trim(),
      tan: createAccountFormData.tan.trim(),
      billing_address: createAccountFormData.billing_address.trim(),
      shipping_address: createAccountFormData.shipping_address.trim(),
      registered_office_address:
        createAccountFormData.registered_office_address.trim(),
      business_registration_number:
        createAccountFormData.business_registration_number.trim(),
      website: createAccountFormData.website.trim(),
      lead_id: null,
      company_account_type_id_array: companTypeId,
      createdby_id: loginStatus.id,
      company_id: loginStatus.companyId,
    };
    console.log(postData);

    await axiosClient
      .post(POST_API.CREATE_ACCOUNT, postData, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        if (data.status === true) {
          toast.success(data.message);
          handleStateClear();
          handleCreateAccount();
          onClose();
        } else {
          toast.error(data.message);
        }
      })
      .catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: handleSubmit,
          });
          if (refreshTokenResponse) {
            handleSubmit(e);
          }
        } else {
          console.log(error);

          toast.error(error.response.data);
        }
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  // note : to make the state clear
  function handleStateClear() {
    setCreateAccountFormData({
      name: "",
      mobilenumber: "",
      email: "",
      industry_type_id: 0,
      business_type_id: 0,
      pan: "",
      gst: "",
      tan: "",
      billing_address: "",
      shipping_address: "",
      registered_office_address: "",
      business_registration_number: "",
      website: "",
      lead_id: 0,
      company_account_type_id_array: [],
      createdby: loginStatus.id,
    });
    onClose();
  }

  // --- Group companyAccountType by parent ---
  const groupedData = companyAccountType.reduce((acc, item) => {
    if (!acc[item.accountTypeName]) {
      acc[item.accountTypeName] = [];
    }
    acc[item.accountTypeName].push(item);
    return acc;
  }, {} as Record<string, CompanyAccountType[]>);

  const loadingState =
    industryTypeLoading || businessTypeLoading || companyTypeLoading;

  if (loadingState) {
    return (
      <FormLayout>
        <FormSkeleton />
      </FormLayout>
    );
  }
  return (
    <FormLayout width={6}>
      {isSaving && <LoadingPopUpAnimation show={isSaving} />}

      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Close Button */}
        <FormHeader
          icon={UserCogIcon}
          preText="Create new account"
          description="Complete the form below to add a new account and manage it effectively"
          onClose={() => {
            handleStateClear();
            onClose();
          }}
        />

        {/* Form */}
        <form className=" grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
          {/* name */}
          <div className="flex flex-col col-span-1">
            <FormInput
              required
              logo={User}
              type="text"
              label="Name:"
              name="name"
              maxLength={VALIDATIONS.MAX_NAME_LENGTH}
              minLength={VALIDATIONS.MIN_NAME_LENGTH}
              placeholder="Name"
              value={createAccountFormData.name}
              onBlur={handleOnBlur}
              onChange={handleFormInputChange}
            />
            {errors.name && (
              <p className="text-xs  text-red-600 ">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col col-span-1">
            {/* email */}
            <FormInput
              required
              logo={Mail}
              type="text"
              label="Email:"
              name="email"
              maxLength={VALIDATIONS.MAX_NAME_LENGTH}
              minLength={VALIDATIONS.MIN_NAME_LENGTH}
              placeholder="Enter email address"
              value={createAccountFormData.email}
              onBlur={handleOnBlur}
              onChange={handleFormInputChange}
            />
            {errors.email && (
              <p className="text-xs  text-red-600 ">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1">
            <div>
              {/* mobile number */}

              <FormInput
                required
                logo={Phone}
                type="text"
                label="Mobile Number: "
                name="mobilenumber"
                maxLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
                minLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
                placeholder="Enter mobile number"
                value={createAccountFormData.mobilenumber}
                onBlur={handleOnBlur}
                onChange={handleFormInputChange}
              />
              {errors.mobileNumber && (
                <p className="text-xs  text-red-600 mt-1">
                  {errors.mobileNumber}
                </p>
              )}
            </div>
            {/* Business registration number */}
            <FormInput
              logo={Phone}
              type="text"
              label="Business Registration Number: "
              name="business_registration_number"
              maxLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
              minLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
              placeholder="Enter business registration number"
              value={createAccountFormData.business_registration_number}
              onBlur={handleOnBlur}
              onChange={handleFormInputChange}
            />
          </div>
          <div className="grid grid-cols-3 gap-1">
            {/* pan */}
            <FormInput
              logo={FileText}
              type="text"
              label="Pan:"
              name="pan"
              placeholder="Enter pan number"
              value={createAccountFormData.pan}
              onBlur={handleOnBlur}
              onChange={handleFormInputChange}
            />
            {/* gst */}
            <FormInput
              logo={ReceiptText}
              type="text"
              label="Gst: "
              name="gst"
              placeholder="Enter gst number"
              value={createAccountFormData.gst}
              onBlur={handleOnBlur}
              onChange={handleFormInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {/* tan */}
            <FormInput
              logo={FileSignature}
              type="text"
              label="Tan: "
              name="tan"
              maxLength={VALIDATIONS.MAX_NAME_LENGTH}
              minLength={VALIDATIONS.MIN_NAME_LENGTH}
              placeholder="Enter tan number"
              value={createAccountFormData.tan}
              onBlur={handleOnBlur}
              onChange={handleFormInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-1">
            {/* Business type */}
            <CustomDropdown
              requiredRedDot
              logo={Briefcase}
              labelName="Business Type:"
              options={businessType}
              onSelect={handleSelectedBusinessType}
            />
            {errors.businessType && (
              <p className="text-xs  text-red-600 mt-1">
                {errors.businessType}
              </p>
            )}
            {/* Industry type */}
            <CustomDropdown
              requiredRedDot
              logo={Factory}
              labelName="Industry Type:"
              options={industryTypeData}
              onSelect={handleSelectedIndustryType}
            />
            {errors.industryType && (
              <p className="text-xs  text-red-600 mt-1">
                {errors.industryType}
              </p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {/* Country*/}
            <CustomDropdown
              logo={Globe}
              labelName="Country"
              preselectedOption={selectedCountryId}
              onSelect={(selectedValue) => {
                if (selectedValue) {
                  setSelectedCountryId(selectedValue);
                } else {
                  setSelectedCountryId(0);
                }
              }}
              options={countries}
            />

            {/* Country*/}
            <CustomDropdown
              logo={Waypoints}
              labelName="State"
              selectedValue={selectedState}
              preselectedOption={selectedState}
              onSelect={(value) => {
                if (value) {
                  setSelectedState(value);
                } else {
                  setSelectedState(0);
                }
              }}
              options={states}
            />
            {/* Country*/}
            <CustomDropdown
              logo={MapPinnedIcon}
              labelName="District"
              selectedValue={selectedDisctrict}
              preselectedOption={selectedDisctrict}
              onSelect={(value) => {
                if (value) {
                  setSelectedDisctrict(value);
                } else {
                  setSelectedDisctrict(0);
                }
              }}
              options={districts}
            />
          </div>

          <div className="col-span-1  rounded-md">
            <span className="input-label-custom flex items-center gap-1">
              <Building2 size={14} className="inline mr-1 text-blue-500" />
              <span>Company Account Type:</span>
            </span>

            <div className="grid  grid-cols-2 gap-y-2 p-2 max-h-28 overflow-auto">
              {companyAccountType.length === 0 ? (
                <h1 className="caption-custom text-center">
                  No account type available.
                </h1>
              ) : (
                Object.entries(groupedData).map(([parentType, children]) => {
                  return (
                    <div key={parentType}>
                      <span className="input-label-custom-blue">
                        {" "}
                        {parentType}{" "}
                      </span>

                      {children &&
                        children.length &&
                        children.map((item) => (
                          <div key={item.id} className="flex  items-center">
                            <div className="flex p-1">
                              <input
                                id={`account-type-${item.id}`}
                                name="companyAccountType"
                                type="checkbox"
                                value={item.id}
                                className="h-4 w-4 text-blue-600  focus:ring-blue-500 border-gray-300 rounded"
                                onChange={handleAccountTypeCheckboxChange}
                              />
                              <label
                                htmlFor={`account-type-${item.id}`}
                                className="ml-2 block caption-custom cursor-pointer hover:text-blue-700"
                              >
                                {item.companyAccountTypeName}
                              </label>
                            </div>
                          </div>
                        ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* website */}
          <FormInput
            logo={Globe}
            type="text"
            label="Website: "
            name="website"
            maxLength={VALIDATIONS.MAX_NAME_LENGTH}
            minLength={VALIDATIONS.MIN_NAME_LENGTH}
            placeholder="Enter website url"
            value={createAccountFormData.website}
            onBlur={handleOnBlur}
            onChange={handleFormInputChange}
            // className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {/* billing address */}
          <TextAreaInput
            logo={MapPin}
            cols={4}
            rows={3}
            label="Billing Address: "
            name="billing_address"
            placeholder="Enter Billing address"
            value={createAccountFormData.billing_address}
            maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
            onBlur={handleOnBlur}
            onChange={handleFormInputChange}
            // className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {/* shipping address */}
          <TextAreaInput
            logo={MapPin}
            cols={4}
            rows={3}
            label="Shipping Address: "
            name="shipping_address"
            placeholder="Enter Shipping address"
            value={createAccountFormData.shipping_address}
            maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
            onBlur={handleOnBlur}
            onChange={handleFormInputChange}
            // className="w-full col-span-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {/* registered office address */}
          <TextAreaInput
            logo={MapPin}
            cols={4}
            rows={3}
            label="Registered Office Address: "
            name="registered_office_address"
            placeholder="Enter registered office address"
            value={createAccountFormData.registered_office_address}
            maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
            onBlur={handleOnBlur}
            onChange={handleFormInputChange}
            // className="w-full border rounded-lg col-span-2 px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          <div className="col-span-2 flex justify-end gap-3">
            <div>
              <Button type="button" onClick={handleStateClear}>
                <div className="flex items-center gap-0.5">
                  <X size={16} /> Cancel
                </div>
              </Button>
            </div>

            <div>
              <Button type="submit" onClick={handleSubmit}>
                <div className="flex items-center gap-1">
                  <Save size={16} /> Save
                </div>
              </Button>
            </div>
          </div>
        </form>
      </motion.section>
    </FormLayout>
  );
};
export default CreateAccount;
