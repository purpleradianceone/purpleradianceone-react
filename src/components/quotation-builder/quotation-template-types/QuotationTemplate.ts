type QuotationTemplate = {
  id: number;
  company_id: number;
  name: string;
  description: string;
  json_file_extension: string;
  json_origin_url: string;
  json_cdn_url: string;
  isactive: boolean;
  createdby: string;
  updatedby: string;
  createdon: string;
  updatedon: string;
};
export default QuotationTemplate;