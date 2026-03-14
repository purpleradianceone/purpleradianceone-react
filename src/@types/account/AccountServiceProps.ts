type AccountServiceProps = {
  id: number;
  companyId: number;
  accountServiceCode: number;
  accountId: number;
  accountName: string;
  companyProductId: number;
  companyProductName: string;
  serviceDateTime: string;
  serviceStatusId: number;
  serviceStatus: string;
  isActive: boolean;
  createdBy: string;
  createdOn: string;
};

export default AccountServiceProps;
