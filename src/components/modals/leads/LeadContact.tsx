/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Briefcase,
  Contact2,
  Edit3,
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
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import {
  MOBILE_NUMBER_VALIDATION,
  STATUS_CODE,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import MESSAGE from "../../../constants/Messages";
import toast from "react-hot-toast";
import FormInput from "../../ui/FormInput";
import FormHeader from "../../ui/FormHeader";
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
}: {
  leadContact: LeadContactType[];
  fetchLeadContact: () => void;
  selectedLeadData: any;
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

  const inputClass =
    "border border-gray-300 p-2 rounded-lg  w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all duration-150 hover:bg-blue-0";
  const formInputLabelClassName =
    "block text-sm font-medium text-gray-700 mb-2";

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
          toast.success(data.message);
          fetchLeadContact();
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

    const api = editingContactId
      ? POST_API.UPDATE_LEAD_CONTACT
      : POST_API.CREATE_LEAD_CONTACT;
    await axios
      .post(api, postData, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        if (data.status === true) {
          toast.success(data.message);
          fetchLeadContact();
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
    console.log("this is the selected lead contact card");

    console.log(selectedContactCard);

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
    console.log(selectedContactCard);
    
  }, [selectedContactCard]);


  return (
    <div className={`w-full z-10 px-1 mb-1 `}>
      {/* Header */}
      <div className="flex justify-end items-center text-xs gap-x-1 py-1 text-gray-500">
        <button
          onClick={() => {
            if (userHasAccessToUpdateLead) {
              setIsOpenAddLeadContactForm(!isOpenAddLeadContactForm);
            } else {
              toast.error(
                MESSAGE.MODULE_ACCESS.LEAD_MODULE
                  .UPDATE_LEAD_ACCESS_DENIED_message
              );
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-1 py-0.5 rounded-md flex items-center gap-1"
        >
          +Add
        </button>
      </div>

      {/* Contacts List */}
      <div className="space-y-2">
        {leadContact && leadContact.length > 0 ? (
          leadContact.map((contact, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-blue-200 cursor-pointer text-xs font-medium text-gray-800 px-4 py-1 rounded-lg shadow-sm flex justify-between items-center hover:shadow hover:text-blue-600 hover:border-blue-300 transition"
              onClick={() => setSelectedContactCard(contact)}
            >
              {/* Left: Contact Info */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className={` ${
                    contact.isActive ? "bg-blue-500 " : "bg-red-500"
                  } text-white flex items-center justify-center w-9 h-9 rounded-full border    font-semibold shadow-sm`}
                >
                  {contact.name ? contact.name.charAt(0).toUpperCase() : contact.email.charAt(0).toUpperCase() || "?"}
                </div>

                {/* Text Info */}
                <div className="flex flex-col">
                  <p className="text-sm font-semibold ">
                    {contact.name && contact.name.length > 50
                      ? contact.name.substring(0, 49) + "..."
                      : contact.name || contact.email || contact.mobileNumber }
                  </p>
                  <p className="text-xs text-gray-500 font-normal flex flex-wrap items-center gap-x-1">
                    {contact.jobTitle && (
                      <span className="flex gap-1 items-center">
                        <Briefcase size={12} /> {contact.jobTitle}
                      </span>
                    )}
                    {contact.jobTitle &&
                      (contact.email || contact.mobileNumber) && <span>•</span>}

                    {contact.email && (
                      <span className="flex gap-1 items-center">
                        {" "}
                        <Mail size={12} /> {contact.email}
                      </span>
                    )}
                    {contact.email && contact.mobileNumber && <span>•</span>}

                    {contact.mobileNumber && (
                      <span className="flex gap-1 items-center">
                        {" "}
                        <Phone size={12} /> {contact.mobileNumber}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right: Badges */}
              <div className="flex  items-end gap-1 text-[10px] font-semibold">
                <span
                  className={`px-2 py-0.5 rounded-full border ${
                    contact.isPrimary
                      ? "bg-green-100 text-green-700 border-green-400"
                      : "bg-yellow-50 text-yellow-700 border-yellow-300"
                  }`}
                >
                  {contact.isPrimary ? "Primary" : "Secondary"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full border ${
                    contact.isActive
                      ? "bg-green-100 text-green-700 border-green-400"
                      : "bg-red-100 text-red-700 border-red-400"
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
        <div className="fixed top-8 inset-0 bg-opacity-5 bg-black flex justify-center items-center z-20 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="relative px-8 pt-5 pb-4">
              <button
                onClick={() => setSelectedContactCard(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-6">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white ${
                    isActive ? "bg-blue-500" : "bg-gray-400"
                  }`}
                >
                  {selectedContactCard.name !== null
                    ? selectedContactCard.name.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <div className="flex-1">
                  <h2
                    title={selectedContactCard.name ?? ""}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {selectedContactCard.name !==null && selectedContactCard.name.length > 40 ? (
                      selectedContactCard.name.substring(0, 49) + "..."
                    ) : selectedContactCard.name ? (
                      selectedContactCard.name
                    ) : (
                      <span className="text-base text-gray-500 font-normal italic">Unamed contact</span>
                    )}
                  </h2>
                  <p className="text-md text-gray-600 mt-1 flex items-center">
                    <Briefcase size={16} className="inline mr-2" />
                    {selectedContactCard.jobTitle ?? (
                      <span className="text-sm italic">
                        No job title specified
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedContactCard.isPrimary
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      }`}
                    >
                      {selectedContactCard.isPrimary
                        ? "Primary Contact"
                        : "Secondary Contact"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isActive
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (userHasAccessToUpdateLead) {
                      handleEditLeadContactClick(selectedContactCard);
                    } else {
                      toast.error(
                        MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                      );
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8">
              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                    <Mail className="text-blue-500 mt-1" size={18} />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Email Address
                      </h4>
                      <p className="text-gray-700">
                        {selectedContactCard.email ?? (
                          <span className="text-sm italic">Not provided</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                    <Phone className="text-green-500 mt-1" size={18} />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Mobile Number
                      </h4>
                      <p className="text-gray-700">
                        {selectedContactCard.mobileNumber ?? (
                          <span className="text-sm italic">Not provided</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                    <Languages className="text-purple-500 mt-1" size={18} />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Preferred Language
                      </h4>
                      <p className="text-gray-700">
                        {selectedContactCard.preferredLanguage ?? (
                          <span className="text-sm italic">Not provided</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                    <MessageCircle className="text-orange-500 mt-1" size={18} />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Preferred Communication
                      </h4>
                      <p className="text-gray-700">
                        {selectedContactCard.preferredCommunicationChannel ?? (
                          <span className="text-sm italic">Not provided</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                    <Globe className="text-blue-600 mt-1" size={18} />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        LinkedIn Profile
                      </h4>
                      {selectedContactCard.linkedinProfile ? (
                        <a
                          href={selectedContactCard.linkedinProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View LinkedIn Profile
                        </a>
                      ) : (
                        <p className="text-gray-700 italic text-sm">
                          Not provided
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 mt-1 flex items-center justify-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                    <div className="">
                      <div className="flex gap-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Status
                        </h4>
                        <label className="inline-flex items-center cursor-pointer relative self-end">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={
                              !selectedContactCard.isPrimary &&
                              userHasAccessToUpdateLead
                                ? () => {
                                    handleActiveStatusChange(
                                      selectedContactCard
                                    );
                                  }
                                : () => {
                                    if (selectedContactCard.isPrimary) {
                                      toast.error(
                                        "Update request denied — the user is designated as the Primary Contact."
                                      );
                                    } else {
                                      toast.error(
                                        MESSAGE.MODULE_ACCESS.LEAD_MODULE
                                          .UPDATE_LEAD_ACCESS_DENIED_message
                                      );
                                    }
                                  }
                            }
                            title={
                              selectedContactCard.isPrimary
                                ? "Cannot change the status of the primary contact."
                                : ""
                            }
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300" />{" "}
                          {/* Adjusted size and colors */}
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform peer-checked:translate-x-5 transition-all duration-300" />{" "}
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </label>
                      </div>
                      {selectedContactCard.isPrimary && (
                        <div className="text-xs italic  text-gray-500 mt-1">
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
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Globe size={18} className="text-blue-500" />
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
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm transition-colors border border-blue-200 hover:border-blue-300"
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
                  <MapPin className="text-red-500 mt-1" size={18} />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedContactCard.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Form Modal */}
      {isOpenAddLeadContactForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-5 flex justify-center items-center  p-2 sm:p-6">
          <div className="bg-white mt-14 rounded-lg w-full max-w-5xl max-h-[80vh] overflow-y-auto px-2 py-2 shadow-2xl sm:px-4 sm:py-4">
            {/* Header */}

            {/* <div className="px-2 py-2  border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editContactData ? "Edit Contact" : "Add New Contact"}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {editContactData
                      ? "Update contact information"
                      : "Create a new lead contact"}
                  </p>
                </div>
                <button
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
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div> */}
            <FormHeader
              icon={Contact2}
              preText={editContactData ? "Edit Contact" : "Add New Contact"}
              description= {editContactData
                      ? "Update the contact’s information to keep records accurate and up to date."
                      : "Create a contact for this lead to ensure proper follow-up and engagement."}
              onClose={() => {
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
            />

            {/* Form Grid */}
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm text-gray-500">
                <div>
                  {/* <label className={formInputLabelClassName}>
                    {" "}
                    <User size={16} className="inline mr-1 text-blue-500" />
                    Full Name*{" "}
                  </label> */}
                  <FormInput
                    logo={User}
                    label="Full Name"
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
                  {/* <input
                    onClick={() => {
                      if (
                        editContactData?.isPrimary &&
                        editContactData !== null
                      ) {
                        toast.error(
                          MESSAGE.ERROR
                            .PRIMARY_LEAD_CONTACT_UPDATE_ERROR_MESSAGE
                        );
                      }
                    }}
                  /> */}
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                  )}
                  {editContactData?.isPrimary && (
                    <p className="text-gray-500 text-xs mt-1">
                      Primary contact name cannot be changed
                    </p>
                  )}
                </div>
                <div>
                  <FormInput
                    label="Email Address"
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
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                  {editContactData?.isPrimary && (
                    <p className="text-gray-500 text-xs mt-1">
                      Primary contact email cannot be changed
                    </p>
                  )}
                </div>
                <div>
                  <FormInput
                    logo={Phone}
                    label="Mobile Number"
                    type="text"
                    name="mobileNumber"
                    minLength={10}
                    maxLength={10}
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
                    <p className="text-xs text-red-600 mt-1 ">
                      {errors.mobileNumber}
                    </p>
                  )}
                  {editContactData?.isPrimary && (
                    <p className="text-gray-500 text-xs mt-1">
                      Primary contact mobile number cannot be changed
                    </p>
                  )}
                </div>
                {/* job title */}
                <div>
                  <FormInput
                    label="Job title"
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
                </div>
                {/* pref language */}
                <div>
                  <FormInput
                    logo={Languages}
                    label="Preferred Language"
                    type="text"
                    name="preferredLanguage"
                    maxLength={100}
                    placeholder="eg : Marathi , English etc ..."
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.preferredLanguage || ""}
                  />
                </div>
                {/* pref comm channel */}
                <div>
                  <FormInput
                    logo={MessageCircle}
                    label=" Preferred Communication Channel"
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
                </div>
                {/* linkedin profile */}
                <div>
                  <FormInput
                    logo={Globe}
                    label="LinkedIn Profile"
                    type="text"
                    name="linkedinProfile"
                    maxLength={256}
                    placeholder="Enter linkedIn url"
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.linkedinProfile || ""}
                  />
                </div>

                {/* Social Media Handles */}
                <div className="col-span-2">
                  <div className="flex col-span-2 items-center justify-between bg-pink-00  gap-2">
                    <FormInput
                      logo={Globe}
                      label="Social Media Handles"
                      type="text"
                      placeholder="Enter social media url"
                      value={tempHandle}
                      onChange={(e) => setTempHandle(e.target.value)}
                    />
                    <div className="flex justify-center items-center">
                      <Button onClick={handleAddSocialMedia} type="button">
                        {/* <Plus size={14} /> */}+ Add
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1  sm:grid-cols-2 mt-3 gap-2 max-h-36 overflow-y-auto">
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
                          <Trash2 size={12} />
                          {/* <X size={12} /> */}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className={formInputLabelClassName}>
                    {" "}
                    <MapPin size={16} className="inline mr-2 text-blue-500" />
                    Address
                  </label>
                  <textarea
                    placeholder="Enter full address"
                    name="address"
                    rows={4}
                    maxLength={256}
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.address || ""}
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-4 mt-6 flex-wrap">
                <div className="flex gap-2">
                  <Button
                    type="reset"
                    onClick={() => setIsOpenAddLeadContactForm(false)}
                    // className=" bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded text-sm"
                  >
                    <div className="flex items-center gap-0.5">
                      <X size={16} />
                      Cancel
                    </div>
                  </Button>
                  <Button
                    // className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm rounded"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    <div className="flex items-center gap-1">
                      <Save size={16} />
                      Save
                    </div>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadContact;
