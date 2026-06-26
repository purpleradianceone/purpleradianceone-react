type AccountSubscriptionProps = {
  id: number;
  companyId: number;
  accountSubscriptionCode: number;
  accountId: number;
  accountName: string;
  companyProductId: number;
  companyProductName: string;
  startDate: string;
  endDate: string;
  packageDetail: string;
  isRenewal: boolean;
  isAddedToInvoiceDraft: boolean;
  isActive: boolean;
  totalCost?: number | string;
  createdBy: string;
  createdOn: string;
};

export default AccountSubscriptionProps;
