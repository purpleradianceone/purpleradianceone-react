/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import { LookupAccount } from "../lookup/LookupAccount";
import LookupCompanyProduct from "../lookup/LookupCompanyProduct";
import CompanyProductSaleProps from "../products/CompanyProductSaleProps";

type CompanyProductSaleManagementListProps = {
    handleSearchOption: HandleSearchOptionProps & {
    [key: string]: any;
  };
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date) => void;
    companyProductSoldData : CompanyProductSaleProps[];
    paginationData: PaginationDataWithoutCountProps;

    handleSelectedAccountChange : (params: LookupAccount | null) => void;

    handleSelectedCompanyProductChange: ( params: LookupCompanyProduct | null) => void;

    handleSelectedProductTypeChange : (params: number  | undefined) => void;
   
    isUsedInProductSaleModule : boolean,
    handleRowSelect? : (rowData: CompanyProductSaleProps | any) => void;
    isDataLoading:boolean
}

export default CompanyProductSaleManagementListProps;