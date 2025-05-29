/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Calendar,
  EventProps,
  EventWrapperProps,
  momentLocalizer,
  View,
} from "react-big-calendar";
import momentTimezone from 'moment-timezone';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../assets/styles/CalendarWithTicks.css";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../ui/Button";
// import GoogleMeetScheduler from "./GoogleMeetScheduler";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layout,
  LayoutList,
  List,
} from "lucide-react";
import moment from 'moment-timezone';import "react-big-calendar/lib/css/react-big-calendar.css";
import ROUTES_URL from "../../../constants/Routes";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import EditMeetingDetailsModal from "./EditMeetingDetailsModal";
import CalendarEventType from "../../../@types/meeting/CalendarEventType";
import ApiError from "../../../@types/error/ApiError";
import RefreshToken from "../../../config/validations/RefreshToken";
import { DialogueBox } from "../../dialogue-box/Dialogue";
import { useUserPreference } from "../../../context/user/UserPreference";



function LeadMeetingsModal({
  isCalendarViewEnabled,
  showConnectToPlatform,
  isMeetingModalOpenFromProp,
}: {
  isCalendarViewEnabled: boolean;
  showConnectToPlatform: boolean;
  isMeetingModalOpenFromProp: boolean;
}) {
    const {userPreference} = useUserPreference();
    const backEndDateFormat = "YYYY-MM-DD HH:mm:ss.S";
  const localizer = momentLocalizer(moment.tz.setDefault(userPreference.timezoneName));

  const [customMoment,setCustomMoment] = useState(moment)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();


  const [googleMeetEventData, setGoogleMeetEventData] = useState<
    CalendarEventType[]
  >([]);

  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [view, setView] = useState<View>("day");

  // const [concatDateDearchParameter,setConcatDateDearchParameter] = useState<string>(`${currentViewDate.toLocaleDateString("dd-MMM-yyyy").replace(/\//g,"-")}@${currentViewDate.toLocaleDateString("dd-MMM-yyyy").replace(/\//g,"-")}`);
  const [concatDateDearchParameter, setConcatDateDearchParameter] =
    useState<string>();
  const [meetingDetailsUpdateCount, setMeetDetailsUpdateCount] =
    useState<number>(0);

  const [isSessionExpiredDialogueOpen, setIsSessionExpiredDialogueOpen] =
    useState<boolean>(false);

  const leadDataSearchParams = JSON.parse(searchParams.get("leadData") || "{}");
  const [isEditMettingModalOpen, setIsEditMettingModalOpen] =
    useState<boolean>(false);
  const [selectedMeetingEvent, setSelectedMeetingEvent] =
    useState<CalendarEventType>({
      companyId: 0,
      attendeesCompanyUserId: [],
      attendeesEmailAll: [],
      id: 0,
      companyUserId: 0,
      creatorEmail: "",
      description: "",
      endDateByIST: "",
      endDateByUserTimeZone: new Date(),
      endDateByUserTimeZoneString : "",
      meetingConferenceId: "",
      meetingIdFromGoogle: "",
      meetingLink: "",
      meetingStatusFromGoogle: "",
      organizerEmail: "",
      startDateByIST: "",
      startDateByUserTimeZone: new Date(),
      startDateByUserTimeZoneString : "",
      title: "",
      isAttendeePresent: false,
      platform: 1,
      creatorAttenting: "",
    });

  const viewNames = ["month", "week", "day", "agenda"];

  const [concatDate, setConcatDate] = useState<string>(
    `${moment(new Date()).format("DD-MMM-YYYY")}@${moment(new Date()).format(
      "DD-MMM-YYYY"
    )}`
  );

  const getGoogleMeeting = async () => {
    setGoogleMeetEventData([]);
    const getGoogleMeetingsPostData = {
      company_id: loginStatus.companyId,
      company_user_id: loginStatus.id,
      search_company_specific_date_range_id: 8,
      search_parameter_date: concatDate,
      requestedby: loginStatus.id,
    };
    await axios
      .post(POST_API.GET_GOOGLE_MEETINGS, getGoogleMeetingsPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status == STATUS_CODE.OK) {
          response.data.map((res: any) => {
            const startDateByUserTimeZoneParsed = momentTimezone.tz(
              res["Start Date By User Time Zone"],
              backEndDateFormat,
              userPreference.timezoneName
            );
            const endDateByUserTimeZoneParsed = momentTimezone.tz(
              res["End Date By User Time Zone"],
              backEndDateFormat,
              userPreference.timezoneName
            );
            setGoogleMeetEventData((prev) => [
              ...prev,
              {
                count: res.count,
                companyId: res.company_id,
                id: res.id,
                companyUserId: res.company_user_id,
                meetingIdFromGoogle: res.meeting_id_from_google,
                meetingStatusFromGoogle: res.meeting_status_from_google,
                meetingLink: res.meeting_link,
                meetingConferenceId: res.meeting_conference_id,
                title: res.summary_title,
                description: res.description,
                creatorEmail: res.creator_email,
                organizerEmail: res.organizer_email,
                startDateByIST: res["Start Date By Indian Time"],
                endDateByIST: res["End Date By Indian Time"],
                startDateByUserTimeZone: startDateByUserTimeZoneParsed.toDate(),
                startDateByUserTimeZoneString : res["Start Date By User Time Zone"],
                endDateByUserTimeZoneString : res["End Date By User Time Zone"],
                endDateByUserTimeZone: endDateByUserTimeZoneParsed.toDate(),
                creatorAttenting: res.creator_attending,
                attendeesEmailAll: res.attendees_email_all,
                attendeesCompanyUserId: res.attendees_company_user_id,
                isAttendeePresent: res.attendees_email_all ? true : false,
                platform: 1,
                isActive: res.isactive,
                createdBy: res.createdby,
                updatedBy: res.updatedby,
                createdOn: res.createdon,
                updatedOn: res.updatedon,
              },
            ]);
          });
          getZoomMeeting();
        }
      })
      .catch(async (error: ApiError | any) => {
        console.log(error);

        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: getGoogleMeeting,
          });
          if (refreshTokenStatus) {
            setIsSessionExpiredDialogueOpen(false);
          } else {
            setIsSessionExpiredDialogueOpen(true);
          }
        } else if (error.status === STATUS_CODE.FORBIDDEN) {
          setIsSessionExpiredDialogueOpen(true);
        }
      });
  };

  const getZoomMeeting = async () => {
    const getZoomMeetingsPostData = {
      company_id: loginStatus.companyId,
      company_user_id: loginStatus.id,
      search_company_specific_date_range_id: 8,
      search_parameter_date: concatDate,
      requestedby: loginStatus.id,
    };
    await axios
      .post(POST_API.GET_ZOOM_MEETING, getZoomMeetingsPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          response.data.map((res: any) => {
            const startDateByUserTimeZoneParsed = momentTimezone.tz(
              res["Start Date By User Time Zone"],
              backEndDateFormat,
              userPreference.timezoneName
            );
            const endDateByUserTimeZoneParsed = momentTimezone.tz(
              res["End Date By User Time Zone"],
              backEndDateFormat,
              userPreference.timezoneName
            );

            console.log("endDate By User Time Zone : " );
            console.log(endDateByUserTimeZoneParsed);
            setGoogleMeetEventData((prev) => [
              ...prev,
              {
                count: res.count,
                companyId: res.company_id,
                id: res.id,
                companyUserId: res.company_user_id,
                meetingHostIdFromZoom: res.meeting_host_id_from_zoom,
                meetingStatusFromZoom: res.meeting_status_from_zoom,
                title: res.summary_title,
                description: res.description,
                creatorEmail: res.creator_email,
                meetingIdFromZoom: res.meeting_id_from_zoom,
                zoomMeetingJoinLink: res.meeting_join_link,
                zoomMeetingStartLink: res.meeting_start_link,
                zoomMeetingPasswordGeneral: res.meeting_password_general,
                zoomMeetingPasswordH323: res.meeting_h323_password,
                zoomMeetingPassworsPstn: res.meeting_pstn_password,
                startDateByIST: res["Start Date By Indian Time"],
                endDateByIST: res["End Date By Indian Time"],
                startDateByUserTimeZone:startDateByUserTimeZoneParsed.toDate(),
                endDateByUserTimeZone: endDateByUserTimeZoneParsed.toDate(),
                startDateByUserTimeZoneString : res["Start Date By User Time Zone"],
                endDateByUserTimeZoneString : res["End Date By User Time Zone"],
                attendeesEmailAll: res.attendees_email_all,
                attendeesCompanyUserId: res.attendees_company_user_id,
                isAttendeePresent: res.attendees_email_all ? true : false,
                platform: 2,
                isActive: res.isactive,
                createdBy: res.createdby,
                updatedBy: res.updatedby,
                createdOn: res.createdon,
                updatedOn: res.updatedon,
                creatorAttenting: res.creator_attending,
              },
            ]);
          });
        }
      })
      .catch(async (error: ApiError | any) => {
        console.log(error);
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunction: getZoomMeeting,
          });
          if (refreshTokenStatus) {
            setIsSessionExpiredDialogueOpen(false);
          } else {
            setIsSessionExpiredDialogueOpen(true);
          }
        } else if (error.status === STATUS_CODE.FORBIDDEN) {
          setIsSessionExpiredDialogueOpen(true);
        }
      });
  };

  const eventStyleGetter = (event: CalendarEventType) => {
    let backgroundColor = "";
    let color = "";
    if (event.creatorAttenting === "Creator") {
      if (event.platform === 1 && event.isActive && view !== "agenda") {
        backgroundColor = "#24bf26";
        color = "black";
      } else if (event.platform === 2 && event.isActive && view !== "agenda") {
        backgroundColor = "blue";
        color = "white";
      } else if (event.platform === 3 && event.isActive && view !== "agenda") {
        backgroundColor = "lightcoral";
      } else if (!event.isActive && view !== "agenda") {
        backgroundColor = "#de1f65";
        color = "white";
      } else if (view === "agenda") {
        backgroundColor = "#1e88e5";
        color = !event.isActive ? "red" : "white";
      }
    } else if (event.creatorAttenting === "Attending") {
      if (event.creatorAttenting === "Attending") {
        if (event.platform === 1 && event.isActive && view !== "agenda") {
          backgroundColor = "#58e858";
          color = "black";
        } else if (
          event.platform === 2 &&
          event.isActive &&
          view !== "agenda"
        ) {
          backgroundColor = "#2895d4";
          color = "white";
        } else if (
          event.platform === 3 &&
          event.isActive &&
          view !== "agenda"
        ) {
          backgroundColor = "#de1f65";
        } else if (!event.isActive && view !== "agenda") {
          backgroundColor = "#de1f65";
          color = "white";
        } else if (view === "agenda") {
          backgroundColor = "#1e88e5";
          color = !event.isActive ? "red" : "white";
        }
      }
    }

    const style = {
      backgroundColor: backgroundColor,
      borderRadius: "5px",
      opacity: 0.7,
      color: color,
      textSize: "12px",
      border: "0px",
      height: view === "agenda" ? "20px" : "auto",
      display: view === "agenda" ? "flex-1" : "block",
      marginTop: view === "agenda" ? "2px" : "0px",
      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)", // Adding a subtle shadow
      fontSize: "0.8em", // Making the text extra small
    };

    return {
      style: style,
    };
  };

  // const [events, setEvents] = useState(hardcodedEvents);

  const goToToday = useCallback(() => {
    setCurrentViewDate(new Date());
    if (view === "agenda") {
      
      setConcatDate(
        `${moment(new Date).format("DD-MMM-YYYY")}@${moment(
          new Date()
        ).add(1,"months").format("DD-MMM-YYYY")}`
      );
    } else if (view === "day") {
      console.log(`${moment(new Date()).format("DD-MMM-YYYY")}@${moment(
          new Date()
        ).format("DD-MMM-YYYY")}`)
      setConcatDate(
        `${moment(new Date()).format("DD-MMM-YYYY")}@${moment(
          new Date()
        ).format("DD-MMM-YYYY")}`
      );
    } else if (view === "month") {
      setConcatDate(
        `${moment(new Date())
          .startOf("months")
          .format("DD-MMM-YYYY")}@${moment(new Date())
          .endOf("months")
          .format("DD-MMM-YYYY")}`
      );
    } else if (view === "week") {
      setConcatDate(
        `${moment(new Date())
          .startOf("week")
          .format("DD-MMM-YYYY")}@${moment(new Date())
          .endOf("week")
          .format("DD-MMM-YYYY")}`
      );
    }
  }, []);

  const goBack = useCallback(() => {
    setCurrentViewDate(
      moment(currentViewDate)
        .subtract(
          1,
          view === "month" ? "months" : view === "week" ? "weeks" : "days"
        )
        .toDate()
    );

    if (view === "agenda") {
      setConcatDate(
        `${moment(currentViewDate)
          .subtract(1, "days")
          .format("DD-MMM-YYYY")}@${moment(currentViewDate)
          .add(1, "months")
          .format("DD-MMM-YYYY")}`
      );
    } else if (view === "month") {
      setConcatDate(
        `${moment(currentViewDate)
          .subtract(1, "months")
          .startOf("month")
          .format("DD-MMM-YYYY")}@${moment(currentViewDate)
          .subtract(1, "months")
          .endOf("month")
          .format("DD-MMM-YYYY")}`
      );
    } else if (view === "week") {
      setConcatDate(
        `${moment(currentViewDate)
          .subtract(1, "week")
          .startOf("week")
          .format("DD-MMM-YYYY")}@${moment(currentViewDate)
          .subtract(1, "week")
          .endOf("week")
          .format("DD-MMM-YYYY")}`
      );
    } else if (view === "day") {
      setConcatDate(
        `${moment(currentViewDate)
          .subtract(1, "days")
          .format("DD-MMM-YYYY")}@${moment(currentViewDate)
          .subtract(1, "days")
          .format("DD-MMM-YYYY")}`
      );
    }
  }, [currentViewDate, view]);

  const goNext = useCallback(() => {
    
    setCurrentViewDate(
      moment(currentViewDate)
        .add(
          1,
          view === "month" ? "months" : view === "week" ? "weeks" : "days"
        )
        .toDate()
    );

    if (view === "agenda") {
      setConcatDate(
        `${moment(currentViewDate)
          .add(1, "days")
          .format("DD-MMM-YYYY")}@${moment(currentViewDate)
          .add(1, "months")
          .format("DD-MMM-YYYY")}`
      );
    } else if (view === "month") {
      setConcatDate(
        `${moment(currentViewDate)
          .add(1, "months")
          .startOf("month")
          .format("DD-MMM-YYYY")}@${moment(currentViewDate)
          .add(1, "months")
          .endOf("month")
          .format("DD-MMM-YYYY")}`
      );
    } else if (view === "week") {
      setConcatDate(
        `${moment(currentViewDate)
          .add(1, "week")
          .startOf("week")
          .format("DD-MMM-YYYY")}@${moment(currentViewDate)
          .add(1, "week")
          .endOf("week")
          .format("DD-MMM-YYYY")}`
      );
    } else if (view === "day") {
      setConcatDate(
        `${moment(currentViewDate)
          .add(1, "days")
          .format("DD-MMM-YYYY")}@${moment(currentViewDate)
          .add(1, "days")
          .format("DD-MMM-YYYY")}`
      );
    }
  }, [currentViewDate, view]);

  const onViewChange = useCallback((newView: View) => {
   
    setView(newView);
    
  }, []);

  const handleViewChange = (newView : View) => {
     if (newView === "agenda") {
      setConcatDate(
        `${moment(currentViewDate).format("DD-MMM-YYYY")}@${moment(
          currentViewDate
        ).add(1,"months").format("DD-MMM-YYYY")}`
      );
    } else if (newView === "day") {
      setConcatDate(
        `${moment(currentViewDate).format("DD-MMM-YYYY")}@${moment(
          currentViewDate
        ).format("DD-MMM-YYYY")}`
      );
    } else if (newView === "month") {
      setConcatDate(
        `${moment(currentViewDate)
          .startOf("month")
          .format("DD-MMM-YYYY")}@${moment(currentViewDate)
          .endOf("month")
          .format("DD-MMM-YYYY")}`
      );
    } else if (newView === "week") {
      setConcatDate(
        `${moment(currentViewDate)
          .startOf("week")
          .format("DD-MMM-YYYY")}@${moment(currentViewDate)
          .endOf("week")
          .format("DD-MMM-YYYY")}`
      );
    }
  }
  const onDateChange = useCallback((newDate: Date) => {
    console.log(currentViewDate + " - " + newDate);
    setCurrentViewDate(newDate);
  }, []);

  const handleMeetingDetailsUpdate = () => {
    setMeetDetailsUpdateCount(meetingDetailsUpdateCount + 1);
  };

  const handleSessionExpiredDialogueConfirm = () => {
    setIsSessionExpiredDialogueOpen(false);
    localStorage.clear();
    navigate(ROUTES_URL.SIGN_IN);
  };

  useEffect(() => {
    getGoogleMeeting();
    console.log(view);
  }, [meetingDetailsUpdateCount,concatDate]);
  return (
    <div className="bg-white w-full">
      {showConnectToPlatform && (
        <div className="grid">
          <span className="text-center text-pretty font-semibold text-xl text-gray-800">
            Manage Your Meetings
          </span>
        </div>
      )}

      <div className="flex gap-6">
        {/**Meet */}
        {showConnectToPlatform && (
          <>
            <div className="content-center max-w-24 text-xs">
              <Button
                onClick={() => {
                  //google meet button
                }}
              >
                <div className="flex gap-2 justify-center cursor-pointer">
                  <svg
                    height="20px"
                    viewBox="0 0 48 48"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      fill="#fff"
                      height="16"
                      transform="rotate(-90 20 24)"
                      width="16"
                      x="12"
                      y="16"
                    />
                    <polygon
                      fill="#1e88e5"
                      points="3,17 3,31 8,32 13,31 13,17 8,16"
                    />
                    <path
                      d="M37,24v14c0,1.657-1.343,3-3,3H13l-1-5l1-5h14v-7l5-1L37,24z"
                      fill="#4caf50"
                    />
                    <path
                      d="M37,10v14H27v-7H13l-1-5l1-5h21C35.657,7,37,8.343,37,10z"
                      fill="#fbc02d"
                    />
                    <path
                      d="M13,31v10H6c-1.657,0-3-1.343-3-3v-7H13z"
                      fill="#1565c0"
                    />
                    <polygon fill="#e53935" points="13,7 13,17 3,17" />
                    <polygon
                      fill="#2e7d32"
                      points="38,24 37,32.45 27,24 37,15.55"
                    />
                    <path
                      d="M46,10.11v27.78c0,0.84-0.98,1.31-1.63,0.78L37,32.45v-16.9l7.37-6.22C45.02,8.8,46,9.27,46,10.11z"
                      fill="#4caf50"
                    />
                  </svg>
                  <span>Meet</span>
                </div>
              </Button>
            </div>

            {/**Zoom */}
            <div className="content-center max-w-24 text-xs">
              <Button
                onClick={() => {
                  //Zoom Button
                }}
              >
                <div className=" flex gap-2 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                  >
                    <circle cx="24" cy="24" r="20" fill="#2196f3"></circle>
                    <path
                      fill="#fff"
                      d="M29,31H14c-1.657,0-3-1.343-3-3V17h15c1.657,0,3,1.343,3,3V31z"
                    ></path>
                    <polygon
                      fill="#fff"
                      points="37,31 31,27 31,21 37,17"
                    ></polygon>
                  </svg>
                  <span>Zoom</span>
                </div>
              </Button>
            </div>

            {/**Teams */}
            <div className="content-center max-w-24 text-xs">
              <Button>
                <div className="flex gap-2 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#5059c9"
                      d="M44,22v8c0,3.314-2.686,6-6,6s-6-2.686-6-6V20h10C43.105,20,44,20.895,44,22z M38,16	c2.209,0,4-1.791,4-4c0-2.209-1.791-4-4-4s-4,1.791-4,4C34,14.209,35.791,16,38,16z"
                    ></path>
                    <path
                      fill="#7b83eb"
                      d="M35,22v11c0,5.743-4.841,10.356-10.666,9.978C19.019,42.634,15,37.983,15,32.657V20h18	C34.105,20,35,20.895,35,22z M25,17c3.314,0,6-2.686,6-6s-2.686-6-6-6s-6,2.686-6,6S21.686,17,25,17z"
                    ></path>
                    <circle cx="25" cy="11" r="6" fill="#7b83eb"></circle>
                    <path
                      d="M26,33.319V20H15v12.657c0,1.534,0.343,3.008,0.944,4.343h6.374C24.352,37,26,35.352,26,33.319z"
                      opacity=".05"
                    ></path>
                    <path
                      d="M15,20v12.657c0,1.16,0.201,2.284,0.554,3.343h6.658c1.724,0,3.121-1.397,3.121-3.121V20H15z"
                      opacity=".07"
                    ></path>
                    <path
                      d="M24.667,20H15v12.657c0,0.802,0.101,1.584,0.274,2.343h6.832c1.414,0,2.56-1.146,2.56-2.56V20z"
                      opacity=".09"
                    ></path>
                    <linearGradient
                      id="DqqEodsTc8fO7iIkpib~Na_zQ92KI7XjZgR_gr1"
                      x1="4.648"
                      x2="23.403"
                      y1="14.648"
                      y2="33.403"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stop-color="#5961c3"></stop>
                      <stop offset="1" stop-color="#3a41ac"></stop>
                    </linearGradient>
                    <path
                      fill="url(#DqqEodsTc8fO7iIkpib~Na_zQ92KI7XjZgR_gr1)"
                      d="M22,34H6c-1.105,0-2-0.895-2-2V16c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v16	C24,33.105,23.105,34,22,34z"
                    ></path>
                    <path
                      fill="#fff"
                      d="M18.068,18.999H9.932v1.72h3.047v8.28h2.042v-8.28h3.047V18.999z"
                    ></path>
                  </svg>
                  <span>Teams</span>
                </div>
              </Button>
            </div>
          </>
        )}

        <div className="content-center">
          <Button
            onClick={() => {
              // setScheduleMeetingModalOpen(true);
              if (isMeetingModalOpenFromProp) {
                navigate(
                  ROUTES_URL.SCHEDULE_MEETING +
                    "?from=" +
                    window.location.pathname
                );
              } else {
                sessionStorage.setItem(
                  "leadData",
                  JSON.stringify(leadDataSearchParams!)
                );
                navigate(ROUTES_URL.SCHEDULE_MEETING);
              }
            }}
          >
            Schedule Meeting
          </Button>
        </div>
      </div>

      {isCalendarViewEnabled && (
        <div className="flex border rounded-lg shadow-md overflow-hidden">
          {/* <div style={{ height: 400,width:700}}>
      <Calendar
        localizer={localizer}
        events={hardcodedEvents}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(e)=>{
          alert(e.title)
        }}
        dayPropGetter={dayPropGetter}
      />
    </div> */}
          <div className="w-full">
            <div className="flex flex-col gap-1">
              {view === "month" && (
                <h1 className="text-gray-600 font-medium text-center">
                  {moment(currentViewDate).startOf("month").format("MMMM YYYY")}
                </h1>
              )}
              {view === "week" && (
                <h1 className="text-gray-600 font-medium text-center">
                  {moment(currentViewDate).startOf("week").format("DD/MM/YY") +
                    " - " +
                    moment(currentViewDate).endOf("week").format("DD/MM/YY")}
                </h1>
              )}
              {view === "day" && (
                <h1 className="text-gray-600 font-medium text-center">
                  {moment(currentViewDate).format("DD/MM/YY")}
                </h1>
              )}
              {view === "agenda" && (
                <h1 className="text-gray-600 font-medium text-center">
                  Agenda Onwards{" "}
                  {moment(currentViewDate)
                    .startOf("days")
                    .toDate()
                    .toDateString()}
                </h1>
              )}
              <div className="flex items-center gap-2 justify-between w-full">
                <div className="flex items-center gap-2">
                  <Button title="Previous" onClick={goBack}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button title="Current Date" onClick={goToToday}>
                    <Clock className="h-4 w-4" />
                  </Button>
                  <Button title="Next" onClick={goNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 justify-self-center">
                  {viewNames.map((viewName) => (
                    <Button
                      key={viewName}
                      title={
                        viewName === "month"
                          ? "Month"
                          : viewName === "week"
                          ? "Week"
                          : viewName === "day"
                          ? "Day"
                          : "Agenda"
                      }
                      size="sm"
                      onClick={() =>{
                        handleViewChange(viewName as "month" | "week" | "day" | "agenda")
                        setView(viewName as "month" | "week" | "day" | "agenda")
                      }
                      }
                    >
                      {viewName === "month" && (
                        <CalendarIcon className="justify-self-center place-content-center h-4 w-4 text-gray-600" />
                      )}
                      {viewName === "week" && (
                        <LayoutList className="ustify-self-center place-content-center h-4 w-4 text-gray-600" />
                      )}
                      {viewName === "day" && (
                        <Layout className="ustify-self-center place-content-center h-4 w-4 text-gray-600" />
                      )}
                      {viewName === "agenda" && (
                        <List className="ustify-self-center place-content-center h-4 w-4 text-gray-600" />
                      )}
                      {/* {viewName.charAt(0).toUpperCase() + viewName.slice(1)} */}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="border rounded-lg shadow-md overflow-hidden">
                <Calendar
                  localizer={localizer}
                  events={googleMeetEventData}
                  startAccessor="startDateByUserTimeZone"
                  endAccessor="endDateByUserTimeZone"
                  date={currentViewDate}
                  onNavigate={onDateChange}
                  onView={onViewChange}
                  view={view}
                  style={{ height: 400 }}
                  className="text-gray-800 text-base"
                  toolbar={false}
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={(event) => {
                    console.log(event);
                    setSelectedMeetingEvent(event);
                    setIsEditMettingModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditMettingModalOpen && (
        <EditMeetingDetailsModal
          isOpen={isEditMettingModalOpen}
          meetingDetails={selectedMeetingEvent!}
          onClose={() => {
            setIsEditMettingModalOpen(false);
          }}
          isAttendeesPresent={selectedMeetingEvent.isAttendeePresent}
          handleMeetingDetailsUpdate={handleMeetingDetailsUpdate}
        />
      )}

      <DialogueBox
        isOpen={isSessionExpiredDialogueOpen}
        onClose={() => setIsSessionExpiredDialogueOpen(false)}
        onConfirm={handleSessionExpiredDialogueConfirm}
        title="Session Expired !"
        message="Session Expired. Please login again."
      />
    </div>
  );
}

export default LeadMeetingsModal;
