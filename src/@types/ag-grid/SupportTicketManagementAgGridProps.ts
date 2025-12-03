/* eslint-disable @typescript-eslint/no-explicit-any */
import SupportTicketProps from "../support-ticket-management/SupportTicketProps";

type SupportTicketManagementAgGridProps = {
    supportTickets?: SupportTicketProps[],
    // handleSelectedLeadChange?: (lead: Lead) => void,
    // handleIdIsMeetingsModalOpen: (isOpen: boolean) => void,
    // handleIsEditLeadFormOpen: (isOpen: boolean) => void,
    onRowSelect : (data :SupportTicketProps | any ) =>void,
    handleSupportTicketDataFormChange : (data: SupportTicketProps) => void,
    handleRowClick : (event : any) => void;
    isUsedInSupportTicketModule : boolean
}

export default SupportTicketManagementAgGridProps;