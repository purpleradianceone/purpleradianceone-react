type LeadAssignedCompanyProduct = {
    id: number;
    leadId: number;
    leadName: string;
    companyProductId: number;
    companyProductName: string;
    leadInterestId: number;
    leadInterestName: string;
    quantityRequired: number;
    costExpected: number;
    isActive: boolean;
    createdBy: string;
    updatedBy: string,
    createdOn: string,
    updatedOn: string,

}
export default LeadAssignedCompanyProduct;