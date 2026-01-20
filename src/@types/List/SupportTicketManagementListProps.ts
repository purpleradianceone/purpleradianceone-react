/* eslint-disable @typescript-eslint/no-explicit-any */
import PaginationDataWithoutCountProps from "../ag-grid/PaginationDataWithoutCountProps";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import PostDataTypeForLeadSourceAndStatusAndStates from "../lead-management/PostDataTypeForLeadSourceAndStatusAndStates";
import LookupCompanyProduct from "../lookup/LookupCompanyProduct";
import LookupCompanyUser from "../lookup/LookupCompanyUser";
import SupportTicketProps from "../support-ticket-management/SupportTicketProps";

type SupportTicketManagementListProps = {
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    supportTicketData : SupportTicketProps[];
    handleAddSupportTicket : () => void;
    paginationData: PaginationDataWithoutCountProps;


    selectedAssignTo : LookupCompanyUser;
    handleSelectedAssignToCheckBoxChange: ( params: LookupCompanyUser | null) => void;


    selectedResolvedBy: LookupCompanyUser;
    handleSelectedResolvedByCheckBoxChange:  ( params: LookupCompanyUser | null) => void;


    handleSelectedCompanyProductCheckBoxChange: ( params: LookupCompanyProduct | null) => void;
    selectedCompanyProduct : LookupCompanyProduct;
    supportTicketCategory :  PostDataTypeForLeadSourceAndStatusAndStates[];
    supportTicketLifecycle : PostDataTypeForLeadSourceAndStatusAndStates[];
    supportTicketSource : PostDataTypeForLeadSourceAndStatusAndStates[];
    handleSupportSelectedCategory : (selectedValue: number | undefined) => void;
    handleSupportSelectedLifecycle : (selectedValue: number | undefined) => void;
    handleSupportSelectedSource : (selectedValue: number | undefined) => void;
    isUsedInSupportTicketModule : boolean,
    handleRowSelectedForShowSupportTicket? : (rowData: SupportTicketProps | any) => void;
}

export default SupportTicketManagementListProps;