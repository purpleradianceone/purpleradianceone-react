/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from "react";
import LeadDetailsData from "../../../@types/lead-management/LeadDetailsData";
import Country from "../../../@types/general/Country";
import State from "../../../@types/general/State";
import District from "../../../@types/general/District";
import industryType from "../../../@types/general/industryType";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import {
  MOBILE_NUMBER_VALIDATION,
  STATUS_CODE,
} from "../../../constants/AppConstants";

import CreateOrUpdateLeadDetails from "../../../@types/lead-management/CreateLeadDetails";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import toast from "react-hot-toast";
import MESSAGE from "../../../constants/Messages";
import COLORS from "../../../constants/Colors";
import { Save } from "lucide-react";

const LeadDetails = ({
  leadDetailsData,
  setLeadDetailsData,
  selectedLeadData,
  // handleLeadActivityChange,
  getLeadDetails,
  handleSaveEditLeadDetailsCallback,
}: {
  // handleLeadActivityChange: (person: string, work: string) => void;
  leadDetailsData: LeadDetailsData;
  setLeadDetailsData: React.Dispatch<React.SetStateAction<LeadDetailsData>>;
  selectedLeadData: any;

  getLeadDetails: () => void;
  handleSaveEditLeadDetailsCallback: (
    editLeadDetailsData: LeadDetailsData
  ) => void;
}) => {
  const { userHasAccessToUpdateLead } = useUserAccessModules();

  const [editLeadDetails, setEditLeadDetails] = useState<LeadDetailsData>({
    additional_contact_number: "",
    address: "",
    country_id: 0,
    district_id: 0,
    country_name: "",
    createdby: "",
    createdon: "",
    district_name: "",
    id: 0,
    industry_name: "",
    industry_type: "",
    industry_type_id: 0,
    job_title: "",
    lead_id: 0,
    state_id: 0,
    state_name: "",
    updatedby: "",
    updatedon: "",
    website: "",
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [industryType, setIndustryType] = useState<industryType[]>([]);
  const [stateData, setStateData] = useState<State[]>([]);
  const [district, setDistrict] = useState<District[]>([]);

  const [countryid, setCountryid] = useState<string>("");
  const [stateId, setStateId] = useState<string>("");
  const [districtId, setDistrictId] = useState<string>("");
  const [industryTypeId, setIndustryTypeId] = useState<string>("");

  // note : for checking it is changed or not
  const [changedCountryId, setChangedCountryId] = useState<number | null>(null);
  const [changedStateId, setChangedStateId] = useState<number | null>(null);

  useEffect(() => {
    setEditLeadDetails(leadDetailsData);
    setChangedCountryId(leadDetailsData.country_id);
    setChangedStateId(leadDetailsData.state_id);
  }, [leadDetailsData]);

  const [showSaveLeadButton, setShowSaveLeadButton] = useState<boolean>(false);
  



  

  const { loginStatus } = useLoggedInUserContext();
  const createNewDetailRef = useRef<boolean>(false);

  // Note : Create or Edit save api call
  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (
      editLeadDetails.additional_contact_number !== "" &&
      editLeadDetails.additional_contact_number !== null &&
      !editLeadDetails.additional_contact_number?.match(
        MOBILE_NUMBER_VALIDATION.MOBILE_NUMBER_PATTERN_INDIAN
      )
    ) {
      // setMessageSnackbar({
      //   open: true,
      //   message: MOBILE_NUMBER_VALIDATION.ERROR_MESSAGE_MOBILE_NUMBER_INDIAN,
      //   type: "error",
      // });
      toast.error(MOBILE_NUMBER_VALIDATION.ERROR_MESSAGE_MOBILE_NUMBER_INDIAN)
      return;
    }

    if (leadDetailsData.id === null || leadDetailsData.id === 0) {
      createNewDetailRef.current = true;
    } else {
      createNewDetailRef.current = false;
    }
    const PostDataCreateLead: CreateOrUpdateLeadDetails = {
      ...(createNewDetailRef.current
        ? { lead_id: selectedLeadData.id }
        : { id: editLeadDetails.id }),
      company_id: loginStatus.companyId,
      country_id: editLeadDetails.country_id,
      address: editLeadDetails.address,
      additional_contact_number: editLeadDetails.additional_contact_number,
      district_id: editLeadDetails.district_id,
      industry_name: editLeadDetails.industry_name,
      industry_type_id: editLeadDetails.industry_type_id,
      job_title: editLeadDetails.job_title,
      state_id: editLeadDetails.state_id,
      website: editLeadDetails.website,
      ...(createNewDetailRef.current
        ? { createdby: loginStatus.id }
        : { updatedby: loginStatus.id }),
    };

    const url = createNewDetailRef.current
      ? POST_API.CREATE_LEAD_DETAILS
      : POST_API.UPDATE_LEAD_DETAILS;
    try {
      const response = await axios.post(url, PostDataCreateLead, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === STATUS_CODE.OK) {
        if (response.data.status) {
          // showMessageSnackbar({
          //   message: response.data.message,
          //   type: "success",
          // });
          toast.success(response.data.message)
          setShowSaveLeadButton(false);
          createNewDetailRef.current = false;

          handleSaveEditLeadDetailsCallback(editLeadDetails);
          getLeadDetails();
          return;
        }
        if (response.data.status === false) {
          // showMessageSnackbar({
          //   message: response.data.message,
          //   type: "warning",
          // });
          toast.error(response.data.message)
          return;
        }
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: handleSave,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          handleSave(e);
        }
      }
    }
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
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: fetchIndustryType,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          fetchIndustryType();
        }
      }
    }
  };

  // Note : function to get countries
  const getAllCountries = async () => {
    const PostData: Country = {
      id: null,
      dialcode: null,
      name: null,
      description: null,
      isactive: true,
    };

    try {
      const response = await axios.post(POST_API.GET_COUNTRY, PostData, {
        withCredentials: true,
      });
      if (response.status == STATUS_CODE.OK) {
        setCountries(response.data);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getAllCountries,
        });
        if (refreshTokenStatus) {
          getAllCountries();
        }
      }
    }
  };

  //Note : function to get state
  const getAllState = async (countryId: number | null) => {
    if (!countryId) return;
    const PostDataForState: State = {
      id: null,
      country_id: countryId,
      name: null,
      description: null,
      isactive: true,
    };
    try {
      const response = await axios.post(POST_API.GET_STATE, PostDataForState, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === STATUS_CODE.OK) {
        setStateData(response.data);
      } else {
        throw new Error("Failed to fetch states");
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithParamsNotEvent: getAllState,
        });
        if (refreshTokenStatus) {
          getAllState(countryId);
        }
      }
    }
  };

  //Note : function to get district
  const getAllDistrict = async (stateId: number | null) => {
    if (!stateId) return;
    const PostDataForDistrict: District = {
      id: null,
      state_id: stateId,
      name: null,
      description: null,
      isactive: true,
    };

    try {
      const response = await axios.post(
        POST_API.GET_DISTRICT,
        PostDataForDistrict,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === STATUS_CODE.OK) {
        setDistrict(response.data);
      }
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithParamsNotEvent: getAllDistrict,
        });
        if (refreshTokenStatus) {
          getAllDistrict(stateId);
        }
      }
    }
  };

  const districtOptions = Array.isArray(district)
    ? district.map((val) => ({
        label: val.name,
        value: val.name,
        id: val.id,
      }))
    : [];

  const [stateOptions, setStateOptions] = useState<
    {
      label: string | null;
      value: string | null;
      id: number | null;
    }[]
  >([]);

  useEffect(() => {
    setStateOptions(() => {
      return stateData.map((state) => ({
        label: state.name,
        value: state.name,
        id: state.id,
      }));
    });
  }, [stateData]);

  // const stateOptions = Array.isArray(stateData)
  //   ? stateData.map((state) => ({
  //       label: state.name,
  //       value: state.name,
  //       id: state.id,
  //     }))
  //   : [];

  const countryOptions = Array.isArray(countries)
    ? countries.map((country) => ({
        label: country.name,
        value: country.name,
        id: country.id,
      }))
    : [];

  const industryOptions = Array.isArray(industryType)
    ? industryType.map((val) => ({
        label: val.name,
        value: val.name,
        id: val.id,
      }))
    : [];

  return (
    <div>
      <form>
        <div className="w-auto flex justify-between  bg-slate-200 px-1 mb-1  ">
          <span className="table-header-custom">Details</span>
          {showSaveLeadButton && (
            <button
              className={COLORS.ADD_BUTTON}
              onClick={handleSave}
            >
              
              <div className="flex items-center gap-0.5">
                <Save className="w-3 h-3 -mt-0.5"/>
                Save
              </div>
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2">
          <FormField
            maxLength={30}
            userHasAccessToUpdate={userHasAccessToUpdateLead}
            type="text"
            label="Job title"
            value={editLeadDetails.job_title}
            onChange={(e) => {
              // handleLeadDetailsValueChange(e)
              setShowSaveLeadButton(true);
              setEditLeadDetails({
                ...editLeadDetails,
                job_title: e.target.value,
              });
            }}
          />
          <FormField
            userHasAccessToUpdate={userHasAccessToUpdateLead}
            type="textarea"
            label="Address"
            value={editLeadDetails.address}
            onChange={(e) => {
              // handleLeadDetailsValueChange(e)
              setShowSaveLeadButton(true);
              setEditLeadDetails({
                ...editLeadDetails,
                address: e.target.value,
              });
            }}
          />
          <FormField
            userHasAccessToUpdate={userHasAccessToUpdateLead}
            type="select"
            label="Industry"
            handleGetDropdownData={() => {
              fetchIndustryType();
            }}
            selectOptions={industryOptions}
            // note chaged here
            // value={leadDetailsData.industry_type_id}
            value={editLeadDetails.industry_type}
            selectedId={industryTypeId}
            onChange={(e) => {
              setShowSaveLeadButton(true);
              setIndustryTypeId(e.target.value);
              setEditLeadDetails({
                ...editLeadDetails,
                industry_type_id: parseInt(e.target.value),
              });
            }}
          />

          <FormField
            maxLength={10}
            userHasAccessToUpdate={userHasAccessToUpdateLead}
            type="text"
            label="Add. Contact number"
            value={editLeadDetails.additional_contact_number}
            onChange={(e) => {
              setShowSaveLeadButton(true);
              setEditLeadDetails({
                ...editLeadDetails,
                additional_contact_number: e.target.value,
              });
            }}
          />

          <FormField
            userHasAccessToUpdate={userHasAccessToUpdateLead}
            type="select"
            label="Country"
            handleGetDropdownData={() => {
              getAllCountries();
            }}
            selectOptions={countryOptions}
            value={editLeadDetails.country_name}
            selectedId={countryid}
            onChange={(e) => {
              setShowSaveLeadButton(true);
              setCountryid(e.target.value);

              const selectedCountryId = parseInt(e.target.value);

              const selectedCountryName =
                countryOptions.find((option) => option.id === selectedCountryId)
                  ?.value || "";

              // check if changed or not
              const isCountryChanged =
                changedCountryId !== parseInt(e.target.value);

              const updatedDetails = {
                ...editLeadDetails,
                country_id: selectedCountryId,
                country_name: selectedCountryName,
              };

              if (isCountryChanged) {
                updatedDetails.state_id = 0;
                updatedDetails.state_name = "";
                updatedDetails.district_id = 0; // optional
                updatedDetails.district_name = ""; // optional
                setStateId("");
                setDistrictId("");
                setDistrict([]);
                setStateData([]);
              }

              setEditLeadDetails(updatedDetails);
            }}
          />
          {/* <p className="text-xs">Selected State: {stateOptions.find(opt => opt.value === leadDetailsData.state_id)?.label || 'None'}</p> */}
          <FormField
            userHasAccessToUpdate={userHasAccessToUpdateLead}
            type="text"
            maxLength={70}
            label="Industry Name"
            value={editLeadDetails.industry_name}
            onChange={(e) => {
              setShowSaveLeadButton(true);
              setEditLeadDetails({
                ...editLeadDetails,
                industry_name: e.target.value,
              });
            }}
          />
          <FormField
            userHasAccessToUpdate={userHasAccessToUpdateLead}
            type="select"
            label="State"
            handleGetDropdownData={() => {
              getAllState(editLeadDetails.country_id);
            }}
            selectOptions={stateOptions}
            value={editLeadDetails.state_name}
            selectedId={stateId}
            // value={leadDetailsData.state_id}
            onChange={(e) => {
              setShowSaveLeadButton(true);
              setStateId(e.target.value);

              const selectedStateId = parseInt(e.target.value);
              const selectedStateName =
                stateOptions.find(
                  (option) => option.id === parseInt(e.target.value)
                )?.value || "";

              const isStateChanged =
                changedStateId !== parseInt(e.target.value);

              const updatedDetails = {
                ...editLeadDetails,
                state_id: selectedStateId,
                state_name: selectedStateName,
              };

              if (isStateChanged) {
                updatedDetails.district_id = 0;
                updatedDetails.district_name = "";
                setDistrictId("");
                setDistrict([]);
              }
              setEditLeadDetails(updatedDetails);
            }}
          />

          <FormField
            userHasAccessToUpdate={userHasAccessToUpdateLead}
            type="text"
            label="Website"
            maxLength={100}
            value={editLeadDetails.website}
            onChange={(e) => {
              setShowSaveLeadButton(true);
              setLeadDetailsData({
                ...editLeadDetails,
                website: e.target.value,
              });
            }}
          />
          <FormField
            userHasAccessToUpdate={userHasAccessToUpdateLead}
            type="select"
            label="District"
            handleGetDropdownData={() => {
              getAllDistrict(editLeadDetails.state_id);
            }}
            selectOptions={districtOptions}
            selectedId={districtId}
            value={editLeadDetails.district_name}
            onChange={(e) => {
              setShowSaveLeadButton(true);
              setDistrictId(e.target.value);
              setLeadDetailsData({
                ...editLeadDetails,
                district_id: parseInt(e.target.value),
                district_name:
                  districtOptions.find(
                    (opt) => opt.id === parseInt(e.target.value)
                  )?.value || "",
              });
            }}
          />
        </div>
      </form>

      {/* <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      /> */}
    </div>
  );
};

type OptionType = {
  label: string | null;
  value: string | null;
  id: number | null;
};

type FormFieldProps = {
  label: string;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  type: "text" | "number" | "select" | "textarea";
  selectOptions?: OptionType[];
  selectedId?: string;
  handleGetDropdownData?: () => void | null;
  userHasAccessToUpdate: boolean;
  maxLength? : number
};

const FormField = ({
  label,
  value,
  onChange,
  type,
  selectOptions,
  selectedId,
  handleGetDropdownData,
  userHasAccessToUpdate,
  maxLength
}: FormFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => {
    setTimeout(() => setIsEditing(false), 100);
  };

  return (
    <div className="flex w-full  items-center border-b  ">
      <div className="input-label-custom w-[50%]">{label}</div>
      <div
        className="flex items-center w-[50%]   min-w-[150px]"
        onClick={() => {
          if (userHasAccessToUpdate) {
            setIsEditing(true);
            handleGetDropdownData!();
          } else {
            toast.error(
              MESSAGE.MODULE_ACCESS.LEAD_MODULE
                .UPDATE_LEAD_ACCESS_DENIED_message
            );
          }
        }}
      >
        {!isEditing ? (
          <span
            className="caption-custom cursor-pointer truncate whitespace-nowrap"
            title={
              // selectOptions
              //   ?.find((opt) => opt.value === value)
              //   ?.label?.toLocaleString() || value?.toLocaleString()
              value?.toLocaleString()
            }
          >
            {value ? (
              // selectOptions?.find((opt) => opt.value === value)?.label || (
              //     <span className="text-sm text-gray-500">
              //       Select {label.toLowerCase()}
              //     </span>
              //   )
              <span className="caption-custom">{value?.toLocaleString()}</span>
            ) : (
              <span className="caption-custom italic">Add here...</span>
            )}
          </span>
        ) : type === "select" ? (
          <select
            autoFocus
            value={selectedId}
            onBlur={handleBlur}
            onChange={onChange}
            className="caption-custom border border-gray-300 w-36 rounded p-1 focus:outline-none"
          >
            <option value=""> Select {label} </option>
            {selectOptions?.map((opt) => (
              <option key={opt.value} value={opt.id!}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            rows={3}
            cols={50}
            placeholder="enter text here"
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            autoFocus
            className="caption-custom border border-gray-300 rounded p-1 focus:outline-none"
          />
        ) : (
          <input
            autoFocus
            type={type}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            maxLength={maxLength}
            className="caption-custom border-none border-gray-300 focus:outline-none"
          />
        )}
      </div>
    </div>
  );
};
export default LeadDetails;
