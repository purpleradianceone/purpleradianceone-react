/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  Clock,
  Contact2,
  Edit,
  FileText,
  FileTextIcon,
  Save,
  TargetIcon,
  Text,
  User,
  Users,
  X,
} from "lucide-react";
import Button from "../../../ui/Button";
import CustomDropdown from "../CustomDropdown";
import FormInput from "../../../ui/FormInput";
import DatePickerInput from "../../../ui/DatePickerInput";
import TextAreaInput from "../../../ui/TextAreaInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";
import LeadActivityType from "../../../../@types/lead-management/LeadActivityType";
import LeadTaskPriorityType from "../../../../@types/lead-management/LeadTaskPriorityType";
import LeadTaskStageType from "../../../../@types/lead-management/LeadTaskStageType";
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import Lead from "../../../../@types/lead-management/LeadManagementProps";
import {  STATUS_CODE } from "../../../../constants/AppConstants";
import CompanyUsersSearchProps from "../../../../@types/company-users/CompanyUserProps";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import RefreshToken from "../../../../config/validations/RefreshToken";
import CompanyLeadContactsSelectionAgGrid from "../../../ag-grid/CompanyLeadContactsSelectionAgGrid";
import LeadContactType from "../../../../@types/lead-management/LeadContact";
import LeadTaskType from "../../../../@types/lead-management/LeadTaskType";
import { format, parse } from "date-fns";
import LeadAssociatedUsersModal from "./LeadAssociatedUsersModal";
import toast from "react-hot-toast";
import FormHeader from "../../../ui/FormHeader";
import ToggleButton from "../../../ui/ToggleButton";
import MESSAGE from "../../../../constants/Messages";
import LoadingPopUpAnimation from "../../../views/card/LoadingPopUpAnimation";
import FormLayout from "../../../ui/FormLayout";

