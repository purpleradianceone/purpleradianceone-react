/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import FormInput from "../../ui/FormInput";
import TextAreaInput from "../../ui/TextAreaInput";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
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
  Phone,
  ReceiptText,
  User,
} from "lucide-react";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import toast from "react-hot-toast";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import CustomDropdown from "../leads/CustomDropdown";
import industryType from "../../../@types/general/industryType";
import CompanyAccountType from "../../../@types/settings/CompanyAccountType";
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";

type CreateAccountType = {
  onClose: () => void;
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
type BusinessType = {
  id: number;
  name: string;
  isactive: boolean;
};
const CreateAccount: React.FC<CreateAccountType> = ({ onClose }) => {
  const { loginStatus } = useLoggedInUserContext();
  const [businessType, setBusinessType] = useState<BusinessType[]>([]);
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

  const [industryType, setIndustryType] = useState<industryType[]>([]);

  const [companTypeId, setCompanyTypeId] = useState<number[]>([]);
  const [companyAccountType, setCompanyAccountType] = useState<
    CompanyAccountType[]
  >([]);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    businessType: "",
    industryType: "",
  });

  const getBusinessType = async () => {
    const postData = {
      id: null,
      name: null,
      isactive: null,
      company_id: loginStatus.companyId,
      requestedby: loginStatus.id,
    };

    await axios
      .post(POST_API.GET_BUSINESS_TYPE, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          setBusinessType(response.data);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getBusinessType,
          });
          if (refreshTokenResponse) {
            getBusinessType();
          }
        }
      });
  };

  const getComapnyAccountType = async () => {
    const PostDataToGetCompanyAccountType = {
      company_id: loginStatus.companyId,
      account_type_id: null,
      id: null,
      isactive: null,
      requestedby_id: loginStatus.id,
    };

    axios
      .post(
        POST_API.GET_COMPANY_ACCOUNT_TYPE,
        PostDataToGetCompanyAccountType,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const responseData = response.data;

          const companyAccountData: CompanyAccountType[] = responseData.map(
            (item: any) => ({
              id: item.id,
              companyId: item.company_id,
              accountTypeId: item.account_type_id,
              companyAccountTypeName: item.company_account_type_name,
              accountTypeName: item.account_type_name,
              isActive: item.isactive,
              createdBy: item.createdby,
              createdOn: item.createdon,
              updatedBy: item.updatedby,
              updatedOn: item.updatedon,
            })
          );
          setCompanyAccountType(companyAccountData);
        }
      });
  };
  // Note : function to get industry type
  const fetchIndustryType = async () => {
    const postData = {
      id: null,
      name: null,
      isactive: true,
    };
    try {
      const response = await axios.post(POST_API.GET_INDUSTRY_TYPE, postData, {
        withCredentials: true,
      });

      if (response.status === STATUS_CODE.OK) {
        setIndustryType(response.data);
      } else {
        throw new Error("Failed to fetch industry type");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: fetchIndustryType,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          fetchIndustryType();
        }
      }
    }
  };

  function handleSelectedBusinessType(
    selectedBusinessType: number | undefined
  ) {
    setCreateAccountFormData((prev) => ({
      ...prev,
      business_type_id: selectedBusinessType ?? undefined,
    }));
    console.log(selectedBusinessType);
     if(selectedBusinessType !== undefined){
      setErrors((prev) =>({
        ...prev,
        businessType : ""
      }))
    }
  }

  function handleSelectedIndustryType(
    selectedIndustryType: number | undefined
  ) {
    setCreateAccountFormData((prev) => ({
      ...prev,
      industry_type_id: selectedIndustryType ?? undefined,
    }));
    if(selectedIndustryType !== undefined){
      setErrors((prev) =>({
        ...prev,
        industryType : ""
      }))
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

    if (name === "name" && !name.trim()) {
      setErrors((prev) => ({
        ...prev,
        name: "Name is required",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        name: "",
      }));
    }
    if (name === "email" && !VALIDATIONS.EMAIL.test(value) && value !== "") {
      setErrors((prev) => ({
        ...prev,
        email: "please enter valid email address.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
    if (
      name === "mobilenumber" &&
      !MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(value) &&
      value.length !== 0
    ) {
      setErrors((prev) => ({
        ...prev,
        mobileNumber: "Please enter a valid mobile number.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        mobileNumber: "",
      }));
    }
  };
  const handleFormInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setCreateAccountFormData({
      ...createAccountFormData,
      [name]: value.trim(),
    });
    console.log(createAccountFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.error("Name is required.")
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email address  is required.";
 toast.error("Email address  is required.")
      isValid = false;
    }
    if (!mobilenumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required.";
      toast.error("Mobile number is required.")
      isValid = false;
    }
    if (email.trim() && !VALIDATIONS.EMAIL.test(email)) {
      toast.error("Please enter a valid email address.")
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (
      mobilenumber.trim() &&
      !MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(mobilenumber)
    ) {
      newErrors.mobileNumber =
        "Please enter a valid 10-digit Indian mobile number.";
        toast.error("Please enter a valid 10-digit Indian mobile number.")
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

    //  Proceed with form submission logic here
    const postData = {
      name: createAccountFormData.name.trim(),
      mobilenumber: createAccountFormData.mobilenumber.trim(),
      email: createAccountFormData.email.trim(),
      industry_type_id: createAccountFormData.industry_type_id,
      business_type_id: createAccountFormData.business_type_id,
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
    await axios
      .post(POST_API.CREATE_ACCOUNT, postData, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        if (data.status === true) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        handleStateClear();
      });
  };
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

  useEffect(() => {
    getBusinessType();
    fetchIndustryType();
    getComapnyAccountType();
  }, []);
  return (
    <div className="fixed top-8 inset-0 z-20 flex items-center justify-center bg-black/5 ">
      <div className="bg-white rounded-2xl shadow-lg w-full m-20 p-4 h-full max-h-[80vh]  max-w-5xl overflow-auto ">
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={handleStateClear}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <h2 className="text-xl font-semibold text-gray-800 py-4 mb-2  border-b">
          Create new account
        </h2>
        <form className="space-y-2 grid grid-cols-2 gap-3">
          {/* name */}
          <div className="flex flex-col col-span-1">
            <FormInput
              required
              logo={User}
              type="text"
              label="Name :"
              name="name"
              maxLength={VALIDATIONS.MAX_NAME_LENGTH}
              minLength={VALIDATIONS.MIN_NAME_LENGTH}
              placeholder="Name"
              value={createAccountFormData.name}
              onBlur={handleOnBlur}
              onChange={handleFormInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-xs  text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col col-span-1">
            {/* email */}
            <FormInput
              logo={Mail}
              type="text"
              label="Email :"
              name="email"
              maxLength={VALIDATIONS.MAX_NAME_LENGTH}
              minLength={VALIDATIONS.MIN_NAME_LENGTH}
              placeholder="Enter email address"
              value={createAccountFormData.email}
              onBlur={handleOnBlur}
              onChange={handleFormInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-xs  text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col col-span-1">
            {/* mobile number */}
            <FormInput
              logo={Phone}
              type="text"
              label="Mobile number: "
              name="mobilenumber"
              maxLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
              minLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
              placeholder="Enter mobile number"
              value={createAccountFormData.mobilenumber}
              onBlur={handleOnBlur}
              onChange={handleFormInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {errors.mobileNumber && (
              <p className="text-xs  text-red-600 mt-1">
                {errors.mobileNumber}
              </p>
            )}
          </div>
          {/* pan */}
          <FormInput
            logo={FileText}
            type="text"
            label="Pan :"
            name="pan"
            placeholder="Enter pan number"
            value={createAccountFormData.pan}
            onBlur={handleOnBlur}
            onChange={handleFormInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {/* gst */}
          <FormInput
            logo={ReceiptText}
            type="text"
            label="Gst : "
            name="gst"
            placeholder="Enter email address"
            value={createAccountFormData.email}
            onBlur={handleOnBlur}
            onChange={handleFormInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {/* tan */}
          <FormInput
            logo={FileSignature}
            type="text"
            label="Tan : "
            name="tan"
            maxLength={VALIDATIONS.MAX_NAME_LENGTH}
            minLength={VALIDATIONS.MIN_NAME_LENGTH}
            placeholder="Enter tan"
            value={createAccountFormData.tan}
            onBlur={handleOnBlur}
            onChange={handleFormInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-col col-span-1">
            {/* Business type */}
            <CustomDropdown
              logo={Briefcase}
              labelName="Business Type :"
              options={businessType}
              onSelect={handleSelectedBusinessType}
            />
            {errors.businessType && (
              <p className="text-xs  text-red-600 mt-1">
                {errors.businessType}
              </p>
            )}
          </div>
          <div className="flex flex-col col-span-1">
            {/* Industry type */}
            <CustomDropdown
              logo={Factory}
              labelName="Industry type :"
              options={industryType}
              onSelect={handleSelectedIndustryType}
            />
            {errors.industryType && (
              <p className="text-xs  text-red-600 mt-1">
                {errors.industryType}
              </p>
            )}
          </div>
          <div className="col-span-2  border rounded-md ">
            <span className="text-md font-semibold text-gray-700 pl-1">
              <Building2 size={14} className="inline mr-1 text-blue-500" />{" "}
              Company account type :
            </span>
            <div className="grid grid-cols-3 gap-y-2 p-2 max-h-52 overflow-y-auto ">
              {companyAccountType.length > 0 &&
                companyAccountType.map((item) => (
                  <div className="flex items-center">
                    <input
                      id={item.companyAccountTypeName}
                      name={item.companyAccountTypeName}
                      type="checkbox"
                      value={item.id}
                      className="h-4 w-4  text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onChange={handleAccountTypeCheckboxChange}
                    />
                    <label
                      htmlFor={item.companyAccountTypeName}
                      className="ml-2 block text-xs  text-gray-800"
                    >
                      {item.companyAccountTypeName}
                    </label>
                  </div>
                ))}
              {companyAccountType.length <= 0 && (
                <>
                  <div className="flex items-center justify-center w-full border rounded-md shadow-lg p-3 ">
                    <span className="text-md font-semibold text-gray-800">
                      Loading
                    </span>
                    <LoadingSpinner />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Business registration number */}
          <FormInput
            logo={Phone}
            type="text"
            label="Business registration number : "
            name="business_registration_number"
            maxLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
            minLength={VALIDATIONS.MOBILE_NUMBER_LENGTH}
            placeholder="Enter business registration number"
            value={createAccountFormData.business_registration_number}
            onBlur={handleOnBlur}
            onChange={handleFormInputChange}
            className="w-full  border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {/* website */}
          <FormInput
            logo={Globe}
            type="text"
            label="Website : "
            name="website"
            maxLength={VALIDATIONS.MAX_NAME_LENGTH}
            minLength={VALIDATIONS.MIN_NAME_LENGTH}
            placeholder="Enter website"
            value={createAccountFormData.website}
            onBlur={handleOnBlur}
            onChange={handleFormInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {/* billing address */}
          <TextAreaInput
            logo={MapPin}
            cols={4}
            rows={4}
            label="Billing address : "
            name="billing_address"
            placeholder="Enter Billing address"
            value={createAccountFormData.billing_address}
            onBlur={handleOnBlur}
            onChange={handleFormInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {/* shipping address */}
          <TextAreaInput
            logo={MapPin}
            cols={4}
            rows={4}
            label="Shipping address : "
            name="shipping_address"
            placeholder="Enter Shipping address"
            value={createAccountFormData.shipping_address}
            onBlur={handleOnBlur}
            onChange={handleFormInputChange}
            className="w-full col-span-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {/* registered office address */}
          <TextAreaInput
            logo={MapPin}
            cols={4}
            rows={4}
            label="Registered office address : "
            name="registered_office_address"
            placeholder="Enter registered office address"
            value={createAccountFormData.registered_office_address}
            onBlur={handleOnBlur}
            onChange={handleFormInputChange}
            className="w-full border rounded-lg col-span-2 px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          <div className="col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleStateClear}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateAccount;
