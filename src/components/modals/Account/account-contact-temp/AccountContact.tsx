/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import { useEffect, useState } from "react";
import {
  MOBILE_NUMBER_VALIDATION,
  SIZE,
  STATUS_CODE,
  VALIDATIONS,
} from "../../../../constants/AppConstants";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import toast from "react-hot-toast";
import MESSAGE from "../../../../constants/Messages";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import Button from "../../../ui/Button";
import FormHeader from "../../../ui/FormHeader";
import FormInput from "../../../ui/FormInput";
import TextAreaInput from "../../../ui/TextAreaInput";
import AccountContactType from "../../../../@types/account/AccountContactType";
import { Briefcase, Edit, Edit3, Globe, Languages, Mail, MapPin, MessageCircle, Phone, Save, User, X } from "lucide-react";
import StatusChip from "../../../ui/StatusChip";
import COLORS from "../../../../constants/Colors";
import ToggleButton from "../../../ui/ToggleButton";
import { createPortal } from "react-dom";
import LoadingPopUpAnimation from "../../../views/card/LoadingPopUpAnimation";

type AccountContactTypeComponent = {
  accountId: number;
};

type AccountContactFormType = {
  name: string;
  email: string;
  mobileNumber: string;
  address: string;
  department: string;
  designation: string;
  preferredLanguage: string;
  preferredCommunicationChannel: string;
};

