/* eslint-disable @typescript-eslint/no-explicit-any */
import { History } from "lucide-react";
import LeadTaskType from "../../../../@types/lead-management/LeadTaskType";
import LeadContactType from "../../../../@types/lead-management/LeadContact";
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import POST_API from "../../../../constants/PostApi";
import ApiError from "../../../../@types/error/ApiError";
import RefreshToken from "../../../../config/validations/RefreshToken";
import { STATUS_CODE } from "../../../../constants/AppConstants";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import { createPortal } from "react-dom";
import FormHeader from "../../../ui/FormHeader";
import axiosClient from "../../../../axios-client/AxiosClient";

interface LeadTaskHistoryModalProps {
  isOpen: boolean;
  handleClose: (value: boolean) => void;
  leadTask : LeadTaskType;
  // If you're passing the actual history from a parent, remove the useState mock data below
  // and pass `history: LeadTaskType[];` here.
}

function LeadTaskHistoryModal({
  isOpen,
  handleClose,
  leadTask
}: LeadTaskHistoryModalProps) {

    const {loginStatus} = useLoggedInUserContext();
  const [isShowDetailsExpandedId, setIsShowDetailExpandedId] = useState<number>(0);
  const [leadTaskHistory, setLeadTaskHistory] = useState<LeadTaskType[]>([]);
  const [isLoading,setIsLoading] = useState<boolean>(false);



  const resetStates = () => {
    setIsShowDetailExpandedId(0);
    setLeadTaskHistory([]);
  }

  const getLeadTaskHistory = async() => {
    setIsLoading(true);
    setLeadTaskHistory([])
    const getLeadTaskHistoryPostData = {
        company_id : loginStatus.companyId,
        id : leadTask.id,
        requestedby_id : loginStatus.id 
    }

    await axiosClient.post(POST_API.GET_LEAD_TASK_HISTORY,getLeadTaskHistoryPostData,{
        withCredentials : true
    }).then((response) =>{
         response.data.map((res : any) => {
        setLeadTaskHistory((prev) => [...prev,{
          id : res.id,
          leadId : res.lead_id,
          leadActivityId : res.lead_activity_id,
          leadTaskPriorityId : res.lead_task_priority_id,
          leadTaskStageId : res.lead_task_stage_id,
          subject : res.subject,
          description : res.description,
          colorCode : res.color_code,
          assignedToId : res.assignedto,
          assignedToName : res.assigned_to,
          dueDateTime : res.due_date_time,
          completedAtDateTime : res.completed_at_date_time,
          leadActivityDetails : res.lead_activity_details,
          isActive : res.isactive,
          createdBy : res.createdby,
          updatedBy : res.updatedby,
          createdOn : res.createdon,
          updatedOn : res.updatedon,
          resultOutcome : res.result_outcome,
         leadTaskActivityName : res.lead_activity_name,
          leadTaskPriorityName : res.lead_task_priority_name,
          leadTaskStageName : res.lead_task_stage_name
        }])
      })
    }).catch(async(error : ApiError | any) => {
        if(error.status === STATUS_CODE.UNATHORISED){
            const refreshTokenResponse = await RefreshToken({callFunction : getLeadTaskHistory});
            if(refreshTokenResponse){
                getLeadTaskHistory();
            }
        }
    }).finally(() => {
        setIsLoading(false);
    })
  }

  // Helper function to get lead contact or address data from leadActivityDetails
  const getLeadTaskJsonData = (activity: LeadTaskType) => {
    try {
      const details = JSON.parse(activity.leadActivityDetails);
      if (leadTask.leadActivityId !== 3) {
        return details.leadContact;
      } else {
        return details.address; 
      }
    } catch (e) {
      console.error("Error parsing leadActivityDetails:", e);
      return null;
    }
  };

  const areArraysEqual = (arr1: any[], arr2: any[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) return false;
    }
    return true;
  };

  const areObjectsEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key) || !areObjectsEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  };

  const generateHistoryLog = (taskHistory: LeadTaskType[]) => {
    const logEntries: { id: number; timestamp: string; event: string; details: string[] }[] = [];

    if (taskHistory.length === 0) {
      return logEntries;
    }

    

    for (let i = 1; i < taskHistory.length; i++) {
      const prevTask = taskHistory[i - 1];
      const currentTask = taskHistory[i];
      const changes: string[] = [];

      if (prevTask.subject !== currentTask.subject) {
        changes.push(`Subject changed from "${currentTask.subject}" to "${prevTask.subject}"`);
      }
      if (prevTask.description !== currentTask.description) {
        changes.push(`Description changed from "${currentTask.description || 'N/A'}" to "${prevTask.description || 'N/A'}"`);
      }
      if (prevTask.dueDateTime !== currentTask.dueDateTime) {
        changes.push(`Due Date changed from "${currentTask.dueDateTime}" to "${prevTask.dueDateTime}"`);
      }
      if (prevTask.leadTaskPriorityName !== currentTask.leadTaskPriorityName) {
        changes.push(`Priority changed from ${currentTask.leadTaskPriorityName} to ${prevTask.leadTaskPriorityName}`);
      }
      if (prevTask.leadTaskStageName !== currentTask.leadTaskStageName) {
        changes.push(`Stage changed from ${currentTask.leadTaskStageName} to ${prevTask.leadTaskStageName}`);
      }
      if (!areArraysEqual(prevTask.assignedToName!, currentTask.assignedToName!)) {
        changes.push(`Assignees changed from ${currentTask.assignedToName!.join(" , ")} to ${prevTask.assignedToName!.join(" , ")}`);
      }
      if (prevTask.resultOutcome !== currentTask.resultOutcome) {
        changes.push(`Outcome changed from "${currentTask.resultOutcome || 'N/A'}" to "${prevTask.resultOutcome || 'N/A'}"`);
      }
      if (prevTask.isActive !== currentTask.isActive) {
        changes.push(`Task Status Changed from "${currentTask.isActive ? 'Active' : 'Inactive'}" to "${prevTask.isActive ? 'Active' : 'Inactive'}"`);
      }

      const prevDetails = getLeadTaskJsonData(currentTask);
      const currentDetails = getLeadTaskJsonData(prevTask);

      if (leadTask.leadActivityId !== 3 && leadTask.leadActivityId !== 3) {
        if (!areObjectsEqual(prevDetails, currentDetails)) {
          const prevContactNames = (prevDetails as LeadContactType[] || []).map(c => c.name).join(" , ");
          const currentContactNames = (currentDetails as LeadContactType[] || []).map(c => c.name).join(", ");
          changes.push(`Contacts changed from ${prevContactNames} to ${currentContactNames}`);
        }
      } else if (leadTask.leadActivityId === 3 && leadTask.leadActivityId === 3) {
        if (prevDetails !== currentDetails) {
          changes.push(`Address changed from "${prevDetails || 'N/A'}" to "${currentDetails || 'N/A'}"`);
        }
      } else {
        // Activity type itself changed, covered by leadActivityId comparison.
        // If the *structure* of leadActivityDetails is vastly different,
        // we might want a generic message, but for now, rely on individual field comparisons.
        // This 'else' block will only trigger if activityId changed, so generic details might not be useful.
      }


      if (changes.length > 0) {
        logEntries.push({
          id: prevTask.id,
          timestamp: prevTask.updatedOn || "N/A", // Using dueDateTime as a proxy for timestamp
          event: "Task Updated By " + prevTask.createdBy,
          details: changes, // Now `details` is an array of strings
        });
      }
    }
    const initialTask = taskHistory[taskHistory.length-1];
    logEntries.push({
      id: initialTask.id,
      timestamp: initialTask.createdOn || "N/A",
      event: "Task Created By " + initialTask.createdBy,
      details: [`Subject: "${initialTask.subject}"`, `Description: "${initialTask.description || 'N/A'}"`],
    });

    return logEntries;
  };

  const toggleExpand = (id: number) => {
    setIsShowDetailExpandedId(prevId => (prevId === id ? 0 : id)); // Toggle mechanism
  }

  const historyLog = generateHistoryLog(leadTaskHistory);

  useEffect(() => {
    if(isOpen){
        getLeadTaskHistory();
    }
    else if(!isOpen){
        resetStates();
    }
  },[isOpen])

  
  if (!isOpen) return null;
  return (
    createPortal(
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center  z-50 pt-24 pb-14">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl min-h-full p-6 relative">
        {/* Close Button */}
        {/* <button
          onClick={() => handleClose(false)}
          className="absolute top-3 right-6 section-header-custom hover:text-red-500 transition-colors"
          aria-label="Close"
        >
          <XCircle size={24} />
        </button>

        <h2 className="section-header-custom mb-4 border-b pb-2">
          Lead Task History
        </h2> */}
        <FormHeader
        icon={History}
        onClose={()=>{
          handleClose(false)
        }}
        preText="Lead Task History"
        description="View your lead task history and track down the changes done in your task"
        />
        <div className="h-96 overflow-y-auto pr-2">
          <h3 className="table-header-custom mb-3">
            Activity Log
          </h3>

          {isLoading ? (
            <div className="flex justify-center">
                     <LoadingSpinner></LoadingSpinner>
            </div>
           
          ) :  historyLog.length > 0 ? (
            <ul className="space-y-3">
              {historyLog.map((entry, index) => (
                <><li key={index} className="bg-gray-50 p-3 rounded-md shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="input-label-custom">
                      {entry.timestamp}
                    </span>
                    <span className="table-header-custom active">
                      {entry.event}
                    </span>
                  </div>
                  {isShowDetailsExpandedId === entry.id ? (
                    <>
                      <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                        {entry.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="caption-custom">{detail}</li>
                        ))}
                      </ul>
                      <button
                        onClick={() => toggleExpand(entry.id)}
                        className="caption-custom-blue hover:underline focus:outline-none mt-2"
                      >
                        Hide Details
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="caption-custom-blue hover:underline focus:outline-none"
                    >
                      Show details ({entry.details.length} changes)
                    </button>
                  )}
                </li>
               
                
                  </>
                
              ))}
              
            </ul>
          ) : (
            <p className="caption-custom">No history available for this task.</p>
          )}
         
        </div>
      </div>
    </div>,
    document.body
    )
  );
}

export default LeadTaskHistoryModal;