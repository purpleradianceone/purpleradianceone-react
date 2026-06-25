/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Calendar,
  CalendarClock,
  CalendarDays,
  ChevronRight,
  Download,
  File,
  FileText,
  Flag,
  Layers,
  MessageSquare,
  Paperclip,
  Save,
  Upload,
  User,
  X,
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
import {
  customDateRangeId,
  useSearchFilterPaginationDateHandlers,
} from "../../../config/hooks/usePaginationHandler";
import TaskStageChip from "../../ui/TaskStageChip";
import SearchInput from "../../ui/SearchInput";
import DateRangeFilterDropdown from "../../ui/DateRangeFilterDropdown";
import DateRangePicker from "../../ui/DateRangePicker";
import { useComapanySpecificSearchDateRange } from "../../../config/hooks/useCompanySpecificDateRange";
import useTaskStage from "../../../config/hooks/useTaskStage";
import { handleApiError } from "../../../config/error/handleApiError";
import ConfirmationDialog from "../../dialogue-box/ConfirmationDialogue";
import FormInput from "../../ui/FormInput";
import CustomDocumentPreviewComponent from "../../custom-document-preview-component/CustomDocumentPreviewComponent";
import COLORS from "../../../constants/Colors";
import MetaInfoItem from "../../ui/MetaInfoItem";

interface TaskCardProps {
  task: any;
  setTaskList: React.Dispatch<React.SetStateAction<any[]>>;
}

