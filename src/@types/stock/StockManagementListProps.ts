import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import LiveStockForCompanyProduct from "./LiveStockForCompanyProduct";

type StockManagementListProps = {
    handleSearchOption: HandleSearchOptionProps;
    liveStockForCompanyProduct: LiveStockForCompanyProduct[],
    paginationData: PaginationDataWithoutCountProps;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
}

export default StockManagementListProps;