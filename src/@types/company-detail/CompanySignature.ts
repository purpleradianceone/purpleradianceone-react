export type CompanySignature = {
  id: number;

  company_id: number;

  signatory_name: string;

  signature_file_extension: string;
  signature_origin_url: string;
  signature_cdn_url: string;

  isactive: boolean;

  createdby: string;
  updatedby: string;

  createdon: string;
  updatedon: string;
}

export const isCompanySignatureEqual = (
  obj1?: CompanySignature,
  obj2?: CompanySignature
): boolean => {

  if (!obj1 || !obj2) return false;

  return Object.keys(obj1).every((key) => {
    return obj1[key as keyof CompanySignature] ===
           obj2[key as keyof CompanySignature];
  });
};