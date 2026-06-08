/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Briefcase,
  Contact2,
  Edit2,
  Globe,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import LeadContactType from "../../../@types/lead-management/LeadContact";
import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import {
  MOBILE_NUMBER_VALIDATION,
  STATUS_CODE,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import MESSAGE from "../../../constants/Messages";
import toast from "react-hot-toast";
import FormInput from "../../ui/FormInput";
import FormHeader from "../../ui/FormHeader";
import COLORS from "../../../constants/Colors";
import StatusChip from "../../ui/StatusChip";
import PrimarySecondaryChip from "../../ui/PrimarySecondaryChip";
import ToggleButton from "../../ui/ToggleButton";
import { createPortal } from "react-dom";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import FormLayout from "../../ui/FormLayout";
import TextAreaInput from "../../ui/TextAreaInput";
import axiosClient from "../../../axios-client/AxiosClient";
import AccessDeniedMessagePage from "../../views/not-found/AccessDeniedMessagePage";

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
  selectedLeadData,
  isOpenAddLeadContactForm,
  setIsOpenAddLeadContactForm,
}: {
  leadContact: LeadContactType[];
  fetchLeadContact: () => void;
  selectedLeadData: any;
  isOpenAddLeadContactForm: boolean;
  setIsOpenAddLeadContactForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const {
    userHasAccessToViewLeadContacts,
    userHasAccessToUpdateLeadContacts,
  } = useUserAccessModules();
  const [editContactData, setEditContactData] =
    useState<LeadContactType | null>(null); // null when adding
  const [socialMediaHandles, setSocialMediaHandles] = useState<string[]>([]);
  const [tempHandle, setTempHandle] = useState<string>("");
  const [selectedContactCard, setSelectedContactCard] =
    useState<LeadContactType | null>(null);
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true); // default to active
  const [isSaving, setIsSaving] = useState<boolean>(false);
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

  const inputClass =
    "border border-gray-300 p-2 rounded-lg  w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all duration-150 hover:bg-blue-0";

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
      | React.FocusEvent<HTMLTextAreaElement>,
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
      name === "mobileNumber" &&
      !MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN.test(value) &&
      value.length !== 0
    ) {
      setErrors((prev) => ({
        ...prev,
        mobileNumber:
          "Please enter a valid 10-digit mobile number without country code or spaces.",
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
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setLeadContactForm({ ...leadContactForm, [name]: value.trim() });
  };

  // to change the status of contact
  const handleActiveStatusChange = async (
    selectedContactCard: LeadContactType,
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
    await axiosClient
      .post(api, postData, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        if (response.data.status === true) {
          toast.success(data.message);
          if (userHasAccessToViewLeadContacts) {
            fetchLeadContact();
          }
        } else {
          toast.error(data.message);
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaving) return;
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
      newErrors.email =
        "Either an email address or a mobile number is mandatory.";
      newErrors.mobileNumber =
        "Either an email address or a mobile number is mandatory.";
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
      lead_id: selectedLeadData.id,
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
            // isactive: editContactData?.isActive,
            is_primary: editContactData?.isPrimary,
          }
        : {
            createdby_id: loginStatus.id,
            is_primary: false,
          }),
    };

    setIsSaving(true);
    const api = editingContactId
      ? POST_API.UPDATE_LEAD_CONTACT
      : POST_API.CREATE_LEAD_CONTACT;
    await axiosClient
      .post(api, postData, {
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
          toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG_TRY_AGAIN);
        }
      })
      .finally(() => {
        setIsSaving(false);
        setIsOpenAddLeadContactForm(false);
        // Optionally close modal and reset form
        setSelectedContactCard(null);
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
        setTempHandle("");
        if (userHasAccessToViewLeadContacts) {
          fetchLeadContact();
        }
      });
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
      setTempHandle("");
    }
  }, [isOpenAddLeadContactForm]);

  // const handleAddSocialMedia = () => {
  //   if (tempHandle.trim()) {
  //     setSocialMediaHandles((prev) => [...prev, tempHandle.trim()]);
  //     setTempHandle("");
  //   }
  // };
  const handleAddSocialMedia = () => {
    const newHandle = tempHandle.trim();

    if (!newHandle) return;

    if (socialMediaHandles.includes(newHandle)) {
      toast.error("Already added.");
      setTempHandle("");

      return;
    }

    setSocialMediaHandles((prev) => [...prev, newHandle]);
    setTempHandle("");
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
        : [],
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
  if (!userHasAccessToViewLeadContacts)
    return (
      <AccessDeniedMessagePage
        message={MESSAGE.MODULE_ACCESS.LEAD_CONTACT.DENIED_VIEW_ACCESS}
      />
    );
  return (
    <div className={`w-full z-10 px-1  `}>
      {/* Header */}

      {/* Contacts List */}
      <div className="space-y-2 ">
        {userHasAccessToViewLeadContacts &&
        leadContact &&
        leadContact.length > 0 ? (
          leadContact.map((contact, index) => (
            <div
              key={index}
              className={`${COLORS.CONTACT_CARD}  ${userHasAccessToUpdateLeadContacts ? "" : ""}`}
              onClick={() => setSelectedContactCard(contact)}
            >
              {/* Left: Contact Info */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className={` ${
                    contact.isActive ? "bg-blue-500 " : "bg-red-500"
                  } text-white flex items-center justify-center w-9 h-9 rounded-full border  font-semibold shadow-sm`}
                >
                  {contact?.name?.trim()
                    ? contact.name.trim().charAt(0).toUpperCase()
                    : contact?.email?.trim()
                      ? contact.email.trim().charAt(0).toUpperCase()
                      : "?"}
                </div>

                {/* Text Info */}
                <div className="flex flex-col">
                  {/* Name */}
                  <p className="input-label-custom">
                    {contact.name && contact.name.length > 50
                      ? contact.name.substring(0, 49) + "..."
                      : contact.name || contact.email || contact.mobileNumber}
                  </p>

                  {/* Job Title */}
                  {contact.jobTitle && (
                    <p className="caption-custom flex gap-1 items-center">
                      <Briefcase size={11} />
                      {contact.jobTitle}
                    </p>
                  )}

                  {/* Mobile + Email */}
                  <div className="caption-custom flex flex-wrap items-center gap-x-1">
                    {contact.mobileNumber && (
                      <span className="flex gap-1 items-center">
                        <Phone size={12} />
                        {contact.mobileNumber}
                      </span>
                    )}

                    {contact.mobileNumber && contact.email && <span>•</span>}

                    {contact.email && (
                      <span className="flex gap-1 items-center">
                        <Mail size={12} />
                        {contact.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Badges */}
              <div className="flex  items-end gap-1">
                {/* <StatusChip isActive={contact.isPrimary}  /> */}
                <PrimarySecondaryChip isPrimary={contact.isPrimary} />
                <StatusChip isActive={contact.isActive} />
              </div>
            </div>
          ))
        ) : !userHasAccessToViewLeadContacts ? (
          <p className="caption-custom italic flex items-center justify-center text-center">
            No view access
          </p>
        ) : (
          <p className="caption-custom text-center">No contacts available</p>
        )}
      </div>
      {/* view in pop up card  */}
      {selectedContactCard &&
        createPortal(
          <div className="fixed inset-0 bg-opacity-5 bg-black flex justify-center items-center z-20 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
              {/* Header */}
              <div className="relative px-8 pt-5 pb-4">
                <button
                  onClick={() => setSelectedContactCard(null)}
                  className="absolute top-6 right-6 caption-custom hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-6">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white ${
                      isActive ? "bg-blue-500" : "bg-red-500"
                    }`}
                  >
                    {selectedContactCard.name !== null
                      ? selectedContactCard.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                  <div className="flex-1">
                    <h2
                      title={selectedContactCard.name ?? ""}
                      className="section-header-custom"
                    >
                      {selectedContactCard.name &&
                      selectedContactCard.name.length > 40 ? (
                        selectedContactCard.name.substring(0, 49) + "..."
                      ) : selectedContactCard.name ? (
                        selectedContactCard.name
                      ) : (
                        <span className="input-label-custom italic">
                          Unamed contact
                        </span>
                      )}
                    </h2>
                    <p className="input-label-custom mt-1 flex items-center">
                      <Briefcase size={16} className="inline mr-2" />
                      {selectedContactCard.jobTitle ?? (
                        <span className="input-label-custom italic">
                          No job title specified
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <PrimarySecondaryChip
                        isPrimary={selectedContactCard.isPrimary}
                      />
                      <StatusChip isActive={isActive} />
                    </div>
                  </div>
                  <div>
                    <Button
                      disabled={!userHasAccessToUpdateLeadContacts}
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        if (userHasAccessToUpdateLeadContacts) {
                          handleEditLeadContactClick(selectedContactCard);
                        } else {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.LEAD_CONTACT
                              .DENIED_UPDATE_ACCESS,
                          );
                        }
                      }}
                    >
                      <div className="flex gap-2">
                        <Edit2 size={14} className="mt-1" />
                        <span>Edit</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 pb-8">
                {/* Contact Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                      <Mail
                        className="input-label-custom-blue mt-1"
                        size={18}
                      />
                      <div>
                        <h4 className="table-header-custom mb-1">
                          Email Address
                        </h4>
                        <p className="input-label-custom">
                          {selectedContactCard.email ?? (
                            <span className="input-label-custom italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                      <Phone
                        className="input-label-custom-active mt-1"
                        size={18}
                      />
                      <div>
                        <h4 className="table-header-custom mb-1">
                          Mobile Number
                        </h4>
                        <p className="input-label-custom">
                          {selectedContactCard.mobileNumber ?? (
                            <span className="input-label-customc">
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                      <Languages
                        className="input-label-custom-purple mt-1"
                        size={18}
                      />
                      <div>
                        <h4 className="table-header-custom mb-1">
                          Preferred Language
                        </h4>
                        <p className="input-label-custom">
                          {selectedContactCard.preferredLanguage ?? (
                            <span className="input-label-custom italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                      <MessageCircle
                        className="input-label-custom-orange mt-1"
                        size={18}
                      />
                      <div>
                        <h4 className="table-header-custom mb-1">
                          Preferred Communication
                        </h4>
                        <p className="input-label-custom">
                          {selectedContactCard.preferredCommunicationChannel ?? (
                            <span className="input-label-custom italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                      <Globe
                        className="input-label-custom-blue mt-1"
                        size={18}
                      />
                      <div>
                        <h4 className="table-header-custom mb-1">
                          LinkedIn Profile
                        </h4>
                        {selectedContactCard.linkedinProfile ? (
                          <a
                            href={selectedContactCard.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="input-label-custom-blue hover:text-blue-800 hover:underline"
                          >
                            View LinkedIn Profile
                          </a>
                        ) : (
                          <p className="input-label-custom italic">
                            Not provided
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 mt-1 flex items-center justify-center">
                        <div
                          className={`w-3 h-3 rounded-full -mt-2 ${
                            isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      </div>
                      <div className="">
                        <div className="flex gap-4">
                          <h4 className="table-header-custom ">Status</h4>
                          <ToggleButton
                            checked={isActive}
                            name="isActive"
                            onToggle={
                              !selectedContactCard.isPrimary &&
                              userHasAccessToUpdateLeadContacts
                                ? () => {
                                    handleActiveStatusChange(
                                      selectedContactCard,
                                    );
                                  }
                                : () => {
                                    if (selectedContactCard.isPrimary) {
                                      toast.error(
                                        "Update request denied — the user is designated as the Primary Contact.",
                                      );
                                    } else {
                                      toast.error(
                                        MESSAGE.MODULE_ACCESS.LEAD_CONTACT
                                          .DENIED_UPDATE_ACCESS,
                                      );
                                    }
                                  }
                            }
                          />
                        </div>
                        {selectedContactCard.isPrimary && (
                          <div className="caption-custom italic mt-1">
                            Primary contact status cannot be changed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Profiles */}
                {selectedContactCard.socialMediaHandles && (
                  <div className="mb-6">
                    <h4 className="table-header-custom mb-3 flex items-center gap-2">
                      <Globe size={18} className="input-label-custom-blue" />
                      Social Media Profiles
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedContactCard.socialMediaHandles
                        .split(",")
                        .filter((link) => link.trim() !== "")
                        .map((link, index) => (
                          <a
                            key={index}
                            href={link.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-50 input-label-custom-blue hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                          >
                            {handleUrl(link.trim())}
                          </a>
                        ))}
                    </div>
                  </div>
                )}

                {/* Address */}
                {selectedContactCard.address && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin
                      className="input-label-custom-inactive mt-1"
                      size={18}
                    />
                    <div>
                      <h4 className="table-header-custom mb-1">Address</h4>
                      <p className="input-label-custom leading-relaxed">
                        {selectedContactCard.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Add Contact Form Modal */}
      {isOpenAddLeadContactForm && (
        <FormLayout width={5}>
          {/* Header */}
          <FormHeader
            icon={Contact2}
            preText={editContactData ? "Edit Contact" : "Add New Contact"}
            description={
              editContactData
                ? "Update the contact's information to keep records accurate and up to date."
                : "Create a contact for this lead to ensure proper follow-up and engagement."
            }
            onClose={() => {
              // setEditMode(false);
              setEditingContactId(null);
              setIsOpenAddLeadContactForm(false);
              setEditContactData(null);
              setSocialMediaHandles([]);
              setTempHandle("");
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
          />

          {/* Form Grid */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm text-gray-500">
              <div>
                <FormInput
                  logo={User}
                  autoFocus
                  label="Full Name :"
                  required
                  type="text"
                  name="name"
                  onBlur={handleBlur}
                  minLength={VALIDATIONS.MIN_NAME_LENGTH}
                  maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                  placeholder="Enter full name"
                  className={inputClass}
                  onChange={handleFormInputChange}
                  defaultValue={editContactData?.name || ""}
                  readonly={
                    editContactData?.isPrimary && editContactData !== null
                  }
                />
                {errors.name && (
                  <p className="caption-custom-inactive mt-1">{errors.name}</p>
                )}
                {editContactData?.isPrimary && (
                  <p className="caption-custom mt-1">
                    Primary contact name cannot be changed
                  </p>
                )}
              </div>
              <div>
                <FormInput
                  label="Email Address :"
                  logo={Mail}
                  type="email"
                  name="email"
                  maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                  placeholder="Enter email address"
                  onChange={handleFormInputChange}
                  onBlur={handleBlur}
                  defaultValue={editContactData?.email || ""}
                  readonly={
                    editContactData?.isPrimary && editContactData !== null
                  }
                />
                {errors.email && (
                  <p className="caption-custom-inactive mt-1">{errors.email}</p>
                )}
                {editContactData?.isPrimary && (
                  <p className="caption-custom mt-1">
                    Primary contact email cannot be changed
                  </p>
                )}
              </div>
              <div>
                <FormInput
                  logo={Phone}
                  label="Mobile Number :"
                  type="text"
                  name="mobileNumber"
                  minLength={10}
                  // maxLength={10}
                  placeholder="Enter mobile number"
                  // className={inputClass}
                  onChange={handleFormInputChange}
                  onBlur={handleBlur}
                  defaultValue={editContactData?.mobileNumber || ""}
                  readonly={
                    editContactData?.isPrimary && editContactData !== null
                  }
                />
                {errors.mobileNumber && (
                  <p className="caption-custom-inactive mt-1 ">
                    {errors.mobileNumber}
                  </p>
                )}
                {editContactData?.isPrimary && (
                  <p className="caption-custom mt-1">
                    Primary contact mobile number cannot be changed
                  </p>
                )}
              </div>
              {/* job title */}

              <FormInput
                label="Job title :"
                logo={Briefcase}
                // Job Title
                type="text"
                name="jobTitle"
                maxLength={100}
                placeholder="Enter job title"
                className={inputClass}
                onChange={handleFormInputChange}
                onBlur={handleBlur}
                defaultValue={editContactData?.jobTitle || ""}
              />
              {/* pref language */}
              <FormInput
                logo={Languages}
                label="Preferred Language :"
                type="text"
                name="preferredLanguage"
                maxLength={100}
                placeholder="eg : Marathi , English etc ..."
                className={inputClass}
                onChange={handleFormInputChange}
                onBlur={handleBlur}
                defaultValue={editContactData?.preferredLanguage || ""}
              />
              {/* pref comm channel */}
              <FormInput
                logo={MessageCircle}
                label=" Preferred Communication Channel :"
                type="text"
                maxLength={100}
                name="preferredCommunicationChannel"
                placeholder="eg : Mail, Phone, WhatsApp etc ..."
                className={inputClass}
                onChange={handleFormInputChange}
                onBlur={handleBlur}
                defaultValue={
                  editContactData?.preferredCommunicationChannel || ""
                }
              />
              {/* linkedin profile */}
              <FormInput
                logo={Globe}
                label="LinkedIn Profile :"
                type="text"
                name="linkedinProfile"
                maxLength={256}
                placeholder="Enter linkedIn url"
                className={inputClass}
                onChange={handleFormInputChange}
                onBlur={handleBlur}
                defaultValue={editContactData?.linkedinProfile || ""}
              />

              {/* Social Media Handles */}
              <div className="col-span-2">
                {/* <div className="flex  items-center justify-between bg-pink-00  gap-2">
                  <FormInput
                    logo={Globe}
                    label="Social Media Handles :"
                    type="text"
                    placeholder="Enter social media url"
                    value={tempHandle}
                    onChange={(e) => setTempHandle(e.target.value)}
                  />
                  <div className="flex justify-center items-center">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddSocialMedia();
                      }}
                      type="submit"
                    >
                      + Add
                    </Button>
                  </div>
                </div> */}

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <FormInput
                      logo={Globe}
                      label="Social Media Handles :"
                      type="text"
                      placeholder="Enter social media url"
                      value={tempHandle}
                      onChange={(e) => setTempHandle(e.target.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddSocialMedia();
                      }}
                    >
                      + Add
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1  sm:grid-cols-2 mt-1 gap-2 max-h-36 overflow-y-auto">
                  {socialMediaHandles.map((handle) => (
                    <div
                      key={handle}
                      className="flex items-center justify-between bg-gray-100 px-3 py-1.5 rounded shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="caption-custom" />
                        <span className="caption-custom">{handle}</span>
                      </div>
                      <Button
                        size="icon"
                        type="button"
                        onClick={() =>
                          setSocialMediaHandles((prev) =>
                            prev.filter((h) => h !== handle),
                          )
                        }
                        className="caption-custom hover:text-red-500"
                      >
                        <Trash2 size={12} />
                        {/* <X size={12} /> */}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <>
                  {/* <label className={formInputLabelClassName}>
                  {" "}
                  <MapPin
                    size={16}
                    className="inline mr-2  input-label-custom-blue"
                    />
                  Address
                </label> */}
                  <TextAreaInput
                    label="Address :"
                    logo={MapPin}
                    placeholder="Enter full address "
                    name="address"
                    rows={2}
                    cols={4}
                    maxLength={256}
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.address || ""}
                  />
                </>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 mt-1 flex-wrap">
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setIsOpenAddLeadContactForm(false)}
                >
                  <div className="flex items-center gap-0.5">
                    <X size={16} />
                    Cancel
                  </div>
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  // onClick={(event) => {
                  //   if (isSaving) return;
                  //   handleSubmit(event);
                  // }}
                >
                  <div className="flex items-center gap-1">
                    <Save size={16} />
                    Save
                  </div>
                </Button>
              </div>
            </div>
          </form>
          {/* </div> */}
          <LoadingPopUpAnimation show={isSaving} />
          {/* </div>, */}
          {/* document.body */}
        </FormLayout>
      )}
    </div>
  );
};

export default LeadContact;
