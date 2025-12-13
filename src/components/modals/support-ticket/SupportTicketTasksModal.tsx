/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { useSearchParams } from "react-router-dom";

import POST_API from "../../../constants/PostApi";
import axiosClient from "../../../axios-client/AxiosClient";
import { STATUS_CODE } from "../../../constants/AppConstants";
import toast from "react-hot-toast";
import RefreshToken from "../../../config/validations/RefreshToken";
import MESSAGE from "../../../constants/Messages";
import Button from "../../ui/Button";
import { useSupportTicketTaskStage } from "../../../config/hooks/useSupportTicketTaskStage";
import SupportTasksTabs from "./tabs/SupportTasksTabs";
import SupportTicketTaskProps from "../../../@types/support-ticket-management/SupportTicketTaskProps";
import SupportTicketProps from "../../../@types/support-ticket-management/SupportTicketProps";
import CreateSupportTicketTaskModal from "./CreateSupportTicketTaskModal";

function SupportTicketTasksModal() {
// { ownerId }: { ownerId: number }
  const { userHasAccessToAddSupportTicket } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [searchParams] = useSearchParams();

  const {
    supportTicketTaskStage,
    isLoading: isLoadingForSupportTicketTaskStage,
  } = useSupportTicketTaskStage();
  const [visibleAssignUsersBtn, setVisibleAssignUsersBtn] =
    useState<boolean>(false);

  const [leadActivityId, setLeadActivityId] = useState<number>(0);
  const [leadTaskStageId, setLeadTaskStageId] = useState<number>(0);
  const [leadTaskPriorityId, setLeadTaskPriorityId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [supportTicketTasks, setSupportTicketTasks] = useState<
    SupportTicketTaskProps[]
  >([]);
  const [supportTicketData, setSupportTicketData] =
    useState<SupportTicketProps>();

  const [leadTaskChangeCount, setLeadTaskChangeCount] = useState<number>(0);

  const handleLeadTaskUpdate = () => {
    setLeadTaskChangeCount(leadTaskChangeCount + 1);
  };

  const handleLeadTaskCreate = () => {
    setLeadTaskChangeCount(leadTaskChangeCount + 1);
  };

  const getLeadTasks = async () => {
    setIsLoading(true);
    setSupportTicketTasks([]);
    const getLeadTaskPostData = {
      company_id: loginStatus.companyId,
      support_ticket_id: supportTicketData!.id,
      isactive:null,
      support_ticket_task_stage_id: leadTaskStageId === 0 ? null : leadTaskStageId,
      requestedby: loginStatus.id,
    };
    await axiosClient
      .post(POST_API.GET_SUPPORT_TICKET_TASK, getLeadTaskPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          response.data.map((res: any) => {
            setSupportTicketTasks((prev) => [
              ...prev,
              {
                id: res.id,
                supportTicketId: res.support_ticket_id,
                supportTicketTaskStageId: res.support_ticket_task_stage_id,
                supportTicketTaskStageName: res.support_ticket_task_stage_name,
                description: res.description,
                resultOutcome: res.result_outcome,
                assignedTo: res.assignedto,
                assignToName: res.assignedto_name,
                dueDateTime: res.due_date_time,
                completedAtDateTime: res.completed_at_date_time,
                isActive: res.isactive,
                createdBy: res.createdby,
                createdOn: res.createdon,
                updatedBy: res.updatedby,
                updatedOn: res.updatedon,
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

  useEffect(() => {
    const supportTicketSearchParam = JSON.parse(
      searchParams.get("supportTicketData") || "{}"
    );
    setSupportTicketData(supportTicketSearchParam);
    setVisibleAssignUsersBtn(true);
  }, []);
  useEffect(() => {
    if (supportTicketData || leadTaskStageId !== 0) {
      getLeadTasks();
    }
  }, [
    supportTicketData,
    leadTaskStageId,
    leadActivityId,
    leadTaskPriorityId,
    leadTaskChangeCount,
  ]);

  const [isCreateLeadTaskModalOpen, setIsCreateLeadTaskModalOpen] =
    useState<boolean>(false);
  return (
    <div className="w-full  shadow-lg ">
      <div className="w-full gap-1">
        <div className="sticky top-16 flex bg-gray-200 shadow-sm  mb-1.5 w-full">
          <div className="flex justify-between  w-full pr-3">
            <span className="table-header-custom pl-1  text-center ">
              Tasks
            </span>
            {visibleAssignUsersBtn && (
              <div className="flex justify-end items-center text-xs gap-x-2  text-gray-500">
                {/* <span>Add</span> */}
                <Button
                  disabled={!userHasAccessToAddSupportTicket}
                  className="bg-blue-600 hover:bg-blue-700 caption-custom white-text px-1 py-0.5 rounded-md flex items-center gap-1"
                  onClick={() => {
                    if (userHasAccessToAddSupportTicket) {
                      setIsCreateLeadTaskModalOpen(true);
                    } else {
                      toast.error(
                        MESSAGE.MODULE_ACCESS.LEAD_MODULE
                          .UPDATE_LEAD_ACCESS_DENIED_message
                      );
                    }
                  }}
                >
                  +Add
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white overflow-y-auto rounded-lg shadow-sm p-0">
          {isLoadingForSupportTicketTaskStage ? (
            <div className="w-full p-4">
              {/* Tabs Skeleton */}
              <div className="flex items-center gap-10 border-b pb-2">
                {[
                  "All Tasks",
                  "Not Yet Started",
                  "In Progress",
                  "Completed",
                ].map((index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Content Skeleton */}
              <div className="flex justify-center items-center h-[300px] w-full">
                <div className="space-y-4 w-[60%]">
                  {/* Several skeleton rows */}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-200 rounded-md animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <SupportTasksTabs
              isLoading={isLoading}
              supportTicketTasks={supportTicketTasks}
              supportTicketTaskStage={supportTicketTaskStage}
              handleTaskTabChange={handleTaskTabChange}
              handleSupportTicketTaskUpdate={handleLeadTaskUpdate}
            />
          )}
        </div>
      </div>
      {supportTicketData && (
        <CreateSupportTicketTaskModal
          isOpen={isCreateLeadTaskModalOpen}
          handleClose={() => {
            setIsCreateLeadTaskModalOpen(false);
          }}
          leadTaskStage={supportTicketTaskStage}
          handleLeadTaskCreate={handleLeadTaskCreate}
        />
      )}
    </div>
  );
}

export default SupportTicketTasksModal;
