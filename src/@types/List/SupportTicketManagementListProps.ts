/* eslint-disable @typescript-eslint/no-explicit-any */
import PaginationDataProps from "../ag-grid/PaginationDataProps";
import CompanyUser from "../company-users/CompanyUser";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import PostDataTypeForLeadSourceAndStatusAndStates from "../lead-management/PostDataTypeForLeadSourceAndStatusAndStates";
import { Product } from "../products/ProductsManagementProps";
import SupportTicketProps from "../support-ticket-management/SupportTicketProps";

type SupportTicketManagementListProps = {
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    supportTicketData : SupportTicketProps[];
    handleAddSupportTicket : () => void;
    paginationData: PaginationDataProps;


    selectedAssignTo : CompanyUser;
    handleSelectedAssignToCheckBoxChange: ( params: CompanyUser | null) => void;


    selectedResolvedBy: CompanyUser;
    handleSelectedResolvedByCheckBoxChange:  ( params: CompanyUser | null) => void;


    handleSelectedCompanyProductCheckBoxChange: ( params: Product | null) => void;
    selectedCompanyProduct : Product;
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