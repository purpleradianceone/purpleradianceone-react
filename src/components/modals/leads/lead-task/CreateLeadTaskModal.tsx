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
  NUMBER_VALUES,
  SIZE,
  STATUS_CODE,
} from "../../../../constants/AppConstants";
import CompanyUsersSearchProps from "../../../../@types/company-users/CompanyUserProps";
import axios from "axios";
import POST_API from "../../../../constants/PostApi";
import RefreshToken from "../../../../config/validations/RefreshToken";
import {
  MessageSnackbarState,
  ShowMessageSnackbarProps,
} from "../../../../@types/ui/MessageSnackbarProps";
import MessageSnackBar from "../../../ui/MessageSnackbar";
import CompanyLeadContactsSelectionAgGrid from "../../../ag-grid/CompanyLeadContactsSelectionAgGrid";
import LeadContactType from "../../../../@types/lead-management/LeadContact";
import LeadAssociatedUsersModal from "./LeadAssociatedUsersModal";

function CreateLeadTaskModal({
  isOpen,
  handleClose,
  leadTaskStage,
  leadTaskPriority,
  leadActivity,
  leadId,
  handleLeadTaskCreate,
}: {
  isOpen: boolean;
  handleClose: () => void;
  leadId? : number;
  leadTaskStage: LeadTaskStageType[];
  leadTaskPriority: LeadTaskPriorityType[];
  leadActivity: LeadActivityType[];
  handleLeadTaskCreate: () => void;
}) {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();
  const [searchParams] = useSearchParams();

  const [subject, setSubject] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<string>("");
  const [leadActivityId, setLeadActivityId] = useState<number>(0);
  const [leadTaskPriorityId, setLeadTaskPriorityId] = useState<number>(0);
  const [leadTaskStageId, setLeadTaskStageId] = useState<number>(0);
  const [resultOutcome, setResultOutcome] = useState<string>("");
  const [leadData, setLeadData] = useState<Lead>();
  const [assignedTo, setAssignedTo] = useState<number[]>([loginStatus.id]);
  const [selectedCompanyUsers, setSelectedCompanyUsers] = useState<
    CompanyUsersSearchProps[]
  >([]);
  const [physicalMeetingAddress, setPhysicalMeetingAddress] =
    useState<string>("");

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

  const [messageSnackbar, setMessageSnackbar] = useState<MessageSnackbarState>({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showMessageSnackbar = ({ message, type }: ShowMessageSnackbarProps) => {
    setMessageSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setMessageSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    setLeadContactDataSelectedArray([]);
    setAddCompanyLeadContactIdArray([]);
  }, [leadActivityId]);

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
    setSelectedCompanyUsers([]);
    setLeadContactDataSelectedArray([]);
    setAddCompanyLeadContactIdArray([]);
    handleCloseSnackbar();
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

  const createLeadTask = async (event: React.FormEvent) => {
    if (leadActivityId === 0) {
      showMessageSnackbar({
        message: "Please Select Lead Task Activity",
        type: "error",
      });
      return;
    } else if (leadTaskPriorityId === 0) {
      showMessageSnackbar({
        message: "Please Select Lead Task Priority",
        type: "error",
      });
      return;
    } else if (leadTaskStageId === 0) {
      showMessageSnackbar({
        message: "Please Select Lead Task Stage",
        type: "error",
      });
      return;
    } else if (subject === "") {
      showMessageSnackbar({
        message: "Please provide Subject To Task",
        type: "error",
      });
      return;
    }
    else if(dueDate === ""){
       showMessageSnackbar({
        message: "Please select Due Date for Task",
        type: "error",
      });
      return;
    }
    else if(dueTime === ""){
       showMessageSnackbar({
        message: "Please select Due Time for Task",
        type: "error",
      });
      return;
    }

    event.preventDefault();
    const jsonData = generateTaskDetailsJson();
    const createLeadTaskPostData = {
      company_id: loginStatus.companyId,
      lead_id: leadData!.id,
      lead_activity_id: leadActivityId,
      lead_task_priority_id: leadTaskPriorityId,
      lead_task_stage_id: leadTaskStageId,
      subject: subject,
      description: description,
      search_parameter: "",
      result_outcome: resultOutcome,
      assignedto: assignedTo,
      due_date_time: `${dueDate} ${dueTime}:00`,
      lead_activity_details: jsonData,
      createdby_id: loginStatus.id,
    };

    axios
      .post(POST_API.CREATE_LEAD_TASK, createLeadTaskPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          showMessageSnackbar({
            message: response.data.message,
            type: "success",
          });
          handleLeadTaskCreate();
          setTimeout(() => {
            handleClose();
          }, 2000);
        } else {
          showMessageSnackbar({
            message: response.data.message,
            type: "error",
          });
        }
      })
      .catch(async (error) => {
        if (error.status === STATUS_CODE.UNATHORISED) {
          const refreshTokenResponse = await RefreshToken({
            callFunctionWithEvent: createLeadTask,
          });
          if (refreshTokenResponse) {
            createLeadTask(event);
          }
        }
      });
  };

   const getComapnyUsers = async () => {
    setSelectedCompanyUsers([]);
      const getCompanyUserPostData = {
        company_id: loginStatus.companyId,
        id: loginStatus.id,
        search_company_specific_date_range_id: 0,
        requestedby: loginStatus.id,
      };

      await axios
        .post(POST_API.GET_COMPANY_USERS, getCompanyUserPostData, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === STATUS_CODE.OK) {
            response.data.map((res : any) => {
                    setSelectedCompanyUsers((prev) => [...prev, res]);
            })
            
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
    
  };

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    if (isOpen) {
      getComapnyUsers();
      const leadSearchParam = JSON.parse(searchParams.get("leadData") || "{}");
      setLeadData(leadSearchParam);

    }
    if (!isOpen) {
      resetStates();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-20 flex justify-center items-center  p-2 sm:p-6">
      <div className="bg-white mt-14 min-h-[50vh] rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto px-2 py-2 shadow-2xl sm:px-4 sm:py-4">
        {/* Header */}
        <div className="border-b pb-1 mb-4 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-800">Create Task</h2>

          <X
            onClick={() => {
              handleClose();
            }}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          />
        </div>

        {/* Form Grid */}
        <form className="space-y-2">
          <div className="grid grid-cols-3 gap-3">
            <CustomDropdown
              labelName="Type"
              onSelect={(e) => {
                if (e !== 4) {
                  if (e) {
                    setLeadActivityId(e);
                  }
                  else{
                     setLeadActivityId(0);
                  }
                } else {
                  sessionStorage.setItem("leadData", JSON.stringify(leadData));
                  navigate(ROUTES_URL.SCHEDULE_MEETING);
                }
              }}
              options={leadActivity}
            ></CustomDropdown>
            <CustomDropdown
              labelName="Priority"
              onSelect={(e) => {
                if (e) {
                  setLeadTaskPriorityId(e);
                }
                else{
                   setLeadTaskPriorityId(0);
                }
              }}
              options={leadTaskPriority}
            ></CustomDropdown>
            <CustomDropdown
              labelName="Stage"
              onSelect={(e) => {
                if (e) {
                  setLeadTaskStageId(e);
                }
                else{
                  setLeadTaskStageId(0);
                }
              }}
              options={leadTaskStage}
            ></CustomDropdown>
            {leadActivityId !== 3
            && (
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
                  value={physicalMeetingAddress}
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
                onChange={(e) => {
                  setResultOutcome(e.target.value);
                }}
              ></TextAreaInput>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-2">
                <DatePickerInput
                  label="End Date"
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
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></TextAreaInput>
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
            <Button type="submit" onClick={createLeadTask}>
              Create Task
            </Button>
          </div>
        </div>
      </div>
      <LeadAssociatedUsersModal
        isOpen={isAssignUsersModalOpen}
        onClose={() => {
          setIsAssignUsersModalOpen(false);
        }}
        leadId={leadId!}
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

      <MessageSnackBar
        isOpen={messageSnackbar.open}
        message={messageSnackbar.message}
        type={messageSnackbar.type}
        onClose={handleCloseSnackbar}
        duration={NUMBER_VALUES.SNACKBAR_DURATION}
      />
    </div>
  );
}

export default CreateLeadTaskModal;
