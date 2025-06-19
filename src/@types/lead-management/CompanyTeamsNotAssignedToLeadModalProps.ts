

type CompanyTeamsNotAssignedToLeadModalProps = {
    isOpen: boolean;
    onClose: () => void;
    // companyProduct: Product;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectedLeadData: any;
    getLeadAssignedCompanyteam : () => void;
}

export default CompanyTeamsNotAssignedToLeadModalProps;