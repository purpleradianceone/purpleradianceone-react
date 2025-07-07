/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Phone,
  Mail,
  CalendarCheck,
  HeadsetIcon,
  HandCoinsIcon,
  Notebook,
  Clipboard,
  History,
  LucideLaptop,
} from "lucide-react"; // Corrected import for Lucide React icons
import CustomDropdown from "../CustomDropdown";
import LeadTaskPriorityType from "../../../../@types/lead-management/LeadTaskPriorityType";
import LeadActivityType from "../../../../@types/lead-management/LeadActivityType";
import LeadTaskType from "../../../../@types/lead-management/LeadTaskType";
import { useState } from "react";
import UpdateLeadTaskModal from "./UpdateLeadTaskModal";
import LeadTaskStageType from "../../../../@types/lead-management/LeadTaskStageType";
import LeadContactType from "../../../../@types/lead-management/LeadContact";
import LeadTaskHistoryModal from "./LeadTaskHistoryModal";
import CalendarEventType from "../../../../@types/meeting/CalendarEventType";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import { useUserPreference } from "../../../../context/user/UserPreference";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import momentTimezone from "moment-timezone";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import EditMeetingDetailsModal from "../../meetings/EditMeetingDetailsModal";
import { useMeetingPlatform } from "../../../../config/hooks/useMeetingPlatforms";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";

