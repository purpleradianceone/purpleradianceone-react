import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import StockAgeing from "./StockAgeing";

type StockAgeingListProps = {
  stockAgeing: StockAgeing[];
  paginationData: PaginationDataWithoutCountProps;
};

export default StockAgeingListProps;
