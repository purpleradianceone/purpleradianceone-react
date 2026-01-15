import { LookupLead } from "../lookup/LookupLead";

export type LookupLeadsAgGridProps ={
     leads?: LookupLead[],
    onRowSelect : (data :LookupLead | any ) =>void,
    // handleLeadDataFormChange : (data: LeadDataProps) => void,
    // handleRowClick : (event : any) => void;
} 