const AccountContact = ({ accountId }: AccountContactTypeComponent) => {
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToUpdateAccount } = useUserAccessModules();
  const [accountContact, setAccountContact] = useState<AccountContactType[]>(
    []
  );
  const [showLoadingSpinner, setShowLoadingSpinner] = useState<boolean>(true);

  const [isActive, setIsActive] = useState<boolean>(true); // default to active
  const [isSaving , setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobileNumber: "",
  });

  const [isOpenAddAccountContactForm, setIsOpenAddAccountContactForm] =
    useState(false);
  const [selectedContactCard, setSelectedContactCard] =
    useState<AccountContactType | null>(null);

  // get account contact data
  const fetchAccountContact = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      account_id: accountId,
      isactive: null,
      requestedby_id: loginStatus.id,
    };

    await axios
      .post(POST_API.GET_ACCOUNT_CONTACT, postData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          const responseData = response.data;
          const mappedData: AccountContactType[] = responseData.map(
            (item: any) => ({
              id: item.id,
              accountId: item.account_id,
              name: item.name,
              email: item.email,
              mobileNumber: item.mobilenumber,
              address: item.address,
              department: item.department,
              designation: item.designation,
              preferredCommunicationChannel:
                item.preferred_communication_channel,
              preferredLanguage: item.preferred_language,
              isActive: item.isactive,
              createdBy: item.createdby,
              updatedBy: item.updatedby,
              createdOn: item.createdon,
              updatedOn: item.updatedon,
            })
          );

          //store that data in state.
          setAccountContact(mappedData);
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: fetchAccountContact,
          });
          if (refreshTokenResponse) {
            fetchAccountContact();
          }
        }
      })
      .finally(() => {
        setShowLoadingSpinner(false);
      });
  };

  // Note : this is for distinguish between updated form and new contact form
  const [editingContactId, setEditingContactId] = useState<number | null>(null);

  const [editContactData, setEditContactData] =
    useState<AccountContactType | null>(null); // null when adding

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

  const [accountContactForm, setAccountContactForm] =
    useState<AccountContactFormType>({
      name: "",
      email: "",
      mobileNumber: "",
      preferredLanguage: "",
      preferredCommunicationChannel: "",
      address: "",
      department: "",
      designation: "",
    });
  const handleFormInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAccountContactForm({ ...accountContactForm, [name]: value.trim() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, mobileNumber } = accountContactForm;
    let isValid = true;
    if(isSaving)return;
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

    setIsSaving(true)
    //  Proceed with form submission logic here
    const postData = {
      company_id: loginStatus.companyId,
      account_id: accountId,
      name: accountContactForm.name,
      email: accountContactForm.email,
      mobilenumber: accountContactForm.mobileNumber,
      address: accountContactForm.address,
      preferred_communication_channel:
        accountContactForm.preferredCommunicationChannel,
      preferred_language: accountContactForm.preferredLanguage,
      designation: accountContactForm.designation,
      department: accountContactForm.department,
      ...(editingContactId
        ? {
            id: editContactData?.id,
            updatedby_id: loginStatus.id,
          }
        : {
            createdby_id: loginStatus.id,
            is_primary: false,
          }),
    };


    const api = editingContactId
      ? POST_API.UPDATE_ACCOUNT_CONTACT
      : POST_API.CREATE_ACCOUNT_CONTACT;
    await axios
      .post(api, postData, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        if (data.status === true) {
          toast.success(data.message);
          fetchAccountContact();
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
      })
      .finally(() => {
        // Optionally close modal and reset form
        setIsOpenAddAccountContactForm(false);
        // clear the data after api call
        clearStateData();
        setIsSaving(false);
        handleStateClearFunctionOnClickOfCancelOrXButton();
      });
  };

  const handleEditLeadContactClick = (
    selectedContactCard: AccountContactType
  ) => {
    // note
    // console.log(selectedContactCard);

    setEditingContactId(selectedContactCard.id);
    setEditContactData(selectedContactCard);
    setIsOpenAddAccountContactForm(true);
    // Note : if need to change then make changes here , do uncomment it
    setSelectedContactCard(null); // Close the view card

    // Note : this is the selected contact data which will be used in the editing purpose to fill the input fields.
    setAccountContactForm({
      name: selectedContactCard.name || "",
      email: selectedContactCard.email || "",
      mobileNumber: selectedContactCard.mobileNumber || "",
      preferredLanguage: selectedContactCard.preferredLanguage || "",
      preferredCommunicationChannel:
        selectedContactCard.preferredCommunicationChannel || "",
      address: selectedContactCard.address || "",
      department: selectedContactCard.department || "",
      designation: selectedContactCard.designation || "",
    });
  };

  // to change the status of contact
  const handleActiveStatusChange = async (
    selectedContactCard: AccountContactType
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
      preferred_communication_channel:
        selectedContactCard.preferredCommunicationChannel,
      department: selectedContactCard.department,
      designation: selectedContactCard.designation,
      preferred_language: selectedContactCard.preferredLanguage,
      id: selectedContactCard?.id,
      updatedby_id: loginStatus.id,
      isactive: newStatus,
    };

    const api = POST_API.UPDATE_ACCOUNT_CONTACT;
    await axios
      .post(api, postData, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        if (response.data.status === true) {
          toast.success(data.message);
          fetchAccountContact();
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
  function clearStateData() {
    setAccountContactForm({
      name: "",
      email: "",
      mobileNumber: "",
      department: "",
      designation: "",
      preferredLanguage: "",
      preferredCommunicationChannel: "",
      address: "",
    });
  }
  //Note : call will go for the first render.
  useEffect(() => {
    fetchAccountContact();
  }, []);

  useEffect(() => {
    if (selectedContactCard?.isActive !== undefined) {
      setIsActive(selectedContactCard.isActive);
    }
  }, [selectedContactCard]);

  function handleStateClearFunctionOnClickOfCancelOrXButton() {
    setEditingContactId(null);
    setIsOpenAddAccountContactForm(false);
    setEditContactData(null);
    setErrors({
      email: "",
      mobileNumber: "",
      name: "",
    });
    // note
    setAccountContactForm({
      name: "",
      email: "",
      address: "",
      department: "",
      designation: "",
      mobileNumber: "",
      preferredCommunicationChannel: "",
      preferredLanguage: "",
    });
  }
  if (showLoadingSpinner)
    return (
      <>
        <div className="w-full h-full  flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </>
    );
  return (
    <>
      {accountContact.length === 0 ? (
        <div className=" w-full h-full bg-slate-0">
          <div className="flex gap-1 w-full text-xs h-full bg-green-0 items-center justify-center">
            <Button
              disabled={!userHasAccessToUpdateAccount}
              onClick={() => {
                if (userHasAccessToUpdateAccount) {
                  setIsOpenAddAccountContactForm(!isOpenAddAccountContactForm);
                } else {
                  toast.error(
                    MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS
                  );
                }
              }}
              className={COLORS.ADD_BUTTON}
            >
              +Add
            </Button>
            <span className=" italic caption-custom">No contacts available.</span>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-end items-center text-xs gap-x-2 py-1 text-gray-500">
            <Button
            disabled={!userHasAccessToUpdateAccount}
              onClick={() => {
                if (userHasAccessToUpdateAccount) {
                  setIsOpenAddAccountContactForm(!isOpenAddAccountContactForm);
                } else {
                  toast.error(
                    MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS.DENIED_UPDATE_ACCESS
                  );
                }
              }}
              className={COLORS.ADD_BUTTON}
            >
              {/* <Plus size={10} /> */}
              <span>+Add</span>
            </Button>
          </div>

          {/* Contacts List */}
          <div className="space-y-2 ">
            {accountContact && accountContact.length > 0 ? (
              accountContact.map((contact, index) => (
                <div
                  key={index}
                  className={COLORS.CONTACT_CARD}
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
                      {contact.name
                        ? contact.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>

                    {/* Text Info */}
                    <div className="flex flex-col">
                      <p
                      // className="table-header-custom"
                       className="input-label-custom "
                       >
                        {contact.name || "Unknown Contact"}
                      </p>
                      <p className="caption-custom flex flex-wrap items-center gap-x-1">
                        {contact.designation && (
                          <span className="flex gap-1 items-center">
                            <Briefcase size={12} /> {contact.designation}
                          </span>
                        )}
                        {contact.designation &&
                          (contact.email || contact.mobileNumber) && (
                            <span>•</span>
                          )}

                        {contact.email && (
                          <span className="flex gap-1 items-center">
                            {" "}
                            <Mail size={12} /> {contact.email}
                          </span>
                        )}
                        {contact.email && contact.mobileNumber && (
                          <span>•</span>
                        )}

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
                    <StatusChip isActive={contact.isActive}/>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm italic  text-gray-500 text-center">
                No contacts available
              </p>
            )}
          </div>

          {/* view in pop up card  */}
          {selectedContactCard && createPortal(
            <div className="fixed border inset-0 bg-black bg-opacity-5 flex justify-center items-center z-50 p-4">
              <div className="bg-white border rounded-2xl shadow-xl w-full max-w-5xl max-h-[85vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
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
                        selectedContactCard.isActive
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {selectedContactCard.name
                        ? selectedContactCard.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {selectedContactCard.name ? (
                          selectedContactCard.name
                        ) : (
                          <span className="text-sm italic">Unamed contact</span>
                        )}
                      </h2>
                      <p className="text-md text-gray-600 mt-1 flex items-center">
                        <Briefcase size={16} className="inline mr-2" />
                        {selectedContactCard.designation ? (
                          selectedContactCard.designation
                        ) : (
                          <span className="text-sm italic">
                            No job title specified
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <StatusChip isActive={isActive}/>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (userHasAccessToUpdateAccount) {
                          handleEditLeadContactClick(selectedContactCard);
                        } else {
                          toast.error(
                            MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS
                              .DENIED_UPDATE_ACCESS
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
                            {selectedContactCard.email ? (
                              selectedContactCard.email
                            ) : (
                              <span className="text-sm italic">
                                Not provided
                              </span>
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
                            {selectedContactCard.mobileNumber ? (
                              selectedContactCard.mobileNumber
                            ) : (
                              <span className="text-sm italic">
                                Not provided
                              </span>
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
                            {selectedContactCard.preferredLanguage ? (
                              selectedContactCard.preferredLanguage
                            ) : (
                              <span className="text-sm italic">
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
                          className="text-orange-500 mt-1"
                          size={18}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            Preferred Communication
                          </h4>
                          <p className="text-gray-700">
                            {selectedContactCard.preferredCommunicationChannel ? (
                              selectedContactCard.preferredCommunicationChannel
                            ) : (
                              <span className="text-sm italic">
                                Not provided
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                        <Globe className="text-blue-600 mt-1" size={18} />
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">
                            Department
                          </h4>
                          {selectedContactCard.department ? (
                            <span className="text-gray-700">
                              {selectedContactCard.department}
                            </span>
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
                              isActive
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                        </div>
                        <div className="">
                          <div className="flex gap-2">
                            <h4 className="font-medium text-gray-900 ">
                              Status
                            </h4>
                            <ToggleButton
                            checked={isActive}
                            name="isActive"
                            onToggle={
                              userHasAccessToUpdateAccount
                                    ? () => {
                                        handleActiveStatusChange(
                                          selectedContactCard
                                        );
                                      }
                                    : () => {
                                        toast.error(
                                          MESSAGE.MODULE_ACCESS.ACCOUNT_ACCESS
                                            .DENIED_UPDATE_ACCESS
                                        );
                                      }
                            }
                            />


                            <span className="mt-1 caption-custom">
                              {selectedContactCard.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  {selectedContactCard.address && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="text-red-500 mt-1" size={18} />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          Address
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedContactCard.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      )}
      {/* Add Contact Form Modal */}
      {isOpenAddAccountContactForm && createPortal(
        <div className="fixed inset-0 z-50 bg-black bg-opacity-5 flex justify-center items-center  p-2 sm:p-2">
          <div className="bg-white mt-14 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto px-2 py-2 shadow-2xl sm:px-4 sm:py-2">
            {/* Header */}

            <div className=" py-2">
              <FormHeader
                icon={Edit}
                preText={
                  editContactData
                    ? "Update contact information"
                    : "Create new Account's contact "
                }
                description={
                  editContactData
                    ? "Update the contact’s information to keep records accurate and up to date."
                    : "Create a contact for this Account to ensure proper follow-up and engagement."
                }
                onClose={
                  handleStateClearFunctionOnClickOfCancelOrXButton
                }
              />
            </div>

            {/* Form Grid */}
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-500">
                {/* name */}
                <div>
                  <FormInput
                    logo={User}
                    label="Full Name: "
                    required
                    id="name"
                    type="text"
                    name="name"
                    onBlur={handleBlur}
                    minLength={VALIDATIONS.MIN_NAME_LENGTH}
                    maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                    placeholder="Enter full name"
                    // className={inputClass}
                    onChange={handleFormInputChange}
                    defaultValue={editContactData?.name || ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 ">{errors.name}</p>
                  )}
                </div>
                {/* email */}
                <div>
                  <FormInput
                    logo={Mail}
                    label="Email: "
                    id="email"
                    required
                    type="email"
                    name="email"
                    maxLength={VALIDATIONS.MAX_NAME_LENGTH}
                    placeholder="Enter email address"
                    // className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.email || ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 ">{errors.email}</p>
                  )}
                </div>
                {/* mobile number */}
                <div>
                  <FormInput
                    logo={Phone}
                    label="Mobile number: "
                    required
                    id="mobileNumber"
                    type="text"
                    name="mobileNumber"
                    minLength={10}
                    maxLength={10}
                    placeholder="Enter mobile number"
                    // className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.mobileNumber || ""}
                  />
                  {errors.mobileNumber && (
                    <p className="text-xs text-red-600  ">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>
                {/* designation */}
                <div>
                  <FormInput
                    logo={Briefcase}
                    label="Designation:"
                    id="designation"
                    type="text"
                    name="designation"
                    maxLength={100}
                    placeholder="Enter designation"
                    // className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.designation || ""}
                  />
                </div>
                {/* department */}
                <div>
                  <FormInput
                    logo={Briefcase}
                    label="Department:"
                    id="department"
                    type="text"
                    name="department"
                    maxLength={100}
                    placeholder="Enter department name "
                    // className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.department || ""}
                  />
                </div>
                {/* Preferrd language */}
                <div>
                  <FormInput
                    logo={Languages}
                    label="Preferred Language:"
                    id="preferredLanguage"
                    type="text"
                    name="preferredLanguage"
                    maxLength={100}
                    placeholder="eg : Marathi , English etc ..."
                    // className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.preferredLanguage || ""}
                  />
                </div>

                {/* Preferred communication channel */}
                <div>
                  <FormInput
                    logo={MessageCircle}
                    label="Preferred Communication Channel:"
                    id="preferredCommunicationChannel"
                    type="text"
                    maxLength={100}
                    name="preferredCommunicationChannel"
                    placeholder="eg : Mail, Phone, WhatsApp etc ..."
                    // className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={
                      editContactData?.preferredCommunicationChannel || ""
                    }
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <TextAreaInput
                    logo={MapPin}
                    cols={5}
                    label="Address:"
                    id="address"
                    placeholder="Enter full address"
                    name="address"
                    rows={4}
                    maxLength={256}
                    // className={inputClass}
                    onChange={handleFormInputChange}
                    onBlur={handleBlur}
                    defaultValue={editContactData?.address || ""}
                  />
                </div>
              </div>
            </form>
            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-4 mt-3 ">
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleStateClearFunctionOnClickOfCancelOrXButton}
                  // className=" bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded text-sm"
                >
                  <div className="flex items-center gap-0.5">
                    <X size={SIZE.SIXTEEN} />
                    Cancel
                  </div>
                </Button>
                <Button
                  // className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm rounded"
                  type="submit"
                  onClick={handleSubmit}
                >
                  <div className="flex items-center gap-1">
                    <Save size={SIZE.SIXTEEN} />
                    Save
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      {
        isSaving && <LoadingPopUpAnimation
          show={isSaving}
        />
      }
    </>
   
  );
};
export default AccountContact;
