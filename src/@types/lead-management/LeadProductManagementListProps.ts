import PaginationDataProps from "../ag-grid/PaginationDataProps";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import { Product } from "../products/ProductsManagementProps";
import InterestType from "./InterestType";
import LeadAssignedCompanyProduct from "./LeadAssignedCompanyProduct";

type LeadProductsManagementListProps = {
    products: Product[];
    paginationData: PaginationDataProps;
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    // handleSelectedProductChange :(product: number[]) =>void;
    interestTypeData : InterestType[],
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   handleProductCheckboxChange: (params:any , event: React.ChangeEvent<HTMLInputElement>) => void;
//    preservedSelectedProductIdArray: number[],
   alreadyAssignedCompanyProduct : LeadAssignedCompanyProduct[],
}
 
export default LeadProductsManagementListProps;
