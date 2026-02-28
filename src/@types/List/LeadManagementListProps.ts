/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import CompanyUser from "../company-users/CompanyUser";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import LeadDataProps from "../lead-management/LeadProps";
import PostDataTypeForLeadSourceAndStatusAndStates from "../lead-management/PostDataTypeForLeadSourceAndStatusAndStates";

type HandleLeadSelectedSource ={
  handleLeadSelectedSource:   (selectedValue: number | undefined) => void;
  selectedLeadSource : number | null
}
type HandleLeadSelectedStutas ={
  handleLeadSelectedStatus:   (selectedValue: number | undefined) => void;
  selectedLeadStatus : number | null
}
type OnStartDateChange ={
  handleStartDateChange: (date: Date) => void,
  // startDate? : string 
}

type OnEndDateChange ={
  handleEndDateChange: (date: Date) => void,
  // endDate? : string 
}
type LeadManagementListProps = {
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: OnStartDateChange;
    onEndDateChange: OnEndDateChange;
    leadData : LeadDataProps[];
    handleAddLead : () => void;
    paginationData: PaginationDataWithoutCountProps;
    persistedSelectedUserId : number | null;
    handleSelectedCompanyUserCheckBoxChange: ( params: CompanyUser | null) => void;
    selectedLeadOwner : CompanyUser;
    leadStatus : PostDataTypeForLeadSourceAndStatusAndStates[];
    leadSource : PostDataTypeForLeadSourceAndStatusAndStates[];
    handleLeadSelectedStatus : HandleLeadSelectedStutas,
    handleLeadSelectedSource : HandleLeadSelectedSource
    isUsedInLeadModule : boolean,
    handleRowSelectedForShowAccountLead? : (rowData: LeadDataProps | any) => void;
}

export default LeadManagementListProps;