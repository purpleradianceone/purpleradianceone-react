import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import LiveStock from "./LiveStock";

type WareHouseStockListProps = {
    warehouseStock: LiveStock[],
    paginationData: PaginationDataWithoutCountProps;
    searchParameter: string;
    handleSearchParameterChange: (value: string) => void;
}
export default WareHouseStockListProps;