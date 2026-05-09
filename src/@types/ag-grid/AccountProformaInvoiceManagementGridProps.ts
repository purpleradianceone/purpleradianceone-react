/* eslint-disable @typescript-eslint/no-explicit-any */

import AccountProformaInvoiceProps from "../account/AccountProformaInvoiceProps";

type AccountProformaInvoiceManagementGridProps = {
  proformaInvoices: AccountProformaInvoiceProps[];
  onRowSelect?: (data: AccountProformaInvoiceProps) => void;
  onDeleteInvoice?: (data: AccountProformaInvoiceProps) => void;
  onDownloadInvoice?: (data: AccountProformaInvoiceProps) => void;
  handleRowClick?: (event: any) => void;
  isUsedInInvoiceModule?: boolean;
  gridLoading?: boolean;
};

export default AccountProformaInvoiceManagementGridProps;
