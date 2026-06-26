export type CompanyDetail = {

  id: number;

  company_id: number;

  industry_type_id: number;
  industry_type_name: string;

  business_type_id: number;
  business_type_name: string;

  state_id: number;
  state_name: string;

  district_id: number;
  district_name: string;

  pan: string;
  gst: string;
  tan: string;
  cin: string;

  business_registration_number: string;

  billing_address: string;
  shipping_address: string;
  registered_office_address: string;

  website: string;

  logo_file_extension: string;
  logo_origin_url: string;
  logo_cdn_url: string;

  isactive: boolean;

  createdby: string;
  updatedby: string;

  createdon: string;
  updatedon: string;
}

export const isCompanyDetailEqual = (
  obj1?: CompanyDetail,
  obj2?: CompanyDetail
): boolean => {

  if (!obj1 || !obj2) return false;

  return Object.keys(obj1).every((key) => {
    return obj1[key as keyof CompanyDetail] ===
           obj2[key as keyof CompanyDetail];
  });
};