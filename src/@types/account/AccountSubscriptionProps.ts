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
  isActive: boolean;
  createdBy: string;
  createdOn: string;
};

export default AccountSubscriptionProps;