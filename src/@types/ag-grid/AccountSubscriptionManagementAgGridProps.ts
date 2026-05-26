/* eslint-disable @typescript-eslint/no-explicit-any */
import AccountServiceProps from "../account/AccountServiceProps";
import AccountSubscriptionProps from "../account/AccountSubscriptionProps";

type AccountSubscriptionManagementGridProps = {
  accountSubscriptions?: AccountSubscriptionProps[];

  onRowSelect: (data: AccountServiceProps | any) => void;
  handleAddToInvoice: (data: AccountSubscriptionProps | any) => void;

  handleAccountSubscriptionDataFormChange: (data: AccountSubscriptionProps) => void;

  handleRowClick: (event: any) => void;
  isUsedInAccountSubscriptionModule: boolean;

  isUsedInSupportTicketModule?: boolean;
};

export default AccountSubscriptionManagementGridProps;
