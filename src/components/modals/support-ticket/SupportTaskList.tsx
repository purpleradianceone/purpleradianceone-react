import {
  Phone,
  Mail,
  CalendarCheck,
  HeadsetIcon,
  HandCoinsIcon,
  Notebook,
  Clipboard,
  LucideLaptop,
  Pen,
  User,
} from "lucide-react"; // Corrected import for Lucide React icons
import LoadingSpinner from "../../../assets/animations/LoadingSpinner";
import StatusChip from "../../ui/StatusChip";
import { useState } from "react";
import SupportTicketTaskProps from "../../../@types/support-ticket-management/SupportTicketTaskProps";
import SupportTicketTaskStage from "../../../@types/support-ticket-management/SupportTicketTaskStage";
import UpdateSupportTicketTaskModal from "./UpdateSupportTicketTaskModal";
import MESSAGE from "../../../constants/Messages";
import COLORS from "../../../constants/Colors";
import { taskStageStyles } from "../../../utils/colourSpecifierForNameInAggrid";

function SupportTicketTaskList({
  taskId,
  supportTicketTaskStage,
  supportTicketTasks,
  handleSupportTicketTaskUpdate,
  isLoading,
}: {
  taskId: number;
  supportTicketTaskStage: SupportTicketTaskStage[];
  supportTicketTasks: SupportTicketTaskProps[];
  handleSupportTicketTaskUpdate: () => void;
  isLoading: boolean;
}) {
  const [
    isUpdateSupportTicketTaskModalOpen,
    setIsUpdateSupportTicketTaskModalOpen,
  ] = useState<boolean>(false);
  const [selecedSupportTicketTask, setSelecedSupportTicketTask] =
    useState<SupportTicketTaskProps>();
  // State to manage expanded card
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const getActivityIcon = (type: number) => {
    switch (type) {
      case 1:
        return <Phone size={20} />;
      case 2:
        return <Mail size={20} />;
      case 3:
        return <CalendarCheck size={20} />;
      case 4:
        return <HeadsetIcon size={20} />;
      case 5:
        return <LucideLaptop size={20} />;
      case 6:
        return <HandCoinsIcon size={20} />;
      case 7:
        return <Notebook size={20} />;
      case 8:
        return <Clipboard size={20} />;
      default:
        return <Phone size={20} />;
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <>
      <div className="flex "></div>
      <div className="p-1 min-h-72  ">
        <div className=" max-w-4x mx-auto  justify-center  min-h-72 w-full">
          {isLoading ? (
            <div className="flex min-h-72 items-center justify-center  py-10">
              <LoadingSpinner></LoadingSpinner>
            </div>
          ) : supportTicketTasks.length === 0 ||
            supportTicketTasks[0].id === null ? (
            <div className=" min-h-72   flex items-center justify-center">
              <p className="text-center caption-custom italic ">
                {supportTicketTasks.length
                  ? MESSAGE.MODULE_ACCESS.SUPPORT_MODULE.DENIED_VIEW_TASK_ACCESS
                  : `No activities found.`}
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 gap-3  max-h-72 overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-50
  [&::-webkit-scrollbar-thumb]:bg-gray-50
    [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
            >
              {supportTicketTasks.map((activity) => (
                <div
                  key={activity.id}
                  className={`bg-white min-h-16 px-2 py-2 rounded-xl shadow-md hover:shadow-xl border-2 transition-shadow duration-300 flex items-start space-x-2 border-gray-100 relative`}
                >
                  <div
                    className={`flex-shrink-0 p-1 ${COLORS.LIGHT_PURPLE_BACKGROUND} ${COLORS.PRIMARY_PURPLE} rounded-full`}
                  >
                    {" "}
                    {getActivityIcon(1)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      title={`To: ${activity.assignToName}`}
                      className="table-header-custom truncate"
                    >
                      {activity.assignToName.length > 50
                        ? activity.assignToName.substring(0, 50) + "..."
                        : activity.assignToName}
                    </p>
                    {expandedCardId === activity.id ? (
                      <div className="caption-custom">
                        <p className="pb-1 pt-2">
                          {taskId === 0 && (
                            <div className="mt-1">
                              <span className="caption-custom">
                                Task Stage :{" "}
                              </span>{" "}
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  taskStageStyles[
                                    activity.supportTicketTaskStageName as keyof typeof taskStageStyles
                                  ] || "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {activity.supportTicketTaskStageName}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="caption-custom">
                              Description :{" "}
                            </span>{" "}
                            <span className="caption-custom">
                              {activity.description}
                            </span>{" "}
                          </div>
                          <div className="flex gap-1">
                            <span className="caption-custom">Assignees : </span>{" "}
                            <div className="grid grid-cols-2">
                              <span
                                className={`${COLORS.LIGHT_PURPLE_BACKGROUND} ${COLORS.PRIMARY_PURPLE}
                                    border caption-custom mx-1 rounded-md px-0.5 
                                    inline-flex items-center gap-0.5`}
                              >
                                <User
                                  size={11}
                                  className={`${COLORS.PRIMARY_PURPLE} `}
                                />{" "}
                                {activity.assignToName.length > 50
                                  ? activity.assignToName.substring(0, 50) +
                                    "..."
                                  : activity.assignToName}
                              </span>
                            </div>
                          </div>
                          <div className="mt-0 pt-0">
                            <span className="caption-custom">Outcome : </span>{" "}
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
                          className={`caption-custom hover:underline focus:outline-none ${COLORS.PRIMARY_PURPLE_TEXT_HOVER}`}
                        >
                          View Less
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600">
                        <p className="truncate  mt-1">
                          {taskId === 0 && (
                            <div className="mt-1">
                              <span className="caption-custom">
                                Task Stage :{" "}
                              </span>{" "}
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  taskStageStyles[
                                    activity.supportTicketTaskStageName as keyof typeof taskStageStyles
                                  ] || "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {activity.supportTicketTaskStageName}
                              </span>
                            </div>
                          )}
                          <div className="mt-1">
                            <span className="caption-custom">
                              Description :{" "}
                            </span>{" "}
                            <span className="caption-custom">
                              {activity.description || ""}
                            </span>{" "}
                          </div>
                          <div className="mt-1">
                            <span className="caption-custom">Assignees : </span>{" "}
                              <span
                                className={`${COLORS.LIGHT_PURPLE_BACKGROUND} ${COLORS.PRIMARY_PURPLE}
                                    border caption-custom mx-1 rounded-md px-0.5 
                                    inline-flex items-center gap-0.5`}
                              >
                                <User
                                  size={11}
                                  className={`${COLORS.PRIMARY_PURPLE} `}
                                />
                              {activity.assignToName.length > 20
                                ? activity.assignToName.substring(0, 20) + "..."
                                : activity.assignToName}
                            </span>
                          </div>
                        </p>
                        {activity.assignToName.length > 0 && ( // Adjust threshold as needed
                          <button
                            onClick={() => toggleExpand(activity.id)}
                            className={`caption-custom hover:underline font-normal mt-1 focus:outline-none ${COLORS.PRIMARY_PURPLE_TEXT_HOVER}`}
                          >
                            View More
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Date and Action Buttons */}
                  <div className="absolute top-2  right-2 flex items-center space-x-1">
                    <span className="caption-custom">
                      {activity.dueDateTime}
                    </span>
                    <button
                      onClick={() => {
                        setIsUpdateSupportTicketTaskModalOpen(true);
                        setSelecedSupportTicketTask(activity);
                      }}
                      className={`flex items-center h-[20px] p-1 caption-custom ${COLORS.PRIMARY_PURPLE} !font-medium rounded border gap-1 ${COLORS.LIGHT_PURPLE_HOVER}
                        border-violet-200`}
                    >
                      <Pen size={10} />
                      Edit
                    </button>
                  </div>

                  {/*right corner*/}
                  <div className="absolute bottom-8 right-2 flex items-center space-x-1">
                    <StatusChip isActive={activity.isActive} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {isUpdateSupportTicketTaskModalOpen && (
          <UpdateSupportTicketTaskModal
            isOpen={isUpdateSupportTicketTaskModalOpen}
            handleClose={(value: boolean) => {
              setIsUpdateSupportTicketTaskModalOpen(value);
            }}
            supportTicketTask={selecedSupportTicketTask!}
            supportTicketTaskStage={supportTicketTaskStage}
            handleSupportTicketTaskUpdate={handleSupportTicketTaskUpdate}
          />
        )}
      </div>
    </>
  );
}

export default SupportTicketTaskList;
