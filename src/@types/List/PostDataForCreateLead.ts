type PostDataForCreateLead = {
    name : string | null;
    email : string | null;
    company_id: number;
    company_user_id: number;
    mobilenumber : string | null;
    lead_source_id : number | null;
    lead_status_id : number | null;
    createdby: number ;
}

export default PostDataForCreateLead;