import LeadDataProps from "../lead-management/LeadProps";
import { LookupLead } from "../lookup/LookupLead";

export type LookupLeadsAgGridProps ={
     leads?: LookupLead[],
    onRowSelect : (data :LeadDataProps | any ) =>void,
    // handleLeadDataFormChange : (data: LeadDataProps) => void,
    // handleRowClick : (event : any) => void;
} 