function UpdateLeadTaskModal({
  isOpen,
  handleClose,
  leadTask,
  leadTaskStage,
  leadTaskPriority,
  leadActivity,
  handleLeadTaskUpdate,
}: {
  isOpen: boolean;
  handleClose: (value: boolean) => void;
  leadTask: LeadTaskType;
  leadTaskStage: LeadTaskStageType[];
  leadTaskPriority: LeadTaskPriorityType[];
  leadActivity: LeadActivityType[];
  handleLeadTaskUpdate: () => void;
}) {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();
  const [searchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const parsedDate = parse(
    leadTask.dueDateTime,
    "MMM dd, yyyy HH:mm:ss",
    new Date()
  );
  const dueDateValue = format(parsedDate, "yyyy-MM-dd");
  const dueTimeValue = format(parsedDate, "HH:mm");

  const [subject, setSubject] = useState<string>(leadTask.subject);
  const [description, setDescription] = useState<string>(leadTask.description);
  const [dueDate, setDueDate] = useState<string>(dueDateValue);
  const [dueTime, setDueTime] = useState<string>(dueTimeValue);
  const [leadActivityId, setLeadActivityId] = useState<number>(
    leadTask.leadActivityId
  );
  const [leadTaskPriorityId, setLeadTaskPriorityId] = useState<number>(
    leadTask.leadTaskPriorityId
  );
  const [leadTaskStageId, setLeadTaskStageId] = useState<number>(
    leadTask.leadTaskStageId
  );
  const [leadData, setLeadData] = useState<Lead>();
  const [assignedTo, setAssignedTo] = useState<number[]>(
    leadTask.assignedToId!
  );
  const [physicalMeetingAddress, setPhysicalMeetingAddress] =
    useState<string>("");
  const [resultOutcome, setResultOutcome] = useState<string>(
    leadTask.resultOutcome
  );

  const [isAssignUsersModalOpen, setIsAssignUsersModalOpen] =
    useState<boolean>(false);
  const [
    isAddCompanyLeadContactModalOpen,
    setIsAddCompanyLeadContactModalOpen,
  ] = useState<boolean>(false);
  const [addCompanyLeadContactIdArray, setAddCompanyLeadContactIdArray] =
    useState<number[]>([]);
  const [leadContactDataSelectedArray, setLeadContactDataSelectedArray] =
    useState<LeadContactType[]>([]);
  const [selectedCompanyUsers, setSelectedCompanyUsers] = useState<
    CompanyUsersSearchProps[]
  >([]);
  const [isActive, setIsActive] = useState<boolean>(leadTask.isActive);

  useEffect(() => {
    const leadDetailsJsonData = JSON.parse(leadTask.leadActivityDetails);
    if (leadDetailsJsonData) {
      if (leadDetailsJsonData.leadContact) {
        const leadContacts = leadDetailsJsonData.leadContact;

        if (leadContacts.length !== 0) {
          setLeadContactDataSelectedArray(leadContacts);
          leadContacts.map((data: LeadContactType) => {
            setAddCompanyLeadContactIdArray((prev) => [...prev, data.id]);
          });
        } else {
          setLeadContactDataSelectedArray([]);
          setAddCompanyLeadContactIdArray([]);
        }
      } else if (leadDetailsJsonData.address) {
        const leadAddress = leadDetailsJsonData.address;
        setPhysicalMeetingAddress(leadAddress);
      }
    }

    if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
      setDueDate(format(parsedDate, "yyyy-MM-dd"));
      setDueTime(format(parsedDate, "HH:mm"));
    }
  }, []);

  const resetStates = () => {
    setSubject("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setLeadActivityId(0);
    setLeadTaskPriorityId(0);
    setLeadTaskStageId(0);
    setAssignedTo([loginStatus.id]);
    setIsAssignUsersModalOpen(false);
  };

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

  const handleAddCompanyUserCheckboxChange = (
    params: CompanyUsersSearchProps,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    if (checked) {
      setAssignedTo([...assignedTo, params.id]);
      setSelectedCompanyUsers((prev) => [...prev, params]);
    } else if (!checked) {
      setAssignedTo(assignedTo.filter((id) => id !== params.id));
      setSelectedCompanyUsers((prev) =>
        prev.filter((user) => user.id !== params.id)
      );
    }
  };

  const handleCompanyLeadContactCheckBoxChange = (
    data: LeadContactType,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    if (checked) {
      setAddCompanyLeadContactIdArray((prev) => [...prev, data.id]);
      setLeadContactDataSelectedArray((prev) => [...prev, data]);
    } else if (!checked) {
      setAddCompanyLeadContactIdArray((prev) =>
        prev.filter((id) => id !== data.id)
      );
      setLeadContactDataSelectedArray((prev) =>
        prev.filter((leadData) => leadData.id !== data.id)
      );
    }
  };

  const generateTaskDetailsJson = () => {
    if (leadActivityId !== 3 && leadActivityId !== 4) {
      const taskDetailsWithContact = {
        leadContact: leadContactDataSelectedArray,
      };

      return JSON.stringify(taskDetailsWithContact);
    } else if (leadActivityId === 3) {
      const taskDetailsWithoutContact = {
        address: physicalMeetingAddress,
      };
      return JSON.stringify(taskDetailsWithoutContact);
    }
  };

  useEffect(() => {
    console.log("intial values of json");
    console.log(leadTask.leadActivityDetails);
  }, []);

  const UpdateLeadTask = async (event: React.FormEvent<HTMLButtonElement>) => {
    if (isSaving) return;

    event.preventDefault();
    const jsonData = generateTaskDetailsJson();
    // console.log(jsonData);

    const originalLeadActivityDetailsString = leadTask.leadActivityDetails;

    // // If leadTask.leadActivityDetails is an object (after parsing in useEffect):
    // // This is safer if you've already parsed it and use the parsed object
    const originalLeadDetailsObject = JSON.parse(
      originalLeadActivityDetailsString
    );
    const stringifiedOriginalData = JSON.stringify(originalLeadDetailsObject);
    // console.log("second stringfy")
    // console.log(stringifiedOriginalData);

    if (leadActivityId === 0) {
      toast.error("Please Select Lead Task Activity");
      return;
    } else if (leadTaskPriorityId === 0) {
      toast.error("Please Select Lead Task Priority");
      return;
    } else if (leadTaskStageId === 0) {
      toast.error("Please Select Lead Task Priority");
      return;
    } else if (subject === "") {
      toast.error("Please provide Subject To Task");
      return;
    } else if (dueDate === "") {
      toast.error("Please select Due Date for Task");
      return;
    } else if (dueTime === "") {
      toast.error("Please select Due Time for Task");
      return;
    } else if (
      subject === leadTask.subject &&
      description === leadTask.description &&
      leadTaskStageId === leadTask.leadTaskStageId &&
      leadTaskPriorityId === leadTask.leadTaskPriorityId &&
      dueDate === dueDateValue &&
      dueTime === dueTimeValue &&
      resultOutcome === leadTask.resultOutcome &&
      assignedTo === leadTask.assignedToId &&
      jsonData === stringifiedOriginalData
    ) {
      toast.error("Not made changes to task");
      return;
    } else if (assignedTo.length === 0) {
      toast.error("You haven't assigned a task yet, please assign it first");
      return;
    }

    const updateLeadTaskPostData = {
      company_id: loginStatus.companyId,
      id: leadTask.id,
      lead_task_priority_id: leadTaskPriorityId,
      lead_task_stage_id: leadTaskStageId,
      subject: subject,
      description: description,
      result_outcome: resultOutcome,
      assignedto: assignedTo,
      due_date_time: `${dueDate} ${dueTime}:00`,
      lead_activity_details:
        leadActivityId !== 4 ? jsonData : leadTask.leadActivityDetails,
      isactive: isActive,
      updatedby_id: loginStatus.id,
    };

    setIsSaving(true);
    await axios
      .post(POST_API.UPDATE_LEAD_TASK, updateLeadTaskPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            toast.success(response.data.message);
            setTimeout(() => {
              handleClose(false);
            }, 100);
            handleLeadTaskUpdate();
          } else {
            toast.error(response.data.message);
          }
        }
      })
      .catch(async (error) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: UpdateLeadTask,
          });
          if (refreshTokenResponse) {
            UpdateLeadTask(event);
          }
        } else {
          toast.error(MESSAGE.ERROR.SOMETHING_WENT_WRONG_TRY_AGAIN);
        }
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const getComapnyUsers = async () => {
    setSelectedCompanyUsers([]);
    for (let i = 0; i < leadTask.assignedToId!.length; i++) {
      const getCompanyUserPostData = {
        company_id: loginStatus.companyId,
        id: leadTask.assignedToId![i],
        search_company_specific_date_range_id: 0,
        requestedby: loginStatus.id,
      };

      await axios
        .post(POST_API.GET_COMPANY_USERS, getCompanyUserPostData, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            response.data.map((res: any) => {
              setSelectedCompanyUsers((prev) => [...prev, res]);
            });
          }
        })
        .catch(async (error) => {
          if (error.ststus === STATUS_CODE.UNATHORISED) {
            const refreshTokenResponse = await RefreshToken({
              callFunction: getComapnyUsers,
            });
            if (refreshTokenResponse) {
              getComapnyUsers();
            }
          }
        });
    }
  };
  const timeOptions = generateTimeOptions();

  const handleIsActiveCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;

    const jsonData = generateTaskDetailsJson();

    const updateLeadTaskPostData = {
      company_id: loginStatus.companyId,
      id: leadTask.id,
      lead_task_priority_id: leadTaskPriorityId,
      lead_task_stage_id: leadTaskStageId,
      subject: subject,
      description: description,
      result_outcome: resultOutcome,
      assignedto: assignedTo,
      due_date_time: `${dueDate} ${dueTime}:00`,
      lead_activity_details: jsonData,
      isactive: checked,
      updatedby_id: loginStatus.id,
    };

    axios
      .post(POST_API.UPDATE_LEAD_TASK, updateLeadTaskPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            toast.success(response.data.message);
            setIsActive(checked);
            handleLeadTaskUpdate();
          } else {
            toast.error(response.data.message);
          }
        }
      })
      .catch(async (error) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: handleIsActiveCheckboxChange,
          });
          if (refreshTokenResponse) {
            handleIsActiveCheckboxChange(event);
          }
        }
      });
  };

  useEffect(() => {
    if (isOpen) {
      const leadSearchParam = JSON.parse(searchParams.get("leadData") || "{}");
      setLeadData(leadSearchParam);
      getComapnyUsers();
    }
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
      <form className="space-y-1">
        <div className="grid grid-cols-3 gap-x-2">
          <div className="flex items-center col-span-3 justify-end gap-3 py-1  border-blue-00">
            <ToggleButton
              name="isActive"
              checked={isActive}
              onToggle={handleIsActiveCheckboxChange}
              wantLabel={true}
            />
          </div>
          {/* type */}
          <CustomDropdown
            requiredRedDot
            logo={Text}
            readOnly={true}
            labelName="Type: "
            onSelect={(e) => {
              if (e !== 4) {
                if (e) {
                  setLeadActivityId(e);
                } else {
                  setLeadActivityId(0);
                }
              } else {
                sessionStorage.setItem("leadData", JSON.stringify(leadData));
                navigate(ROUTES_URL.SCHEDULE_MEETING);
              }
            }}
            selectedValue={leadTask.leadActivityId}
            options={leadActivity}
          ></CustomDropdown>

          {/* Priority */}
          <CustomDropdown
            requiredRedDot
            logo={Text}
            labelName="Priority: "
            onSelect={(e) => {
              if (e) {
                setLeadTaskPriorityId(e);
              } else {
                setLeadTaskPriorityId(0);
              }
            }}
            options={leadTaskPriority}
            selectedValue={leadTask.leadTaskPriorityId}
          ></CustomDropdown>

          {/* Stage */}
          <CustomDropdown
            requiredRedDot
            logo={Text}
            labelName="Stage: "
            onSelect={(e) => {
              if (e) {
                setLeadTaskStageId(e);
              } else {
                setLeadTaskStageId(0);
              }
            }}
            options={leadTaskStage}
            selectedValue={leadTask.leadTaskStageId}
          ></CustomDropdown>
          {leadActivityId !== 3 && leadActivityId !== 8 && (
            // Select lead contact
            <div className="flex items-center  justify-start gap-2   mb-0">
              <label
                // htmlFor="phoneCallBtn"
                className="block input-label-custom"
              >
                <div className="flex gap-2">
                  <Contact2 className="text-blue-600 mt-0.5" size={16} />
                  <span>Lead Contact:</span>
                </div>
              </label>
              <div 
              // id="phoneCallBtn" 
              className="mb-1   ">
                <Button
                  className="bg-white text-blue-800 "
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddCompanyLeadContactModalOpen(true);
                  }}
                >
                  <span className="text-xs text-blue-500  text-nowrap underline ">
                    Select/Change
                    {/* <Contact size={14}></Contact> */}
                    {/* <span>lead contact</span> */}
                  </span>
                </Button>
              </div>
            </div>
          )}
          {leadActivityId === 3 && (
            <div className="col-span-3">
              <FormInput
                // value={physicalMeetingAddress}
                defaultValue={physicalMeetingAddress}
                label="Address"
                onChange={(e) => {
                  setPhysicalMeetingAddress(e.target.value);
                }}
              ></FormInput>
            </div>
          )}
        </div>
        {leadContactDataSelectedArray.length != 0 && (
          <div className="border  rounded-md">
          <div className="grid grid-cols-3 p-1 table-header-custom">
            Selected Contacts :
          </div>
          <div className=" grid grid-cols-3 p-2  max-h-36 gap-0.5 overflow-y-auto">
            {leadContactDataSelectedArray.map((contact) => (
              <div
              key={contact.id}
              className="grid col-span-1 py-0.5 border border-r-2 px-0.5 hover:bg-gray-100 rounded-lg"
              >
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-3 w-3 caption-custom rounded-full bg-white" />
                    <span className="caption-custom">
                      {contact.name || contact.email || "Unnamed contact"}
                    </span>
                  </span>
                  <Button
                    size="sm"
                    onClick={() => {
                      setAddCompanyLeadContactIdArray((prev) =>
                        prev.filter((id) => id !== contact.id)
                    );
                    setLeadContactDataSelectedArray((prev) =>
                      prev.filter((item) => item.id !== contact.id)
                  );
                }}
                className="caption-custom hover:text-red-500"
                >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
                    </div>
        )}
        {/* {leadContactDataSelectedArray.length != 0 && (
          <div className="grid grid-cols-3 input-label-custom">
            Selected Contacts: 
          </div>
        )}
        {leadContactDataSelectedArray.length != 0 && (
          <div className="mt-0.5 grid grid-cols-3 max-h-36 gap-0.5 overflow-y-auto">
            {leadContactDataSelectedArray.map((contact) => (
              <div
                key={contact.id}
                className="grid col-span-1 py-0.5 border border-r-2 px-0.5 hover:bg-gray-100 rounded-lg"
              >
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-gray-600 rounded-full bg-white" />
                    <span className="caption-custom">
                      {contact.name || contact.email || contact.mobileNumber}
                    </span>
                  </span>
                  <Button
                    size="sm"
                    onClick={() => {
                      setAddCompanyLeadContactIdArray((prev) =>
                        prev.filter((id) => id !== contact.id)
                      );
                      setLeadContactDataSelectedArray((prev) =>
                        prev.filter((item) => item.id !== contact.id)
                      );
                    }}
                    className="caption-custom hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )} */}

        <div className="grid grid-cols-2  gap-x-2">
          {/* Subject */}

          <FormInput
            label="Subject: "
            required
            logo={FileTextIcon}
            type="text"
            value={subject}
            defaultValue={leadTask.subject}
            className="test-base"
            onChange={(e) => {
              setSubject(e.target.value);
            }}
          ></FormInput>

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
                <option value="">Select End Time</option>
                {timeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* description */}
          <TextAreaInput
            logo={FileText}
            cols={5}
            rows={3}
            label="Description: "
            defaultValue={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            maxLength={500}
          ></TextAreaInput>
          {/* outcome */}
          <TextAreaInput
            logo={TargetIcon}
            cols={5}
            rows={3}
            label="Outcome: "
            defaultValue={resultOutcome}
            onChange={(e) => {
              setResultOutcome(e.target.value);
            }}
            maxLength={500}
          ></TextAreaInput>
        </div>
        {/* <div className="flex items-center gap-4  mb-0">
          <label htmlFor="assignUsersBtn" className="input-label-custom">
            <div className="flex gap-2">
              <User className="text-blue-600 mt-0.5" size={16} />
              <span>Assign Users : </span>
            </div>
          </label>
          <div id="assignUsersBtn" className=" max-w-32 m-0">
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setIsAssignUsersModalOpen(true);
              }}
            >
              <span
                title="Assign user to this task"
                className="flex  text-center text-nowrap"
              >
                <span className="flex  justify-center">
                  <UserPlus size={12} className=""></UserPlus>
                  {/* <span>Assign Users</span> */}
                {/* </span>
              </span>
            </Button>
          </div>
        </div> */} 
        <div className="flex items-center gap-2  mb-0">
          <label htmlFor="assignUsersBtn" className="input-label-custom">
            <div className="flex gap-1">
              <User className="text-blue-600 mt-0.5" size={16} />
              <span>Assign Users : </span>
            </div>
          </label>
          <div id="assignUsersBtn" className=" mb-1">
            {/* <Button

                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAddCompanyLeadContactModalOpen(true);
                    }}
                  >
                    <span className="flex gap-1 text-nowrap ">
                      <Contact size={SIZE.TWENTY}></Contact>
                      <span>lead contact</span>
                    </span>
                  </Button> */}
            <Button
              type="submit"
               className="bg-white text-blue-800 "
              onClick={(e) => {
                e.preventDefault();
                setIsAssignUsersModalOpen(true);
              }}
            >
              {/* <span
                title="Assign user to this task"
                className="flex  text-center text-nowrap"
              >
                <span className="flex gap-0.5 justify-center">
                  <UserPlus size={12} className="mt-0.5"></UserPlus>
                  {/* <span>Assign Users</span> */}
                {/* </span> */}
              {/* </span> */} 
              <span className="text-xs text-blue-500  text-nowrap underline ">
                   {selectedCompanyUsers.length ===0 ?  "Select" : "Select/Change"} 
                    {/* <Contact size={14}></Contact> */}
                    {/* <span>lead contact</span> */}
                  </span>
            </Button>
          </div>
        </div>

        {/* {selectedCompanyUsers.length != 0 && (
          <div className="grid grid-cols-3 input-label-custom">
            Assigned Users
          </div>
        )} */}
        {/* {selectedCompanyUsers.length != 0 && (
          <div className="mt-0.5 grid grid-cols-3 max-h-36 gap-0.5 overflow-y-auto">
            {selectedCompanyUsers.map((user) => (
              <div
                key={user.id}
                className="grid col-span-1 py-0.5 border border-r-2 px-0.5 hover:bg-gray-400 rounded-lg"
              >
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-3 w-3 caption-custom rounded-full bg-white" />
                    <span className="caption-custom">{user.fullname}</span>
                  </span>
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => {
                      setAssignedTo((prev) =>
                        prev.filter((id) => id !== user.id)
                      );
                      setSelectedCompanyUsers((prev) =>
                        prev.filter((item) => item.id !== user.id)
                      );
                    }}
                    className="caption-custom hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )} */}
         {selectedCompanyUsers.length != 0 && (
          <div className="border rounded-md">
            <span className="p-1 table-header-custom">Currently Assigned Users:</span>
            <div className=" grid grid-cols-3 p-1 max-h-36 gap-0.5 overflow-y-auto">
              {selectedCompanyUsers.map((user) => (
                <div
                  key={user.id}
                  className="grid col-span-1 py-0.5 border border-r-2 px-0.5 hover:bg-gray-100 rounded-lg"
                >
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-3 w-3caption-custom rounded-full bg-white" />
                      <span className="caption-custom">
                        {user.fullname
                          ? user.fullname
                          : user.email || "Unnamed contact"}
                      </span>
                    </span>
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => {
                        setAssignedTo((prev) =>
                          prev.filter((id) => id !== user.id)
                        );
                        setSelectedCompanyUsers((prev) =>
                          prev.filter((item) => item.id !== user.id)
                        );
                      }}
                      className="caption-custom hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
                if (isSaving) return;
                UpdateLeadTask(event);
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
      <LeadAssociatedUsersModal
        isOpen={isAssignUsersModalOpen}
        onClose={() => {
          setIsAssignUsersModalOpen(false);
        }}
        leadId={leadTask.leadId}
        addCompanyTeamUserArray={assignedTo}
        handleAddCompanyUserEmailCheckboxChange={
          handleAddCompanyUserCheckboxChange
        }
      ></LeadAssociatedUsersModal>

      {isAddCompanyLeadContactModalOpen && (
        <CompanyLeadContactsSelectionAgGrid
          isOpen={isAddCompanyLeadContactModalOpen}
          onClose={() => {
            setIsAddCompanyLeadContactModalOpen(false);
          }}
          selectedLeadId={leadData!.id}
          addCompanyLeadContactIdArray={addCompanyLeadContactIdArray}
          handleCompanyLeadContactCheckBoxChange={
            handleCompanyLeadContactCheckBoxChange
          }
          isUsedForMeetings={false}
        />
      )}
    </FormLayout>
  );
}

export default UpdateLeadTaskModal;
