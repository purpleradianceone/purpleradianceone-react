/* eslint-disable @typescript-eslint/no-explicit-any */

type EmailTemplate = {
  count: number;
  id: number;
  company_id: number;
  email_type_id: number;
  name: string;
  email_subject: string;
  email_body_html: string;
  email_body_json:any;
  is_master: boolean;
  is_default: boolean;
  isactive: boolean;
  createdby: string;
  createdon: string;
  updatedby: string;
  updatedon: string;
};
export default EmailTemplate;