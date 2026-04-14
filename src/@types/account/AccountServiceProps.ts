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
  isAddedToInvoiceDraft: boolean;
  isActive: boolean;
  createdBy: string;
  createdOn: string;
};

export default AccountServiceProps;
