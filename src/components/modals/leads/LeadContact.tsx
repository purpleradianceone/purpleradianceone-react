import { Globe, Plus, X, XIcon } from "lucide-react";
import LeadContactType from "../../../@types/lead-management/LeadContact";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import {
  MOBILE_NUMBER_VALIDATION,
  NUMBER_VALUES,
  VALIDATIONS,
} from "../../../constants/AppConstants";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { MessageSnackbarState, ShowMessageSnackbarProps } from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";

const LeadContact = ({ 
  leadContact,
  selectedLeadData
 }: { 
  leadContact: LeadContactType[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedLeadData : any,
 }) => {
  const {loginStatus} = useLoggedInUserContext();
  const [isOpenAddLeadContactForm, setIsOpenAddLeadContactForm] =
    useState(false);
  const [socialMediaHandles, setSocialMediaHandles] = useState<string[]>([]);
  const [tempHandle, setTempHandle] = useState<string>("");
  const [leadContactForm, setLeadContactForm] = useState({
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

  const handleBlur = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

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

  const handleSubmit = (e: React.FormEvent) => {
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
      newErrors.mobileNumber = "eigther email or mobile number is required.";
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
    console.log("this is that");
    
    console.log(socialMediaHandlesConcat);
    
    //  Proceed with form submission logic here
    const postData = {
      company_id : loginStatus.companyId,
      lead_id : selectedLeadData.id,
      name: leadContactForm.name,
      email: leadContactForm.email,
      mobilenumber: leadContactForm.mobileNumber,
      address : leadContactForm.address,
      job_title : leadContactForm.jobTitle,
      preferred_communication_channel : leadContactForm.preferredCommunicationChannel,
      preferred_language : leadContactForm.preferredLanguage,
      linkedin_profile : leadContactForm.linkedinProfile,
      social_media_handles : socialMediaHandlesConcat,
      is_primary : false,
      createdby_id : loginStatus.id,

    }
    // console.log("Form submitted:", leadContactForm, socialMediaHandles);
    
    axios.post(POST_API.CREATE_LEAD_CONTACT, postData , {
      withCredentials : true
    } ).then((response)=>{
      if(response.data.status === true){
        const data = response.data;
        showMessageSnackbar({
          message : data.message,
          type : "success"
        })
      }else{
        const data = response.data;
        showMessageSnackbar({
          message : data.message,
          type : "error"
          
        }

        )
      }
    }).catch((error)=>{
      console.error(error);
    })

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

  return (
    <div className="w-full px-1 mb-3">
      {/* Header */}
      <div className="flex justify-end items-center text-xs gap-x-2 py-1 text-gray-500">
        <span>Add</span>
        <button
          onClick={() => setIsOpenAddLeadContactForm(!isOpenAddLeadContactForm)}
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
              className="bg-blue-50 border border-blue-100 px-3 py-2 rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-xs font-medium text-gray-800 hover:text-blue-500 cursor-pointer">
                  {contact.name}
                </p>
                <p className="text-xs text-gray-600">
                  {contact.email} | {contact.mobileNumber}
                </p>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                  contact.isPrimary
                    ? "bg-green-100 text-green-700 border border-green-400"
                    : "bg-red-100 text-red-700 border border-red-400"
                }`}
              >
                {contact.isPrimary ? "Primary" : "Secondary"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">
            No contacts available
          </p>
        )}
      </div>

      {/* Add Contact Form Modal */}
      {isOpenAddLeadContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[95%] max-w-5xl max-h-[80vh] overflow-y-auto px-5 py-3 shadow-2xl">
            {/* Header */}
            <div className="border-b pb-3 mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Contact
              </h2>
              <XIcon
                onClick={() => setIsOpenAddLeadContactForm(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              />
            </div>

            {/* Form Grid */}
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-1 block">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    onBlur={handleBlur}
                    placeholder="Full Name"
                    className={inputClass}
                    onChange={handleFormInputChange}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-1 block">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-1 block">
                    Mobile Number:
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                  />
                  {errors.mobileNumber && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-1 block">
                    Job Title:
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-1 block">
                    Preferred Language:
                  </label>
                  <input
                    type="text"
                    name="preferredLanguage"
                    placeholder="Preferred Language"
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-1 block">
                    Preferred Communication Channel:
                  </label>
                  <input
                    type="text"
                    name="preferredCommunicationChannel"
                    placeholder="Preferred Communication Channel"
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-1 block">
                    LinkedIn Profile:
                  </label>
                  <input
                    type="text"
                    name="linkedinProfile"
                    placeholder="LinkedIn URL"
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Social Media Handles */}
                <div className="sm:col-span-2">
                  <label className="text-gray-700 text-sm font-medium mb-1 block">
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
                  <label className="text-gray-700 text-sm font-medium mb-1 block">
                    Address:
                  </label>
                  <textarea
                    placeholder="Full Address"
                    name="address"
                    rows={4}
                    className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </form>
            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="submit"
                onClick={() => setIsOpenAddLeadContactForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded text-sm"
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
