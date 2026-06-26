/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  AlignLeft,
  Calendar,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Download,
  FileEdit,
  FileText,
  Flag,
  Save,
  User,
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
import CustomDocumentPreviewComponent from "../../custom-document-preview-component/CustomDocumentPreviewComponent";
import COLORS from "../../../constants/Colors";
import MetaInfoItem from "../../ui/MetaInfoItem";

function GeneralTask() {
  const { loginStatus } = useLoggedInUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<any>(null);
  const { taskStage } = useTaskStage();
  const { taskId, masterId } = useParams();
  const { userHasAccessToUpdateAllTasks, userHasAccessToViewAllTasks } =
    useUserAccessModules();
  const [selectedGeneralTask, setSelectedGeneralTask] = useState<any>(null);
  const [generalMasterTask, setGeneralMasterTask] = useState<MasterTaskProps>();
  const [isLoadingTask, setIsLoadingTask] = useState<boolean>(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showCompanyLogoPreview, setShowCompanyLogoPreview] = useState(false);

  useEffect(() => {
    if (!userHasAccessToViewAllTasks) {
      setAccessDeniedPopUpOpen(true);
    }
  }, [userHasAccessToViewAllTasks]);
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
    // store original copy
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
          cdnUrl: item.document_cdn_url,
        };
        setGeneralMasterTask(formattedData);
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const downloadTaskDocument = async () => {
    if (
      generalMasterTask?.extension === null ||
      generalMasterTask?.extension === ""
    ) {
      return;
    }
    setIsSubmitting(true);
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

      const blob = new Blob([response.data], {
        type: generalMasterTask?.extension,
      });

      console.log(response.data);

      const imageUrl = URL.createObjectURL(blob);
      setLogoPreview(imageUrl);
      setShowCompanyLogoPreview(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download document");
    } finally {
      setIsSubmitting(false);
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
      {userHasAccessToViewAllTasks ? (
        <div className="w-full min-h-screen bg-slate-50 pl-5">
          <div className=" sticky top-10 z-10 bg-slate-100 h-8 flex text-center justify-start items-center gap-3 ml-0.5 ">
            <Link to={ROUTES_URL.TASKS_MANAGEMENT}>
              <Button className="caption-custom flex items-center justify-center hover:text-gray-800">
                My Tasks
              </Button>
            </Link>
            <ChevronRight size={16} />
            <h1 className="table-header-custom">My Task Details</h1>
          </div>
          <div className="grid md:grid-cols-[1.2fr_1.1fr] grid-cols-1 gap-6 p-4">
            <div>
              {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
              {isLoadingTask && !selectedGeneralTask ? (
                <GeneralTaskSkeleton />
              ) : (
                <>
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full">
                    {/* HEADER */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                      <div className="flex items-start ">
                        <div
                          className={`p-2 rounded-lg ${COLORS.PAGE_HEADER_SECTION_BG_COLOR} flex items-center justify-center shrink-0`}
                        >
                          <FileEdit
                            className={COLORS.PAGE_HEADER_ICONS_COLOR_AND_SIZE}
                          />
                        </div>
                      </div>

                      <div>
                        <h2 className="page-header-custom !text-[16px] font-semibold ">
                          General Task Update
                        </h2>
                      </div>
                    </div>
                    {/* ROW */}

                    <div className="grid grid-cols-2 gap-y-4 mt-4">
                      <MetaInfoItem
                        icon={FileText}
                        label="Subject"
                        value={formData.subject}
                        iconBgClass="bg-orange-50"
                        iconColorClass="text-orange-600"
                        className="col-span-2"
                      />
                      <div className="col-span-2 flex items-start gap-6">
                        <MetaInfoItem
                          icon={AlignLeft}
                          label="Description"
                          value={selectedGeneralTask?.description}
                          iconBgClass={COLORS.LIGHT_PURPLE_BACKGROUND}
                          iconColorClass={COLORS.PRIMARY_PURPLE}
                          className="col-span-2"
                        />
                        {generalMasterTask?.extension && (
                          <button
                            title="Document Download"
                            className="justify-end items-start "
                            onClick={(e) => {
                              e.preventDefault();
                              downloadTaskDocument();
                            }}
                            disabled={
                              generalMasterTask?.extension === null ||
                              generalMasterTask?.extension === ""
                            }
                          >
                            <Download size={22} className="text-blue-500" />
                          </button>
                        )}
                        {showCompanyLogoPreview && (
                          <div
                            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                            onClick={() => setShowCompanyLogoPreview(false)}
                          >
                            <CustomDocumentPreviewComponent
                              fileUrl={
                                logoPreview ?? generalMasterTask?.cdnUrl ?? ""
                              }
                              fileExtension={generalMasterTask?.extension}
                              width={"50%"}
                              enableDownload={true}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-[2.4fr_1.5fr] mt-4 pb-5">
                      <div className="w-[75%] justify-end  ">
                        <TextAreaInput
                          label="Remark"
                          // logo={FileText}
                          value={formData.remark}
                          placeholder="Enter remark here...."
                           readonly={!userHasAccessToUpdateAllTasks}
                          disabled={!userHasAccessToUpdateAllTasks}
                          onChange={(e) => handleInputChange("remark", e.target.value)}
                                                  // onBlur={autoSave}
                          cols={5}
                          rows={3}
                        />
                      </div>
                      <div className="flex-1 pt-1">
                        <CustomDropdown
                          // logo={Flag}
                          labelName="Task Stage"
                          options={taskStage}
                          preselectedOption={formData.taskStageId}
                         readOnly={!userHasAccessToUpdateAllTasks}
                          onSelect={(v) => handleDropdownChange("taskStageId", v)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end border-t border-slate-200 pt-5 mt-2">
                      <div>
                        <Button
                        disabled={isSubmitting || !userHasAccessToUpdateAllTasks}
                        onClick={() => {
                          if (userHasAccessToUpdateAllTasks) {
                            updateTask();
                          }
                        }}
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
            <div>
              {isLoadingTask && !selectedGeneralTask ? (
                <GeneralTaskDetailsSkeleton />
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full">
                  {/* Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                    <div className="flex items-start ">
                      <div
                        className={`p-2 rounded-lg ${COLORS.PAGE_HEADER_SECTION_BG_COLOR} flex items-center justify-center shrink-0`}
                      >
                        <FileText
                          className={COLORS.PAGE_HEADER_ICONS_COLOR_AND_SIZE}
                        />
                      </div>
                    </div>

                    <h2 className="page-header-custom !text-[16px] font-semibold">
                      Task Information
                    </h2>
                  </div>

                  {/* Information Grid */}
                  <div className="grid grid-cols-2 gap-x-10 gap-y-2 mt-2 ">
                    <div className="p-2 border-b border-slate-100">
                      <MetaInfoItem
                        icon={Flag}
                        label="Task Type"
                        value={selectedGeneralTask?.general_task_type_name}
                        iconBgClass={COLORS.LIGHT_PURPLE_BACKGROUND}
                        iconColorClass={COLORS.PRIMARY_PURPLE}
                      />
                    </div>
                    <div className="p-2 border-b border-slate-100">
                      <MetaInfoItem
                        icon={Calendar}
                        label="Due Date Time"
                        value={selectedGeneralTask?.due_date_time}
                        iconBgClass="bg-orange-50"
                        iconColorClass="text-orange-600"
                      />
                    </div>
                    <div className="p-2  border-b border-slate-100">
                      <MetaInfoItem
                        icon={CalendarCheck}
                        label="Completed Date"
                        value={selectedGeneralTask?.completed_at_date_time}
                        iconBgClass="bg-green-50"
                        iconColorClass="text-green-600"
                      />
                    </div>

                    <div className="p-2  border-b border-slate-100">
                      <div className="flex gap-3 items-start">
                        <div
                          className="w-7 h-7 rounded-xl bg-blue-50
                      flex items-center justify-center"
                        >
                          <Flag size={16} className="text-blue-500" />
                        </div>

                        <div>
                          <p className="caption-custom">Priority</p>

                          <TaskPriorityChip
                            priorityName={
                              selectedGeneralTask?.general_task_priority_name
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-2  border-b border-slate-100">
                      <MetaInfoItem
                        icon={User}
                        label="Created By"
                        value={selectedGeneralTask?.createdby}
                        iconBgClass="bg-violet-50"
                        iconColorClass="text-violet-600"
                      />
                    </div>

                    <div className="p-2  border-b border-slate-100">
                      <MetaInfoItem
                        icon={User}
                        label="Updated By"
                        value={selectedGeneralTask?.updatedby}
                        iconBgClass="bg-violet-50"
                        iconColorClass="text-violet-600"
                      />
                    </div>

                    <div className="p-2  border-b border-slate-100">
                      <MetaInfoItem
                        icon={CalendarDays}
                        label="Created On"
                        value={selectedGeneralTask?.createdon}
                        iconBgClass="bg-blue-50"
                        iconColorClass="text-blue-600"
                      />
                    </div>

                    <div className="p-2  border-b border-slate-100">
                      <MetaInfoItem
                        icon={CalendarDays}
                        label="Updated On"
                        value={selectedGeneralTask?.updatedon}
                        iconBgClass="bg-blue-50"
                        iconColorClass="text-blue-600"
                      />
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
