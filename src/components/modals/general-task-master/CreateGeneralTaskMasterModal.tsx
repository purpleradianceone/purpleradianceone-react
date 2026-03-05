/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CalendarCheck,
  CalendarDays,
  Clock,
  File,
  FileText,
  Flag,
  Layers,
  ListChecks,
  Paperclip,
  Repeat,
  Save,
  Timer,
  Upload,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import ApiError from "../../../@types/error/ApiError";
import axiosClient from "../../../axios-client/AxiosClient";
import useTaskFrequency from "../../../config/hooks/useTaskFrequency";
import useTaskFrequencyInterval from "../../../config/hooks/useTaskFrequencyInterval";
import useTaskPriority from "../../../config/hooks/useTaskPriority";
import useTaskType from "../../../config/hooks/useTaskType";
import MESSAGE from "../../../constants/Messages";
import POST_API from "../../../constants/PostApi";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import Button from "../../ui/Button";
import CompanyUserSearchFieldInput from "../../ui/CompanyUserSearchFieldInput";
import FormHeader from "../../ui/FormHeader";
import FormLayout from "../../ui/FormLayout";
import TextAreaInput from "../../ui/TextAreaInput";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import CustomDropdown from "../leads/CustomDropdown";
import { handleApiError } from "../../../config/error/handleApiError";
import FormInput from "../../ui/FormInput";

