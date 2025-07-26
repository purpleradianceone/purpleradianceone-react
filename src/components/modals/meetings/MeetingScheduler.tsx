/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FormInput from "../../ui/FormInput";
import DatePickerInput from "../../ui/DatePickerInput";
import TextAreaInput from "../../ui/TextAreaInput";
import Button from "../../ui/Button";
import { Contact2, Plus, UserPlus, Users, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import qs from "query-string";
import ROUTES_URL from "../../../constants/Routes";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import AddCompanyUsersEmailAttendeesModal from "./AddCompanyUsersEmailAttendeesModal";
import CompanyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import { useGoogleMeetContext } from "../../../context/meeting/GoogleMeetContext";
import { NUMBER_VALUES, STATUS_CODE } from "../../../constants/AppConstants";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useZoomMeetingContext } from "../../../context/meeting/ZoomMeetingContext";
import { useServerCurrentTime } from "../../../config/hooks/useServerCurrentTime";
import { useUserPreference } from "../../../context/user/UserPreference";
import momentTimezone from "moment-timezone";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../ui/MessageSnackbar";
import { useMeetingPlatform } from "../../../config/hooks/useMeetingPlatforms";
import CompanyLeadContactsSelectionAgGrid from "../../ag-grid/CompanyLeadContactsSelectionAgGrid";
import LeadContactType from "../../../@types/lead-management/LeadContact";
import Lead from "../../../@types/lead-management/LeadManagementProps";
import { useGoogleMeetStatus } from "../../../config/hooks/useGoogleMeetStatus";
import { useZoomMeetingsStatus } from "../../../config/hooks/useZoomMeetingsStatus";

