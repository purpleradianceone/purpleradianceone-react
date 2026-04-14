/* eslint-disable @typescript-eslint/no-explicit-any */
import AccountServiceProps from "../account/AccountServiceProps";

type AccountServiceManagementGridProps = {
  accountServices?: AccountServiceProps[];
  onRowSelect: (data: AccountServiceProps | any) => void;
  handleAccountServiceDataFormChange: (data: AccountServiceProps) => void;
  handleAddToInvoice: (data: AccountServiceProps) => void;
  handleRowClick: (event: any) => void;
  isUsedInAccountServiceModule: boolean;
  isUsedInSupportTicketModule?: boolean;
};

export default AccountServiceManagementGridProps;
