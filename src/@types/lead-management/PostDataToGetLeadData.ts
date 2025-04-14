type PostDataToGetLeadData ={
    company_id: number,
    company_user_id : number | null,
    lead_source_id : number | null,
    lead_status_id : number | null,
    search_company_specific_date_range_id  : number | null,
    search_parameter : string | null,
    search_parameter_date : string | null,
    offset : number | null,
    limit : number | null,
    requestedby: number,
}
export default PostDataToGetLeadData;