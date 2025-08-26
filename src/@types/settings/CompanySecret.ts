type CompanySecret = {
    id : number;
    companyId : number;
    companyFormID : number;
    companyFormName :string;
    secretCode : string;
    allowedDomains : string[];
    createdBy : string;
    createdOn : string;
    updatedBy : string;
    updatedOn : string;
}

export default CompanySecret;