type LeadContactType = {
    id: number ,
    leadId : number,
    name : string ,
    email : string ,
    mobileNumber : string ,
    address : string,
    jobTitle : string ,
    preferredCommunicationChannel: string,
    preferredLanguage : string,
    linkedinProfile : string,
    socialMediaHandles : string,
    isPrimary : boolean ,
    isActive : boolean ,
    createdOn : string,
    updatedOn : string ,
    createdBy : string ,
    updatedBy : string ,
}

export default LeadContactType;