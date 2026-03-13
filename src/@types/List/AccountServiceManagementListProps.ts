/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import AccountServiceProps from "../account/AccountServiceProps";
import ServiceStatus from "../account/ServiceStatus";
import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import LookupCompanyProduct from "../lookup/LookupCompanyProduct";

type AccountServiceManagementListProps = {
  handleSearchOption: HandleSearchOptionProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  accountServiceData: AccountServiceProps[];

  handleAddAccountService: () => void;

  paginationData: PaginationDataWithoutCountProps;

  handleSelectedCompanyProductCheckBoxChange: (
    params: LookupCompanyProduct | null,
  ) => void;
  selectedCompanyProduct: LookupCompanyProduct;

  serviceStatusId: ServiceStatus[];
  handleServiceStatusId: (selectedValue: number | undefined) => void;

  handleRowSelectedForShowAccountService?: (
    rowData: AccountServiceProps | any,
  ) => void;

  accountId?: number;
};

export default AccountServiceManagementListProps;
