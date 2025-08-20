/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import Timezone from "../../@types/user-profile/Timezone";
import POST_API from "../../constants/PostApi";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../@types/error/ApiError";
import { STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../../config/validations/RefreshToken";
import { useUserPreference } from "../../context/user/UserPreference";
import CustomTimezoneDropdown from "./custom-dropdown-timezonedata/CustomTimezoneDropdown";

import REGEX from "../../constants/Regex";
import { useMasterRowsInGrid } from "../../config/hooks/useMasterRowsInGrid";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import { alphabets, backgroundColors } from "../../constants/Colors";
import toast from "react-hot-toast";
import { useUserAccessModules } from "../../config/hooks/useAccessModules";
import MESSAGE from "../../constants/Messages";

const UserPreference = () => {
  const classnameForParagragh = "text-gray-800 font-semibold   block truncate w-full";
  const { userPreference, setUserPreference } = useUserPreference();
  const { loginStatus, setLoginStatus } = useLoggedInUserContext();
  const { rowsInGridDropdownOptions } = useMasterRowsInGrid();

  const navigate = useNavigate();
  const { userHasAccessToUpdateUser, userHasAccessToUpdateSettingGeneral , userHasAccessToViewSettingGeneral } =
    useUserAccessModules();

  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState<number>(
    userPreference.rowsInGrid
  );
  const [showTimeZoneData, setShowTimeZoneData] = React.useState(false);
  const [selectedTimeZoneData, setSelectedTimeZoneData] =
    React.useState<Timezone>({
      count: 0,
      id: 0,
      name: "",
      timezone: "",
      utc_offset: "",
    });

  // NOTE : CODE FOR EDIT USER PROFILE

  const [formData, setFormData] = useState({
    fullName: loginStatus.fullName || "",
    email: loginStatus.email || "",
    mobileNumber: loginStatus.mobileNumber || "",
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [initialData, setInitialData] = useState(formData);
  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    mobileNumber?: string;
    email?: string;
  }>({});
  const prevTimezoneId = useRef<number>(userPreference.timezoneId);

  const [selectedTimezoneId, setSelectedTimezoneId] = React.useState<number>(
    userPreference.timezoneId
  );

  //note : Message Snackbar
  // const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
  //   open: false,
  //   message: "",
  //   type: "success" as "success" | "error",
  // });

  // const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
  //   setMessageSnackbar({ open: true, message, type });
  // };

  // const handleCloseSnackbar = () => {
  //   setMessageSnackbar((prev) => ({ ...prev, open: false }));
  // };

  // timezone states
  const limitForGrid = userPreference.rowsInGrid;
  const [timezoneList, setTimezoneList] = useState<Timezone[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(userPreference.rowsInGrid);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState("");
  // const [totalCount, setTotalCount] = useState<number | null>(null);

  const handleTimezonePreferenceChange = async () => {
    //getting the id as per value
    const selectedMasterRowInGrid = rowsInGridDropdownOptions.find(
      (option) => parseInt(option.rowsInGrid) === selectedRowsPerPage
    );

    const postData = {
      company_id: loginStatus.companyId,
      id: userPreference.id,
      is_left_menu: userPreference.isLeftMenu,
      is_hamburger_menu_collapsed: userPreference.isHamburgerMenuCollapsed,
      master_rows_in_grid_id: selectedMasterRowInGrid?.id,
      timezone_id: selectedTimezoneId,
      updatedby: loginStatus.id,
    };

    try {
      const response = await axios.post(
        POST_API.UPDATE_COMPANY_USER_PREFERENCE,
        postData,
        {
          withCredentials: true,
        }
      );

      if (response.status === STATUS_CODE.OK) {
        if (response.data.status) {
          // showMessageSnackbar({
          //   message: response.data.message,
          //   type: "success",
          // });
          toast.success(response.data.message);

          setUserPreference({
            ...userPreference,
            timezoneId: selectedTimezoneId,
            timezoneUTCOffset:
              selectedTimeZoneData.utc_offset === ""
                ? userPreference.timezoneUTCOffset
                : selectedTimeZoneData.utc_offset,
            timezoneName:
              selectedTimeZoneData.name === ""
                ? userPreference.timezoneName
                : selectedTimeZoneData.name,
            timezone:
              selectedTimeZoneData.timezone === ""
                ? userPreference.timezone
                : selectedTimeZoneData.timezone,
            rowsInGrid: parseInt(selectedMasterRowInGrid!.rowsInGrid),
          });
          setShowTimeZoneData(false);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: handleTimezonePreferenceChange,
        });
        if (refreshTokenStatus) {
          handleTimezonePreferenceChange();
        }
      }
    }
  };

  useEffect(() => {
    setSelectedTimezoneId(userPreference.timezoneId);
  }, [userPreference]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const hasChanged =
      updatedForm.fullName !== initialData.fullName ||
      updatedForm.email !== initialData.email ||
      updatedForm.mobileNumber !== initialData.mobileNumber;

    const hasErrors = Object.values(formErrors).some((e) => e !== "");

    setIsSaveEnabled(hasChanged && !hasErrors);
  };

  const handleEditClick = async () => {
    if (isEditing) {
      if (isSaveEnabled) {
        await updateUserProfile();
        setInitialData(formData);
        setIsSaveEnabled(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let errorMsg = "";

    // Check empty input for all fields
    if (!value.trim()) {
      errorMsg = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else {
      if (name === "email") {
        const emailRegex = REGEX.EMAIL;
        if (!emailRegex.test(value.trim())) {
          errorMsg = "Invalid email format";
        }
      }

      if (name === "mobileNumber") {
        const mobileRegex = REGEX.MOBILE_NUMBER_NEW;
        if (!mobileRegex.test(value.trim())) {
          errorMsg = "Mobile number must be 10 digits and start with 6–9";
        }
      }
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));

    const hasChanged =
      formData.fullName.trim() !== initialData.fullName ||
      formData.email !== initialData.email ||
      formData.mobileNumber.trim() !== initialData.mobileNumber;

    // Include current error for updated field
    const currentErrors = {
      ...formErrors,
      [name]: errorMsg,
    };
    if (!hasChanged) {
      toast.error("No new changes to save.");
    }
    const hasErrors = Object.values(currentErrors).some((e) => e !== "");

    setIsSaveEnabled(hasChanged && !hasErrors);
  };

  const updateUserProfile = async () => {
    try {
      const postData = {
        company_id: loginStatus.companyId,
        id: loginStatus.id,
        fullname: formData.fullName.trim(),
        mobilenumber: formData.mobileNumber.trim(),
        isactive: loginStatus.status,
        updatedby: loginStatus.id,
      };

      const response = await axios.put(POST_API.UPDATE_COMPANY_USER, postData, {
        withCredentials: true,
      });
      const res = response.data;
      if (response.status === STATUS_CODE.OK) {
        // showMessageSnackbar({
        //   message: response.data.message,
        //   type: "success",
        // });
        if (res.status) {
          toast.success(response.data.message);
          setLoginStatus({
            ...loginStatus,
            fullName: formData.fullName.trim(),
            mobileNumber: formData.mobileNumber.trim(),
          });
        } else {
          formData.fullName = loginStatus.fullName!;
          formData.mobileNumber = loginStatus.mobileNumber;

          toast.error(res.message);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: updateUserProfile,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          updateUserProfile();
        }
      }
    }
  };

  // code for getting timezone data

  const loadTimezones = async (
    newOffset: number,
    searchTextToUse = "",
    customLimit?: number
  ) => {
    const effectiveLimit = customLimit !== undefined ? customLimit : limit;

    const postData = {
      search_company_specific_date_range_id: null,
      search_parameter: searchTextToUse || null,
      search_parameter_date: null,
      offset: newOffset,
      limit: effectiveLimit,
    };

    try {
      const response = await axios.post(POST_API.GET_TIMEZONE, postData, {
        withCredentials: true,
      });

      const newTimezones: Timezone[] = response.data || [];
      const count: number = response.data[0].count;

      if (newOffset === 0) {
        setTimezoneList(newTimezones);
        // setTotalCount(count); // Update total count on initial load
        if (searchTextToUse) {
          setLimit(limitForGrid); // If searching, set limit to total count initially
        } else {
          setLimit(limitForGrid); // If not searching, keep default limit for initial load
        }
      } else {
        setTimezoneList((prev) => [...prev, ...newTimezones]);
      }

      const nextOffset = newOffset + effectiveLimit;
      setOffset(nextOffset);

      if (searchTextToUse) {
        setHasMore(nextOffset < count);
      } else {
        setHasMore(newTimezones.length === effectiveLimit);
      }
    } catch (err) {
      console.error("Error fetching timezones:", err);
    }
  };

  const handleSelectRowInGridOptionChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptionValue = parseInt(event.target.value, 10);

    if (!isNaN(selectedOptionValue)) {
      setSelectedRowsPerPage(selectedOptionValue);
    }
  };
  // Initial load (now triggered by showing the dropdown)
  useEffect(() => {
    if (showTimeZoneData) {
      setOffset(0);
      setLimit(limitForGrid);
      setSearchText(""); // Clear search text when dropdown is shown
      // setTotalCount(null);
      setHasMore(true);
      loadTimezones(0);
    } else {
      // Reset state when dropdown is closed
      setTimezoneList([]);
      setOffset(0);
      setLimit(limitForGrid);
      setSearchText("");
      // setTotalCount(null);
      setHasMore(true);
    }
  }, [showTimeZoneData]);

  // Called when user types
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setOffset(0);
    // setTotalCount(null);
    setLimit(limitForGrid); // Reset limit for new search
    setHasMore(true);
    loadTimezones(0, text, limitForGrid); // Initial search load with limit 25
  };

  const loadMore = () => {
    if (hasMore) {
      loadTimezones(offset, searchText, limit);
    }
  };

  const getColor = (email: string) => {
    if (!email) return backgroundColors[0];
    const emailChar = email.charAt(0);
    const index = alphabets.indexOf(emailChar.toLowerCase());
    return backgroundColors[index];
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 py-8 px-2 space-y-10">
      {/* Profile Info Card */}

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div
            className={`w-32 h-32 rounded-full grid place-content-center text-white text-8xl font-semibold pb-3 border-2 border-gray-300 ${getColor(
              loginStatus.email
            )}`}
          >
            {loginStatus.fullName ? loginStatus.fullName.charAt(0) : ""}
          </div>
          <div className="flex-1 space-y-1 text-center md:text-left">
            <h2  title={formData.fullName ?? "Not Provided"} className="text-3xl font-bold text-gray-900 block truncate w-full  ">
              {loginStatus.fullName}
            </h2>
            <p  className="text-gray-600">{loginStatus.companyName || ""}</p>
            <button
              className={`mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition
                  ${
                    isEditing
                      ? isSaveEnabled
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }}
                `}
              onClick={() => {
                if (userHasAccessToUpdateUser) {
                  handleEditClick();
                } else {
                  toast.error(
                    "you do not have access to update user information."
                  );
                }
              }}
              disabled={isEditing && !isSaveEnabled}
            >
              {isEditing ? "Save" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="">
            <h4 className="text-sm font-semibold text-gray-700">Name</h4>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={40}
                  minLength={3}
                  className="w-full p-2 border rounded"
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.fullName}
                  </p>
                )}
              </>
            ) : (
              <p title={formData.fullName ?? "Not Provided"} className="text-gray-800 font-semibold block truncate w-full ">
                {formData.fullName || "Not Provided"}
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700">Email</h4>
            <p className={classnameForParagragh}>
              {formData.email || "Not Provided"}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700">Company</h4>
            <p className={classnameForParagragh}>{loginStatus.companyName}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700">
              Contact Number
            </h4>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border rounded"
                />
                {formErrors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.mobileNumber}
                  </p>
                )}
              </>
            ) : (
              <p className={classnameForParagragh}>
                {formData.mobileNumber || "Not Provided"}
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700">
              Profile Status
            </h4>
            <p className={classnameForParagragh}>
              {loginStatus.status === true ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>
      {/* PREFERENCE CARD */}
      <div  className={` ${!userHasAccessToViewSettingGeneral ? "hidden" : ""} max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-4`}>
        {/* button */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-800">
            Preferences <span className="text-sm">(Click to change)</span>
          </h3>
          {(prevTimezoneId.current !== selectedTimezoneId ||
            userPreference.rowsInGrid != selectedRowsPerPage) && (
            <button
              onClick={() => {
                if(userHasAccessToUpdateSettingGeneral){

                  if (prevTimezoneId.current !== selectedTimezoneId) {
                    handleTimezonePreferenceChange();
                    prevTimezoneId.current = selectedTimezoneId;
                  } else if (userPreference.rowsInGrid !== selectedRowsPerPage) {
                    handleTimezonePreferenceChange();
                  }
                }else{
                  toast.error(MESSAGE.MODULE_ACCESS.GENERAL_SETTING.DENIED_UPDATE_ACCESS)
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Save
            </button>
          )}
        </div>
        {/* time zone */}
        <div className="flex items-center space-x-4 border-b pb-1">
          {/* Label for the Time Zone setting */}
          <h4 className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Time Zone:
          </h4>

          {/* Conditional rendering for either the display text or the dropdown */}
          {showTimeZoneData ? (
            // When the dropdown should be visible (showTimeZoneData is true)
            <div className="relative z-10 w-auto">
              {" "}
              {/* Add relative and z-index for dropdown positioning */}
              <CustomTimezoneDropdown
                setShowTimeZoneData={setShowTimeZoneData}
                timezoneData={timezoneList}
                hasMore={hasMore}
                loadMore={loadMore}
                onSearchChange={handleSearchChange}
                onSelect={(zone) => {
                  setSelectedTimeZoneData(zone);
                  setSelectedTimezoneId(zone.id);
                  // setShowTimeZoneData(false); // Often desirable to close after selection
                }}
              />
            </div>
          ) : (
            // When the display text should be visible (showTimeZoneData is false)
            <p
              onClick={() => {
                if (userHasAccessToUpdateSettingGeneral) {
                  setShowTimeZoneData(!showTimeZoneData); // Toggle to show the dropdown
                } else {
                  toast.error(
                    MESSAGE.MODULE_ACCESS.GENERAL_SETTING.DENIED_UPDATE_ACCESS
                  );
                }
              }}
              className="text-sm  font-semibold text-blue-600 cursor-pointer hover:text-blue-700
                 rounded-md py-1.5 px-3  // Adds padding to match select height
                 focus:outline-none focus:ring-2 focus:ring-indigo-500" // Focus styles for clickability
              tabIndex={0} // Makes the paragraph focusable for keyboard navigation
              role="button" // Indicates it's a clickable element
              aria-label="Click to change time zone"
            >
              {userPreference.timezone}
            </p>
          )}
        </div>
        {/* rows in grid  */}
        <div className="flex items-center space-x-4">
          {/* Label for accessibility and clear identification */}
          <label
            htmlFor="records-per-page-select"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            Records per page:
          </label>

          {/* Display current preference, visually distinct */}
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-500">Current:</span>
            <span className="text-sm font-semibold text-blue-600">
              {userPreference.rowsInGrid}
            </span>
          </div>

          {/* The styled select dropdown */}
          <select
            // disabled={!userHasAccessToUpdateSettingGeneral}
            onClick={() => {
              if (!userHasAccessToUpdateSettingGeneral) {
                toast.error(
                  MESSAGE.MODULE_ACCESS.GENERAL_SETTING.DENIED_UPDATE_ACCESS
                );
                return;
              }
            }}
            onChange={(e) => {
              if (userHasAccessToUpdateSettingGeneral) {
                handleSelectRowInGridOptionChange(e);
              }
            }}
            value={selectedRowsPerPage}
            id="records-per-page-select" // Link with label's htmlFor
            className="block w-auto rounded-md border-gray-300 shadow-sm
               focus:border-indigo-500 focus:ring-indigo-500
               sm:text-sm  pl-3 pr-8 // Added padding for better appearance
               text-gray-900" // Default text color
            aria-label="Select number of records per page" // Good for accessibility
            // You'd add value={selectedValue} and onChange={handleChange} props here in your React component
          >
            <option value="">Select</option>
            {rowsInGridDropdownOptions &&
              rowsInGridDropdownOptions.map((data) => (
                <option key={data.id} value={data.rowsInGrid}>
                  {data.rowsInGrid}
                </option>
              ))}
          </select>
        </div>
      </div>
      {/* Subscription Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-800">Subscription</h3>
          <button
            onClick={() => {
              navigate(ROUTES_URL.GET_SUBSCRIPTION);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Update Subscription
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Started On</h4>
            <p className={classnameForParagragh}>
              {loginStatus.startDateSubscription || "-"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Ending On</h4>
            <p className={classnameForParagragh}>
              {loginStatus.endDateSubscription || "Not Provided"}
            </p>
          </div>
        </div>
      </div>
      {/* Snackbar */}
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

export default UserPreference;
