
export type ManageCompanyProps={
    status?:boolean,
    message?:string
}
  
export type ManageCompanyUserContextProps = {
 
    companyUserAddedStatus : ManageCompanyProps;
    setcompanyUserAddedStatus : (companyUserAddedStatusState: ManageCompanyProps) => void;

};