function CreateGeneralTaskMasterModal({
  isOpen,
  handleClose,
  handleTaskMasterCreate,
}: {
  isOpen: boolean;
  handleClose: () => void;
  handleTaskMasterCreate: () => void;
}) {
  const { loginStatus } = useLoggedInUserContext();
  const { taskPriority, isLoading: isLoadingForaskPriority } =
    useTaskPriority();
  const { taskType, isLoading: isLoadingForTaskType } = useTaskType();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { taskFrequency, isLoading: isLoadingForTaskFrequency } =
    useTaskFrequency();
  const { intervalList, isLoading: isLoadingForTaskFrequencyInterval } =
    useTaskFrequencyInterval();
  const [file, setFile] = useState<File | null>(null);

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
    subject: "",
    taskType: undefined as number | undefined,
    taskPriority: undefined as number | undefined,
    frequency: undefined as number | undefined,
    frequencyInterval: undefined as number | undefined,
    description: "",
    startDate: "",
    endDate: "",
    taskTime: "",
  });
  const [errors, setErrors] = useState<any>({});

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();
  // Generic dropdown handler
  const handleDropdownChange = (field: string, value: number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;
    // replace old file
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  // 🔥 Validation
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.taskType) newErrors.taskType = "Task type is required";
    if (!formData.taskPriority) newErrors.taskPriority = "Priority is required";
    if (!formData.frequency) newErrors.frequency = "Frequency is required";
    if (!formData.frequencyInterval)
      newErrors.frequencyInterval = "Interval is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.taskTime) newErrors.taskTime = "Task time is required";

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate > formData.endDate
    ) {
      newErrors.endDate = "End date cannot be before start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      subject: "",
      taskType: undefined,
      taskPriority: undefined,
      frequency: undefined,
      frequencyInterval: undefined,
      description: "",
      startDate: "",
      endDate: "",
      taskTime: "",
    });
    setSelectedCompanyUser({
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
    setErrors({});
    setFile(null);
  };

  const createMyTask = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }
    // setIsSubmitting(true);

    const postData = {
      company_id: loginStatus.companyId,
      subject: formData.subject,
      general_task_type_id: formData.taskType,
      general_task_priority_id: formData.taskPriority,
      frequency_id: formData.frequency,
      frequency_interval: formData.frequencyInterval,
      description: formData.description,
      assignedto:
        selectedCompanyUser.id === 0 ? loginStatus.id : selectedCompanyUser.id,
      start_date: formData.startDate,
      end_date: formData.endDate,
      task_time: formData.taskTime,
      createdby_id: loginStatus.id,
    };
    console.log(postData);

    const formPayload = new FormData();
    formPayload.append(
      "data",
      new Blob([JSON.stringify(postData)], { type: "application/json" }),
    );

    // ✅ File append
    if (file) {
      formPayload.append("file", file);
    }

    for (const [key, value] of formPayload.entries()) {
      console.log(key, value);
    }

    await axiosClient
      .post(POST_API.CREATE_GENERAL_TASK_MASTER, formPayload, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          handleTaskMasterCreate();
          setIsSubmitting(false);
          resetForm();
          handleClose();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(async (error: ApiError | any) => {
        console.log(error);
        handleApiError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!isOpen) return null;
  return (
    <FormLayout widthPercent={95} padding={3}>
      {isSubmitting && <LoadingPopUpAnimation show={isSubmitting} />}
      <div className={`${isSubmitting ? "cursor-wait" : "cursor-default"}`}>
        <FormHeader
          icon={ListChecks}
          onClose={() => {
            resetForm();
            handleClose();
          }}
          preText="Create General Task"
          description="Create general task."
        />
        <form className="space-y-0">
          <div>
            {/* Form */}
            <form className="space-y-4 mt-2">
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <FormInput
                    label="Subject :"
                    placeholder=" Enter Subject"
                    logo={File}
                    inputMode="text"
                    name="subject"
                    onChange={(e: any) =>
                      handleInputChange("subject", e.target.value)
                    }
                    value={formData.subject}
                    required
                  />
                  {errors.subject && (
                    <span className="mt-1 ml-1 text-red-500 caption-custom-inactive">
                      {errors.subject}
                    </span>
                  )}
                </div>
                {!isLoadingForTaskType ? (
                  <div className="">
                    <CustomDropdown
                      logo={Layers}
                      preselectedOption={formData.taskType}
                      onSelect={(v) => handleDropdownChange("taskType", v)}
                      requiredRedDot
                      labelName="Task Type :"
                      options={taskType!}
                    />
                    {errors.taskType && (
                      <span className="mt-1 ml-1 text-red-500 caption-custom-inactive">
                        {errors.taskType}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 animate-pulse">
                    {/* Label skeleton */}
                    <div className="w-32 h-3 bg-slate-200 rounded"></div>

                    {/* Dropdown skeleton */}
                    <div className="w-full h-8 bg-slate-200 rounded-md"></div>
                  </div>
                )}

                {!isLoadingForaskPriority ? (
                  <div className="">
                    <CustomDropdown
                      logo={Flag}
                      requiredRedDot
                      labelName="Priority :"
                      options={taskPriority!}
                      preselectedOption={formData.taskPriority}
                      onSelect={(v) => handleDropdownChange("taskPriority", v)}
                    />
                    {errors.taskPriority && (
                      <span className="mt-1 ml-1 text-red-500 caption-custom-inactive">
                        {errors.taskPriority}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 animate-pulse">
                    {/* Label skeleton */}
                    <div className="w-32 h-3 bg-slate-200 rounded"></div>

                    {/* Dropdown skeleton */}
                    <div className="w-full h-8 bg-slate-200 rounded-md"></div>
                  </div>
                )}
                {!isLoadingForTaskFrequency ? (
                  <div className="">
                    <CustomDropdown
                      logo={Repeat}
                      preselectedOption={formData.frequency}
                      requiredRedDot
                      labelName="Task Frequency :"
                      options={taskFrequency!}
                      onSelect={(v) => handleDropdownChange("frequency", v)}
                    />
                    {errors.frequency && (
                      <span className="mt-1 ml-1 text-red-500 caption-custom-inactive">
                        {errors.frequency}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 animate-pulse">
                    {/* Label skeleton */}
                    <div className="w-32 h-3 bg-slate-200 rounded"></div>

                    {/* Dropdown skeleton */}
                    <div className="w-full h-8 bg-slate-200 rounded-md"></div>
                  </div>
                )}
                {!isLoadingForTaskFrequencyInterval ? (
                  <div className="">
                    <CustomDropdown
                      logo={Timer}
                      preselectedOption={formData.frequencyInterval}
                      requiredRedDot
                      labelName="Task Frequency Interval :"
                      options={intervalList!}
                      onSelect={(v) =>
                        handleDropdownChange("frequencyInterval", v)
                      }
                    />
                    {errors.frequencyInterval && (
                      <span className="mt-1 ml-1 text-red-500 caption-custom-inactive">
                        {errors.frequencyInterval}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 animate-pulse">
                    {/* Label skeleton */}
                    <div className="w-32 h-3 bg-slate-200 rounded"></div>

                    {/* Dropdown skeleton */}
                    <div className="w-full h-8 bg-slate-200 rounded-md"></div>
                  </div>
                )}
                <div>
                  <label className="block input-label-custom">
                    <div className="flex gap-1 items-center">
                      <CalendarDays size={13} className="text-blue-600" />
                      <span>Start Date :</span>
                      <span className="text-red-500">*</span>
                    </div>
                  </label>

                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    className="w-full pl-3 pr-2 py-1 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  />

                  {errors.startDate && (
                    <span className="mt-1 ml-1 text-red-500 caption-custom-inactive">
                      {errors.startDate}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block input-label-custom">
                    <div className="flex gap-1 items-center">
                      <CalendarCheck size={13} className="text-blue-600" />
                      <span>End Date :</span>
                      <span className="text-red-500">*</span>
                    </div>
                  </label>

                  <input
                    type="date"
                    value={formData.endDate}
                    min={formData.startDate} // 🔥 prevents selecting before start
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    className="w-full pl-3 pr-2 py-1 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  />

                  {errors.endDate && (
                    <span className="mt-1 ml-1 text-red-500 caption-custom-inactive">
                      {errors.endDate}
                    </span>
                  )}
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="taskTime"
                    className="block input-label-custom"
                  >
                    <div className="flex gap-1 items-center">
                      <Clock size={13} className="text-blue-600" />
                      <span>Task Time :</span>
                      <span className="text-red-500">*</span>
                    </div>
                  </label>

                  <select
                    id="taskTime"
                    value={formData.taskTime}
                    onChange={(e) =>
                      handleInputChange("taskTime", e.target.value)
                    }
                    className="w-full pl-3 pr-10 py-1 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select Task Time</option>
                    {timeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {errors.taskTime && (
                    <span className="mt-1 ml-1 text-red-500 caption-custom-inactive">
                      {errors.taskTime}
                    </span>
                  )}
                  <p className="caption-custom ">
                    Note: Time is in 24-hour format (00:00 — 23:59). Please
                    select accordingly.
                  </p>
                </div>
                <div className="">
                  <TextAreaInput
                    label="Description:"
                    logo={FileText}
                    name="description"
                    placeholder="Enter description"
                    value={formData.description}
                    defaultValue={formData.description}
                    onChange={(e: any) =>
                      handleInputChange("description", e.target.value)
                    }
                    required={true}
                    cols={0}
                    rows={3}
                    error={errors.description}
                  />
                </div>
                <div className="">
                  <label className="input-label-custom flex gap-1 items-center">
                    <Paperclip size={13} className="text-blue-500" />
                    Attachment :
                  </label>

                  <div className="border border-dashed rounded-md p-3">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="fileUpload"
                    />

                    <label
                      htmlFor="fileUpload"
                      className="flex gap-2 items-center text-sm cursor-pointer text-blue-600"
                    >
                      <Upload size={16} />
                      Upload File
                    </label>

                    {/* Selected File */}

                    {file && (
                      <div className="flex justify-between mt-2 bg-gray-100 rounded px-2 py-1">
                        <span className="caption-custom">{file.name}</span>

                        <button type="button" onClick={removeFile}>
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1">
                <div className="grid grid-cols-3">
                  <CompanyUserSearchFieldInput
                    label="Assign To:"
                    required
                    // placeholder={loginStatus.fullName}
                    defaultValue={
                      selectedCompanyUser.fullname === ""
                        ? loginStatus.fullName
                        : selectedCompanyUser.fullname
                    }
                    logo={User}
                    onUserSelected={(user) => {
                      if (user && user.id !== 0) {
                        setSelectedCompanyUser(user);
                      }
                      if (user === null || user === undefined) {
                        setSelectedCompanyUser({
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
                      }
                    }}
                    // isDisabled={!userHasAccessToViewUser}
                    disabledMessage={
                      MESSAGE.MODULE_ACCESS.COMPANY_USER.DENIED_VIEW_ACCESS
                    }
                  />
                </div>
                <span className="caption-custom">
                  <span className="">Note :</span> If a task assign to is not
                  selected or is removed, then task will assigned to
                  <span className="table-header-custom active">
                    {" "}
                    creator
                  </span>{" "}
                  by default.
                </span>
              </div>

              <div className="flex justify-end ">
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      resetForm();
                      handleClose();
                    }}
                    type="button"
                  >
                    <div className="flex items-center gap-0.5">
                      <X size={16} />
                      <span>Cancel</span>
                    </div>
                  </Button>
                  <Button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      createMyTask();
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <Save size={16} />
                      <span>Save</span>
                    </div>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </form>
      </div>
    </FormLayout>
  );
}

export default CreateGeneralTaskMasterModal;
