import Lead from "../lead-management/LeadManagementProps";

type LeadManagementAgGridProps = {
    leads?: Lead[],
        userHasAccessToViewLead? : boolean,
        userHasAccessToUpdateLead? : boolean,
        handleSelectedLeadChange? : (lead: Lead) => void,
         handleIdIsEditModalOpen? : (isOpen : boolean)=> void ,
}

export default LeadManagementAgGridProps;