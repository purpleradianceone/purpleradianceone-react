import Lead from "../lead-management/LeadManagementProps";
import LeadDataProps from "../lead-management/LeadProps";

type LeadManagementAgGridProps = {
    leads?: LeadDataProps[],
        userHasAccessToViewLead? : boolean,
        userHasAccessToUpdateLead? : boolean,
        handleSelectedLeadChange? : (lead: Lead) => void,
         handleIdIsEditModalOpen? : (isOpen : boolean)=> void ,
}

export default LeadManagementAgGridProps;