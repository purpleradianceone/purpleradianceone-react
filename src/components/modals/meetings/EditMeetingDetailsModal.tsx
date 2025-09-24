/* eslint-disable no-constant-binary-expression */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPortal } from "react-dom";
import FormInput from "../../ui/FormInput";
import { useEffect, useState } from "react";
import { useGoogleMeetContext } from "../../../context/meeting/GoogleMeetContext";
import {
  Calendar,
  CalendarPlusIcon,
  ClipboardList,
  Clock,
  Copy,
  CopyCheck,
  CopyX,
  Info,
  Plus,
  Save,
  Text,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";
import { parse } from "date-fns";
import DatePickerInput from "../../ui/DatePickerInput";
import TextAreaInput from "../../ui/TextAreaInput";
import Button from "../../ui/Button";
import AddCompanyUsersEmailAttendeesModal from "./AddCompanyUsersEmailAttendeesModal";
import CompanyUsersSearchProps from "../../../@types/company-users/CompanyUserProps";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import {
  SIZE,
  STATUS_CODE,
} from "../../../constants/AppConstants";
import RefreshToken from "../../../config/validations/RefreshToken";
import ApiError from "../../../@types/error/ApiError";
import RadioButtons from "../../ui/RadioButton";
import CalendarEventType from "../../../@types/meeting/CalendarEventType";
import { useZoomMeetingContext } from "../../../context/meeting/ZoomMeetingContext";
import { CLASS_NAMES } from "../../../constants/ClassNames";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../constants/Routes";
import { useServerCurrentTime } from "../../../config/hooks/useServerCurrentTime";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import MeetingPlatforms from "../../../@types/meeting/MeetingPlatform";
import { useUserPreference } from "../../../context/user/UserPreference";
import toast from "react-hot-toast";

function EditMeetingDetailsModal({
  meetingDetails,
  isOpen,
  onClose,
  isAttendeesPresent,
  handleMeetingDetailsUpdate,
  meetingPlatform,
}: {
  meetingDetails: CalendarEventType;
  isOpen: boolean;
  onClose: () => void;
  isAttendeesPresent: boolean;
  handleMeetingDetailsUpdate : (date : string,summary : string) => void;
  meetingPlatform: MeetingPlatforms[];
}) {
  const meetingStautsRadioButtonOptions = [
    {
      label: "Confirm",
      value: "confirmed",
      id: "status",
      name: "meeetingStatus",
      checked:
        meetingDetails.platform === 1
          ? meetingDetails.meetingStatusFromGoogle === "confirmed"
          : meetingDetails.meetingStatusFromZoom === "waiting",
    },
    {
      label: "Cancel",
      value: "cancelled",
      id: "status",
      name: "meeetingStatus",
      checked:
        meetingDetails.platform === 1
          ? meetingDetails.meetingStatusFromGoogle === "cancelled"
          : meetingDetails.meetingStatusFromZoom === "cancelled",
    },
  ];

  const { userHasAccessToUpdateMeeting } = useUserAccessModules();
  const { userPreference } = useUserPreference();

  const startDateArray =
    meetingDetails.startDateByUserTimeZoneString.split(" ");
  const startDateValue = startDateArray[0];
  const startTimeArray = startDateArray[1].split(".");
  const startTimeValue = startTimeArray[0];

  const startDateArrayIST = meetingDetails.startDateByIST.split(" ");
  const startDateValueIST = startDateArrayIST[0];
  const startTimeArrayIST = startDateArrayIST[1].split(".");
  const startTimeValueIST = startTimeArrayIST[0].substring(0, 5);

  const endDateArray = meetingDetails.endDateByUserTimeZoneString.split(" ");
  const endDateValue = endDateArray[0];
  const endTimeArray = endDateArray[1].split(".");
  const endTimeValue = endTimeArray[0];

  const endDateArrayIST = meetingDetails.endDateByIST.split(" ");
  const endDateValueIST = endDateArrayIST[0];
  const endTimeArrayIST = endDateArrayIST[1].split(".");
  const endTimeValueIST = endTimeArrayIST[0].substring(0, 5);

  const [isAttendeeNotPresentAddedNew, setIsAttendeeNotPresentAddedNew] =
    useState<boolean>(isAttendeesPresent);

  const [title, setTitle] = useState<string>(meetingDetails!.title);
  const [startDate, setStartDate] = useState<string>(startDateValue);
  const [endDate, setEndDate] = useState<string>(endDateValue);
  const [endTime, setEndTime] = useState<string>(endTimeValue.substring(0, 5));
  const [startTime, setStartTime] = useState<string>(
    startTimeValue.substring(0, 5)
  );

  const [attendees, setAttendees] = useState<string[]>(() => {
    return isAttendeeNotPresentAddedNew ? meetingDetails.attendeesEmailAll : [];
  });
  const [newAttendeeEmail, setNewAttendeeEmail] = useState<string>("");
  const [description, setDescription] = useState<string>(
    meetingDetails!.description
  );


  const navigate = useNavigate();

  const [meetingStatus, setMeetingStatus] = useState<
    | "confirmed"
    | "cancelled"
    | "waiting"
    | "started"
    | "end"
    | "scheduled"
    | "closed"
    | ""
  >(() => {
    return meetingDetails.platform === 1
      ? meetingDetails.meetingStatusFromGoogle!
      : meetingDetails.meetingStatusFromZoom!;
  });
  const [isCreating, setIsCreating] = useState<boolean>(false); // Simulate meeting creation
  const [selectedMeetingPlatform, setSelectedMeetingPlatform] =
    useState<string>(() => {
      if (meetingDetails.platform === 1) {
        return meetingPlatform[0].name;
      } else if (meetingDetails.platform === 2) {
        return meetingPlatform[1].name;
      } else if (meetingDetails.platform === 3) {
        return meetingPlatform[2].name;
      } else {
        return "";
      }
    });

  const { loginStatus } = useLoggedInUserContext();

  const [selectedCompanyUsersIdArray, setSelectedCompanyUsersIdArray] =
    useState<number[]>(meetingDetails.attendeesCompanyUserId);
  const [selectedCompanyUserDetailArray, setSelectedCompanyUserDetailArray] =
    useState<{ email: string; id: number }[]>([]);

  const { googleMeetStatus } = useGoogleMeetContext();
  const { zoomMeetingStatus } = useZoomMeetingContext();
  const { currentTime } = useServerCurrentTime();
  const [serverCurrentTime, setServerCurrentTime] = useState<Date>();
  const [parsedStartDateTime, setParsedStartDateTime] = useState<Date>();
  const [parsedEndDateTime, setParsedEndDateTime] = useState<Date>();

  useEffect(() => {
    const pickerFormatString = "yyyy-MM-dd HH:mm";

    const combinedPickerStartDateTimeString = `${startDateValueIST} ${startTimeValueIST}`;
    const combinedPickerEndDateTimeString = `${endDateValueIST} ${endTimeValueIST}`;

    setServerCurrentTime(new Date(currentTime.replace(" ", "T")));
    setParsedStartDateTime(
      parse(combinedPickerStartDateTimeString, pickerFormatString, new Date())
    );
    setParsedEndDateTime(
      parse(combinedPickerEndDateTimeString, pickerFormatString, new Date())
    );
  }, [currentTime]);


  const [
    isAddCompanyUserEmailAttedeesModalOpen,
    setIsAddCompanyUserEmailAttedeesModalOpen,
  ] = useState<boolean>(false);

  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle"
  );


  // const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
  //   setMessageSnackbar({ open: true, message, type });
  // };

  // const handleCloseSnackbar = () => {
  //   setMessageSnackbar((prev) => ({ ...prev, open: false }));
  // };
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
  const isEmailIsOfCompanyUser = async (email: string) => {
    if (serverCurrentTime! < parsedStartDateTime!) {
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
    }
  };

  const handleAddAttendee = async () => {
    if (isAttendeeNotPresentAddedNew) {
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
    } else {
      if (newAttendeeEmail.trim()) {
        setIsAttendeeNotPresentAddedNew(true);
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
    }
  };

  const handleRemoveAttendee = (email: string, id: number) => {
    setAttendees(attendees.filter((attendee) => attendee !== email));
    setSelectedCompanyUsersIdArray((prev) =>
      prev.filter((userId) => userId !== id)
    );
  };

  const handleCopyMeetingDetailsToClipboard = async () => {
    const detailsToCopy =
      meetingDetails.platform === 1
        ? `Meeting link : ${meetingDetails.meetingLink},\nMeeting ID : ${meetingDetails.meetingConferenceId}`
        : `Meeting Link : ${meetingDetails.zoomMeetingJoinLink},\nMeeting ID : ${meetingDetails.meetingIdFromZoom},\nMeeting Password : ${meetingDetails.zoomMeetingPasswordGeneral}\nH323 Password : ${meetingDetails.zoomMeetingPasswordH323}\nPSTN Password : ${meetingDetails.zoomMeetingPassworsPstn}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(detailsToCopy);
        setCopyStatus("copied");
        setTimeout(() => setCopyStatus("idle"), 2000); // Reset status after 2 seconds
      } else {
        setCopyStatus("failed");
        setTimeout(() => setCopyStatus("idle"), 3000); // Reset status after 3 seconds
      }
    } catch (err) {
      console.error("Failed to copy meeting details: ", err);
      setCopyStatus("failed");
      setTimeout(() => setCopyStatus("idle"), 3000); // Reset status after 3 seconds
    }
  };

  const timeOptions = generateTimeOptions();

  const getCompanyUsersPresentInAttendeesArray = async (
    attendees: string[]
  ) => {
    if (
      serverCurrentTime! < parsedStartDateTime! &&
      currentTime &&
      parsedStartDateTime
    ) {
      for (let i = 0; i < attendees.length; i++) {
        const getUserPostData = {
          company_id: loginStatus.companyId,
          id: null,
          requestedby: loginStatus.id,
          limit: null,
          offset: null,
          search_company_specific_date_range_id: null,
          search_parameter: attendees[i],
          search_parameter_date: null,
        };
        await axios
          .post(POST_API.GET_COMPANY_USERS, getUserPostData, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.status == STATUS_CODE.OK) {
              if (response.data.length !== 0) {
                response.data.map((res: any) => {
                  setSelectedCompanyUserDetailArray((prev) => [
                    ...prev,
                    {
                      email: res.email,
                      id: res.id,
                    },
                  ]);
                });
              }
            }
          })
          .catch(async (error) => {
            if (error.status === STATUS_CODE.UNATHORISED) {
              const refreshTokenStatus = await RefreshToken({
                callFunctionWithParamsNotEvent:
                  getCompanyUsersPresentInAttendeesArray,
              });
              if(refreshTokenStatus){
                getCompanyUsersPresentInAttendeesArray(attendees);
              }
            }
          });
      }
    }
  };

  const handleOAuthConsent = () => {
    if (selectedMeetingPlatform === meetingPlatform[0].name) {
      navigate(ROUTES_URL.GOOGLE_OAUTH);
    } else if (selectedMeetingPlatform === meetingPlatform[1].name) {
      alert();
      navigate(ROUTES_URL.ZOOM_OAUTH);
    }
  };

  const updateMeetingDetails = async () => {
    if (serverCurrentTime! > parsedStartDateTime!) {
      // showMessageSnackbar({
      //   message: "cannot Update meeting details as it is already started",
      //   type: "warning",
      // });
      toast.error("Cannot Update meeting details as it is already started.");
      return;
    }

    if (isAttendeeNotPresentAddedNew) {
      if (
        meetingDetails.title === title &&
        meetingDetails.description === description &&
        startDate === startDateValue &&
        endDate === endDateValue &&
        startTime === startTimeValue.substring(0, 5) &&
        endTime === endTimeValue.substring(0, 5) &&
        meetingDetails.attendeesEmailAll === attendees &&
        (meetingStatus === meetingDetails.meetingStatusFromGoogle ||
          meetingStatus === meetingDetails.meetingStatusFromZoom)
      ) {
        // showMessageSnackbar({
        //   message: "No changes made to mesgvs",
        //   type: "error",
        // });
        toast.error("No changes made to meeting.");
        return;
      }
    } else if (!isAttendeeNotPresentAddedNew) {
      if (
        (meetingDetails.title === title &&
          meetingDetails.description === description &&
          startDate === startDateValue &&
          endDate === endDateValue &&
          startTime === startTimeValue.substring(0, 5) &&
          endTime === endTimeValue.substring(0, 5) &&
          attendees.length !== 0) ||
        meetingStatus === meetingDetails.meetingStatusFromGoogle ||
        meetingStatus === meetingDetails.meetingStatusFromZoom
      ) {
        alert(
          meetingStatus === meetingDetails.meetingStatusFromGoogle ||
            meetingStatus === meetingDetails.meetingStatusFromZoom
        );
        // showMessageSnackbar({
        //   message: "No changes made to meeting details",
        //   type: "error",
        // });
        toast.error("No changes made to meeting details")
        return;
      }
    }

    if (userHasAccessToUpdateMeeting) {
      if (
        title !== "" &&
        startDate !== "" &&
        endDate !== "" &&
        startTime !== "" &&
        endTime !== "" &&
        (title !== meetingDetails.title ||
          description !== meetingDetails.description ||
          meetingDetails.startDateByUserTimeZone !==
            new Date(`${startDate} ${startTime}:00`) ||
          meetingDetails.endDateByUserTimeZone !==
            new Date(`${endDate} ${endTime}:00`) ||
          (!meetingDetails.isActive
            ? meetingDetails.meetingStatusFromGoogle !== "confirmed"
            : meetingDetails.meetingStatusFromZoom !== "waiting"))
      ) {
        setIsCreating(true);
        const updateMeetingDetailsPostData = {
          company_id: loginStatus.companyId,
          company_user_id: loginStatus.id,
          id: meetingDetails.id,
          meeting_id:
            meetingDetails.platform === 1
              ? meetingDetails.meetingIdFromGoogle!
              : meetingDetails.meetingIdFromZoom!,
          meeting_status: meetingStatus,
          summary_title: title,
          description: description,
          start_time: startDate + "T" + startTime + ":00",
          end_time: endDate + "T" + endTime + ":00",
          time_zone: userPreference.timezoneName,
          attendees_email_all: attendees,
          host_id: meetingDetails.meetingHostIdFromZoom,
          attendees_company_user_id: selectedCompanyUsersIdArray,
          isactive: meetingStatus === "cancelled" ? false : true,
          // isactive : true,
          updatedby: loginStatus.id,
        };
        await axios
          .post(
            meetingDetails.platform === 1
              ? POST_API.UPDATE_GOOGLE_MEETINGS
              : POST_API.UPDATE_ZOOM_MEETING,
            updateMeetingDetailsPostData,
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            if (response.status == STATUS_CODE.OK) {
              if (response.data.status) {
                // showMessageSnackbar({
                //   message: response.data.message,
                //   type: "success",
                // });
                toast.success(response.data.message);
                setTimeout(() => {
                  handleMeetingDetailsUpdate(endDate + " " + endTime + ":00",title);
                  setIsCreating(false);
                  onClose();
                }, 3000);
              } else if (!response.data.status) {
                // showMessageSnackbar({
                //   message: response.data.message,
                //   type: "error",
                // });
                toast.error(response.data.message);
              }
            }
          })
          .catch(async (error: ApiError | any) => {
            if (error.status === STATUS_CODE.PERMANENT_REDIRECT) {
              handleOAuthConsent();
            } else if (error.status === STATUS_CODE.UNATHORISED) {
              const refreshTokenStatus = await RefreshToken({
                callFunction: updateMeetingDetails,
              });
              if (refreshTokenStatus) {
                updateMeetingDetails();
              }
            }
          });
      }
    } else {
      // console.log(
      //   "___________________Start Comparision_____________________________"
      // );
      // console.log(meetingDetails.title + " === " + title);
      // console.log(meetingDetails.title === title);
      // console.log("________________________________________________");
      // console.log(meetingDetails.description + " === " + description);
      // console.log(description === meetingDetails.description);
      // console.log("________________________________________________");
      // console.log(startDate + "=== " + startDateValue);
      // console.log(startDate === startDateValue);
      // console.log("________________________________________________");
      // console.log(endDate + "=== " + endDateValue);
      // console.log(endDate === endDateValue);
      // console.log("________________________________________________");
      // console.log(startTime + "=== " + startTimeValue.substring(0, 5));
      // console.log(startTime === startTimeValue.substring(0, 5));
      // console.log("________________________________________________");
      // console.log(endTime + "=== " + endTimeValue.substring(0, 5));
      // console.log(endTime === endTimeValue.substring(0, 5));
      // console.log("________________________________________________");
      // console.log(meetingDetails.attendeesEmailAll);
      // console.log(attendees);
      // console.log(attendees !== meetingDetails.attendeesEmailAll!);
      // console.log("________________________________________________");
      // console.log("is Attendees present : " + isAttendeeNotPresentAddedNew);
      // showMessageSnackbar({
      //   message: "You are not Authorised to Update the Meeting details!",
      //   type: "error",
      // });
      toast.error("You are not Authorised to Update the Meeting details!")
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (
        isAttendeesPresent &&
        meetingDetails.creatorAttenting !== "Attending"
      ) {
        getCompanyUsersPresentInAttendeesArray(
          meetingDetails.attendeesEmailAll
        );
      }
    } else if (!isOpen) {
      setTitle("");
      setEndTime("");
      setStartTime("");

      setAttendees([]);
      setDescription("");
      setIsCreating(false);
      setStartDate("");
      setEndDate("");
      setSelectedMeetingPlatform("");
      setSelectedCompanyUserDetailArray([]);
      setSelectedCompanyUsersIdArray([]);
    }
  }, [isOpen, parsedStartDateTime]);

  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50  overflow-y-auto">
      <div className="max-w-4xl mt-1 w-full p-4 bg-white rounded-lg shadow-xl overflow-y-auto">
        <div className="flex justify-between gap-1">
          <div className="flex gap-2">
          <CalendarPlusIcon className="text-blue-600 w-6 h-6"/>
          <h1 className="table-header-custom">
            
            Update Meeting
            <div className="caption-custom">
            Update the meeting details as per your convinence
          </div>
            {!meetingDetails.isActive &&
              meetingDetails.creatorAttenting !== "Attending" && (
                <div className="flex gap-2 ">
                  <Info size={SIZE.TWENTY} className="caption-custom-inactive"></Info>{" "}
                  <span className="caption-custom-inactive mt-1">
                    You Have cancelled this Meeting
                  </span>
                </div>
              )}
            {meetingDetails.creatorAttenting === "Attending" && (
              <div className="flex gap-2 ">
                <Info size={SIZE.TWENTY} className="caption-custom-active"></Info>{" "}
                <span className="caption-custom-active mt-1">
                  You have Invited to this Meeting
                </span>
              </div>
            )}
            {!meetingDetails.isActive &&
              meetingDetails.creatorAttenting === "Attending" && (
                <div className="flex gap-2 ">
                  <Info size={SIZE.TWENTY} className="caption-custom-inactive"></Info>{" "}
                  <span className="caption-custom-inactive mt-1">
                    This Meeting has been cancelled by the host
                  </span>
                </div>
              )}
            {serverCurrentTime! > parsedStartDateTime! &&
              serverCurrentTime! > parsedEndDateTime! &&
              meetingDetails.isActive && (
                <div className="flex gap-2 ">
                  <Info size={SIZE.TWENTY} className="caption-custom-yellow"></Info>{" "}
                  <span className="caption-custom-yellow mt-1">
                    This Meeting has been Started or has already passed
                  </span>
                </div>
              )}
            {serverCurrentTime! >= parsedStartDateTime! &&
              serverCurrentTime! <= parsedEndDateTime! &&
              meetingDetails.isActive && (
                <div className="flex gap-2 ">
                  <Info size={SIZE.TWENTY} className="caption-custom-active"></Info>{" "}
                  <span className="caption-custom-active mt-1">
                    Ongoing Meeting
                  </span>
                </div>
              )}
              
          </h1>
          </div>
          
          

          <div className="flex gap-2 self-start">
            {meetingDetails.isActive &&
              serverCurrentTime! < parsedEndDateTime! && (
                <Button
                type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    if (meetingDetails.platform === 1) {
                      window.open(meetingDetails.meetingLink, "_blank");
                    } else if (meetingDetails.platform === 2) {
                      window.open(meetingDetails.zoomMeetingJoinLink, "_blank");
                    }
                  }}
                >
                  <div className="flex gap-2 items-center">
                    <Video></Video>
                    <span>Join</span>
                    
                  </div>
                </Button>
              )}

            {meetingDetails.isActive &&
              serverCurrentTime! < parsedEndDateTime! && (
                <button
                  title={
                    copyStatus === "copied"
                      ? "Copied!"
                      : copyStatus === "failed"
                      ? "Failed to Copy"
                      : "Copy Meeting Details"
                  }
                  onClick={handleCopyMeetingDetailsToClipboard}
                >
                  {copyStatus === "copied" && (
                    <CopyCheck className="input-label-custom-active hover:text-green-400"></CopyCheck>
                  )}
                  {copyStatus === "idle" && (
                    <Copy className="input-label-custom-blue hover:text-blue-500"></Copy>
                  )}
                  {copyStatus === "failed" && (
                    <CopyX className="input-label-custom-inactive hover:text-red-500"></CopyX>
                  )}
                </button>
              )}

            <button
              onClick={() => {
                onClose();
              }}
            >
              <X
                size={SIZE.TWENTY}
                className={CLASS_NAMES.INLINE_ICON_SIZE_FOUR}
              ></X>
            </button>
          </div>
        </div>
        <div className="mb-1 grid grid-cols-3 gap-1">
          <div className="col-span-2">
            <FormInput
              id="title"
              type="text"
              //   value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting Title"
              label="Title"
              defaultValue={title}
              readonly={
                !meetingDetails.isActive ||
                meetingDetails.creatorAttenting === "Attending"
              }
              logo={ClipboardList}
            />
          </div>
          <div className="mt-1 col-span-1">
            <label
              htmlFor="platform"
              className=""
            >
             <div className="flex gap-2 text-center mt-2">
                <CalendarPlusIcon className="text-blue-600 w-3 h-3 justify-center mt-2" />
                <span>Meeting Platform</span>
              </div>
            </label>
            <select
              id="platform"
              value={selectedMeetingPlatform}
              disabled={
                !meetingDetails.isActive ||
                meetingDetails.creatorAttenting === "Attending"
              }
              onChange={(e) => {
                e.preventDefault();
                // showMessageSnackbar({
                //   message:
                //     "cannot Change Platform to create new meeting meeting with different platform",
                //   type: "error",
                // });
                toast.error("cannot Change Platform to create new meeting meeting with different platform")
              }}
              className={
                meetingDetails.isActive
                  ? meetingDetails.creatorAttenting !== "Attending"
                    ? "mt-1 block w-full pl-3 pr-10 py-2 input-label-custom border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    : "appearance-none block w-full mt-1 px-3 py-2 input-label-custom border bg-gray-300 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  : "appearance-none block w-full mt-1 px-3 py-2 input-label-custom border bg-gray-300 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              }
            >
              <option  className="input-label-custom" value="">Select Platform</option>
              {meetingPlatform.map((option: MeetingPlatforms) => (
                <option  className="input-label-custom" key={option.id} value={option.name}>
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
              logo={Calendar}
              defaultValue={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              readonly={
                !meetingDetails.isActive ||
                meetingDetails.creatorAttenting === "Attending"
              }
              maxDate={new Date(currentTime)
                .toLocaleDateString()
                .replace(/\//g, "-")}
            />
          </div>

          <div className="mt-2 col-span-2">
            <label
              htmlFor="startTime"
              className="input-label-custom"
            >
              <div className="flex gap-2 text-center">
                <Clock className="text-blue-600 w-3 h-3 justify-center mt-1" />
                <span>Start Time</span>
              </div>
            </label>
            <select
              id="startTtime"
              disabled={
                !meetingDetails.isActive ||
                meetingDetails.creatorAttenting === "Attending"
              }
              defaultValue={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={
                meetingDetails.isActive
                  ? meetingDetails.creatorAttenting !== "Attending"
                    ? "input-label-custom mt-1 block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    : "input-label-custom appearance-none block w-full mt-1 px-3 py-2.5 border bg-gray-300 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  : "input-label-custom appearance-none block w-full mt-1 px-3 py-2.5 border bg-gray-300 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              }
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
              defaultValue={endDate}
              label="End Date"
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              readonly={
                !meetingDetails.isActive ||
                meetingDetails.creatorAttenting === "Attending"
              }
              logo={Calendar}
            />
          </div>

          <div className="mt-2 col-span-2">
            <label
              htmlFor="endTime"
              className="input-label-custom"
            > 
            <div className="flex gap-2 text-center">
                <Clock className="text-blue-600 w-3 h-3 justify-center mt-1" />
                <span>End Time</span>
              </div>
            </label>
            <select
              id="endTime"
              defaultValue={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={
                meetingDetails.isActive
                  ? meetingDetails.creatorAttenting !== "Attending"
                    ? "input-label-custom mt-1 block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    : "input-label-custom appearance-none block w-full mt-1 px-3 py-2.5 border bg-gray-300 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  : "input-label-custom appearance-none block w-full mt-1 px-3 py-2.5 border bg-gray-300 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              }
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
          logo={Text}
            cols={2}
            rows={2}
            label="Description"
            defaultValue={description}
            // value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            readonly={
              !meetingDetails.isActive ||
              meetingDetails.creatorAttenting === "Attending"
            }
            
          />
        </div>
        <div className="mb-1">
          <RadioButtons
            label="Meeting Status :"
            onChange={(e) => {
              if (
                e.target.value === "confirmed" ||
                e.target.value === "cancelled"
              ) {
                setMeetingStatus(e.target.value);
              }
            }}
            options={meetingStautsRadioButtonOptions}
          />
        </div>
        <div className="mb-1">
          {meetingDetails.isActive &&
            meetingDetails.creatorAttenting === "Creator" &&
            serverCurrentTime! < parsedStartDateTime! && (
              <div className="grid grid-cols-7 gap-2">
                <div className="col-span-5">
                  <FormInput
                    type="email"
                    value={newAttendeeEmail === "" ? "" : newAttendeeEmail}
                    onChange={(e) => setNewAttendeeEmail(e.target.value)}
                    placeholder="Enter Attendees"
                    label="Attendees"
                    id="attendee"
                    logo={UserPlus}
                  />
                </div>
                <div className="col-span-1 mt-7">
                  <Button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAddCompanyUserEmailAttedeesModalOpen(true);
                    }}
                  >
                    <div className="flex gap-0.5">
                      <UserPlus className="h-4 w-4" />
                    <span>Users</span>
                    </div>
                  </Button>
                </div>
                <div className="col-span-1 mt-7">
                  
                  <Button
                  type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddAttendee();
                    }}
                    // disabled={!newAttendeeEmail.trim()}
                  >
                    <div className="flex gap-0 5">
                      <Plus className="h-4 w-4" />
                    <span>Add</span>
                    </div>
                  </Button>
                </div>
              </div>
            )}

          {isAttendeeNotPresentAddedNew && (
            <div className="mt-0.5 grid grid-cols-3 max-h-36 gap-0.5 overflow-y-auto">
              {attendees.map((attendee) => (
                <div
                  key={attendee}
                  className="grid col-span-1 py-0.5 border border-r-2 px-0.5 hover:bg-gray-400 rounded-lg"
                >
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-gray-600 rounded-full bg-white" />
                      <span className="caption-custom">{attendee}</span>
                    </span>
                    {meetingDetails.creatorAttenting === "Attending" ||
                      (meetingDetails.isActive && (
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
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {meetingDetails.isActive &&
          meetingDetails.creatorAttenting !== "Attending" &&
          serverCurrentTime! < parsedStartDateTime! && (
            <div className="flex justify-end gap-3">
              <div className="max-w-28 mt-1 place-self-center">
                <Button
                type="button"
                  onClick={() => {
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                     <X size={16}/>
                    Cancel
                   </div>
                </Button>
              </div>
              <div className="max-w-48 mt-1 place-self-center">
                <Button
                type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      googleMeetStatus.isConnected ||
                      zoomMeetingStatus.isConnected
                    ) {
                      updateMeetingDetails();
                    } else {
                      handleOAuthConsent();
                    }
                  }}
                  disabled={
                    isCreating
                  }
                >
                  <div className="flex items-center justify-center gap-1">
                     <Save size={16}/>
                    {isCreating ? "Saving..." : "Save"}
                   </div>
                </Button>
              </div>
            </div>
          )}
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
        isModalForMeeting={true}
      />
    </div>,
    document.body // Use the non-null assertion here.  We've ensured it's not null.
  );
}

export default EditMeetingDetailsModal;
