type PostDataToGetSupportTicketData ={
    company_id: number,
    id : number | null,
    company_product_id?: number | null,
    support_ticket_category_id : number | null,
    support_ticket_source_id : number | null,
    support_ticket_lifecycle_id : number | null,
    assignedto : number | null,
    resolvedby : number | null,
    search_company_specific_date_range_id  : number | null,
    search_parameter : string | null,
    search_parameter_date : string | null,
    offset : number | null,
    limit : number | null,
    requestedby: number,
}
export default PostDataToGetSupportTicketData;