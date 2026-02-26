/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChevronRight, FileText, Flag, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosClient from "../../../axios-client/AxiosClient";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import Button from "../../ui/Button";
// import FormHeader from "../../ui/FormHeader";
// import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import useTaskPriority from "../../../config/hooks/useTaskPriority";
import CompanyUserSearchFieldInput from "../../ui/CompanyUserSearchFieldInput";
import CustomDropdown from "../leads/CustomDropdown";
import TextAreaInput from "../../ui/TextAreaInput";
import POST_API from "../../../constants/PostApi";
import ToggleButton from "../../ui/ToggleButton";
import { useParams, useNavigate, Link } from "react-router-dom";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import PostDataToGetMasterTask from "../../../@types/my-task-management/PostDatatoGetMasterTask";
import { STATUS_CODE } from "../../../constants/AppConstants";
import MasterTaskProps from "../../../@types/my-task-management/MasterTaskProps";
import RefreshToken from "../../../config/validations/RefreshToken";
import ROUTES_URL from "../../../constants/Routes";
import TaskPriorityChip from "../../ui/TaskPriorityChip";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import AccessDeniedPopup from "../../views/not-found/AccessDeniedPage";

function MasterTaskUpdate() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { loginStatus } = useLoggedInUserContext();
  const { taskPriority } = useTaskPriority();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [taskList, setTaskList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupportTicket, setSelectedSupportTicket] =
    useState<MasterTaskProps | null>(null);
  const { userHasAccessToUpdateMasterTasks } = useUserAccessModules();
  const [selectedCompanyUser, setSelectedCompanyUser] = useState<CompanyUser>({
    company_id: 0,
    id: 0,
    fullname: "",
    email: "",
    mobilenumber: "",
    createdby: "",
    isactive: false,
    requestedby: "",
    generate_password: "",
  });
  const [formData, setFormData] = useState({
    taskPriority: undefined as number | undefined,
    description: "",
    assignedTo: undefined as number | undefined,
    isActive: true,
  });
  const getMasterTaskData = async (signal: AbortSignal) => {
    if (!taskId) return;
    const PostDataToGetAllTask: PostDataToGetMasterTask = {
      company_id: loginStatus.companyId,
      id: Number(taskId),
      search_company_specific_date_range_id: null,
      limit: 10,
      offset: 0,
      search_parameter: null,
      search_parameter_date: null,
      requestedby_id: loginStatus.id,
      general_task_priority_id: null,
      general_task_type_id: null,
      frequency_id: null,
      assignedto: null,
      isactive: null,
    };
    try {
      const response = await axiosClient.post(
        POST_API.GET_MASTER_TASK,
        PostDataToGetAllTask,
        {
          signal,
          withCredentials: true,
        },
      );
      if (response.status === STATUS_CODE.OK) {
        const item = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (!item) {
          navigate(ROUTES_URL.TASKS_MANAGEMENT);
        }
        const formattedData: MasterTaskProps = {
          id: item.id,
          generalTaskTypeName: item.general_task_type_name,
          generalTaskPriorityId: item.general_task_priority_id,
          generalTaskPriorityName: item.general_task_priority_name,
          frequencyName: item.frequency_name,
          frequencyInterval: item.frequency_interval,
          description: item.description,
          assignedToName: item.assignedto_name,
          assignedTo: item.assignedto,
          startDate: item.start_date,
          endDate: item.end_date,
          taskTime: item.task_time,
          isActive: item.isactive,
          createdByName: item.createdby,
          updatedByName: item.updatedby,
          createdOn: item.createdon,
          updatedOn: item.updatedon,
          generalTaskTypeId: 0,
          frequencyId: 0,
        };
        setSelectedSupportTicket(formattedData);

        // ⭐ PREFILL FORM
        setFormData({
          taskPriority: formattedData.generalTaskPriorityId,
          description: formattedData.description,
          assignedTo: formattedData.assignedTo,
          isActive: formattedData.isActive,
        });
      }
    } catch (error: any) {
      if (error?.response?.status === STATUS_CODE.UNATHORISED) {
        const refreshTokenStatus = await RefreshToken({
          callFunctionWithEvent: getMasterTaskData,
        });
        if (refreshTokenStatus) {
          getMasterTaskData(signal);
        }
      }
    }
  };
  const getGeneralTask = async (signal: AbortSignal) => {
    try {
      setLoading(true);
      const postData = {
        company_id: loginStatus.companyId,
        requestedby_id: loginStatus.id,
        general_task_master_id: Number(taskId),
      };
      const res = await axiosClient.post(POST_API.GET_GENERAL_TASK, postData, {
        signal,
        withCredentials: true,
      });
      if (res.data) {
        console.log(res.data);
        console.log(loading);
        setTaskList(res.data);
      }
    } catch (error: any) {
      toast.error("Failed to load tasks", error.response?.data?.message || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userHasAccessToUpdateMasterTasks) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToUpdateMasterTasks]);
  // ⭐ PREFILL FORM
  useEffect(() => {
    const controller = new AbortController();
    getMasterTaskData(controller.signal);
    getGeneralTask(controller.signal);
    return () => {
      controller.abort();
    };
  }, [taskId]);

  const handleDropdownChange = (field: string, value: number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompanyUserToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };
  const validateForm = () => {
    if (!formData.description) {
      toast.error("Description is required");
      return false;
    }
    return true;
  };

  const updateTask = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    const postData = {
      id: selectedSupportTicket?.id,
      company_id: loginStatus.companyId,
      general_task_priority_id: formData.taskPriority,
      description: formData.description,
      assignedto:
        selectedCompanyUser.id === 0
          ? selectedSupportTicket?.assignedTo
          : selectedCompanyUser.id,
      updatedby_id: loginStatus.id,
      isactive: formData.isActive,
    };
    await axiosClient
      .post(POST_API.UPDATE_GENERAL_TASK_MASTER, postData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status) {
          toast.success(res.data.message);
          // handleTaskMasterUpdate();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      {userHasAccessToUpdateMasterTasks ? (
        <div className=" w-full pl-5 pt-2 ">
          {" "}
          <div>
            <div className=" sticky top-10 z-20 bg-slate-100 flex text-center justify-start items-center gap-3 ml-0.5 ">
              <Link to={ROUTES_URL.TASKS_MANAGEMENT + "/my-tasks"}>
                <Button className="caption-custom flex items-center justify-center hover:text-gray-800">
                  Master Tasks
                </Button>
              </Link>
              <ChevronRight size={16} />
              <h1 className="table-header-custom">Master Task Details</h1>
            </div>
            <div className="bg-gray-50 w-full px-2 pt-1 rounded">
              {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
              <div className="bg-white border rounded-lg p-2 space-y-2">
                {/* HEADER */}
                <div className="flex justify-between items-center border-b pb-2">
                  <h1 className="font-semibold text-gray-800">
                    Master Task Details
                  </h1>
                </div>
                {/* ROW 1 */}
                <div className="grid grid-cols-5 gap-3 items-end text-sm">
                  <CustomDropdown
                    logo={Flag}
                    labelName="Priority"
                    options={taskPriority!}
                    preselectedOption={formData.taskPriority}
                    onSelect={(v) => handleDropdownChange("taskPriority", v)}
                  />
                  {/* TYPE */}
                  <div>
                    <label className="text-xs text-gray-500">Task Type</label>
                    <p className="text-sm font-medium">
                      {selectedSupportTicket?.generalTaskTypeName}
                    </p>
                  </div>
                  {/* FREQUENCY */}
                  <div>
                    <label className="text-xs text-gray-500">Frequency</label>
                    <p className="text-sm">
                      {selectedSupportTicket?.frequencyName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Start</label>
                    <p>{selectedSupportTicket?.startDate}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">End</label>
                    <p>{selectedSupportTicket?.endDate}</p>
                  </div>
                </div>
                {/* ROW 2 */}
                <div className="grid grid-cols-5 gap-3 text-sm">
                  {/* ASSIGN */}
                  <CompanyUserSearchFieldInput
                    label="Assign"
                    logo={User}
                    defaultValue={selectedSupportTicket?.assignedToName ?? ""}
                    onUserSelected={(user: any) => {
                      if (user) {
                        setSelectedCompanyUser(user);
                      }
                    }}
                    has={{
                      searchLogo: false,
                      border: true,
                      xLogo: true,
                      // penLogo: true
                    }}
                  />

                  {/* STATUS */}
                  <div>
                    <label className="text-xs text-gray-500">Status</label>
                    <div className="flex gap-2 items-center">
                      <ToggleButton
                        checked={formData.isActive}
                        name="isActive"
                        onToggle={handleCompanyUserToggle}
                      />
                      <span
                        className={`text-sm ${
                          formData.isActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formData.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Time</label>
                    <p>{selectedSupportTicket?.taskTime}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Created By</label>
                    <p>{selectedSupportTicket?.createdByName}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Updated By</label>
                    <p>{selectedSupportTicket?.updatedByName}</p>
                  </div>
                </div>
                {/* DESCRIPTION */}
                <div className="grid grid-cols-2">
                  <TextAreaInput
                    label="Description"
                    logo={FileText}
                    value={formData.description}
                    onChange={(e: any) =>
                      handleInputChange("description", e.target.value)
                    }
                    cols={3}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <div>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        updateTask();
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        <Save size={15} />
                        Save
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-2 mt-2 border rounded h-[60vh] overflow-auto">
                <h3 className="font-semibold text-gray-800 mb-3">
                  General tasks
                </h3>
                {taskList && (
                  <div className="space-y-2">
                    {taskList.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-none mx-96 mt-14">
          <AccessDeniedPopup
            isOpen={accessDeniedPopUpOpen}
            onClose={() => {
              setAccessDeniedPopUpOpen(false);
              window.history.back();
            }}
          />
        </div>
      )}
    </>
  );
}

export default MasterTaskUpdate;

export const TaskCard = ({ task }: any) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-3 mb-3">
      <h3 className="text-sm font-medium text-gray-700">{task.description}</h3>

      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-500">
          👤 {task.assignedto_name || "-"}
        </span>
        <TaskPriorityChip priorityName={task.general_task_priority_name} />
      </div>
      {task.start_date_time && (
        <div className="text-xs text-gray-400 mt-2">
          ⏰ {task.start_date_time}
        </div>
      )}
      {task.due_date_time && (
        <div className="text-xs text-gray-400 mt-2">
          ⏰ {task.due_date_time}
        </div>
      )}
    </div>
  );
};
