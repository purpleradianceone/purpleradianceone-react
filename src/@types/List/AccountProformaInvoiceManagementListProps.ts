/* eslint-disable @typescript-eslint/no-explicit-any */
import Account from "../account/Account";
import AccountProformaInvoiceProps from "../account/AccountProformaInvoiceProps";
import PostDataTypeForInvoiceStatus from "../invoice/PostDataTypeForInvoiceStatus";

type AccountProformaInvoiceManagementListProps = {
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
  handleAddProformaInvoice: () => void;
  invoiceData: AccountProformaInvoiceProps[];
  account: Account;
  invoiceStatus?: PostDataTypeForInvoiceStatus[];
  handleSelectedInvoiceStatus: (selectedPriority: number | undefined) => void;
  isUsedForSidebar?: boolean;
};

export default AccountProformaInvoiceManagementListProps;
