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
import POST_API from "../../../../constants/PostApi";
import { useUserPreference } from "../../../../context/user/UserPreference";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import momentTimezone from "moment-timezone";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import EditMeetingDetailsModal from "../../meetings/EditMeetingDetailsModal";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import MeetingPlatforms from "../../../../@types/meeting/MeetingPlatform";
import axiosClient from "../../../../axios-client/AxiosClient";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import toast from "react-hot-toast";
import MESSAGE from "../../../../constants/Messages";
import Button from "../../../ui/Button";
import { taskPriorityStyles } from "../../../../utils/colourSpecifierForNameInAggrid";

function LeadTaskList({
  leadTaskPriority,
  leadActivity,
  leadTaskStage,
  leadTasks,
  handleLeadActivityFilterDropdownChange,
  handleLeadPriorityFilterDropdownChange,
  handleLeadTaskUpdate,
  isLoading,
  meetingPlatform,
}: {
  leadTaskPriority: LeadTaskPriorityType[];
  leadActivity: LeadActivityType[];
  leadTasks: LeadTaskType[];
  leadTaskStage: LeadTaskStageType[];
  handleLeadActivityFilterDropdownChange: (leadActivityId: number) => void;
  handleLeadPriorityFilterDropdownChange: (leadTaskPriorityId: number) => void;
  handleLeadTaskUpdate: () => void;
  isLoading: boolean;
  meetingPlatform: MeetingPlatforms[];
}) {
  const { userHasAccessToUpdateLeadTasks} = useUserAccessModules();
  const [isUpdateLeadTaskModalOpen, setIsUpdateLeadTaskModalOpen] =
    useState<boolean>(false);
  const [selecedLeadTask, setSelecedLeadTask] = useState<LeadTaskType>();
  // State to manage expanded card
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [seletedLeadTaskForHistory, setSeletedLeadTaskForHistory] =
    useState<LeadTaskType>();
  const [isLeadTaskHistoryModalOpen, setIsLeadTaskHistoryModalOpen] =
    useState<boolean>(false);
  const { loginStatus } = useLoggedInUserContext();

  const [googleMeetEventData, setGoogleMeetEventData] =
    useState<CalendarEventType>();

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
            size={16}
          />
        );
      case 2:
        return (
          <Mail
            style={{
              color: colorCode,
            }}
            size={16}
          />
        );
      case 3:
        return (
          <CalendarCheck
            style={{
              color: colorCode,
            }}
            size={16}
          />
        );
      case 4:
        return (
          <HeadsetIcon
            style={{
              color: colorCode,
            }}
            size={16}
          />
        );
      case 5:
        return (
          <LucideLaptop
            style={{
              color: colorCode,
            }}
            size={16}
          />
        );
      case 6:
        return (
          <HandCoinsIcon
            style={{
              color: colorCode,
            }}
            size={16}
          />
        );
      case 7:
        return (
          <Notebook
            style={{
              color: colorCode,
            }}
            size={16}
          />
        );
      case 8:
        return (
          <Clipboard
            style={{
              color: colorCode,
            }}
            size={16}
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
      if (activity.leadActivityId === 3) {
        return JSON.parse(activity.leadActivityDetails).address;
      } else if (activity.leadActivityId === 4) {
        const meetingDetails = JSON.parse(
          activity.leadActivityDetails
        ).meetingDetails;
        return meetingDetails;
      }
    }
  };

  const handleQuickStageUpdate = async (
  activity: LeadTaskType,
  updatedStageId: number
) => {
  try {
    const updateLeadTaskPostData = {
      company_id: loginStatus.companyId,
      id: activity.id,
      lead_task_priority_id: activity.leadTaskPriorityId,
      lead_task_stage_id: updatedStageId,
      subject: activity.subject,
      description: activity.description,
      result_outcome: activity.resultOutcome,
      assignedto: activity.assignedToId,
      due_date_time: activity.dueDateTime,
      lead_activity_details: activity.leadActivityDetails,
      isactive: activity.isActive,
      updatedby_id: loginStatus.id,
    };

    const response = await axiosClient.post(
      POST_API.UPDATE_LEAD_TASK,
      updateLeadTaskPostData,
      {
        withCredentials: true,
      }
    );

    if (response.status === STATUS_CODE.OK) {
      toast.success("Task status updated");
      handleLeadTaskUpdate();
    }
  } catch (error) {
    toast.error("Failed to update status");
  }
};

  const getGoogleMeeting = async (activity: LeadTaskType) => {
    if (activity.leadActivityId === 4) {
      const meetingDetails = getLeadTaskJsonData(activity).find(
        (meetingDetails: any) => {
          return meetingDetails.meetingId;
        }
      );
      const getGoogleMeetingsPostData = {
        company_id: loginStatus.companyId,
        id: meetingDetails.meetingId,
        company_user_id: loginStatus.id,
        requestedby: loginStatus.id,
      };
      await axiosClient
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
              setGoogleMeetEventData({
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
                startDateByUserTimeZoneString:
                  res["Start Date By User Time Zone"],
                endDateByUserTimeZoneString: res["End Date By User Time Zone"],
                endDateByUserTimeZone: endDateByUserTimeZoneParsed.toDate(),
                colorCode: res.color_code,
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
              });
              setIsEditMettingModalOpen(true);
            });
          }
        })
        .catch(async (error: ApiError | any) => {
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
  const getZoomMeeting = async (activity: LeadTaskType) => {
    const meetingDetails = getLeadTaskJsonData(activity).find(
      (meetingDetails: any) => {
        return meetingDetails.meetingId;
      }
    );
    const getZoomMeetingsPostData = {
      company_id: loginStatus.companyId,
      id: meetingDetails.meetingId,
      company_user_id: loginStatus.id,
      requestedby: loginStatus.id,
    };
    await axiosClient
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
            setGoogleMeetEventData({
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
              colorCode: res.color_code,
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
            });
            setIsEditMettingModalOpen(true);
          });
        }
      })
      .catch(async (error: ApiError | any) => {
        setIsEditMettingModalOpen(false);
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithParamsNotEvent: getZoomMeeting,
          });
          if (refreshTokenStatus) {
            getZoomMeeting(activity);
          }
        }
        // else if (error.status === STATUS_CODE.FORBIDDEN) {
        //   setIsSessionExpiredDialogueOpen(true);
        // }
      });
  };

  return (
    <>
      <div className="flex ">
        <div className="flex justify-between w-full">
          <div className="min-w-32 ">
            <CustomDropdown
              labelName="type"
              height="h-[28px]"
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

          <div className="min-w-32">
            <CustomDropdown
              labelName="priority"
              height="h-[28px]"
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
      <div className="p-1 min-h-72  ">
        <div className=" max-w-4x mx-auto  justify-center  min-h-72 w-full">
          {isLoading ? (
            <div className="flex min-h-72 items-center justify-center  py-10">
              <LoadingSpinner></LoadingSpinner>
            </div>
          ) : leadTasks.length === 0 ? (
            <div className=" min-h-72   flex items-center justify-center">
              <p className="text-center caption-custom italic ">
                No activities found.
              </p>
            </div>
          ) : (
            <div
              className="space-y-2 max-h-72  overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-50
    [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
            >
              {leadTasks.map((activity) => (
  <div
  key={activity.id}
  className="
    bg-white border border-slate-200 rounded-md
    px-3 py-2
    hover:shadow-sm
    transition-all
    flex items-start justify-between gap-3
  "
>
  {/*  ICON + CONTENT */}
  <div className="flex flex-1 min-w-0 gap-2">
    <div className="flex-shrink-0 w-6 h-6 bg-violet-100 rounded-md flex items-center justify-center">
      {getActivityIcon(activity.leadActivityId, activity.colorCode)}
    </div>

    <div className="flex-1 min-w-0 flex flex-col gap-1 items-start">
      <p
        title={activity.subject}
        className="table-header-custom truncate"
      >
        {activity.subject.length > 50
          ? activity.subject.substring(0, 50) + "..."
          : activity.subject}
      </p>


      {expandedCardId === activity.id ? (
        <div className="caption-custom">

          <p className="pb-1 pt-2">
            <div className="flex gap-1">
              <span className="caption-custom-blue">Assignees : </span>
              <div className="grid grid-cols-2">
                {activity.assignedToName!.map((name) => (
                  <span key={name}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="caption-custom-blue">Description : </span>
              <span className="caption-custom">{activity.description}</span>
            </div>

            

            <div className="mt-0 pt-0">
              {activity.leadActivityDetails && (
                <div className="flex gap-2">
                  <span className="caption-custom-blue">
                    {activity.leadActivityId !== 3 &&
                    activity.leadActivityId !== 4
                      ? "Contact : "
                      : activity.leadActivityId !== 4
                      ? "Address:"
                      : "Meeting: "}
                  </span>

                  <div>
                    {activity.leadActivityId !== 3 &&
                    activity.leadActivityId !== 4
                      ? getLeadTaskJsonData(activity).map(
                          (contact: LeadContactType) => (
                            <span key={contact.id}>
                              {contact.name}
                            </span>
                          )
                        )
                      : activity.leadActivityId !== 4 ? (
                        <span>{getLeadTaskJsonData(activity)}</span>
                      ) : (
                        <span>
                          {getLeadTaskJsonData(activity).map(
                            (m: any) => m.meetingSummary
                          )}

                          <button
                            onClick={() => {
                              const platform = getLeadTaskJsonData(activity).map(
                                (m: any) => m.platform
                              );

                              if (platform[0] === 1) getGoogleMeeting(activity);
                              else if (platform[0] === 2) getZoomMeeting(activity);
                            }}
                            className="caption-custom-blue ml-3"
                          >
                            View Details
                          </button>
                        </span>
                      )}
                  </div>
                </div>
              )}
               <span className="caption-custom-blue">
                              Outcome :{" "}
                            </span>{" "}
                            <span className="caption-custom">
                              {activity.resultOutcome ?? (
                                <>
                                  <span className="italic text-xs font-normal text-gray-600">
                                    outcome not given
                                  </span>
                                </>
                              )}
                            </span>{" "}
            </div>
          </p>

          <button
            onClick={() => toggleExpand(activity.id)}
            className="caption-custom-blue"
          >
            View Less
          </button>
        </div>
      ) : (
        <div className="text-xs text-gray-600">

          <div className="mt-1">
            <span className="caption-custom-blue">Assignees : </span>
            {activity.assignedToName!.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
          <div>
            <span className="caption-custom-blue">Description : </span>
            {activity.description}
          </div>

          

          {activity.subject.length > 0 && (
            <button
              onClick={() => toggleExpand(activity.id)}
              className="caption-custom-blue"
            >
              View More
            </button>
          )}
        </div>
      )}
    </div>
  </div>

  {/* CENTER: DUE + STATUS + PRIORITY */}
  <div className="flex flex-col min-w-[240px] gap-2 items-start">

  {/* Due date */}
  <div className="flex items-center gap-1 text-red-500">
    <CalendarCheck size={14} />
    <span className="caption-custom">
      {activity.dueDateTime}
    </span>
  </div>


  <div className="flex items-center gap-4 w-full">

    <span
      className={`
        px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap
        ${taskPriorityStyles[activity.leadTaskPriorityName] ||
          "bg-slate-100 text-slate-700"}
      `}
    >
      {activity.leadTaskPriorityName}
    </span>


    <select
      value={activity.leadTaskStageId}
      onChange={(e) =>
        handleQuickStageUpdate(activity, Number(e.target.value))
      }
      className="border rounded-md px-2 py-1 caption-custom "
    >
      {leadTaskStage.map((stage) => (
        <option key={stage.id} value={stage.id}>
          {stage.name}
        </option>
      ))}
    </select>

    
  </div>

</div>

  {/* RIGHT: ACTIONS */}
  <div className="flex flex-col items-end gap-2 flex-shrink-0">
    <button
      onClick={() => {
        setIsLeadTaskHistoryModalOpen(true);
        setSeletedLeadTaskForHistory(activity);
      }}
      className="p-1 hover:bg-slate-100 rounded-md"
    >
      <History size={16} />
    </button>

    <Button
                    disabled={!userHasAccessToUpdateLeadTasks}
                      onClick={() => {
                        if(userHasAccessToUpdateLeadTasks){
                          setIsUpdateLeadTaskModalOpen(true);
                          setSelecedLeadTask(activity);
                        }else{
                          toast.error(MESSAGE.MODULE_ACCESS.LEAD_TASKS.DENIED_UPDATE_ACCESS)
                        }
                      }}
                      className="px-2 caption-custom white-text bg-blue-500  rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </Button>
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
          isOpen={isLeadTaskHistoryModalOpen}
          handleClose={(status: boolean) => {
            setIsLeadTaskHistoryModalOpen(status);
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
            handleMeetingDetailsUpdate={(date: string, summary: string) => {
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
