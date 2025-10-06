type  CompanyUser = {
    company_id: number,
    id : number,
    fullname: string,
    email: string,
    mobilenumber: string,
    createdby: string,
    isactive: boolean,
    requestedby: string,
    generate_password: string,
    all_leads_visible? : boolean;
  };

  export default CompanyUser;