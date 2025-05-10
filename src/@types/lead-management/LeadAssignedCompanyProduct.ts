type LeadAssignedCompanyProduct = {
    id: number;
    lead_id: number;
    leadName: string;
    companyProductId: number;
    companyProductName: string;
    leadinterestId: number;
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