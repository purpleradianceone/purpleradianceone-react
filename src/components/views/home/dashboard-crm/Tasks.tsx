/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  Phone,
  FileText,
  Mail,
  CheckSquare,
  Notebook,
} from "lucide-react";
import LeadTaskType from "../../../../@types/lead-management/LeadTaskType";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import qs from "query-string";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import TaskStageChip from "../../../ui/TaskStageChip";

// Helper function to get icon based on activity name
const getActivityIcon = (activity: LeadTaskType) => {
  const activityType = activity.leadActivityId;
  if (activityType === 1) return Phone;
  if (activityType === 2) return Mail;
  if (activityType === 3) return Mail;
  if (activityType === 4) return Calendar;
  if (activityType === 5) return CheckSquare;
  if (activityType === 6) return FileText;
  if (activityType === 7) return Notebook;
  if (activityType === 8) return CheckCircle;
  return Calendar;
};

// Helper function to get background color from hex color code
// const getBgColorFromHex = (colorCode: string) => {
//   const hex = colorCode.replace("#", "");
//   const r = parseInt(hex.substr(0, 2), 16);
//   const g = parseInt(hex.substr(2, 2), 16);
//   const b = parseInt(hex.substr(4, 2), 16);
//   return `rgba(${r}, ${g}, ${b}, 0.2)`;
// };

// Helper function to get border color from hex color code
// const getBorderColorFromHex = (colorCode: string) => {
//   const hex = colorCode.replace("#", "");
//   const r = parseInt(hex.substr(0, 2), 16);
//   const g = parseInt(hex.substr(2, 2), 16);
//   const b = parseInt(hex.substr(4, 2), 16);
//   return `rgba(${r}, ${g}, ${b}, 0.3)`;
// };

const getIconColorFromHex = (colorCode: string) => {
  const hex = colorCode.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
};

