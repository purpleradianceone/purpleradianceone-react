export type AccessManagementType = {
  add : boolean,
  company_id : number,
  company_user_id : number,
  createdby : number,
  createdon : string,
  crm_module_id : number,
  id : number,
  module_name: string,
  update : boolean,
  updatedby : number,
  updatedby_user : string,
  updatedon : string,
  view : boolean
}

// add
// company_id
// company_user_id
// createdby
// createdon
// crm_module_id
// id
// module_name
// update
// updatedby
// updatedby_user
// updatedon
// view

export type AccessManagementContextProps = {
    accessModules :AccessManagementType[] ;
    setAccessModules : (loginStatusState: AccessManagementType[]) => void;
};

