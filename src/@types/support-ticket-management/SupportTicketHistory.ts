type SupportTicketHistory = {
    count: number;
    id: number;
    support_ticket_category_id: number;
    support_ticket_category_name: string;
    support_ticket_escalation_level_id: number;
    support_ticket_escalation_level_name: string;
    support_ticket_lifecycle_id: number;
    support_ticket_lifecycle_name: string;
    company_product_sla_id: number;
    company_product_sla_name: string;
    support_ticket_source_id: number;
    support_ticket_source_name: string;
    query_description: string;
    public_note: string;
    resolution_applied: string;
    assignedto: number;
    assignedto_name: string;
    resolvedby: number;
    resolvedby_name: string;
    createdby: string;
    updatedby: string;
    createdon: string;
    updatedon: string;
}
export default SupportTicketHistory;