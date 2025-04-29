type CreateOrUpdateLeadDetails = {
    id?: number,
    lead_id? : number,
    company_id: number ,
    country_id: number | null,
    district_id: number | null,
    state_id: number | null,
    address: string | null,
    industry_type_id: number,
    industry_name: string | null,
    job_title: string | null,
    website: string | null
    additional_contact_number: string | number
    createdby?: number ,
    updatedby ?: number 

}
export default CreateOrUpdateLeadDetails;