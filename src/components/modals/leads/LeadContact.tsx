/* eslint-disable @typescript-eslint/no-unused-vars */
import { Globe, Plus, X, XIcon } from "lucide-react";
import LeadContactType from "../../../@types/lead-management/LeadContact";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import {
  MOBILE_NUMBER_VALIDATION,
  NUMBER_VALUES,
  STATUS_CODE,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import MESSAGE from "../../../constants/Messages";
type LeadContactFormType = {
  name: string;
  email: string;
  mobileNumber: string;
  jobTitle: string;
  preferredLanguage: string;
  preferredCommunicationChannel: string;
  linkedinProfile: string;
  address: string;
};
const LeadContact = ({
  leadContact,
  fetchLeadContact,
}: {
  leadContact: LeadContactType[];
  fetchLeadContact: () => void;
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToUpdateLead } = useUserAccessModules();
  const [isOpenAddLeadContactForm, setIsOpenAddLeadContactForm] =
    useState(false);
  const [editContactData, setEditContactData] =
    useState<LeadContactType | null>(null); // null when adding
  const [socialMediaHandles, setSocialMediaHandles] = useState<string[]>([]);
  const [tempHandle, setTempHandle] = useState<string>("");
  const [selectedContactCard, setSelectedContactCard] =
    useState<LeadContactType | null>(null);
  // const [editMode, setEditMode] = useState<boolean>(false);
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true); // default to active

  const [leadContactForm, setLeadContactForm] = useState<LeadContactFormType>({
    name: "",
    email: "",
    mobileNumber: "",
    jobTitle: "",
    preferredLanguage: "",
    preferredCommunicationChannel: "",
    linkedinProfile: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobileNumber: "",
  });

  //note : Message Snackbar
  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  const inputClass =
    "border border-gray-100 p-2 rounded-lg  w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all duration-150 hover:bg-blue-0";
  const formInputLabelClassName =
    "font-medium text-gray-900 text-xs  mb-1 block";
  const viewLabelClassName = "font-medium text-gray-800";
  const handleUrl = (link: string): string => {
    try {
      const url = new URL(link.trim());
      return url.hostname.replace("www.", "");
    } catch (err) {
      // If it's not a valid URL, just return the raw string
      return link;
    }
  };
  const handleBlur = (
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
        email: "please enter invalid email address.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
    if (
      name === "mobileNumber" &&
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
    setLeadContactForm({ ...leadContactForm, [name]: value.trim() });
  };

  // to change the status of contact
  const handleActiveStatusChange = async (
    selectedContactCard: LeadContactType
  ) => {
    const previousStatus = isActive;
    const newStatus = !isActive;

    //we are setting it locally
    setIsActive(newStatus);

    //  Proceed with form submission logic here
    const postData = {
      company_id: loginStatus.companyId,
      name: selectedContactCard.name,
      email: selectedContactCard.email,
      mobilenumber: selectedContactCard.mobileNumber,
      address: selectedContactCard.address,
      job_title: selectedContactCard.jobTitle,
      preferred_communication_channel:
        selectedContactCard.preferredCommunicationChannel,
      preferred_language: selectedContactCard.preferredLanguage,
      linkedin_profile: selectedContactCard.linkedinProfile,
      social_media_handles: selectedContactCard.socialMediaHandles,
      id: selectedContactCard?.id,
      updatedby_id: loginStatus.id,
      isactive: newStatus,
      is_primary: selectedContactCard?.isPrimary,
    };

    const api = POST_API.UPDATE_LEAD_CONTACT;
    await axios
      .post(api, postData, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        if (response.data.status === true) {
          showMessageSnackbar({
            message: data.message,
            type: "success",
          });
          fetchLeadContact();
        } else {
          showMessageSnackbar({
            message: data.message,
            type: "error",
          });
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(async (error: ApiError | any) => {
        //if exception occurs then rollback to previous state
        setIsActive(previousStatus);
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithParamsNotEvent: handleActiveStatusChange,
          });
          if (refreshTokenResponse) {
            handleActiveStatusChange(selectedContactCard);
          }
        }
      });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, mobileNumber } = leadContactForm;
    let isValid = true;

    // Prepare a copy to store validation errors
    const newErrors: typeof errors = { name: "", email: "", mobileNumber: "" };

    // Check required fields
    if (!name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    if (!email.trim() && !mobileNumber.trim()) {
      newErrors.email = "Eigther email or mobile number is required.";
      newErrors.mobileNumber = "Eigther email or mobile number is required.";
      isValid = false;
    }
    if (email.trim() && !VALIDATIONS.EMAIL.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (
      mobileNumber.trim() &&
      !MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(mobileNumber)
    ) {
      newErrors.mobileNumber =
        "Please enter a valid 10-digit Indian mobile number.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;
    const socialMediaHandlesConcat = socialMediaHandles.join(",");

    //  Proceed with form submission logic here
    const postData = {
      company_id: loginStatus.companyId,
      // lead_id: selectedLeadData.id,
      name: leadContactForm.name,
      email: leadContactForm.email,
      mobilenumber: leadContactForm.mobileNumber,
      address: leadContactForm.address,
      job_title: leadContactForm.jobTitle,
      preferred_communication_channel:
        leadContactForm.preferredCommunicationChannel,
      preferred_language: leadContactForm.preferredLanguage,
      linkedin_profile: leadContactForm.linkedinProfile,
      social_media_handles: socialMediaHandlesConcat,
      ...(editingContactId
        ? {
            id: editContactData?.id,
            updatedby_id: loginStatus.id,
            // note : need to add logic
            isactive: true,
            is_primary: editContactData?.isPrimary,
          }
        : {
            createdby_id: loginStatus.id,
            is_primary: false,
          }),
    };

    const api = editingContactId
      ? POST_API.UPDATE_LEAD_CONTACT
      : POST_API.CREATE_LEAD_CONTACT;
    await axios
      .post(api, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === true) {
          const data = response.data;
          showMessageSnackbar({
            message: data.message,
            type: "success",
          });
          fetchLeadContact();
        } else {
          const data = response.data;
          showMessageSnackbar({
            message: data.message,
            type: "error",
          });
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
        }
      });

    // Optionally close modal and reset form
    setIsOpenAddLeadContactForm(false);
    setLeadContactForm({
      name: "",
      email: "",
      mobileNumber: "",
      jobTitle: "",
      preferredLanguage: "",
      preferredCommunicationChannel: "",
      linkedinProfile: "",
      address: "",
    });
    setSocialMediaHandles([]);
  };

  //Note : to reset if user clicks on cancel button
  useEffect(() => {
    if (!isOpenAddLeadContactForm) {
      setErrors({ name: "", email: "", mobileNumber: "" });
      setLeadContactForm({
        name: "",
        email: "",
        mobileNumber: "",
        jobTitle: "",
        preferredLanguage: "",
        preferredCommunicationChannel: "",
        linkedinProfile: "",
        address: "",
      });
      setSocialMediaHandles([]);
    }
  }, [isOpenAddLeadContactForm]);

  const handleAddSocialMedia = () => {
    if (tempHandle.trim()) {
      setSocialMediaHandles((prev) => [...prev, tempHandle.trim()]);
      setTempHandle("");
    }
  };

  const handleEditLeadContactClick = (selectedContactCard: LeadContactType) => {
    // for to distinguish between edit and add
    // setEditMode(true);
    setEditingContactId(selectedContactCard.id);
    setEditContactData(selectedContactCard);
    setIsOpenAddLeadContactForm(true);
    // Note : if need to change then make changes here , do uncomment it
    setSelectedContactCard(null); // Close the view card
    setSocialMediaHandles(
      selectedContactCard?.socialMediaHandles
        ? selectedContactCard.socialMediaHandles
            .split(",")
            .map((handle) => handle.trim())
            .filter((handle) => handle !== "")
        : []
    );
    setLeadContactForm({
      name: selectedContactCard.name || "",
      email: selectedContactCard.email || "",
      mobileNumber: selectedContactCard.mobileNumber || "",
      jobTitle: selectedContactCard.jobTitle || "",
      preferredLanguage: selectedContactCard.preferredLanguage || "",
      preferredCommunicationChannel:
        selectedContactCard.preferredCommunicationChannel || "",
      linkedinProfile: selectedContactCard.linkedinProfile || "",
      address: selectedContactCard.address || "",
    });
  };

  useEffect(() => {
    if (selectedContactCard?.isActive !== undefined) {
      setIsActive(selectedContactCard.isActive);
    }
  }, [selectedContactCard]);

  return (
    <div className={`w-full  px-1 mb-1 `}>
      {/* Header */}
      <div className="flex justify-end items-center text-xs gap-x-2 py-1 text-gray-500">
        <span>Add</span>
        <button
          disabled={!userHasAccessToUpdateLead}
          onClick={() => {
            if (userHasAccessToUpdateLead) {
              setIsOpenAddLeadContactForm(!isOpenAddLeadContactForm);
            } else {
              showMessageSnackbar({
                message:
                  MESSAGE.MODULE_ACCESS.LEAD_MODULE
                    .UPDATE_LEAD_ACCESS_DENIED_message,
                type: "error",
              });
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1"
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Contacts List */}
      <div className="space-y-2">
        {leadContact && leadContact.length > 0 ? (
          leadContact.map((contact, index) => (
            <div
              key={index}
              className="bg-blue-50 border border-blue-100 px-3 py-2 rounded shadow-sm flex justify-between items-center hover:shadow-md"
            >
              <div>
                <p
                  onClick={() => {
                    setSelectedContactCard(contact);
                  }}
                  className="text-xs font-medium text-gray-800 hover:text-blue-500 cursor-pointer"
                >
                  {contact.name}
                </p>
                <p className="text-xs text-gray-600">
                  {contact.jobTitle
                    ? ` ${contact.jobTitle} ${
                        contact.email || contact.mobileNumber ? "|" : null
                      }`
                    : null}{" "}
                  {contact.email ? ` ${contact.email} | ` : null}{" "}
                  {contact.mobileNumber}
                </p>
              </div>
              <div className="flex text-[10px] font-semibold items-center gap-1">
                <span
                  className={` px-2 py-1 rounded-full ${
                    contact.isPrimary
                      ? "bg-green-100 text-green-700 border border-green-400"
                      : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  {contact.isPrimary ? "Primary" : "Secondary"}
                </span>
                <span
                  className={`rounded-full px-2 py-1 border  ${
                    contact.isActive
                      ? "text-green-900 bg-green-100 border-green-400"
                      : "text-red-800 bg-red-100 border-red-400"
                  }`}
                >
                  {contact.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">
            No contacts available
          </p>
        )}
      </div>
      {/* view in pop up card  */}
      {selectedContactCard && (
        <div
          className={` fixed inset-0  bg-opacity-0 flex justify-center items-center z-50`}
        >
          <div
            className={` ${
              isActive ? "bg-green-50" : "bg-red-50"
            }  rounded-xl shadow-2xl w-full max-w-3xl p-7 relative`}
          >
            <button
              onClick={() => setSelectedContactCard(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <X size={22} />
            </button>

            {/* Header Section */}
            <div className={`flex items-center rounded-md gap-6 mb-6 `}>
              <div
                className={` ${
                  isActive ? "bg-green-300" : "bg-red-300"
                } w-20 h-20 rounded-full  flex items-center justify-center text-2xl font-bold text-white bg-gray-300`}
              >
                {selectedContactCard.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {selectedContactCard.name}
                </h2>
                <p className="text-gray-500">
                  {selectedContactCard.jobTitle
                    ? selectedContactCard.jobTitle
                    : "-"}
                </p>
              </div>
              <div>
                {/* Edit Button */}
                <button
                  disabled={!userHasAccessToUpdateLead}
                  onClick={() => {
                    if (userHasAccessToUpdateLead) {
                      handleEditLeadContactClick(selectedContactCard);
                    } else {
                      showMessageSnackbar({
                        message:
                          MESSAGE.MODULE_ACCESS.LEAD_MODULE
                            .UPDATE_LEAD_ACCESS_DENIED_message,
                        type: "error",
                      });
                    }
                  }}
                  className="top-4 left-4 text-sm bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
              <div>
                <h4 className={viewLabelClassName}>Email</h4>
                <p>
                  {selectedContactCard.email ? selectedContactCard.email : "-"}
                </p>
              </div>
              {/* mobile Number */}
              <div>
                <h4 className={viewLabelClassName}>Mobile</h4>
                <p>
                  {selectedContactCard.mobileNumber
                    ? selectedContactCard.mobileNumber
                    : "-"}
                </p>
              </div>
              {/* preferred Langauge */}
              <div>
                <h4 className={viewLabelClassName}>Preferred Language</h4>
                <p>
                  {selectedContactCard.preferredLanguage
                    ? selectedContactCard.preferredLanguage
                    : "-"}
                </p>
              </div>
              {/* pref communication channel */}
              <div>
                <h4 className={viewLabelClassName}>
                  Pref. Communication Channel
                </h4>
                <p>
                  {selectedContactCard.preferredCommunicationChannel
                    ? selectedContactCard.preferredCommunicationChannel
                    : "-"}
                </p>
              </div>
              {/* Linkdin Profile */}
              <div>
                <h4 className={viewLabelClassName}>LinkedIn</h4>
                <a
                  href={selectedContactCard.linkedinProfile}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  {selectedContactCard.linkedinProfile
                    ? selectedContactCard.linkedinProfile
                    : "-"}
                </a>
              </div>
              {/* isPrimary */}
              <div>
                <h4 className={viewLabelClassName}>Contact</h4>
                <p>
                  {selectedContactCard.isPrimary ? (
                    <span className="text-green-500">Primary</span>
                  ) : (
                    <span className="text-red-500">Secondary</span>
                  )}
                </p>
              </div>
              {/* Social Media Handles */}
              <div className="sm:col-span-1">
                <h4 className={viewLabelClassName}>Social Profiles</h4>
                <div className="flex flex-wrap gap-3 mt-1">
                  {selectedContactCard.socialMediaHandles &&
                    selectedContactCard.socialMediaHandles
                      .split(",")
                      .filter((link) => link.trim() !== "")
                      .map((link, index) => (
                        <a
                          key={index}
                          href={link.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline truncate max-w-[200px]"
                        >
                          {handleUrl(link)}
                        </a>
                      ))}
                </div>
              </div>
              {/* status */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={
                      !selectedContactCard.isPrimary &&
                      userHasAccessToUpdateLead
                        ? () => {
                            handleActiveStatusChange(selectedContactCard);
                          }
                        : () => {
                            if (selectedContactCard.isPrimary) {
                              showMessageSnackbar({
                                message:
                                  "Cannot Change , User is Primary Contact",
                                type: "error",
                              });
                            } else {
                              showMessageSnackbar({
                                message:
                                  MESSAGE.MODULE_ACCESS.LEAD_MODULE
                                    .UPDATE_LEAD_ACCESS_DENIED_message,
                                type: "error",
                              });
                            }
                          }
                    }
                    disabled={
                      !userHasAccessToUpdateLead
                    }
                    title={
                      selectedContactCard.isPrimary
                        ? "Cannot change the status of the primary contact."
                        : ""
                    }
                    className="sr-only peer"
                  />
                  <div
                    title={
                      selectedContactCard.isPrimary
                        ? "Cannot change the status of the primary contact."
                        : ""
                    }
                    className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:bg-green-500
                 after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                 after:bg-white after:border-gray-300 after:border after:rounded-full
                 after:h-5 after:w-5 after:transition-all
                 peer-checked:after:translate-x-full peer-checked:after:border-white"
                  ></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>

              {/* address */}
              <div className="sm:col-span-2">
                <h4 className={viewLabelClassName}>Address</h4>
                <p>
                  {selectedContactCard.address
                    ? selectedContactCard.address
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Form Modal */}
      {isOpenAddLeadContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center  p-2 sm:p-6">
          <div className="bg-white mt-14 rounded-lg w-full max-w-5xl max-h-[80vh] overflow-y-auto px-2 py-2 shadow-2xl sm:px-4 sm:py-4">
            {/* Header */}
            <div className="border-b pb-1 mb-4 flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-800">
                {editContactData ? "Edit Contact" : "Add New Contact"}
              </h2>
              <XIcon
                onClick={() => {
                  // setEditMode(false);
                  setEditingContactId(null);
                  setIsOpenAddLeadContactForm(false);
                  setEditContactData(null);
                  setSocialMediaHandles([]);
                  setLeadContactForm({
                    name: "",
                    email: "",
                    address: "",
                    jobTitle: "",
                    linkedinProfile: "",
                    mobileNumber: "",
                    preferredCommunicationChannel: "",
                    preferredLanguage: "",
                  });
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              />
            </div>

            {/* Form Grid */}
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className={formInputLabelClassName}>Full Name:</label>
                  <input
                    type="text"
                    name="name"
                    onBlur={handleBlur}
                    placeholder=" Enter Full Name"
                    className={inputClass}
                    onChange={handleFormInputChange}
                    defaultValue={editContactData?.name || ""}
                    readOnly={
                      editContactData?.isPrimary && editContactData !== null
                    }
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className={formInputLabelClassName}>
                    Email Address:
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.email || ""}
                    readOnly={
                      editContactData?.isPrimary && editContactData !== null
                    }
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className={formInputLabelClassName}>
                    Mobile Number:
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    placeholder="98********"
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.mobileNumber || ""}
                    readOnly={
                      editContactData?.isPrimary && editContactData !== null
                    }
                  />
                  {errors.mobileNumber && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className={formInputLabelClassName}>Job Title:</label>
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.jobTitle || ""}
                  />
                </div>
                <div>
                  <label className={formInputLabelClassName}>
                    Preferred Language:
                  </label>
                  <input
                    type="text"
                    name="preferredLanguage"
                    placeholder="Marathi , English etc ..."
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.preferredLanguage || ""}
                  />
                </div>
                <div>
                  <label className={formInputLabelClassName}>
                    Preferred Communication Channel:
                  </label>
                  <input
                    type="text"
                    name="preferredCommunicationChannel"
                    placeholder="Mail, Phone, WhatsApp etc ..."
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={
                      editContactData?.preferredCommunicationChannel || ""
                    }
                  />
                </div>
                <div>
                  <label className={formInputLabelClassName}>
                    LinkedIn Profile:
                  </label>
                  <input
                    type="text"
                    name="linkedinProfile"
                    placeholder="LinkedIn URL"
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.linkedinProfile || ""}
                  />
                </div>

                {/* Social Media Handles */}
                <div className="sm:col-span-2">
                  <label className={formInputLabelClassName}>
                    Social Media Handles:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Handle URL"
                      value={tempHandle}
                      onChange={(e) => setTempHandle(e.target.value)}
                      className={inputClass}
                    />
                    <button
                      onClick={handleAddSocialMedia}
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-0 rounded"
                    >
                      Add
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 mt-3 gap-2 max-h-36 overflow-y-auto">
                    {socialMediaHandles.map((handle) => (
                      <div
                        key={handle}
                        className="flex items-center justify-between bg-gray-100 px-3 py-1.5 rounded shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-gray-600" />
                          <span className="text-xs text-gray-700">
                            {handle}
                          </span>
                        </div>
                        <Button
                          size="icon"
                          onClick={() =>
                            setSocialMediaHandles((prev) =>
                              prev.filter((h) => h !== handle)
                            )
                          }
                          className="text-gray-800 hover:text-red-500"
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className={formInputLabelClassName}>Address:</label>
                  <textarea
                    placeholder="Full Address"
                    name="address"
                    rows={4}
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.address || ""}
                  />
                </div>
              </div>
            </form>
            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 mt-6 flex-wrap">
              <button
                type="submit"
                onClick={() => setIsOpenAddLeadContactForm(false)}
                className="hidden bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm rounded"
                type="submit"
                onClick={handleSubmit}
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </div>
  );
};

export default LeadContact;
