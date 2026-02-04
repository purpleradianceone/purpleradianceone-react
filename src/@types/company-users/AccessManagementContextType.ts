export type AccessManagementType = {
  company_id : number,
  company_user_id : number,
  crm_module_id : number,
  id : number,
  
  module_name: string,
  is_base_module: boolean,
  parent_module_id: number,

  add : boolean,
  view : boolean
  update : boolean,

  createdby : number,
  createdon : string,
  updatedby : number,
  updatedby_user : string,
  updatedon : string,
}


export type AccessManagementContextProps = {
    accessModules :AccessManagementType[] ;
    setAccessModules : (loginStatusState: AccessManagementType[]) => void;
};

