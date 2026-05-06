/* eslint-disable @typescript-eslint/no-explicit-any */
import CompanyQuotationProps from "../company-quotation/CompanyQuotationProps";
import PostDataTypeForInvoiceStatus from "../invoice/PostDataTypeForInvoiceStatus";

export const enum Modules {
  QUOTATION_MODULE="QUOTATION_MODULE",
  LEAD_QUOTATION = "LEAD_QUOTATION",
  AMC_QUOTATION = "AMC_QUOTATION",
}

type CompanyQuotationManagementListProps = {
  handleSearchOption: any;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  paginationData: {
    pageSize: number;
    currentPage: number;
    currentPageData: any;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  handleAddQuotation: () => void;
  quotaionData: CompanyQuotationProps[];
  otherData: any;
  quotationStatus?: PostDataTypeForInvoiceStatus[];
  handleSelectedQuotationStatus: (selectedPriority: number | undefined) => void;
  isUsedFor?: Modules;
  leadStatusId?: number;
};

export default CompanyQuotationManagementListProps;
