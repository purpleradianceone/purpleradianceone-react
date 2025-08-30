/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus } from "lucide-react";
import LeadTaskTabs from "../../../tabs/LeadTasksTabs";
import { useEffect, useState } from "react";
import CreateLeadTaskModal from "./CreateLeadTaskModal";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import LeadActivityType from "../../../../@types/lead-management/LeadActivityType";
import LeadTaskPriorityType from "../../../../@types/lead-management/LeadTaskPriorityType";
import LeadTaskStageType from "../../../../@types/lead-management/LeadTaskStageType";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import Lead from "../../../../@types/lead-management/LeadManagementProps";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import { useSearchParams } from "react-router-dom";
import LeadTaskType from "../../../../@types/lead-management/LeadTaskType";

function LeadTasksModal({ ownerId }: { ownerId: number }) {
  const { loginStatus } = useLoggedInUserContext();
  const [searchParams] = useSearchParams();

  const [leadActivity, setLeadActivity] = useState<LeadActivityType[]>([]);
  const [leadTaskPriority, setLeadTaskPriority] = useState<
    LeadTaskPriorityType[]
  >([]);
  const [leadTaskStage, setLeadTaskStage] = useState<LeadTaskStageType[]>([]);
  const [visibleAssignUsersBtn, setVisibleAssignUsersBtn] =
    useState<boolean>(false);

  const [leadActivityId, setLeadActivityId] = useState<number>(0);
  const [leadTaskStageId, setLeadTaskStageId] = useState<number>(0);
  const [leadTaskPriorityId, setLeadTaskPriorityId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [leadTasks, setLeadTasks] = useState<LeadTaskType[]>([]);
  const [leadData, setLeadData] = useState<Lead>();

  const [leadTaskChangeCount, setLeadTaskChangeCount] = useState<number>(0);

  const getLeadActivity = async () => {
    setLeadActivity([]);
    const getLeadActivityPostData = {
      id: null,
      name: null,
      isactive: null,
    };
    await axios
      .post(POST_API.GET_LEAD_ACTIVITY, getLeadActivityPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          response.data.map((res: any) => {
            setLeadActivity((prev) => [
              ...prev,
              {
                id: res.id,
                name: res.name,
                isActive: res.isactive,
              },
            ]);
          });
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getLeadActivity,
          });
          if (refreshTokenResponse) {
            getLeadActivity();
          }
        }
      });
  };

  const getLeadTaskPriority = async () => {
    setLeadTaskPriority([]);
    const getLeadTaskPriorityPostData = {
      id: null,
      name: null,
      isactive: null,
    };
    await axios
      .post(POST_API.GET_LEAD_TASK_PRIORITY, getLeadTaskPriorityPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          response.data.map((res: any) => {
            setLeadTaskPriority((prev) => [
              ...prev,
              {
                id: res.id,
                name: res.name,
                isActive: res.isactive,
              },
            ]);
          });
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getLeadTaskPriority,
          });
          if (refreshTokenResponse) {
            getLeadTaskPriority();
          }
        }
      });
  };

  const getLeadTaskStage = async () => {
    setLeadTaskStage([]);
    const getLeadTaskStagePostData = {
      id: null,
      name: null,
      isactive: null,
    };
    await axios
      .post(POST_API.GET_LEAD_TASK_STAGE, getLeadTaskStagePostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          response.data.map((res: any) => {
            setLeadTaskStage((prev) => [
              ...prev,
              {
                id: res.id,
                name: res.name,
                isActive: res.isactive,
              },
            ]);
          });
        }
      })
      .catch(async (error: ApiError | any) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getLeadTaskStage,
          });
          if (refreshTokenResponse) {
            getLeadTaskStage();
          }
        }
      });
  };

  const handleLeadTaskUpdate = () => {
    setLeadTaskChangeCount(leadTaskChangeCount + 1);
  };

  const handleLeadTaskCreate = () => {
    setLeadTaskChangeCount(leadTaskChangeCount + 1);
  };

  const getLeadTasks = async () => {
    setIsLoading(true);
    setLeadTasks([]);
    const getLeadTaskPostData = {
      company_id: loginStatus.companyId,
      lead_id: leadData!.id,
      lead_activity_id: leadActivityId === 0 ? null : leadActivityId,
      lead_task_priority_id:
        leadTaskPriorityId === 0 ? null : leadTaskPriorityId,
      lead_task_stage_id: leadTaskStageId === 0 ? null : leadTaskStageId,
      requestedby_id: loginStatus.id,
    };
    await axios
      .post(POST_API.GET_LEAD_TASK, getLeadTaskPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          response.data.map((res: any) => {
            setLeadTasks((prev) => [
              ...prev,
              {
                id: res.id,
                leadId: res.lead_id,
                leadActivityId: res.lead_activity_id,
                leadTaskPriorityId: res.lead_task_priority_id,
                leadTaskStageId: res.lead_task_stage_id,
                subject: res.subject,
                description: res.description,
                colorCode: res.color_code,
                assignedToId: res.assignedto,
                assignedToName: res.assigned_to,
                dueDateTime: res.due_date_time,
                completedAtDateTime: res.completed_at_date_time,
                leadActivityDetails: res.lead_activity_details,
                isActive: res.isactive,
                createdBy: res.createdby,
                updatedBy: res.updatedby,
                createdOn: res.createdon,
                updatedOn: res.updatedon,
                resultOutcome: res.result_outcome,
                leadTaskActivityName: res.lead_activity_name,
                leadTaskPriorityName: res.lead_task_priority_name,
                leadTaskStageName: res.lead_task_stage_name,
              },
            ]);
          });
        }
      })
      .catch(async (error) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunction: getLeadTasks,
          });
          if (refreshTokenResponse) {
            getLeadTasks();
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTaskTabChange = (stageId: number) => {
    setLeadTaskStageId(stageId);
    setLeadActivityId(0);
    setLeadTaskPriorityId(0);
  };

  const handleLeadActivityFilterDropdownChange = (activityId: number) => {
    setLeadActivityId(activityId);
  };

  const handleLeadPriorityFilterDropdownChange = (priorityId: number) => {
    setLeadTaskPriorityId(priorityId);
  };

  useEffect(() => {
    const leadSearchParam = JSON.parse(searchParams.get("leadData") || "{}");
    setLeadData(leadSearchParam);
    setVisibleAssignUsersBtn(true);
  }, []);
  useEffect(() => {
    if (leadData || leadTaskStageId !== 0) {
      getLeadTasks();
    }
  }, [
    leadData,
    leadTaskStageId,
    leadActivityId,
    leadTaskPriorityId,
    leadTaskChangeCount,
  ]);

  useEffect(() => {
    getLeadActivity();
    getLeadTaskPriority();
    getLeadTaskStage();
  }, []);

  const [isCreateLeadTaskModalOpen, setIsCreateLeadTaskModalOpen] =
    useState<boolean>(false);
  return (
    <div className="w-full shadow-lg ">
      <div className="w-full gap-1">
        <div className="sticky top-16 flex bg-gray-200 shadow-sm  mb-1.5 w-full">
          <div className="flex justify-between  w-full pr-3">
            <span className="text-sm  pl-1 font-semibold text-center text-gray-800 ">
              Tasks
            </span>
            {visibleAssignUsersBtn && (
              <div className="flex justify-end items-center text-xs gap-x-2 text-gray-500">
                <span>Add</span>
                <button
                  disabled={false}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1"
                  onClick={() => {
                    setIsCreateLeadTaskModalOpen(true);
                  }}
                >
                  <Plus size={10} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
          <LeadTaskTabs
            isLoading={isLoading}
            leadActivity={leadActivity}
            leadTaskPriority={leadTaskPriority}
            leadTaskStage={leadTaskStage}
            leadTasks={leadTasks}
            handleTaskTabChange={handleTaskTabChange}
            handleLeadActivityFilterDropdownChange={
              handleLeadActivityFilterDropdownChange
            }
            handleLeadPriorityFilterDropdownChange={
              handleLeadPriorityFilterDropdownChange
            }
            handleLeadTaskUpdate={handleLeadTaskUpdate}
          ></LeadTaskTabs>
        </div>
      </div>
      {leadData && (
        <CreateLeadTaskModal
          leadActivity={leadActivity}
          leadTaskPriority={leadTaskPriority}
          leadId={leadData!.id}
          leadTaskStage={leadTaskStage}
          isOpen={isCreateLeadTaskModalOpen}
          handleClose={() => {
            setIsCreateLeadTaskModalOpen(false);
          }}
          handleLeadTaskCreate={handleLeadTaskCreate}
          ownerId={ownerId}
        />
      )}
    </div>
  );
}

export default LeadTasksModal;
