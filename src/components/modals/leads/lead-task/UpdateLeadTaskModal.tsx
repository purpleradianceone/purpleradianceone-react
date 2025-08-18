/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Contact2Icon, UserPlus, Users, X } from "lucide-react";
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
import {
  SIZE,
  STATUS_CODE,
} from "../../../../constants/AppConstants";
import CompanyUsersSearchProps from "../../../../@types/company-users/CompanyUserProps";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import RefreshToken from "../../../../config/validations/RefreshToken";
// import {
//   MessageSnackbarState,
//   ShowMessageSnackbarProps,
// } from "../../../../@types/ui/MessageSnackbarProps";
// import MessageSnackBar from "../../../ui/MessageSnackbar";
import CompanyLeadContactsSelectionAgGrid from "../../../ag-grid/CompanyLeadContactsSelectionAgGrid";
import LeadContactType from "../../../../@types/lead-management/LeadContact";
import LeadTaskType from "../../../../@types/lead-management/LeadTaskType";
import { format, parse } from "date-fns";
import { createPortal } from "react-dom";
import LeadAssociatedUsersModal from "./LeadAssociatedUsersModal";
import toast from "react-hot-toast";

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
  const [assignedTo, setAssignedTo] = useState<number[]>(leadTask.assignedToId!);
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

  // const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
  //   open: false,
  //   message: "",
  //   type: "success" as "success" | "error",
  // });

  // const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
  //   setMessageSnackbar({ open: true, message, type });
  // };

  // const handleCloseSnackbar = () => {
  //   setMessageSnackbar((prev) => ({ ...prev, open: false }));
  // };

  useEffect(() => {
    const leadDetailsJsonData = JSON.parse(leadTask.leadActivityDetails);
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
    if (leadActivityId !== 3) {
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

  const UpdateLeadTask = async (event: React.FormEvent) => {
    event.preventDefault();
    const jsonData = generateTaskDetailsJson();

    const originalLeadActivityDetailsString = leadTask.leadActivityDetails;

    // If leadTask.leadActivityDetails is an object (after parsing in useEffect):
    // This is safer if you've already parsed it and use the parsed object
    const originalLeadDetailsObject = JSON.parse(
      originalLeadActivityDetailsString
    );
    const stringifiedOriginalData = JSON.stringify(originalLeadDetailsObject);

    if (leadActivityId === 0) {
      // showMessageSnackbar({
      //   message: "Please Select Lead Task Activity",
      //   type: "error",
      // });
      toast.error("Please Select Lead Task Activity");
      return;
    } else if (leadTaskPriorityId === 0) {
      // showMessageSnackbar({
      //   message: "Please Select Lead Task Priority",
      //   type: "error",
      // });
      toast.error("Please Select Lead Task Priority");
      return;
    } else if (leadTaskStageId === 0) {
      // showMessageSnackbar({
      //   message: "Please Select Lead Task Stage",
      //   type: "error",
      // });
      toast.error("Please Select Lead Task Priority");
      return;
    } else if (subject === "") {
      // showMessageSnackbar({
      //   message: "Please provide Subject To Task",
      //   type: "error",
      // });
      toast.error("Please provide Subject To Task");

      return;
    } else if (dueDate === "") {
      // showMessageSnackbar({
      //   message: "Please select Due Date for Task",
      //   type: "error",
      // });
      toast.error("Please select Due Date for Task");
      return;
    } else if (dueTime === "") {
      // showMessageSnackbar({
      //   message: "Please select Due Time for Task",
      //   type: "error",
      // });
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
      // showMessageSnackbar({
      //   message: "Not made changes to task",
      //   type: "error",
      // });
            toast.error("Not made changes to task");

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
      lead_activity_details: jsonData,
      isactive: isActive,
      updatedby_id: loginStatus.id,
    };

    axios
      .post(POST_API.UPDATE_LEAD_TASK, updateLeadTaskPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === STATUS_CODE.OK) {
          if (response.data.status) {
            // showMessageSnackbar({
            //   message: response.data.message,
            //   type: "success",
            // });
            toast.success(response.data.message)
            handleLeadTaskUpdate();
            setTimeout(() => {
              handleClose(false);
            }, 2000);
          } else {
            // showMessageSnackbar({
            //   message: response.data.message,
            //   type: "error",
            // });
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
        }
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
            // showMessageSnackbar({
            //   message: response.data.message,
            //   type: "success",
            // });
            toast.success(response.data.message);
            setIsActive(checked);
            handleLeadTaskUpdate();
            // setTimeout(() => {
            //   handleClose(false);
            // }, 2000);
          } else {
            // showMessageSnackbar({
            //   message: response.data.message,
            //   type: "error",
            // });
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
  return createPortal(
    <div className="fixed inset-0 z-10 bg-black bg-opacity-20 flex justify-center items-center  p-2 sm:p-6">
      <div className="bg-white mt-14 min-h-[50vh] rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto px-2 py-2 shadow-2xl sm:px-4 sm:py-4">
        {/* Header */}
        <div className="border-b pb-1 mb-4 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-800">Update Task</h2>

          <X
            onClick={() => {
              handleClose(false);
            }}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          />
        </div>

        {/* Form Grid */}
        <form className="space-y-2">
          <div className="grid grid-cols-3 gap-3">
            <CustomDropdown
              readOnly={true}
              labelName="Type"
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
            <CustomDropdown
              labelName="Priority"
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
            <CustomDropdown
              labelName="Stage"
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
            {leadActivityId !== 3 && (
              <div className="flex justify-between col-span-3 mb-0">
                <label
                  htmlFor="phoneCallBtn"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Lead Contact
                </label>
                <div id="phoneCallBtn" className="max-w-20 m-0">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsAddCompanyLeadContactModalOpen(true);
                    }}
                  >
                    <span className="flex gap-2">
                      <Contact2Icon size={SIZE.TWENTY}></Contact2Icon>
                      <span>Select</span>
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
            <div className="grid grid-cols-3 text-sm font-medium text-gray-700">
              Selected Lead Contacts
            </div>
          )}
          {leadContactDataSelectedArray.length != 0 && (
            <div className="mt-0.5 grid grid-cols-3 max-h-36 gap-0.5 overflow-y-auto">
              {leadContactDataSelectedArray.map((contact) => (
                <div
                  key={contact.id}
                  className="grid col-span-1 py-0.5 border border-r-2 px-0.5 hover:bg-gray-400 rounded-lg"
                >
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-gray-600 rounded-full bg-white" />
                      <span className="text-xs text-gray-600">
                        {contact.name}
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
                      className="text-gray-600 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="mt-2">
              <FormInput
                label="Subject"
                type="text"
                value={subject}
                defaultValue={leadTask.subject}
                className="test-base"
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
              ></FormInput>
            </div>

            <div className="row-span-2">
              <TextAreaInput
                cols={5}
                rows={5}
                label="Outcome"
                defaultValue={resultOutcome}
                onChange={(e) => {
                  setResultOutcome(e.target.value);
                }}
              ></TextAreaInput>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-2">
                <DatePickerInput
                  label="End Date"
                  defaultValue={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                  }}
                />
              </div>

              <div className="mt-2 col-span-2">
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <select
                  id="endTime"
                  className="mt-1 w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  onChange={(e) => {
                    setDueTime(e.target.value);
                  }}
                  defaultValue={dueTime}
                >
                  <option value="">End Time</option>
                  {timeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-span-2">
              <TextAreaInput
                cols={5}
                rows={5}
                label="Description"
                defaultValue={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></TextAreaInput>
            </div>
            <div className="flex items-center col-span-2 justify-between py-1 border-b border-blue-100">
              <label
                htmlFor="isActive"
                className="text-lg text-gray-700 cursor-pointer"
              >
                Active
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={isActive}
                  onChange={handleIsActiveCheckboxChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-300 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {selectedCompanyUsers.length != 0 && (
            <div className="grid grid-cols-3 text-sm font-medium text-gray-700">
              Assigned Users
            </div>
          )}
          {selectedCompanyUsers.length != 0 && (
            <div className="mt-0.5 grid grid-cols-3 max-h-36 gap-0.5 overflow-y-auto">
              {selectedCompanyUsers.map((user) => (
                <div
                  key={user.id}
                  className="grid col-span-1 py-0.5 border border-r-2 px-0.5 hover:bg-gray-400 rounded-lg"
                >
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-gray-600 rounded-full bg-white" />
                      <span className="text-xs text-gray-600">
                        {user.fullname}
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
                      className="text-gray-600 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <div className="max-w-28">
            <Button
              type="button"
              onClick={() => setIsAssignUsersModalOpen(true)}
            >
              <span className="flex gap-2">
                <UserPlus size={SIZE.TWENTY}></UserPlus>
                <span>Assign</span>
              </span>
            </Button>
          </div>
          <div className="max-w-28">
            <Button type="submit" onClick={UpdateLeadTask}>
              Update Task
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
        />
      )}

      {/* <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      /> */}
    </div>,
    document.body
  );
}

export default UpdateLeadTaskModal;
