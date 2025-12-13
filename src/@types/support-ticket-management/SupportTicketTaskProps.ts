type SupportTicketTaskProps = {
  id: number,
  supportTicketId: number,
  supportTicketTaskStageId: number,
  supportTicketTaskStageName: string,
  description?: string,
  resultOutcome?: string,
  assignedTo: number,
  assignToName: string,
  dueDateTime: string,
  completedAtDateTime: string,
  isActive: boolean,
  createdBy: string,
  createdOn: string,
  updatedBy?: string,
  updatedOn?: string,
};
export default SupportTicketTaskProps;
