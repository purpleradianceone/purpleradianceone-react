import { LeadProductsManagementGridState } from "../../components/modals/leads/product-selection-modal/ProductManagementAgGridLead";
import InterestType from "../lead-management/InterestType";
import { Product } from "../products/ProductsManagementProps";

type LeadProductsManagementGridProps = {
    products: Product[];
      // handleSelectedProductChange: (product: number[]) => void;
      interestTypeData : InterestType[];
      handleProductCheckboxChange?: (params:LeadProductsManagementGridState , event: React.ChangeEvent<HTMLInputElement>) => void;
      preservedSelectedProductIdArray? : number[];
}

export default LeadProductsManagementGridProps;