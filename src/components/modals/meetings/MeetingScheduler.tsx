/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FormInput from "../../ui/FormInput";
import DatePickerInput from "../../ui/DatePickerInput";
import TextAreaInput from "../../ui/TextAreaInput";
import Button from "../../ui/Button";
import { Plus, UserPlus, Users, X } from "lucide-react";
import { meetingPaltform } from "../../../constants/TestData";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import qs from "query-string";
import ROUTES_URL from "../../../constants/Routes";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import AddCompanyUsersEmailAttendeesModal from "./AddCompanyUsersEmailAttendeesModal";
import CompanyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import { useGoogleMeetContext } from "../../../context/meeting/GoogleMeetContext";
import { STATUS_CODE } from "../../../constants/AppConstants";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import { useZoomMeetingContext } from "../../../context/meeting/ZoomMeetingContext";
import CalendarEventType from "../../../@types/meeting/CalendarEventType";

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
  const [selectedMeetingPlatform, setSelectedMeetingPlatform] = useState<
    "Google Meet" | "Zoom Meetings" | "Teams" | ""
  >("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { loginStatus } = useLoggedInUserContext();

  const [
    isAddCompanyUserEmailAttedeesModalOpen,
    setIsAddCompanyUserEmailAttedeesModalOpen,
  ] = useState<boolean>(false);
  const [selectedCompanyUsersIdArray, setSelectedCompanyUsersIdArray] =
    useState<number[]>([loginStatus.id]);
  const [selectedCompanyUserDetailArray, setSelectedCompanyUserDetailArray] =
    useState<{ email: string; id: number }[]>([]);

  const [googleMeetEventData, setGoogleMeetEventData] = useState<
    CalendarEventType[]
  >([]);

  const navigate = useNavigate();
  const { googleMeetStatus } = useGoogleMeetContext();
  const {zoomMeetingStatus} = useZoomMeetingContext();



  const handleGoogleMeetAuth = () => {
    navigate(ROUTES_URL.GOOGLE_OAUTH);
  };

  const createGoogleMeetMeeting = async () => {
    if (
      title !== "" &&
      startDate !== "" &&
      endDate !== "" &&
      startTime !== "" &&
      endTime !== "" &&
      selectedMeetingPlatform === "Google Meet"
    ) {
      setIsCreating(true);

      const postDataCreateGoogleMeetMeeting = {
        company_id: loginStatus.companyId,
        summary_title: title,
        description: description,
        start_date_string: startDate + "T" + startTime + ":00",
        end_date_string: endDate + "T" + endTime + ":00",
        time_zone: "Asia/Kolkata",
        attendees_email_all: attendees,
        attendees_company_user_id: selectedCompanyUsersIdArray,
        company_user_id: loginStatus.id,
        createdby: loginStatus.id,
      };

      axios
        .post(POST_API.CREATE_GOOGLE_MEETING, postDataCreateGoogleMeetMeeting, {
          withCredentials: true,
        })
        .then((response) => {
          if(response.status === STATUS_CODE.OK){
            console.log(response);
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
        .catch((error) => {
          console.log(error);
                  if(error.status === STATUS_CODE.PERMANENT_REDIRECT){
            handleGoogleMeetAuth();
          }
        });
    } else {
      alert("Please fill all the fields");
    }
  };
  const createZoomMeeting = () => {
    if (
      title !== "" &&
      startDate !== "" &&
      endDate !== "" &&
      startTime !== "" &&
      endTime !== "" &&
      selectedMeetingPlatform === "Zoom Meetings"
    ) {
      setIsCreating(true);
      const createZoomMeetingPostData = {
        company_id: loginStatus.companyId,
        summary_title: title,
        description: description,
        start_date_string: startDate + "T" + startTime + ":00",
        end_date_string: endDate + "T" + endTime + ":00",
        time_zone: "Asia/Kolkata",
        attendees_email_all: attendees,
        attendees_company_user_id: selectedCompanyUsersIdArray,
        company_user_id: loginStatus.id,
        createdby: loginStatus.id,
      };
      axios
        .post(POST_API.CREATE_ZOOM_MEETING, createZoomMeetingPostData, {
          withCredentials: true,
        })
        .then((response) => {
           console.log(response);

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
        .catch((error) => {
          console.log(error);
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
        console.log("length : " + response.data.length);
        if (response.data.length === 0) {
          return 0;
        }
        console.log(response.data[0]);
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
      console.log(error);
      if (error.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithParamsNotEvent: isEmailIsOfCompanyUser,
        });
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
        console.log("company user id returned from check : " + id);
        setSelectedCompanyUsersIdArray((prev) => [...prev, id]);
        setAttendees([...attendees, newAttendeeEmail.trim()]);
        setNewAttendeeEmail("");
        return;
      } else {
        console.log("in else : " + id);
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

  const getGoogleMeeting = async () => {
    setGoogleMeetEventData([]);
    const getGoogleMeetingsPostData = {
      company_id: loginStatus.companyId,
      company_user_id: loginStatus.id,
      requestedby: loginStatus.id,
    };
    await axios
      .post(POST_API.GET_GOOGLE_MEETINGS, getGoogleMeetingsPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status == STATUS_CODE.OK) {
          // setGoogleMeetEventData((prev) => [
          //   ...prev,
          //   {
          //   }
          // ])
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleZoomMeetingsOAuth = () => {
    navigate(ROUTES_URL.ZOOM_OAUTH);
    }

  const timeOptions = generateTimeOptions();

  const handleAddCompanyUserEmailCheckboxChange = (
    params: CompanyUsersSearchProps,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("from add email to meeting");
    console.log(params);
    console.log(selectedCompanyUsersIdArray);
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

  const handleCloseMeetingModal = () => {
    const leadData = sessionStorage.getItem("leadData");
    const newQueryString = qs.stringify({
      leadData: leadData,
    });

    const newPath = `${ROUTES_URL.LEAD_DETAILS}?${newQueryString}`;
    sessionStorage.removeItem("leadData");
    navigate(newPath);
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
                if (e.target.value === "Google Meet") {
                  if (googleMeetStatus.isConnected) {
                    setSelectedMeetingPlatform(e.target.value);
                  } else {
                    setSelectedMeetingPlatform(e.target.value);
                    handleGoogleMeetAuth();
                  }
                } else if (e.target.value === "Zoom Meetings") {
                  setSelectedMeetingPlatform("Zoom Meetings");
                } else if (e.target.value === "Teams") {
                  setSelectedMeetingPlatform("Teams");
                } else {
                  setSelectedMeetingPlatform("");
                }
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select Platform</option>
              {meetingPaltform.map((option) => (
                <option key={option.id} value={option.paltform}>
                  {option.paltform}
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
        <div className="mb-1 grid grid-cols-3 gap-4">
          {/* <div>
            <label
              htmlFor="timeZone"
              className="block text-sm font-medium text-gray-700"
            >
              Time
            </label>
            <select
              id="timeZone"
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Time Zone</option>
              {timeZoneArray.map((option) => (
                <option key={option.number} value={option.timezone}>
                  {option.timezone}
                </option>
              ))}
            </select>
          </div> */}
        </div>
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
          <div className="grid grid-cols-7 gap-2">
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
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
            <div className="col-span-1 mt-7">
              <Button
                onClick={() => {
                  handleAddAttendee();
                }}
                disabled={!newAttendeeEmail.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {attendees.length > 0 && (
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
                      size="icon"
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
                if (selectedMeetingPlatform === "Google Meet") {
                  if (googleMeetStatus.isConnected) {
                    createGoogleMeetMeeting();
                  } else {
                    handleGoogleMeetAuth();
                  }
                }
                else if(selectedMeetingPlatform === "Zoom Meetings"){
                  if (zoomMeetingStatus.isConnected) {
                      createZoomMeeting();
                  }
                  else{
                    handleZoomMeetingsOAuth();
                  }
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
          <div className="max-w-28 mt-1 place-self-center">
            <Button
              onClick={() => {
                if (googleMeetStatus.isConnected) {
                  getGoogleMeeting();
                } else {
                  handleGoogleMeetAuth();
                }
              }}
            >
              Get
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
    </div>,
    document.body // Use the non-null assertion here.  We've ensured it's not null.
  );
};

export default MeetingScheduler;
