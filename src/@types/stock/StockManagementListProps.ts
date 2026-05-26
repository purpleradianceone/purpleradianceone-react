import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import LiveStockForCompanyProduct from "./LiveStockForCompanyProduct";

type StockManagementListProps = {
    searchParameter: string;
    liveStockForCompanyProduct: LiveStockForCompanyProduct[],
    paginationData: PaginationDataWithoutCountProps;
    handleSearchParameterChange: (value: string) => void;
    isDataLoading : boolean
}

export default StockManagementListProps;