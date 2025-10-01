export interface AccountImportDataType {
  id:number,  
  company_id: number;
  company_account_type_id: number[];
  company_account_type_name: string;
  import_tag: string;
  name: string;
  email: string;
  mobilenumber: string;
  industry_type_id: number;
  industry_type_name:string;
  business_type_id: number;
  business_type_name: string;
  country_id:number;
  country_name: string;
  state_id:number;
  state_name: string;
  district_id:number;
  district_name: string;
  pan: string;
  gst: string;
  tan: string;
  billing_address: string;
  shipping_address: string;
  registered_office_address: string;
  business_registration_number: string;
  website: string;
  account_created_on: string;
  createdon:string;
  createdby_name:string;
  updatedon:string;
  updatedby_name:string;
  createdby: number;
}