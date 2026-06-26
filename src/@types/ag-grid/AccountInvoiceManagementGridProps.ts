/* eslint-disable @typescript-eslint/no-explicit-any */
import AccountInvoiceProps from "../account/AccountInvoiceProps";

type AccountInvoiceManagementGridProps = {
  invoices: AccountInvoiceProps[];

  onRowSelect?: (data: AccountInvoiceProps) => void;
  onDeleteInvoice?: (data: AccountInvoiceProps) => void;
  onDownloadInvoice?: (data: AccountInvoiceProps) => void;
  handleRowClick?: (event: any) => void;

  isUsedInInvoiceModule?: boolean;
  isDataLoading?: boolean;
};

export default AccountInvoiceManagementGridProps;
