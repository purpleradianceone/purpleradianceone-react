/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Clock, Handshake, Link, Mail, Phone, Save, User, UserRoundPlus, X } from "lucide-react";
import {
  MOBILE_NUMBER_VALIDATION,
  NUMBER_VALUES,
  STATUS_CODE,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import Button from "../../ui/Button";
import React, { useEffect, useState } from "react";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { useFormChange } from "../../../config/hooks/useFormChange";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import PostDataTypeForLeadSourceAndStatusAndStates from "../../../@types/lead-management/PostDataTypeForLeadSourceAndStatusAndStates";
import CustomDropdown from "./CustomDropdown";
import CreateManualLead from "../../../@types/lead-management/CreateManualLead";
import GetCompanyUsersForLead from "./company-users-selection-modal/GetCompanyUsersForLead";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import PostDataForCreateLead from "../../../@types/List/PostDataForCreateLead";
import RefreshToken from "../../../config/validations/RefreshToken";
import CreateLeadModalProps from "../../../@types/lead-management/CreateLeadModalProps";
import ApiError from "../../../@types/error/ApiError";
import toast from "react-hot-toast";
import FormHeader from "../../ui/FormHeader";
import FormInput from "../../ui/FormInput";
import { createPortal } from "react-dom";

function CreateLeadModal({
  isOpen,
  onClose,
  onCreateLeadRefreshLeadData,
}: CreateLeadModalProps) {
  const initialCreatLeadFormData: CreateManualLead = {
    name: "",
    email: "",
    mobileNumber: "",
  };
  const createLeadInputTagCss =
    "w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500";
  const { loginStatus } = useLoggedInUserContext();
  const { errors } = useFormValidation(
    initialCreatLeadFormData,
    "registration"
  );
  const {
    formData: createLeadModalFormData,
    handleChange: handleCreateLeadModalFormDataChange,
  } = useFormChange(initialCreatLeadFormData);

  //states for lead status and source and state
  const [leadSource, setLeadSource] = useState<
    PostDataTypeForLeadSourceAndStatusAndStates[] | null
  >(null);

  const [leadStatus, setLeadStatus] = useState<
    PostDataTypeForLeadSourceAndStatusAndStates[] | null
  >(null);

  // note : changes needs to be done
  const [error, setError] = useState<{
    email: string;
    mobileNumber: string;
  }>({
    email: "",
    mobileNumber: "",
  });
  //note : states to set the data from dropdown

  // NOTE : ADD THIS selectedStatus
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(
    undefined
  );
  // NOTE : ADD THIS selectedSource
  const [selectedSource, setSelectedSource] = useState<number | undefined>(
    undefined
  );

  const [openPopUpOfCompanyUserModal, setOpenPopUpOfCompanyUserModal] =
    useState(false);

  const handleCompanyUserPopUp = () => {
    setOpenPopUpOfCompanyUserModal(true);
  };

  //note : these 3 functions that handles changed values from dropdown
  const handleLeadSelectedStatus = (value: number | undefined) => {
    setSelectedStatus(value);
  };
  const handleLeadSelectedSource = (value: number | undefined) => {
    setSelectedSource(value);
  };

  // note : to show errors in form
  const [showErrorAtLeadStatus, setShowErrorAtLeadStatus] =
    useState<boolean>(false);
  const [showErrorAtLeadSource, setshowErrorAtLeadSource] =
    useState<boolean>(false);
  //note : this is the selected company user data

  const [persistedSelectedUserId, setPersistedSelectedUserId] = useState<
    number | null
  >(loginStatus.id);

  const [selectedCompanyUser, setSelectedCompanyUser] = useState<CompanyUser>({
    company_id: 0,
    id: 0,
    fullname: "",
    email: "",
    mobilenumber: "",
    createdby: "",
    isactive: false,
    requestedby: "",
    generate_password: "",
  });

  const handleSelectedCompanyUserChange = (params: CompanyUser | null) => {
    if (params) {
      setPersistedSelectedUserId(params.id);

      setSelectedCompanyUser({
        company_id: params.company_id,
        id: params.id,
        fullname: params.fullname,
        email: params.email,
        mobilenumber: params.mobilenumber,
        createdby: "",
        isactive: params.isactive,
        requestedby: "",
        generate_password: "",
      });
    } else {
      setPersistedSelectedUserId(null);
      // Reset selectedCompanyUser to its initial state when null is received
      setSelectedCompanyUser({
        company_id: 0,
        id: 0,
        fullname: "",
        email: "",
        mobilenumber: "",
        createdby: "",
        isactive: false,
        requestedby: "",
        generate_password: "",
      });
    }
  };

  //   NOTE : FUNCTIONS GET THE DATA FROM BACKEND
  const getLeadSourceOptions = async () => {
    const postDataForLeadSource: PostDataTypeForLeadSourceAndStatusAndStates = {
      id: null,
      name: null,
      description: null,
      isactive: true,
    };
    try {
      const response = await axios.post(
        POST_API.GET_LEAD_SOURCE,
        postDataForLeadSource,
        {
          withCredentials: true,
        }
      );
      if (response.status === STATUS_CODE.OK) {
        setLeadSource(response.data);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getLeadSourceOptions,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          getLeadSourceOptions();
        }
      }
    }
  };

  //called the function in here
  const getLeadStatusOptions = async () => {
    const postDataForLeadStatus: PostDataTypeForLeadSourceAndStatusAndStates = {
      id: null,
      name: null,
      description: null,
      isactive: true,
    };

    try {
      const response = await axios.post(
        POST_API.GET_LEAD_STATUS,
        postDataForLeadStatus,
        {
          withCredentials: true,
        }
      );

      setLeadStatus(response.data);
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: getLeadStatusOptions,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          getLeadStatusOptions();
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      getLeadSourceOptions();
      getLeadStatusOptions();
    }
  }, [isOpen]);
  //
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email" && !VALIDATIONS.EMAIL.test(value) && value !== "") {
      setError((prev) => ({
        ...prev,
        email: "please enter invalid email address.",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        email: "",
      }));
    }

    if (
      name === "mobileNumber" &&
      !MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(value) &&
      value.length !== 0
    ) {
      setError((prev) => ({
        ...prev,
        mobileNumber: "Please enter a valid mobile number.",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        mobileNumber: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error.mobileNumber !== "") {
      // showMessageSnackbar({
      //   message: "Please enter a valid mobile number.",
      //   type: "error",
      // });
      toast.error("Please enter a valid mobile number.");
      return;
    }
    if (error.email !== "") {
      // showMessageSnackbar({
      //   message: "Please enter a valid email address.",
      //   type: "error",
      // });
      toast.error("Please enter a valid email address.");
      return;
    }
    const isEmailFilled = createLeadModalFormData.email !== "";
    const isMobileNumberFilled = createLeadModalFormData.mobileNumber !== "";
    if (selectedSource === undefined) {
      setshowErrorAtLeadSource(true);
    }
    if (selectedStatus === undefined) {
      setShowErrorAtLeadStatus(true);
    }
    if (!isEmailFilled && !isMobileNumberFilled) {
      setError({
        email: "Eighter email or Mobile number is req.",
        mobileNumber: "Eighter email or Mobile number is req.",
      });
      return;
    }
    if (selectedSource === undefined || selectedStatus === undefined) {
      // showMessageSnackbar({
      //   message: "please select source and status",
      //   type: "error",
      // });
      toast.error("Please select source and status");
      return;
    }
    if (
      createLeadModalFormData.email !== "" ||
      createLeadModalFormData.mobileNumber !== "" ||
      selectedSource !== undefined ||
      selectedStatus !== undefined
    ) {
      const PostDataForCreateLead: PostDataForCreateLead = {
        company_id: loginStatus.companyId,
        ownerid:
          selectedCompanyUser.id === 0
            ? loginStatus.id
            : selectedCompanyUser.id,
        name:
          createLeadModalFormData.name === ""
            ? null
            : createLeadModalFormData.name,
        email:
          createLeadModalFormData.email === ""
            ? null
            : createLeadModalFormData.email,
        createdby_id: loginStatus.id,
        lead_source_id: selectedSource!,
        lead_status_id: selectedStatus!,
        mobilenumber:
          createLeadModalFormData.mobileNumber === ""
            ? null
            : createLeadModalFormData.mobileNumber,
      };

      await axios
        .post(POST_API.CREATE_LEAD, PostDataForCreateLead, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status === true) {
            toast.success(response.data.message);
            // note : this callback will run to refresh the list of aggrid
            onCreateLeadRefreshLeadData!();
            setTimeout(() => {
              onClose!();
            }, NUMBER_VALUES.SNACKBAR_DURATION);
          } else if (response.data.status == false) {
            toast.error(response.data.message);
          }
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenStatus = await RefreshToken({
              callFunctionWithEvent: handleSubmit,
            });
            if (refreshTokenStatus) {
              handleSubmit(e);
            }
          }
        });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      errors.email = "";
      errors.name = "";
      setOpenPopUpOfCompanyUserModal(false);
      setPersistedSelectedUserId(null);
      setSelectedCompanyUser({
        company_id: 0,
        id: 0,
        fullname: "",
        email: "",
        mobilenumber: "",
        createdby: "",
        isactive: false,
        requestedby: "",
        generate_password: "",
      });
      setError({
        email: "",
        mobileNumber: "",
      });

      setShowErrorAtLeadStatus(false);
      setshowErrorAtLeadSource(false);
      //resetting the form data
      createLeadModalFormData.email = "";
      createLeadModalFormData.name = "";
      createLeadModalFormData.mobileNumber = "";
      setSelectedSource(undefined);
      setSelectedStatus(undefined);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-5 flex items-center justify-center  overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl relative animate-fadeIn p-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        {/* <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <Handshake className="text-blue-500" size={SIZE.TWENTY_FOUR} />
            <h2 className="text-lg font-semibold text-gray-800">
              Create New Opportunity
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={SIZE.TWENTY} />
          </button>
        </div> */}
        <FormHeader
          icon={Handshake}
          onClose={onClose}
          preText="Create new "
          userName="Opportunity"
          description="Fill in the details below to create a new lead."
        />

        {/* Divider */}
        {/* <div className="border-t border-gray-300"></div> */}

        {/* Form */}
        <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1">
            {/* <div className=""> */}
              <FormInput
              label="Name:"
              logo={User}                type="text"
                name="name"
                placeholder="Enter Name: "
                value={createLeadModalFormData.name}
                onChange={handleCreateLeadModalFormDataChange}
              />
              {/* <label className={createLeadLabelCss} htmlFor="name">
                Name:
              </label>
              <input
                className={createLeadInputTagCss}
                type="text"
                name="name"
                placeholder="Enter Name: "
                value={createLeadModalFormData.name}
                onChange={handleCreateLeadModalFormDataChange}
              /> */}
            {/* </div> */}
            {/* NOTE : EIGHTER ONE THEM IS REQUIRED FIELD (from email and mobile number) */}
            <div className="">
               <FormInput
               label="Email:"
               logo={Mail}
                type="email"
                name="email"
                placeholder="Enter Email: "
                value={createLeadModalFormData.email}
                onChange={handleCreateLeadModalFormDataChange}
                onBlur={handleBlur}
              />
              {error.email && (
                <div className="text-red-500 text-xs">{error.email}</div>
              )}
            </div>

            {/* <FormInput
              label="Email : "
              type="email"
              name="email"
              placeholder="Enter Email"
              value={createLeadModalFormData.email}
              onChange={handleCreateLeadModalFormDataChange}
              error={errors.email}
              onBlur={handleBlur}
            /> */}
            <div className="">
               <FormInput
               type="text"
               label="Mobile Number:"
               logo={Phone}
                className={createLeadInputTagCss}
                name="mobileNumber"
                placeholder="Enter Mobile Number: "
                value={createLeadModalFormData.mobileNumber}
                onBlur={handleBlur}
                onChange={handleCreateLeadModalFormDataChange}
              />
              {/* <label className={createLeadLabelCss} htmlFor="mobileNumber">
                Mobile Number:
              </label>
              <input */}
               
              {/* /> */}
              {error.mobileNumber && (
                <div className="caption-custom-inactive">{error.mobileNumber}</div>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between pr-60 gap-1 w-full">
                <Button onClick={(e) => {
                  e.preventDefault();
                  handleCompanyUserPopUp();
                  }} type="submit">
                  <div className="flex gap-1 items-center whitespace-nowrap">
                    <UserRoundPlus size={16} />
                    <span>Assign Lead Owner</span>
                  </div>
                </Button>

                <span className="caption-custom whitespace-nowrap">
                  <span className="input-label-custom">Lead Owner :</span>{" "}
                  {/* {selectedCompanyUser.fullname || loginStatus.fullName +`(if not assigned)`} */}
                  {selectedCompanyUser.fullname || loginStatus.fullName}
                </span>
              </div>

              <span className="caption-custom">
                <span className="">Note :</span> If a lead owner is
                not selected, then lead will be assigned to the lead
                <span className=""> Creator</span> by default.
              </span>
            </div>

            {/* Lead Status */}
            <div className="space-y-1">
              <CustomDropdown
              logo={Clock}
              requiredRedDot
                labelName="Lead Status :"
                options={leadStatus!}
                onSelect={handleLeadSelectedStatus}
              />
              {showErrorAtLeadStatus && !selectedStatus && (
                <div className="text-red-500 text-xs">
                  Please select Lead Status
                </div>
              )}
            </div>

            {/* Lead Source */}
            <div className="space-y-1">
              <CustomDropdown
              logo={Link}
              requiredRedDot
                labelName="Lead Source :"
                options={leadSource!}
                onSelect={handleLeadSelectedSource}
              />
              {showErrorAtLeadSource && !selectedSource && (
                <div className="text-red-500 text-xs">
                  Please select Lead Source
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end ">
            <div className="flex gap-2">
              <Button  
              onClick={onClose}
              type="button">
                <div className="flex items-center gap-0.5">
                  <X size={16} />
                  <span>Cancel</span>
                </div>
              </Button>
              <Button type="submit">
                <div className="flex items-center gap-1">
                  <Save size={16} />
                  <span>Save</span>
                </div>
              </Button>
            </div>
          </div>
        </form>
      </div>

      {openPopUpOfCompanyUserModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-3 shadow-lg w-full max-w-5xl max-h-[100vh] overflow-y-auto relative animate-fadeIn">
            {/* Header with Close Button */}
            {/* <div className="flex justify-between items-center p-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Select Company User
              </h3>
              <button
                onClick={() => setOpenPopUpOfCompanyUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div> */}

              
            <FormHeader
            icon={UserRoundPlus}
            onClose={() => setOpenPopUpOfCompanyUserModal(false)}
            preText="Select Company User"
            description="Select the user to assign him/her as lead owner"
            />
            {/* NOTE : CALL TO THE MODAL COMPONENT */}
            <div className="p-1">
              <GetCompanyUsersForLead
                selectedUserId={persistedSelectedUserId} // Pass the persisted ID
                handleSelectedCompanyUserChange={
                  handleSelectedCompanyUserChange
                }
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default CreateLeadModal;
