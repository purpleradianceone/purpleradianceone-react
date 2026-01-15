import { LookupAccount } from "../lookup/LookupAccount";

export type LookupAccountAgGridProps ={
     accounts: LookupAccount[],
    onRowSelect : (data :LookupAccount  ) =>void,
    // handleLeadDataFormChange : (data: LeadDataProps) => void,
    // handleRowClick : (event : any) => void;
} 