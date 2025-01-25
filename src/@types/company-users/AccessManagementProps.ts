export type AccessManagementProps = {
    add : boolean
  company_user_id : number
  createdon : string
  crm_module_id : number
  id : number
  module_name: string
  update : boolean
  updatedby : number
  updatedby_user : string
  view : boolean
}

export type AccessManagementContextProps = {
    accessModules :AccessManagementProps[] ;
    setAccessModules : (loginStatusState: AccessManagementProps[]) => void;

};