function LeadTaskList({
  leadTaskPriority,
  leadActivity,
  leadTaskStage,
  leadTasks,
  handleLeadActivityFilterDropdownChange,
  handleLeadPriorityFilterDropdownChange,
  handleLeadTaskUpdate,
  isLoading
}: {
  leadTaskPriority: LeadTaskPriorityType[];
  leadActivity: LeadActivityType[];
  leadTasks: LeadTaskType[];
  leadTaskStage: LeadTaskStageType[];
  handleLeadActivityFilterDropdownChange: (leadActivityId: number) => void;
  handleLeadPriorityFilterDropdownChange: (leadTaskPriorityId: number) => void;
  handleLeadTaskUpdate: () => void;
  isLoading : boolean
}) {
  const [isUpdateLeadTaskModalOpen, setIsUpdateLeadTaskModalOpen] =
    useState<boolean>(false);
  const [selecedLeadTask, setSelecedLeadTask] = useState<LeadTaskType>();
  // State to manage expanded card
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [seletedLeadTaskForHistory, setSeletedLeadTaskForHistory] = useState<LeadTaskType>();
  const [isLeadTaskHistoryModalOpen, setIsLeadTaskHistoryModalOpen] = useState<boolean>(false);
  const {loginStatus} = useLoggedInUserContext();

    const [googleMeetEventData, setGoogleMeetEventData] = useState<
    CalendarEventType
  >();

    const {meetingPlatform} = useMeetingPlatform();
      const [isEditMettingModalOpen, setIsEditMettingModalOpen] =
    useState<boolean>(false);

    const { userPreference } = useUserPreference();
    const backEndDateFormat = "YYYY-MM-DD HH:mm:ss.S";

  const getActivityIcon = (
    type: LeadTaskType["leadActivityId"],
    colorCode: string
  ) => {
    switch (type) {
      case 1:
        return (
          <Phone
            style={{
              color: colorCode,
            }}
            size={20}
          />
        );
      case 2:
        return (
          <Mail
            style={{
              color: colorCode,
            }}
            size={20}
          />
        );
      case 3:
        return (
          <CalendarCheck
            style={{
              color: colorCode,
            }}
            size={20}
          />
        );
      case 4:
        return (
          <HeadsetIcon
            style={{
              color: colorCode,
            }}
            size={20}
          />
        );
      case 5:
        return (
          <LucideLaptop
            style={{
              color: colorCode,
            }}
            size={20}
          />
        );
      case 6:
        return (
          <HandCoinsIcon
            style={{
              color: colorCode,
            }}
            size={20}
          />
        );
      case 7:
        return (
          <Notebook
            style={{
              color: colorCode,
            }}
            size={20}
          />
        );
      case 8:
        return (
          <Clipboard
            style={{
              color: colorCode,
            }}
            size={20}
          />
        );
      default:
        return null;
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const getLeadTaskJsonData = (activity: LeadTaskType) => {
    if (activity.leadActivityId !== 3 && activity.leadActivityId !== 4) {
      return JSON.parse(activity.leadActivityDetails).leadContact;
    } else {
      if(activity.leadActivityId === 3){
           return JSON.parse(activity.leadActivityDetails).address;
      }
      else if(activity.leadActivityId === 4){
         const meetingDetails = JSON.parse(activity.leadActivityDetails).meetingDetails;
          return meetingDetails;
      }
     
    }
  };

   const getGoogleMeeting = async (activity : LeadTaskType) => {
    
   if(activity.leadActivityId === 4){
   
    const meetingDetails = getLeadTaskJsonData(activity).find((meetingDetails: any) => {
                                      return meetingDetails.meetingId;
                                    })
     const getGoogleMeetingsPostData = {
      company_id: loginStatus.companyId,
      id : meetingDetails.meetingId,
      company_user_id: loginStatus.id,
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
            setGoogleMeetEventData(
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
                startDateByUserTimeZoneString: res["Start Date By User Time Zone"],
                endDateByUserTimeZoneString: res["End Date By User Time Zone"],
                endDateByUserTimeZone: endDateByUserTimeZoneParsed.toDate(),
                colorCode : res.color_code,
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
            );
            setIsEditMettingModalOpen(true);
          });
         
        }
      })
      .catch(async (error: ApiError | any) => {
        console.log(error);
          setIsEditMettingModalOpen(false);
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithParamsNotEvent: getGoogleMeeting,
          });
          if (refreshTokenStatus) {
            getGoogleMeeting(activity);
            // setIsSessionExpiredDialogueOpen(false);
          } else {
            // setIsSessionExpiredDialogueOpen(true);
          }
        } else if (error.status === STATUS_CODE.FORBIDDEN) {
          // setIsSessionExpiredDialogueOpen(true);
        }
      });
   }
  };
   const getZoomMeeting = async (activity : LeadTaskType) => {

      const meetingDetails = getLeadTaskJsonData(activity).find((meetingDetails: any) => {
                                      return meetingDetails.meetingId;
                                    })
     const getZoomMeetingsPostData = {
      company_id: loginStatus.companyId,
      id : meetingDetails.meetingId,
      company_user_id: loginStatus.id,
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

            console.log("endDate By User Time Zone : ");
            console.log(endDateByUserTimeZoneParsed);
            setGoogleMeetEventData(
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
                startDateByUserTimeZone: startDateByUserTimeZoneParsed.toDate(),
                endDateByUserTimeZone: endDateByUserTimeZoneParsed.toDate(),
                startDateByUserTimeZoneString:
                  res["Start Date By User Time Zone"],
                endDateByUserTimeZoneString: res["End Date By User Time Zone"],
                colorCode : res.color_code,
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
            );
            setIsEditMettingModalOpen(true);
          });
        }
      })
      .catch(async (error: ApiError | any) => {
        console.log(error);
        setIsEditMettingModalOpen(false)
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithParamsNotEvent: getZoomMeeting,
          });
          if (refreshTokenStatus) {
            getZoomMeeting(activity)
          } 
        } 
        // else if (error.status === STATUS_CODE.FORBIDDEN) {
        //   setIsSessionExpiredDialogueOpen(true);
        // }
      });
  };

  return (
    <>
      <div className="flex mt=0 p-0">
        <div className="flex justify-between w-full">
          <div className="min-w-48">
            <CustomDropdown
              labelName="type"
              onSelect={(e) => {
                if (e) {
                  handleLeadActivityFilterDropdownChange(e);
                } else {
                  handleLeadActivityFilterDropdownChange(0);
                }
              }}
              options={leadActivity}
            ></CustomDropdown>
          </div>

          <div className="min-w-48">
            <CustomDropdown
              labelName="priority"
              onSelect={(e) => {
                if (e) {
                  handleLeadPriorityFilterDropdownChange(e);
                } else {
                  handleLeadPriorityFilterDropdownChange(0);
                }
              }}
              options={leadTaskPriority}
            ></CustomDropdown>
          </div>
        </div>
      </div>
      <div className="p-1 bg-gray-50 min-h-72">
        <div className="max-w-4x mx-auto">
          { isLoading ? (
            <div className="flex justify-center py-10">
                  <LoadingSpinner></LoadingSpinner>
            </div>
            
          )
          : leadTasks.length === 0 ? (
            <p className="text-center  text-gray-600 text-lg py-10">
              No activities found.
            </p>
          ) : (
            <div
              className="space-y-2 max-h-72 overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-50
    [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
            >
              {leadTasks.map((activity) => (
                <div
                  key={activity.id}
                  className={`bg-${activity.colorCode} min-h-16 px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex items-start space-x-2 border border-gray-100 relative`}
                >
                  {/* Activity Icon */}
                  <div className="flex-shrink-0 p-1 bg-blue-100 rounded-full">
                    {" "}
                    {getActivityIcon(
                      activity.leadActivityId,
                      activity.colorCode
                    )}
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">
                      {" "}
                      {activity.subject}
                    </p>
                    {expandedCardId === activity.id ? (
                      <div className="text-xs text-gray-600">
                        <p className="pb-1 pt-2">
                          <div>
                            <span className="font-semibold text-blue-700">
                              Description :{" "}
                            </span>{" "}
                            <span className="font-medium ">
                              {activity.description}
                            </span>{" "}
                          </div>
                          <div className="mt-1">
                            <span className="font-semibold text-blue-700">
                              Assignees :{" "}
                            </span>{" "}
                            <div className="grid grid-cols-3">
                              {activity.assignedToName.map((name) => (
                                <span
                                  key={name} // Added key for list items
                                  className="bg-blue-400 m-1 text-center rounded-full px-1 font-medium"
                                  title={name} // Added title for better UX
                                >
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="mt-1">
                              <span className="font-semibold text-blue-700">
                                {activity.leadActivityId !== 3 && activity.leadActivityId !== 4
                                  ? "Contact : "
                                  : activity.leadActivityId !== 4 ? "Address : " : "Meeting : "}
                              </span>{" "}
                              <div
                                className={
                                  activity.leadActivityId !== 3 && activity.leadActivityId !== 4
                                    ? "grid grid-cols-2 text-center"
                                    : "inline-block"
                                }
                              >
                                {activity.leadActivityId !== 3 && activity.leadActivityId !== 4 ? (
                                  getLeadTaskJsonData(activity).map(
                                    (contact: LeadContactType) => (
                                      <span
                                        key={contact.id} // Assuming contact has an id
                                        className="bg-blue-400 m-1 rounded-full px-1 font-medium"
                                      >
                                        {contact.name}
                                      </span>
                                    )
                                  )
                                ) : activity.leadActivityId !== 4 ?(
                                  
                                  <span className="bg-white rounded-full font-medium">
                                    {getLeadTaskJsonData(activity)}
                                  </span>
                                ) : (
                                   <span className="bg-white rounded-full font-medium">
                                    {getLeadTaskJsonData(activity).map((meetingDetails: any) => {
                                      return meetingDetails.meetingSummary;
                                    })}
                                     <button
                          onClick={() =>  {
                            
                            const platform = getLeadTaskJsonData(activity).map((meetingDetails: any) => {
                                      return meetingDetails.platform;
                                    })
                                    // console.log(platform[0] === 1);
                                  if(platform[0] === 1){
                                    console.log(platform)
                                    getGoogleMeeting(activity);
                                  }
                                  else if(platform[0] === 2){
                                        getZoomMeeting(activity);
                                  }
                                  }}
                          className="text-blue-500 hover:underline text-xs ml-3 focus:outline-none"
                        >
                          View Details
                        </button>
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="font-semibold text-blue-700">
                              Outcome :{" "}
                            </span>{" "}
                            <span className="font-medium">
                              {activity.resultOutcome}
                            </span>{" "}
                          </div>
                        </p>
                        <button
                          onClick={() => toggleExpand(activity.id)}
                          className="text-blue-500 hover:underline text-xs focus:outline-none"
                        >
                          View Less
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600">
                        <p className="truncate mt-1">
                          <div className="mt-1">
                            <span className="font-semibold text-blue-700">
                              Description :{" "}
                            </span>{" "}
                            <span className="font-medium">
                              {activity.description}
                            </span>{" "}
                          </div>
                          <div className="mt-1">
                            <span className="font-semibold text-blue-700">
                              Assignees :{" "}
                            </span>{" "}
                            {activity.assignedToName.map((name) => (
                              <span
                                key={name} // Added key for list items
                                className="bg-blue-400 mx-1 rounded-full px-1 font-medium"
                                title={name} // Added title for better UX
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </p>
                        {activity.subject.length > 0 && ( // Adjust threshold as needed
                          <button
                            onClick={() => toggleExpand(activity.id)}
                            className="text-blue-500 hover:underline text-xs focus:outline-none"
                          >
                            View More
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Date and Action Buttons */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1">
                    <span className="text-xs text-gray-500">
                      {activity.dueDateTime}
                    </span>
                    <button
                      onClick={() => {
                        setIsUpdateLeadTaskModalOpen(true);
                        setSelecedLeadTask(activity);
                      }}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setIsLeadTaskHistoryModalOpen(true);
                        setSeletedLeadTaskForHistory(activity)
                      }}
                      className="px-2 py-1 bg-white text-gray-500 rounded hover:bg-gray-200 transition-colors text-xs"
                    >
                      <History size={16} /> {/* Adjusted size for better fit */}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {isUpdateLeadTaskModalOpen && (
          <UpdateLeadTaskModal
            isOpen={isUpdateLeadTaskModalOpen}
            handleClose={(value: boolean) => {
              setIsUpdateLeadTaskModalOpen(value);
            }}
            leadActivity={leadActivity}
            leadTask={selecedLeadTask!}
            leadTaskPriority={leadTaskPriority}
            leadTaskStage={leadTaskStage}
            handleLeadTaskUpdate={handleLeadTaskUpdate}
          />

          
        )}


        <LeadTaskHistoryModal
          isOpen = {isLeadTaskHistoryModalOpen}
          handleClose={(status : boolean)=>{
              setIsLeadTaskHistoryModalOpen(status)
          }}
          leadTask={seletedLeadTaskForHistory!}
          ></LeadTaskHistoryModal>
          
          {isEditMettingModalOpen && (
                <EditMeetingDetailsModal
        meetingPlatform={meetingPlatform}
          isOpen={isEditMettingModalOpen}
          meetingDetails={googleMeetEventData!}
          onClose={() => {
            setIsEditMettingModalOpen(false);
          }}
          isAttendeesPresent={googleMeetEventData!.isAttendeePresent}
          handleMeetingDetailsUpdate={(date : string , summary : string) => {
            console.log(date);
            console.log(summary);
          }}
        />
          )}
           
      </div>
    </>
  );
}

export default LeadTaskList;