const MeetingScheduler = () => {
  const [title, setTitle] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  // const [timeZone, setTimeZone] = useState<string>("");
  // const [duration, setDuration] = useState<number>(60); // in minutes
  const [attendees, setAttendees] = useState<string[]>([]);
  const [newAttendeeEmail, setNewAttendeeEmail] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false); // Simulate meeting creation
  const [selectedMeetingPlatform, setSelectedMeetingPlatform] =
    useState<string>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useGoogleMeetStatus();
  useZoomMeetingsStatus();

  const { userPreference } = useUserPreference();
  const { meetingPlatform } = useMeetingPlatform();

  const { loginStatus } = useLoggedInUserContext();

  const [searchParams] = useSearchParams();

  const { currentTime } = useServerCurrentTime();
  const [serverCurrentTime, setServerCurrentTime] = useState<Date>();
  const [
    isAddCompanyLeadContactModalOpen,
    setIsAddCompanyLeadContactModalOpen,
  ] = useState<boolean>(false);

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
    setServerCurrentTime(new Date(currentTime.replace(" ", "T")));
  }, [currentTime]);

  const [
    isAddCompanyUserEmailAttedeesModalOpen,
    setIsAddCompanyUserEmailAttedeesModalOpen,
  ] = useState<boolean>(false);
  const [selectedCompanyUsersIdArray, setSelectedCompanyUsersIdArray] =
    useState<number[]>([loginStatus.id]);
  const [selectedCompanyUserDetailArray, setSelectedCompanyUserDetailArray] =
    useState<{ email: string; id: number }[]>([]);
  const [isModalForLead, setIsModalForLead] = useState<boolean>(false);

  const [addCompanyLeadContactIdArray, setAddCompanyLeadContactIdArray] =
    useState<number[]>([]);

  const navigate = useNavigate();
  const { googleMeetStatus } = useGoogleMeetContext();
  const { zoomMeetingStatus } = useZoomMeetingContext();

  const [leadData, setLeadData] = useState<Lead>();

  const handleGoogleMeetAuth = () => {
    navigate(ROUTES_URL.GOOGLE_OAUTH);
  };

  useEffect(() => {
    const openedFrom = searchParams.get("from");
    if (!openedFrom) {
      setIsModalForLead(true);
      const data = sessionStorage.getItem("leadData");
      if (data) {
        const leadSearchParam = JSON.parse(data);
        setLeadData(leadSearchParam);
      }
    }
  }, [searchParams]);
  const createGoogleMeetMeeting = async () => {

    if(isCreating){
      return;
    }
    const combinedPickerStartDateTimeString = `${startDate} ${startTime}`;
    const combinedPickerEndDateTimeString = `${endDate} ${endTime}`;
    const pickerFormatString = "yyyy-MM-DD HH:mm";

    const startDateTIme = momentTimezone.tz(
      combinedPickerStartDateTimeString,
      pickerFormatString,
      userPreference.timezoneName
    );
    const endDateTime = momentTimezone.tz(
      combinedPickerEndDateTimeString,
      pickerFormatString,
      userPreference.timezoneName
    );


    if (title === "") {
      showMessageSnackbar({
        message: "Please give title to meeting",
        type: "error",
      });
      setIsCreating(false);
      return;
    } else if (startDate === "") {
      showMessageSnackbar({
        message: "Please select start date",
        type: "error",
      });
      setIsCreating(false);
      return;
    } else if (startTime === "") {
      showMessageSnackbar({
        message: "Please select start time",
        type: "error",
      });
      setIsCreating(false);
      return;
    } else if (endDate === "") {
      showMessageSnackbar({ message: "Please select end date", type: "error" });
      setIsCreating(false);
      return;
    } else if (endTime === "") {
      showMessageSnackbar({ message: "Please select end time", type: "error" });
      setIsCreating(false);
      return;
    } else if (selectedMeetingPlatform === "") {
      showMessageSnackbar({
        message: "Please select meeting platform",
        type: "error",
      });
      setIsCreating(false);
      return;
    } else if (endDateTime.toDate() < startDateTIme.toDate()) {
      showMessageSnackbar({
        message: "End Time should be greater than start time",
        type: "error",
      });
      setIsCreating(false);
      return;
    } else if (serverCurrentTime! > startDateTIme.toDate()) {
      
      showMessageSnackbar({
        message: "Connot create meeting as start time is in the past",
        type: "error",
      });
      setIsCreating(false);
      return;
    }

    if (
      title !== "" &&
      startDate !== "" &&
      endDate !== "" &&
      startTime !== "" &&
      endTime !== "" &&
      selectedMeetingPlatform === meetingPlatform[0].name
    ) {
      setIsCreating(true);

      const postDataCreateGoogleMeetMeeting = {
        company_id: loginStatus.companyId,
        summary_title: title,
        description: description,
        start_date_string: startDate + "T" + startTime + ":00",
        end_date_string: endDate + "T" + endTime + ":00",
        time_zone: userPreference.timezoneName,
        attendees_email_all: attendees,
        attendees_company_user_id: selectedCompanyUsersIdArray,
        company_user_id: loginStatus.id,
        is_meeting_created_from_lead: isModalForLead ? true : false,
        lead_id: isModalForLead ? leadData?.id : null,
        createdby: loginStatus.id,
      };
      axios
        .post(POST_API.CREATE_GOOGLE_MEETING, postDataCreateGoogleMeetMeeting, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
           setTitle("");
          setEndTime("");
          setStartTime("");
          // setTimeZone("");
          setAttendees([]);
          setDescription("");
          setIsCreating(false);
          setStartDate("");
          setEndDate("");
          setSelectedMeetingPlatform("");
          if(response.data.status){
              showMessageSnackbar({message : response.data.message,type : "success"});
              setTimeout(() => {
                handleCloseMeetingModal();
              },2000)
          
          }
          else{
            showMessageSnackbar({message : response.data.message,type : "error"});
          setTimeout(() => {
                handleCloseMeetingModal();
              },2000)
          }
          
          }

          
        })
        .catch(async(error) => {
          if(error.status === STATUS_CODE.UNATHORISED){
            const refreshTokenResponse = await RefreshToken({callFunction:createGoogleMeetMeeting});
            if(refreshTokenResponse){
              createGoogleMeetMeeting();
            }
          }
          else if (error.status === STATUS_CODE.PERMANENT_REDIRECT) {
            handleGoogleMeetAuth();
          }
        })
        .finally(() => {
          setIsCreating(false);
        });
    } else {
      showMessageSnackbar({
        message: "Please fill the required fields",
        type: "error",
      });
    }
  };
  const createZoomMeeting = async () => {

    if(isCreating){
      return;
    }
    const combinedPickerStartDateTimeString = `${startDate} ${startTime}`;
    const combinedPickerEndDateTimeString = `${endDate} ${endTime}`;
    const pickerFormatString = "yyyy-MM-DD HH:mm";

    const startDateTIme = momentTimezone.tz(
      combinedPickerStartDateTimeString,
      pickerFormatString,
      userPreference.timezoneName
    );
    const endDateTime = momentTimezone.tz(
      combinedPickerEndDateTimeString,
      pickerFormatString,
      userPreference.timezoneName
    );
    if (title === "") {
      showMessageSnackbar({
        message: "Please give title to meeting",
        type: "error",
      });
      setIsCreating(false);
      return;
    } else if (startDate === "") {
      showMessageSnackbar({
        message: "Please select start date",
        type: "error",
      });
      setIsCreating(false);
      return;
    } else if (startTime === "") {
      showMessageSnackbar({
        message: "Please select start time",
        type: "error",
      });
      setIsCreating(false);
      return;
    } else if (endDate === "") {
      showMessageSnackbar({ message: "Please select end date", type: "error" });
      setIsCreating(false);
      return;
    } else if (endTime === "") {
      showMessageSnackbar({ message: "Please select end time", type: "error" });
      setIsCreating(false);
      return;
    } else if (selectedMeetingPlatform === "") {
      showMessageSnackbar({
        message: "Please select meeting platform",
        type: "error",
      });
      setIsCreating(false);
      return;
    } else if (endDateTime.toDate() < startDateTIme.toDate()) {
      showMessageSnackbar({
        message: "End Time should be greater than start time",
        type: "error",
      });
      setIsCreating(false);
      return;
    } else if (serverCurrentTime! > startDateTIme.toDate()) {
      
      showMessageSnackbar({
        message: "Connot create meeting as start time is in the past",
        type: "error",
      });
      setIsCreating(false);
      return;
    }

    if (
      title !== "" &&
      startDate !== "" &&
      endDate !== "" &&
      startTime !== "" &&
      endTime !== "" &&
      selectedMeetingPlatform === meetingPlatform[1].name
    ) {
      setIsCreating(true);
      const createZoomMeetingPostData = {
        company_id: loginStatus.companyId,
        summary_title: title,
        description: description,
        start_date_string: startDate + "T" + startTime + ":00",
        end_date_string: endDate + "T" + endTime + ":00",
        time_zone: userPreference.timezoneName,
        attendees_email_all: attendees,
        attendees_company_user_id: selectedCompanyUsersIdArray,
        company_user_id: loginStatus.id,
        is_meeting_created_from_lead: isModalForLead ? true : false,
        lead_id: isModalForLead ? leadData?.id : null,
        createdby: loginStatus.id,
      };
      await axios
        .post(POST_API.CREATE_ZOOM_MEETING, createZoomMeetingPostData, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            if (response.data.status) {
              showMessageSnackbar({
                message: response.data.message,
                type: "success",
              });
            } else {
              showMessageSnackbar({
                message: response.data.message,
                type: "error",
              });
            }
          }

          setTitle("");
          setEndTime("");
          setStartTime("");
          // setTimeZone("");
          setAttendees([]);
          setDescription("");
          setIsCreating(false);
          setStartDate("");
          setEndDate("");
          setSelectedMeetingPlatform("");
          handleCloseMeetingModal();
        })
        .catch(async (error: ApiError | any) => {
          if (error.status === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunction: createZoomMeeting,
            });
            if (refreshTokenResponse) {
              createZoomMeeting();
            }
          } else if (error.status === STATUS_CODE.PERMANENT_REDIRECT) {
            handleZoomMeetingsOAuth();
          }
        })
        .finally(() => {
          setIsCreating(false);
        });
    }
  };

  const isEmailIsOfCompanyUser = async (email: string) => {
    const getCompanyUserPostData = {
      company_id: loginStatus.companyId,
      id: null,
      requestedby: loginStatus.id,
      limit: null,
      offset: null,
      search_company_specific_date_range_id: null,
      search_parameter: email,
      search_parameter_date: null,
    };
    try {
      const response = await axios.post(
        POST_API.GET_COMPANY_USERS,
        getCompanyUserPostData,
        {
          withCredentials: true,
        }
      );

      if (response.status === STATUS_CODE.OK) {
        if (response.data.length === 0) {
          return 0;
        }

        setSelectedCompanyUserDetailArray((prev) => [
          ...prev,
          {
            id: response.data[0].id,
            email: response.data[0].email,
          },
        ]);

        return response.data[0].id;
      }
    } catch (error: ApiError | any) {
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithParamsNotEvent: isEmailIsOfCompanyUser,
        });
        if (refreshTokenStatus) {
          isEmailIsOfCompanyUser(email);
        }
      }
    }
  };

  const handleAddAttendee = async () => {
    if (
      newAttendeeEmail.trim() &&
      !attendees.find((a) => a === newAttendeeEmail.trim())
    ) {
      const id = await isEmailIsOfCompanyUser(newAttendeeEmail.trim());
      if (id !== 0) {
        setSelectedCompanyUsersIdArray((prev) => [...prev, id]);
        setAttendees([...attendees, newAttendeeEmail.trim()]);
        setNewAttendeeEmail("");
        return;
      } else {
        setAttendees([...attendees, newAttendeeEmail.trim()]);
        setNewAttendeeEmail("");
        return;
      }
    }
  };

  const handleRemoveAttendee = (email: string, id: number) => {
    setAttendees(attendees.filter((attendee) => attendee !== email));
    setSelectedCompanyUsersIdArray((prev) =>
      prev.filter((userId) => userId !== id)
    );
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const handleZoomMeetingsOAuth = () => {
    navigate(ROUTES_URL.ZOOM_OAUTH);
  };

  const timeOptions = generateTimeOptions();

  const handleAddCompanyUserEmailCheckboxChange = (
    params: CompanyUsersSearchProps,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setSelectedCompanyUsersIdArray((prev) => [...prev, params.id]);
      setAttendees((prev) => [...prev, params.email]);
      setSelectedCompanyUserDetailArray((prev) => [
        ...prev,
        {
          email: params.email,
          id: params.id,
        },
      ]);
    } else if (!event.target.checked) {
      setSelectedCompanyUsersIdArray((prev) =>
        prev.filter((id) => id !== params.id)
      );
      setAttendees((prev) => prev.filter((email) => email !== params.email));
      setSelectedCompanyUserDetailArray((prev) =>
        prev.filter((user) => user.id !== params.id)
      );
    }
  };

  const handleCompanyLeadContactCheckBoxChange = (
    data: LeadContactType,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked && data.email) {
      setAddCompanyLeadContactIdArray((prev) => [...prev, data.id]);
      setAttendees((prev) => [...prev, data.email]);
    } else if (event.target.checked && !data.email) {
      showMessageSnackbar({
        message: "please add email for contact and then try again",
        type: "error",
      });
    } else if (!event.target.checked && data.email) {
      setAddCompanyLeadContactIdArray((prev) =>
        prev.filter((id) => id !== data.id)
      );
      setAttendees((prev) => prev.filter((email) => email !== data.email));
    }
  };

  const handleCloseMeetingModal = () => {
    const openedFrom = searchParams.get("from");
    if (openedFrom) {
      navigate(openedFrom);
      setIsModalForLead(false);
    } else {
      const leadData = sessionStorage.getItem("leadData");
      const newQueryString = qs.stringify({
        leadData: leadData,
      });
      setIsModalForLead(false);
      const newPath = `${ROUTES_URL.LEAD_DETAILS}?${newQueryString}`;
      sessionStorage.removeItem("leadData");
      navigate(newPath);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50  overflow-y-auto">
      <div className="max-w-4xl mt-1 w-full p-4 bg-white rounded-lg shadow-xl overflow-y-auto">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold mb-3 text-gray-800">
            Schedule Meeting
          </h1>
          <div className="flex self-start">
            <button
              onClick={() => {
                handleCloseMeetingModal();
              }}
            >
              <X className="text-gray-500 hover:text-gray-700" size={20}></X>
            </button>
          </div>
        </div>
        <div className="mb-1 grid grid-cols-3 gap-1">
          <div className="col-span-2">
            <FormInput
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting Title"
              className="mt-1"
              label="Title"
            />
          </div>
          <div className="mt-1 col-span-1">
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700"
            >
              Meeting Platform
            </label>
            <select
              id="startTtime"
              value={selectedMeetingPlatform}
              onChange={(e) => {
                if (e.target.value === meetingPlatform[0].name) {
                  if (googleMeetStatus.isConnected) {
                    setSelectedMeetingPlatform(e.target.value);
                  } else {
                    setSelectedMeetingPlatform(e.target.value);
                    handleGoogleMeetAuth();
                  }
                } else if (e.target.value === meetingPlatform[1].name) {
                  if (zoomMeetingStatus.isConnected) {
                    setSelectedMeetingPlatform(e.target.value);
                  } else {
                    handleZoomMeetingsOAuth();
                  }
                } else if (e.target.value === meetingPlatform[2].name) {
                  setSelectedMeetingPlatform(e.target.value);
                } else {
                  setSelectedMeetingPlatform("");
                }
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select Platform</option>
              {meetingPlatform.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-2 mb-1">
          <div className="col-span-2">
            <DatePickerInput
              label="Start Date"
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            />
          </div>

          <div className="mt-2 col-span-2">
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700"
            >
              Start Time
            </label>
            <select
              id="startTtime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Start Time</option>
              {timeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <DatePickerInput
              label="End Date"
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            />
          </div>

          <div className="mt-2 col-span-2">
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700"
            >
              End Time
            </label>
            <select
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">End Time</option>
              {timeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-1"></div>
        <div className="mb-1 grid grid-cols-3 gap-4"></div>
        <div className="mb-1">
          <TextAreaInput
            cols={2}
            rows={2}
            label="Description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <div className="mb-1">
          <div
            className={
              isModalForLead
                ? "grid grid-cols-8 gap-2"
                : "grid grid-cols-7 gap-2"
            }
          >
            <div className="col-span-5">
              <FormInput
                type="email"
                value={newAttendeeEmail === "" ? "" : newAttendeeEmail}
                onChange={(e) => setNewAttendeeEmail(e.target.value)}
                placeholder="Enter Attendees"
                label="Attendees"
                id="attendee"
              />
            </div>
            <div className="col-span-1 mt-7">
              <Button
                onClick={() => {
                  setIsAddCompanyUserEmailAttedeesModalOpen(true);
                }}
              >
                <UserPlus className="h-6 w-4" />
              </Button>
            </div>
            {isModalForLead && (
              <div className="col-span-1 mt-7">
                <Button
                  onClick={() => {
                    setIsAddCompanyLeadContactModalOpen(true);
                  }}
                >
                  <Contact2 className="h-6 w-4" />
                </Button>
              </div>
            )}
            <div className="col-span-1 mt-7">
              <Button
                onClick={() => {
                  handleAddAttendee();
                }}
                disabled={!newAttendeeEmail.trim()}
              >
                <Plus className="h-6 w-4" />
              </Button>
            </div>
          </div>
          {attendees.length != 0 && (
            <div className="mt-0.5 grid grid-cols-3 max-h-36 gap-0.5 overflow-y-auto">
              {attendees.map((attendee) => (
                <div
                  key={attendee}
                  className="grid col-span-1 py-0.5 border border-r-2 px-0.5 hover:bg-gray-400 rounded-lg"
                >
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-gray-600 rounded-full bg-white" />
                      <span className="text-xs text-gray-600">{attendee}</span>
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        selectedCompanyUserDetailArray.map((user) => {
                          if (user.email === attendee) {
                            handleRemoveAttendee(attendee, user.id);
                            return;
                          } else {
                            handleRemoveAttendee(attendee, 0);
                            return;
                          }
                        });
                      }}
                      className="text-gray-600 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <div className="max-w-28 mt-1 place-self-center">
            <Button
              className="px-4 py-2.5 text-sm font-medium text-gray-100 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              onClick={() => {
                handleCloseMeetingModal();
              }}
            >
              Close
            </Button>
          </div>
          <div className="max-w-48 mt-1 place-self-center">
            <Button
              onClick={() => {
                if (selectedMeetingPlatform === meetingPlatform[0].name) {
                  if (googleMeetStatus.isConnected) {
                    createGoogleMeetMeeting();
                  } else {
                    handleGoogleMeetAuth();
                  }
                } else if (
                  selectedMeetingPlatform === meetingPlatform[1].name
                ) {
                  if (zoomMeetingStatus.isConnected) {
                    createZoomMeeting();
                  } else {
                    handleZoomMeetingsOAuth();
                  }
                } else if (
                  selectedMeetingPlatform === meetingPlatform[2].name
                ) {
                  showMessageSnackbar({
                    message: "Microsofft teams is coming soon...!",
                    type: "error",
                  });
                } else {
                  showMessageSnackbar({
                    message: "select the meeting platform first",
                    type: "error",
                  });
                }
              }}
              disabled={
                isCreating ||
                !title.trim() ||
                !startDate ||
                !startTime ||
                !endDate ||
                !endTime
              }
            >
              {isCreating ? "Creating..." : "Schedule Meeting"}
            </Button>
          </div>
        </div>
      </div>
      <AddCompanyUsersEmailAttendeesModal
        isOpen={isAddCompanyUserEmailAttedeesModalOpen}
        onClose={() => {
          setIsAddCompanyUserEmailAttedeesModalOpen(false);
        }}
        handleAddCompanyUserEmailCheckboxChange={
          handleAddCompanyUserEmailCheckboxChange
        }
        addCompanyTeamUserArray={selectedCompanyUsersIdArray}
      />
      {isAddCompanyLeadContactModalOpen && (
        <CompanyLeadContactsSelectionAgGrid
          isOpen={isAddCompanyLeadContactModalOpen}
          onClose={() => {
            setIsAddCompanyLeadContactModalOpen(false);
          }}
          selectedLeadId={JSON.parse(sessionStorage.getItem("leadData")!).id}
          addCompanyLeadContactIdArray={addCompanyLeadContactIdArray}
          handleCompanyLeadContactCheckBoxChange={
            handleCompanyLeadContactCheckBoxChange
          }
        />
      )}

      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </div>,
    document.body // Use the non-null assertion here.  We've ensured it's not null.
  );
};

export default MeetingScheduler;
