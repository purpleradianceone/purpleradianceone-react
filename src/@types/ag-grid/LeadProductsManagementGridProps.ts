// import { LeadProductsManagementGridState } from './../../components/modals/leads/product-selection-modal/ProductManagementAgGridLead';
import InterestType from "../lead-management/InterestType";
import LeadAssignedCompanyProduct from "../lead-management/LeadAssignedCompanyProduct";
import { Product } from "../products/ProductsManagementProps";

type LeadProductsManagementGridProps = {
    products: Product[];
      // handleSelectedProductChange: (product: number[]) => void;
      interestTypeData : InterestType[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleProductCheckboxChange?: (params:any , event: React.ChangeEvent<HTMLInputElement>) => void;      alreadyAssignedCompanyProduct : LeadAssignedCompanyProduct[]
}

export default LeadProductsManagementGridProps;