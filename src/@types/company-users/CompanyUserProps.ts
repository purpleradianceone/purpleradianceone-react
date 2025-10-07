 type CompanyUsersSearchProps = {
  company_id: number;
  count : number,
  fullname: string;
  email: string;
  mobilenumber: string;
  isactive: boolean;
  id:number,
  createdby: string,
  createdon : string,
  updatedby ?: string,
  updatedon? : string,
  password?: string,
  all_leads_visible? :boolean;
};

export default CompanyUsersSearchProps;


// "count": 99,
// "id": 105,
// "company_id": 1,
// "fullname": "Krishna Bajaj",
// "email": "krishna.bajaj@example.com",
// "mobilenumber": "+918877665552",
// "isactive": true,
// "createdby": "PurpleRadiance Pvt LTD",
// "createdon": "Mar 07, 2025"