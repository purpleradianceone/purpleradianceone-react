/* eslint-disable @typescript-eslint/no-explicit-any */
import AccountInvoiceProps from "../account/AccountInvoiceProps";

type AccountInvoiceManagementGridProps = {
  invoices: AccountInvoiceProps[];

  onRowSelect?: (data: AccountInvoiceProps) => void;
  onDeleteInvoice?: (data: AccountInvoiceProps) => void;

  handleRowClick?: (event: any) => void;

  isUsedInInvoiceModule?: boolean;
};

export default AccountInvoiceManagementGridProps;
