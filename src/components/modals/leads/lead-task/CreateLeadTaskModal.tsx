/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Calendar,
  ClipboardList,
  Clock,
  Contact2,
  FileText,
  FileTextIcon,
  Globe,
  Save,
  TargetIcon,
  Text,
  User,
  Users,
  X,
} from "lucide-react";
import Button from "../../../ui/Button";
import FormInput from "../../../ui/FormInput";
import DatePickerInput from "../../../ui/DatePickerInput";
import TextAreaInput from "../../../ui/TextAreaInput";
import {  useNavigate, useSearchParams } from "react-router-dom";
import ROUTES_URL from "../../../../constants/Routes";
import LeadActivityType from "../../../../@types/lead-management/LeadActivityType";
import LeadTaskPriorityType from "../../../../@types/lead-management/LeadTaskPriorityType";
import LeadTaskStageType from "../../../../@types/lead-management/LeadTaskStageType";
import React, { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import Lead from "../../../../@types/lead-management/LeadManagementProps";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import CompanyUsersSearchProps from "../../../../@types/company-users/CompanyUserProps";
import POST_API from "../../../../constants/PostApi";
import RefreshToken from "../../../../config/validations/RefreshToken";
import CompanyLeadContactsSelectionAgGrid from "../../../ag-grid/CompanyLeadContactsSelectionAgGrid";
import LeadContactType from "../../../../@types/lead-management/LeadContact";
import LeadAssociatedUsersModal from "./LeadAssociatedUsersModal";
import toast from "react-hot-toast";
import FormHeader from "../../../ui/FormHeader";
import MESSAGE from "../../../../constants/Messages";
import LoadingPopUpAnimation from "../../../views/card/LoadingPopUpAnimation";
import FormLayout from "../../../ui/FormLayout";
import axiosClient from "../../../../axios-client/AxiosClient";
import CustomSelect from "../../../ui/CustomSelect";
import { toSelectOptions } from "../../../../utils/toSelectOption";

function CreateLeadTaskModal({
  isOpen,
  handleClose,
  leadTaskStage,
  leadTaskPriority,
  leadActivity,
  leadId,
  handleLeadTaskCreate,
  ownerId,
}: {
  isOpen: boolean;
  handleClose: () => void;
  leadId?: number;
  leadTaskStage: LeadTaskStageType[];
  leadTaskPriority: LeadTaskPriorityType[];
  leadActivity: LeadActivityType[];
  handleLeadTaskCreate: () => void;
  ownerId: number;
}) {
  const navigate = useNavigate();
  const { loginStatus } = useLoggedInUserContext();
  const [searchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);

  const [subject, setSubject] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<string>("");
  const [leadActivityId, setLeadActivityId] = useState<number>(0);
  const [leadTaskPriorityId, setLeadTaskPriorityId] = useState<
    number | undefined
  >(0);
  const [leadTaskStageId, setLeadTaskStageId] = useState<number>(0);
  const [resultOutcome, setResultOutcome] = useState<string>("");
  const [leadData, setLeadData] = useState<Lead>();
  const [assignedTo, setAssignedTo] = useState<number[]>([ownerId]);
  const [selectedCompanyUsers, setSelectedCompanyUsers] = useState<
    CompanyUsersSearchProps[]
  >([]);
  const [physicalMeetingAddress, setPhysicalMeetingAddress] =
    useState<string>("");

  const leadTaskPriorityOptions = toSelectOptions(
    leadTaskPriority,
    "id",
    "name",
  );
  const leadActivityOptions = toSelectOptions(leadActivity, "id", "name");
  const leadTaskStageOptions = toSelectOptions(leadTaskStage, "id", "name");
  const handleLeadSelectedSource = (value: number | undefined) => {
    setLeadTaskPriorityId(value);
  };
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
    setAssignedTo([ownerId]);
    setIsAssignUsersModalOpen(false);
    setSelectedCompanyUsers([]);
    setLeadContactDataSelectedArray([]);
    setAddCompanyLeadContactIdArray([]);
    // handleCloseSnackbar();
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
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { checked } = event.target;
    if (checked) {
      setAssignedTo([...assignedTo, params.id]);
      setSelectedCompanyUsers((prev) => [...prev, params]);
    } else if (!checked) {
      setAssignedTo(assignedTo.filter((id) => id !== params.id));
      setSelectedCompanyUsers((prev) =>
        prev.filter((user) => user.id !== params.id),
      );
    }
  };

  const handleCompanyLeadContactCheckBoxChange = (
    data: LeadContactType,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { checked } = event.target;
    if (checked) {
      setAddCompanyLeadContactIdArray((prev) => [...prev, data.id]);
      setLeadContactDataSelectedArray((prev) => [...prev, data]);
    } else if (!checked) {
      setAddCompanyLeadContactIdArray((prev) =>
        prev.filter((id) => id !== data.id),
      );
      setLeadContactDataSelectedArray((prev) =>
        prev.filter((leadData) => leadData.id !== data.id),
      );
    }
  };

  const generateTaskDetailsJson = () => {
    if (leadActivityId !== 3 && leadActivityId !== 8) {
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

  const createLeadTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    if (leadActivityId === 0) {
      toast.error("Please Select Lead Task Activity");
      return;
    } else if (leadTaskPriorityId === 0) {
      toast.error("Please Select Lead Task Priority");
      return;
    } else if (leadTaskStageId === 0) {
      toast.error("Please Select Lead Task Stage");
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
    } else if (assignedTo.length === 0) {
      toast.error("You haven't assigned a task yet, please assign it first");
      return;
    }

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
    setIsSaving(true);
    await axiosClient
      .post(POST_API.CREATE_LEAD_TASK, createLeadTaskPostData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success(response.data.message);
          handleLeadTaskCreate();
          handleClose();
        } else {
          toast.error(response.data.message);
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
    const getCompanyUserPostData = {
      company_id: loginStatus.companyId,
      id: ownerId,
      search_company_specific_date_range_id: 0,
      requestedby: loginStatus.id,
    };

    await axiosClient
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

  //we are preselecting the options here
  useEffect(() => {
    setLeadTaskPriorityId(2);
    setLeadTaskStageId(2);
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
      <form className="space-y-2 mt-2" onSubmit={createLeadTask}>
        <div className="grid grid-cols-3 gap-3">
          {/* type */}
          {/* <CustomDropdown
            requiredRedDot
            logo={Text}
            labelName="Type:"
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
            options={leadActivity}
          ></CustomDropdown> */}

          <CustomSelect
            label="Type:"
            value={leadActivityId}
            onChange={(id: number | undefined) => {
              if (id !== 4) {
                if (id) {
                  setLeadActivityId(id);
                } else {
                  setLeadActivityId(0);
                }
              } else {
                sessionStorage.setItem("leadData", JSON.stringify(leadData));
                navigate(ROUTES_URL.SCHEDULE_MEETING);
              }
            }}
            options={leadActivityOptions}
            icon={Text}
            isRequired={true}
            autoFocus={true}
          />

          <CustomSelect
            label="Priority:"
            value={leadTaskPriorityId}
            onChange={handleLeadSelectedSource}
            options={leadTaskPriorityOptions}
            icon={Text}
            isRequired={true}
          />
          {/* priority */}
          {/* <CustomDropdown
            requiredRedDot
            logo={Text}
            labelName="Priority :"
            preselectedOption={2} // id of medium
            onSelect={(e) => {
              if (e) {
                setLeadTaskPriorityId(e);
              } else {
                setLeadTaskPriorityId(0);
              }
            }}
            options={leadTaskPriority}
          /> */}

          {/* Stage */}
          {/* <CustomDropdown
            // requiredRedDot
            // logo={Text}
            // labelName="Stage"
            preselectedOption={2}
            onSelect={(e) => {
              if (e) {
                setLeadTaskStageId(e);
              } else {
                setLeadTaskStageId(0);
              }
            }}
            options={leadTaskStage}
          ></CustomDropdown> */}
          <CustomSelect
            label="Stage:"
            value={leadTaskStageId}
            onChange={(id: number | undefined) => {
              if (id) {
                setLeadTaskStageId(id);
              } else {
                setLeadTaskStageId(0);
              }
            }}
            options={leadTaskStageOptions}
            icon={Text}
            isRequired={true}
          />
          {leadActivityId !== 3 &&
            leadActivityId !== 8 &&
            leadActivityId !== 0 && (
              // <div className="flex items-center gap-4  mb-0">
              //   <label htmlFor="phoneCallBtn" className="input-label-custom">
              //     <div className="flex gap-2">
              //       <Contact2 className="text-blue-600 mt-0.5" size={16} />
              //       <span>Lead Contact :</span>
              //     </div>
              //   </label>
              //   <div id="phoneCallBtn" className=" max-w-32 m-0">
              //     <Button
              //       type="submit"
              //       onClick={(e) => {
              //         e.preventDefault();
              //         setIsAddCompanyLeadContactModalOpen(true);
              //       }}
              //     >
              //       <span className="flex gap-1 text-nowrap ">
              //         <Contact size={14}></Contact>
              //         {/* <span>lead contact</span> */}
              //       </span>
              //     </Button>
              //   </div>
              // </div>
              // Select lead contact
              <div className="flex items-center  justify-start gap-2   mb-0">
                <label
                  // htmlFor="phoneCallBtn"
                  className="block input-label-custom"
                >
                  <div className="flex gap-1">
                    <Contact2 className="text-blue-600 mt-0.5" size={16} />
                    <span>Lead Contact:</span>
                  </div>
                </label>
                <div
                  // id="phoneCallBtn"
                  className="mb-1   "
                >
                  <Button
                    className="bg-white text-blue-800 "
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAddCompanyLeadContactModalOpen(true);
                    }}
                  >
                    <span className="text-xs text-blue-500  text-nowrap underline ">
                      {leadContactDataSelectedArray.length === 0
                        ? "Select"
                        : "Select/Change"}
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
                logo={Globe}
                value={physicalMeetingAddress}
                label="Address"
                onChange={(e) => {
                  setPhysicalMeetingAddress(e.target.value);
                }}
              ></FormInput>
            </div>
          )}
        </div>

        {/* {leadContactDataSelectedArray.length != 0 && (
          
        )} */}
        {leadContactDataSelectedArray.length != 0 && (
          <div className="border  rounded-md">
            <div className=" p-1 table-header-custom">Selected Contacts :</div>
            <div className=" grid grid-cols-3 p-1  max-h-36 gap-0.5 overflow-y-auto">
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
                          prev.filter((id) => id !== contact.id),
                        );
                        setLeadContactDataSelectedArray((prev) =>
                          prev.filter((item) => item.id !== contact.id),
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

        <div className="grid grid-cols-2 gap-2">
          {/* Subject */}
          {/* <div className=""> */}
          <FormInput
            required
            logo={FileTextIcon}
            label="Subject :"
            type="text"
            placeholder="Enter the subject"
            className="test-base"
            onChange={(e) => {
              setSubject(e.target.value);
            }}
          ></FormInput>

          {/* </div> */}

          {/* End date */}
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1">
              <DatePickerInput
                label="End Date"
                onChange={(e) => {
                  setDueDate(e.target.value);
                }}
                logo={Calendar}
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
                className=" w-full pl-3 pr-10 py-1 border border-gray-300 focus:outline-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={(e) => {
                  setDueTime(e.target.value);
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
          {/* Description */}
          <TextAreaInput
            logo={FileText}
            cols={5}
            rows={3}
            label="Description:"
            placeholder="Enter the description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            maxLength={500}
          ></TextAreaInput>
          {/* Outcome */}
          <TextAreaInput
            logo={TargetIcon}
            cols={5}
            rows={3}
            label="Outcome : "
            placeholder="Enter the outcome"
            onChange={(e) => {
              setResultOutcome(e.target.value);
            }}
            maxLength={500}
          ></TextAreaInput>
        </div>

        {/* <div className="relative grid grid-cols-3 justify-center input-label-custom">
              <div className="flex gap-2 mt-2">
                <User className="text-blue-600  w-3 h-3 mt-1" />
                <span>Assign Users : </span>
              </div>

              <div className="absolute left-28 max-w-32">
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
                    <span className="flex gap-0.5 justify-center">
                      <UserPlus size={16} className="mt-0.5"></UserPlus>
                      <span>Assign Users</span>
                    </span>
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
              type="button"
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
                {selectedCompanyUsers.length === 0 ? "Select" : "Select/Change"}
                {/* <Contact size={14}></Contact> */}
                {/* <span>lead contact</span> */}
              </span>
            </Button>
          </div>
        </div>

        {selectedCompanyUsers.length != 0 && (
          <div className="border rounded-md">
            <span className="p-1 table-header-custom">
              Currently Assigned Users:
            </span>
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
                          prev.filter((id) => id !== user.id),
                        );
                        setSelectedCompanyUsers((prev) =>
                          prev.filter((item) => item.id !== user.id),
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
                disabled={isSaving}
                // onClick={(event: React.FormEvent<HTMLButtonElement>) => {
                //   if (isSaving) return;
                //   createLeadTask(event);
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

      {/* </div> */}
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
      />

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

export default CreateLeadTaskModal;
