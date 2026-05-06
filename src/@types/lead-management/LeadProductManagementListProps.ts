import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import { Product } from "../products/ProductsManagementProps";
import InterestType from "./InterestType";
import LeadAssignedCompanyProduct from "./LeadAssignedCompanyProduct";

type LeadProductsManagementListProps = {
    products: Product[];
    paginationData: PaginationDataWithoutCountProps;
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    // handleSelectedProductChange :(product: number[]) =>void;
    interestTypeData : InterestType[],
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   handleProductCheckboxChange: (params:any , event: React.ChangeEvent<HTMLInputElement>) => void;
//    preservedSelectedProductIdArray: number[],
   alreadyAssignedCompanyProduct : LeadAssignedCompanyProduct[],
   isDataLoading: boolean
}
 
export default LeadProductsManagementListProps;
