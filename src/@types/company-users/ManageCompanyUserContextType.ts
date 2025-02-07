
export type ManageCompanyType={
    status?:boolean,
    message?:string
}
  
export type ManageCompanyUserContextProps = {
 
    companyUserAddedStatus : ManageCompanyType;
    setcompanyUserAddedStatus : (companyUserAddedStatusState: ManageCompanyType) => void;

};