/* eslint-disable @typescript-eslint/no-explicit-any */
import PaginationDataProps from "../ag-grid/PaginationDataProps";
import CompanyUser from "../company-users/CompanyUser";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import LeadDataProps from "../lead-management/LeadProps";
import PostDataTypeForLeadSourceAndStatusAndStates from "../lead-management/PostDataTypeForLeadSourceAndStatusAndStates";

type LeadManagementListProps = {
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    leadData : LeadDataProps[];
    handleAddLead : () => void;
    paginationData: PaginationDataProps;
    persistedSelectedUserId : number | null;
    handleSelectedCompanyUserCheckBoxChange: ( params: CompanyUser | null) => void;
    selectedLeadOwner : CompanyUser;
    leadStatus : PostDataTypeForLeadSourceAndStatusAndStates[];
    leadSource : PostDataTypeForLeadSourceAndStatusAndStates[];
    handleLeadSelectedStatus : (selectedValue: number | undefined) => void;
    handleLeadSelectedSource : (selectedValue: number | undefined) => void;
    isUsedInLeadModule : boolean,
    handleRowSelectedForShowAccountLead? : (rowData: LeadDataProps | any) => void;
}

export default LeadManagementListProps;