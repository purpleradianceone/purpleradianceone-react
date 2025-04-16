import Lead from "../lead-management/LeadManagementProps";
import LeadDataProps from "../lead-management/LeadProps";

type LeadManagementAgGridProps = {
    leads?: LeadDataProps[],
        handleSelectedLeadChange? : (lead: Lead) => void,
         handleIdIsMeetingsModalOpen : (isOpen : boolean)=> void ,
}

export default LeadManagementAgGridProps;