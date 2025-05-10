import { LeadProductsManagementGridState } from "../../components/modals/leads/product-selection-modal/ProductManagementAgGridLead";
import PaginationDataProps from "../ag-grid/PaginationDataProps";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import { Product } from "../products/ProductsManagementProps";
import InterestType from "./InterestType";

type LeadProductsManagementListProps = {
    products: Product[];
    paginationData: PaginationDataProps;
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    // handleSelectedProductChange :(product: number[]) =>void;
    interestTypeData : InterestType[],
   handleProductCheckboxChange: (params:LeadProductsManagementGridState , event: React.ChangeEvent<HTMLInputElement>) => void;
   preservedSelectedProductIdArray: number[],
}
 
export default LeadProductsManagementListProps;
