import { LookupAccount } from "../lookup/LookupAccount";

export type LookupAccountAgGridProps ={
     accounts: LookupAccount[],
    onRowSelect : (data :LookupAccount  ) =>void,
    isDataLoading :boolean
    // handleLeadDataFormChange : (data: LeadDataProps) => void,
    // handleRowClick : (event : any) => void;
} 