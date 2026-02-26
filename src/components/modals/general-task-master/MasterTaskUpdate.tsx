/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CalendarClock,
  ChevronRight,
  FileText,
  Flag,
  Layers,
  MessageSquare,
  Save,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosClient from "../../../axios-client/AxiosClient";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import Button from "../../ui/Button";
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
import PaginationWithoutCount from "../../ag-grid/PaginationWithoutCount";
import { useSearchFilterPaginationDateHandlers } from "../../../config/hooks/usePaginationHandler";
import TaskStageChip from "../../ui/TaskStageChip";
import SearchInput from "../../ui/SearchInput";
import DateRangeFilterDropdown from "../../ui/DateRangeFilterDropdown";
import DateRangePicker from "../../ui/DateRangePicker";
import { useComapanySpecificSearchDateRange } from "../../../config/hooks/useCompanySpecificDateRange";
import useTaskStage from "../../../config/hooks/useTaskStage";

function MasterTaskUpdate() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { loginStatus } = useLoggedInUserContext();
  const { taskPriority } = useTaskPriority();
  const { taskStage } = useTaskStage();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [taskList, setTaskList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupportTicket, setSelectedSupportTicket] =
    useState<MasterTaskProps | null>(null);
  const [selectedTaskStage, setselectedTaskStage] = useState<
    number | undefined
  >();
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

  const {
    currentPage,
    currentPageData,
    pageSize,
    searchParameter,
    dateRangeId,
    concatDate,
    startDate,
    endDate,

    handleEndDateChange,
    handleStartDateChange,
    handleDatePageIdChange,
    setCurrentPageData,
    handlePageSizeChange,
    handlePageChange,
    handleSearchParameterChange,
  } = useSearchFilterPaginationDateHandlers();

  const selectedDateName =
    dateRangeDropdownOptions.find((o) => o.search_date_range_id === dateRangeId)
      ?.date_range || "Date Filter";

  const handleSelectedTaskStage = (selectedTaskStage: number | undefined) => {
    setselectedTaskStage(selectedTaskStage);
  };

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
    if (loginStatus.companyId === 0) return;
    const offset = (currentPage - 1) * pageSize;
    try {
      setLoading(true);
      const postData = {
        company_id: loginStatus.companyId,
        requestedby_id: loginStatus.id,
        general_task_master_id: Number(taskId),
        general_task_stage_id: Number(selectedTaskStage),
        search_parameter: searchParameter,
        search_parameter_date: concatDate,
        search_company_specific_date_range_id: dateRangeId,
        offset: offset,
        limit: pageSize,
      };
      console.log(postData);

      const res = await axiosClient.post(POST_API.GET_GENERAL_TASK, postData, {
        signal,
        withCredentials: true,
      });
      setCurrentPageData({
        currentPage: currentPage,
        pageDataLength: res.data.length,
      });
      if (res.data) {
        console.log(res.data);
        console.log(loading);
        setTaskList(res.data);
      }
    } catch (error: any) {
      // toast.error("Failed to load tasks", error.response?.data?.message || "");
      console.log(error);
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
    return () => {
      controller.abort();
    };
  }, [taskId]);
  useEffect(() => {
    const controller = new AbortController();
    getGeneralTask(controller.signal);
    return () => {
      controller.abort();
    };
  }, [
    pageSize,
    currentPage,
    dateRangeId,
    searchParameter,
    concatDate,
    searchParameter,
    selectedTaskStage,
  ]);

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
        <div className=" w-full pl-5 pt-2 min-h-[90vh] ">
          {" "}
          <div>
            <div className=" sticky top-10 z-10 bg-slate-100 flex text-center justify-start items-center gap-3 ml-0.5 ">
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
              <div className="bg-white border rounded p-2 space-y-2">
                {/* ROW 1 */}
                <div className="grid grid-cols-7 gap-3 items-end text-sm">
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
                {/* ROW 2 */}
                <div className="grid grid-cols-7 gap-3 text-sm">
                  <CustomDropdown
                    logo={Flag}
                    labelName="Priority"
                    options={taskPriority!}
                    preselectedOption={formData.taskPriority}
                    onSelect={(v) => handleDropdownChange("taskPriority", v)}
                  />
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
                  {/* DESCRIPTION */}
                  <div className="col-span-3">
                    <TextAreaInput
                      label="Description"
                      logo={FileText}
                      value={formData.description}
                      onChange={(e: any) =>
                        handleInputChange("description", e.target.value)
                      }
                      cols={3}
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end items-end pr-8">
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
              </div>
              <div className="p-2 mt-2 border rounded ">
                <div className="flex gap-2 border-b">
                  <h3 className="font-semibold text-gray-800 mb-3 ">
                    General tasks
                  </h3>
                  <SearchInput
                    value={searchParameter}
                    onChange={(e) => {
                      handleSearchParameterChange(e.target.value);
                    }}
                  ></SearchInput>
                  <div>
                    <div className="grid grid-cols-1 justify-center gap-1 w-full">
                      {/* Shared width wrapper */}
                      <div className="relative w-fit flex justify-center gap-1">
                        <div className="flex col-span-2 w-fit">
                          <DateRangeFilterDropdown
                            dropdownOptions={dateRangeDropdownOptions}
                            handleDateIdChange={handleDatePageIdChange}
                            selectedOption={selectedDateName}
                          />
                          {dateRangeId === 9 && (
                            <div className="mt-1 ml-2 w-fit">
                              <DateRangePicker
                                onStartDateChange={handleStartDateChange}
                                onEndDateChange={handleEndDateChange}
                                initialStartDate={startDate}
                                initialEndDate={endDate}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-[150px]">
                    <CustomDropdown
                      preselectedOption={
                        // savedFilters.selectedtaskType || null
                        selectedTaskStage
                      }
                      labelName="stage"
                      options={taskStage!}
                      onSelect={handleSelectedTaskStage}
                    />
                  </div>
                </div>
                {taskList && (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] pt-2 gap-x-2 h-[54vh] overflow-auto">
                    {taskList.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-end border-t ">
                  <PaginationWithoutCount
                    currentPage={currentPage}
                    currentPageData={currentPageData}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
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
    <div
      className="
      bg-white
  rounded-xl
  border
  shadow-sm
  hover:shadow-md
  transition-all
  p-4
  mb-3
  cursor-pointer
  w-full
  max-w-[420px]
  h-fit
    "
    >
      {/* Description */}
      <div className="flex gap-2 items-start">
        <FileText size={16} className="text-gray-400 mt-0.5" />

        <h3
          className=" text-sm font-semibold text-gray-800 leading-snug truncate w-full"
          title={task.description || "-"}
        >
          {task.description || "-"}
        </h3>
      </div>

      {/* Task Type + Stage */}
      <div className="flex justify-between mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Layers size={14} />
          <TaskStageChip
            stageId={task.general_task_stage_id}
            stageName={task.general_task_stage_name}
          />
        </span>

        <TaskPriorityChip priorityName={task.general_task_priority_name} />
      </div>

      {/* Assigned To */}
      <div className="flex items-center gap-2 mt-3 text-xs text-blue-500">
        <User size={14} className="text-blue-500 " />

        <span>{task.assignedto || "Unassigned"}</span>
      </div>

      {/* Due Date */}
      {task.due_date_time && (
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <CalendarClock size={14} className="text-orange-500" />

          <span>Due : {task.due_date_time}</span>
        </div>
      )}

      {/* Completed Date */}
      <div
        className={`flex items-center gap-2 mt-2 text-xs ${task.completed_at_date_time ? "text-green-600" : "text-gray-500"} `}
      >
        <Flag
          size={14}
          color={`${task.completed_at_date_time ? "green" : "gray"}`}
        />
        <span>Completed Date : {task.completed_at_date_time || "-"}</span>
      </div>

      {/* Remark */}
      <div
        className={`flex gap-2 mt-3 text-xs ${task.remark ? "text-gray-500" : "text-gray-500"}`}
      >
        <MessageSquare size={14} />
        <span className="truncate w-full" title={task.remark || "-"}>
          {task.remark || "-"}
        </span>
      </div>
    </div>
  );
};
