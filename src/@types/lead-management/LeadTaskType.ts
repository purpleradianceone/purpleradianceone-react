/* eslint-disable @typescript-eslint/no-explicit-any */
type LeadTaskType = {
  id: number;
  leadId : number;
  leadName?: string;
  leadStatusName?: string;
  leadActivityId : number;
  leadTaskActivityName : string;
  leadTaskPriorityId : number;
  leadTaskPriorityName : string;
  leadTaskStageId : number;
  leadTaskStageName : string;
  subject : string,
  description: string;
  resultOutcome : string;
  dueDateTime : string;
  overdueStatus? : string;
  leadActivityDetails : any;
  isActive : boolean;
  colorCode : string;
  assignedToId? : number[];
  assignedToName? : string[];
  completedAtDateTime? : string;
  
  createdOn? : string;
  createdBy? : string;
  updatedOn? : string;
  updatedBy? : string;
  completedAt? : string;
}

export default LeadTaskType;