/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ChevronRight,
  ClipboardList,
  FileText,
  Flag,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import MasterTaskProps from "../../../@types/my-task-management/MasterTaskProps";
import PostDataToGetMasterTask from "../../../@types/my-task-management/PostDatatoGetMasterTask";
import axiosClient from "../../../axios-client/AxiosClient";
import { handleApiError } from "../../../config/error/handleApiError";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import useTaskStage from "../../../config/hooks/useTaskStage";
import { STATUS_CODE } from "../../../constants/AppConstants";
import POST_API from "../../../constants/PostApi";
import ROUTES_URL from "../../../constants/Routes";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import CustomDropdown from "../../modals/leads/CustomDropdown";
import Button from "../../ui/Button";
import TaskPriorityChip from "../../ui/TaskPriorityChip";
import TextAreaInput from "../../ui/TextAreaInput";
import LoadingPopUpAnimation from "../card/LoadingPopUpAnimation";
import AccessDeniedPopup from "../not-found/AccessDeniedPage";

function GeneralTask() {
  const { loginStatus } = useLoggedInUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<any>(null);
  const { taskStage } = useTaskStage();
  const { taskId, masterId } = useParams();
  const { userHasAccessToUpdateAllTasks } = useUserAccessModules();
  const [selectedGeneralTask, setSelectedGeneralTask] = useState<any>(null);
  const [generalMasterTask, setGeneralMasterTask] = useState<MasterTaskProps>();
  const [isLoadingTask, setIsLoadingTask] = useState<boolean>(false);

  useEffect(() => {
    if (!userHasAccessToUpdateAllTasks) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToUpdateAllTasks]);
  /* ---------- FORM DATA ---------- */
  const [formData, setFormData] = useState({
    remark: "",
    taskStageId: undefined as number | undefined,
    isActive: false,
    subject: "",
  });
  console.log(originalFormData);

  /* ---------- GET TASK ---------- */
  useEffect(() => {
    if (!selectedGeneralTask) return;
    console.log(selectedGeneralTask);

    const data = {
      remark: selectedGeneralTask.remark || "",
      taskStageId: selectedGeneralTask.general_task_stage_id ?? undefined,
      isActive: selectedGeneralTask.isactive ?? false,
      subject: selectedGeneralTask?.subject,
    };
    setFormData(data);
    // 👇 store original copy
    setOriginalFormData(data);
  }, [selectedGeneralTask]);

  /* ---------- HANDLERS ---------- */
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDropdownChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTask = async () => {
    try {
      setIsLoadingTask(true);
      const res = await axiosClient.post(
        POST_API.GET_GENERAL_TASK,
        {
          company_id: loginStatus.companyId,
          requestedby_id: loginStatus.id,
          id: Number(taskId),
          general_task_master_id: Number(masterId),
        },
        {
          withCredentials: true,
        },
      );

      if (res.data?.length > 0) {
        setSelectedGeneralTask(res.data[0]);
      } else {
        toast.error("Task not found.");
      }
    } catch (error: any) {
      if (error.name === "CanceledError") return;

      handleApiError(error);
    } finally {
      setIsLoadingTask(false);
    }
  };
  /* ---------- UPDATE ---------- */
  const updateTask = async () => {
    try {
      setIsSubmitting(true);
      const res = await axiosClient.post(
        POST_API.UPDATE_GENERAL_TASK,
        {
          company_id: loginStatus.companyId,
          updatedby_id: loginStatus.id,
          id: selectedGeneralTask.id,
          remark: formData.remark,
          isactive: formData.isActive,
          general_task_stage_id: formData.taskStageId,
        },
        {
          withCredentials: true,
        },
      );
      if (res.data.status) {
        toast.success(res.data.message);
        const updatedTask = {
          ...selectedGeneralTask,
          remark: formData.remark,
          general_task_stage_id: formData.taskStageId,
          isactive: formData.isActive,
        };
        setOriginalFormData(updatedTask);

        // ⭐ reset UI -> skeleton shows
        setSelectedGeneralTask(null);

        await getTask();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMasterTaskData = async () => {
    if (!masterId) return;
    const PostDataToGetAllTask: PostDataToGetMasterTask = {
      company_id: loginStatus.companyId,
      id: Number(masterId),
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
          withCredentials: true,
        },
      );
      if (response.status === STATUS_CODE.OK) {
        const item = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        const formattedData: MasterTaskProps = {
          id: item.id,
          subject: item.subject,
          extension: item.document_file_extension,
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
        setGeneralMasterTask(formattedData);
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const downloadTaskDocument = async () => {
    try {
      const response = await axiosClient.post(
        POST_API.GET_GENERAL_TASK_MASTER_DOCUMENT,
        {
          id: generalMasterTask?.id,
          company_id: loginStatus.companyId,
          requestedby_id: loginStatus.id,
        },
        {
          responseType: "blob", // VERY IMPORTANT
          withCredentials: true,
        },
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];

      let fileName = `${generalMasterTask?.id}.${generalMasterTask?.extension}`;

      // If backend sends filename → override
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch?.length === 2) {
          fileName = fileNameMatch[1];
        }
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      toast.error("Failed to download document");
    }
  };

  useEffect(() => {
    if (!taskId || loginStatus.companyId === 0) return;
    getTask();
    getMasterTaskData();
  }, [taskId, masterId]);

  /* ---------- UI ---------- */
  return (
    <>
      {userHasAccessToUpdateAllTasks ? (
        <div className=" w-full h-[100vh] pl-5 pt-2 ">
          <div className=" sticky top-10 z-10 bg-slate-100 flex text-center justify-start items-center gap-3 ml-0.5 ">
            <Link to={ROUTES_URL.TASKS_MANAGEMENT}>
              <Button className="caption-custom flex items-center justify-center hover:text-gray-800">
                My Tasks
              </Button>
            </Link>
            <ChevronRight size={16} />
            <h1 className="table-header-custom">My Task Details</h1>
          </div>
          <div className=" grid grid-cols-2 gap-1 p-4">
            <div className=" bg-gray-50 w-full  rounded">
              {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
              {isLoadingTask && !selectedGeneralTask ? (
                <GeneralTaskSkeleton />
              ) : (
                <>
                  <div className=" bg-white border rounded-lg p-4 space-y-4 ">
                    {/* HEADER */}
                    <h1 className=" font-semibold text-gray-800 border-b pb-2 ">
                      General Task Update
                    </h1>
                    {/* ROW */}

                    <div className=" grid grid-cols-2 gap-3">
                      <div className="">
                        <label className="input-label-custom">
                          <ClipboardList
                            size={15}
                            className="inline mr-1 text-blue-500"
                          />
                          Subject
                        </label>

                        <p className="input-label-custom pl-4">
                          {formData.subject}
                        </p>
                      </div>
                      <CustomDropdown
                        logo={Flag}
                        labelName="Task Stage"
                        options={taskStage}
                        preselectedOption={formData.taskStageId}
                        onSelect={(v) => {
                          handleDropdownChange("taskStageId", v);
                        }}
                      />
                      <div className="">
                        <TextAreaInput
                          label="Remark"
                          logo={FileText}
                          value={formData.remark}
                          onChange={(e: any) => {
                            handleInputChange("remark", e.target.value);
                          }}
                          // onBlur={autoSave}
                          cols={4}
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end items-end ">
                        <div>
                          <Button
                            // className="text-xs bg-blue-500 text-white p-1 w-full rounded"
                            onClick={(e) => {
                              e.preventDefault();
                              downloadTaskDocument();
                            }}
                            disabled={
                              generalMasterTask?.extension === null ||
                              generalMasterTask?.extension === ""
                            }
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end items-end border-t pt-2">
                      <div>
                        <Button
                          disabled={isSubmitting}
                          onClick={updateTask}
                          // className={`px-4 py-1.5 rounded `}
                        >
                          <div className="flex gap-2 items-center">
                            <Save size={15} />
                            {isSubmitting ? "Saving..." : "Save"}
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className=" w-full  px-2 rounded">
              {isLoadingTask && !selectedGeneralTask ? (
                <GeneralTaskDetailsSkeleton />
              ) : (
                <div className=" bg-white border rounded-lg p-4 space-y-4 ">
                  <div className="grid grid-cols-2 gap-4 input-label-custom">
                    <div>
                      <label className="caption-custom">Task Type</label>
                      <p>{selectedGeneralTask?.general_task_type_name}</p>
                    </div>
                    <div>
                      <label className="caption-custom">Due Date Time</label>
                      <p>{selectedGeneralTask?.due_date_time}</p>
                    </div>
                    <div>
                      <label className="caption-custom">Completed Date</label>
                      <p>
                        {selectedGeneralTask?.completed_at_date_time || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="caption-custom flex">Priority</label>
                      <TaskPriorityChip
                        priorityName={
                          selectedGeneralTask?.general_task_priority_name
                        }
                      />
                    </div>
                    <div>
                      <label className="caption-custom">Created By</label>
                      <p>{selectedGeneralTask?.createdby}</p>
                    </div>
                    <div>
                      <label className="caption-custom">Updated By</label>
                      <p>{selectedGeneralTask?.updatedby}</p>
                    </div>
                    <div>
                      <label className="caption-custom">Created On</label>
                      <p>{selectedGeneralTask?.createdon}</p>
                    </div>
                    <div>
                      <label className="caption-custom">Updated On</label>
                      <p>{selectedGeneralTask?.updatedon}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="caption-custom">Description</label>
                      <p>{selectedGeneralTask?.description}</p>
                    </div>
                  </div>
                </div>
              )}
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

export default GeneralTask;

export function GeneralTaskSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Header */}
      <div className="h-5 w-48 bg-gray-200 rounded"></div>

      {/* Dropdown */}
      <div className="h-10 bg-gray-200 rounded"></div>

      {/* Remark */}
      <div className="h-24 bg-gray-200 rounded"></div>

      {/* Button */}
      <div className="flex justify-end">
        <div className="h-9 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function GeneralTaskDetailsSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-2 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>

          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
