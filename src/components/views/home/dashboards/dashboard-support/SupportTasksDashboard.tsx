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
import LoadingSpinner from "../../../../../assets/animations/LoadingSpinner";
import POST_API from "../../../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../../../context/user/LoggedInUserContext";
import qs from "query-string";

import { useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../../../constants/Routes";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import TaskStageChip from "../../../../ui/TaskStageChip";
import SupportTicketTaskDashboardProps from "../../../../../@types/support-ticket-management/SupportTicketTaskDashboardProps";
import { handleApiError } from "../../../../../config/error/handleApiError";
import axiosClient from "../../../../../axios-client/AxiosClient";

// Helper function to get icon based on activity name
const getActivityIcon = (activity: SupportTicketTaskDashboardProps) => {
  let activityType = activity.support_ticket_task_stage_id;
  activityType = 1;

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
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 2), 16);
  const b = parseInt(hex.slice(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
};

// Helper function to get priority styling
const getPriorityColor = (taskType: number) => {
  switch (taskType) {
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

function SupportTasksDashboard({
  companyUserId,
  isLoading,
  supportTasks,
  taskType,
}: {
  companyUserId: number | null;
  isLoading: boolean;
  supportTasks: SupportTicketTaskDashboardProps[];
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

  const getSupportTicketDetails = async (supportTicketId: number) => {
    if (companyUserId === null || companyUserId !== loginStatus.id) {
      // toast.error(MESSAGE.ERROR.YOU_ARE_NOT_ON_YOUR_DASHBOARD)
      // return ;
    }
    const postDataToGetLead = {
      company_id: loginStatus.companyId,
      id: supportTicketId,
      requestedby: loginStatus.id,
    };
    await axiosClient
      .post(POST_API.GET_SUPPORT_TICKET, postDataToGetLead, {
        withCredentials: true,
      })
      .then((response) => {
        const supportTicketData = response.data.map((item: any) => {
          const queryParams = qs.stringify({
            supportTicketData: JSON.stringify({
              count: item.count,
              id: item.id,
              ticketNumber: item.ticket_number,
              companyId: item.company_id,
              accountName: item.account_name,
              accountEmail: item.account_email,
              accountMobileNumber: item.account_mobilenumber,
              companyProductId: item.company_product_id,
              companyProductName: item.company_product_name,
              accountCompanyProductId: item.account_company_product_id,
              supportTicketCategoryId: item.support_ticket_category_id,
              supportTicketCategoryName: item.support_ticket_category_name,
              supportTicketEscalationLevelId:
                item.support_ticket_escalation_level_id,
              supportTicketEscalationLevelName:
                item.support_ticket_escalation_level_name,
              supportTicketLifecycleId: item.support_ticket_lifecycle_id,
              supportTicketLifecycleName: item.support_ticket_lifecycle_name,
              companyProductSlaId: item.company_product_sla_id,
              companyProductSlaName: item.company_product_sla_name,
              supportTicketSourceId: item.support_ticket_source_id,
              supportTicketSourceName: item.support_ticket_source_name,
              queryDescription: item.query_description,
              publicNotes: item.public_notes,
              resolutionApplied: item.resolution_applied,
              assignedTo: item.assignedto,
              assignedToName: item.assignedto_name,
              resolvedBy: item.resolvedby,
              resolvedByName: item.resolvedby_name,
              dueDateTime: item.due_date_time,
              completedAtDateTime: item.completed_at_date_time,
              createdBy: item.createdby,
              createdOn: item.createdon,
              updatedBy: item.updatedby,
              updatedOn: item.updatedon,
            }),
          });
          return queryParams;
        });
        navigate(ROUTES_URL.SUPPORT_TICKET_DETAILS + `?${supportTicketData}`);
      })
      .catch(async (error: any) => {
        handleApiError(error);
      });
  };

  return (
    <div className="bg-white p-8 h-full flex flex-col ">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div>
            <h3 className="section-header-custom mb-1">
              {taskType === "upcoming"
                ? "Upcoming Tasks"
                : taskType === "pending"
                ? "Pending Tasks"
                : "Completed Tasks"}
            </h3>
            <p className="table-header-custom">
              {taskType === "upcoming"
                ? "Your scheduled activities"
                : taskType === "pending"
                ? "Your Pending activities"
                : "Your completed activities"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2 no-scrollbar">
          {isLoading && <LoadingSpinner></LoadingSpinner>}
          {!isLoading && (
            <div className="space-y-4">
              {supportTasks.length === 0 && (
                <h3 className="input-label-custom mb-2">
                  {taskType === "upcoming"
                    ? "No Upcoming Tasks"
                    : taskType === "pending"
                    ? "No Pending Tasks"
                    : "No Completed Tasks"}
                </h3>
              )}
              {supportTasks.map((task, index) => {
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

                return (
                  <div
                    key={task.id}
                    className="flex items-start min-h-28 space-x-4 p-3 border-2 rounded-xl hover:shadow-lg transition-all duration-200 group"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div
                      className="p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
                      style={{
                        backgroundColor:
                          taskType === "upcoming"
                            ? getIconColorFromHex("#FFA500")
                            : getIconColorFromHex("#FF0000"),
                      }}
                    >
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h4
                            onClick={() => {
                              getSupportTicketDetails(task.support_ticket_id);
                            }}
                            className="table-header-custom cursor-pointer group-hover:text-blue-600 transition-colors"
                          >
                            Ticket Id: {task.ticket_number}
                            {/* ({task.support_ticket_task_stage_name}) */}
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
                          className={`px-2 py-0.5 rounded-full input-label-custom border ${
                            taskType === "upcoming"
                              ? getPriorityColor(1)
                              : getPriorityColor(2)
                          } flex-shrink-0`}
                        >
                          {task.overdue_status}
                        </span>
                      </div>

                      <div className="flex-1 items-center justify-between mt-2">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 input-label-custom">
                            <Clock className="w-3 h-3" />
                            <span className="input-label-custom">
                              {task.due_date_time}
                            </span>{" "}
                            {/* Displaying raw dueDateTime */}
                          </div>

                          <TaskStageChip
                            stageName={task.support_ticket_task_stage_name}
                            stageId={task.support_ticket_task_stage_id}
                          />
                          <TaskStageChip
                            stageName={
                              taskType === "upcoming"
                                ? task.due_date_time!
                                : task.overdue_status!
                            }
                            stageId={task.support_ticket_task_stage_id}
                          />
                          {taskType === "completed" && (
                            <div className="caption-custom px-2 py-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0">
                              {task.overdue_status}
                            </div>
                          )}
                        </div>
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

export default SupportTasksDashboard;
