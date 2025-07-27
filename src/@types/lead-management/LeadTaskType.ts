/* eslint-disable @typescript-eslint/no-explicit-any */
type LeadTaskType = {
  id: number;
  leadId : number;
  leadActivityId : number;
  leadTaskPriorityId : number;
  leadTaskStageId : number;
  subject : string,
  description: string;
  colorCode : string;
  assignedToId : number[];
  assignedToName : string[];
  dueDateTime : string;
  completedAtDateTime? : string;
  leadActivityDetails : any;
  isActive : boolean;
  createdOn : string;
  createdBy : string;
  updatedOn : string;
  updatedBy : string;
  resultOutcome : string;
  leadTaskActivityName : string;
  leadTaskPriorityName : string;
  leadTaskStageName : string;
  overdueStatus? : string;
  completedAt? : string;
}

export default LeadTaskType;