function MasterTaskUpdate() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { loginStatus } = useLoggedInUserContext();
  const { taskPriority } = useTaskPriority();
  const { taskStage } = useTaskStage();
  const { dateRangeDropdownOptions } = useComapanySpecificSearchDateRange();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessDeniedPopUpOpen, setAccessDeniedPopUpOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [generalTaskUpdate, setGeneralTaskUpdate] = useState<number>(0);
  const [taskList, setTaskList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showCompanyLogoPreview, setShowCompanyLogoPreview] = useState(false);
  const [selectedSupportTicket, setSelectedSupportTicket] =
    useState<MasterTaskProps | null>(null);
  const [selectedTaskStage, setselectedTaskStage] = useState<
    number | undefined
  >();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    subject: undefined as string | undefined,
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
        setSelectedSupportTicket(formattedData);

        // ⭐ PREFILL FORM
        setFormData({
          taskPriority: formattedData.generalTaskPriorityId,
          description: formattedData.description,
          assignedTo: formattedData.assignedTo,
          isActive: formattedData.isActive,
          subject: formattedData.subject,
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
  console.log(selectedSupportTicket);

  const getGeneralTask = async (signal?: AbortSignal) => {
    if (loginStatus.companyId === 0) return;
    const offset = (currentPage - 1) * pageSize;
    try {
      setLoading(true);
      const postData = {
        company_id: loginStatus.companyId,
        requestedby_id: loginStatus.id,
        general_task_master_id: taskId,
        general_task_stage_id: selectedTaskStage,
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
      if (res.data.length > 0) {
        console.log(res.data);
        console.log(loading);
        setTaskList(res.data);
      } else {
        navigate(-1);
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
  }, [taskId, generalTaskUpdate]);
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
    selectedTaskStage,
    generalTaskUpdate,
  ]);

  const handleDropdownChange = (field: string, value: number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirmation = async () => {
    try {
      const res = await axiosClient.post(
        POST_API.UPDATE_GENERAL_TASK_MASTER,
        {
          id: selectedSupportTicket?.id,
          company_id: loginStatus.companyId,
          updatedby_id: loginStatus.id,
          isactive: !formData.isActive,
        },
        {
          withCredentials: true,
        },
      );

      if (res.data.status) {
        toast.success(res.data.message);
        setGeneralTaskUpdate(generalTaskUpdate + 1);
      } else {
        toast.error(res.data.message);
        setFormData((prev) => ({
          ...prev,
          isActive: formData.isActive,
        }));
      }
    } catch (error) {
      // ⭐ Rollback if failed
      setFormData((prev) => ({
        ...prev,
        isActive: formData.isActive,
      }));

      handleApiError(error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
      subject: formData.subject,
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
      .catch((error) => {
        handleApiError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const updateTaskDocument = async () => {
    if (!selectedFile) {
      return;
    }
    setIsSubmitting(true);
    const data = {
      id: selectedSupportTicket?.id,
      company_id: loginStatus.companyId,
      updatedby_id: loginStatus.id,
    };
    const formPayload = new FormData();
    formPayload.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" }),
    );
    // ✅ File append
    if (selectedFile) {
      formPayload.append("file", selectedFile);
    }

    for (const [key, value] of formPayload.entries()) {
      console.log(key, value);
    }

    await axiosClient
      .post(POST_API.UPDATE_GENERAL_TASK_MASTER_DOCUMENT, formPayload, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status) {
          toast.success(res.data.message);
          setSelectedFile(null);
          setGeneralTaskUpdate((prev) => prev + 1);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        handleApiError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const downloadTaskDocument = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosClient.post(
        POST_API.GET_GENERAL_TASK_MASTER_DOCUMENT,
        {
          id: selectedSupportTicket?.id,
          company_id: loginStatus.companyId,
          requestedby_id: loginStatus.id,
        },
        {
          responseType: "blob", // VERY IMPORTANT
          withCredentials: true,
        },
      );

      const blob = new Blob([response.data], {
        type: selectedSupportTicket?.extension,
      });

      console.log(response.data);

      const imageUrl = URL.createObjectURL(blob);
      setLogoPreview(imageUrl);
      setShowCompanyLogoPreview(true);

      // Create download link
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement("a");
      // link.href = url;

      // const contentDisposition = response.headers["content-disposition"];

      // let fileName = `${selectedSupportTicket?.id}.${selectedSupportTicket?.extension}`;

      // // If backend sends filename → override
      // if (contentDisposition) {
      //   const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
      //   if (fileNameMatch?.length === 2) {
      //     fileName = fileNameMatch[1];
      //   }
      // }

      // link.setAttribute("download", fileName);
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
    } catch (error) {
      console.error(error);
      toast.error("Failed to download document");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {userHasAccessToUpdateMasterTasks ? (
        <div className=" w-full pl-5 min-h-[90vh] ">
          {" "}
          <div>
            <ConfirmationDialog
              message="You are about to mark this master as inactive. All future non-completed General Tasks created using this master will be permanently deleted. Existing completed tasks will remain unaffected. Do you want to continue?"
              onCancel={() => {
                setConfirmationOpen(false);
              }}
              onConfirm={handleConfirmation}
              open={confirmationOpen}
              title="Master Inactive"
            />
            <div className="h-[30px] sticky top-10 z-10 bg-slate-100 flex text-center justify-start items-center gap-3 ml-0.5 ">
              <Link to={ROUTES_URL.TASKS_MANAGEMENT + "/my-tasks"}>
                <Button className="caption-custom flex items-center justify-center hover:text-gray-800">
                  Master Tasks
                </Button>
              </Link>
              <ChevronRight size={16} />
              <h1 className="table-header-custom">Master Task Details</h1>
            </div>
            <div className="bg-gray-50 w-full px-2 pt-0.5 rounded">
              {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
              {!selectedSupportTicket ? (
                <MasterTaskSkeleton />
              ) : (
                <div className="space-y-4 mt-3">
                  {/* ROW 1 */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-[220px_1fr]">
                      {/* Logo */}

                      <div className="p-5 border-r border-slate-200 flex gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg ${COLORS.LIGHT_PURPLE_BACKGROUND}
                        flex items-center justify-center`}
                        >
                          <FileText
                            size={22}
                            className={COLORS.PRIMARY_PURPLE}
                          />
                        </div>

                        <div>
                          <h2 className="page-header-custom !text-[17px] font-semibold">
                            {selectedSupportTicket.subject}
                          </h2>

                          <p className="caption-custom mt-1">
                            {selectedSupportTicket.generalTaskTypeName}
                          </p>
                          <div className="mt-2 flex justify-start items-start flex-col gap-2">
                            <TaskPriorityChip
                              priorityName={
                                selectedSupportTicket.generalTaskPriorityName
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* header */}
                      <div className="p-5 ">
                        <div className="grid grid-cols-5 gap-x-2 gap-y-6 py-1">
                          <MetaInfoItem
                            icon={Flag}
                            label="Task Type"
                            value={selectedSupportTicket.generalTaskTypeName}
                            iconBgClass={COLORS.LIGHT_PURPLE_BACKGROUND}
                            iconColorClass={COLORS.PRIMARY_PURPLE}
                          />

                          <MetaInfoItem
                            icon={Calendar}
                            label="Frequency"
                            value={selectedSupportTicket.frequencyName}
                            iconBgClass="bg-orange-50"
                            iconColorClass="text-orange-600"
                          />

                          <MetaInfoItem
                            icon={CalendarDays}
                            label="Start Date"
                            value={selectedSupportTicket.startDate}
                            iconBgClass="bg-green-50"
                            iconColorClass="text-green-600"
                          />

                          <MetaInfoItem
                            icon={CalendarDays}
                            label="End Date"
                            value={selectedSupportTicket.endDate}
                            iconBgClass="bg-red-50"
                            iconColorClass="text-red-600"
                          />
                          <MetaInfoItem
                            icon={CalendarClock}
                            label="Time"
                            value={selectedSupportTicket.taskTime}
                            iconBgClass="bg-blue-50"
                            iconColorClass="text-blue-600"
                          />

                          <MetaInfoItem
                            icon={User}
                            label="Created By"
                            value={selectedSupportTicket.createdByName}
                            iconBgClass="bg-violet-50"
                            iconColorClass="text-violet-600"
                          />
                          <MetaInfoItem
                            icon={Calendar}
                            label="Created On"
                            value={selectedSupportTicket.createdOn}
                            iconBgClass="bg-amber-50"
                            iconColorClass="text-amber-600"
                          />

                          <MetaInfoItem
                            icon={User}
                            label="Updated By"
                            value={selectedSupportTicket.updatedByName}
                            iconBgClass="bg-violet-50"
                            iconColorClass="text-violet-600"
                          />
                          <MetaInfoItem
                            icon={Calendar}
                            label="Updated On"
                            value={selectedSupportTicket.updatedOn}
                            iconBgClass="bg-amber-50"
                            iconColorClass="text-amber-600"
                          />

                          {/* STATUS */}
                          <div className="flex flex-col border-l-2 pl-10">
                            <span className="caption-custom">Status</span>

                            <div className="flex items-center gap-2 mt-1">
                              <ToggleButton
                                checked={formData.isActive}
                                name="isActive"
                                onToggle={() => {
                                  if (!formData.isActive) {
                                    toast.error(
                                      "Inactive master task cannot be updated.",
                                    );
                                    return;
                                  }
                                  setConfirmationOpen(true);
                                }}
                              />

                              <span
                                className={`text-sm ${
                                  formData.isActive
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {formData.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ROW 2 */}

                  <div className="grid grid-cols-[minmax(0,1fr)_350px] gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FormInput
                            logo={File}
                            label="Subject"
                            name="subject"
                            defaultValue={formData.subject}
                            value={formData.subject}
                            onChange={(e: any) =>
                              handleInputChange("subject", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <CustomDropdown
                            logo={Flag}
                            labelName="Priority"
                            options={taskPriority!}
                            preselectedOption={formData.taskPriority}
                            onSelect={(v) =>
                              handleDropdownChange("taskPriority", v)
                            }
                          />
                        </div>

                        {/* DESCRIPTION */}
                        <div>
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
                        {/* ASSIGN */}

                        <div>
                          <CompanyUserSearchFieldInput
                            label="Assign"
                            logo={User}
                            defaultValue={
                              selectedSupportTicket?.assignedToName ?? ""
                            }
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
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-end gap-1  ">
                        <div className="flex justify-end items-end ">
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

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-3 px-5 h-fit">
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <Paperclip size={16} className="text-violet-600" />
                        <h3 className="font-medium text-slate-800">
                          Attachments
                        </h3>
                      </div>

                      {/* Existing Document */}
                      {selectedSupportTicket?.extension && (
                        <div className="border rounded-xl p-2 bg-slate-50 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                              <FileText size={20} className="text-red-500" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className="table-header-custom truncate"
                                title={selectedSupportTicket.subject}
                              >
                                {selectedSupportTicket.subject ||
                                  "Task Document"}
                              </p>

                              <p className="caption-custom ">
                                {selectedSupportTicket.extension?.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="mt-2 w-[50%]">
                            <Button
                              className={`caption-custom w-full flex items-center justify-center p-1 ml-12 ${COLORS.LIGHT_PURPLE_HOVER} ${COLORS.PRIMARY_PURPLE} rounded-lg
   border !border-violet-200 gap-1 font-medium shadow-sm hover:shadow-md`}
                              onClick={downloadTaskDocument}
                              disabled={!selectedSupportTicket?.extension}
                            >
                              <Download size={16} />
                              Preview & Download
                            </Button>
                          </div>{" "}
                          {showCompanyLogoPreview && (
                            <div
                              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                              onClick={() => setShowCompanyLogoPreview(false)}
                            >
                              <CustomDocumentPreviewComponent
                                fileUrl={
                                  logoPreview ??
                                  selectedSupportTicket?.cdnUrl ??
                                  ""
                                }
                                fileExtension={selectedSupportTicket?.extension}
                                width={"50%"}
                                enableDownload={true}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Upload Area */}
                      <div className="border border-dashed border-slate-300 rounded-xl p-2 mb-1 ">
                        <input
                          type="file"
                          id="fileUpload"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setSelectedFile(e.target.files[0]);
                            }
                          }}
                        />

                        <label
                          htmlFor="fileUpload"
                          className={`flex items-center justify-center gap-2 cursor-pointer ${COLORS.PRIMARY_PURPLE} text-sm font-medium`}
                        >
                          <Upload size={16} />
                          Select Document
                        </label>

                        {selectedFile && (
                          <div className="mt-1 bg-slate-50 rounded-lg p-2 flex items-center justify-between">
                            <span
                              className="text-xs truncate flex-1"
                              title={selectedFile.name}
                            >
                              {selectedFile.name}
                            </span>

                            <button
                              type="button"
                              onClick={() => setSelectedFile(null)}
                              className="ml-2"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Upload Button */}
                      <div className="flex flex-col justify-end items-center gap-2 py-1">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            updateTaskDocument();
                          }}
                          disabled={!selectedFile}
                        >
                          <div className="flex gap-2 items-center">
                            <Save size={15} />
                            Upload Document
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-2 mt-2 border rounded ">
                <div className="flex gap-2 border-b">
                  <h3
                    className={`font-semibold ${COLORS.PRIMARY_PURPLE} mb-3 `}
                  >
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
                          {dateRangeId === customDateRangeId && (
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
                {loading ? (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] pt-2 gap-x-2 h-[54vh] overflow-auto">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <TaskCardSkeleton key={index} />
                    ))}
                  </div>
                ) : (
                  taskList && (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] pt-2 gap-x-2 h-[54vh] overflow-auto">
                      {taskList.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          setTaskList={setTaskList}
                        />
                      ))}
                    </div>
                  )
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

export const TaskCard = ({ task, setTaskList }: TaskCardProps) => {
  const { loginStatus } = useLoggedInUserContext();

  const handleGeneralTaskToggle = async (
    event: React.ChangeEvent<HTMLInputElement>,
    taskId: number,
  ) => {
    const checked = event.target.checked;

    const previousValue = task.isactive;

    // ⭐ Instant UI Update
    setTaskList((prev: any[]) =>
      prev.map((t: any) =>
        t.id === taskId
          ? {
              ...t,
              isactive: checked,
            }
          : t,
      ),
    );

    try {
      const res = await axiosClient.post(
        POST_API.UPDATE_GENERAL_TASK,
        {
          company_id: loginStatus.companyId,
          updatedby_id: loginStatus.id,
          id: taskId,
          isactive: checked,
        },
        { withCredentials: true },
      );

      if (res.data.status) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
        setTaskList((prev: any[]) =>
          prev.map((t: any) =>
            t.id === taskId
              ? {
                  ...t,
                  isactive: previousValue,
                }
              : t,
          ),
        );
      }
    } catch (error) {
      // ⭐ Rollback UI
      setTaskList((prev: any[]) =>
        prev.map((t: any) =>
          t.id === taskId
            ? {
                ...t,
                isactive: previousValue,
              }
            : t,
        ),
      );

      handleApiError(error);
    }
  };
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
          title={task.subject || "-"}
        >
          {task.subject || "-"}
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
      <div
        className={`flex items-center gap-2 mt-2 text-xs ${COLORS.PRIMARY_PURPLE}`}
      >
        <User size={14} className={`${COLORS.PRIMARY_PURPLE}`} />

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
      <div
        className={`flex gap-2 mt-3 text-xs ${task.description ? "text-gray-500" : "text-gray-500"}`}
      >
        <File size={14} />
        <span className="truncate w-full" title={task.description || "-"}>
          {task.description || "-"}
        </span>
        {/* <TextAreaInput
          disabled={true}
          cols={3}
          label=""
          rows={2}
          defaultValue={task.description}
          className="w-full"
        /> */}
      </div>
      <div className="flex w-full items-end justify-end ">
        <ToggleButton
          label="Status"
          wantLabel={true}
          checked={task.isactive}
          name="isActive"
          onToggle={(e) => handleGeneralTaskToggle(e, task.id)}
        />
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse
        bg-gray-200
        rounded-md
        ${className}
      `}
    />
  );
}

export function MasterTaskSkeleton() {
  return (
    <div className="bg-white border rounded p-3 space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>

      {/* Row 2 */}

      <div className="grid grid-cols-8 gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-16 col-span-4" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div
      className="
      bg-white
      rounded-xl
      border
      shadow-sm
      p-4
      mb-3
      w-full
      max-w-[420px]
    "
    >
      <Skeleton className="h-4 w-full mb-3" />

      <Skeleton className="h-3 w-1/2 mb-3" />

      <Skeleton className="h-3 w-1/3 mb-2" />

      <Skeleton className="h-3 w-2/3 mb-2" />

      <Skeleton className="h-3 w-1/2 mb-4" />

      <div className="flex justify-end">
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}
