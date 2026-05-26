/* eslint-disable @typescript-eslint/no-explicit-any */
import SupportTicketProps from "../support-ticket-management/SupportTicketProps";

type SupportTicketManagementAgGridProps = {
    supportTickets?: SupportTicketProps[],
    onRowSelect : (data :SupportTicketProps | any ) =>void,
    handleSupportTicketDataFormChange : (data: SupportTicketProps) => void,
    handleRowClick : (event : any) => void;
    isUsedInSupportTicketModule : boolean
    isDataLoading : boolean
}

export default SupportTicketManagementAgGridProps;