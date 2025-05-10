type LeadDataProps = {
    count : number ,
    id : number ,
    companyId : number ,
    companyUserId : number ,
    leadOwner : string ,
    leadStatus : string ,
    leadSource : string ,
    leadSourceId : number,
    leadStatusId : number ,
    name? : string  ,
    email? : string , 
    mobileNumber? : string ,
    createdBy : string ,
    createdOn : string ,
}
export default LeadDataProps;