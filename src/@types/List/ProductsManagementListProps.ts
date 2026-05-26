import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import { Product } from "../products/ProductsManagementProps";

type ProductsManagementListProps = {
    products: Product[];
    paginationData: PaginationDataWithoutCountProps;
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    handleProductChangeOnAdd?: () => void;
    handleEditProductChange?: () => void;
    handleCreateCompanyProductTax? : () => void;
    isGridForAccountProduct? :boolean ,
     onRowSelect? : (data : Product ) =>void,
     isDataLoading : boolean
    // isListForProductUser : boolean;
}
 
export default ProductsManagementListProps;
