
type CompanyQuotationProps = {
  id: number,
  quotationStatusId: number,
  quotationStatusName: string,
  quotationTypeId: number,
  quotationTypeName: string,
  otherId: number,
  quotationTemplateId: number,
  quotationNumber: string,
  otherDetail: string,
  quotationDate: string,
  validTillDate: string,
  basicValue: number,
  discountAmount: number,
  taxableValue: number,
  totalTax: number,
  totalAmount: number,
  adjustmentForRoundOff: number,
  companyQuotationFileExtension: string,
  companyQuotationOriginUrl: string,
  companyQuotationCdnUrl: string,
  templateSnapshot: Record<string, string | null>,
  isActive: boolean;
  createdBy: string;
  createdOn: string;
  updatedBy?: string;
  updatedOn?: string;
};

export default CompanyQuotationProps;
