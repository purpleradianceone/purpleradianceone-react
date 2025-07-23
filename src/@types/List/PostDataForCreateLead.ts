type PostDataForCreateLead = {
    name : string | null;
    email : string | null;
    company_id: number;
    ownerid: number;
    mobilenumber : string | null;
    lead_source_id : number | null;
    lead_status_id : number | null;
    createdby_id: number ;
}

export default PostDataForCreateLead;