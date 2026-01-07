/* eslint-disable react-hooks/exhaustive-deps */
import {
  Calendar,
  Clock,
  Edit,
  FileText,
  Save,
  TargetIcon,
  Text,
  User2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { format, parse } from "date-fns";
import toast from "react-hot-toast";
import SupportTicketTaskProps from "../../../@types/support-ticket-management/SupportTicketTaskProps";
import SupportTicketTaskStage from "../../../@types/support-ticket-management/SupportTicketTaskStage";
import { useLoggedInUserContext } from "../../../context/user/LoggedInUserContext";
import POST_API from "../../../constants/PostApi";
import { STATUS_CODE } from "../../../constants/AppConstants";
import axiosClient from "../../../axios-client/AxiosClient";
import MESSAGE from "../../../constants/Messages";
import FormLayout from "../../ui/FormLayout";
import FormHeader from "../../ui/FormHeader";
import LoadingPopUpAnimation from "../../views/card/LoadingPopUpAnimation";
import ToggleButton from "../../ui/ToggleButton";
import CustomDropdown from "../leads/CustomDropdown";
import DatePickerInput from "../../ui/DatePickerInput";
import TextAreaInput from "../../ui/TextAreaInput";
import CompanyUserSearchFieldInput from "../../ui/CompanyUserSearchFieldInput";
import Button from "../../ui/Button";
import CompanyUser from "../../../@types/company-users/CompanyUser";
import { useUserAccessModules } from "../../../config/hooks/useAccessModules";
import { handleApiError } from "../../../config/error/handleApiError";

function UpdateSupportTicketTaskModal({
  isOpen,
  handleClose,
  supportTicketTask,
  supportTicketTaskStage,
  handleSupportTicketTaskUpdate,
}: {
  isOpen: boolean;
  handleClose: (value: boolean) => void;
  supportTicketTask: SupportTicketTaskProps;
  supportTicketTaskStage: SupportTicketTaskStage[];
  handleSupportTicketTaskUpdate: () => void;
}) {
  const { userHasAccessToUpdateSupportTicketTask } = useUserAccessModules();
  const { loginStatus } = useLoggedInUserContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

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

  const parsedDate = parse(
    supportTicketTask.dueDateTime,
    "MMM dd, yyyy HH:mm:ss",
    new Date()
  );
  const dueDateValue = format(parsedDate, "yyyy-MM-dd");
  const dueTimeValue = format(parsedDate, "HH:mm");

  const [description, setDescription] = useState<string>(
    supportTicketTask.description || ""
  );
  const [dueDate, setDueDate] = useState<string>(dueDateValue);
  const [dueTime, setDueTime] = useState<string>(dueTimeValue);

  const [supportTicketTaskStageId, setSupportTicketTaskStageId] =
    useState<number>(supportTicketTask.supportTicketTaskStageId);
  const [assignedTo, setAssignedTo] = useState<CompanyUser | null>({
    id: supportTicketTask.assignedTo,
    fullname: supportTicketTask.assignToName,
    email: "",
    mobilenumber: "",
    company_id: 0,
    createdby: "",
    generate_password: "",
    isactive: true,
    requestedby: "",
  });

  const [resultOutcome, setResultOutcome] = useState<string>(
    supportTicketTask.resultOutcome || ""
  );

  const [isActive, setIsActive] = useState<boolean>(supportTicketTask.isActive);

  useEffect(() => {
    if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
      setDueDate(format(parsedDate, "yyyy-MM-dd"));
      setDueTime(format(parsedDate, "HH:mm"));
    }
  }, []);

  const resetStates = () => {
    setDescription("");
    setDueDate("");
    setDueTime(timeOptions[0]);
    setSupportTicketTaskStageId(0);
    setAssignedTo({
      id: supportTicketTask.assignedTo,
      fullname: supportTicketTask.assignToName,
      email: "",
      mobilenumber: "",
      company_id: 0,
      createdby: "",
      generate_password: "",
      isactive: true,
      requestedby: "",
    });
  };

  const updateSupportTicketTask = async (
    event: React.FormEvent<HTMLButtonElement>
  ) => {
    if (!userHasAccessToUpdateSupportTicketTask) {
      toast.error(
        MESSAGE.MODULE_ACCESS.SUPPORT_MODULE.UPDATE_ACCESS_DENIED_MESSAGE
      );
      return;
    }
    if (isSaving) return;
    event.preventDefault();
    const updateSupportTicketTaskPostData = {
      company_id: loginStatus.companyId,
      id: supportTicketTask.id,
      support_ticket_task_stage_id: supportTicketTaskStageId,
      description: description,
      result_outcome: resultOutcome,
      assignedto: assignedTo?.id || 0,
      due_date_time: `${dueDate} ${dueTime || "00:00"}:00`,
      isactive: isActive,
      updatedby_id: loginStatus.id,
    };

    setIsSaving(true);
    await axiosClient
      .post(
        POST_API.UPDATE_SUPPORT_TICKET_TASK,
        updateSupportTicketTaskPostData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            toast.success(response.data.message);
            setTimeout(() => {
              handleClose(false);
            }, 100);
            handleSupportTicketTaskUpdate();
          } else {
            toast.error(response.data.message);
          }
        }
      })
      .catch(async (error) => {
        handleApiError(error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleIsActiveCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!userHasAccessToUpdateSupportTicketTask) {
      toast.error(
        MESSAGE.MODULE_ACCESS.SUPPORT_MODULE.UPDATE_ACCESS_DENIED_MESSAGE
      );
      return;
    }
    const { checked } = event.target;

    const updateSupportTicketTaskPostData = {
      company_id: loginStatus.companyId,
      id: supportTicketTask.id,
      support_ticket_task_stage_id: supportTicketTaskStageId,
      isactive: checked,
      updatedby_id: loginStatus.id,
    };

    axiosClient
      .post(
        POST_API.UPDATE_SUPPORT_TICKET_TASK,
        updateSupportTicketTaskPostData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            toast.success(response.data.message);
            setIsActive(checked);
            handleSupportTicketTaskUpdate();
          } else {
            toast.error(response.data.message);
          }
        }
      })
      .catch(async (error) => {
        handleApiError(error);
      });
  };

  useEffect(() => {
    if (!isOpen) {
      resetStates();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <FormLayout width={6}>
      {/* Form header */}
      <FormHeader
        icon={Edit}
        onClose={() => {
          handleClose(false);
        }}
        preText="Update task"
        description="Modify task details to keep information accurate and up to date."
      />
      {isSaving && <LoadingPopUpAnimation show={isSaving} />}
      {/* Form Grid */}
      <form
        className={`space-y-1 ${isSaving ? "cursor-wait" : "cursor-default"}`}
      >
        <div className="grid grid-cols-2 gap-2 mt-2">
          {/* Stage */}
          <CustomDropdown
            requiredRedDot
            logo={Text}
            labelName="Stage: "
            onSelect={(e) => {
              if (e) {
                setSupportTicketTaskStageId(e);
              } else {
                setSupportTicketTaskStageId(0);
              }
            }}
            options={supportTicketTaskStage}
            selectedValue={supportTicketTask.supportTicketTaskStageId}
            readOnly={!userHasAccessToUpdateSupportTicketTask}
          ></CustomDropdown>

          <div className="grid grid-cols-2 gap-2">
            {/* end date */}
            <div className="">
              <DatePickerInput
                label="End Date: "
                defaultValue={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                }}
                logo={Calendar}
                required={true}
                readonly={!userHasAccessToUpdateSupportTicketTask}
              />
            </div>

            {/* edn time */}
            <div>
              <label htmlFor="endTime" className="block  text-gray-900">
                <div className="flex gap-1 input-lable-custom items-center text-center">
                  <Clock size={14} className="text-blue-600  justify-center " />
                  <span className="input-label-custom">End Time: </span>
                </div>
              </label>
              <select
                id="endTime"
                className=" w-full pl-1 py-1 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={(e) => {
                  setDueTime(e.target.value);
                }}
                defaultValue={dueTime}
              >
                <option value="">Select End Time: </option>
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
          {/* description */}
          <TextAreaInput
            logo={FileText}
            cols={5}
            rows={2}
            label="Description: "
            defaultValue={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            maxLength={500}
            required={true}
            readonly={!userHasAccessToUpdateSupportTicketTask}
            disabled={!userHasAccessToUpdateSupportTicketTask}
          ></TextAreaInput>

          {/* outcome */}
          <TextAreaInput
            logo={TargetIcon}
            cols={5}
            rows={2}
            label="Outcome: "
            defaultValue={resultOutcome}
            onChange={(e) => {
              setResultOutcome(e.target.value);
            }}
            maxLength={500}
            readonly={!userHasAccessToUpdateSupportTicketTask}
            disabled={!userHasAccessToUpdateSupportTicketTask}
          ></TextAreaInput>
        </div>

        <div className="">
          <div className="grid grid-cols-2">
            <CompanyUserSearchFieldInput
              logo={User2}
              label={"Assign To"}
              defaultValue={assignedTo?.fullname || ""}
              onUserSelected={(user) => {
                if (user && user?.id) {
                  setAssignedTo(user);
                }
                if (user === null) {
                  setAssignedTo({
                    id: supportTicketTask.assignedTo,
                    fullname: supportTicketTask.assignToName,
                    email: "",
                    mobilenumber: "",
                    company_id: 0,
                    createdby: "",
                    generate_password: "",
                    isactive: true,
                    requestedby: "",
                  });
                }
              }}
              // isDisabled={!userHasAccessToUpdateSupportTicket}
              readOnly={!userHasAccessToUpdateSupportTicketTask}
            />
          </div>
          <span className="caption-custom">
            <span className="">Note :</span> If the task assignee is not
            selected or is removed, the task will be assigned to the
            <span className="table-header-custom active">
              {" "}
              previous assignee
            </span>{" "}
            by default.
          </span>
        </div>

        <div className="flex items-center col-span-2 justify-end gap-3 border-blue-00">
          <ToggleButton
            name="isActive"
            checked={isActive}
            onToggle={handleIsActiveCheckboxChange}
            wantLabel={true}
          />
        </div>
      </form>

      {/* Footer Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <div className=" flex w-full justify-end ">
          <div className="flex items-center gap-1 ">
            {/* Cancel */}
            <Button
              onClick={() => {
                handleClose(false);
              }}
              type="button"
            >
              <div className="flex items-center gap-1">
                <X size={16} />
                Cancel
              </div>
            </Button>
            {/* Save */}
            <Button
              type="submit"
              disabled={isSaving}
              onClick={(event: React.FormEvent<HTMLButtonElement>) => {
                if (!userHasAccessToUpdateSupportTicketTask) {
                  toast.error(
                    MESSAGE.MODULE_ACCESS.SUPPORT_MODULE
                      .UPDATE_ACCESS_DENIED_MESSAGE
                  );
                  return;
                }
                if (isSaving) return;
                updateSupportTicketTask(event);
              }}
            >
              <div className="flex items-center gap-1">
                <Save size={16} />
                Save
              </div>
            </Button>
          </div>
        </div>
      </div>
    </FormLayout>
  );
}

export default UpdateSupportTicketTaskModal;
