/* eslint-disable react-hooks/exhaustive-deps */
import {
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  Save,
  TargetIcon,
  Text,
  User,
  X,
} from "lucide-react";

import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import SupportTicketTaskStage from "../../../@types/support-ticket-management/SupportTicketTaskStage";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import { useEffect, useMemo, useState } from "react";
import SupportTicketProps from "../../../@types/support-ticket-management/SupportTicketProps";
import FormLayout from "../../ui/FormLayout";
import FormHeader from "../../ui/FormHeader";
import axiosClient from "../../../axios-client/AxiosClient";
import POST_API from "../../../constants/PostApi";
import MESSAGE from "../../../constants/Messages";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import CustomDropdown from "../leads/CustomDropdown";
import Button from "../../ui/Button";
import DatePickerInput from "../../ui/DatePickerInput";
import TextAreaInput from "../../ui/TextAreaInput";
import CompanyUserSearchFieldInput from "../../ui/CompanyUserSearchFieldInput";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { handleApiError } from "../../../config/error/handleApiError";
import { supportTicketDataUrlSearchParamKey } from "../../lists/SupportTicketManagementList";

function CreateSupportTicketTaskModal({
  isOpen,
  handleClose,
  supportTicketTaskStage,
  handleSupportTicketTaskCreate,
}: {
  isOpen: boolean;
  handleClose: () => void;
  supportTicketTaskStage: SupportTicketTaskStage[];
  handleSupportTicketTaskCreate: () => void;
}) {
  const { loginStatus } = useLoggedInUserContext();
  const [searchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const { userHasAccessToAddSupportTicketTask } =
    useUserAccessModules();

  const [description, setDescription] = useState<string>("");

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

  const timeOptions = useMemo(() => generateTimeOptions(), []);

  const [dueDate, setDueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<string>(timeOptions[0]);
  const [supportTicketTaskStageId, setSupportTicketTaskStageId] =
    useState<number>(0);
  const [resultOutcome, setResultOutcome] = useState<string>("");
  const [supportTicketData, setSupportTicketData] =
    useState<SupportTicketProps>();

  const [assignedTo, setAssignedTo] = useState<CompanyUser>({
    id: supportTicketData?.assignedTo || 0,
    company_id: 0,
    fullname: supportTicketData?.assignedToName || "",
    email: "",
    mobilenumber: "",
    isactive: false,
    requestedby: "",
    createdby: "",
    generate_password: "",
  });

  const resetStates = () => {
    setDescription("");
    setErrors({
      supportTicketTaskStageError: "",
      dueDateError: "",
      descriptionError: "",
    });
    setDueDate("");
    setDueTime(timeOptions[0]);
    setSupportTicketTaskStageId(0);
    setAssignedTo({
      id: 0,
      company_id: 0,
      fullname: "",
      email: "",
      mobilenumber: "",
      isactive: false,
      requestedby: "",
      createdby: "",
      generate_password: "",
    });
  };

  const [errors, setErrors] = useState({
    supportTicketTaskStageError: "",
    dueDateError: "",
    descriptionError: "",
  });

  function handleFormChange(): boolean {
    let flagVariable = false;

    if (supportTicketTaskStageId === 0) {
      setErrors((prev) => ({
        ...prev,
        supportTicketTaskStageError: "Please select Ticket Task Stage",
      }));
      toast.error("Please Select Ticket Task Stage");
      flagVariable = true;
    } else {
      setErrors((prev) => ({
        ...prev,
        supportTicketTaskStageError: "",
      }));
    }

    if (description === "") {
      setErrors((prev) => ({
        ...prev,
        descriptionError: "Please enter Description",
      }));
      toast.error("Please enter Description");
      flagVariable = true;
    } else {
      setErrors((prev) => ({
        ...prev,
        descriptionError: "",
      }));
    }

    if (dueDate === "") {
      setErrors((prev) => ({
        ...prev,
        dueDateError: "Please select Due Date ",
      }));
      toast.error("Please select Due Date for Task");
      flagVariable = true;
    } else {
      setErrors((prev) => ({
        ...prev,
        dueDateError: "",
      }));
    }
    return flagVariable;
  }

  const createSupportTicketTask = async (event: React.FormEvent<HTMLFormElement>) => {
    // console.log(assignedTo);
    if (isSaving) return;
    if (handleFormChange()) return;

    event.preventDefault();
    const createSupportTicketTaskPostData = {
      company_id: loginStatus.companyId,
      support_ticket_id: supportTicketData!.id,
      support_ticket_task_stage_id: supportTicketTaskStageId,
      description: description,
      result_outcome: resultOutcome,
      assignedto:
        assignedTo.id === 0 ? supportTicketData?.assignedTo : assignedTo.id,
      due_date_time: `${dueDate} ${dueTime || "00:00"}:00`,
      createdby_id: loginStatus.id,
    };
    setIsSaving(true);
    await axiosClient
      .post(
        POST_API.CREATE_SUPPORT_TICKET_TASK,
        createSupportTicketTaskPostData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          handleSupportTicketTaskCreate();
          handleClose();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(async (error) => {
        handleApiError(error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  useEffect(() => {
    if (timeOptions) setDueTime(timeOptions[0]);
  }, [timeOptions]);

  useEffect(() => {
    if (isOpen) {
      const supportTicketData = JSON.parse(
        searchParams.get(supportTicketDataUrlSearchParamKey) || "{}"
      );
      setSupportTicketData(supportTicketData);

      setAssignedTo({
        id: supportTicketData?.assignedTo || 0,
        company_id: 0,
        fullname: supportTicketData?.assignedToName || "",
        email: "",
        mobilenumber: "",
        isactive: false,
        requestedby: "",
        createdby: "",
        generate_password: "",
      });
    }
    if (!isOpen) {
      resetStates();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <FormLayout width={6}>
      {/* Header */}
      <FormHeader
        icon={ClipboardList}
        onClose={handleClose}
        preText="Create task for timely action"
        description="Plan and create a task to schedule follow-ups and ensure timely action."
      />
      {isSaving && <LoadingPopUpAnimation show={isSaving} />}

      {/* Form Grid */}
      <form
      onSubmit={createSupportTicketTask}
        className={`space-y-2 mt-2 ${
          isSaving ? "cursor-wait" : "cursor-default"
        }`}
      >
        <div className="grid grid-cols-2 gap-3">
          {/* Stage */}
          <div>
            <CustomDropdown
              requiredRedDot
              logo={Text}
              labelName="Stage:"
              preselectedOption={1}
              onSelect={(e) => {
                if (e) {
                  setSupportTicketTaskStageId(e);
                } else {
                  setSupportTicketTaskStageId(0);
                }
              }}
              options={supportTicketTaskStage}
            ></CustomDropdown>
            {errors.supportTicketTaskStageError !== "" && (
              <div className="caption-custom-inactive">
                {errors.supportTicketTaskStageError}
              </div>
            )}
          </div>

          {/* End date */}
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1">
              <DatePickerInput
                label="End Date:"
                onChange={(e) => {
                  setDueDate(e.target.value);
                }}
                logo={Calendar}
                required={true}
                error={errors.dueDateError}
              />
            </div>

            <div className=" col-span-1">
              <label htmlFor="endTime" className="block input-label-custom">
                <div className="flex gap-1 items-center">
                  <Clock size={13} className="text-blue-600  justify-center " />
                  <span>End Time:</span>
                </div>
              </label>
              <select
                id="endTime"
                defaultValue={dueTime}
                className=" w-full pl-3 pr-10 py-1 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={(e) => {
                  setDueTime(e.target.value);
                }}
                required={true}
                 onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // prevents dropdown open
                    e.stopPropagation();

                    // submit form manually
                    const form = (e.target as HTMLElement).closest("form");
                    form?.requestSubmit();
                  }
                }}
              >
                <option value="">Select End Time</option>
                {timeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Description */}
          <div>
            <TextAreaInput
            autoFocus={true}
              name="description"
              logo={FileText}
              cols={5}
              rows={3}
              label="Description:"
              placeholder="Enter the description"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              required={true}
              maxLength={500}
              error={errors.descriptionError}
            ></TextAreaInput>
          </div>

          {/* Outcome */}
          <TextAreaInput
            name="outcome"
            logo={TargetIcon}
            cols={5}
            rows={3}
            label="Outcome: "
            placeholder="Enter the outcome"
            onChange={(e) => {
              setResultOutcome(e.target.value);
            }}
            maxLength={500}
          ></TextAreaInput>
        </div>
        <div className="grid grid-cols-1 items-center  gap-2  mb-0">
          <div>
            <div className="grid grid-cols-2">
              <CompanyUserSearchFieldInput
                logo={User}
                label="Assign To:"
                defaultValue={supportTicketData?.assignedToName}
                onUserSelected={(user) => {
                  if (user && user?.id) {
                    //
                    setAssignedTo(user);
                  }
                  if (user === null || user === undefined) {
                    setAssignedTo({
                      id: supportTicketData?.assignedTo || 0,
                      company_id: 0,
                      fullname: supportTicketData?.assignedToName || "",
                      email: "",
                      mobilenumber: "",
                      isactive: false,
                      requestedby: "",
                      createdby: "",
                      generate_password: "",
                    });
                  }
                  console.log("selected user:");
                  console.log(user);
                }}
                // isDisabled={!userHasAccessToViewUser}
                disabledMessage={
                  MESSAGE.MODULE_ACCESS.COMPANY_USER.DENIED_VIEW_ACCESS
                }
              />
            </div>
            <span className="caption-custom">
              <span className="">Note :</span> If the task "Assign To" is not
              selected or is removed, the task will be assigned to the
              <span className="table-header-custom active">
                {" "}
                ticket creator
              </span>{" "}
              by default.
            </span>
          </div>
        </div>
        {/* Footer Buttons */}
      <div className="flex w-full justify-center gap-4 mt-6">
        <div className=" flex w-full justify-end ">
          <div className="flex items-center gap-1 ">
            {/* Cancel */}
            <Button onClick={handleClose} type="button">
              <div className="flex items-center gap-1">
                <X size={16} />
                Cancel
              </div>
            </Button>
            {/* Save */}
            <Button
              type="submit"
              disabled={isSaving || !userHasAccessToAddSupportTicketTask}
              // onClick={(event: React.FormEvent<HTMLButtonElement>) => {
              //   if (isSaving) return;
              //   createSupportTicketTask(event);
              // }}
            >
              <div className="flex items-center gap-1">
                <Save size={16} />
                {isSaving ? "Saving..." : "Save"}
              </div>
            </Button>
          </div>
        </div>
      </div>
      </form>

      
    </FormLayout>
  );
}

export default CreateSupportTicketTaskModal;