// Helper function to get priority styling
const getPriorityColor = (activity: LeadTaskType) => {
  switch (activity.leadTaskPriorityId) {
    case 1:
      return `bg-green-200 text-green-800 border-green-200`;
    case 2:
      return `bg-yellow-200 text-yellow-800 border-yellow-200`;
    case 3:
      return `bg-red-200 text-red-800 border-red-200`;
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

function Tasks({
  companyUserId,
  isLoading,
  leadTasks,
  taskType,
}: {
  companyUserId:number|null;
  isLoading: boolean;
  leadTasks: LeadTaskType[];
  taskType: "upcoming" | "pending" | "completed";
}) {
  const { loginStatus } = useLoggedInUserContext();
  const navigate = useNavigate();
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: number]: boolean;
  }>({});

  const [ref, inView] = useInView({ fallbackInView: true, threshold: 0.1 });

  const toggleDescription = (taskId: number) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const DESCRIPTION_TRUNCATE_LENGTH = 80;

  const getLeadDetails = async (leadId: number) => {
    if(companyUserId === null || companyUserId !== loginStatus.id){
      // toast.error(MESSAGE.ERROR.YOU_ARE_NOT_ON_YOUR_DASHBOARD)
      // return ;
    }
    const postDataToGetLead = {
      company_id: loginStatus.companyId,
      id: leadId,
      requestedby: loginStatus.id,
    };
    await axios
      .post(POST_API.GET_LEAD, postDataToGetLead, {
        withCredentials: true,
      })
      .then((response) => {
        const leadData = response.data.map((item: any) => {
          const queryParams = qs.stringify({
            leadData: JSON.stringify({
              id: item.id,
              name: item.name,
              email: item.email,
              mobileNumber: item.mobilenumber,
              companyId: item.company_id,
              companyUserId: item.ownerid,
              count: item.count,
              createdBy: item.createdby,
              createdOn: item.createdon,
              leadOwner: item["Lead Owner"],
              leadSource: item["Lead Source"],
              leadSourceId: item.lead_source_id,
              leadStatus: item["Lead Status"],
              leadStatusId: item.lead_status_id,
              updatedBy: item.updatedby,
              updatedOn: item.updatedon,
            }),
          });
          return queryParams;
        });
        navigate(ROUTES_URL.LEAD_DETAILS + `?${leadData}`);
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenStatus = await RefreshToken({
            callFunctionWithParamsNotEvent: getLeadDetails,
          });

          // setIsDialogueOpen(!refreshTokenStatus);
          if (refreshTokenStatus) {
            getLeadDetails(leadId);
          }
        }
      });
  };

  return (
    
    <div className="bg-white p-8 h-full flex flex-col">
      
      <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }} 
    >
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h3 className="section-header-custom mb-2">
            {taskType === "upcoming"
              ? "Upcoming Tasks"
              : taskType === "pending"
              ? "Pending Tasks"
              : "Completed Tasks"}
          </h3>
          <p className="table-header-custom">
            {taskType === "upcoming"
              ? "Your scheduled activities and deadlines"
              : taskType === "pending"
              ? "Your Pending activities and deadlines"
              : "Your completed activities and deadlines"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {isLoading && <LoadingSpinner></LoadingSpinner>}
        {!isLoading && (
          <div className="space-y-4">
            {leadTasks.length === 0 && (
              <h3 className="input-label-custom mb-2">
                {taskType === "upcoming"
                  ? "No Upcoming Tasks"
                  : taskType === "pending"
                  ? "No Pending Tasks"
                  : "No Completed Tasks"}
              </h3>
            )}
            {leadTasks.map((task, index) => {
              const IconComponent = getActivityIcon(task);
              const isDescriptionExpanded = expandedDescriptions[task.id];
              const showViewMore =
                task.description.length > DESCRIPTION_TRUNCATE_LENGTH;
              const displayedDescription =
                showViewMore && !isDescriptionExpanded
                  ? `${task.description.substring(
                      0,
                      DESCRIPTION_TRUNCATE_LENGTH
                    )}...`
                  : task.description;

              // Ensure assignedToName is an array, default to empty if not present
              // const assignedNames = Array.isArray(task.assignedToName) ? task.assignedToName : [];

              return (
                <div
                  key={task.id}
                  className="flex items-start min-h-28 space-x-4 p-3 border-2 rounded-xl hover:shadow-lg transition-all duration-200 group"
                  style={{
                    // backgroundColor: getBgColorFromHex(task.colorCode),
                    // borderColor: getBorderColorFromHex(task.colorCode),
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div
                    className="p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
                    style={{
                      backgroundColor: getIconColorFromHex(task.colorCode),
                    }}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4
                          onClick={() => {
                            getLeadDetails(task.leadId);
                          }}
                          className="table-header-custom cursor-pointer group-hover:text-blue-600 transition-colors"
                        >
                           {task.leadTaskActivityName} - {task.subject}
                        </h4>
                         <h4
                          onClick={() => {
                            getLeadDetails(task.leadId);
                          }}
                          className="table-header-custom cursor-pointer group-hover:text-blue-600 transition-colors"
                        >
                          Lead Name: {task.leadName} ({task.leadStatusName})
                        </h4>
                        <p className="caption-custom mt-1">
                          {displayedDescription}
                          {showViewMore && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDescription(task.id);
                              }}
                              className="caption-custom-blue hover:underline ml-1"
                            >
                              {isDescriptionExpanded
                                ? "View Less"
                                : "View More"}
                            </button>
                          )}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full input-label-custom border ${getPriorityColor(
                          task
                        )} flex-shrink-0`}
                      >
                        {task.leadTaskPriorityName} Priority
                      </span>
                    </div>

                    <div className="flex-1 items-center justify-between mt-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 input-label-custom">
                          <Clock className="w-3 h-3" />
                          <span className="input-label-custom">
                            {task.dueDateTime}
                          </span>{" "}
                          {/* Displaying raw dueDateTime */}
                        </div>
                        {/* <div
                        className="relative flex gap-2"
                        onMouseEnter={() => setHoveredTaskId(task.id)}
                        onMouseLeave={() => setHoveredTaskId(null)}
                      >
                        <User className="w-3 h-3 text-gray-700" />
                        <span className="text-xs cursor-pointer">
                          {assignedNames.length > 1
                            ? `${assignedNames[0]} +${assignedNames.length - 1}`
                            : assignedNames[0] || 'Unassigned'
                          }
                        </span>
                        {hoveredTaskId === task.id && assignedNames.length > 0 && (
                          <div
                            className="absolute z-20 p-2 mt-1 bg-gray-800 text-white rounded shadow-lg"
                            style={{
                              top: '100%', 
                              left: '50%',
                              transform: 'translateX(-50%)',
                              whiteSpace: 'nowrap',
                              minWidth: 'max-content'
                            }}
                          >
                            <ul className="list-none p-0 m-0 text-xs">
                              {assignedNames.map((name, nameIndex) => (
                                <li key={nameIndex}>{name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div> */}
                        {/* <span className="caption-custom px-2 py-1 border border-gray-300 hover:bg-gray-200 rounded-full">
                          {task.leadTaskStageName/,l }
                        </span> */}
                        <TaskStageChip
                        stageName={task.leadTaskStageName}
                        stageId={task.leadTaskStageId}
                        />
                        {/* <div
                          
                          className="caption-custom px-1 py-0.5 border border-gray-300 rounded-full transition-colors flex-shrink-0"
                        >
                          {taskType === "completed"
                            ? `${task.completedAt}`
                            : `${task.overdueStatus}`}
                        </div> */}
                        <TaskStageChip
                        stageName={taskType === "completed"
                            ? task.completedAt!
                            : task.overdueStatus!}
                        stageId={task.leadTaskStageId}
                        />
                        {taskType === "completed" && (
                          <div
                            className="caption-custom px-2 py-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                          >
                            {task.overdueStatus}
                          </div>
                        )}
                      </div>
                      {/* <button
                    type='button'
                      className="text-xs text-gray-700 hover:text-gray-700 font-medium px-2 py-1 hover:bg-white rounded transition-colors flex-shrink-0"
                    >
                      {taskType === "completed" ?  `${task.completedAt}` : `${task.overdueStatus}`}
                    </button>
                    {taskType === "completed" && (
                        <button
                    type='button'
                      className="text-xs text-gray-700 hover:text-gray-700 font-medium px-2 py-1 hover:bg-white rounded transition-colors flex-shrink-0"
                    >
                      {task.overdueStatus}
                    </button>
                    )
                    } */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </motion.section>
    </div>
    
  );
}

export default Tasks;
