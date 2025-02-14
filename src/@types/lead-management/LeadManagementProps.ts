type LeadManagementProps = {
    leads?: Lead[],
    userHasAccessToViewLead? : boolean,
    userHasAccessToUpdateLead? : boolean,
    handleSelectedLeadChange? : (lead: Lead) => void,
     handleIdIsEditModalOpen? : (isOpen : boolean)=> void ,
}

type Lead = {
    id?: number,
    name: string,
    email: string,
    phone: string,
    message : string,
    status: string,
    createdOn?: string,
    updatedOn?: string,
    createdBy? : string,
    updatedBy? : string,
    platform? : string,
}

export default LeadManagementProps;