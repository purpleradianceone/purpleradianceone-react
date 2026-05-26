/* Account Invoice Item data structure */

type CompanyInvoiceItemProps = {
  id: number;
  companyId: number;
  companyInvoiceId: number;
  companyProductId: number;
  companyProductName: string;
  accountCompanyProductId?: number;
  accountServiceId?: number;
  accountSubscriptionId?: number;
  hsn?: string;
  sac?: string;
  quantity: number;
  rate: number;
  basicValue: number;
  discountPercent: number;
  discountAmount: number;
  taxableValue: number;
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
  cessPercent: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  totalTax: number;
  totalAmount: number;
  isActive: boolean;
  createdBy: string;
  updatedBy?: string;
  createdOn: string;
  updatedOn?: string;
};

export default CompanyInvoiceItemProps;
