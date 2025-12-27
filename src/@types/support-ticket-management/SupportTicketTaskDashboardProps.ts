type SupportTicketTaskDashboardProps = {
  id: number;
  support_ticket_id: number;
  ticket_number: string;
  support_ticket_task_stage_id: number;
  support_ticket_task_stage_name: string;
  description: string;
  result_outcome: string;
  due_date_time: string;
  overdue_status: string;
};

export default SupportTicketTaskDashboardProps;
