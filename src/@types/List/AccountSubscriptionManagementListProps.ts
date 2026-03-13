/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginationDataWithoutCountProps } from "../../components/ag-grid/PaginationWithoutCount";
import AccountSubscriptionProps from "../account/AccountSubscriptionProps";

import HandleSearchOptionProps from "../company-users/HandleSearchOptionProps";
import LookupCompanyProduct from "../lookup/LookupCompanyProduct";

type AccountSubscriptionManagementListProps = {
  handleSearchOption: HandleSearchOptionProps;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  accountSubscriptionData: AccountSubscriptionProps[];

  handleAddAccountSubscritption: () => void;

  paginationData: PaginationDataWithoutCountProps;

  handleSelectedCompanyProductCheckBoxChange: (
    params: LookupCompanyProduct | null,
  ) => void;
  
  selectedCompanyProduct: LookupCompanyProduct;

  
  handleRowSelectedForShowAccountSubscription?: (
    rowData: AccountSubscriptionProps | any,
  ) => void;

  accountId?: number;
};

export default AccountSubscriptionManagementListProps;
