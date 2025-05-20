import React, { useEffect, useRef, useState } from "react";
import { useLoggedInUserContext } from "../../context/user/LoggedInUserContext";
import Timezone from "../../@types/user-profile/Timezone";
import POST_API from "../../constants/PostApi";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiError from "../../@types/error/ApiError";
import { NUMBER_VALUES, STATUS_CODE } from "../../constants/AppConstants";
import RefreshToken from "../../config/validations/RefreshToken";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../constants/Routes";
import { DialogueBox } from "../dialogue-box/Dialogue";
import { useUserPreference } from "../../context/user/UserPreference";
import CustomTimezoneDropdown from "./custom-dropdown-timezonedata/CustomTimezoneDropdown";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../ui/MessageSnackbar";
import REGEX from "../../constants/Regex";

const UserPreference = () => {
  const navigate = useNavigate();

  const handleDialogueConfirm = () => {
    setIsDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };
  const [isDialogueOpen, setIsDialogueOpen] = React.useState<boolean>(false);
  const { loginStatus  , setLoginStatus} = useLoggedInUserContext();

  const [showTimeZoneData, setShowTimeZoneData] = React.useState(false);
  const [selectedTimeZoneData, setSelectedTimeZoneData] =
    React.useState<Timezone>({
      count: 0,
      id: 0,
      name: "",
      timezone: "",
      utc_offset: "",
    });
  const { userPreference, setUserPreference } = useUserPreference();

  const prevTimezoneId = useRef<number>(userPreference.timezoneId);

  const [selectedTimezoneId, setSelectedTimezoneId] = React.useState<number>(
    userPreference.timezoneId
  );

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

  const handleTimezonePreferenceChange = async () => {
    const postData = {
      company_id: loginStatus.companyId,
      id: userPreference.id,
      is_left_menu: userPreference.isLeftMenu,
      is_hamburger_menu_collapsed: userPreference.isHamburgerMenuCollapsed,
      rows_in_grid: userPreference.rowsInGrid,
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
        setUserPreference({
          ...userPreference,
          timezoneId: selectedTimezoneId,
          timezoneUTCOffset: selectedTimeZoneData.utc_offset,
          timezoneName: selectedTimeZoneData.name,
          timezone: selectedTimeZoneData.timezone,
        });
        setShowTimeZoneData(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: handleTimezonePreferenceChange,
        });
        if (refreshTokenStatus) {
          setIsDialogueOpen(false);
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
      }
    }
  };

  useEffect(() => {
    setSelectedTimezoneId(userPreference.timezoneId);
  }, [userPreference]);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      if (!emailRegex.test(value)) {
        errorMsg = "Invalid email format";
      }
    }

    if (name === "mobileNumber") {
      const mobileRegex = REGEX.MOBILE_NUMBER_NEW;
      if (!mobileRegex.test(value)) {
        errorMsg = "Mobile number must be 10 digits and start with 6–9";
      }
    }
  }

  setFormErrors((prev) => ({
    ...prev,
    [name]: errorMsg,
  }));

  const hasChanged =
    formData.fullName !== initialData.fullName ||
    formData.email !== initialData.email ||
    formData.mobileNumber !== initialData.mobileNumber;

  // Include current error for updated field
  const currentErrors = {
    ...formErrors,
    [name]: errorMsg,
  };

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

      if (response.status === STATUS_CODE.OK) {
        showMessageSnackbar({
          message: response.data.message,
          type: "success",
        });
        setLoginStatus({
          ...loginStatus,
          fullName : formData.fullName.trim(),
          mobileNumber: formData.mobileNumber.trim(),
        })
        
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunction: updateUserProfile,
        });

        // setIsDialogueOpen(!refreshTokenStatus);
        if (refreshTokenStatus) {
          setIsDialogueOpen(false);
        } else {
          setIsDialogueOpen(true);
        }
      } else if (error.status === STATUS_CODE.FORBIDDEN) {
        setIsDialogueOpen(true);
      }
    }
  };

  // code for getting timezone data

  const limitForGrid = userPreference.rowsInGrid;
  const [timezoneList, setTimezoneList] = useState<Timezone[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(userPreference.rowsInGrid);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalCount, setTotalCount] = useState<number | null>(null);

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
        setTotalCount(count); // Update total count on initial load
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

  // Initial load (now triggered by showing the dropdown)
  useEffect(() => {
    if (showTimeZoneData) {
      setOffset(0);
      setLimit(limitForGrid);
      setSearchText(""); // Clear search text when dropdown is shown
      setTotalCount(null);
      setHasMore(true);
      loadTimezones(0);
    } else {
      // Reset state when dropdown is closed
      setTimezoneList([]);
      setOffset(0);
      setLimit(limitForGrid);
      setSearchText("");
      setTotalCount(null);
      setHasMore(true);
    }
  }, [showTimeZoneData]);

  // Called when user types
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setOffset(0);
    setTotalCount(null);
    setLimit(limitForGrid); // Reset limit for new search
    setHasMore(true);
    loadTimezones(0, text, limitForGrid); // Initial search load with limit 25
  };

  const loadMore = () => {
    if (hasMore) {
      loadTimezones(offset, searchText, limit);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 py-8 px-2 space-y-10">
      {/* Profile Info Card */}

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Profile picture"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
          <div className="flex-1 space-y-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900">
              {formData.fullName}
            </h2>
            <p className="text-gray-600">{loginStatus.companyName || ""}</p>
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
              onClick={handleEditClick}
              disabled={isEditing && !isSaveEnabled}
            >
              {isEditing ? "Save" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Name</h4>
            {isEditing ? (
              <>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded"
                
                />
              {formErrors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                    {formErrors.fullName}
                  </p>
                )}
                </>
            ) : (
              <p className="text-gray-800">
                {formData.fullName || "Not Provided"}
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500">Email</h4>
            <p className="text-gray-800">{formData.email || "Not Provided"}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500">Company</h4>
            <p className="text-gray-800">{loginStatus.companyName}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500">
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
              <p className="text-gray-800">
                {formData.mobileNumber || "Not Provided"}
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500">
              Profile Status
            </h4>
            <p className="text-gray-800">
              {loginStatus.status === true ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>
      {/* PREFERENCE CARD */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-800">Preferences</h3>
          <button
            onClick={() => {
              // Save the selected timezone ID to the user's profile data

              if (prevTimezoneId.current !== selectedTimezoneId) {
                handleTimezonePreferenceChange();
                prevTimezoneId.current = selectedTimezoneId;
              } else {
                setShowTimeZoneData(true);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {showTimeZoneData ? "Save" : "Change"}
          </button>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-500">Time Zone</h4>
          {showTimeZoneData ? (
            <CustomTimezoneDropdown
              setShowTimeZoneData={setShowTimeZoneData}
              timezoneData={timezoneList}
              hasMore={hasMore}
              loadMore={loadMore}
              onSearchChange={handleSearchChange}
              onSelect={(zone) => {
                setSelectedTimeZoneData(zone);
                setSelectedTimezoneId(zone.id); // Update the selected timezone ID
                // setShowTimeZoneData(false); // Close the dropdown after selection (optional)
              }}
            />
          ) : (
            <p
              onClick={() => {
                setShowTimeZoneData(!showTimeZoneData);
              }}
              className="text-gray-800"
            >
              {userPreference.timezone}
            </p>
          )}
        </div>
      </div>
      {/* Subscription Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-800">Subscription</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Started On</h4>
            <p className="text-gray-800">
              {loginStatus.startDateSubscription || "-"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Ending On</h4>
            <p className="text-gray-800">
              {loginStatus.endDateSubscription || "Not Provided"}
            </p>
          </div>
        </div>
      </div>
      <DialogueBox
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        onConfirm={handleDialogueConfirm}
        title="Session Expired !"
        message="Session Expired. Please login again."
      />
      {/* Snackbar */}
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

export default UserPreference;
