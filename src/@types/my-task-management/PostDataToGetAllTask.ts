 type PostDataToGetAllTask = {
    company_id: number;
    id: number | null;
    task_priority_id: number | null;
    task_stage_id: number | null;
    source: string | null;
    search_company_specific_date_range_id: number | null;
    search_parameter: string | null;
    search_parameter_date: string | null;
    offset: number | null;
    limit: number | null;
    requestedby_id: number;
};

export default PostDataToGetAllTask;
