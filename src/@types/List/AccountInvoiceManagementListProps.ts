/* eslint-disable @typescript-eslint/no-explicit-any */
import Account from "../account/Account";
import AccountInvoiceProps from "../account/AccountInvoiceProps";
import PostDataTypeForInvoiceStatus from "../invoice/PostDataTypeForInvoiceStatus";

type AccountInvoiceManagementListProps = {
  handleSearchOption: any;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  paginationData: {
    pageSize: number;
    currentPage: number;
    currentPageData: any;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  handleAddInvoice: () => void;
  invoiceData: AccountInvoiceProps[];
  account: Account;
  invoiceStatus?: PostDataTypeForInvoiceStatus[];
  handleSelectedInvoiceStatus: (selectedPriority: number | undefined) => void;
  isUsedForSidebar?: boolean;
  gridLoading: boolean;
  isNavigateFrom?: string;
};

export default AccountInvoiceManagementListProps;
