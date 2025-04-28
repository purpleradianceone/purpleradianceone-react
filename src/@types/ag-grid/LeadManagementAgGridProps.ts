/* eslint-disable @typescript-eslint/no-explicit-any */
import LeadDataProps from "../lead-management/LeadProps";

type LeadManagementAgGridProps = {
    leads?: LeadDataProps[],
    // handleSelectedLeadChange?: (lead: Lead) => void,
    // handleIdIsMeetingsModalOpen: (isOpen: boolean) => void,
    // handleIsEditLeadFormOpen: (isOpen: boolean) => void,
    onRowSelect : (data :LeadDataProps | any ) =>void,
    handleLeadDataFormChange : (data: LeadDataProps) => void,
    handleRowClick : (event : any) => void;
}

export default LeadManagementAgGridProps;