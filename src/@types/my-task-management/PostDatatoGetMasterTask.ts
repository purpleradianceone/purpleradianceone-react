type PostDataToGetMasterTask = {
    company_id: number;
    id: number | null;
    search_company_specific_date_range_id: number | null;
    limit: number;
    offset: number;
    search_parameter: string | null;
    search_parameter_date: string | null;
    requestedby_id: number;
    general_task_priority_id: number | null;
    general_task_type_id: number | null;
    frequency_id: number | null;
    assignedto: number | null;
    isactive: boolean | null;
};
export default PostDataToGetMasterTask;