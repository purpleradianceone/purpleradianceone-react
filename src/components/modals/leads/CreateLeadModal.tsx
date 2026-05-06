/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Clock,
  Handshake,
  Link,
  Mail,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import {
  MOBILE_NUMBER_VALIDATION,
  STATUS_CODE,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import Button from "../../ui/Button";
import React, { useEffect, useState } from "react";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { useFormChange } from "../../../config/hooks/useFormChange";
import POST_API from "../../../constants/PostApi";
import PostDataTypeForLeadSourceAndStatusAndStates from "../../../@types/lead-management/PostDataTypeForLeadSourceAndStatusAndStates";
import CreateManualLead from "../../../@types/lead-management/CreateManualLead";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import PostDataForCreateLead from "../../../@types/List/PostDataForCreateLead";
import RefreshToken from "../../../config/validations/RefreshToken";
import CreateLeadModalProps from "../../../@types/lead-management/CreateLeadModalProps";
import ApiError from "../../../@types/error/ApiError";
import toast from "react-hot-toast";
import FormHeader from "../../ui/FormHeader";
import FormInput from "../../ui/FormInput";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import axiosClient from "../../../axios-client/AxiosClient";
import CustomSelect from "../../ui/CustomSelect";
import { toSelectOptions } from "../../../utils/toSelectOption";
import FormLayout from "../../ui/FormLayout";
import { CustomSelectLookupCompanyUser } from "../../custom-select-component/CustomSelectLookupCompanyUser";

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
    PostDataTypeForLeadSourceAndStatusAndStates[]
  >([]);

  // Note : changes done here
  const [leadStatus, setLeadStatus] = useState<
    PostDataTypeForLeadSourceAndStatusAndStates[]
  >([]);

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

  // const [openPopUpOfCompanyUserModal, setOpenPopUpOfCompanyUserModal] =
  //   useState(false);

    // Note : lead owner state 
    const [selectedLeadOwner, setSelectedLeadOwner] =
    useState<number | null>(null);

  const leadOwnerId =
    selectedLeadOwner || loginStatus.id; //  default rule applied here


  // const handleCompanyUserPopUp = () => {
  //   setOpenPopUpOfCompanyUserModal(true);
  // };

  const [isSaving, setIsSaving] = useState<boolean>(false);
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

  // const [persistedSelectedUserId, setPersistedSelectedUserId] = useState<
  //   number | null
  // >(loginStatus.id);

  // const [selectedCompanyUser, setSelectedCompanyUser] = useState<CompanyUser>({
  //   company_id: 0,
  //   id: 0,
  //   fullname: "",
  //   email: "",
  //   mobilenumber: "",
  //   createdby: "",
  //   isactive: false,
  //   requestedby: "",
  //   generate_password: "",
  // });

  // const handleSelectedCompanyUserChange = (params: CompanyUser | null) => {
  //   if (params) {
  //     setPersistedSelectedUserId(params.id);

  //     setSelectedCompanyUser({
  //       company_id: params.company_id,
  //       id: params.id,
  //       fullname: params.fullname,
  //       email: params.email,
  //       mobilenumber: params.mobilenumber,
  //       createdby: "",
  //       isactive: params.isactive,
  //       requestedby: "",
  //       generate_password: "",
  //     });
  //   } else {
  //     setPersistedSelectedUserId(null);
  //     // Reset selectedCompanyUser to its initial state when null is received
  //     setSelectedCompanyUser({
  //       company_id: 0,
  //       id: 0,
  //       fullname: "",
  //       email: "",
  //       mobilenumber: "",
  //       createdby: "",
  //       isactive: false,
  //       requestedby: "",
  //       generate_password: "",
  //     });
  //   }
  // };

  //   NOTE : FUNCTIONS GET THE DATA FROM BACKEND
  const getLeadSourceOptions = async () => {
    const postDataForLeadSource: PostDataTypeForLeadSourceAndStatusAndStates = {
      id: null,
      name: null,
      description: null,
      isactive: true,
    };
    try {
      const response = await axiosClient.post(
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
      const response = await axiosClient.post(
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
        email: "please enter valid email address.",
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaving) return;
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
      toast.error("Please select source and status");
      return;
    }


    if (
      createLeadModalFormData.email !== "" ||
      createLeadModalFormData.mobileNumber !== "" ||
      selectedSource !== undefined ||
      selectedStatus !== undefined
    ) {
      const postDataForCreateLead: PostDataForCreateLead = {
        company_id: loginStatus.companyId,
        ownerid:
          leadOwnerId === 0
            ? loginStatus.id
            :leadOwnerId,
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
      setIsSaving(true);
      await axiosClient
        .post(POST_API.CREATE_LEAD, postDataForCreateLead, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status === true) {
            toast.success(response.data.message);
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
        })
        .finally(() => {
          // note : this callback will run to refresh the list of aggrid
          onClose!();
          setIsSaving(false);
          onCreateLeadRefreshLeadData!();
        });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      errors.email = "";
      errors.name = "";
      setSelectedLeadOwner(null)
      // setOpenPopUpOfCompanyUserModal(false);
      // setPersistedSelectedUserId(null);
      // setSelectedCompanyUser({
      //   company_id: 0,
      //   id: 0,
      //   fullname: "",
      //   email: "",
      //   mobilenumber: "",
      //   createdby: "",
      //   isactive: false,
      //   requestedby: "",
      //   generate_password: "",
      // });
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

  // Note : Options for the dropdowns
  const leadStatusOptions = toSelectOptions(leadStatus, "id", "name");
  const leadSourceOptions = toSelectOptions(leadSource, "id", "name");

  if (!isOpen) return null;
  return (
   
      <FormLayout width={3} padding={3}>
        {/* Header */}
        <FormHeader
          icon={Handshake}
          onClose={onClose}
          preText="Create new "
          userName="Opportunity"
          description="Fill in the details below to create a new lead."
        />

        {isSaving && <LoadingPopUpAnimation show={isSaving} />}
        {/* Form */}
        <form className="space-y-2 mt-2" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 space-y-1 gap-2">
            <div className="col-span-2">
              <FormInput
                label="Name:"
                logo={User}
                type="text"
                name="name"
                placeholder="Enter name "
                value={createLeadModalFormData.name}
                onChange={handleCreateLeadModalFormDataChange}
                autoFocus
              />
            </div>

            {/* NOTE : EIGHTER ONE THEM IS REQUIRED FIELD (from email and mobile number) */}
            <div className="">
              <FormInput
                label="Email:"
                logo={Mail}
                type="email"
                name="email"
                placeholder="Enter email "
                value={createLeadModalFormData.email}
                onChange={handleCreateLeadModalFormDataChange}
                onBlur={handleBlur}
              />
              {error.email && (
                <div className="text-red-500 text-xs">{error.email}</div>
              )}
            </div>

            <div className="">
              <FormInput
                type="text"
                label="Mobile Number:"
                logo={Phone}
                className={createLeadInputTagCss}
                name="mobileNumber"
                placeholder="Enter mobile number "
                value={createLeadModalFormData.mobileNumber}
                onBlur={handleBlur}
                onChange={handleCreateLeadModalFormDataChange}
              />
              {error.mobileNumber && (
                <div className="caption-custom-inactive">
                  {error.mobileNumber}
                </div>
              )}
            </div>
            {/* Lead Source */}
            <div className="space-y-1">
              <CustomSelect
                label="Lead Source"
                value={selectedSource}
                onChange={handleLeadSelectedSource}
                options={leadSourceOptions}
                icon={Link}
                isRequired={true}
              />
              {/* <CustomDropdown
                logo={Link}
                requiredRedDot
                labelName="Lead Source :"
                options={leadSource!}
                onSelect={handleLeadSelectedSource}
              /> */}
              {showErrorAtLeadSource && !selectedSource && (
                <div className="text-red-500 text-xs">
                  Please select Lead Source
                </div>
              )}
            </div>
            {/* Lead Status */}
            <div className="space-y-1">
              <CustomSelect
                label="Lead Status"
                value={selectedStatus}
                onChange={handleLeadSelectedStatus}
                options={leadStatusOptions}
                icon={Clock}
                isRequired={true}
              />
              {/* <CustomDropdown
                logo={Clock}
                requiredRedDot
                labelName="Lead Status :"
                options={leadStatus!}
                onSelect={handleLeadSelectedStatus}
              /> */}
              {showErrorAtLeadStatus && !selectedStatus && (
                <div className="text-red-500 text-xs">
                  Please select Lead Status
                </div>
              )}
            </div>

            <CustomSelectLookupCompanyUser
            onChange={setSelectedLeadOwner}
            value={selectedLeadOwner}
            />
            <div>
              <span className="caption-custom">
                <span className="">Note :</span> If no lead owner is selected, the lead will be assigned to the lead creator by default.
              </span>
            </div>
            {/* <div className="col-span-2">
            <div className="flex items-center justify-between  gap-1 w-full">
             <div className="flex items-center gap-x-2">
               <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (userHasAccessToViewUser) {
                    handleCompanyUserPopUp();
                  } else {
                    toast.error(
                      MESSAGE.MODULE_ACCESS.COMPANY_USER.DENIED_VIEW_ACCESS
                    );
                  }
                }}
                type="submit"
              >
                <div className="flex gap-1 items-center whitespace-nowrap">
                  <UserRoundPlus size={16} />
                  <span>Assign</span>
                </div>
              </Button>

              <span className="caption-custom whitespace-nowrap">
                <span className="input-label-custom">Lead Owner :</span>{" "}
                {selectedCompanyUser.fullname || loginStatus.fullName}
              </span>
             </div>
            </div>

            <span className="caption-custom">
              <span className="">Note :</span> If a lead owner is not selected,
              then lead will be assigned to the lead
              <span className=""> Creator</span> by default.
            </span>
          </div> */}
          </div>

          <div className="flex justify-end ">
            <div className="flex gap-2">
              <Button onClick={onClose} type="button">
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
        {/* </div> */}

        {/* {openPopUpOfCompanyUserModal &&
          createPortal(
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-3 shadow-lg w-full max-w-5xl max-h-[100vh] overflow-y-auto relative animate-fadeIn">
                <FormHeader
                  icon={UserRoundPlus}
                  onClose={() => setOpenPopUpOfCompanyUserModal(false)}
                  preText="Select Company User"
                  description="Select the user to assign him/her as lead owner"
                />
                <div className="p-1">
                  <GetCompanyUsersForLead
                    selectedUserId={persistedSelectedUserId} // Pass the persisted ID
                    handleSelectedCompanyUserChange={
                      handleSelectedCompanyUserChange
                    }
                    isUsedForSettings={false}
                  />
                </div>
              </div>
            </div>,
            document.body
          )} */}
    </FormLayout>
  );
}

export default CreateLeadModal;
