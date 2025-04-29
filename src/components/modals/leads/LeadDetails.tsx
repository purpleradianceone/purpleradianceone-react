/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import LeadDetailsData from "../../../@types/lead-management/LeadDetailsData";
import Country from "../../../@types/general/Country";
import State from "../../../@types/general/State";
import District from "../../../@types/general/District";
import industryType from "../../../@types/general/industryType";
import CreateLeadDetails from "../../../@types/lead-management/CreateLeadDetails";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { NUMBER_VALUES, STATUS_CODE } from "../../../constants/AppConstants";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import CreateOrUpdateLeadDetails from "../../../@types/lead-management/CreateLeadDetails";
import { log } from "console";

const LeadDetails = ({
  leadDetailsData,
  setLeadDetailsData,
  countries,
  industryType,
  stateData,
  district,
  selectedLeadData,
}: {
  leadDetailsData: LeadDetailsData;
  setLeadDetailsData: React.Dispatch<React.SetStateAction<LeadDetailsData>>;
  selectedLeadData: any;
  countries: Country[];
  industryType: industryType[];
  stateData: State[];
  district: District[];
}) => {
  const [isRequestForCreate, setIsRequestForCreate] = useState<boolean>(false);

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

  useEffect(() => {
    console.log("this is selected lead data");

    console.log(selectedLeadData);
  });
  const { loginStatus } = useLoggedInUserContext();
  const handleSave = async () => {
    let createNewDetail = false;
    if (leadDetailsData.id === null || leadDetailsData.id === 0) {
      setIsRequestForCreate(true);
      createNewDetail = true;
    }
    const PostDataCreateLead: CreateOrUpdateLeadDetails = {
      ...(createNewDetail ? {lead_id: selectedLeadData.id,} : {id: leadDetailsData.id,}),
      company_id: loginStatus.companyId,
      country_id: leadDetailsData.country_id,
      address: leadDetailsData.address,
      additional_contact_number: leadDetailsData.additional_contact_number,
      district_id: leadDetailsData.district_id,
      industry_name: leadDetailsData.industry_name,
      industry_type_id: leadDetailsData.industry_type_id,
      job_title: leadDetailsData.job_title,
      state_id: leadDetailsData.state_id,
      website: leadDetailsData.website,
      ...(createNewDetail? {createdby: loginStatus.id,}:{updatedby: loginStatus.id,}),
    };

    const url = createNewDetail
      ? POST_API.CREATE_LEAD_DETAILS
      : POST_API.UPDATE_LEAD_DETAILS;

    const response = await axios.post(url, PostDataCreateLead, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === STATUS_CODE.OK) {
      if (response.data.status) {
        showMessageSnackbar({
          message: response.data.message,
          type: "success",
        });
        return;
      }
      if (response.data.status === false) {
        showMessageSnackbar({
          message: response.data.message,
          type: "warning",
        });
        return;
      }
    }
  };

  useEffect(() => {
    console.log(leadDetailsData);
  }, [leadDetailsData]);

  const districtOptions = Array.isArray(district)
    ? district.map((val) => ({
        label: val.name,
        value: val.id,
      }))
    : [];

  const stateOptions = Array.isArray(stateData)
    ? stateData.map((state) => ({
        label: state.name,
        value: state.id,
      }))
    : [];

  const countryOptions = Array.isArray(countries)
    ? countries.map((country) => ({
        label: country.name,
        value: country.id,
      }))
    : [];

  const industryOptions = Array.isArray(industryType)
    ? industryType.map((val) => ({
        label: val.name,
        value: val.id,
      }))
    : [];

  return (
    <div>
      <div className="w-auto flex justify-between bg-slate-100 px-2 mb-1  ">
        <span className="text-sm text-gray-800">Details</span>
        <button
          className="text-xs text-gray-500 mb-1  hover:text-black hover:underline"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
        <FormField
          type="select"
          label="Industry"
          selectOptions={industryOptions}
          value={leadDetailsData.industry_type_id}
          onChange={(e) => {
            setLeadDetailsData({
              ...leadDetailsData,
              industry_type_id: parseInt(e.target.value),
            });
          }}
        />
        <FormField
          type="text"
          label="Address"
          value={leadDetailsData.address}
          onChange={(e) => {
            setLeadDetailsData({ ...leadDetailsData, address: e.target.value });
          }}
        />
        <FormField
          type="text"
          label=" Job title"
          value={leadDetailsData.job_title}
          onChange={(e) => {
            setLeadDetailsData({
              ...leadDetailsData,
              job_title: e.target.value,
            });
          }}
        />

        <FormField
          type="text"
          label="Additional contact number"
          value={leadDetailsData.additional_contact_number}
          onChange={(e) => {
            setLeadDetailsData({
              ...leadDetailsData,
              additional_contact_number: e.target.value,
            });
          }}
        />
        <FormField
          type="select"
          label="District"
          selectOptions={districtOptions}
          value={leadDetailsData.district_id}
          onChange={(e) => {
            setLeadDetailsData({
              ...leadDetailsData,
              district_id: parseInt(e.target.value),
            });
          }}
        />
        <FormField
          type="select"
          label="State"
          selectOptions={stateOptions}
          value={leadDetailsData.state_id}
          onChange={(e) => {
            setLeadDetailsData({
              ...leadDetailsData,
              state_id: parseInt(e.target.value),
            });
          }}
        />
        {/* <p className="text-xs">Selected State: {stateOptions.find(opt => opt.value === leadDetailsData.state_id)?.label || 'None'}</p> */}
        <FormField
          type="select"
          label="Country"
          selectOptions={countryOptions}
          value={leadDetailsData.country_id}
          onChange={(e) => {
            setLeadDetailsData({
              ...leadDetailsData,
              country_id: parseInt(e.target.value),
            });
          }}
        />
        {/* <p className="text-xs">Selected coutry: {countryOptions.find(opt => opt.value === leadDetailsData.country_id)?.label || 'None'}</p> */}

        <FormField
          type="text"
          label="Industry Name"
          value={leadDetailsData.industry_name}
          onChange={(e) => {
            setLeadDetailsData({
              ...leadDetailsData,
              industry_name: e.target.value,
            });
          }}
        />
        <FormField
          type="text"
          label="Website"
          value={leadDetailsData.website}
          onChange={(e) => {
            setLeadDetailsData({ ...leadDetailsData, website: e.target.value });
          }}
        />
      </div>
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

type OptionType = {
  label: string | null;
  value: string | null | number;
};

type FormFieldProps = {
  label: string;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  type: "text" | "number" | "select";
  selectOptions?: OptionType[];
};

const FormField = ({
  label,
  value,
  onChange,
  type,
  selectOptions,
}: FormFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => {
    setTimeout(() => setIsEditing(false), 100); // Delay so dropdown click registers
  };

  return (
    <div className="flex justify-between items-center border-b text-sm ">
      <div className="text-gray-700 text-xs">{label}</div>
      <div
        className="flex items-center  min-w-[150px]"
        onClick={() => setIsEditing(true)}
      >
        {!isEditing ? (
          <span className="text-gray-900 cursor-pointer">
            {type === "select"
              ? selectOptions?.find((opt) => opt.value === value)?.label || "_"
              : value || (
                  <span className="text-xs text-gray-500">type here...</span>
                )}
          </span>
        ) : type === "select" ? (
          <select
            autoFocus
            value={value}
            onBlur={handleBlur}
            onChange={onChange}
            className="text-gray-900 border border-gray-300 rounded p-1 text-xs focus:outline-none"
          >
            <option value="">Select {label}</option>
            {selectOptions?.map((opt) => (
              <option key={opt.value} value={opt.value!}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            autoFocus
            type={type}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            className="text-gray-900 border-none border-gray-300 focus:outline-none"
          />
        )}
      </div>
    </div>
  );
};
export default LeadDetails;
