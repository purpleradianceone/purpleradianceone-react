import { Handshake, X } from "lucide-react";
import { NUMBER_VALUES, SIZE } from "../../../constants/AppConstants";
import AddCompanyUserModalProps from "../../../@types/modal/AddCompanyUserModalProps";
import FormInput from "../../ui/FormInput";
import TextAreaInput from "../../ui/TextAreaInput";
import Button from "../../ui/Button";
import ProductDropdownList from "../../ui/ProductDropdown";
import { leadsData, productsData } from "../../../constants/TestData";
import { useEffect, useState } from "react";
import { useFormValidation } from "../../../config/hooks/useFormValidation";
import { useFormChange } from "../../../config/hooks/useFormChange";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import axios from "axios";
import POST_API from "../../../constants/PostApi";

type CreateLeadFormDataType = {
  name: string;
  email: string;
  mobileNumber: string;
  address: string;
  circle: string;
  interest: string;
  referenceBy: string;
  remark: string;
  status: string;
};

type PostDataForLeadSourceAndStatus = {
  id: number | null;
  name: string | null;
  description: string | null;
  isactive: boolean;
};

function CreateLeadModal({ isOpen, onClose }: AddCompanyUserModalProps) {
  const initialCreatLeadFormData: CreateLeadFormDataType = {
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    circle: "",
    interest: "",
    referenceBy: "",
    remark: "",
    status: "",
  };

  const { errors, handleBlur } = useFormValidation(
    initialCreatLeadFormData,
    "registration"
  );
  const {
    formData: createLeadModalFormData,
    handleChange: handleCreateLeadModalFormDataChange,
  } = useFormChange(initialCreatLeadFormData);

  //states for lead status and source
  const [leadSource, setLeadSource] = useState<
    PostDataForLeadSourceAndStatus[] | null
  >(null);

  const [leadStatus, setLeadStatus] = useState<
    PostDataForLeadSourceAndStatus[] | null
  >(null);

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

  //   NOTE : TP GET THE DATA FROM BACKEND
  const getLeadSourceOptions = () => {
    const postDataForLeadSource: PostDataForLeadSourceAndStatus = {
      id: null,
      name: null,
      description: null,
      isactive: true,
    };
    axios
      .post(POST_API.GET_LEAD_SOURCE, postDataForLeadSource, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setLeadSource(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getLeadStatusOptions = () => {
    const postDataForLeadStatus: PostDataForLeadSourceAndStatus = {
      id: null,
      name: null,
      description: null,
      isactive: true,
    };
    axios
      .post(POST_API.GET_LEAD_STATUS, postDataForLeadStatus, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setLeadStatus(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //called the function in here
  useEffect(() => {
    getLeadSourceOptions();
    getLeadStatusOptions();
  }, []);

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      createLeadModalFormData.name !== "" ||
      createLeadModalFormData.email !== "" ||
      createLeadModalFormData.mobileNumber !== ""
    ) {
      leadsData.push(createLeadModalFormData);
      showMessageSnackbar({
        message: "Lead Created Successfully",
        type: "success",
      });
      setTimeout(() => {
        onClose();
      }, NUMBER_VALUES.SNACKBAR_DURATION);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-45 flex items-center justify-center p-4 overflow-y-auto">
      {/* <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative animate-fadeIn px-6 py-6 max-h-[90vh] overflow-y-auto"> */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative animate-fadeIn px-6 py-6 max-h-[90vh] overflow-y-auto">
        {/* Header: Title + Close Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Handshake className="text-blue-500" size={SIZE.TWENTY_FOUR} />
            <h2 className="text-xl font-semibold text-gray-800">
              Create New Opportunity
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={SIZE.TWENTY} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Product Dropdown */}
          {/* NOTE : THIS IS THE DROPDOWN SHOW PRODUCTS HERE , GET THE PRODUCTS AND PASS AS A PROPS */}
          <ProductDropdownList product={productsData} />

          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Name : "
              type="text"
              name="name"
              placeholder="Enter Name"
              value={createLeadModalFormData.name}
              onChange={handleCreateLeadModalFormDataChange}
              onBlur={handleBlur}
              error={errors.name}
            />
            <FormInput
              label="Email : "
              type="email"
              name="email"
              placeholder="Enter Email"
              value={createLeadModalFormData.email}
              onChange={handleCreateLeadModalFormDataChange}
              onBlur={handleBlur}
              error={errors.email}
            />
          </div>

          {/* Phone and Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Mobile Number : "
              type="text"
              name="mobileNumber"
              placeholder="Enter Phone Number"
              value={createLeadModalFormData.mobileNumber}
              onChange={handleCreateLeadModalFormDataChange}
              onBlur={handleBlur}
              error={errors.mobileNumber}
            />
            <FormInput
              label="Address : "
              type="text"
              name="address"
              placeholder="Enter Address"
              value={createLeadModalFormData.address}
              onChange={handleCreateLeadModalFormDataChange}
            />
          </div>

          {/* Circle and Interest Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Circle :
              </label>
              <select
                name="circle"
                value={createLeadModalFormData.circle}
                className="w-full p-2 border rounded-md"
              >
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interest :
              </label>
              <select
                name="interest"
                value={createLeadModalFormData.interest}
                // onChange={handleCreateLeadModalFormDataChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Reference By Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[90vh]">
            <div>
              <label
                //   className="block text-sm font-medium text-gray-700"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Lead Status :
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                //   NOTE : NEED TO MAKE CHANGES HERE
                //   value={}
                //    onChange={handleChange}
              >
                <option value="" className="text-gray-700">
                  Lead Status{" "}
                </option>

                {leadStatus && leadStatus.length>0 ? ( leadStatus!.map((source) => (
                  <option
                    key={source.id}
                    value={source.id!}
                    className="text-gray-800"
                  >
                    <span className="text-gray-600">{source.name}</span>
                  </option>
                ))):(
                    <option value="" className="text-gray-700">please refresh page</option>
                )}
              </select>
            </div>

            {/* lead-source Dropdown */}
            <div>
              <label
                //   className="block text-sm font-medium text-gray-700"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Lead Source :
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                //   NOTE : NEED TO MAKE CHANGES HERE
                //   value={}
                //    onChange={handleChange}
              >
                <option value="" className="text-gray-700">
                  Lead Source{" "}
                </option>
                {leadSource!.map((source) => (
                  <option
                    key={source.id}
                    value={source.id!}
                    className="text-gray-800"
                  >
                    {source.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Remark Text Area */}
          <TextAreaInput
            label="Remark : "
            name="remark"
            cols={5}
            rows={3}
            maxLength={256}
            value={createLeadModalFormData.remark}
            onChange={handleCreateLeadModalFormDataChange}
          />

          {/* Buttons */}
          {/* <div className="flex justify-start gap-4 mx-80">
            <Button type="submit">Create Lead</Button>
          </div> */}
          <div className="flex justify-start gap-4  ">
            <Button type="submit" >
              Create Lead
            </Button>
          </div>
        </form>
      </div>

      {/* Snackbar Message */}
      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </div>
  );
}

export default CreateLeadModal;
