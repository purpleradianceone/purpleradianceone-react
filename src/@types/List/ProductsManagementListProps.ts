import PaginationDataProps from "../ag-grid/PaginationDataProps";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import { Product } from "../products/ProductsManagementProps";

type ProductsManagementListProps = {
    products: Product[];
    paginationData: PaginationDataProps;
    handleSearchOption: HandleSearchOptionProps;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    handleProductChangeOnAdd?: () => void;
    handleEditProductChange?: () => void;
    handleCreateCompanyProductTax? : () => void;
    isGridForAccountProduct? :boolean ,
     onRowSelect? : (data : Product ) =>void,
    // isListForProductUser : boolean;
}
 
export default ProductsManagementListProps;
