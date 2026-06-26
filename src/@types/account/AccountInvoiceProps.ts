/* Account Invoice data structure */

type AccountInvoiceProps = {
  id: number;
  companyId: number;
  accountId: number;
  accountName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: string; // PAID | PENDING | OVERDUE
  statusId: number; // 1: DRAFT, 2: SUBMITTED, 3: CANCELLED
  billingAddress?: string;
  shippingAddress?: string;
  termAndConditions?: string;
  remarks?: string;
  basicValue: number;
  discountAmount: number;
  taxableValue: number;
  totalTax: number;
  totalAmount: number;
  adjustmentForRoundOff?: number;
  isActive: boolean;
  createdBy: number;
  createdOn: string;
  updatedBy?: number;
  updatedOn?: string;
};

export default AccountInvoiceProps;
